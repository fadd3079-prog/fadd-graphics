import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useAdminAuth } from "../hooks/useAdminAuth";
import { useGlobalLoadingState } from "../hooks/useGlobalLoadingState";
import { useTheme } from "../hooks/useTheme";
import { useUiLoading } from "../components/UiLoadingProvider";
import ThemeToggle from "../components/ThemeToggle";
import { isSupabaseConfigured } from "../lib/supabase";

function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, isLoading, signIn } = useAdminAuth();
  const { theme, toggleTheme } = useTheme();
  const { beginLoading } = useUiLoading();
  useGlobalLoadingState(isLoading);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/admin";

  if (!isLoading && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("");
    setIsSubmitting(true);
    const endLoading = beginLoading();

    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Login gagal.");
    } finally {
      setIsSubmitting(false);
      endLoading();
    }
  };

  return (
    <section className="admin-auth-shell">
      <div className="absolute right-5 top-5 sm:right-8 sm:top-8">
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </div>

      <form className="admin-auth-card" onSubmit={handleSubmit}>
        <div className="mb-7 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-text text-bg">
            <LogIn className="h-5 w-5" />
          </div>
          <div>
            <span className="admin-kicker">Admin privat</span>
            <h1 className="mt-1 text-[1.8rem] font-bold leading-none tracking-[-0.045em] text-text">
              Masuk dashboard
            </h1>
          </div>
        </div>
        <p className="text-[0.94rem] leading-7 text-muted">
          Gunakan akun admin yang terdaftar untuk mengelola portofolio, media, identitas website, profil, dan kontak.
        </p>

        {!isSupabaseConfigured ? (
          <p className="mt-5 rounded-2xl border border-line bg-surface px-4 py-3 text-[0.9rem] leading-6 text-muted">
            Supabase env belum dikonfigurasi. Isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`.
          </p>
        ) : null}

        <div className="mt-6 grid gap-4">
          <label className="space-y-2 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-text">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="input-shell"
              autoComplete="email"
              required
            />
          </label>
          <label className="space-y-2 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-text">
            <span>Kata sandi</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="input-shell"
              autoComplete="current-password"
              required
            />
          </label>
        </div>

        {status ? <p className="mt-4 text-[0.9rem] leading-6 text-accentStrong">{status}</p> : null}

        <button type="submit" className="button-primary mt-6 w-full justify-center" disabled={isSubmitting || !isSupabaseConfigured}>
          <LogIn className="h-4 w-4" />
          Masuk
        </button>
      </form>
    </section>
  );
}

export default AdminLoginPage;
