import { Person } from "@mui/icons-material";
import { IconButton, ListItemText, Menu, MenuItem, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { useMenu } from "../hooks/useMenu.ts";
import { queryClient, requestHeaders, USER_UUID_HEADER } from "../queryClient.ts";

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
  const { anchorEl, handleClick, handleClose, open } = useMenu();

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
    <>
      <Tooltip title="Switch user">
        <IconButton
          aria-label="select user to impersonate"
          id="user-selector-menu-button"
          aria-controls="user-selector-menu"
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          className="opacity-30"
          size="small"
        >
          <Person />
        </IconButton>
      </Tooltip>

      <Menu id="user-selector-menu" anchorEl={anchorEl} open={open} onClose={handleClose} onClick={handleClose}>
        {Object.values(testUsers).map((testUser) => (
          <MenuItem key={testUser.uuid} onClick={() => setUser(testUser.uuid)} selected={user === testUser.uuid}>
            <ListItemText>{testUser.name}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
