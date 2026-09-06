import { Leaf } from "lucide-react";
import { Navigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { routes } from "@/config/app-config";
import { useAuth } from "@/features/auth/auth.context";
import { RegisterForm } from "@/features/auth/RegisterForm";

export default function RegisterPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const next = searchParams.get("next") ?? undefined;

  // The old middleware sent signed-in visitors away from the auth pages.
  if (user) {
    return <Navigate to={user.role === "guest" ? routes.account.root : routes.dashboard.root} replace />;
  }

  return (
    <div data-builder-id="auth.register" className="container grid min-h-[70vh] max-w-md place-items-center py-12">
      <Card className="w-full">
        <CardHeader className="text-center">
          <span className="bg-primary text-primary-foreground mx-auto grid size-11 place-items-center rounded-xl">
            <Leaf className="size-5" />
          </span>
          <CardTitle className="mt-3">Create your guest account</CardTitle>
          <p className="text-muted-foreground text-sm">Sign up with your email and a secure password.</p>
        </CardHeader>
        <CardContent>
          <RegisterForm next={next} />
        </CardContent>
      </Card>
    </div>
  );
}
