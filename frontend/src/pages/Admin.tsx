import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserTable } from "@/components/UserTable";
import { Link } from "react-router-dom";

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/">Back to Queue</Link>
          </Button>
        </div>
        <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
        <p className="text-muted-foreground">Manage print requests and users</p>
      </header>

      <Tabs defaultValue="prints" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="prints">Print Queue</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        {/*<TabsContent value="prints" className="mt-6">
          <AdminPrintQueue />
        </TabsContent>
*/}
        <TabsContent value="users" className="mt-6">
          <UserTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
