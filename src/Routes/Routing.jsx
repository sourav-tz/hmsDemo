import { Route,Routes } from "react-router-dom";
import Role from "../Pages/Role/Role";
import Sandbox from "../Pages/Sandbox/Sandbox";

export default function(){

    return <>
        <Routes>
            <Route path='/' element={<Role />}></Route>
            <Route path='/sandbox' element={<Sandbox />} />
        </Routes>
    </>
}