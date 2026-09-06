import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function ForbiddenPage() {
  return (
    <div className="container grid min-h-[60vh] place-items-center text-center">
      <div>
        <h1 className="text-3xl font-semibold">Staff access required</h1>
        <p className="mt-2 text-muted-foreground">This account does not have dashboard access.</p>
        <Button asChild className="mt-6">
          <Link to="/">Return home</Link>
        </Button>
      </div>
    </div>
  );
}
