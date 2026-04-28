import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useAdminAuth } from "../hooks/useAdminAuth";
import { isSupabaseConfigured } from "../lib/supabase";

function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, isLoading, signIn } = useAdminAuth();
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
      setStatus(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section-shell flex min-h-[72vh] items-center justify-center pb-16 pt-32">
      <form className="section-frame w-full max-w-[28rem] rounded-[1.6rem] p-6 sm:p-7" onSubmit={handleSubmit}>
        <span className="eyebrow">Private admin</span>
        <h1 className="mt-4 text-[2rem] font-bold leading-none tracking-[-0.055em] text-text">
          Masuk ke dashboard.
        </h1>
        <p className="mt-4 text-[0.95rem] leading-7 text-muted">
          Akses CRUD portfolio hanya tersedia untuk akun admin yang terdaftar.
        </p>

        {!isSupabaseConfigured ? (
          <p className="mt-5 rounded-[1rem] border border-line bg-surface px-4 py-3 text-[0.9rem] leading-6 text-muted">
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
            <span>Password</span>
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
          {isSubmitting ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-bg/50 border-t-bg" />
          ) : (
            <LogIn className="h-4 w-4" />
          )}
          Login
        </button>
      </form>
    </section>
  );
}

export default AdminLoginPage;
