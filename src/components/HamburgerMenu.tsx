import {useEffect, useRef, useState} from "react";
import StartButton from "./buttons/StartButton.tsx";
import {useTranslation} from "react-i18next";
import InfoButton from "./buttons/InfoButton.tsx";

/**
 * The Hamburger menu component.
 * @constructor
 */
export default function HamburgerMenu() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLMenuElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!menuRef.current?.contains(target) && !imgRef.current?.contains(target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    // Add event listener when the component mounts
    document.addEventListener('mousedown', handleClickOutside);

    // Remove event listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className="hamburger-menu">
      <img ref={imgRef} src="./menu.svg" alt={t("Menu")} onClick={() => setOpen(!open)}/>
      {open && (
        <menu ref={menuRef}>
          <StartButton/>
          <InfoButton />
        </menu>)
      }
    </div>
  );
}