import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { kyClient, queryClient } from "@/queryClient";
import { getFirstAndLastInitials } from "@/utils/stringUtils";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import type { UUID } from "crypto";
import { ChevronLeft, ChevronRight, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import {
  USER_ROLES,
  type PrintFlowUserInfo,
  type UserRole,
  type UserUpdate,
} from "shared/browser";

const ITEMS_PER_PAGE = 10;

const roleColors: Record<UserRole, string> = {
  ADMIN: "bg-red-100 text-red-800",
  USER: "bg-blue-100 text-blue-800",
};

export function UserTable() {
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => kyClient("/api/users").json<PrintFlowUserInfo[]>(),
  });
  const { mutate } = useMutation({
    mutationFn: ({
      userUuid,
      userUpdate,
    }: {
      userUuid: UUID;
      userUpdate: UserUpdate;
    }) =>
      kyClient(`/api/users/${userUuid}`, {
        method: "PATCH",
        body: JSON.stringify(userUpdate),
      }).json<PrintFlowUserInfo>(),
    onSuccess: (data) => {
      queryClient.setQueryData<PrintFlowUserInfo[]>(["users"], (oldData) => {
        if (!oldData) return [data];
        return oldData.map((user) =>
          user.userUuid === data.userUuid ? data : user,
        );
      });
    },
  });
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = users.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const updateUserRoles = (userUuid: UUID, newRoles: UserRole[]) => {
    mutate({ userUuid, userUpdate: { roles: newRoles } });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Roles</TableHead>
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
                    <TableRow key={user.userUuid}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={user.avatar}
                              alt={user.fullName}
                            />
                            <AvatarFallback className="text-xs">
                              {getFirstAndLastInitials(user.fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <p className="font-medium text-sm">{user.fullName}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{user.email}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2 items-center">
                          {user.roles.sort().map((role) => (
                            <Badge
                              variant="outline"
                              className={`${roleColors[role]} flex items-center gap-0 pr-0`}
                              key={role}
                            >
                              {role}
                              <Button
                                onClick={() => {
                                  updateUserRoles(
                                    user.userUuid,
                                    user.roles.filter((r) => r !== role),
                                  );
                                }}
                                className="h-1 w-1 bg-inherit hover:bg-inherit hover:cursor-pointer hover:opacity-70 text-inherit"
                                title="Remove role"
                              >
                                <X className="p-0" />
                              </Button>
                            </Badge>
                          ))}
                          <AddRoleDropdown
                            user={user}
                            onUpdateRoles={updateUserRoles}
                          />
                        </div>
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

type AddRoleDropdownProps = {
  user: PrintFlowUserInfo;
  onUpdateRoles: (userUuid: UUID, roles: UserRole[]) => void;
};

function AddRoleDropdown({ user, onUpdateRoles }: AddRoleDropdownProps) {
  const availableRolesToAdd = USER_ROLES.filter(
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
              onUpdateRoles(user.userUuid, [...user.roles, role]);
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
