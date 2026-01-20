import paceholderImage from "@public/480x380.svg";
import { CheckCircle, Clock, ExternalLink, Printer, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";
import type { PrintQueueItem as PrintQueueItemType } from "shared/browser";

type PrintQueueItemProps = {
  item: PrintQueueItemType;
};

export function PrintQueueItem({ item }: PrintQueueItemProps) {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    approved: "bg-green-100 text-green-800 hover:bg-green-100",
    printing: "bg-purple-100 text-purple-800 hover:bg-purple-100",
    completed: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    rejected: "bg-red-100 text-red-800 hover:bg-red-100",
  };

  const statusIcons = {
    pending: <Clock className="h-4 w-4 mr-1" />,
    approved: <CheckCircle className="h-4 w-4 mr-1" />,
    printing: <Printer className="h-4 w-4 mr-1" />,
    completed: <CheckCircle className="h-4 w-4 mr-1" />,
    rejected: <XCircle className="h-4 w-4 mr-1" />,
  };

  console.log(item.status);
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
          <div>
            <h3 className="font-semibold text-lg">{item.name}</h3>
            <p className="text-sm text-muted-foreground">Requested by: {item.requester}</p>
          </div>
          <Badge className={statusColors[item.status]} variant="outline">
            {statusIcons[item.status]}
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid sm:grid-cols-[1fr_2fr] gap-4">
          <div>
            <img
              src={item.imageUrl ?? paceholderImage}
              alt={item.name}
              className="relative rounded-md border max-h-60 max-w-[380px] object-contain"
            />
          </div>
          <div className="space-y-2">
            <div>
              <h4 className="text-sm font-medium">Materials:</h4>
              <div className="flex flex-wrap gap-2 mt-1">
                {item.materials.map((material) => (
                  <Badge key={`badge-${material.type}-${material.color}`} variant="secondary">
                    {material.type} - {material.color}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium">Request Date:</h4>
              <p className="text-sm">{item.requestDate}</p>
            </div>

            {item.completionDate && (
              <div>
                <h4 className="text-sm font-medium">Completion Date:</h4>
                <p className="text-sm">{item.completionDate}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2 pt-2">
        <Button size="sm" variant="outline" className="w-full sm:w-auto" asChild>
          <Link to={item.modelLink} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Model
          </Link>
        </Button>
        <Button size="sm" variant="outline" className="w-full sm:w-auto" asChild>
          <Link to={`/print/${item.uuid}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
