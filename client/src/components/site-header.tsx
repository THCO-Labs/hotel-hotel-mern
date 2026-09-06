import { Link, useNavigate } from "react-router-dom";
import { LogOut, UserRound } from "lucide-react";
import { appConfig, guestNavItems, routes, siteChrome } from "@/config/app-config";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { isStaff, useAuth } from "@/features/auth/auth.context";
import { BrandMark } from "@/components/brand-mark";

/**
 * Renders on every guest page, so its labels and links live in
 * site-content.json rather than here. Route targets stay in code: a link to a
 * route the router does not serve is a broken page, not a wording choice.
 */
export function SiteHeader() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const labels = siteChrome.header;

  return (
    <header data-builder-id="site.header" className="bg-background/90 sticky top-0 z-40 border-b backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="bg-primary text-primary-foreground grid size-9 place-items-center rounded-xl">
            <BrandMark className="size-7" iconClassName="size-5" />
          </span>
          <span>
            {appConfig.nameParts.lead} <span className="text-primary">{appConfig.nameParts.accent}</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {guestNavItems.map((item) => (
            <Button asChild variant="ghost" key={item.href}>
              <Link to={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          {/* The session arrives after mount, so hold the buttons' space until it settles. */}
          {loading ? (
            <>
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-8 w-20 rounded-md" />
            </>
          ) : user ? (
            <>
              <Button asChild variant="outline" size="sm">
                <Link to={isStaff(user) ? routes.dashboard.root : routes.account.root}>
                  <UserRound className="size-4" />
                  {isStaff(user) ? labels.dashboard : labels.account}
                </Link>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={siteChrome.dashboard.signOut}
                onClick={async () => {
                  await logout();
                  navigate(routes.home);
                }}
              >
                <LogOut className="size-4" />
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to={routes.auth.login}>{labels.signIn}</Link>
              </Button>
              <Button asChild size="sm">
                <Link to={routes.auth.register}>{labels.signUp}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
