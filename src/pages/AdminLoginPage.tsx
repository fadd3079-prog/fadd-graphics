import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Loader2, LogIn, ShieldCheck } from "lucide-react";
import { useAdminAuth } from "../hooks/useAdminAuth";
import { useTheme } from "../hooks/useTheme";
import ThemeToggle from "../components/ThemeToggle";
import { isSupabaseConfigured } from "../lib/supabase";

function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, isLoading, signIn } = useAdminAuth();
  const { theme, toggleTheme } = useTheme();
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

    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Login gagal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="grid min-h-screen bg-bg text-text lg:grid-cols-[minmax(0,0.95fr)_minmax(28rem,0.62fr)]">
      <div className="absolute right-5 top-5 z-10 sm:right-8 sm:top-8">
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </div>

      <div className="hidden border-r border-line bg-card px-10 py-10 lg:flex lg:flex-col lg:justify-between">
        <div>
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-text text-bg">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <p className="mt-5 text-[0.72rem] font-bold uppercase tracking-[0.08em] text-muted">CMS privat</p>
          <h1 className="mt-3 max-w-xl text-[3.35rem] font-black leading-[0.95] tracking-[-0.07em] text-text">
            FADD GRAPHICS Admin
          </h1>
          <p className="mt-5 max-w-lg text-[1rem] leading-7 text-muted">
            Ruang kerja internal untuk mengelola portofolio, media, identitas website, profil, dan kontak publik.
          </p>
        </div>
        <div className="grid max-w-xl gap-3 md:grid-cols-3">
          {["Portofolio", "Media", "Identitas"].map((item) => (
            <div key={item} className="rounded-2xl border border-line bg-surface px-4 py-3">
              <p className="text-[0.76rem] font-bold uppercase tracking-[0.07em] text-muted">{item}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex min-h-screen items-center justify-center px-4 py-20 sm:px-6 lg:px-10">
        <form className="w-full max-w-[28rem] rounded-2xl border border-line bg-card p-5 shadow-edge sm:p-7" onSubmit={handleSubmit}>
          <div className="mb-7 flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-text text-bg">
              <LogIn className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[0.72rem] font-bold uppercase tracking-[0.08em] text-muted">Admin privat</span>
              <h2 className="mt-1 text-[1.65rem] font-black leading-none tracking-[-0.055em] text-text">
                Masuk dashboard
              </h2>
            </div>
          </div>
          <p className="text-[0.94rem] leading-7 text-muted">
            Gunakan akun admin yang terdaftar untuk membuka CMS FADD GRAPHICS.
          </p>

          {!isSupabaseConfigured ? (
            <p className="mt-5 rounded-2xl border border-line bg-surface px-4 py-3 text-[0.9rem] leading-6 text-muted">
              Supabase env belum dikonfigurasi. Isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`.
            </p>
          ) : null}

          <div className="mt-6 grid gap-4">
            <label className="space-y-2 text-[0.76rem] font-bold uppercase tracking-[0.08em] text-text">
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
            <label className="space-y-2 text-[0.76rem] font-bold uppercase tracking-[0.08em] text-text">
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

          {status ? <p className="mt-4 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-[0.9rem] leading-6 text-red-700 dark:text-red-300">{status}</p> : null}

          <button type="submit" className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-text bg-text px-4 py-2 text-[0.86rem] font-bold text-bg transition hover:bg-accent hover:text-white disabled:pointer-events-none disabled:opacity-55" disabled={isSubmitting || !isSupabaseConfigured}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
            Masuk
          </button>
        </form>
      </div>
    </section>
  );
}

export default AdminLoginPage;
