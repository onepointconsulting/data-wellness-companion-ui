import {useTranslation} from "react-i18next";

type MenuItem = {
    key: string,
    title: string,
    link: string
}

const menuItems: MenuItem[] = [
    {
        key: "JWT Tokens",
        title: "Manage JWT Tokens",
        link: "/admin/jwt-token"
    },
    {
        key: "Reports",
        title: "Manage reports",
        link: "/admin/reports"
    }
]

export default function Menu() {
    const [t] = useTranslation();
    return (
        <menu className="flex justify-end pt-3">
            {menuItems.map((menuItem, i) => (
                <li key={`menuItem_${i}`}>
                    <a className="px-2 default-link" href={menuItem.link} title={t(menuItem.title)}>{t(menuItem.key)}</a>
                    {i < menuItems.length - 1 ? "|" : ""}
                </li>
            ))}
        </menu>
    )
}