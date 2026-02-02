export function ReportButton({
  click,
  children,
}: {
  click: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}) {
  return (
    <button
      className="inline-flex items-center justify-center p-0 m-0 hover:scale-105"
      onClick={click}
    >
      {children}
    </button>
  );
}
