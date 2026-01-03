import { useState } from "react";
import { DataTable } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Shoutout {
  id: number;
  author: string;
  content: string;
  time: string;
  status: "Pending" | "Approved" | "Rejected";
}

export default function Moderation() {
  const [shoutouts, setShoutouts] = useState<Shoutout[]>([
    { id: 1, author: "John Doe", content: "Great job on the presentation! The slides were very clear and the delivery was engaging.", time: "5 min ago", status: "Pending" },
    { id: 2, author: "Jane Smith", content: "Team collaboration was amazing during the hackathon. Everyone pulled their weight.", time: "15 min ago", status: "Pending" },
    { id: 3, author: "Mike Johnson", content: "Excellent customer service handling the difficult client yesterday.", time: "1 hour ago", status: "Approved" },
    { id: 4, author: "Sarah Wilson", content: "Inappropriate content example that needs to be moderated.", time: "2 hours ago", status: "Rejected" },
  ]);

  const [selectedShoutout, setSelectedShoutout] = useState<Shoutout | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleApprove = (id: number) => {
    setShoutouts(shoutouts.map(s => s.id === id ? { ...s, status: "Approved" } : s));
    toast.success("Shout-out approved");
  };

  const handleReject = (id: number) => {
    setShoutouts(shoutouts.map(s => s.id === id ? { ...s, status: "Rejected" } : s));
    toast.error("Shout-out rejected");
  };

  const handleReviewAgain = (id: number) => {
    setShoutouts(shoutouts.map(s => s.id === id ? { ...s, status: "Pending" } : s));
    toast.info("Moved back to pending review");
  };

  const handleViewDetails = (shoutout: Shoutout) => {
    setSelectedShoutout(shoutout);
    setIsDetailsOpen(true);
  };

  const pendingShoutouts = shoutouts.filter(s => s.status === "Pending");
  const approvedShoutouts = shoutouts.filter(s => s.status === "Approved");
  const rejectedShoutouts = shoutouts.filter(s => s.status === "Rejected");

  const columns = [
    { key: "author", label: "Author" },
    { key: "content", label: "Content" },
    { key: "time", label: "Time" },
    { key: "status", label: "Status" },
  ];

  const enhanceData = (data: Shoutout[], variant: "default" | "secondary" | "destructive") =>
    data.map(item => ({
      ...item,
      status: (
        <Badge variant={variant}>
          {item.status}
        </Badge>
      ),
    }));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Shout-out Moderation</h1>
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
            data={enhanceData(pendingShoutouts, "secondary")}
            actions={(row) => {
              const item = shoutouts.find(s => s.id === row.id);
              return item ? (
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleApprove(item.id)}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleReject(item.id)}
                  >
                    Reject
                  </Button>
                </div>
              ) : null;
            }}
          />
        </TabsContent>

        <TabsContent value="approved">
          <DataTable
            columns={columns}
            data={enhanceData(approvedShoutouts, "default")}
            actions={(row) => {
              const item = shoutouts.find(s => s.id === row.id);
              return item ? (
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(item)}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleReject(item.id)}
                  >
                    Reject
                  </Button>
                </div>
              ) : null;
            }}
          />
        </TabsContent>

        <TabsContent value="rejected">
          <DataTable
            columns={columns}
            data={enhanceData(rejectedShoutouts, "destructive")}
            actions={(row) => {
              const item = shoutouts.find(s => s.id === row.id);
              return item ? (
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReviewAgain(item.id)}
                  >
                    Review Again
                  </Button>
                </div>
              ) : null;
            }}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Shout-out Details</DialogTitle>
            <DialogDescription>
              Full content of the shout-out by {selectedShoutout?.author}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground mb-1">Content</p>
              <p className="text-foreground">{selectedShoutout?.content}</p>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Posted: {selectedShoutout?.time}</span>
              <Badge variant={selectedShoutout?.status === "Approved" ? "default" : "secondary"}>
                {selectedShoutout?.status}
              </Badge>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}


