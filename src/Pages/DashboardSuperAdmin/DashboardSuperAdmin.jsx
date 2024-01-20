import { lazy,Suspense } from "react";
import SuperSidebar from "../../Components/SuperSidebar/SuperSidebar";
import { useSelector } from "react-redux";
import Loadingpage from "../../Components/Loadingpage/Loadingpage";
import { CiLogout } from "react-icons/ci";
import { useNavigate } from "react-router-dom";


//lazy Imports
const ManageHostels = lazy(()=>import('./Hostels/ManageHostels/ManageHostels'));
const ManageAdmin = lazy(()=>import('./Hostels/ManageAdmin/ManageAdmin'));

const DashboardSuperAdmin =()=>{

    const activeOptions = useSelector(state=>state.superSideBarStates.activeSubOption);
    const Navigator = useNavigate();

    const handleLogout = ()=>{
        Navigator('/superAdminLogin')
    }

    return<>
        <div className="flex">
        <div className="flex-1">
            <SuperSidebar />
        </div>
        
        {activeOptions==='hmManageHostel'?
        <div className="flex-[4]">
            <Suspense fallback={<Loadingpage />}>
                <ManageHostels />
            </Suspense>
        </div>
        :null}

        {activeOptions==='hmManageAdmin'?
        <div className="flex-[4]">
            <Suspense fallback={<Loadingpage />}>
                <ManageAdmin />
            </Suspense>
        </div>
        :null}

        <div id="logout" onClick={handleLogout} className="border-2 border-blue-500 text-blue-500 hover:text-white hover:bg-blue-500 px-4 py-2 cursor-pointer font-semibold rounded-md text-xl flex justify-center items-center gap-1 absolute top-8 right-8" >
        <div className=""><CiLogout  /></div>
            Logout
        </div>


        </div>
    </>
}


export default DashboardSuperAdmin;