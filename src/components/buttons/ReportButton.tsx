export function ReportButton({
  click,
  title,
  marginTop = 2,
  children,
}: {
  click: (e: React.MouseEvent<HTMLButtonElement>) => void;
  title: string;
  marginTop?: number;
  children: React.ReactNode;
}) {
  return (
    <button className={`pt-${marginTop} btn`} onClick={click}>
      <span title={title}>{children}</span>
      <span className="hidden md:block">{title}</span>
    </button>
  );
}
