import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { appConfig } from "@/config/app-config";
import { AuthProvider } from "@/features/auth/auth.context";
import { AppRouter } from "@/router";
import "./index.css";

// index.html ships the template's own title. The generated brand owns it at
// runtime, so a rebranded app does not keep the template name in the tab.
document.title = appConfig.name;

const container = document.getElementById("root");
if (!container) throw new Error("Missing #root element in index.html");

createRoot(container).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRouter />
          <Toaster richColors />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
