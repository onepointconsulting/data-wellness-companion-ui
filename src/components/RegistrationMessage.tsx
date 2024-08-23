import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../../@/components/ui/alert.tsx";
import {useTranslation} from "react-i18next";
import { Trans } from "react-i18next";

export default function RegistrationMessage() {
  const [t] = useTranslation();
  return (
    <div className="registration-alert-container">
      <Alert className="registration-alert">
        {/*<Terminal className="h-4 w-4"/>*/}
        <AlertTitle className="registration-alert-title">{t("Heads up!")}</AlertTitle>
        <AlertDescription className="registration-alert-description">
        <Trans
          i18nKey="registration-message"
          components={{ anchor: <a />, bold: <strong />, underline: <u /> }}
        />
        </AlertDescription>
      </Alert>
    </div>
  );
}
