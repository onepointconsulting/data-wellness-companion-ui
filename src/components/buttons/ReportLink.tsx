export function ReportLink({
  click,
  clazzName,
  title,
  children,
}: {
  click: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  clazzName: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className={clazzName}>
      <a href="#" onClick={click} title={title}>
        {children}
      </a>
      <a href="#" onClick={click} className="hidden md:block">
        {title}
      </a>
    </div>
  );
}
