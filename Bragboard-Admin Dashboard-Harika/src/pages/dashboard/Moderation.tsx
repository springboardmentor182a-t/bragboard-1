import { DataTable } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Moderation() {
  const pendingShoutouts = [
    { id: 1, author: "John Doe", content: "Great job on the presentation!", time: "5 min ago", status: "Pending" },
    { id: 2, author: "Jane Smith", content: "Team collaboration was amazing", time: "15 min ago", status: "Pending" },
  ];

  const approvedShoutouts = [
    { id: 3, author: "Mike Johnson", content: "Excellent customer service", time: "1 hour ago", status: "Approved" },
  ];

  const rejectedShoutouts = [
    { id: 4, author: "Sarah Wilson", content: "Inappropriate content example", time: "2 hours ago", status: "Rejected" },
  ];

  const columns = [
    { key: "author", label: "Author" },
    { key: "content", label: "Content" },
    { key: "time", label: "Time" },
    { key: "status", label: "Status" },
  ];

  const enhanceData = (data: any[], statusType: string) =>
    data.map(item => ({
      ...item,
      status: (
        <Badge 
          variant={
            statusType === "Pending" ? "secondary" : 
            statusType === "Approved" ? "default" : 
            "destructive"
          }
        >
          {item.status}
        </Badge>
      ),
    }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Shout-out Moderation</h1>
        <p className="text-muted-foreground">Review and moderate user-submitted shout-outs</p>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pendingShoutouts.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedShoutouts.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedShoutouts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <DataTable
            columns={columns}
            data={enhanceData(pendingShoutouts, "Pending")}
            actions={() => (
              <div className="flex gap-2 justify-end">
                <Button variant="default" size="sm">Approve</Button>
                <Button variant="destructive" size="sm">Reject</Button>
              </div>
            )}
          />
        </TabsContent>

        <TabsContent value="approved">
          <DataTable
            columns={columns}
            data={enhanceData(approvedShoutouts, "Approved")}
            actions={() => (
              <Button variant="outline" size="sm">View Details</Button>
            )}
          />
        </TabsContent>

        <TabsContent value="rejected">
          <DataTable
            columns={columns}
            data={enhanceData(rejectedShoutouts, "Rejected")}
            actions={() => (
              <Button variant="outline" size="sm">Review Again</Button>
            )}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
