import { createContext, useState } from "react";
import { Props } from "./commonModel.ts";

export enum PageType {
  JWT_TOKEN = "jwtToken",
  REPORTS = "reports",
}

interface AdminState {
  page: PageType;
  setPage: (pageType: PageType) => void;
}

export const AdminContext = createContext<AdminState>({
  page: PageType.JWT_TOKEN,
  setPage: (_: PageType) => {},
});

export const AdminContextProvider = ({ children }: Props) => {
  const [page, setPage] = useState<PageType>(PageType.JWT_TOKEN);
  return (
    <AdminContext.Provider value={{ page, setPage }}>
      {children}
    </AdminContext.Provider>
  );
};
