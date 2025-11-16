import { useState } from "react";
import { Trash2, ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type UserRole = "admin" | "moderator" | "user";

type User = {
  id: string;
  name: string;
  email: string;
  roles: UserRole[];
  joinDate: string;
  status: "active" | "inactive";
  avatar: string;
};

const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    roles: ["admin"],
    joinDate: "2023-01-15",
    status: "active",
    avatar: "/placeholder.svg",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    roles: ["moderator", "user"],
    joinDate: "2023-02-20",
    status: "active",
    avatar: "/placeholder.svg",
  },
  {
    id: "3",
    name: "Alex Johnson",
    email: "alex@example.com",
    roles: ["user"],
    joinDate: "2023-03-10",
    status: "active",
    avatar: "/placeholder.svg",
  },
  {
    id: "4",
    name: "Sam Wilson",
    email: "sam@example.com",
    roles: ["user"],
    joinDate: "2023-04-05",
    status: "inactive",
    avatar: "/placeholder.svg",
  },
  {
    id: "5",
    name: "Taylor Swift",
    email: "taylor@example.com",
    roles: ["moderator"],
    joinDate: "2023-05-12",
    status: "active",
    avatar: "/placeholder.svg",
  },
  {
    id: "6",
    name: "Jordan Lee",
    email: "jordan@example.com",
    roles: ["user"],
    joinDate: "2023-06-08",
    status: "active",
    avatar: "/placeholder.svg",
  },
  {
    id: "7",
    name: "Casey Chen",
    email: "casey@example.com",
    roles: ["admin"],
    joinDate: "2023-07-22",
    status: "active",
    avatar: "/placeholder.svg",
  },
  {
    id: "8",
    name: "Morgan Brown",
    email: "morgan@example.com",
    roles: ["user"],
    joinDate: "2023-08-14",
    status: "active",
    avatar: "/placeholder.svg",
  },
];

const ITEMS_PER_PAGE = 5;
const AVAILABLE_ROLES: UserRole[] = ["user", "moderator", "admin"];

export function UserTable() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = users.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const updateUserRoles = (userId: string, newRoles: UserRole[]) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, roles: newRoles } : user,
      ),
    );
  };

  const deleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId));
    if (paginatedUsers.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "moderator":
        return "bg-purple-100 text-purple-800";
      case "user":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Table Header */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={user.avatar || "/placeholder.svg"}
                              alt={user.name}
                            />
                            <AvatarFallback className="text-xs">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <p className="font-medium text-sm">{user.name}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{user.email}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2 items-center">
                          {user.roles.map((role) => (
                            <Badge
                              variant="outline"
                              className={`${getRoleColor(role)} flex items-center gap-1 pr-1`}
                              key={role}
                            >
                              {role}
                              <button
                                onClick={() => {
                                  updateUserRoles(
                                    user.id,
                                    user.roles.filter((r) => r !== role),
                                  );
                                }}
                                className="hover:opacity-70 transition-opacity ml-1"
                                title="Remove role"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                          <AddRoleDropdown
                            user={user}
                            onUpdateRoles={updateUserRoles}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.status === "active" ? "default" : "secondary"
                          }
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteUser(user.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

type RoleDropdownProps = {
  user: User;
  onUpdateRoles: (userId: string, roles: UserRole[]) => void;
};

function RoleDropdown({ user, onUpdateRoles }: RoleDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-1" />
          Roles
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1.5 text-sm font-semibold">Assign Roles</div>
        <DropdownMenuSeparator />
        {AVAILABLE_ROLES.map((role) => (
          <DropdownMenuCheckboxItem
            key={role}
            checked={user.roles.includes(role)}
            onCheckedChange={(checked) => {
              if (checked) {
                onUpdateRoles(user.id, [...user.roles, role]);
              } else {
                onUpdateRoles(
                  user.id,
                  user.roles.filter((r) => r !== role),
                );
              }
            }}
            className="cursor-pointer"
          >
            <span className="capitalize">{role}</span>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type AddRoleDropdownProps = {
  user: User;
  onUpdateRoles: (userId: string, roles: UserRole[]) => void;
};

function AddRoleDropdown({ user, onUpdateRoles }: AddRoleDropdownProps) {
  const availableRolesToAdd = AVAILABLE_ROLES.filter(
    (role) => !user.roles.includes(role),
  );

  if (availableRolesToAdd.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="h-6 w-6 p-0"
          title="Add role"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <div className="px-2 py-1.5 text-sm font-semibold">Add Role</div>
        <DropdownMenuSeparator />
        {availableRolesToAdd.map((role) => (
          <DropdownMenuItem
            key={role}
            onClick={() => {
              onUpdateRoles(user.id, [...user.roles, role]);
            }}
            className="cursor-pointer capitalize"
          >
            {role}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
