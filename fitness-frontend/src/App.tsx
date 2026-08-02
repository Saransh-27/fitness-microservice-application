import { BrowserRouter } from "react-router-dom";
import { KeycloakProvider } from "./context/KeycloakContext";
import { AppRoutes } from "./routes/AppRoutes";
import { Toaster } from "sonner";

export default function App() {
  return (
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
  );
}
