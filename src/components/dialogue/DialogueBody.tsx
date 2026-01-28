export default function DialogueBody({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex flex-col items-start px-2.5">{children}</div>;
}
