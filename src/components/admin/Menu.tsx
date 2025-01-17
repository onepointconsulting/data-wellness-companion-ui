import {useTranslation} from "react-i18next";
import {useContext} from "react";
import {AdminContext, PageType} from "../../context/AdminContext.tsx";
import {AuthenticationContext} from "../../context/AuthenticationContext.tsx";

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

export default function Menu() {
  const [t] = useTranslation();
  const { page, setPage } = useContext(AdminContext);
  const { logout } = useContext(AuthenticationContext);

  function onClick(e: React.MouseEvent<HTMLAnchorElement>, menuItem: MenuItem) {
    e.preventDefault();
    setPage(menuItem.page);
  }

  return (
    <menu className="flex justify-end pt-3">
      {menuItems.map((menuItem, i) => (
        <li key={`menuItem_${i}`}>
          <a
            className={`px-2 default-link ${menuItem.page === page ? "font-bold" : ""}`}
            href={menuItem.link}
            title={t(menuItem.title)}
            onClick={(e) => onClick(e, menuItem)}
          >
            {t(menuItem.key)}
          </a>
          <Separator />
        </li>
      ))}
      <li key={`menuItem_${menuItems.length}`}>
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
    </menu>
  );
}
