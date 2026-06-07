import { useEffect, useRef, useState } from 'react';
import styles from '../Sidebar/Sidebar.module.scss';
import {
  Home, Headphones, FileText, StickyNote, Utensils, Hotel, ChevronDown
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { removeUserData } from '../../Store/Reducers/userSlice';
import axios from 'axios';
import { setUserData } from '../../Store/Reducers/userSlice';

const getInitials = (name) => {
  if (!name) return '?';
  return name.trim().split(/\s+/).slice(0, 2).map(n => n[0].toUpperCase()).join('');
};

export default function StudentSidebar() {
  const Navigator = useNavigate();
  const param = useLocation();
  const Dispatcher = useDispatch();
  const userData = useSelector(state => state.userStorage.data);
  const expandTimer = useRef(null);

  const [state, changeState] = useState(false);
  const [activeOption, setActiveOption] = useState('main');
  const [activeSubOption, setActiveSubOption] = useState('home');
  const [isTempStudent, setIsTempStudent] = useState(false);

  const [subHome, setSubHome] = useState(false);
  const [subComplaint, setSubComplaint] = useState(false);
  const [subRequest, setSubRequest] = useState(false);
  const [subNotice, setSubNotice] = useState(false);
  const [subMess, setSubMess] = useState(false);
  const [subReferral, setSubReferral] = useState(false);

  useEffect(() => {
    setActiveOption(param.pathname.split('/')[2]);
    setActiveSubOption(param.pathname.split('/')[3]);
  }, [param]);

  useEffect(() => {
    let isTempStatus = false;
    if (userData) {
      isTempStatus = userData.roleType === 'TempStudent';
      localStorage.setItem('role', isTempStatus ? 'TempStudent' : 'Student');
    } else {
      isTempStatus = localStorage.getItem('role') === 'TempStudent';
    }
    setIsTempStudent(isTempStatus);
  }, [userData]);

  useEffect(() => {
    if (!userData || userData.avatar) return;
    const role = userData.roleType || userData.role;
    if (role === 'TempStudent') return;
    axios.get(import.meta.env.VITE_BASE_URL + '/student/getProfile', { withCredentials: true })
      .then(res => {
        const photoLink = res.data?.profile?.photoLink;
        if (photoLink) {
          Dispatcher(setUserData({ ...userData, avatar: photoLink }));
        }
      })
      .catch(() => {});
  }, [userData?.email]);

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
    setSubHome(false); setSubComplaint(false); setSubRequest(false);
    setSubNotice(false); setSubMess(false); setSubReferral(false);
  };

  const changeSubMenu = (value) => {
    if (value === 'Home')       { closeAll(); setSubHome(p => !p); }
    else if (value === 'complaints') { closeAll(); setSubComplaint(p => !p); }
    else if (value === 'request')    { closeAll(); setSubRequest(p => !p); }
    else if (value === 'notices')    { closeAll(); setSubNotice(p => !p); }
    else if (value === 'mess')       { closeAll(); setSubMess(p => !p); }
    else if (value === 'referral')   { closeAll(); setSubReferral(p => !p); }
  };

  const handleLogout = () => {
    axios.get(import.meta.env.VITE_BASE_URL + '/student/studentLogout', { withCredentials: true })
      .finally(() => {
        Dispatcher(removeUserData());
        Navigator('/studentLogin', { replace: true });
      });
  };

  const handleHamBurger = () => {
    changeState(prev => !prev);
    ['ham1', 'ham2', 'ham3'].forEach((id, i) => {
      const el = document.getElementById(id);
      if (i === 0) el.classList.toggle('rotate-45');
      if (i === 1) el.classList.toggle('hidden');
      if (i === 2) {
        el.classList.toggle('mt-1');
        el.classList.toggle('relative');
        el.classList.toggle('-top-[0.25rem]');
        el.classList.toggle('rotate-[-45deg]');
      }
    });
  };

  const Chevron = ({ open }) => state
    ? <ChevronDown size={13} className={`transition-transform duration-200 ${open ? '' : '-rotate-90'}`} />
    : null;

  const displayName = userData
    ? `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'Student'
    : 'Student';

  return <>
    {/* ── Desktop sidebar ── */}
    <div id="Sidebar" onMouseOver={openMenu} onMouseLeave={closeMenu}
      className={styles.sidebarContainer + ' ' + (state ? styles.active : styles.inActive) + ' hidden md:block'}>
      <div className={styles.itemsContainer}>

        {/* Profile */}
        <div className={styles.userItem}>
          <div id="userIconSidebar">
            {userData?.avatar
              ? <img className={styles.avatarImage} src={userData.avatar} alt="avatar" />
              : <div className={styles.initialsAvatar}>{getInitials(displayName)}</div>
            }
          </div>
          <div className={state ? null : styles.hidden} style={{ marginLeft: '10px' }}>
            <div className="flex flex-col gap-1">
              <span style={{ fontWeight: 600, fontSize: '18px', lineHeight: 1.2 }}>{displayName}</span>
              <span className={styles.roleBadge}>{isTempStudent ? 'Temp Student' : 'Student'}</span>
              {userData?.hostelNo && (
                <span className={styles.userRole} style={{ fontSize: '13px' }}>Hostel No: {userData.hostelNo}</span>
              )}
            </div>
          </div>
        </div>

        <div className={styles.listContainer}>

          {/* Main */}
          <div className={styles.item + ' ' + (state ? styles.ItemOpenMenu : styles.ItemCloseMenu)}>
            {!state && <span className={styles.navTooltip}>Main</span>}
            <p onClick={() => changeSubMenu('Home')} className={(activeOption === 'main' ? styles.activeItem : '') + ' flex items-center gap-2'}>
              <Home size={20} />
              <span className={(state ? null : styles.hidden) + ' mt-1 flex-1'}>Main</span>
              <Chevron open={subHome} />
            </p>
            <ul className={state && subHome ? null : styles.hidden}>
              {isTempStudent
                ? <li onClick={() => Navigator('/studentDashboard/main/selfProfiling')} className={styles.subOptions + ' ' + (activeSubOption === 'selfProfiling' ? styles.activeSubOption : '')}>Self Profiling</li>
                : <li onClick={() => Navigator('/studentDashboard/main/home')} className={styles.subOptions + ' ' + (activeSubOption === 'home' ? styles.activeSubOption : '')}>Home</li>
              }
            </ul>
          </div>

          {/* Items only for regular students */}
          {!isTempStudent && <>
            {/* Complaint */}
            <div className={styles.item + ' ' + (state ? styles.ItemOpenMenu : styles.ItemCloseMenu)}>
              {!state && <span className={styles.navTooltip}>Complaint</span>}
              <p onClick={() => changeSubMenu('complaints')} className={(activeOption === 'complaints' ? styles.activeItem : '') + ' flex items-center gap-2'}>
                <Headphones size={20} />
                <span className={(state ? null : styles.hidden) + ' mt-1 flex-1'}>Complaint</span>
                <Chevron open={subComplaint} />
              </p>
              <ul className={state && subComplaint ? null : styles.hidden}>
                <li onClick={() => Navigator('/studentDashboard/complaints/register')} className={styles.subOptions + ' ' + (activeSubOption === 'register' ? styles.activeSubOption : '')}>Register</li>
                <li onClick={() => Navigator('/studentDashboard/complaints/status')} className={styles.subOptions + ' ' + (activeSubOption === 'status' ? styles.activeSubOption : '')}>Status</li>
              </ul>
            </div>

            {/* Application */}
            <div className={styles.item + ' ' + (state ? styles.ItemOpenMenu : styles.ItemCloseMenu)}>
              {!state && <span className={styles.navTooltip}>Application</span>}
              <p onClick={() => changeSubMenu('request')} className={(activeOption === 'student' ? styles.activeItem : '') + ' flex items-center gap-2'}>
                <FileText size={20} />
                <span className={(state ? null : styles.hidden) + ' mt-1 flex-1'}>Application</span>
                <Chevron open={subRequest} />
              </p>
              <ul className={state && subRequest ? null : styles.hidden}>
                <li onClick={() => Navigator('/studentDashboard/student/application')} className={styles.subOptions + ' ' + (activeSubOption === 'application' ? styles.activeSubOption : '')}>New Application</li>
                <li onClick={() => Navigator('/studentDashboard/student/applicationstatus')} className={styles.subOptions + ' ' + (activeSubOption === 'applicationstatus' ? styles.activeSubOption : '')}>Application Status</li>
              </ul>
            </div>

            {/* Notices */}
            <div className={styles.item + ' ' + (state ? styles.ItemOpenMenu : styles.ItemCloseMenu)}>
              {!state && <span className={styles.navTooltip}>Notices</span>}
              <p onClick={() => changeSubMenu('notices')} className={(activeOption === 'notices' ? styles.activeItem : '') + ' flex items-center gap-2'}>
                <StickyNote size={20} />
                <span className={(state ? null : styles.hidden) + ' mt-1 flex-1'}>Notices</span>
                <Chevron open={subNotice} />
              </p>
              <ul className={state && subNotice ? null : styles.hidden}>
                <li onClick={() => Navigator('/studentDashboard/notices/view')} className={styles.subOptions + ' ' + (activeSubOption === 'view' ? styles.activeSubOption : '')}>View Notices</li>
              </ul>
            </div>

            {/* Mess */}
            <div className={styles.item + ' ' + (state ? styles.ItemOpenMenu : styles.ItemCloseMenu)}>
              {!state && <span className={styles.navTooltip}>Mess</span>}
              <p onClick={() => changeSubMenu('mess')} className={(activeOption === 'mess' ? styles.activeItem : '') + ' flex items-center gap-2'}>
                <Utensils size={20} />
                <span className={(state ? null : styles.hidden) + ' mt-1 flex-1'}>Mess</span>
                <Chevron open={subMess} />
              </p>
              <ul className={state && subMess ? null : styles.hidden}>
                <li onClick={() => Navigator('/studentDashboard/mess/menu')} className={styles.subOptions + ' ' + (activeSubOption === 'menu' ? styles.activeSubOption : '')}>Mess Menu</li>
              </ul>
            </div>

            {/* Guest Referral */}
            <div className={styles.item + ' ' + (state ? styles.ItemOpenMenu : styles.ItemCloseMenu)}>
              {!state && <span className={styles.navTooltip}>Guest Referral</span>}
              <p onClick={() => changeSubMenu('referral')} className={(activeOption === 'guest' ? styles.activeItem : '') + ' flex items-center gap-2'}>
                <Hotel size={20} />
                <span className={(state ? null : styles.hidden) + ' mt-1 flex-1'}>Guest Referral</span>
                <Chevron open={subReferral} />
              </p>
              <ul className={state && subReferral ? null : styles.hidden}>
                <li onClick={() => Navigator('/studentDashboard/guest/referral')} className={styles.subOptions + ' ' + (activeSubOption === 'referral' ? styles.activeSubOption : '')}>Verify Guest Referral</li>
              </ul>
            </div>
          </>}

        </div>
      </div>
    </div>

    {/* ── Mobile nav ── */}
    <div className={`block w-full ${state ? 'h-full' : 'h-[60px]'} fixed transition-all top-0 left-0 backdrop-blur-md z-50 md:hidden`}>
      <div className='h-full w-full bg-[#131133] absolute top-0 left-0 opacity-85 -z-1'></div>
      <div className='w-full h-[60px] absolute top-0 left-0 items-center p-4 flex z-50'>
        <div className='flex-1'><h2 className='text-white'>NIT Hms</h2></div>
        <div onClick={handleHamBurger} className='cursor-pointer'>
          <div id='ham1' className='w-[25px] h-[4px] bg-white rounded-sm origin-center transition-all'></div>
          <div id='ham2' className='w-[25px] h-[4px] bg-white rounded-sm mt-1 transition-all'></div>
          <div id='ham3' className='w-[25px] h-[4px] bg-white rounded-sm mt-1 origin-center transition-all'></div>
        </div>
      </div>

      <div className={`${state ? '' : 'hidden'} absolute w-full h-full top-0 left-0 flex justify-center items-center text-white`}>
        <ul>
          <li className='cursor-pointer flex flex-col text-xl font-semibold'>
            <div onClick={() => changeSubMenu('Home')} className={`flex items-center gap-2 ${activeOption === 'main' ? 'text-orange-400' : 'text-white'}`}>
              <Home size={15} /> Main
            </div>
            <ul className={`${subHome ? '' : 'hidden'} text-sm text-white font-thin ml-8`}>
              {isTempStudent
                ? <li onClick={() => { Navigator('/studentDashboard/main/selfProfiling'); handleHamBurger(); }} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption === 'selfProfiling' ? 'bg-blue-900 font-normal' : ''}`}>Self Profiling</li>
                : <li onClick={() => { Navigator('/studentDashboard/main/home'); handleHamBurger(); }} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption === 'home' ? 'bg-blue-900 font-normal' : ''}`}>Home</li>
              }
            </ul>
          </li>

          {!isTempStudent && <>
            <li className='mt-4 cursor-pointer flex flex-col text-xl font-semibold'>
              <div onClick={() => changeSubMenu('complaints')} className={`flex items-center gap-2 ${activeOption === 'complaints' ? 'text-orange-400' : 'text-white'}`}>
                <Headphones size={15} /> Complaints
              </div>
              <ul className={`${subComplaint ? '' : 'hidden'} text-sm text-white font-thin ml-8`}>
                <li onClick={() => { Navigator('/studentDashboard/complaints/register'); handleHamBurger(); }} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption === 'register' ? 'bg-blue-900 font-normal' : ''}`}>Register Complaint</li>
                <li onClick={() => { Navigator('/studentDashboard/complaints/status'); handleHamBurger(); }} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption === 'status' ? 'bg-blue-900 font-normal' : ''}`}>Check Status</li>
              </ul>
            </li>

            <li className='mt-4 cursor-pointer flex flex-col text-xl font-semibold'>
              <div onClick={() => changeSubMenu('request')} className={`flex items-center gap-2 ${activeOption === 'student' ? 'text-orange-400' : 'text-white'}`}>
                <FileText size={15} /> Applications
              </div>
              <ul className={`${subRequest ? '' : 'hidden'} text-sm text-white font-thin ml-8`}>
                <li onClick={() => { Navigator('/studentDashboard/student/application'); handleHamBurger(); }} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption === 'application' ? 'bg-blue-900 font-normal' : ''}`}>New Application</li>
                <li onClick={() => { Navigator('/studentDashboard/student/applicationstatus'); handleHamBurger(); }} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption === 'applicationstatus' ? 'bg-blue-900 font-normal' : ''}`}>Application Status</li>
              </ul>
            </li>

            <li className='mt-4 cursor-pointer flex flex-col text-xl font-semibold'>
              <div onClick={() => changeSubMenu('notices')} className={`flex items-center gap-2 ${activeOption === 'notices' ? 'text-orange-400' : 'text-white'}`}>
                <StickyNote size={15} /> Notices
              </div>
              <ul className={`${subNotice ? '' : 'hidden'} text-sm text-white font-thin ml-8`}>
                <li onClick={() => { Navigator('/studentDashboard/notices/view'); handleHamBurger(); }} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption === 'view' ? 'bg-blue-900 font-normal' : ''}`}>View Notices</li>
              </ul>
            </li>

            <li className='mt-4 cursor-pointer flex flex-col text-xl font-semibold'>
              <div onClick={() => changeSubMenu('mess')} className={`flex items-center gap-2 ${activeOption === 'mess' ? 'text-orange-400' : 'text-white'}`}>
                <Utensils size={15} /> Mess
              </div>
              <ul className={`${subMess ? '' : 'hidden'} text-sm text-white font-thin ml-8`}>
                <li onClick={() => { Navigator('/studentDashboard/mess/menu'); handleHamBurger(); }} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption === 'menu' ? 'bg-blue-900 font-normal' : ''}`}>Mess Menu</li>
              </ul>
            </li>

            <li className='mt-4 cursor-pointer flex flex-col text-xl font-semibold'>
              <div onClick={() => changeSubMenu('referral')} className={`flex items-center gap-2 ${activeOption === 'guest' ? 'text-orange-400' : 'text-white'}`}>
                <Hotel size={15} /> Guest Referral
              </div>
              <ul className={`${subReferral ? '' : 'hidden'} text-sm text-white font-thin ml-8`}>
                <li onClick={() => { Navigator('/studentDashboard/guest/referral'); handleHamBurger(); }} className={`text-xl hover:scale-110 transition-all rounded-md px-2 py-[2px] ${activeSubOption === 'referral' ? 'bg-blue-900 font-normal' : ''}`}>Verify Guest Referral</li>
              </ul>
            </li>
          </>}
        </ul>

        <div onClick={handleLogout} className='absolute bottom-16 cursor-pointer left-[40%] text-white'>
          Logout
        </div>
      </div>
    </div>
  </>;
}
