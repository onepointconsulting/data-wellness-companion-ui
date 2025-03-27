export function ReportLink({
  click,
  title,
  marginTop = 3,
  children,
}: {
  click: (e: React.MouseEvent<HTMLButtonElement>) => void;
  title: string;
  marginTop?: number;
  children: React.ReactNode;
}) {
  return (
    <button className={`mt-${marginTop} btn`} onClick={click}>
      <span title={title}>{children}</span>
      <span className="hidden md:block">{title}</span>
    </button>
  );
}
