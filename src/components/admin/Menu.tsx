import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { AdminContext, PageType } from "../../context/AdminContext.tsx";
import { AuthenticationContext } from "../../context/AuthenticationContext.tsx";
import HamburgerWrapper from "../menu/HamburgerWrapper.tsx";

type MenuItem = {
  key: string;
  title: string;
  link: string;
  page: PageType;
};

const menuItems: MenuItem[] = [
  {
    key: "JWT Tokens",
    title: "Manage JWT Tokens",
    link: "/admin/jwt-token",
    page: PageType.JWT_TOKEN,
  },
  {
    key: "Reports",
    title: "Manage reports",
    link: "/admin/reports",
    page: PageType.REPORTS,
  },
  {
    key: "Global Configuration",
    title: "Global Configuration",
    link: "/admin/global",
    page: PageType.GLOBAL_CONFIG,
  },
  {
    key: "Questions",
    title: "Questions",
    link: "/admin/questions",
    page: PageType.QUESTIONS,
  },
];

function Separator() {
  return <span className="dark:text-gray-200">|</span>;
}

function Logout({ isHamburger }: { isHamburger: boolean }) {
  const [t] = useTranslation();
  const { logout } = useContext(AuthenticationContext);
  return (
    <li
      key={`menuItem_${menuItems.length}`}
      className={`${isHamburger ? "my-2" : ""}`}
    >
      <a
        href="#"
        className="px-2 default-link"
        onClick={(e) => {
          e.preventDefault();
          logout();
        }}
      >
        {t("Logout")}
      </a>
    </li>
  );
}

function MenuItems({ isHamburger }: { isHamburger: boolean }) {
  const [t] = useTranslation();
  const { page, setPage } = useContext(AdminContext);

  function onClick(e: React.MouseEvent<HTMLAnchorElement>, menuItem: MenuItem) {
    e.preventDefault();
    setPage(menuItem.page);
  }
  return (
    <>
      {menuItems.map((menuItem, i) => (
        <li key={`menuItem_${i}`} className={`${isHamburger ? "my-2" : ""}`}>
          <a
            className={`px-2 default-link ${menuItem.page === page ? "font-bold" : ""}`}
            href={menuItem.link}
            title={t(menuItem.title)}
            onClick={(e) => onClick(e, menuItem)}
          >
            {t(menuItem.key)}
          </a>
          {!isHamburger && <Separator />}
        </li>
      ))}
    </>
  );
}

export default function Menu() {
  return (
    <>
      <div className="admin-menu flex justify-end mt-4 lg:hidden">
        <HamburgerWrapper>
          <MenuItems isHamburger={true} />
          <Logout isHamburger={true} />
        </HamburgerWrapper>
      </div>
      <menu className="hidden lg:flex justify-end pt-3">
        <MenuItems isHamburger={false} />
        <Logout isHamburger={false} />
      </menu>
    </>
  );
}
