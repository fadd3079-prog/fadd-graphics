import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

type AdminAuthState = {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  error: string;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshAdminStatus: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthState | null>(null);

async function checkIsAdmin(userId: string) {
  if (!supabase) {
    return false;
  }

  const { data, error } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return Boolean(data);
}

function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState("");
  const verifiedAdminUserIdRef = useRef<string | null>(null);
  const authRequestIdRef = useRef(0);
  const isAdminRef = useRef(false);

  useEffect(() => {
    isAdminRef.current = isAdmin;
  }, [isAdmin]);

  const refreshAdminStatus = useCallback(async () => {
    if (!supabase) {
      setIsLoading(false);
      setIsAdmin(false);
      verifiedAdminUserIdRef.current = null;
      return;
    }

    setIsLoading(true);
    const { data } = await supabase.auth.getSession();
    const nextSession = data.session;
    const nextUserId = nextSession?.user.id ?? null;

    if (!nextUserId) {
      verifiedAdminUserIdRef.current = null;
      setSession(null);
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    if (verifiedAdminUserIdRef.current === nextUserId && isAdminRef.current) {
      setSession(nextSession);
      setIsLoading(false);
      return;
    }

    const nextIsAdmin = await checkIsAdmin(nextUserId);

    setSession(nextSession);
    setIsAdmin(nextIsAdmin);
    verifiedAdminUserIdRef.current = nextIsAdmin ? nextUserId : null;
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return undefined;
    }

    let isMounted = true;

    async function initializeSession() {
      try {
        await refreshAdminStatus();
      } catch (authError) {
        if (isMounted) {
          setError(authError instanceof Error ? authError.message : "Admin session could not be loaded.");
          setIsLoading(false);
        }
      }
    }

    initializeSession();
    const { data } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!isMounted) {
        return;
      }

      if (event === "SIGNED_OUT") {
        authRequestIdRef.current += 1;
        verifiedAdminUserIdRef.current = null;
        setSession(null);
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      if (!nextSession?.user) {
        authRequestIdRef.current += 1;
        verifiedAdminUserIdRef.current = null;
        setSession(null);
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      if (verifiedAdminUserIdRef.current === nextSession.user.id && isAdminRef.current) {
        setSession(nextSession);
        setIsLoading(false);
        return;
      }

      const authRequestId = authRequestIdRef.current + 1;

      authRequestIdRef.current = authRequestId;
      setSession(nextSession);
      setIsAdmin(false);
      setIsLoading(true);

      void checkIsAdmin(nextSession.user.id)
        .then((nextIsAdmin) => {
          if (!isMounted || authRequestIdRef.current !== authRequestId) {
            return;
          }

          setIsAdmin(nextIsAdmin);
          verifiedAdminUserIdRef.current = nextIsAdmin ? nextSession.user.id : null;
        })
        .catch((authError) => {
          if (!isMounted || authRequestIdRef.current !== authRequestId) {
            return;
          }

          setError(authError instanceof Error ? authError.message : "Admin access could not be verified.");
          setIsAdmin(false);
          verifiedAdminUserIdRef.current = null;
        })
        .finally(() => {
          if (isMounted && authRequestIdRef.current === authRequestId) {
            setIsLoading(false);
          }
        });
    });

    return () => {
      isMounted = false;
      data.subscription.unsubscribe();
    };
  }, [refreshAdminStatus]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) {
      throw new Error("Supabase environment variables are not configured.");
    }

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      throw signInError;
    }

    const nextIsAdmin = data.user ? await checkIsAdmin(data.user.id) : false;

    if (!nextIsAdmin) {
      await supabase.auth.signOut();
      throw new Error("This account is not registered as an admin.");
    }

    verifiedAdminUserIdRef.current = data.user?.id ?? null;
    setSession(data.session);
    setIsAdmin(true);
    setIsLoading(false);
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    authRequestIdRef.current += 1;
    verifiedAdminUserIdRef.current = null;
    setSession(null);
    setIsAdmin(false);
    setIsLoading(false);
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      isAdmin,
      isLoading,
      error,
      signIn,
      signOut,
      refreshAdminStatus,
    }),
    [error, isAdmin, isLoading, refreshAdminStatus, session, signIn, signOut],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

function useAdminAuth() {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }

  return context;
}

export { AdminAuthProvider, useAdminAuth };
