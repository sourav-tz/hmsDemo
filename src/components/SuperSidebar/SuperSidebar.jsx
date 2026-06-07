import { useEffect, useState, useRef } from 'react';
import styles from '../Sidebar/Sidebar.module.scss';
import { Home, BedDouble, StickyNote, FileText, ChevronDown, Users, Building2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { removeUserData } from '../../Store/Reducers/userSlice';

const getInitials = (name) => {
    if (!name) return '?';
    return name.trim().split(/\s+/).slice(0, 2).map(n => n[0].toUpperCase()).join('');
};

export default function SuperSidebar() {
    const param = useLocation();
    const Navigator = useNavigate();
    const [activeOption, setActiveOption] = useState('main');
    const [activeSubOption, setActiveSubOption] = useState('home');

    useEffect(() => {
        setActiveOption(param.pathname.split('/')[2]);
        setActiveSubOption(param.pathname.split('/')[3]);
    }, [param]);

    const [state, changeState] = useState(false);
    const userData = useSelector(state => state.userStorage.data);
    const Dispatcher = useDispatch();
    const expandTimer = useRef(null);

    const [subStudent, setSubStudent] = useState(false);
    const [subRoom, setSubRoom] = useState(false);
    const [subNotice, setSubNotice] = useState(false);
    const [subHostel, setSubHostel] = useState(false);
    const [subApplication, setSubApplication] = useState(false);

    const openMenu = () => {
        if (expandTimer.current) return;
        expandTimer.current = setTimeout(() => { changeState(true); expandTimer.current = null; }, 380);
    };
    const closeMenu = () => {
        clearTimeout(expandTimer.current);
        expandTimer.current = null;
        changeState(false);
    };

    const closeAll = () => {
        setSubStudent(false); setSubRoom(false); setSubNotice(false);
        setSubHostel(false); setSubApplication(false);
    };

    const changeSubMenu = (value) => {
        if (value === 'studentActions') { const p = subStudent; closeAll(); setSubStudent(!p); }
        else if (value === 'roomActions') { const p = subRoom; closeAll(); setSubRoom(!p); }
        else if (value === 'notice') { const p = subNotice; closeAll(); setSubNotice(!p); }
        else if (value === 'hostels') { const p = subHostel; closeAll(); setSubHostel(!p); }
        else if (value === 'application') { const p = subApplication; closeAll(); setSubApplication(!p); }
    };

    const toggleMenue = () => { changeState(prev => !prev); };

    const handleLogout = () => {
        const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
        axios.get(import.meta.env.VITE_BASE_URL + '/SA/superAdminLogout', config)
            .then(() => { Dispatcher(removeUserData()); Navigator('/superAdminLogin'); })
            .catch(() => { Navigator('/superAdminLogin'); });
    };

    const handleHamBurger = () => {
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
    };

    const Chevron = ({ open }) => state
        ? <ChevronDown size={13} className={`transition-transform duration-200 ${open ? '' : '-rotate-90'}`} />
        : null;

    return <>
        {/* ── Desktop sidebar ── */}
        <div id="Sidebar" onMouseOver={openMenu} onMouseLeave={closeMenu} className={(styles.sidebarContainer) + ' ' + (state ? styles.active : styles.inActive) + ' hidden md:block'}>
            <div className={styles.itemsContainer}>
                <div className={styles.userItem}>
                    <div id="userIconSidebar">
                        {userData?.avatar
                            ? <img className={styles.avatarImage} src={userData.avatar} alt="avatar" />
                            : <div className={styles.initialsAvatar}>{getInitials('Super Admin')}</div>
                        }
                    </div>
                    <div className={state ? null : styles.hidden} style={{ marginLeft: '10px' }}>
                        <div className="flex flex-col gap-1">
                            <span style={{ fontWeight: 600, fontSize: '18px', lineHeight: 1.2 }}>Super Admin</span>
                            <span className={styles.roleBadge}>Super Admin</span>
                        </div>
                    </div>
                </div>

                <div className={styles.listContainer}>

                    {/* Home */}
                    <div className={styles.item + ' ' + (state ? styles.ItemOpenMenu : styles.ItemCloseMenu)}>
                        {!state && <span className={styles.navTooltip}>Home</span>}
                        <p onClick={() => { Navigator('/superAdminDashboard/main/home') }} className={(activeOption === 'main' ? styles.activeItem : '') + ' flex items-center gap-2'}>
                            <Home size={20} />
                            <span className={(state ? null : styles.hidden) + ' mt-1'}>Home</span>
                        </p>
                    </div>

                    {/* Students */}
                    <div className={styles.item + ' ' + (state ? styles.ItemOpenMenu : styles.ItemCloseMenu)}>
                        {!state && <span className={styles.navTooltip}>Students</span>}
                        <p onClick={() => { changeSubMenu('studentActions') }} className={(activeOption === 'studentActions' ? styles.activeItem : '') + ' flex items-center gap-2'}>
                            <Users size={20} />
                            <span className={(state ? null : styles.hidden) + ' mt-1 flex-1'}>Students</span>
                            <Chevron open={subStudent} />
                        </p>
                        <ul className={state && subStudent ? null : styles.hidden}>
                            <li onClick={() => { Navigator('/superAdminDashboard/studentActions/addCourses') }} className={styles.subOptions + ' ' + (activeSubOption === 'addCourses' ? styles.activeSubOption : '')}>Manage Courses</li>
                            <li onClick={() => { Navigator('/superAdminDashboard/studentActions/viewStudents') }} className={styles.subOptions + ' ' + (activeSubOption === 'viewStudents' ? styles.activeSubOption : '')}>View Students</li>
                        </ul>
                    </div>

                    {/* Rooms */}
                    <div className={styles.item + ' ' + (state ? styles.ItemOpenMenu : styles.ItemCloseMenu)}>
                        {!state && <span className={styles.navTooltip}>Rooms</span>}
                        <p onClick={() => { changeSubMenu('roomActions') }} className={(activeOption === 'roomActions' ? styles.activeItem : '') + ' flex items-center gap-2'}>
                            <BedDouble size={20} />
                            <span className={(state ? null : styles.hidden) + ' mt-1 flex-1'}>Rooms</span>
                            <Chevron open={subRoom} />
                        </p>
                        <ul className={state && subRoom ? null : styles.hidden}>
                            <li onClick={() => { Navigator('/superAdminDashboard/roomActions/allocateRooms') }} className={styles.subOptions + ' ' + (activeSubOption === 'allocateRooms' ? styles.activeSubOption : '')}>Upload Rooms</li>
                            <li onClick={() => { Navigator('/superAdminDashboard/roomActions/manageRooms') }} className={styles.subOptions + ' ' + (activeSubOption === 'manageRooms' ? styles.activeSubOption : '')}>Manage Rooms</li>
                            <li onClick={() => { Navigator('/superAdminDashboard/roomActions/roomGenerator') }} className={styles.subOptions + ' ' + (activeSubOption === 'roomGenerator' ? styles.activeSubOption : '')}>Room Generator</li>
                        </ul>
                    </div>

                    {/* Notice */}
                    <div className={styles.item + ' ' + (state ? styles.ItemOpenMenu : styles.ItemCloseMenu)}>
                        {!state && <span className={styles.navTooltip}>Notice</span>}
                        <p onClick={() => { changeSubMenu('notice') }} className={(activeOption === 'notice' ? styles.activeItem : '') + ' flex items-center gap-2'}>
                            <StickyNote size={20} />
                            <span className={(state ? null : styles.hidden) + ' mt-1 flex-1'}>Notice</span>
                            <Chevron open={subNotice} />
                        </p>
                        <ul className={state && subNotice ? null : styles.hidden}>
                            <li onClick={() => { Navigator('/superAdminDashboard/notice/uploadNotice') }} className={styles.subOptions + ' ' + (activeSubOption === 'uploadNotice' ? styles.activeSubOption : '')}>Upload Notice</li>
                            <li onClick={() => { Navigator('/superAdminDashboard/notice/viewNotice') }} className={styles.subOptions + ' ' + (activeSubOption === 'viewNotice' ? styles.activeSubOption : '')}>View Notice</li>
                        </ul>
                    </div>

                    {/* Hostels */}
                    <div className={styles.item + ' ' + (state ? styles.ItemOpenMenu : styles.ItemCloseMenu)}>
                        {!state && <span className={styles.navTooltip}>Hostels</span>}
                        <p onClick={() => { changeSubMenu('hostels') }} className={(activeOption === 'hostels' ? styles.activeItem : '') + ' flex items-center gap-2'}>
                            <Building2 size={20} />
                            <span className={(state ? null : styles.hidden) + ' mt-1 flex-1'}>Hostels</span>
                            <Chevron open={subHostel} />
                        </p>
                        <ul className={state && subHostel ? null : styles.hidden}>
                            <li onClick={() => { Navigator('/superAdminDashboard/hostels/manageHostels') }} className={styles.subOptions + ' ' + (activeSubOption === 'manageHostels' ? styles.activeSubOption : '')}>Manage Hostels</li>
                            <li onClick={() => { Navigator('/superAdminDashboard/hostels/manageAdmins') }} className={styles.subOptions + ' ' + (activeSubOption === 'manageAdmins' ? styles.activeSubOption : '')}>Manage Admins</li>
                        </ul>
                    </div>

                    {/* Applications */}
                    <div className={styles.item + ' ' + (state ? styles.ItemOpenMenu : styles.ItemCloseMenu)}>
                        {!state && <span className={styles.navTooltip}>Applications</span>}
                        <p onClick={() => { changeSubMenu('application') }} className={(activeOption === 'application' ? styles.activeItem : '') + ' flex items-center gap-2'}>
                            <FileText size={20} />
                            <span className={(state ? null : styles.hidden) + ' mt-1 flex-1'}>Applications</span>
                            <Chevron open={subApplication} />
                        </p>
                        <ul className={state && subApplication ? null : styles.hidden}>
                            <li onClick={() => { Navigator('/superAdminDashboard/application/applicationStatus') }} className={styles.subOptions + ' ' + (activeSubOption === 'applicationStatus' ? styles.activeSubOption : '')}>View Applications</li>
                        </ul>
                    </div>

                </div>
            </div>
        </div>

        {/* ── Mobile nav ── */}
        <div className={`block w-full ${state ? 'h-full' : 'h-[60px]'} fixed transition-all top-0 left-0 backdrop-blur-md z-50 md:hidden`}>
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
            <div className={`${state ? '' : 'hidden'} absolute w-full h-full top-0 left-[0] flex justify-center items-center text-white`}>
                <ul>
                    <li className='cursor-pointer flex flex-col text-xl font-semibold'>
                        <div onClick={() => { Navigator('/superAdminDashboard/main/home'); handleHamBurger(); }} className={`flex items-center gap-2 ${activeOption === 'main' ? 'text-orange-400' : 'text-white'}`}>
                            <Home size={15} /> Home
                        </div>
                    </li>

                    <li className='mt-4 cursor-pointer flex flex-col text-xl font-semibold'>
                        <div onClick={() => { changeSubMenu('studentActions') }} className={`flex items-center gap-2 ${activeOption === 'studentActions' ? 'text-orange-400' : 'text-white'}`}>
                            <Users size={15} /> Students
                        </div>
                        <ul className={`${subStudent ? '' : 'hidden'} text-sm text-white font-thin ml-8 transition-all`}>
                            <li onClick={() => { Navigator('/superAdminDashboard/studentActions/addCourses'); handleHamBurger(); }} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption === 'addCourses' ? 'bg-blue-900 font-normal' : ''}`}>Manage Courses</li>
                            <li onClick={() => { Navigator('/superAdminDashboard/studentActions/viewStudents'); handleHamBurger(); }} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption === 'viewStudents' ? 'bg-blue-900 font-normal' : ''}`}>View Students</li>
                        </ul>
                    </li>

                    <li className='mt-4 cursor-pointer flex flex-col text-xl font-semibold'>
                        <div onClick={() => { changeSubMenu('roomActions') }} className={`flex items-center gap-2 ${activeOption === 'roomActions' ? 'text-orange-400' : 'text-white'}`}>
                            <BedDouble size={15} /> Rooms
                        </div>
                        <ul className={`${subRoom ? '' : 'hidden'} text-sm text-white font-thin ml-8 transition-all`}>
                            <li onClick={() => { Navigator('/superAdminDashboard/roomActions/allocateRooms'); handleHamBurger(); }} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption === 'allocateRooms' ? 'bg-blue-900 font-normal' : ''}`}>Upload Rooms</li>
                            <li onClick={() => { Navigator('/superAdminDashboard/roomActions/manageRooms'); handleHamBurger(); }} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption === 'manageRooms' ? 'bg-blue-900 font-normal' : ''}`}>Manage Rooms</li>
                            <li onClick={() => { Navigator('/superAdminDashboard/roomActions/roomGenerator'); handleHamBurger(); }} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption === 'roomGenerator' ? 'bg-blue-900 font-normal' : ''}`}>Room Generator</li>
                        </ul>
                    </li>

                    <li className='mt-4 cursor-pointer flex flex-col text-xl font-semibold'>
                        <div onClick={() => { changeSubMenu('notice') }} className={`flex items-center gap-2 ${activeOption === 'notice' ? 'text-orange-400' : 'text-white'}`}>
                            <StickyNote size={15} /> Notice
                        </div>
                        <ul className={`${subNotice ? '' : 'hidden'} text-sm text-white font-thin ml-8 transition-all`}>
                            <li onClick={() => { Navigator('/superAdminDashboard/notice/uploadNotice'); handleHamBurger(); }} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption === 'uploadNotice' ? 'bg-blue-900 font-normal' : ''}`}>Upload Notice</li>
                            <li onClick={() => { Navigator('/superAdminDashboard/notice/viewNotice'); handleHamBurger(); }} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption === 'viewNotice' ? 'bg-blue-900 font-normal' : ''}`}>View Notice</li>
                        </ul>
                    </li>

                    <li className='mt-4 cursor-pointer flex flex-col text-xl font-semibold'>
                        <div onClick={() => { changeSubMenu('hostels') }} className={`flex items-center gap-2 ${activeOption === 'hostels' ? 'text-orange-400' : 'text-white'}`}>
                            <Building2 size={15} /> Hostels
                        </div>
                        <ul className={`${subHostel ? '' : 'hidden'} text-sm text-white font-thin ml-8 transition-all`}>
                            <li onClick={() => { Navigator('/superAdminDashboard/hostels/manageHostels'); handleHamBurger(); }} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption === 'manageHostels' ? 'bg-blue-900 font-normal' : ''}`}>Manage Hostels</li>
                            <li onClick={() => { Navigator('/superAdminDashboard/hostels/manageAdmins'); handleHamBurger(); }} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption === 'manageAdmins' ? 'bg-blue-900 font-normal' : ''}`}>Manage Admins</li>
                        </ul>
                    </li>

                    <li className='mt-4 cursor-pointer flex flex-col text-xl font-semibold'>
                        <div onClick={() => { changeSubMenu('application') }} className={`flex items-center gap-2 ${activeOption === 'application' ? 'text-orange-400' : 'text-white'}`}>
                            <FileText size={15} /> Applications
                        </div>
                        <ul className={`${subApplication ? '' : 'hidden'} text-sm text-white font-thin ml-8 transition-all`}>
                            <li onClick={() => { Navigator('/superAdminDashboard/application/applicationStatus'); handleHamBurger(); }} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption === 'applicationStatus' ? 'bg-blue-900 font-normal' : ''}`}>View Applications</li>
                        </ul>
                    </li>
                </ul>
                <div onClick={handleLogout} className='absolute bottom-16 cursor-pointer left-[40%] text-white'>
                    Logout
                </div>
            </div>
        </div>
    </>;
}
