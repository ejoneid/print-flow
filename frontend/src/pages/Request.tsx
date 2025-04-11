import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PrintRequestFormCreate } from "@/components/PrintRequestForm/PrintRequestFormCreate.tsx";

export function RequestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" size="sm">
            <ArrowLeft size={60} />
            <Link to="/">Back to Queue</Link>
          </Button>
        </div>
        <h1 className="text-3xl font-bold mb-2">Request a 3D Print</h1>
        <p className="text-muted-foreground">Fill out the form below to submit a new print request</p>
      </header>

      <main>
        <PrintRequestFormCreate />
      </main>
    </div>
  );
}
