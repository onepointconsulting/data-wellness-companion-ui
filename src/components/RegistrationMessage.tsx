import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../../@/components/ui/alert.tsx";

export default function RegistrationMessage() {
  return (
    <div className="registration-alert-container">
      <Alert className="registration-alert">
        {/*<Terminal className="w-4 h-4"/>*/}
        <AlertTitle className="registration-alert-title">Heads up!</AlertTitle>
        <AlertDescription className="registration-alert-description">
          Please{" "}
          <a
            href="mailto:officialmurtaza01@gmail.com@example.com"
            target="_blank"
            className="default-link"
          >
            contact us
          </a>{" "}
          to continue using the app.
        </AlertDescription>
      </Alert>
    </div>
  );
}
