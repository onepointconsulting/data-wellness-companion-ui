import { createContext, useState } from "react";
import { Props } from "./commonModel.ts";

type Hamburger = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const HamburgerMenuContext = createContext<Hamburger>({
  open: false,
  setOpen: (_) => {},
});

export default function HamburgerMenuContextProvider({ children }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <HamburgerMenuContext.Provider value={{ open, setOpen }}>
      {children}
    </HamburgerMenuContext.Provider>
  );
}
