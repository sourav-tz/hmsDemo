import { useEffect, useState } from 'react';
import styles from './Sidebar.module.scss';
import { FaUserLarge } from "react-icons/fa6";
import { IconContext } from 'react-icons';
import { IoHome } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa6";
import { FaInfo } from "react-icons/fa";
import { MdLocalHotel, MdOutlineBedroomChild } from "react-icons/md";
import { FaGear } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import { BsHouses } from "react-icons/bs";
import { useLocation,useNavigate } from 'react-router-dom';
import { SlSupport } from "react-icons/sl";
import { MdFoodBank } from "react-icons/md";
import { FaNoteSticky } from "react-icons/fa6";
import { FaRegFileAlt } from 'react-icons/fa';


export default function StudentSidebar(){


    const Navigator = useNavigate();
    const param = useLocation();
    const [activeOption,setActiveOption] = useState('main');
    const [activeSubOption,setActiveSubOption] = useState('home');
    const userData = useSelector(state=>state.userStorage.data);
    const [state,changeState] = useState(false);
    const [isTempStudent, setIsTempStudent] = useState(false);
    console.log("Student side bar")
    console.log(userData);

    // This effect runs when userData changes (e.g., after login or when Redux store updates)
    useEffect(() => {
        // Enhanced debug logging
        console.log("==================== SIDEBAR DEBUG ====================");
        console.log("User data in sidebar:", userData);
        console.log("localStorage role:", localStorage.getItem('role'));
        console.log("localStorage email:", localStorage.getItem('email'));
        console.log("localStorage tempStatus:", localStorage.getItem('tempStatus'));
        console.log("======================================================");

        // Determine if the user is a temporary student based on userData (from Redux)
        let tempStudentStatus = false;

        if (userData) {
            // If we have userData, use it as the source of truth
            if (userData.roleType === 'TempStudent') {
                console.log("Setting isTempStudent to true from userData");
                tempStudentStatus = true;
                // Sync localStorage with userData
                localStorage.setItem('role', 'TempStudent');
            } else if (userData.roleType === 'Student' || userData.role === 'Student') {
                console.log("Setting isTempStudent to false from userData (Student role)");
                tempStudentStatus = false;
                // Sync localStorage with userData
                localStorage.setItem('role', 'Student');
            } else {
                // Handle other cases - default to non-temp student
                console.log("User has unknown role - defaulting to regular student");
                tempStudentStatus = false;
            }
        } else {
            // Fallback to localStorage if userData is not available
            tempStudentStatus = localStorage.getItem('role') === 'TempStudent';
            console.log("No userData, using localStorage role:", localStorage.getItem('role'));
            console.log("Setting isTempStudent to:", tempStudentStatus);
        }

        // Update state only if it's different to avoid unnecessary re-renders
        if (tempStudentStatus !== isTempStudent) {
            console.log("Updating isTempStudent state from", isTempStudent, "to", tempStudentStatus);
            setIsTempStudent(tempStudentStatus);
        } else {
            console.log("No change in isTempStudent state:", isTempStudent);
        }
    }, [userData, isTempStudent])

    useEffect(()=>{
        setActiveOption(param.pathname.split('/')[2]);
        setActiveSubOption(param.pathname.split('/')[3]);
    },[param]);


    const [subHome,setSubHome] = useState(false);
    const [subComplaint, setSubComplaint] = useState(false);
    const [subMess, setSubMess] = useState(false);
    const [subSettings, setSubSettings] = useState(false);
    const [subHostel,setSubHostel] = useState(false);
    const [subNotice,setSubNotice] = useState(false);
    const [subReferral,setSubReferral] = useState(false);
    const [subRequest,setRequest] = useState(false);


    const changeSubMenu = (value)=>{

        if(value === 'Home'){
            setSubHome(prev => !prev);
            setSubComplaint(false);
            setSubMess(false);
            setSubSettings(false);
            setSubHostel(false);
            setSubNotice(false);
            setSubReferral(false);
            setRequest(false);
        }else if(value ==='complaints'){
            setSubHome(false);
            setSubComplaint(prev => !prev);
            setSubMess(false);
            setSubSettings(false);
            setSubHostel(false);
            setSubNotice(false);
            setSubReferral(false);
            setRequest(false);

        }else if(value ==='request'){
            setSubHome(false);
            setSubComplaint(false);
            setSubMess(false);
            setSubSettings(false);
            setSubHostel(false);
            setSubNotice(false);
            setSubReferral(false);
            setRequest(prev => !prev);

        }else if(value === 'mess'){
            setSubHome(false);
            setSubComplaint(false);
            setSubMess(prev=>!prev);
            setSubSettings(false);
            setSubHostel(false);
            setSubNotice(false);
            setSubReferral(false);
            setRequest(false);

        }else if(value === 'settings'){
            setSubHome(false);
            setSubComplaint(false);
            setSubMess(false);
            setSubSettings(prev=>!prev);
            setSubHostel(false);
            setSubNotice(false);
            setSubReferral(false);
            setRequest(false);

        }else if(value=='hostels'){
            setSubHome(false);
            setSubComplaint(false);
            setSubMess(false);
            setSubSettings(false);
            setSubHostel(prev=>!prev);
            setSubNotice(false);
            setSubReferral(false);
            setRequest(false);
        }
        else if(value=='notices'){
            setSubHome(false);
            setSubComplaint(false);
            setSubMess(false);
            setSubSettings(false);
            setSubHostel(false);
            setSubNotice(prev=>!prev);
            setSubReferral(false);
            setRequest(false);
        }
        else if(value == 'referral'){
            setSubHome(false);
            setSubComplaint(false);
            setSubMess(false);
            setSubSettings(false);
            setSubHostel(false);
            setSubNotice(false);
            setSubReferral(prev=>!prev);
            setRequest(false);
        }

    }

    const toggleMenue = ()=>{
        changeState(prev=>!prev);
    }

    const openMenu = ()=>{
        changeState(true);
    }

    const closeMenu = ()=>{
        changeState(false);
    }


    const handleHamBurger = ()=>{
        toggleMenue();
        const ham1 = document.getElementById('ham1');
        const ham2 = document.getElementById('ham2');
        const ham3 = document.getElementById('ham3');
        ham1.classList.toggle('rotate-45');
        ham2.classList.toggle('hidden');
        ham3.classList.toggle('mt-1');
        ham3.classList.toggle('relative');
        ham3.classList.toggle('-top-[0.25rem]');
        ham3.classList.toggle('rotate-[-45deg]');
    }


const handleLogout = ()=>{}



    return<>
    <IconContext.Provider value={{size:"20px"}} >
        <div id="Sidebar" onMouseOver={()=>(openMenu())} onMouseLeave={()=>(closeMenu())} className={'hidden md:block ' + (styles.sidebarContainer)+' '+(state?styles.active:styles.inActive)}>
           <div className={styles.itemsContainer}>
            <div className={styles.userItem}>
                <div id="userIconSidebar" className={styles.userIcon}>
                {userData?.avatar!=undefined?<img className={styles.avatarImage} src={userData?.avatar} />:<FaUserLarge size="1.5em" color="white"/>}
                </div>
                <div className={state?null:styles.hidden} style={{marginLeft:'8px',marginTop:'0px'}}><p>{userData?.firstName!==undefined?userData?.firstName+' '+userData?.lastName:'Null'}<br/><span className={styles.userRole} style={{fontSize:'12px'}}>{userData?.roleType!==undefined?`Role: ${userData?.roleType}`:'Role: Null'}</span></p></div>
            </div>

            {/* Main */}
            <div className={styles.listContainer}>
            {/* Main menu - always show but with different options for temp students */}
            <div className={(styles.item) +' '+' '+(state?styles.ItemOpenMenu:styles.ItemCloseMenu)}>
                <p onClick={()=>{changeSubMenu('Home')}} className={(activeOption==='main'?styles.activeItem:null) + ' flex items-center gap-2'}><i><IoHome size="20px"/></i> <span className={(state?null:styles.hidden)+' mt-1'}>Main</span></p>
                <ul className={state&&subHome?null:styles.hidden}>
                    {/* For temp students, only show self-profiling */}
                    {isTempStudent ? (
                        <li onClick={()=>{Navigator('/studentDashboard/main/selfProfiling')}}
                            className={styles.subOptions+' ' + (activeSubOption==='selfProfiling'?styles.activeSubOption:null)}>
                            Student Self Profiling
                        </li>
                    ) : (
                        <>
                            <li onClick={()=>{Navigator('/studentDashboard/main/home')}}
                                className={styles.subOptions+' ' + (activeSubOption==='home'?styles.activeSubOption:null)}>
                                Home
                            </li>
                            <li onClick={()=>{Navigator('/studentDashboard/main/selfProfiling')}}
                                className={styles.subOptions+' ' + (activeSubOption==='selfProfiling'?styles.activeSubOption:null)}>
                                Student Self Profiling
                            </li>
                        </>
                    )}
                </ul>
            {/* Main menu - always show but with different options for temp students */}
            <div className={(styles.item) +' '+' '+(state?styles.ItemOpenMenu:styles.ItemCloseMenu)}>
                <p onClick={()=>{changeSubMenu('Home')}} className={(activeOption==='main'?styles.activeItem:null) + ' flex items-center gap-2'}><i><IoHome size="20px"/></i> <span className={(state?null:styles.hidden)+' mt-1'}>Main</span></p>
                <ul className={state&&subHome?null:styles.hidden}>
                    {/* For temp students, only show self-profiling */}
                    {isTempStudent ? (
                        <li onClick={()=>{Navigator('/studentDashboard/main/selfProfiling')}}
                            className={styles.subOptions+' ' + (activeSubOption==='selfProfiling'?styles.activeSubOption:null)}>
                            Student Self Profiling
                        </li>
                    ) : (
                        <>
                            <li onClick={()=>{Navigator('/studentDashboard/main/home')}}
                                className={styles.subOptions+' ' + (activeSubOption==='home'?styles.activeSubOption:null)}>
                                Home
                            </li>
                            <li onClick={()=>{Navigator('/studentDashboard/main/selfProfiling')}}
                                className={styles.subOptions+' ' + (activeSubOption==='selfProfiling'?styles.activeSubOption:null)}>
                                Student Self Profiling
                            </li>
                        </>
                    )}
                </ul>
            </div>

            {/* Only show these menus for regular students */}
            {!isTempStudent && (
                <>
                    <div className={styles.item +' '+(state?styles.ItemOpenMenu:styles.ItemCloseMenu)}>
            {/* Only show these menus for regular students */}
            {!isTempStudent && (
                <>
                    <div className={styles.item +' '+(state?styles.ItemOpenMenu:styles.ItemCloseMenu)}>
                        <p onClick={()=>{changeSubMenu('complaints')}} className={(activeOption==='complaints'?styles.activeItem:null)+ ' flex items-center gap-2'}><SlSupport /> <span className={(state?null:styles.hidden)+' mt-1'}>Complaint</span></p>
                        <ul className={state&&subComplaint?null:styles.hidden}>
                            <li onClick={()=>{Navigator('/studentDashboard/complaints/register')}} className={styles.subOptions+' ' + (activeSubOption==='register'?styles.activeSubOption:null)}>Register</li>
                            <li onClick={()=>{Navigator('/studentDashboard/complaints/status')}} className={styles.subOptions+' ' + (activeSubOption==='status'?styles.activeSubOption:null)}>Status</li>
                            <li onClick={()=>{Navigator('/studentDashboard/complaints/register')}} className={styles.subOptions+' ' + (activeSubOption==='register'?styles.activeSubOption:null)}>Register</li>
                            <li onClick={()=>{Navigator('/studentDashboard/complaints/status')}} className={styles.subOptions+' ' + (activeSubOption==='status'?styles.activeSubOption:null)}>Status</li>
                        </ul>
            </div>
            {/* Application  */}
            <div  className={styles.item +' '+(state?styles.ItemOpenMenu:styles.ItemCloseMenu)}>
                        <p onClick={()=>{changeSubMenu('request')}} className={(activeOption==='request'?styles.activeItem:null)+ ' flex items-center gap-2'}><FaRegFileAlt /> <span className={(state?null:styles.hidden)+' mt-1'}>Application</span></p>
                        <ul className={state&&subRequest?null:styles.hidden}>
                        <li onClick={()=>{Navigator('/studentDashboard/student/application')}} className={styles.subOptions+' ' + (activeSubOption==='application'?styles.activeSubOption:null)}>New Application</li>
                        <li onClick={()=>{Navigator('/studentDashboard/student/applicationstatus')}} className={styles.subOptions+' ' + (activeSubOption==='applicationstatus'?styles.activeSubOption:null)}>Status of Application</li>
                        </ul>
            </div>
            {/* Student Notices */}
            <div  className={styles.item +' '+(state?styles.ItemOpenMenu:styles.ItemCloseMenu)}>
                        <p onClick={()=>{changeSubMenu('notices')}} className={(activeOption==='notices'?styles.activeItem:null)+ ' flex items-center gap-2'}><FaNoteSticky /> <span className={(state?null:styles.hidden)+' mt-1'}>Notices</span></p>
                        <ul className={state&&subNotice?null:styles.hidden}>
                            <li onClick={()=>{Navigator('/studentDashboard/notices/view')}} className={styles.subOptions+' ' + (activeSubOption==='view'?styles.activeSubOption:null)}>View Notices</li>
                            <li onClick={()=>{Navigator('/studentDashboard/notices/view')}} className={styles.subOptions+' ' + (activeSubOption==='view'?styles.activeSubOption:null)}>View Notices</li>
                        </ul>
            </div>


            {/* Menu */}
            <div  className={styles.item +' '+(state?styles.ItemOpenMenu:styles.ItemCloseMenu)}>
                        <p onClick={()=>{changeSubMenu('mess')}} className={(activeOption==='mess'?styles.activeItem:null)+ ' flex items-center gap-2'}><MdFoodBank /> <span className={(state?null:styles.hidden)+' mt-1'}>Mess</span></p>
                        <ul className={state&&subMess?null:styles.hidden}>
                            <li onClick={()=>{Navigator('/studentDashboard/mess/menu')}} className={(state?null:styles.hidden)+' '+styles.subOptions+' ' + (activeSubOption==='menu'?styles.activeSubOption:null)}>New Mess Menu</li>
                            <li onClick={()=>{Navigator('/studentDashboard/mess/menu')}} className={(state?null:styles.hidden)+' '+styles.subOptions+' ' + (activeSubOption==='menu'?styles.activeSubOption:null)}>New Mess Menu</li>
                        </ul>
                    </div>
                    </div>

                    {/* Verify Guest Referral */}
                    <div className={styles.item +' '+(state?styles.ItemOpenMenu:styles.ItemCloseMenu)}>
                    {/* Verify Guest Referral */}
                    <div className={styles.item +' '+(state?styles.ItemOpenMenu:styles.ItemCloseMenu)}>
                        <p onClick={()=>{changeSubMenu('referral')}} className={(activeOption==='referral'?styles.activeItem:null)+ ' flex items-center gap-2'}><MdLocalHotel /><span className={(state?null:styles.hidden)+' mt-1'}>Guest Referral</span></p>
                        <ul className={state&&subReferral?null:styles.hidden}>
                            <li onClick={()=>{Navigator('/studentDashboard/guest/referral')}} className={(state?null:styles.hidden)+' '+styles.subOptions+' ' + (activeSubOption==='referral'?styles.activeSubOption:null)}>Verify Guest Referral</li>
                            <li onClick={()=>{Navigator('/studentDashboard/guest/referral')}} className={(state?null:styles.hidden)+' '+styles.subOptions+' ' + (activeSubOption==='referral'?styles.activeSubOption:null)}>Verify Guest Referral</li>
                        </ul>
                    </div>
                </>
            )}

            {/* Remove the message from sidebar */}

            {/* <div  className={styles.item +' '+(state?styles.ItemOpenMenu:styles.ItemCloseMenu)}>
                        <p onClick={()=>{changeSubMenu('hostels')}} className={(activeOption==='hostels'?styles.activeItem:null)+ ' flex items-center gap-2'}><BsHouses /> <span className={(state?null:styles.hidden)+' mt-1'}>Hostels</span></p>
                        <ul className={state&&subHostel?null:styles.hidden}>
                        <li onClick={()=>{Navigator('/superAdminDashboard/hostels/manageHostels')}} className={(state?null:styles.hidden)+' '+styles.subOptions+' ' + (activeSubOption==='manageHostels'?styles.activeSubOption:null)}>Manage Hostels</li>
                        <li onClick={()=>{Navigator('/superAdminDashboard/hostels/manageAdmins')}} className={(state?null:styles.hidden)+' '+styles.subOptions+' ' + (activeSubOption==='manageAdmins'?styles.activeSubOption:null)}>Manage Admins</li>
                        </ul>
            </div> */}
            </div>
                    </div>
                </>
            )}

            {/* Remove the message from sidebar */}

            {/* <div  className={styles.item +' '+(state?styles.ItemOpenMenu:styles.ItemCloseMenu)}>
                        <p onClick={()=>{changeSubMenu('hostels')}} className={(activeOption==='hostels'?styles.activeItem:null)+ ' flex items-center gap-2'}><BsHouses /> <span className={(state?null:styles.hidden)+' mt-1'}>Hostels</span></p>
                        <ul className={state&&subHostel?null:styles.hidden}>
                        <li onClick={()=>{Navigator('/superAdminDashboard/hostels/manageHostels')}} className={(state?null:styles.hidden)+' '+styles.subOptions+' ' + (activeSubOption==='manageHostels'?styles.activeSubOption:null)}>Manage Hostels</li>
                        <li onClick={()=>{Navigator('/superAdminDashboard/hostels/manageAdmins')}} className={(state?null:styles.hidden)+' '+styles.subOptions+' ' + (activeSubOption==='manageAdmins'?styles.activeSubOption:null)}>Manage Admins</li>
                        </ul>
            </div> */}
            </div>
            </div>
        </div>
    </IconContext.Provider>

    <div className={`block w-full ${state?'h-full':'h-[60px]'} fixed transition-all top-0 left-0 backdrop-blur-md z-50 md:hidden`}>
        <div className='h-full w-full bg-[#131133] absolute top-0 left-0 opacity-85 -z-1'></div>
            <div className='w-full h-[60px] absolute top-0 left-0 items-center p-4 flex z-50'>
                <div className='flex-1'>
                    <h2 className='text-white'>NIT Hms</h2>
                </div>
                <div onClick={handleHamBurger} className='cursor-pointer'>
                    <div id='ham1' className='w-[25px] h-[4px] bg-white rounded-sm origin-center transition-all'></div>
                    <div id='ham2' className='w-[25px] h-[4px] bg-white rounded-sm mt-1 transition-all'></div>
                    <div id='ham3' className='w-[25px] h-[4px] bg-white rounded-sm mt-1 origin-center transition-all'></div>
                </div>
            </div>
            <div className={`${state?'':'hidden'} absolute w-full h-full top-0 left-[0] flex justify-center items-center text-white`}>

            
                <ul>
                    <li className='cursor-pointer flex flex-col text-xl font-semibold'>
                        <div onClick={()=>{changeSubMenu('Home')}} className={`flex items-center gap-2 ${activeOption==='main'?'text-orange-400':'text-white'}`}>
                            <IoHome size='15px'/> Main
                        </div>
                        <ul className={`${subHome?'':'hidden'} text-sm text-white font-thin ml-8 transition-all`}>
                            {/* For temp students, only show self-profiling */}
                            {isTempStudent ? (
                                <li onClick={()=>{Navigator('/studentDashboard/main/selfProfiling');handleHamBurger()}}
                                    className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption==='selfProfiling'?'bg-blue-900 font-normal':''}`}>
                                    Self Profiling
                                </li>
                            ) : (
                                <>
                                    <li onClick={()=>{Navigator('/studentDashboard/main/home');handleHamBurger()}}
                                        className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption==='home'?'bg-blue-900 font-normal':''}`}>
                                        Home
                                    </li>
                                    <li onClick={()=>{Navigator('/studentDashboard/main/selfProfiling');handleHamBurger()}}
                                        className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption==='selfProfiling'?'bg-blue-900 font-normal':''}`}>
                                        Self Profiling
                                    </li>
                                </>
                            )}
                    <li className='cursor-pointer flex flex-col text-xl font-semibold'>
                        <div onClick={()=>{changeSubMenu('Home')}} className={`flex items-center gap-2 ${activeOption==='main'?'text-orange-400':'text-white'}`}>
                            <IoHome size='15px'/> Main
                        </div>
                        <ul className={`${subHome?'':'hidden'} text-sm text-white font-thin ml-8 transition-all`}>
                            {/* For temp students, only show self-profiling */}
                            {isTempStudent ? (
                                <li onClick={()=>{Navigator('/studentDashboard/main/selfProfiling');handleHamBurger()}}
                                    className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption==='selfProfiling'?'bg-blue-900 font-normal':''}`}>
                                    Self Profiling
                                </li>
                            ) : (
                                <>
                                    <li onClick={()=>{Navigator('/studentDashboard/main/home');handleHamBurger()}}
                                        className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption==='home'?'bg-blue-900 font-normal':''}`}>
                                        Home
                                    </li>
                                    <li onClick={()=>{Navigator('/studentDashboard/main/selfProfiling');handleHamBurger()}}
                                        className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption==='selfProfiling'?'bg-blue-900 font-normal':''}`}>
                                        Self Profiling
                                    </li>
                                </>
                            )}
                        </ul>
                    </li>

                    {/* Complaints */}
                    <li className='cursor-pointer flex flex-col text-xl font-semibold'><div onClick={()=>{changeSubMenu('complaints')}} className={`flex items-center gap-2 ${activeOption==='complaints'?'text-orange-400':'text-white'}`}><SlSupport size='15px'/> Complaints </div>
                        <ul className={`${subComplaint?'':'hidden'} text-sm text-white  font-thin ml-8 transition-all`}>
                            <li onClick={()=>{Navigator('/studentDashboard/complaints/register');handleHamBurger()}} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption==='register'?'bg-blue-900 font-normal':''}`}> Register complaints</li>
                            <li onClick={()=>{Navigator('/studentDashboard/complaints/status');handleHamBurger()}} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption==='status'?'bg-blue-900 font-normal':''}`}> Check Status</li>
                        </ul>
                    </li>


                    {/* Applications */}
                    <li className='cursor-pointer flex flex-col text-xl font-semibold'><div onClick={()=>{changeSubMenu('request')}} className={`flex items-center gap-2 ${activeOption==='request'?'text-orange-400':'text-white'}`}><FaRegFileAlt size='15px'/> Applications </div>
                        <ul className={`${subRequest?'':'hidden'} text-sm text-white  font-thin ml-8 transition-all`}>
                            <li onClick={()=>{Navigator('/studentDashboard/student/application');handleHamBurger()}} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption==='application'?'bg-blue-900 font-normal':''}`}> New Application</li>
                            <li onClick={()=>{Navigator('/studentDashboard/student/applicationstatus');handleHamBurger()}} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption==='applicationstatus'?'bg-blue-900 font-normal':''}`}> Application Status</li>
                        </ul>
                    </li>


                    {/* Notices */}
                    <li className='cursor-pointer flex flex-col text-xl font-semibold'><div onClick={()=>{changeSubMenu('notices')}} className={`flex items-center gap-2 ${activeOption==='notices'?'text-orange-400':'text-white'}`}><FaNoteSticky size='15px'/> Notices </div>
                        <ul className={`${subNotice?'':'hidden'} text-sm text-white  font-thin ml-8 transition-all`}>
                            <li onClick={()=>{Navigator('/studentDashboard/notices/view');handleHamBurger()}} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption==='view'?'bg-blue-900 font-normal':''}`}> View Notices</li>
                        </ul>
                    </li>


                    {/* Mess Menu */}
                    <li className='cursor-pointer flex flex-col text-xl font-semibold'><div onClick={()=>{changeSubMenu('mess')}} className={`flex items-center gap-2 ${activeOption==='mess'?'text-orange-400':'text-white'}`}><MdFoodBank size='15px'/> Mess </div>
                        <ul className={`${subMess?'':'hidden'} text-sm text-white  font-thin ml-8 transition-all`}>
                            <li onClick={()=>{Navigator('/studentDashboard/mess/menu');handleHamBurger()}} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption==='menu'?'bg-blue-900 font-normal':''}`}> Mess Menue</li>
                        </ul>
                    </li>


                    {/* Guest */}
                    <li className='cursor-pointer flex flex-col text-xl font-semibold'><div onClick={()=>{changeSubMenu('referral')}} className={`flex items-center gap-2 ${activeOption==='referral'?'text-orange-400':'text-white'}`}><MdLocalHotel size='15px'/> Guest Referral </div>
                        <ul className={`${subReferral?'':'hidden'} text-sm text-white  font-thin ml-8 transition-all`}>
                            <li onClick={()=>{Navigator('/studentDashboard/guest/referral');handleHamBurger()}} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption==='referral'?'bg-blue-900 font-normal':''}`}> Verify Guest Referral</li>
                        </ul>
                    </li>
                </ul>

                <div onClick={handleLogout} className='absolute bottom-16 cursor-pointer left-[40%] text-white'>
                    Logout
                </div>
                    Logout
                </div>
            </div>

        </div>
    </>
}


