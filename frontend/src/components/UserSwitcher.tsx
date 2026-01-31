import { useEffect, useState } from "react";
import { queryClient } from "../queryClient.ts";
import { Button } from "@/components/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { Moon, Sun, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "next-themes";

export const USER_UUID_HEADER = "x-print-flow-user-uuid";

export const testUsers = {
  default: {
    name: "user",
    uuid: "019c069d-9d9f-7000-afab-bcd09db382bd",
  },
  user1: {
    name: "admin",
    uuid: "019c069f-66a2-7000-8a8e-d7dbb8491a72",
  },
  guest: {
    name: "guest",
    uuid: "guestUserUuid",
  },
} as const;

export let selectedUser: string = localStorage.getItem(USER_UUID_HEADER) ?? testUsers.default.uuid;

export const UserSwitcher = () => {
  const [user, setUser] = useState<string>(selectedUser);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    localStorage.setItem(USER_UUID_HEADER, user);
    if (selectedUser !== user) {
      selectedUser = user;
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

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Active user</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={user} onValueChange={setUser}>
          {Object.values(testUsers).map((testUser) => (
            <DropdownMenuRadioItem key={testUser.uuid} value={testUser.uuid}>
              {testUser.name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to={`/profile/${user}`} className="cursor-pointer flex w-full">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">Theme</DropdownMenuLabel>
        <DropdownMenuItem className="cursor-pointer" onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
          {theme === "light" && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
          {theme === "dark" && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => setTheme("system")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>System</span>
          {theme === "system" && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
