import React from 'react'
import StudentSidebar from '../../Components/StudentSidebar/StudentSidebar'
import { lazy,Suspense } from "react";
import { useSelector } from "react-redux";
import Loadingpage from "../../Components/Loadingpage/Loadingpage";
import { CiLogout } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {

  const Home = lazy(()=>import('./Home/Home'));
  const Register = lazy(()=>import('./Complaints/Register'));
  const Status = lazy(()=>import('./Complaints/Status'));

  const activeOptions = useSelector(state=>state.StudentSidebar.activeSubOption);
  const Navigator = useNavigate();
  const navState = useSelector(state=>state.StudentSidebar.state);

  const handleLogout = ()=>{
      Navigator('/studentLogin')
  }

  return (

  <div className="flex">
        <div className="flex-1">
            <StudentSidebar />
        </div>

        {activeOptions==='Home'?
        <div className={`${navState?'flex-[4]':'flex-[9]'}`}>
            <Suspense fallback={<Loadingpage />}>
                <Home />
            </Suspense>
        </div>
        :null}
        
        {activeOptions==='cRegister'?
        <div className={`${navState?'flex-[4]':'flex-[9]'}`}>
            <Suspense fallback={<Loadingpage />}>
                <Register />
            </Suspense>
        </div>
        :null}
        
        {activeOptions==='cStatus'?
        <div className={`${navState?'flex-[4]':'flex-[9]'}`}>
            <Suspense fallback={<Loadingpage />}>
                <Status />
            </Suspense>
        </div>
        :null}


        <div id="logout" onClick={handleLogout} className="border-2 border-blue-500 text-blue-500 hover:text-white hover:bg-blue-500 px-4 py-2 cursor-pointer font-semibold rounded-md text-xl flex justify-center items-center gap-1 absolute top-8 right-8" >
        <div className=""><CiLogout  /></div>
            Logout
        </div>

    </div>
  )
}

export default Dashboard