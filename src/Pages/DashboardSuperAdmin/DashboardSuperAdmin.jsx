import { lazy,Suspense } from "react";
import SuperSidebar from "../../Components/SuperSidebar/SuperSidebar";
import { useSelector } from "react-redux";
import Loadingpage from "../../Components/Loadingpage/Loadingpage";
import { CiLogout } from "react-icons/ci";
import { useNavigate } from "react-router-dom";


//lazy Imports
const ManageHostels = lazy(()=>import('./Hostels/ManageHostels/ManageHostels'));
const ManageAdmin = lazy(()=>import('./Hostels/ManageAdmin/ManageAdmin'));
const Home = lazy(()=>import('./Home/Home'));

const DashboardSuperAdmin =()=>{

    const activeOptions = useSelector(state=>state.superSideBarStates.activeSubOption);
    const Navigator = useNavigate();
    const navState = useSelector(state=>state.superSideBarStates.state);

    const handleLogout = ()=>{
        Navigator('/superAdminLogin')
    }

    return<>
        <div className="flex">
        <div className="flex-1">
            <SuperSidebar />
        </div>

        {activeOptions==='Home'?
        <div className={`${navState?'flex-[4]':'flex-[9]'}`}>
            <Suspense fallback={<Loadingpage />}>
                <Home />
            </Suspense>
        </div>
        :null}
        
        {activeOptions==='hmManageHostel'?
        <div className={`${navState?'flex-[4]':'flex-[9]'}`}>
            <Suspense fallback={<Loadingpage />}>
                <ManageHostels />
            </Suspense>
        </div>
        :null}

        {activeOptions==='hmManageAdmin'?
        <div className={`${navState?'flex-[4]':'flex-[9]'}`}>
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