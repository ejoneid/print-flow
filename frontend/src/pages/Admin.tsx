import { Button } from "@/components/ui/button";
import { UserTable } from "@/components/UserTable";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" size="sm">
            <ArrowLeft size={60} />
            <Link to="/">Back to Queue</Link>
          </Button>
        </div>
        <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
        <p className="text-muted-foreground">Manage users</p>
      </header>

      <UserTable />
    </div>
  );
}
