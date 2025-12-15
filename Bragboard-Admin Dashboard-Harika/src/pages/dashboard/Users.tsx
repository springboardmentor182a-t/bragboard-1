import { DataTable } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Users() {
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", status: "Active", joinDate: "2024-01-15" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", status: "Active", joinDate: "2024-02-20" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", status: "Suspended", joinDate: "2024-03-10" },
  ];

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { 
      key: "status", 
      label: "Status",
    },
    { key: "joinDate", label: "Join Date" },
  ];

  const enhancedUsers = users.map(user => ({
    ...user,
    status: (
      <Badge variant={user.status === "Active" ? "default" : "destructive"}>
        {user.status}
      </Badge>
    ),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground">Manage and monitor user accounts</p>
        </div>
        <Button>Add New User</Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search users..."
          className="pl-10"
        />
      </div>

      <DataTable
        columns={columns}
        data={enhancedUsers}
        actions={(row) => (
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm">Edit</Button>
            <Button variant="destructive" size="sm">Suspend</Button>
          </div>
        )}
      />
    </div>
  );
}
