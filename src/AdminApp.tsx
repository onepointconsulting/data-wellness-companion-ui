import {Route, Routes} from "react-router-dom";
import JwtTokenForm from "./components/admin/token/JwtTokenForm.tsx";
import ReportForm from "./components/admin/reporting/ReportForm.tsx";

export default function AdminApp() {
    return (
        <Routes>
            <Route path={`/jwt-token`} element={<JwtTokenForm/>}/>
            <Route path={`/reports`} element={<ReportForm/>}/>
        </Routes>
    )
}