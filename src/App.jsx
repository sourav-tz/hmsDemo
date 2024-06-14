import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import React from 'react';
import { Route,Routes, useLocation } from "react-router-dom";
import Role from "./Pages/Role/Role";
import Sandbox from "./Pages/Sandbox/Sandbox";
import Adminlogin from "./Pages/Adminlogin/Adminlogin";
import Studentlogin from "./Pages/Studentlogin/Studentlogin";
import AdminDashboard from "./Pages/DashboardAdmin/AdminDashboard";
import SuperAdminLogin from "./Pages/SuperAdminLogin/SuperAdminLogin";
import DashboardSuperAdmin from "./Pages/DashboardSuperAdmin/DashboardSuperAdmin";
import ForgetPassword from "./Pages/ForgetPassword/ForgetPassword";
import StudentSignUp from "./Pages/StudentSignUp/StudentSignUp";
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
import RoomsUpload from './Pages/DashboardSuperAdmin/RoomActions/UploadInfo/RoomsUpload';
import { RxHamburgerMenu } from "react-icons/rx";
import Loadingpage from './components/Loadingpage/Loadingpage';
import { useNavigate } from 'react-router-dom';
import Securitysettings from './Pages/DashboardSuperAdmin/Settings/Securitysettings';
import AddCourses from './Pages/DashboardSuperAdmin/StudentActions/AddCourses.jsx';
import StudentProfileSettings from './Pages/Dashboard/Settings/StudentProfileSettings.jsx';
import Register from './Pages/Dashboard/Complaints/Register.jsx';
import ComplaintStatus from './Pages/Dashboard/Complaints/ComplaintStatus.jsx';
import Complaints from './Pages/DashboardAdmin/Complaints/Complaints.jsx';
import SuperAdminOtp from './Pages/SuperAdminLogin/SuperAdminOtp';
import UploadNotice from './Pages/DashboardAdmin/Notice/UploadNotice.jsx';
import NewMenu from './Pages/Dashboard/Mess/NewMenu.jsx';
import ViewNotice from './Pages/DashboardAdmin/Notice/ViewNotice.jsx';
import RegisterStudent from './Pages/DashboardAdmin/StudentsInfo/RegisterStudent/RegisterStudent.jsx';
import UpdateStudent from './Pages/DashboardAdmin/StudentsInfo/RegisterStudent/UpdateStudent.jsx';
import AdminSecuritysettings from './Pages/DashboardAdmin/Settings/AdminSecuritysettings.jsx';
import ManageRooms from './Pages/DashboardSuperAdmin/RoomActions/ManageRooms/ManageRooms.jsx';
import axios from 'axios';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"






