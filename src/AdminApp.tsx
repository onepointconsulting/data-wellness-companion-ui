import { GoogleOAuthProvider } from "@react-oauth/google";
import AdminMain from "./components/admin/AdminMain.tsx";
import { AdminContextProvider } from "./context/AdminContext.tsx";
import { AuthenticationContextProvider } from "./context/AuthenticationContext.tsx";

export default function AdminApp() {
  return (
    <GoogleOAuthProvider clientId="1024106793086-av371p2lkvabec7635fghtts8l1ea0n2.apps.googleusercontent.com">
      <AuthenticationContextProvider>
        <AdminContextProvider>
          <AdminMain />
        </AdminContextProvider>
      </AuthenticationContextProvider>
    </GoogleOAuthProvider>
  );
}
