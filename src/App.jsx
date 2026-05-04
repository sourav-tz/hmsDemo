import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux'
import React from 'react';
import { Route, Routes, useLocation } from "react-router-dom";
import Role from "./Pages/Role/Role";
import Sandbox from "./Pages/Sandbox/Sandbox";
import Adminlogin from "./Pages/Adminlogin/Adminlogin";
import Studentlogin from "./Pages/Studentlogin/Studentlogin";
import AdminDashboard from "./Pages/DashboardAdmin/AdminDashboard";
import SuperAdminLogin from "./Pages/SuperAdminLogin/SuperAdminLogin";
import ForgetPassword from "./Pages/ForgetPassword/ForgetPassword";
// import StudentSignUp from "./Pages/StudentSignUp/StudentSignUp";
import VerifyOtp from "./Pages/ForgetPassword/VerifyOtp";
import ResetPassword from "./Pages/ForgetPassword/ResetPassword";
import Dashboard from "./Pages/Dashboard/Dashboard";
import ViewInfo from "./Pages/DashboardAdmin/StudentsInfo/ViewInfo/ViewInfo";
import Sidebar from './components/Sidebar/Sidebar';
import SuperSidebar from './components/SuperSidebar/SuperSidebar';
import StudentSidebar from './components/StudentSidebar/StudentSidebar';
import UploadInfo from './Pages/DashboardAdmin/StudentsInfo/UploadInfo/UploadInfo';
import AllotRooms from './Pages/DashboardAdmin/RoomInfo/AllotRooms/AllotRooms';
import Home from './Pages/DashboardSuperAdmin/Home/Home';
import ManageAdmin from './Pages/DashboardSuperAdmin/Hostels/ManageAdmin/ManageAdmin';
import ManageHostels from './Pages/DashboardSuperAdmin/Hostels/ManageHostels/ManageHostels';
import ApplicationStatusSuperAdmin from './Pages/DashboardSuperAdmin/Application/ApplicationStatus.jsx';
import RoomsUpload from './Pages/DashboardSuperAdmin/RoomActions/UploadInfo/RoomsUpload';
import { RxHamburgerMenu } from "react-icons/rx";
import Loadingpage from './components/Loadingpage/Loadingpage';
import { useNavigate } from 'react-router-dom';
import Securitysettings from './Pages/DashboardSuperAdmin/Settings/Securitysettings';
import AddCourses from './Pages/DashboardSuperAdmin/StudentActions/AddCourses.jsx';
import StudentProfileSettings from './Pages/Dashboard/Settings/StudentProfileSettings.jsx';
import Register from './Pages/Dashboard/Complaints/Register.jsx';
import ComplaintStatus from './Pages/Dashboard/Complaints/ComplaintStatus.jsx';
import ApplicationStudent from './Pages/Dashboard/Application/Application.jsx';
import ApplicationStatusStudent from './Pages/Dashboard/Application/ApplicationStatus.jsx';
import Complaints from './Pages/DashboardAdmin/Complaints/Complaints.jsx';
import ApplicationAdmin from './Pages/DashboardAdmin/Application/application.jsx';
import ApplicationStatusAdmin from './Pages/DashboardAdmin/Application/ApplicationStatus.jsx';

