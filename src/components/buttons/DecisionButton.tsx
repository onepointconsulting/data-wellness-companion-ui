import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ReportButton } from "./ReportButton.tsx";

export default function DecisionButtons({
  label,
  onClick,
  icon: Icon,
}: {
  label: string;
  onClick: () => void;
  icon: ReactNode;
}) {
  const [t] = useTranslation();
  return (
    <ReportButton click={onClick} title={t(label)}>
      {Icon}
    </ReportButton>
  );
}
