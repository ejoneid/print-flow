import { useEffect, useState } from "react";
import { queryClient, USER_UUID_HEADER } from "../queryClient.ts";
import { Button } from "@/components/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { User } from "lucide-react";

export const testUsers = {
  default: {
    name: "user",
    uuid: "defaultTestUserUuid",
  },
  user1: {
    name: "admin",
    uuid: "adminUserUuid",
  },
} as const;

export let selectedUserUuid = localStorage.getItem(USER_UUID_HEADER) ?? testUsers.default.uuid;

export const UserSwitcher = () => {
  const [user, setUser] = useState<string>(() => sessionStorage.getItem(USER_UUID_HEADER) ?? testUsers.default.uuid);

  useEffect(() => {
    sessionStorage.setItem(USER_UUID_HEADER, user);
    if (selectedUserUuid !== user) {
      selectedUserUuid = user;
      queryClient.invalidateQueries();
    }
  }, [user]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <User className="size-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>Active user</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={user} onValueChange={setUser}>
          {Object.values(testUsers).map((testUser) => (
            <DropdownMenuRadioItem key={testUser.uuid} value={testUser.uuid}>
              {testUser.name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
