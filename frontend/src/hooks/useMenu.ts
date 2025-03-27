import { type MouseEvent, type TouchEvent, useState } from "react";

export type MenuContext = {
  anchorEl: HTMLElement | null;
  open: boolean;
  handleClick: (event: MouseEvent<HTMLElement> | TouchEvent<HTMLElement>) => void;
  handleClose: () => void;
};

export const useMenu = (): MenuContext => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: MouseEvent<HTMLElement> | TouchEvent<HTMLElement>): void => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  return { anchorEl, open: Boolean(anchorEl), handleClick, handleClose };
};
