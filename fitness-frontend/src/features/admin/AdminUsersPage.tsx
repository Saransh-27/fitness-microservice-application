import { useEffect, useState } from "react";
import { Shield, Trash2, Search, CheckCircle2, User as UserIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { userService } from "@/services/userService";
import type { UserResponse } from "@/types";
import { toast } from "sonner";

export function AdminUsersPage() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data || []);
    } catch (error) {
      console.error("Failed to load users for admin:", error);
      toast.error("Failed to load users from backend API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id: string) => {
    try {
      await userService.deleteUser(id);
      toast.success("User deleted successfully.");
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      toast.error("Failed to delete user.");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.keycloakId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
          <Shield className="w-7 h-7 text-purple-600" /> Admin User Management
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Backend Endpoint: GET /apis/users & DELETE /apis/users/{`{id}`}
        </p>
      </div>

      <Card className="p-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by username, email, or Keycloak ID..."
            className="pl-9 h-10 text-xs"
          />
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold">
            Registered System Users ({filteredUsers.length})
          </CardTitle>
          <CardDescription>
            Managed in PostgreSQL Database `fitness_user_db`
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-xs">
              <UserIcon className="w-8 h-8 mx-auto mb-2 opacity-30 text-purple-500" />
              No user accounts found matching your query.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border/40 text-muted-foreground uppercase font-semibold text-[10px]">
                  <tr>
                    <th className="pb-3 px-2">User Details</th>
                    <th className="pb-3 px-2">Email</th>
                    <th className="pb-3 px-2">Role</th>
                    <th className="pb-3 px-2">Keycloak ID</th>
                    <th className="pb-3 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-muted/40 transition-colors">
                      <td className="py-3 px-2 font-semibold flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-purple-600/10 text-purple-600 flex items-center justify-center font-bold text-xs">
                          {u.frontname?.[0] || u.username?.[0] || "U"}
                        </div>
                        <div>
                          <span className="text-foreground">
                            {u.frontname ? `${u.frontname} ${u.lastname || ""}` : u.username}
                          </span>
                          <span className="text-[10px] text-muted-foreground block">
                            @{u.username}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-2 text-muted-foreground font-mono">
                        {u.email}
                      </td>

                      <td className="py-3 px-2">
                        <Badge
                          variant={u.role === "ADMIN" ? "default" : "outline"}
                          className="text-[10px]"
                        >
                          {u.role || "USER"}
                        </Badge>
                      </td>

                      <td className="py-3 px-2 font-mono text-[10px] text-muted-foreground">
                        {u.keycloakId || "Auto Synced"}
                      </td>

                      <td className="py-3 px-2 text-right">
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