import SuperAdminOtp from './Pages/SuperAdminLogin/SuperAdminOtp';
import UploadNotice from './Pages/DashboardAdmin/Notice/UploadNotice.jsx';
import UploadNoticeSA from './Pages/DashboardSuperAdmin/Notice/UploadNoticeSA.jsx';
import ViewNoticeSA from './Pages/DashboardSuperAdmin/Notice/ViewNoticeSA.jsx';
import NewMenu from './Pages/Dashboard/Mess/NewMenu.jsx';
import ViewNotice from './Pages/DashboardAdmin/Notice/ViewNotice.jsx';
import RegisterStudent from './Pages/DashboardAdmin/StudentsInfo/RegisterStudent/RegisterStudent.jsx';
import UpdateStudent from './Pages/DashboardAdmin/StudentsInfo/RegisterStudent/UpdateStudent.jsx';
import AdminSecuritysettings from './Pages/DashboardAdmin/Settings/AdminSecuritysettings.jsx';
import AdminProfilesettings from './Pages/DashboardAdmin/Settings/Profilesettings.jsx';
import ManageRooms from './Pages/DashboardSuperAdmin/RoomActions/ManageRooms/ManageRooms.jsx';
// Bug fix by Ravi: Bug 5 - RoomGenerator component was created but never imported or routed; SA had no way to navigate to it
import RoomGenerator from './Pages/DashboardSuperAdmin/RoomActions/ManageRooms/RoomGenerator.jsx';
import axios from 'axios';
import CloseRoute from "./Auth/CloseRoute.jsx";
import OpenRoute from "./Auth/OpenRoute.jsx";
import { FiSettings } from 'react-icons/fi';

import { removeUserData } from './Store/Reducers/userSlice.js'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import ViewNotices from './Pages/Dashboard/Notices/ViewNotices.jsx';
import GuestLanding from './Pages/GuestDashboard/GuestLanding/GuestLanding.jsx';
import GuestReigster from './Pages/GuestDashboard/GuestRegister/GuestReigster.jsx';
import GuestStatus from './Pages/GuestDashboard/GuestStatus/GuestStatus.jsx';
import GuestReferral from './Pages/Dashboard/GuestReferral/GuestReferral.jsx';
import GuestVerify from './Pages/DashboardAdmin/GuestFunctionality/GuestVerify/GuestVerify.jsx';
import GuestView from './Pages/DashboardAdmin/GuestFunctionality/GuestView/GuestView.jsx';
import GuestSidebar from './components/GuestSidebar/GuestSidebar.jsx';
import GuestAllot from './Pages/DashboardAdmin/GuestFunctionality/GuestAllot/GuestAllot.jsx';
import GuestFinal from './Pages/DashboardAdmin/GuestFunctionality/GuestFinal/GuestFinal.jsx';
import StudentAccountCreate from './Pages/DashboardAdmin/StudentsInfo/RegisterStudent/StudentAccountCreate.jsx';
import StudentVerifyProfile from './Pages/DashboardAdmin/StudentsInfo/RegisterStudent/StudentVerifyProfile.jsx';
import StudentSelfProfiling from './Pages/Dashboard/SelfProfiling/StudentSelfProfiling.jsx';
import ViewStudents from './Pages/DashboardSuperAdmin/StudentActions/ViewStudents.jsx';
// Bug fix by Ravi: Bug 10 - TransferStudent component was created but never imported or routed; HA had no way to navigate to it
import TransferStudent from './Pages/DashboardAdmin/StudentsInfo/TransferStudent.jsx';

import Landing from './Pages/Landing/Landing.jsx'; 



import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 


