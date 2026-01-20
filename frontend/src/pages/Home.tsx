import { AllPrintsView } from "@/components/AllPrintsView.tsx";
import { MyPrintsView } from "@/components/MyPrintsView.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useUser } from "@/hooks/useUser.tsx";
import { Link } from "react-router-dom";

export function HomePage() {
  const { roles, permissions } = useUser();
  const canReadQueue = permissions.includes("read_queue");
  const isAdmin = roles.includes("ADMIN");

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <p className="text-muted-foreground mb-4">View current print requests and their status</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild>
            <Link to="/request">Request a Print</Link>
          </Button>
          {isAdmin && (
            <Button variant="outline" asChild>
              <Link to="/admin">Admin Panel</Link>
            </Button>
          )}
        </div>
      </div>

      {canReadQueue ? <AllPrintsView /> : <MyPrintsView />}
    </div>
  );
}
