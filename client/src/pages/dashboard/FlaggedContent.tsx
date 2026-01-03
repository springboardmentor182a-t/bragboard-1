import { useState } from "react";
import { DataTable } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export default function FlaggedContent() {
  const [flaggedItems, setFlaggedItems] = useState([
    {
      id: 1,
      content: "Suspicious activity detected",
      reporter: "John Doe",
      reason: "Spam",
      time: "10 min ago",
      severity: "High"
    },
    {
      id: 2,
      content: "Inappropriate language used",
      reporter: "Jane Smith",
      reason: "Inappropriate",
      time: "30 min ago",
      severity: "Medium"
    },
    {
      id: 3,
      content: "Potential policy violation",
      reporter: "Mike Johnson",
      reason: "Policy Violation",
      time: "1 hour ago",
      severity: "Low"
    },
  ]);

  const handleRemove = (id: number) => {
    setFlaggedItems(flaggedItems.filter(item => item.id !== id));
    toast.success("Content removed successfully");
  };

  const columns = [
    { key: "content", label: "Content" },
    { key: "reporter", label: "Reporter" },
    { key: "reason", label: "Reason" },
    { key: "severity", label: "Severity" },
    { key: "time", label: "Time" },
  ];

  const enhancedData = flaggedItems.map(item => ({
    ...item,
    severity: (
      <Badge
        variant={
          item.severity === "High" ? "destructive" :
            item.severity === "Medium" ? "secondary" :
              "outline"
        }
      >
        {item.severity}
      </Badge>
    ),
  }));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Flagged Content</h1>
          <p className="text-muted-foreground">Review user-reported content and take action</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={enhancedData}
        actions={(row) => (
          <div className="flex gap-2 justify-end">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleRemove(row.id)}
            >
              Remove
            </Button>
          </div>
        )}
      />
    </div>
  );
}


