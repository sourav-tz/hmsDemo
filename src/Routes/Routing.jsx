import { Route,Routes } from "react-router-dom";
import Role from "../Pages/Role/Role";
import Sandbox from "../Pages/Sandbox/Sandbox";
import Adminlogin from "../Pages/Adminlogin/Adminlogin";
import Studentlogin from "../Pages/Studentlogin/Studentlogin";

export default function(){

    return <>
        <Routes>
            <Route path='/' element={<Role />}></Route>
            <Route path='/adminLogin' element={<Adminlogin />} />
            <Route path='/studentLogin' element={<Studentlogin />} />
            <Route path='/sandbox' element={<Sandbox />} />
        </Routes>
    </>
}