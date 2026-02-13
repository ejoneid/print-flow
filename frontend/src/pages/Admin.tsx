import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserTable } from "@/components/UserTable";
import { PrinterStatusCard } from "@/components/PrinterStatusCard";
import { ArrowLeft, Users, Printer, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { QUERIES } from "@/queries";

export default function AdminPage() {
  const { data: printerStatus, isLoading, error } = useQuery(QUERIES.printerStatus);

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
        <p className="text-muted-foreground">Manage users and printers</p>
      </header>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>User Management</span>
          </TabsTrigger>
          <TabsTrigger value="printer" className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            <span>Printer</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UserTable />
        </TabsContent>

        <TabsContent value="printer">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Loading printer status...</p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Printer className="h-16 w-16 mb-4 text-red-500/50" />
              <h2 className="text-2xl font-semibold mb-2 text-red-500">Unable to Load Printer Status</h2>
              <p className="text-muted-foreground max-w-md">
                Could not connect to the printer. Please check the connection and try again.
              </p>
            </div>
          )}

          {printerStatus && <PrinterStatusCard status={printerStatus} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}
