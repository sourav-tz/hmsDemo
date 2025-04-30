import { useEffect, useState } from 'react';
import styles from './Sidebar.module.scss';
import { FaUserLarge } from "react-icons/fa6";
import { IconContext } from 'react-icons';
import { IoHome } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa6";
import { FaInfo } from "react-icons/fa";
import { MdLocalHotel, MdOutlineBedroomChild } from "react-icons/md";
import { FaGear } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaNoteSticky } from "react-icons/fa6";
import { SlSupport } from "react-icons/sl";
import { FaRegFileAlt } from 'react-icons/fa';






export default function Sidebar(){

    const param = useLocation();
    const navigator = useNavigate();
    const [activeOption,setActiveOption] = useState('main');
    const [activeSubOption,setActiveSubOption] = useState('home');

    useEffect(()=>{
        setActiveOption(param.pathname.split('/')[2]);
        setActiveSubOption(param.pathname.split('/')[3]);
    },[param]);

    const Navigator = useNavigate();

    const [state,changeState] = useState(false);
    const userData = useSelector(state=>state.userStorage.data);


    const [subHome,setSubHome] = useState(false);
    const [subStudent, setSubStudent] = useState(false);
    const [subRoom, setSubRoom] = useState(false);
    const [subSettings, setSubSettings] = useState(false);
    const [subNotice, setSubNotice] = useState(false);
    const [subComplaint,setSubComplaint] = useState(false);
    const [subApplication,setsubApplication] = useState(false);
    const [subApplicationStatus,setsubApplicationStatus] = useState(false);
    const [subGuest,setSubGuest] = useState(false);

    const openMenu = ()=>{
        changeState(true);
    }

    const closeMenu = ()=>{
        changeState(false);
    }

    const changeSubMenu = (value)=>{

        if(value === 'Home'){
            setSubHome(prev => !prev);
            setSubStudent(false);
            setSubRoom(false);
            setSubSettings(false);
            setSubNotice(false);
            setSubComplaint(false);
            setsubApplication(false);
            setsubApplicationStatus(false);
            setsubApplicationStatus(false);
            setSubGuest(false);
        }else if(value ==='studentInfo'){
            setSubHome(false);
            setSubStudent(prev => !prev);
            setSubRoom(false);
            setSubSettings(false);
            setSubNotice(false);
            setSubComplaint(false);
            setsubApplication(false);
            setsubApplicationStatus(false);
            setsubApplicationStatus(false);
            setSubGuest(false);
        }else if(value === 'roomInfo'){
            setSubHome(false);
            setSubStudent(false);
            setSubRoom(prev=>!prev);
            setSubSettings(false);
            setSubNotice(false);
            setSubComplaint(false);
            setsubApplication(false);
            setsubApplicationStatus(false);
            setsubApplicationStatus(false);
            setSubGuest(false);
        }else if(value === 'settings'){
            setSubHome(false);
            setSubStudent(false);
            setSubRoom(false);
            setSubSettings(prev=>!prev);
            setSubNotice(false);
            setSubComplaint(false);
            setsubApplication(false);
            setsubApplicationStatus(false);
            setsubApplicationStatus(false);
            setSubGuest(false);
        }else if(value === 'notice'){
            setSubHome(false);
            setSubStudent(false);
            setSubRoom(false);
            setSubSettings(false);
            setSubNotice(prev=>!prev);
            setSubComplaint(false);
            setsubApplication(false);
            setsubApplicationStatus(false);
            setsubApplicationStatus(false);
            setSubGuest(false);
        }else if(value === 'complaint'){
            setSubHome(false);
            setSubStudent(false);
            setSubRoom(false);
            setSubSettings(false);
            setSubNotice(false);
            setSubComplaint(prev => !prev);
            setsubApplication(false);
            setsubApplicationStatus(false);
            setsubApplicationStatus(false);
            setSubGuest(false);
        }
        else if(value === 'application'){
            setSubHome(false);
            setSubStudent(false);
            setSubRoom(false);
            setSubSettings(false);
            setSubNotice(false);
            setSubComplaint(false);
            setsubApplication(prev => !prev);
            setsubApplicationStatus(false);
            setSubGuest(false);

        }else if(value === 'applicationstatus'){
            setSubHome(false);
            setSubStudent(false);
            setSubRoom(false);
            setSubSettings(false);
            setSubNotice(false);
            setSubComplaint(false);
            setsubApplication(false);
            setsubApplicationStatus(prev => !prev);
            setsubApplicationStatus(false);
            setSubGuest(false);

        }else if(value === 'applicationstatus'){
            setSubHome(false);
            setSubStudent(false);
            setSubRoom(false);
            setSubSettings(false);
            setSubNotice(false);
            setSubComplaint(false);
            setsubApplication(false);
            setsubApplicationStatus(prev => !prev);
            setSubGuest(false);

        }
        else if(value == 'guest'){
            setSubHome(false);
            setSubStudent(false);
            setSubRoom(false);
            setSubSettings(false);
            setSubNotice(false);
            setSubComplaint(false);
            setsubApplication(false);
            setsubApplicationStatus(false);
            setsubApplicationStatus(false);
            setSubGuest(prev => !prev);
        }

    }


    const toggleMenue = ()=>{
        changeState(prev=>!prev);
    }


    const handleLogout = ()=>{
        console.log('called');
        const config = {
            headers: {
              "Content-Type": "application/json"
              },
              withCredentials: true
            }
        axios.get(import.meta.env.VITE_BASE_URL + '/HA/adminLogout',config)
        .then(res=>{
            console.log(res);
            Dispatcher(removeUserData());
            Navigator('/adminLogin');
    
        })
        .catch(err=>{
            Navigator('/adminLogin');
            console.log(err);
            if(err.status===401){
                Navigator('/adminLogin');
            }
        })
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

    return<>
    <IconContext.Provider value={{size:"20px"}} >
        <div id="Sidebar" onMouseOver={openMenu} onMouseLeave={closeMenu} className={(styles.sidebarContainer)+' '+(state?styles.active:styles.inActive) + ' hidden md:block'}>
           <div className={styles.itemsContainer}>
            <div className={styles.userItem}>
                <div id="userIconSidebar" className={styles.userIcon}>
                {userData?.avatar!=undefined?<img className={styles.avatarImage} src={userData?.avatar} />:<FaUserLarge size="1.5em" color="white"/>}
                </div>
                <div className={state?null:styles.hidden} style={{marginLeft:'8px',marginTop:'0px'}}><p>{userData?.dataValues?.name!==undefined?`${userData?.dataValues?.name}`:"NULL"}<br/><span className={styles.userRole} style={{fontSize:'12px'}}>{userData?.role!==undefined?`Role: ${userData?.role}`:'Role: Null'}</span></p></div>
            </div>
            <div className={styles.listContainer}>
            <div  className={(styles.item) +' '+' '+(state?styles.ItemOpenMenu:styles.ItemCloseMenu)}>
                        <p onClick={()=>{changeSubMenu('Home')}} className={(activeOption==='main'?styles.activeItem:null) + ' flex items-center gap-2'}><i><IoHome  size="20px"/></i> <span className={(state?null:styles.hidden)+' mt-1'}>Main</span></p>
                        <ul className={state&&subHome?null:styles.hidden} >
                        <li onClick={()=>{Navigator('/adminDashboard/main/home')}} className={styles.subOptions+' ' + (activeSubOption==='home'?styles.activeSubOption:null)}>Home</li>
                        </ul>
            </div>
            <div  className={styles.item +' '+(state?styles.ItemOpenMenu:styles.ItemCloseMenu)}>
                        <p onClick={()=>{changeSubMenu('studentInfo')}} className={(activeOption==='studentInfo'?styles.activeItem:null)+ ' flex items-center gap-2'}><FaInfo /> <span className={(state?null:styles.hidden)+' mt-1'}>Student Info</span></p>
                        <ul className={state&&subStudent?null:styles.hidden}>
                        <li onClick={()=>{navigator('/adminDashboard/studentInfo/viewInfo')}} className={styles.subOptions+' ' + (activeSubOption==='viewInfo'?styles.activeSubOption:null)}>View Info</li>
                        <li onClick={()=>{navigator('/adminDashboard/studentInfo/uploadInfo')}} className={styles.subOptions+' ' + (activeSubOption==='uploadInfo'?styles.activeSubOption:null)}>Upload Info</li>
                        <li onClick={()=>{navigator('/adminDashboard/studentInfo/register')}} className={styles.subOptions+' ' + (activeSubOption==='register'?styles.activeSubOption:null)}>Register Student</li>
                        </ul>

                        {/* heere */}
            </div>
            <div  className={styles.item +' '+(state?styles.ItemOpenMenu:styles.ItemCloseMenu)}>
                        <p onClick={()=>{changeSubMenu('roomInfo')}} className={(activeOption==='roomInfo'?styles.activeItem:null)+ ' flex items-center gap-2'}><MdOutlineBedroomChild /> <span className={(state?null:styles.hidden)+' mt-1'}>Room Info</span></p>
                        <ul className={state&&subRoom?null:styles.hidden}>
                        <li onClick={()=>{navigator('/adminDashboard/roomInfo/allotRooms')}} className={(state?null:styles.hidden)+' '+styles.subOptions+' ' + (activeSubOption==='allotRooms'?styles.activeSubOption:null)}>Allot Rooms</li>
                        </ul>
            </div>

            {/* notice */}
            <div  className={styles.item +' '+(state?styles.ItemOpenMenu:styles.ItemCloseMenu)}>
                        <p onClick={()=>{changeSubMenu('notice')}} className={(activeOption==='notice'?styles.activeItem:null)+ ' flex items-center gap-2'}><FaNoteSticky /> <span className={(state?null:styles.hidden)+' mt-1'}>Notice</span></p>
                        <ul className={state&&subNotice?null:styles.hidden}>
                        <li onClick={()=>{navigator('/adminDashboard/notice/uploadNotice')}} className={(state?null:styles.hidden)+' '+styles.subOptions+' ' + (activeSubOption==='uploadNotice'?styles.activeSubOption:null)}>Upload Notice</li>
                        <li onClick={()=>{navigator('/adminDashboard/notice/viewNotice')}} className={(state?null:styles.hidden)+' '+styles.subOptions+' ' + (activeSubOption==='viewNotice'?styles.activeSubOption:null)}>View Notice</li>
                        </ul>
            </div>
            
            {/* Complaints */}
            <div  className={styles.item +' '+(state?styles.ItemOpenMenu:styles.ItemCloseMenu)}>
                        <p onClick={()=>{changeSubMenu('complaint')}} className={(activeOption==='complaints'?styles.activeItem:null)+ ' flex items-center gap-2'}><SlSupport /> <span className={(state?null:styles.hidden)+' mt-1'}>Complaint</span></p>
                        <ul className={state&&subComplaint?null:styles.hidden}>
                        <li onClick={()=>{Navigator('/adminDashboard/complaints/complaints')}} className={styles.subOptions+' ' + (activeSubOption==='complaint'?styles.activeSubOption:null)}>View complaints</li>
                        </ul>
                    
            </div>

            {/* application */}
            <div  className={styles.item +' '+(state?styles.ItemOpenMenu:styles.ItemCloseMenu)}>
                        <p onClick={()=>{changeSubMenu('application')}} className={(activeOption==='application'?styles.activeItem:null)+ ' flex items-center gap-2'}><FaRegFileAlt /> <span className={(state?null:styles.hidden)+' mt-1'}>Application</span></p>
                        <ul className={state&&subApplication?null:styles.hidden}>
                        <li onClick={()=>{navigator('/adminDashboard/admin/application')}} className={(state?null:styles.hidden)+' '+styles.subOptions+' ' + (activeSubOption==='application'?styles.activeSubOption:null)}>New Application</li>
                        <li onClick={()=>{navigator('/adminDashboard/admin/applicationstatus')}} className={(state?null:styles.hidden)+' '+styles.subOptions+' ' + (activeSubOption==='applicationstatus'?styles.activeSubOption:null)}>Status of Application</li>
                        </ul>
            </div>

            {/* Admin Guest Panel */}
            <div  className={styles.item +' '+(state?styles.ItemOpenMenu:styles.ItemCloseMenu)}>
                        <p onClick={()=>{changeSubMenu('guest')}} className={(activeOption==='guest'?styles.activeItem:null)+ ' flex items-center gap-2'}><MdLocalHotel /> <span className={(state?null:styles.hidden)+' mt-1'}>Guest Info</span></p>
                        <ul className={state&&subGuest?null:styles.hidden}>
                        <li onClick={()=>{navigator('/adminDashboard/guest/verify')}} className={(state?null:styles.hidden)+' '+styles.subOptions+' ' + (activeSubOption==='verify'?styles.activeSubOption:null)}>Verify Guests</li>
                        <li onClick={()=>{navigator('/adminDashboard/guest/viewSchedule')}} className={(state?null:styles.hidden)+' '+styles.subOptions+' ' + (activeSubOption==='viewSchedule'?styles.activeSubOption:null)}>View Guests Schedule</li>
                        <li onClick={()=>{navigator('/adminDashboard/guest/allot')}} className={(state?null:styles.hidden)+' '+styles.subOptions+' ' + (activeSubOption==='allot'?styles.activeSubOption:null)}>Allot Rooms To Guests</li>
                        <li onClick={()=>{navigator('/adminDashboard/guest/viewDetail')}} className={(state?null:styles.hidden)+' '+styles.subOptions+' ' + (activeSubOption==='viewDetail'?styles.activeSubOption:null)}>View Guest Detail</li>
                        </ul>
            </div>
            </div>
            </div>
        </div>

 

 {/* Small Screen */}
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
                            <li onClick={()=>{Navigator('/adminDashboard/main/home');handleHamBurger()}} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption==='home'?'bg-blue-900 font-normal':''}`}> Home</li>
                        </ul>
                    </li>

                    {/* Student Info */}

                    <li className='mt-4 cursor-pointer flex flex-col text-xl font-semibold'><div onClick={()=>{changeSubMenu('studentInfo')}} className={`flex items-center gap-2 ${activeOption==='studentInfo'?'text-orange-400':'text-white'}`}><FaInfo size='15px' />  Student Info</div>
                        <ul className={`${subStudent?'':'hidden'} text-sm text-white  font-thin ml-8 transition-all`}>
                            <li onClick={()=>{Navigator('/adminDashboard/studentInfo/viewInfo');handleHamBurger()}} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption==='viewInfo'?'bg-blue-900 font-normal':''}`}> View Info</li>
                            <li onClick={()=>{Navigator('/adminDashboard/studentInfo/uploadInfo');handleHamBurger()}} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption==='uploadInfo'?'bg-blue-900 font-normal':''}`}> Upload Info</li>
                            <li onClick={()=>{Navigator('/adminDashboard/studentInfo/register');handleHamBurger()}} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption==='register'?'bg-blue-900 font-normal':''}`}> Register Students</li>

                        </ul>
                    </li>

                    {/* Room Info */}
                    <li className='mt-4 cursor-pointer flex flex-col text-xl font-semibold'><div onClick={()=>{changeSubMenu('roomInfo')}} className={`flex items-center gap-2 ${activeOption==='roomInfo'?'text-orange-400':'text-white'}`}><MdOutlineBedroomChild size="15px" /> Room Info</div>
                        <ul className={`${subRoom?'':'hidden'} text-sm text-white  font-thin ml-8 transition-all`}>
                            <li onClick={()=>{Navigator('/adminDashboard/roomInfo/allotRooms');handleHamBurger()}} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption==='allotRooms'?'bg-blue-900 font-normal':''}`}> Allot Rooms</li>
                        </ul>
                    </li>

                    {/* Notice */}
                    <li className='mt-4 cursor-pointer flex flex-col text-xl font-semibold'><div onClick={()=>{changeSubMenu('notice')}} className={`flex items-center gap-2 ${activeOption==='notice'?'text-orange-400':'text-white'}`}><FaNoteSticky size="15px" /> Notice</div>
                        <ul className={`${subNotice?'':'hidden'} text-sm text-white  font-thin ml-8 transition-all`}>
                            <li onClick={()=>{Navigator('/adminDashboard/notice/uploadNotice');handleHamBurger()}} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption==='uploadNotice'?'bg-blue-900 font-normal':''}`}>Upload Notice</li>
                            <li onClick={()=>{Navigator('/adminDashboard/notice/viewNotice');handleHamBurger()}} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption==='viewNotice'?'bg-blue-900 font-normal':''}`}>View Notice</li>
                        </ul>
                    </li>

                    {/* Complaints */}
                    <li className='mt-4 cursor-pointer flex flex-col text-xl font-semibold'><div onClick={()=>{changeSubMenu('complaint')}} className={`flex items-center gap-2 ${activeOption==='complaint'?'text-orange-400':'text-white'}`}><SlSupport size="15px" /> Complaints</div>
                        <ul className={`${subComplaint?'':'hidden'} text-sm text-white  font-thin ml-8 transition-all`}>
                            <li onClick={()=>{Navigator('/adminDashboard/complaints/complaints');handleHamBurger()}} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption==='complaint'?'bg-blue-900 font-normal':''}`}>View Complaints</li>
                        </ul>
                    </li>

                    {/* Applications */}
                    <li className='mt-4 cursor-pointer flex flex-col text-xl font-semibold'><div onClick={()=>{changeSubMenu('application')}} className={`flex items-center gap-2 ${activeOption==='application'?'text-orange-400':'text-white'}`}><FaRegFileAlt size="15px" /> Applications</div>
                        <ul className={`${subApplication?'':'hidden'} text-sm text-white  font-thin ml-8 transition-all`}>
                            <li onClick={()=>{Navigator('/adminDashboard/admin/application');handleHamBurger()}} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption==='application'?'bg-blue-900 font-normal':''}`}>New Application</li>
                            <li onClick={()=>{Navigator('/adminDashboard/admin/applicationstatus');handleHamBurger()}} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption==='applicationstatus'?'bg-blue-900 font-normal':''}`}>Status of Applications</li>
                        </ul>
                    </li>

                    {/* Guest Info */}
                    <li className='mt-4 cursor-pointer flex flex-col text-xl font-semibold'><div onClick={()=>{changeSubMenu('guest')}} className={`flex items-center gap-2 ${activeOption==='guest'?'text-orange-400':'text-white'}`}><MdLocalHotel size="15px" /> Guest</div>
                        <ul className={`${subGuest?'':'hidden'} text-sm text-white  font-thin ml-8 transition-all`}>
                            <li onClick={()=>{Navigator('/adminDashboard/guest/verify');handleHamBurger()}} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption==='verify'?'bg-blue-900 font-normal':''}`}>Verify Guest</li>
                            <li onClick={()=>{Navigator('/adminDashboard/guest/viewSchedule');handleHamBurger()}} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption==='viewSchedule'?'bg-blue-900 font-normal':''}`}>View Guests Schedule</li>
                            <li onClick={()=>{Navigator('/adminDashboard/guest/allot');handleHamBurger()}} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption==='allot'?'bg-blue-900 font-normal':''}`}>Allot Rooms to Guests</li>
                            <li onClick={()=>{Navigator('/adminDashboard/guest/viewDetail');handleHamBurger()}} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption==='viewDetail'?'bg-blue-900 font-normal':''}`}>View Guests Details</li>
                        
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