function App() {

const [admin,setAdmin] = useState(false);
const [student,setStudent] = useState(false);
const [superAdmin,setSuperAdmin] = useState(false);
const [guest,setGuest] = useState(false);
const [loading,setLoadingPage] = useState(false);

const location = useLocation();
const Navigator = useNavigate();
const Dispatcher = useDispatch();
useEffect(()=>{
  // Log the current path for debugging
  console.log("Current path:", location.pathname.split('/')[1]);

  if(location.pathname.split('/')[1]==='adminDashboard'){
    console.log(location.pathname.split('/')[1]);
    setAdmin(true);
    setStudent(false);
    setSuperAdmin(false);
    setGuest(false);
  }
  else if(location.pathname.split('/')[1]==='superAdminDashboard'){
    setAdmin(false);
    setStudent(false);
    setSuperAdmin(true);
    setGuest(false);
  }
  else if(location.pathname.split('/')[1]==='studentDashboard'){
    setAdmin(false);
    setStudent(true);
    setSuperAdmin(false);
    setGuest(false);
  }
  else if(location.pathname.split('/')[1]==='guest'){
    setAdmin(false);
    setStudent(false);
    setSuperAdmin(false);
    setGuest(true);
  }
  else{
    setAdmin(false);
    setStudent(false);
    setSuperAdmin(false);
    setGuest(false);
  }

  }, [location]);


  const handleLogoutAdmin = () => {
    setLoadingPage(true);
    const config = {
      headers: {
        "Content-Type": "application/json"
        },
        withCredentials: true
      }
  axios.get(import.meta.env.VITE_BASE_URL + '/HA/adminLogout',config)
  .then(res=>{
      setLoadingPage(false);
      Dispatcher(removeUserData());
      Navigator('/adminLogin',{ replace: true });

  })
  .catch(err=>{
      setLoadingPage(false);
      Dispatcher(removeUserData());
      Navigator('/adminLogin',{ replace: true });
      console.log("error in admin logout");
      console.log(err);
      if(err.status===401){
          Navigator('/adminLogin',{ replace: true });
      }
  })
}

  const handleSuperAdminLogout = () => {
    setLoadingPage(true);
    const config = {
      headers: {
        "Content-Type": "application/json"
        },
        withCredentials: true
      }
  axios.get(import.meta.env.VITE_BASE_URL + '/SA/superAdminLogout',config)
  .then(res=>{
      setLoadingPage(false);
      Dispatcher(removeUserData());
      Navigator('/superAdminLogin',{ replace: true });

  })
  .catch(err=>{
      setLoadingPage(false);
      Dispatcher(removeUserData());
      Navigator('/superAdminLogin',{ replace: true });
      console.log(err);
      if(err.status===401){
          Navigator('/superAdminLogin',{ replace: true });
      }
  })
}

const handleStudentLogout = ()=>{
  setLoadingPage(true);
  const config = {
      headers: {
        "Content-Type": "application/json"
        },
        withCredentials: true
      }
  axios.get(import.meta.env.VITE_BASE_URL + '/student/studentLogout',config)
  .then(res=>{
      setLoadingPage(false);
      Dispatcher(removeUserData());
      Navigator('/studentLogin',{ replace: true });

  })
  .catch(err=>{
      setLoadingPage(false);
      Navigator('/studentLogin',{ replace: true });
      console.log(err);
      if(err.status===401){
          Navigator('/studentLogin',{ replace: true });
      }
  })
}


  return (
    <>
    {admin?<Sidebar />:null}
    {superAdmin?<SuperSidebar />:null}
    {student?<StudentSidebar />:null}
    {guest?<GuestSidebar />:null}

    {admin||superAdmin||student?<div className='absolute top-3 right-20'>
      <DropdownMenu>
      <DropdownMenuTrigger><div className='bg-white relative text-[#131133] p-2 rounded-xl z-50 transition transform hover:scale-125 duration-300 ease-in-out shadow hover:shadow-md hover:backdrop-blur-2xl'><FiSettings size={25}/></div></DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            if (admin) {
              Navigator('/adminDashboard/settings/profile');
            } else if (superAdmin) {
              Navigator('/superAdminDashboard/settings/profile');
            } else if (student) {
              const isTempStudent = localStorage.getItem('role') === 'TempStudent';
              Navigator(isTempStudent ? '/studentDashboard/main/selfProfiling' : '/studentDashboard/settings/profile');
            }
          }}
            >Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              admin ? Navigator('/adminDashboard/settings/security') : superAdmin ? Navigator('/superAdminDashboard/settings/security') : Navigator('/ResetPassword')
            }}>Security</DropdownMenuItem>
            <DropdownMenuItem onClick={() => { admin ? handleLogoutAdmin() : superAdmin ? handleSuperAdminLogout() : handleStudentLogout() }}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div> : null}

      {loading ? <Loadingpage /> : null}
      <div className=''>
        <div className='md:mx-auto'>
          <Routes>

            {/* <Route path='*' element={<Role />} /> */}

            <Route path='/role' element={<OpenRoute><Role /></OpenRoute>}></Route>
            <Route path='/studentLogin' element={<OpenRoute><Studentlogin /></OpenRoute>} />
            <Route path='/forgetPass' element={<OpenRoute><ForgetPassword /></OpenRoute>} />
            {/* <Route path='/StudentSignUp' element={<OpenRoute><StudentSignUp /></OpenRoute>} /> */}
            <Route path='/VerifyOtp' element={<OpenRoute><VerifyOtp/></OpenRoute>} />
            <Route path='/ResetPassword' element={<OpenRoute><ResetPassword/></OpenRoute>} />

            {/* Students */}
            <Route path='/studentDashboard/main/home' element={<CloseRoute><Dashboard /></CloseRoute>} />
            <Route path='/studentDashboard/main/selfProfiling' element={<CloseRoute><StudentSelfProfiling /></CloseRoute>} />
            <Route path='/studentDashboard/settings/profile' element={<CloseRoute><StudentProfileSettings /></CloseRoute>} />
            <Route path='/studentDashboard/complaints/register' element={<CloseRoute><Register /></CloseRoute>} />
            <Route path='/studentDashboard/complaints/status' element={<CloseRoute><ComplaintStatus /></CloseRoute>} />
            <Route path='/studentDashboard/student/application' element={<CloseRoute><ApplicationStudent /></CloseRoute>} />
            <Route path='/studentDashboard/student/applicationstatus' element={<CloseRoute><ApplicationStatusStudent /></CloseRoute>} />
            <Route path='/studentDashboard/notices/view' element={<CloseRoute><ViewNotices /></CloseRoute>} />
            <Route path='/studentDashboard/mess/menu' element={<CloseRoute><NewMenu /></CloseRoute>} />

            {/*Student Guest Verify Referral Page */}
            <Route path='/studentDashboard/guest/referral' element={<CloseRoute><GuestReferral /></CloseRoute>} />



            {/* Admin Routes */}
            <Route path='/adminLogin' element={<OpenRoute><Adminlogin /></OpenRoute>} />
            {/* <Route path='/sandbox' element={<Sandbox />} /> */}
            <Route path='/adminDashboard/main/home' element={<CloseRoute><AdminDashboard /></CloseRoute>} />
            <Route path='/adminDashboard/studentInfo/studentCreateAccount' element={<CloseRoute><StudentAccountCreate/></CloseRoute>} />
            <Route path='/adminDashboard/studentInfo/studentVerify' element={<CloseRoute><StudentVerifyProfile/></CloseRoute>} />
            <Route path='/adminDashboard/studentInfo/register' element={<CloseRoute><RegisterStudent/></CloseRoute>} />
            <Route path='/adminDashboard/studentInfo/update' element={<CloseRoute><UpdateStudent/></CloseRoute>} />
            <Route path='/adminDashboard/studentInfo/viewInfo' element={<CloseRoute><ViewInfo /></CloseRoute>} />
            <Route path='/adminDashboard/studentInfo/uploadInfo' element={<CloseRoute><UploadInfo /></CloseRoute>} />
            {/* Bug fix by Ravi: Bug 10 - Route for Transfer Student was missing; HA could not access TransferStudent page */}
            <Route path='/adminDashboard/studentInfo/transferStudent' element={<CloseRoute><TransferStudent /></CloseRoute>} />
            <Route path='/adminDashboard/roomInfo/allotRooms' element={<CloseRoute><AllotRooms /></CloseRoute>} />
            <Route path='/adminDashboard/complaints/complaints' element={<CloseRoute><Complaints /></CloseRoute>} />
            <Route path='/adminDashboard/admin/application' element={<CloseRoute><ApplicationAdmin /></CloseRoute>} />
            <Route path='/adminDashboard/admin/applicationstatus' element={<CloseRoute><ApplicationStatusAdmin /></CloseRoute>} />
            <Route path='/adminDashboard/notice/uploadNotice' element={<CloseRoute><UploadNotice /></CloseRoute>} />
            <Route path='/adminDashboard/notice/viewNotice' element={<CloseRoute><ViewNotice /></CloseRoute>} />
            <Route path='/adminDashboard/settings/security' element={<CloseRoute><AdminSecuritysettings /></CloseRoute>} />
            <Route path='/adminDashboard/settings/profile' element={<CloseRoute><AdminProfilesettings /></CloseRoute>} />

            {/* Admin Guest Pages */}
            <Route path='/adminDashboard/guest/verify' element={<CloseRoute><GuestVerify /></CloseRoute>} />
            <Route path='/adminDashboard/guest/viewSchedule' element={<CloseRoute><GuestView /></CloseRoute>} />
            <Route path='/adminDashboard/guest/allot' element={<CloseRoute><GuestAllot /></CloseRoute>} />
            <Route path='/adminDashboard/guest/viewDetail' element={<CloseRoute><GuestFinal /></CloseRoute>} />



            {/*super Admin Routes */}
            <Route path='/superAdminLogin' element={<OpenRoute><SuperAdminLogin /></OpenRoute>} />
            <Route path='/superAdminLogin/superAdminOtp' element={<OpenRoute><SuperAdminOtp /></OpenRoute>} />
            <Route path='/superAdminDashboard/main/home' element={<CloseRoute><Home /></CloseRoute>} />
            <Route path='/superAdminDashboard/hostels/manageAdmins' element={<CloseRoute><ManageAdmin /></CloseRoute>} />
            <Route path='/superAdminDashboard/hostels/manageHostels' element={<CloseRoute><ManageHostels /></CloseRoute>} />
            <Route path='/superAdminDashboard/roomActions/allocateRooms' element={<CloseRoute><RoomsUpload /></CloseRoute>} />
            <Route path='/superAdminDashboard/roomActions/manageRooms' element={<CloseRoute><ManageRooms /></CloseRoute>} />
            <Route path='/superAdminDashboard/notice/uploadNotice' element={<CloseRoute><UploadNoticeSA /></CloseRoute>} />
            <Route path='/superAdminDashboard/notice/viewNotice' element={<CloseRoute><ViewNoticeSA /></CloseRoute>} />
            <Route path='/superAdminDashboard/settings/security' element={<CloseRoute><Securitysettings /></CloseRoute>} />
            <Route path='/superAdminDashboard/studentActions/addCourses' element={<CloseRoute><AddCourses /></CloseRoute>} />
            <Route path='/superAdminDashboard/application/applicationStatus' element={<CloseRoute><ApplicationStatusSuperAdmin /></CloseRoute>} />

            <Route path='/superAdminDashboard/studentActions/viewStudents' element={<CloseRoute><ViewStudents /></CloseRoute>} />
            {/* Bug fix by Ravi: Bug 5 - Route for Smart Room Generator was missing; SA could not access RoomGenerator page */}
            <Route path='/superAdminDashboard/roomActions/roomGenerator' element={<CloseRoute><RoomGenerator /></CloseRoute>} />


            {/* Guest Routes */}
            <Route path='/guest/home' element={<CloseRoute><GuestLanding /></CloseRoute>} />
            <Route path='/guest/register' element={<CloseRoute><GuestReigster /></CloseRoute>} />
            <Route path='/guest/status' element={<CloseRoute><GuestStatus /></CloseRoute>} />



            {/* Landing Routes */}
            <Route path='/' element={<OpenRoute><Landing /></OpenRoute>} />


        </Routes>
           </div>
        </div>
        <ToastContainer />
    </>
  )
}

export default App;
