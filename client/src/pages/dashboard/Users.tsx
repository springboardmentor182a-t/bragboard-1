import { useState } from "react";
import { DataTable } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface User {
  id: number;
  name: string;
  email: string;
  status: string;
  joinDate: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "John Doe", email: "john@example.com", status: "Active", joinDate: "2024-01-15" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", status: "Active", joinDate: "2024-02-20" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", status: "Suspended", joinDate: "2024-03-10" },
  ]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({ name: "", email: "" });
  const [searchQuery, setSearchQuery] = useState("");

  // Add User Handler
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      toast.error("Please fill in all fields");
      return;
    }
    const user: User = {
      id: users.length + 1,
      name: newUser.name,
      email: newUser.email,
      status: "Active",
      joinDate: new Date().toISOString().split('T')[0],
    };
    setUsers([user, ...users]);
    setNewUser({ name: "", email: "" });
    setIsAddOpen(false);
    toast.success("User added successfully");
  };

  // Edit User Handler
  const handleEditUser = () => {
    if (!currentUser) return;
    setUsers(users.map(u => u.id === currentUser.id ? currentUser : u));
    setIsEditOpen(false);
    toast.success("User details updated");
  };

  // Suspend (Delete) User Handler
  const handleSuspendUser = (id: number) => {
    setUsers(users.filter(u => u.id !== id));
    toast.warning("User removed from the list");
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "status", label: "Status" },
    { key: "joinDate", label: "Join Date" },
  ];

  // Filter users based on search query
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const enhancedUsers = filteredUsers.map(user => ({
    ...user,
    status: (
      <Badge variant={user.status === "Active" ? "default" : "destructive"}>
        {user.status}
      </Badge>
    ),
  }));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage and monitor user accounts</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          Add New User
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search users..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <DataTable
        columns={columns}
        data={enhancedUsers}
        actions={(row) => {
          const user = users.find(u => u.name === row.name && u.email === row.email);
          return (
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (user) {
                    setCurrentUser(user);
                    setIsEditOpen(true);
                  }
                }}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => user && handleSuspendUser(user.id)}
              >
                Suspend
              </Button>
            </div>
          )
        }}
      />

      {/* Add User Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAddUser}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {currentUser && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={currentUser.name}
                  onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={currentUser.email}
                  onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleEditUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


