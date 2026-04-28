import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
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

  const refreshAdminStatus = useCallback(async () => {
    if (!supabase) {
      setIsLoading(false);
      setIsAdmin(false);
      return;
    }

    const { data } = await supabase.auth.getSession();
    const nextSession = data.session;

    setSession(nextSession);
    setIsAdmin(nextSession?.user ? await checkIsAdmin(nextSession.user.id) : false);
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

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) {
        return;
      }

      setSession(nextSession);
      setIsLoading(true);

      if (!nextSession?.user) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      checkIsAdmin(nextSession.user.id)
        .then((nextIsAdmin) => {
          if (isMounted) {
            setIsAdmin(nextIsAdmin);
            setIsLoading(false);
          }
        })
        .catch((authError) => {
          if (isMounted) {
            setError(authError instanceof Error ? authError.message : "Admin access could not be verified.");
            setIsAdmin(false);
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

    setSession(data.session);
    setIsAdmin(true);
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    setSession(null);
    setIsAdmin(false);
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
