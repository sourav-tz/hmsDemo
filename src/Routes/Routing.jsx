import { Route,Routes } from "react-router-dom";
import Role from "../Pages/Role/Role";
import Sandbox from "../Pages/Sandbox/Sandbox";
import Adminlogin from "../Pages/Adminlogin/Adminlogin";
import Studentlogin from "../Pages/Studentlogin/Studentlogin";
import AdminDashboard from "../Pages/DashboardAdmin/AdminDashboard";
import SuperAdminLogin from "../Pages/SuperAdminLogin/SuperAdminLogin";
import DashboardSuperAdmin from "../Pages/DashboardSuperAdmin/DashboardSuperAdmin";
import ForgetPassword from "../Pages/ForgetPassword/ForgetPassword";
import StudentSignUp from "../Pages/StudentSignUp/StudentSignUp";


export default function(){

    return <>
        <Routes>
            <Route path='/' element={<Role />}></Route>
            <Route path='/adminLogin' element={<Adminlogin />} />
            <Route path='/studentLogin' element={<Studentlogin />} />
            <Route path='/sandbox' element={<Sandbox />} />
            <Route path='/adminDashboard' element={<AdminDashboard />} />
            <Route path='/superAdminLogin' element={<SuperAdminLogin />} />
            <Route path='/superAdminDashboard' element={<DashboardSuperAdmin />} />
            <Route path='/forgetPass' element={<ForgetPassword />} />
            <Route path='/StudentSignUp' element={<StudentSignUp />} />
        </Routes>
    </>
}