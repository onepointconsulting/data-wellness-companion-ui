export function ReportLink({
  click,
  title,
  children,
}: {
  click: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button className="mt-3 btn " onClick={click}>
      <span title={title}>{children}</span>
      <span className="hidden md:block">{title}</span>
    </button>
  );
}
