import JwtTokenForm from "./token/JwtTokenForm.tsx";
import ReportForm from "./reporting/ReportForm.tsx";
import { useContext } from "react";
import { AdminContext, PageType } from "../../context/AdminContext.tsx";
import { AuthenticationContext } from "../../context/AuthenticationContext.tsx";
import { useTranslation } from "react-i18next";
import GlobalConfigForm from "./global/GlobalConfigForm.tsx";
import QuestionsForm from "./questions/QuestionsForm.tsx";

function displayPage(page: PageType) {
  switch (page) {
    case PageType.JWT_TOKEN:
      return <JwtTokenForm />;
    case PageType.GLOBAL_CONFIG:
      return <GlobalConfigForm />;
    case PageType.QUESTIONS:
      return <QuestionsForm />;
    default:
      return <ReportForm />;
  }
}

export default function AdminMain() {
  const [t] = useTranslation();
  const { profile, login } = useContext(AuthenticationContext);
  const { page } = useContext(AdminContext);

  const signinText = t("Sign in with Google");
  return (
    <>
      {profile ? (
        displayPage(page)
      ) : (
        <div className="flex justify-center align-middle h-lvh">
          <div className="flex my-auto align-middle h-12">
            <div className="flex align-middle">
              <img
                src="/google_logo.png"
                alt={signinText}
                className="block my-auto w-6 h-6 mr-1"
              />
            </div>
            <div className="flex align-middle">
              <button className="text-xl" onClick={() => login()}>
                {signinText}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
