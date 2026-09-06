import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="container grid min-h-[60vh] place-items-center text-center">
      <div>
        <p className="text-sm font-semibold text-primary">404</p>
        <h1 className="mt-3 text-4xl font-bold">That page took a different trail</h1>
        <p className="mt-3 text-muted-foreground">The page you requested could not be found.</p>
        <Button asChild className="mt-6">
          <Link to="/">Return home</Link>
        </Button>
      </div>
    </div>
  );
}
