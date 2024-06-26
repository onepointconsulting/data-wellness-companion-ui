import {useTranslation} from "react-i18next";

export default function StatefulIcon({
                        show,
                        children,
                        onClick,
                        title,
                      }: {
  show: boolean;
  children: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  title: string;
}) {
  const { t } = useTranslation();
  return (
    <>
      {show && (
        <a href="#" onClick={onClick} title={t(title)}>
          {children}
        </a>
      )}
      {!show && <div className="deactivated-icon">{children}</div>}
    </>
  );
}