import { useTranslation } from "react-i18next";

export default function Divider({
  idx,
  total,
}: {
  idx: number;
  total: number;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-2 my-1 text-[11px] font-semibold uppercase tracking-wide text-primary/70">
      <div className="flex-1 h-px bg-primary/20" />
      <span>{t("extract", { idx: idx + 1, total })}</span>
      <div className="flex-1 h-px bg-primary/20" />
    </div>
  );
}
