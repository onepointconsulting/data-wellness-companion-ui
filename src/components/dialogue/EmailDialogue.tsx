import onCloseDialogue from "../../lib/dialogFunctions.ts";
import ButtonPanel from "./ButtonPanel.tsx";
import { Input } from "../form/Input.tsx";
import Spinner from "../Spinner.tsx";
import Alert from "../form/Alert.tsx";
import { useTranslation } from "react-i18next";
import DialogueHeader from "./DialogueHeader.tsx";
import { useEmailReport } from "../../hooks/useEmailReport.ts";

export const EMAIL_DIALOGUE_ID = "email-dialogue";

function onClose() {
  onCloseDialogue(EMAIL_DIALOGUE_ID);
}

/**
 * Dialogue used to capture the email of the user who generated a report.
 * @constructor
 */
export default function EmailDialogue() {
  const { t } = useTranslation();
  const {
    sending,
    feedbackMessage,
    setFeedbackMessage,
    name,
    setName,
    email,
    setEmail,
    onOk,
  } = useEmailReport();

  function disabled(): boolean {
    return !name || !email || sending;
  }

  return (
    <dialog data-model={true} id={EMAIL_DIALOGUE_ID} className="email-dialogue">
      <DialogueHeader onClose={onClose}>
        <svg
          width="54"
          height="54"
          viewBox="0 0 54 54"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            width="54"
            height="54"
            fill="url(#paint0_linear_1129_70)"
            fillOpacity="0.6"
          />
          <rect
            x="6.75"
            y="6.75"
            width="40.5"
            height="40.5"
            fill="url(#paint1_linear_1129_70)"
          />
          <path
            d="M36.9572 20H18.0194C16.9082 20 16 20.8367 16 21.8686V33.0799C16 34.1122 16.9088 34.9484 18.0194 34.9484H36.9572C38.0684 34.9484 38.9766 34.1118 38.9766 33.0799V21.8686C38.9766 20.8364 38.068 20 36.9572 20ZM36.6471 21.2457C35.9942 21.8518 28.325 28.9711 28.01 29.2636C27.7468 29.5079 27.23 29.508 26.9667 29.2636L18.3295 21.2457H36.6471ZM17.3463 32.8509V22.0976L23.1382 27.4742L17.3463 32.8509ZM18.3295 33.7027L24.0887 28.3565L26.0132 30.1431C26.8019 30.8752 28.1751 30.8749 28.9635 30.1431L30.888 28.3566L36.6471 33.7027H18.3295ZM37.6304 32.8509L31.8384 27.4742L37.6304 22.0976V32.8509Z"
            fill="white"
          />
          <defs>
            <linearGradient
              id="paint0_linear_1129_70"
              x1="1.95652"
              y1="-3.43431e-07"
              x2="52.0435"
              y2="54"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#0084D7" />
              <stop offset="1" stopColor="#4DC48D" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_1129_70"
              x1="8.21739"
              y1="6.75"
              x2="45.7826"
              y2="47.25"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#0084D7" />
              <stop offset="1" stopColor="#4DC48D" />
            </linearGradient>
          </defs>
        </svg>
      </DialogueHeader>
      <div className="email-dialogue-content">
        {t(
          "Please enter your name and email address so we can send you the report.",
        )}
      </div>
      <div className="email-dialogue-form">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <label htmlFor="name">{t("Your name:")} </label>
          <Input
            id="name"
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <label htmlFor="email">{t("Email")}: </label>
          <Input
            id="email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
      </div>
      {sending && <Spinner />}
      {feedbackMessage && (
        <Alert
          feedback={feedbackMessage}
          onClose={() => setFeedbackMessage("")}
        />
      )}
      <ButtonPanel onOk={onOk} okText={t("Send email")} disabled={disabled()} />
    </dialog>
  );
}
