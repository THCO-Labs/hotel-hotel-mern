import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ApiError } from "@/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { routes } from "@/config/app-config";
import { useAuth } from "@/features/auth/auth.context";

/**
 * Only same-origin absolute paths may come back from `?next=`, so a crafted
 * link cannot turn the sign-in redirect into an open redirect. Ported from
 * `safeNext` in the old server action.
 */
function safeNext(value: string | undefined, fallback: string): string {
  const next = value ?? "";
  return next.startsWith("/") && !next.startsWith("//") ? next : fallback;
}

export function LoginForm({ next }: { next?: string }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const registerParams = new URLSearchParams();
  if (next) registerParams.set("next", next);
  const registerHref = `${routes.auth.register}${registerParams.size ? `?${registerParams}` : ""}`;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      const profile = await login({ email, password });
      // Guests land on their account, staff and admins on the dashboard.
      const fallback = profile.role === "guest" ? routes.account.root : routes.dashboard.root;
      navigate(safeNext(next, fallback), { replace: true });
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : "Invalid email or password");
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </div>
      {error && <p className="text-destructive text-sm">{error}</p>}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
      <p className="text-muted-foreground text-center text-sm">
        New guest?{" "}
        <Link className="text-primary font-medium hover:underline" to={registerHref}>
          Create an account
        </Link>
      </p>
      <p className="text-muted-foreground text-center text-xs">
        Staff demo: staff@hotel.app / password123
      </p>
    </form>
  );
}
