import styles from './AdminDashboard.module.scss';
import Sidebar from "../../Components/Sidebar/Sidebar";
import Roomsbargraph from '../../Components/Roomsbargraph/Roomsbargraph';
import ComplaintBox from '../../Components/ComplaintBox/ComplaintBox';
import {lazy, Suspense, useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import Loadingpage from '../../Components/Loadingpage/Loadingpage';
import { CiLogout } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../config/config';
// Lazy Imports
const StudentUploadInfo = lazy(()=>import('./StudentsInfo/UploadInfo/UploadInfo'));
const StudentViewInfo = lazy(()=>import('./StudentsInfo/ViewInfo/ViewInfo'));
const RoomsAllotement = lazy(()=>import('./RoomInfo/AllotRooms/AllotRooms'));
const RoomsUpload = lazy(()=>import('./RoomInfo/UploadInfo/RoomsUpload'));
const Hostels = lazy(()=>import('./SuperAdmin/Hostels/Hostels'));
const Courses = lazy(()=>import('./SuperAdmin/Courses/Courses'));
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const AdminDashboard = ()=>{
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
        Navigator('/adminLogin');
    })
    .catch(err=>{
        setLoadingPage(false);
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

        {activeOptions==='riUploadInfo'?
        <div className={styles.contentSpace}>
            <Suspense fallback={<Loadingpage />}>
                <RoomsUpload />
            </Suspense>
        </div>
        :null}
        
        {activeOptions==='saHostels'?
        <div className={styles.contentSpace}>
            <Suspense fallback={<Loadingpage />}>
                <Hostels />
            </Suspense>
        </div>
        :null}
        {activeOptions==='saCourses'?
        <div className={styles.contentSpace}>
            <Suspense fallback={<Loadingpage />}>
                <Courses />
            </Suspense>
        </div>
        :null}



        <div id="logout" onClick={handleLogout} className={styles.logout}>
        <div className={styles.logoutIcon}><CiLogout  /></div>
        Logout
    </div>


    </div>}
</>
}

export default AdminDashboard;