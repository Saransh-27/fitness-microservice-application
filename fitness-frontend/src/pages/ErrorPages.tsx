import { Link } from "react-router-dom";
import { ArrowLeft, Dumbbell, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-background">
      <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
        <Dumbbell className="w-8 h-8" />
      </div>
      <h1 className="text-6xl font-black text-purple-600 mb-2">404</h1>
      <h2 className="text-xl font-bold mb-2">Telemetry Node Not Found</h2>
      <p className="text-xs text-muted-foreground max-w-sm mb-6">
        The route or telemetry resource you requested does not exist on this API Gateway route.
      </p>
      <Button asChild className="gap-2">
        <Link to="/dashboard">
          <ArrowLeft className="w-4 h-4" /> Return to Dashboard
        </Link>
      </Button>
    </div>
  );
}

export function ForbiddenPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-background">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h1 className="text-6xl font-black text-red-500 mb-2">403</h1>
      <h2 className="text-xl font-bold mb-2">Access Control Denied</h2>
      <p className="text-xs text-muted-foreground max-w-sm mb-6">
        You lack required Keycloak ADMIN authority roles to access this microservice portal.
      </p>
      <Button asChild variant="outline" className="gap-2">
        <Link to="/dashboard">
          <ArrowLeft className="w-4 h-4" /> Back to Safety
        </Link>
      </Button>
    </div>
  );
}
