import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ApiError } from "@/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { routes } from "@/config/app-config";
import { useAuth } from "@/features/auth/auth.context";

/** Same open-redirect guard the sign-in form applies to `?next=`. */
function safeNext(value: string | undefined, fallback: string): string {
  const next = value ?? "";
  return next.startsWith("/") && !next.startsWith("//") ? next : fallback;
}

export function RegisterForm({ next }: { next?: string }) {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [pending, setPending] = useState(false);

  const loginParams = new URLSearchParams();
  if (next) loginParams.set("next", next);
  const loginHref = `${routes.auth.login}${loginParams.size ? `?${loginParams}` : ""}`;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setFieldErrors({});
    setPending(true);
    try {
      await register({ email, password, confirmPassword });
      // Registration always creates a guest, so the account page is the fallback.
      navigate(safeNext(next, routes.account.root), { replace: true });
    } catch (cause) {
      if (cause instanceof ApiError) {
        setError(cause.message);
        setFieldErrors(cause.fieldErrors ?? {});
      } else {
        setError("Unable to create your account. Please try again.");
      }
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
        {fieldErrors.email?.[0] && <p className="text-destructive text-sm">{fieldErrors.email[0]}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        {fieldErrors.password?.[0] && <p className="text-destructive text-sm">{fieldErrors.password[0]}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          minLength={8}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
        />
        {fieldErrors.confirmPassword?.[0] && (
          <p className="text-destructive text-sm">{fieldErrors.confirmPassword[0]}</p>
        )}
      </div>
      {error && <p className="text-destructive text-sm">{error}</p>}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Creating account…" : "Create account"}
      </Button>
      <p className="text-muted-foreground text-center text-sm">
        Already registered?{" "}
        <Link className="text-primary font-medium hover:underline" to={loginHref}>
          Sign in
        </Link>
      </p>
    </form>
  );
}
