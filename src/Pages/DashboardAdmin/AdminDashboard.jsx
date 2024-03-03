import styles from './AdminDashboard.module.scss';
import Sidebar from "../../components/Sidebar/Sidebar";
import Roomsbargraph from '../../components/Roomsbargraph/Roomsbargraph';
import ComplaintBox from '../../components/ComplaintBox/ComplaintBox';
import {lazy, Suspense, useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loadingpage from '../../components/Loadingpage/Loadingpage';
import { CiLogout } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../config/config';
import { removeUserData } from '../../Store/Reducers/userSlice';
// Lazy Imports
const StudentUploadInfo = lazy(()=>import('./StudentsInfo/UploadInfo/UploadInfo'));
const StudentViewInfo = lazy(()=>import('./StudentsInfo/ViewInfo/ViewInfo'));
const RoomsAllotement = lazy(()=>import('./RoomInfo/AllotRooms/AllotRooms'));

import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const AdminDashboard = ()=>{
    const Dispatcher = useDispatch();
    const activeOptions = useSelector(state => state.sideBarStates.activeSubOption);
    const [loadingPage,setLoadingPage] = useState(false); 
    const [isLoggedIn,setisLoggedIn] = useState(false);
    const Navigator = useNavigate();

    useEffect(()=>{
        axios.get('http://localhost:3000/HA/isCookie',config)
        .then(res=>{console.log(res);setisLoggedIn(true)})
        .catch(err=>{console.log(err);Navigator('/adminLogin')});

    },[])


    // const driverObj = driver({
    //     showProgress: true,
    //     steps: [
    //       { element: '#logout', popover: { title: 'Logout Out Button', description: 'Press this Button To logout from Dashboard', side: "left", align: 'start' }},
    //       { element: '#Sidebar', popover: { title: 'Side Navbar', description: 'Navbar is a navigation tool for our Dashboard', side: "right", align: 'start' }},
    //       { element: '#userIconSidebar', popover: { title: '', description: 'Navbar is a navigation tool for our Dashboard', side: "right", align: 'start' }}
    //     ]
    //   });
      
    //   driverObj.drive();



const handleLogout = ()=>{
    console.log('called');
    setLoadingPage(true);
    const config = {
        headers: {
          "Content-Type": "application/json"
          },
          withCredentials: true
        }
    axios.get('http://localhost:3000/HA/adminLogout',config)
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
    })
}   

return <>
    {!isLoggedIn||loadingPage?<Loadingpage />:<div className={styles.container}>

    <div className={styles.sideBarSpace}>
        <Sidebar/>
        </div>

        {/* Home */}
        {activeOptions==='Home'?
        <div className={styles.contentSpace}>
        <div className={styles.Header+ ' text-3xl'}><h1>Welcome To Vivekanand Hostel</h1></div>
        <div className={styles.roomsBarGraph}>
            <Roomsbargraph />
        </div>
        <div className={styles.complaintBox}>
            <ComplaintBox />
        </div>
        </div>
        :null}


        {/* Student Info Module*/}
        {activeOptions==='siUploadInfo'?
        <div className={styles.contentSpace}>
            <Suspense fallback={<Loadingpage />}>
                <StudentUploadInfo />
            </Suspense>
        </div>
        :null}

        {activeOptions==='siViewInfo'?
        <div className={styles.contentSpace}>
            <Suspense fallback={<Loadingpage />}>
                <StudentViewInfo />
            </Suspense>
        </div>
        :null}


        {/* Room Allotement Module */}

        {activeOptions==='riAllotRoom'?
        <div className={styles.contentSpace}>
            <Suspense fallback={<Loadingpage />}>
                <RoomsAllotement />
            </Suspense>
        </div>
        :null}


        <div id="logout" onClick={handleLogout} className="border-2 border-blue-500 text-blue-500 hover:text-white hover:bg-blue-500 px-4 py-2 cursor-pointer font-semibold rounded-md text-xl flex justify-center items-center gap-1 absolute top-8 right-8" >
        <div className=""><CiLogout  /></div>
            Logout
        </div>


    </div>}
</>
}

export default AdminDashboard;