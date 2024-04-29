import { useEffect, useState } from 'react';
import styles from './SuperSidebar.module.scss';
import { FaUserLarge } from "react-icons/fa6";
import { IconContext } from 'react-icons';
import { IoHome } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa6";
import { FaInfo } from "react-icons/fa";
import { MdOutlineBedroomChild } from "react-icons/md";
import { FaGear } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import { BsHouses } from "react-icons/bs";
import { useLocation,useNavigate } from 'react-router-dom';

export default function SuperSidebar(){


    const Navigator = useNavigate();
    const param = useLocation();
    const [activeOption,setActiveOption] = useState('main');
    const [activeSubOption,setActiveSubOption] = useState('home');

    const [state,changeState] = useState(false);   
    const [userData,setUserData] = useState({});

    useEffect(()=>{
        setActiveOption(param.pathname.split('/')[2]);
        setActiveSubOption(param.pathname.split('/')[3]);
    },[param]);


    const [subHome,setSubHome] = useState(false);
    const [subStudent, setSubStudent] = useState(false);
    const [subRoom, setSubRoom] = useState(false);
    const [subSettings, setSubSettings] = useState(false);
    const [subHostel,setSubHostel] = useState(false);


    const changeSubMenu = (value)=>{

        if(value === 'Home'){
            setSubHome(prev => !prev);
            setSubStudent(false);
            setSubRoom(false);
            setSubSettings(false);
            setSubHostel(false);
        }else if(value ==='studentInfo'){
            setSubHome(false);
            setSubStudent(prev => !prev);
            setSubRoom(false);
            setSubSettings(false);
            setSubHostel(false);

        }else if(value === 'roomActions'){
            setSubHome(false);
            setSubStudent(false);
            setSubRoom(prev=>!prev);
            setSubSettings(false);
            setSubHostel(false);

        }else if(value === 'settings'){
            setSubHome(false);
            setSubStudent(false);
            setSubRoom(false);
            setSubSettings(prev=>!prev);
            setSubHostel(false);

        }else if(value=='hostels'){
            setSubHome(false);
            setSubStudent(false);
            setSubRoom(false);
            setSubSettings(false);
            setSubHostel(prev=>!prev);
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
                {userData.avatar!=undefined?<img className={styles.avatarImage} src={userData.avatar} />:<FaUserLarge size="1.5em" color="white"/>}
                </div>
                <div className={state?null:styles.hidden} style={{marginLeft:'8px',marginTop:'0px'}}><p>{userData.name!==undefined?userData.name:'Null'}<br/><span className={styles.userRole} style={{fontSize:'12px'}}>{userData.roleType!==undefined?`Role: ${userData.roleType}`:'Role: Null'}</span></p></div>
            </div>
            <div className={styles.listContainer}>
            <div  className={(styles.item) +' '+' '+(state?styles.ItemOpenMenu:styles.ItemCloseMenu)}>
                        <p onClick={()=>{changeSubMenu('Home')}} className={(activeOption==='main'?styles.activeItem:null) + ' flex items-center gap-2'}><i><IoHome  size="20px"/></i> <span className={(state?null:styles.hidden)+' mt-1'}>Main</span></p>
                        <ul className={state&&subHome?null:styles.hidden} >
                        <li onClick={()=>{Navigator('/superAdminDashboard/main/home')}} className={styles.subOptions+' ' + (activeSubOption==='home'?styles.activeSubOption:null)}>Home</li>
                        </ul>
            </div>
            <div  className={styles.item +' '+(state?styles.ItemOpenMenu:styles.ItemCloseMenu)}>
                        <p onClick={()=>{changeSubMenu('studentInfo')}} className={(activeOption==='studentActions'?styles.activeItem:null)+ ' flex items-center gap-2'}><FaInfo /> <span className={(state?null:styles.hidden)+' mt-1'}>Student Actions</span></p>
                        <ul className={state&&subStudent?null:styles.hidden}>
                        <li onClick={()=>{Navigator('/superAdminDashboard/studentActions/viewInfo')}} className={styles.subOptions+' ' + (activeSubOption==='viewInfo'?styles.activeSubOption:null)}>View Info</li>
                        <li onClick={()=>{Navigator('/superAdminDashboard/studentActions/addCourses')}} className={styles.subOptions+' ' + (activeSubOption==='addCourses'?styles.activeSubOption:null)}>Add Courses</li>
                        </ul>
            </div>
            <div  className={styles.item +' '+(state?styles.ItemOpenMenu:styles.ItemCloseMenu)}>
                        <p onClick={()=>{changeSubMenu('roomActions')}} className={(activeOption==='roomActions'?styles.activeItem:null)+ ' flex items-center gap-2'}><MdOutlineBedroomChild /> <span className={(state?null:styles.hidden)+' mt-1'}>Room Actions</span></p>
                        <ul className={state&&subRoom?null:styles.hidden}>
                        <li onClick={()=>{Navigator('/superAdminDashboard/roomActions/allocateRooms')}} className={(state?null:styles.hidden)+' '+styles.subOptions+' ' + (activeSubOption==='allocateRooms'?styles.activeSubOption:null)}>Allocate</li>
                        </ul>
            </div>
            <div  className={styles.item +' '+(state?styles.ItemOpenMenu:styles.ItemCloseMenu)}>
                        <p onClick={()=>{changeSubMenu('hostels')}} className={(activeOption==='hostels'?styles.activeItem:null)+ ' flex items-center gap-2'}><BsHouses /> <span className={(state?null:styles.hidden)+' mt-1'}>Hostels</span></p>
                        <ul className={state&&subHostel?null:styles.hidden}>
                        <li onClick={()=>{Navigator('/superAdminDashboard/hostels/manageHostels')}} className={(state?null:styles.hidden)+' '+styles.subOptions+' ' + (activeSubOption==='manageHostels'?styles.activeSubOption:null)}>Manage Hostels</li>
                        <li onClick={()=>{Navigator('/superAdminDashboard/hostels/manageAdmins')}} className={(state?null:styles.hidden)+' '+styles.subOptions+' ' + (activeSubOption==='manageAdmins'?styles.activeSubOption:null)}>Manage Admins</li>
                        </ul>
            </div>
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
                    <li className='cursor-pointer flex flex-col text-xl font-semibold'><div onClick={()=>{changeSubMenu('Home')}} className={`flex items-center gap-2 ${activeOption==='main'?'text-orange-400':'text-white'}`}><IoHome size='15px'/> Main </div>
                        <ul className={`${subHome?'':'hidden'} text-sm text-white  font-thin ml-8 transition-all`}>
                            <li onClick={()=>{Navigator('/superAdminDashboard/main/home');handleHamBurger()}} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption==='home'?'bg-blue-900 font-normal':''}`}> Home</li>
                        </ul>
                    </li>

                    <li className='mt-4 cursor-pointer flex flex-col text-xl font-semibold'><div onClick={()=>{changeSubMenu('roomActions')}} className={`flex items-center gap-2 ${activeOption==='roomActions'?'text-orange-400':'text-white'}`}><MdOutlineBedroomChild size="15px" /> Rooms</div>
                        <ul className={`${subRoom?'':'hidden'} text-sm text-white  font-thin ml-8 transition-all`}>
                            <li onClick={()=>{Navigator('/superAdminDashboard/roomActions/allocateRooms');handleHamBurger()}} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption==='allocateRooms'?'bg-blue-900 font-normal':''}`}> Allot Rooms</li>
                        </ul>
                    </li>

                    <li className='mt-4 cursor-pointer flex flex-col text-xl font-semibold'><div onClick={()=>{changeSubMenu('hostels')}} className={`flex items-center gap-2 ${activeOption==='studentInfo'?'text-orange-400':'text-white'}`}><FaInfo size='15px' />  Hostels</div>
                        <ul className={`${subHostel?'':'hidden'} text-sm text-white  font-thin ml-8 transition-all`}>
                            <li onClick={()=>{Navigator('/superAdminDashboard/hostels/manageHostels');handleHamBurger()}} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption==='manageHostels'?'bg-blue-900 font-normal':''}`}> Manage Hostels</li>
                            <li onClick={()=>{Navigator('/superAdminDashboard/hostels/manageAdmins');handleHamBurger()}} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption==='manageAdmin'?'bg-blue-900 font-normal':''}`}> Manage Admins</li>
                        </ul>
                    </li>


                </ul>
                <div onClick={handleLogout} className='absolute bottom-16 cursor-pointer left-[40%] text-white'>
                Logout
            </div>
            </div>

        </div>
    </>
}


