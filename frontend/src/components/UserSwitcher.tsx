import { useEffect, useState } from "react";
import { queryClient, requestHeaders, USER_UUID_HEADER } from "../queryClient.ts";
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

type TestUser = {
  name: string;
  uuid: string;
};

export const testUsers: Record<string, TestUser> = {
  default: {
    name: "user",
    uuid: "defaultTestUserUuid",
  },
  user1: {
    name: "admin",
    uuid: "adminUserUuid",
  },
};

export const UserSwitcher = () => {
  const [user, setUser] = useState<string>(() => sessionStorage.getItem(USER_UUID_HEADER) ?? testUsers.default.uuid);

  useEffect(() => {
    sessionStorage.setItem(USER_UUID_HEADER, user);
    // @ts-ignore
    const userHeader = requestHeaders.get(USER_UUID_HEADER);
    if (userHeader !== user) {
      requestHeaders.set(USER_UUID_HEADER, user);
      queryClient.invalidateQueries();
    }
  }, [user]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <span className="material-symbols-outlined">person</span>
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
