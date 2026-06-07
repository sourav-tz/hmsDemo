import { useEffect, useState, useRef } from 'react';
import styles from './Sidebar.module.scss';
import { Home, Info, BedDouble, StickyNote, Headphones, FileText, Hotel, ChevronDown, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeUserData } from '../../Store/Reducers/userSlice';

// Returns up to 2 initials from a full name (e.g. "Ravi Gupta" → "RG")
const getInitials = (name) => {
    if (!name) return '?';
    return name.trim().split(/\s+/).slice(0, 2).map(n => n[0].toUpperCase()).join('');
};

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
    const Dispatcher = useDispatch();
    const expandTimer = useRef(null);

    const [subHome,setSubHome] = useState(false);
    const [subStudent, setSubStudent] = useState(false);
    const [subRoom, setSubRoom] = useState(false);
    const [subSettings, setSubSettings] = useState(false);
    const [subNotice, setSubNotice] = useState(false);
    const [subComplaint,setSubComplaint] = useState(false);
    const [subApplication,setsubApplication] = useState(false);
    const [subApplicationStatus,setsubApplicationStatus] = useState(false);
    const [subGuest,setSubGuest] = useState(false);
    const [subMess,setSubMess] = useState(false);

    // Delay expansion so tooltips are visible during the hover window before the sidebar opens
    const openMenu = () => {
        if (expandTimer.current) return;
        expandTimer.current = setTimeout(() => { changeState(true); expandTimer.current = null; }, 380);
    };
    const closeMenu = () => {
        clearTimeout(expandTimer.current);
        expandTimer.current = null;
        changeState(false);
    };

    const changeSubMenu = (value)=>{
        if(value === 'Home'){
            setSubHome(prev => !prev);
            setSubStudent(false); setSubRoom(false); setSubSettings(false);
            setSubNotice(false); setSubComplaint(false); setsubApplication(false);
            setsubApplicationStatus(false); setSubGuest(false);
        }else if(value ==='studentInfo'){
            setSubHome(false);
            setSubStudent(prev => !prev);
            setSubRoom(false); setSubSettings(false); setSubNotice(false);
            setSubComplaint(false); setsubApplication(false); setsubApplicationStatus(false); setSubGuest(false);
        }else if(value === 'roomInfo'){
            setSubHome(false); setSubStudent(false);
            setSubRoom(prev=>!prev);
            setSubSettings(false); setSubNotice(false); setSubComplaint(false);
            setsubApplication(false); setsubApplicationStatus(false); setSubGuest(false);
        }else if(value === 'settings'){
            setSubHome(false); setSubStudent(false); setSubRoom(false);
            setSubSettings(prev=>!prev);
            setSubNotice(false); setSubComplaint(false); setsubApplication(false);
            setsubApplicationStatus(false); setSubGuest(false);
        }else if(value === 'notice'){
            setSubHome(false); setSubStudent(false); setSubRoom(false); setSubSettings(false);
            setSubNotice(prev=>!prev);
            setSubComplaint(false); setsubApplication(false); setsubApplicationStatus(false); setSubGuest(false);
        }else if(value === 'complaint'){
            setSubHome(false); setSubStudent(false); setSubRoom(false); setSubSettings(false); setSubNotice(false);
            setSubComplaint(prev => !prev);
            setsubApplication(false); setsubApplicationStatus(false); setSubGuest(false);
        }else if(value === 'application'){
            setSubHome(false); setSubStudent(false); setSubRoom(false); setSubSettings(false);
            setSubNotice(false); setSubComplaint(false);
            setsubApplication(prev => !prev);
            setsubApplicationStatus(false); setSubGuest(false);
        }else if(value === 'applicationstatus'){
            setSubHome(false); setSubStudent(false); setSubRoom(false); setSubSettings(false);
            setSubNotice(false); setSubComplaint(false); setsubApplication(false);
            setsubApplicationStatus(prev => !prev);
            setSubGuest(false);
        }else if(value == 'guest'){
            setSubHome(false); setSubStudent(false); setSubRoom(false); setSubSettings(false);
            setSubNotice(false); setSubComplaint(false); setsubApplication(false); setsubApplicationStatus(false);
            setSubGuest(prev => !prev);
            setSubMess(false);
        }else if(value == 'mess'){
            setSubHome(false); setSubStudent(false); setSubRoom(false); setSubSettings(false);
            setSubNotice(false); setSubComplaint(false); setsubApplication(false); setsubApplicationStatus(false);
            setSubGuest(false);
            setSubMess(prev => !prev);
        }
    }

    const toggleMenue = ()=>{ changeState(prev=>!prev); }

    const handleLogout = ()=>{
        const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
        axios.get(import.meta.env.VITE_BASE_URL + '/HA/adminLogout', config)
        .then(res=>{
            Dispatcher(removeUserData());
            Navigator('/adminLogin');
        })
        .catch(err=>{
            Navigator('/adminLogin');
            if(err.status===401) Navigator('/adminLogin');
        });
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

    // Chevron shown only when sidebar is expanded; rotates to indicate open/closed state
    const Chevron = ({ open }) => state
        ? <ChevronDown size={13} className={`transition-transform duration-200 ${open ? '' : '-rotate-90'}`} />
        : null;

    return<>
        {/* ── Desktop sidebar ── */}
        <div id="Sidebar" onMouseOver={openMenu} onMouseLeave={closeMenu} className={(styles.sidebarContainer)+' '+(state?styles.active:styles.inActive) + ' hidden md:block'}>
           <div className={styles.itemsContainer}>
            <div className={styles.userItem}>
                <div id="userIconSidebar">
                    {userData?.avatar
                        ? <img className={styles.avatarImage} src={userData.avatar} alt="avatar" />
                        : <div className={styles.initialsAvatar}>{getInitials(userData?.dataValues?.name ?? userData?.name)}</div>
                    }
                </div>
                <div className={state?null:styles.hidden} style={{marginLeft:'10px'}}>
                    <div className="flex flex-col gap-1">
                        <span style={{ fontWeight: 600, fontSize: '18px', lineHeight: 1.2 }}>
                            {userData?.dataValues?.name ?? "Unknown User"}
                        </span>
                        <span className={styles.roleBadge}>
                            {(userData?.role ?? "N/A").replace(/-/g, ' ')}
                        </span>
                        <span className={styles.userRole} style={{ fontSize: '13px' }}>
                            Hostel No: {userData?.dataValues?.hostelNo ?? "N/A"}
                        </span>
                    </div>
                </div>
            </div>

            <div className={styles.listContainer}>

                {/* Home */}
                <div className={styles.item +' '+(state?styles.ItemOpenMenu:styles.ItemCloseMenu)}>
                    {!state && <span className={styles.navTooltip}>Home</span>}
                    <p onClick={()=>{Navigator('/adminDashboard/main/home')}} className={(activeOption==='main'?styles.activeItem:'') + ' flex items-center gap-2'}>
                        <Home size={20}/>
                        <span className={(state?null:styles.hidden)+' mt-1'}>Home</span>
                    </p>
                </div>

                {/* Student Info */}
                <div className={styles.item +' '+(state?styles.ItemOpenMenu:styles.ItemCloseMenu)}>
                    {!state && <span className={styles.navTooltip}>Student Info</span>}
                    <p onClick={()=>{changeSubMenu('studentInfo')}} className={(activeOption==='studentInfo'?styles.activeItem:'')+ ' flex items-center gap-2'}>
                        <Info size={20}/>
                        <span className={(state?null:styles.hidden)+' mt-1 flex-1'}>Student Info</span>
                        <Chevron open={subStudent}/>
                    </p>
                    <ul className={state&&subStudent?null:styles.hidden}>
                        <li onClick={()=>{navigator('/adminDashboard/studentInfo/studentCreateAccount')}} className={styles.subOptions+' '+(activeSubOption==='studentCreateAccount'?styles.activeSubOption:'')}>Create Student Account</li>
                        <li onClick={()=>{navigator('/adminDashboard/studentInfo/studentVerify')}} className={styles.subOptions+' '+(activeSubOption==='studentVerify'?styles.activeSubOption:'')}>Student Profile Verify</li>
                        <li onClick={()=>{navigator('/adminDashboard/studentInfo/viewInfo')}} className={styles.subOptions+' '+(activeSubOption==='viewInfo'?styles.activeSubOption:'')}>View Info</li>
                        <li onClick={()=>{navigator('/adminDashboard/studentInfo/uploadInfo')}} className={styles.subOptions+' '+(activeSubOption==='uploadInfo'?styles.activeSubOption:'')}>Upload Info</li>
                        <li onClick={()=>{navigator('/adminDashboard/studentInfo/transferStudent')}} className={styles.subOptions+' '+(activeSubOption==='transferStudent'?styles.activeSubOption:'')}>Transfer Student</li>
                    </ul>
                </div>

                {/* Room Info */}
                <div className={styles.item +' '+(state?styles.ItemOpenMenu:styles.ItemCloseMenu)}>
                    {!state && <span className={styles.navTooltip}>Room Info</span>}
                    <p onClick={()=>{changeSubMenu('roomInfo')}} className={(activeOption==='roomInfo'?styles.activeItem:'')+ ' flex items-center gap-2'}>
                        <BedDouble size={20}/>
                        <span className={(state?null:styles.hidden)+' mt-1 flex-1'}>Room Info</span>
                        <Chevron open={subRoom}/>
                    </p>
                    <ul className={state&&subRoom?null:styles.hidden}>
                        <li onClick={()=>{navigator('/adminDashboard/roomInfo/allotRooms')}} className={styles.subOptions+' '+(activeSubOption==='allotRooms'?styles.activeSubOption:'')}>Allot Rooms</li>
                    </ul>
                </div>

                {/* Notice */}
                <div className={styles.item +' '+(state?styles.ItemOpenMenu:styles.ItemCloseMenu)}>
                    {!state && <span className={styles.navTooltip}>Notice</span>}
                    <p onClick={()=>{changeSubMenu('notice')}} className={(activeOption==='notice'?styles.activeItem:'')+ ' flex items-center gap-2'}>
                        <StickyNote size={20}/>
                        <span className={(state?null:styles.hidden)+' mt-1 flex-1'}>Notice</span>
                        <Chevron open={subNotice}/>
                    </p>
                    <ul className={state&&subNotice?null:styles.hidden}>
                        <li onClick={()=>{navigator('/adminDashboard/notice/uploadNotice')}} className={styles.subOptions+' '+(activeSubOption==='uploadNotice'?styles.activeSubOption:'')}>Upload Notice</li>
                        <li onClick={()=>{navigator('/adminDashboard/notice/viewNotice')}} className={styles.subOptions+' '+(activeSubOption==='viewNotice'?styles.activeSubOption:'')}>View Notice</li>
                    </ul>
                </div>

                {/* Complaints */}
                <div className={styles.item +' '+(state?styles.ItemOpenMenu:styles.ItemCloseMenu)}>
                    {!state && <span className={styles.navTooltip}>Complaint</span>}
                    <p onClick={()=>{changeSubMenu('complaint')}} className={(activeOption==='complaints'?styles.activeItem:'')+ ' flex items-center gap-2'}>
                        <Headphones size={20}/>
                        <span className={(state?null:styles.hidden)+' mt-1 flex-1'}>Complaint</span>
                        <Chevron open={subComplaint}/>
                    </p>
                    <ul className={state&&subComplaint?null:styles.hidden}>
                        <li onClick={()=>{Navigator('/adminDashboard/complaints/complaints')}} className={styles.subOptions+' '+(activeSubOption==='complaint'?styles.activeSubOption:'')}>View Complaints</li>
                    </ul>
                </div>

                {/* Application */}
                <div className={styles.item +' '+(state?styles.ItemOpenMenu:styles.ItemCloseMenu)}>
                    {!state && <span className={styles.navTooltip}>Application</span>}
                    <p onClick={()=>{changeSubMenu('application')}} className={(activeOption==='application'?styles.activeItem:'')+ ' flex items-center gap-2'}>
                        <FileText size={20}/>
                        <span className={(state?null:styles.hidden)+' mt-1 flex-1'}>Application</span>
                        <Chevron open={subApplication}/>
                    </p>
                    <ul className={state&&subApplication?null:styles.hidden}>
                        <li onClick={()=>{navigator('/adminDashboard/admin/application')}} className={styles.subOptions+' '+(activeSubOption==='application'?styles.activeSubOption:'')}>New Application</li>
                        <li onClick={()=>{navigator('/adminDashboard/admin/applicationstatus')}} className={styles.subOptions+' '+(activeSubOption==='applicationstatus'?styles.activeSubOption:'')}>Status of Application</li>
                    </ul>
                </div>

                {/* Guest Info */}
                <div className={styles.item +' '+(state?styles.ItemOpenMenu:styles.ItemCloseMenu)}>
                    {!state && <span className={styles.navTooltip}>Guest Info</span>}
                    <p onClick={()=>{changeSubMenu('guest')}} className={(activeOption==='guest'?styles.activeItem:'')+ ' flex items-center gap-2'}>
                        <Hotel size={20}/>
                        <span className={(state?null:styles.hidden)+' mt-1 flex-1'}>Guest Info</span>
                        <Chevron open={subGuest}/>
                    </p>
                    <ul className={state&&subGuest?null:styles.hidden}>
                        <li onClick={()=>{navigator('/adminDashboard/guest/verify')}} className={styles.subOptions+' '+(activeSubOption==='verify'?styles.activeSubOption:'')}>Verify Guests</li>
                        <li onClick={()=>{navigator('/adminDashboard/guest/viewSchedule')}} className={styles.subOptions+' '+(activeSubOption==='viewSchedule'?styles.activeSubOption:'')}>View Guests Schedule</li>
                        <li onClick={()=>{navigator('/adminDashboard/guest/allot')}} className={styles.subOptions+' '+(activeSubOption==='allot'?styles.activeSubOption:'')}>Allot Rooms To Guests</li>
                        <li onClick={()=>{navigator('/adminDashboard/guest/viewDetail')}} className={styles.subOptions+' '+(activeSubOption==='viewDetail'?styles.activeSubOption:'')}>View Guest Detail</li>
                    </ul>
                </div>

                {/* Mess Menu */}
                <div className={styles.item +' '+(state?styles.ItemOpenMenu:styles.ItemCloseMenu)}>
                    {!state && <span className={styles.navTooltip}>Mess Menu</span>}
                    <p onClick={()=>{changeSubMenu('mess')}} className={(activeOption==='mess'?styles.activeItem:'')+ ' flex items-center gap-2'}>
                        <Utensils size={20}/>
                        <span className={(state?null:styles.hidden)+' mt-1 flex-1'}>Mess Menu</span>
                        <Chevron open={subMess}/>
                    </p>
                    <ul className={state&&subMess?null:styles.hidden}>
                        <li onClick={()=>{navigator('/adminDashboard/mess/menu')}} className={styles.subOptions+' '+(activeSubOption==='menu'?styles.activeSubOption:'')}>Manage Menu</li>
                    </ul>
                </div>

            </div>
            </div>
        </div>

        {/* ── Mobile nav ── */}
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
                            <Home size={15}/> Main
                        </div>
                        <ul className={`${subHome?'':'hidden'} text-sm text-white font-thin ml-8 transition-all`}>
                            <li onClick={()=>{Navigator('/adminDashboard/main/home');handleHamBurger()}} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption==='home'?'bg-blue-900 font-normal':''}`}>Home</li>
                        </ul>
                    </li>

                    <li className='mt-4 cursor-pointer flex flex-col text-xl font-semibold'>
                        <div onClick={()=>{changeSubMenu('studentInfo')}} className={`flex items-center gap-2 ${activeOption==='studentInfo'?'text-orange-400':'text-white'}`}>
                            <Info size={15}/> Student Info
                        </div>
                        <ul className={`${subStudent?'':'hidden'} text-sm text-white font-thin ml-8 transition-all`}>
                            <li onClick={()=>{Navigator('/adminDashboard/studentInfo/viewInfo');handleHamBurger()}} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption==='viewInfo'?'bg-blue-900 font-normal':''}`}>View Info</li>
                            <li onClick={()=>{Navigator('/adminDashboard/studentInfo/uploadInfo');handleHamBurger()}} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption==='uploadInfo'?'bg-blue-900 font-normal':''}`}>Upload Info</li>
                            <li onClick={()=>{Navigator('/adminDashboard/studentInfo/transferStudent');handleHamBurger()}} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption==='transferStudent'?'bg-blue-900 font-normal':''}`}>Transfer Student</li>
                            <li onClick={()=>{Navigator('/adminDashboard/studentInfo/register');handleHamBurger()}} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption==='register'?'bg-blue-900 font-normal':''}`}>Register Students</li>
                        </ul>
                    </li>

                    <li className='mt-4 cursor-pointer flex flex-col text-xl font-semibold'>
                        <div onClick={()=>{changeSubMenu('roomInfo')}} className={`flex items-center gap-2 ${activeOption==='roomInfo'?'text-orange-400':'text-white'}`}>
                            <BedDouble size={15}/> Room Info
                        </div>
                        <ul className={`${subRoom?'':'hidden'} text-sm text-white font-thin ml-8 transition-all`}>
                            <li onClick={()=>{Navigator('/adminDashboard/roomInfo/allotRooms');handleHamBurger()}} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption==='allotRooms'?'bg-blue-900 font-normal':''}`}>Allot Rooms</li>
                        </ul>
                    </li>

                    <li className='mt-4 cursor-pointer flex flex-col text-xl font-semibold'>
                        <div onClick={()=>{changeSubMenu('notice')}} className={`flex items-center gap-2 ${activeOption==='notice'?'text-orange-400':'text-white'}`}>
                            <StickyNote size={15}/> Notice
                        </div>
                        <ul className={`${subNotice?'':'hidden'} text-sm text-white font-thin ml-8 transition-all`}>
                            <li onClick={()=>{Navigator('/adminDashboard/notice/uploadNotice');handleHamBurger()}} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption==='uploadNotice'?'bg-blue-900 font-normal':''}`}>Upload Notice</li>
                            <li onClick={()=>{Navigator('/adminDashboard/notice/viewNotice');handleHamBurger()}} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption==='viewNotice'?'bg-blue-900 font-normal':''}`}>View Notice</li>
                        </ul>
                    </li>

                    <li className='mt-4 cursor-pointer flex flex-col text-xl font-semibold'>
                        <div onClick={()=>{changeSubMenu('complaint')}} className={`flex items-center gap-2 ${activeOption==='complaint'?'text-orange-400':'text-white'}`}>
                            <Headphones size={15}/> Complaints
                        </div>
                        <ul className={`${subComplaint?'':'hidden'} text-sm text-white font-thin ml-8 transition-all`}>
                            <li onClick={()=>{Navigator('/adminDashboard/complaints/complaints');handleHamBurger()}} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption==='complaint'?'bg-blue-900 font-normal':''}`}>View Complaints</li>
                        </ul>
                    </li>

                    <li className='mt-4 cursor-pointer flex flex-col text-xl font-semibold'>
                        <div onClick={()=>{changeSubMenu('application')}} className={`flex items-center gap-2 ${activeOption==='application'?'text-orange-400':'text-white'}`}>
                            <FileText size={15}/> Applications
                        </div>
                        <ul className={`${subApplication?'':'hidden'} text-sm text-white font-thin ml-8 transition-all`}>
                            <li onClick={()=>{Navigator('/adminDashboard/admin/application');handleHamBurger()}} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption==='application'?'bg-blue-900 font-normal':''}`}>New Application</li>
                            <li onClick={()=>{Navigator('/adminDashboard/admin/applicationstatus');handleHamBurger()}} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption==='applicationstatus'?'bg-blue-900 font-normal':''}`}>Status of Applications</li>
                        </ul>
                    </li>

                    <li className='mt-4 cursor-pointer flex flex-col text-xl font-semibold'>
                        <div onClick={()=>{changeSubMenu('guest')}} className={`flex items-center gap-2 ${activeOption==='guest'?'text-orange-400':'text-white'}`}>
                            <Hotel size={15}/> Guest
                        </div>
                        <ul className={`${subGuest?'':'hidden'} text-sm text-white font-thin ml-8 transition-all`}>
                            <li onClick={()=>{Navigator('/adminDashboard/guest/verify');handleHamBurger()}} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption==='verify'?'bg-blue-900 font-normal':''}`}>Verify Guest</li>
                            <li onClick={()=>{Navigator('/adminDashboard/guest/viewSchedule');handleHamBurger()}} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption==='viewSchedule'?'bg-blue-900 font-normal':''}`}>View Guests Schedule</li>
                            <li onClick={()=>{Navigator('/adminDashboard/guest/allot');handleHamBurger()}} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption==='allot'?'bg-blue-900 font-normal':''}`}>Allot Rooms to Guests</li>
                            <li onClick={()=>{Navigator('/adminDashboard/guest/viewDetail');handleHamBurger()}} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption==='viewDetail'?'bg-blue-900 font-normal':''}`}>View Guests Details</li>
                        </ul>
                    </li>

                    <li className='mt-4 cursor-pointer flex flex-col text-xl font-semibold'>
                        <div onClick={()=>{changeSubMenu('mess')}} className={`flex items-center gap-2 ${activeOption==='mess'?'text-orange-400':'text-white'}`}>
                            <Utensils size={15}/> Mess Menu
                        </div>
                        <ul className={`${subMess?'':'hidden'} text-sm text-white font-thin ml-8 transition-all`}>
                            <li onClick={()=>{Navigator('/adminDashboard/mess/menu');handleHamBurger()}} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption==='menu'?'bg-blue-900 font-normal':''}`}>Manage Menu</li>
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