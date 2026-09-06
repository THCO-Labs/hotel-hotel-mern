import { Card, CardContent } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div data-builder-id="dashboard.settings">
      <h1 className="text-3xl font-semibold">Settings</h1>
      <p className="mt-2 text-muted-foreground">
        Template-wide configuration lives in client/src/config/app-config.ts.
      </p>
      <Card className="mt-8">
        <CardContent className="p-6 text-sm text-muted-foreground">
          Brand, routes, currency, guest limits, and payment behavior are centralized for safe AI-builder
          customization.
        </CardContent>
      </Card>
    </div>
  );
}
