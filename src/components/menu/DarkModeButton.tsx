import { LuMoon, LuSun } from "react-icons/lu";
import { useContext } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import { useTranslation } from "react-i18next";

export default function DarkModeButton() {
  const { dark, setDark } = useContext(DarkModeContext);
  const { t } = useTranslation();
  const switchLabel = dark
    ? t("Switch to Light Mode")
    : t("Switch to Dark Mode");

  return (
    <div
      onClick={() => setDark(!dark)}
      className="menu-item"
      role="button"
      tabIndex={0}
      aria-label={switchLabel}
      title={switchLabel}
    >
      <div className="w-12">
        {dark ? (
          <LuMoon className="w-6 h-6 text-[#000000] dark:text-[#fafffe]" />
        ) : (
          <LuSun className="w-6 h-6 text-[#000000] dark:text-[#fafffe]" />
        )}
      </div>

      <div className="pl-2 text-left flex-grow">
        <div className="font-medium">
          {dark ? t("Dark mode") : t("Light mode")}
        </div>
      </div>

      <div className="ml-auto">
        <label
          // prevent clicks inside the toggle from bubbling up to the button (avoids double toggle)
          onClick={(e) => e.stopPropagation()}
          className="relative inline-flex items-center cursor-pointer"
        >
          <input
            type="checkbox"
            className="sr-only peer"
            checked={dark}
            onChange={(ev) => setDark(ev.target.checked)}
            onClick={(e) => e.stopPropagation()} // extra guard
            aria-checked={dark}
            aria-label={switchLabel}
          />
          <div className="w-11 h-6 bg-[#6A666D45] peer-focus:ring-2 peer-focus:ring-[#6A666D45] rounded-full peer peer-checked:bg-[#9A19FF] transition-colors" />
          <span
            className={`absolute left-1 top-1 w-4 h-4 bg-[#fafffe] rounded-full shadow transform transition ${dark ? "translate-x-5" : ""}`}
          />
        </label>
      </div>
    </div>
  );
}