function App() {

const [admin,setAdmin] = useState(false);
const [student,setStudent] = useState(false);
const [superAdmin,setSuperAdmin] = useState(false);
const [loading,setLoadingPage] = useState(false);

const location = useLocation();
const Navigator = useNavigate();

useEffect(()=>{
  if(location.pathname.split('/')[1]==='adminDashboard'){
    console.log(location.pathname.split('/')[1]);
    setAdmin(true);
    setStudent(false);
    setSuperAdmin(false);
  }
  else if(location.pathname.split('/')[1]==='superAdminDashboard'){
    setAdmin(false);
    setStudent(false);
    setSuperAdmin(true);
  }
  else if(location.pathname.split('/')[1]==='studentDashboard'){
    setAdmin(false);
    setStudent(true);
    setSuperAdmin(false);
  }
  else{
    setAdmin(false);
    setStudent(false);
    setSuperAdmin(false);
  }

},[location]);


const handleLogoutAdmin = ()=>{
  console.log('called');
  setLoadingPage(true);
  const config = {
      headers: {
        "Content-Type": "application/json"
        },
        withCredentials: true
      }
  axios.get(import.meta.env.VITE_BASE_URL + '/HA/adminLogout',config)
  .then(res=>{
      console.log(res);
      setLoadingPage(false);
      Dispatcher(removeUserData());
      Navigator('/adminLogin');

  })
  .catch(err=>{
      setLoadingPage(false);
      Navigator('/adminLogin');
      console.log(err);
      if(err.status===401){
          Navigator('/adminLogin');
      }
  })
}  

const handleSuperAdminLogout = ()=>{
  setLoadingPage(true);
  const config = {
      headers: {
        "Content-Type": "application/json"
        },
        withCredentials: true
      }
  axios.get(import.meta.env.VITE_BASE_URL + '/SA/superAdminLogout',config)
  .then(res=>{
      console.log(res);
      setLoadingPage(false);
      Dispatcher(removeUserData());
      Navigator('/superAdminLogin');

  })
  .catch(err=>{
      setLoadingPage(false);
      Navigator('/superAdminLogin');
      console.log(err);
      if(err.status===401){
          Navigator('/superAdminLogin');
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
      console.log(res);
      setLoadingPage(false);
      Dispatcher(removeUserData());
      Navigator('/studentLogin');

  })
  .catch(err=>{
      setLoadingPage(false);
      Navigator('/studentLogin');
      console.log(err);
      if(err.status===401){
          Navigator('/studentLogin');
      }
  })
}


  return (
    <>
    {admin?<Sidebar />:null}
    {superAdmin?<SuperSidebar />:null}
    {student?<StudentSidebar />:null}

    {admin||superAdmin||student?<div className='fixed top-4 right-20'>
      <DropdownMenu>
      <DropdownMenuTrigger><div className='text-gray-700 p-2 rounded-md border-2 hover:border-gray-700'><RxHamburgerMenu size={30}/></div></DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            admin?Navigator('/adminDashboard/main/home'):superAdmin?Navigator('/superAdminDashboard/main/home'):Navigator('/studentDashboard/settings/profile')
          }}

        >Profile</DropdownMenuItem>
        <DropdownMenuItem onClick={()=>{
          admin?Navigator('/adminDashboard/settings/security'):superAdmin?Navigator('/superAdminDashboard/settings/security'):Navigator('/ResetPassword')
        }}>Security</DropdownMenuItem>
        <DropdownMenuItem onClick={()=>{admin?handleLogoutAdmin():superAdmin?handleSuperAdminLogout():handleStudentLogout()}}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </div>:null}

    {loading?<Loadingpage />:null}

          <Routes>
            
            {/* <Route path='*' element={<Role />} /> */}

            <Route path='/' element={<Role />}></Route>
            <Route path='/studentLogin' element={<Studentlogin />} />
            <Route path='/forgetPass' element={<ForgetPassword />} />
            <Route path='/StudentSignUp' element={<StudentSignUp />} />
            <Route path='/VerifyOtp' element={<VerifyOtp/>} />

            {/* Students */}
            <Route path='/studentDashboard/main/home' element={<Dashboard />} />
            <Route path='/studentDashboard/settings/profile' element={<StudentProfileSettings />} />
            <Route path='/studentDashboard/complaints/register' element={<Register />} />
            <Route path='/studentDashboard/complaints/status' element={<ComplaintStatus />} />
            <Route path='/studentDashboard/mess/menu' element={<NewMenu />} />

            
            {/* Admin Routes */}
            <Route path='/adminLogin' element={<Adminlogin />} />
            <Route path='/sandbox' element={<Sandbox />} />
            <Route path='/adminDashboard/main/home' element={<AdminDashboard />} />
            <Route path='/ResetPassword' element={<ResetPassword/>} />
            <Route path='/adminDashboard/studentInfo/register' element={<RegisterStudent/>} />
            <Route path='/adminDashboard/studentInfo/update' element={<UpdateStudent/>} />
            <Route path='/adminDashboard/studentInfo/viewInfo' element={<ViewInfo />} />
            <Route path='/adminDashboard/studentInfo/uploadInfo' element={<UploadInfo />} />
            <Route path='/adminDashboard/roomInfo/allotRooms' element={<AllotRooms />} />
            <Route path='/adminDashboard/complaints/complaints' element={<Complaints />} />
            <Route path='/adminDashboard/notice/uploadNotice' element={<UploadNotice />} />
            <Route path='/adminDashboard/notice/viewNotice' element={<ViewNotice />} />
            <Route path='/adminDashboard/settings/security' element={<AdminSecuritysettings />} />

            {/*super Admin Routes  */}
            <Route path='/superAdminLogin' element={<SuperAdminLogin />} />
            <Route path='/superAdminLogin/superAdminOtp' element={<SuperAdminOtp/>} />
            <Route path='/superAdminDashboard/main/home' element={<Home />} />
            <Route path='/superAdminDashboard/hostels/manageAdmins' element={<ManageAdmin />} />
            <Route path='/superAdminDashboard/hostels/manageHostels' element={<ManageHostels />} />
            <Route path='/superAdminDashboard/roomActions/allocateRooms' element={<RoomsUpload />} />
            <Route path='/superAdminDashboard/roomActions/manageRooms' element={<ManageRooms />} />
            <Route path='/superAdminDashboard/settings/security' element={<Securitysettings />} />
            <Route path='/superAdminDashboard/studentActions/addCourses' element={<AddCourses />} />
            
        </Routes>    
    </>
  )
}

export default App;
