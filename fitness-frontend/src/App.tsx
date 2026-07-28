import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./theme/theme-provider";
import { KeycloakProvider } from "./context/KeycloakContext";
import { AppRoutes } from "./routes/AppRoutes";
import { Toaster } from "sonner";

export default function App() {
  return (
    <ThemeProvider>
      <KeycloakProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster
            position="top-right"
            richColors
            toastOptions={{
              style: {
                borderRadius: "14px",
                fontSize: "12px",
              },
            }}
          />
        </BrowserRouter>
      </KeycloakProvider>
    </ThemeProvider>
  );
}
