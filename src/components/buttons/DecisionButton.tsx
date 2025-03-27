import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ReportLink } from "./ReportLink.tsx";

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
    <ReportLink click={onClick} title={t(label)} marginTop={0}>
      {Icon}
    </ReportLink>
  );
}
