import { useEffect, useState } from 'react';
import styles from './GuestSidebar.module.scss';
import { FaUserLarge } from "react-icons/fa6";
import { IconContext } from 'react-icons';
import { IoHome } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa6";
import { FaInfo } from "react-icons/fa";
import { MdLocalHotel, MdOutlineBedroomChild } from "react-icons/md";
import { FaGear } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaBookmark } from "react-icons/fa";

export default function GuestSidebar(){

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
    const [subBook, setSubBook] = useState(false);
    const [subStatus, setSubStatus] = useState(false);

    const openMenu = ()=>{
        changeState(true);
    }

    const closeMenu = ()=>{
        changeState(false);
    }

    const changeSubMenu = (value)=>{

        if(value === 'Home'){
            setSubHome(prev => !prev);
            setSubBook(false);
            setSubStatus(false);
        }else if(value ==='bookRoom'){
            setSubHome(false);
            setSubBook(prev => !prev);
            setSubStatus(false);
        }else if(value === 'checkStatus'){
            setSubHome(false);
            setSubBook(false);
            setSubStatus(prev=>!prev);
        }
    }


    return<>
    {/* Guest Sidebar only shows when not on home page */}
    {activeOption !== "home" ? 
    <>
        <IconContext.Provider value={{size:"20px"}} >
        <div id="Sidebar" onMouseOver={openMenu} onMouseLeave={closeMenu} className={(styles.sidebarContainer)+' '+(state?styles.active:styles.inActive) + ' hidden md:block'}>
           <div className={styles.itemsContainer}>
            <div className={styles.userItem}>
                <div id="userIconSidebar" className={styles.userIcon}>
                {userData?.avatar!=undefined?<img className={styles.avatarImage} src={userData?.avatar} />:<FaUserLarge size="1.5em" color="white"/>}
                </div>
                <div className={state?null:styles.hidden} style={{marginLeft:'8px',marginTop:'16px',fontSize:'16px'}}>Welcome, Guest!</div>
            </div>
            <div className={styles.listContainer}>
            <div  className={(styles.item) +' '+' '+(state?styles.ItemOpenMenu:styles.ItemCloseMenu)}>
                        <p onClick={()=>{changeSubMenu('Home');Navigator('/guest/home')}} className={(activeOption==='home'?styles.activeItem:null) + ' flex items-center gap-2'}><i><IoHome  size="20px"/></i> <span className={(state?null:styles.hidden)+' mt-1'}>Rules And Information</span></p>
            </div>
            <div  className={styles.item +' '+(state?styles.ItemOpenMenu:styles.ItemCloseMenu)}>
                        <p onClick={()=>{changeSubMenu('bookRoom');navigator('/guest/register')}} className={(activeOption==='register'?styles.activeItem:null)+ ' flex items-center gap-2'}><MdLocalHotel /> <span className={(state?null:styles.hidden)+' mt-1'}>Apply For Rooms</span></p>
                      
            </div>
            <div  className={styles.item +' '+(state?styles.ItemOpenMenu:styles.ItemCloseMenu)}>
                        <p onClick={()=>{changeSubMenu('checkStatus');navigator('/guest/status')}} className={(activeOption==='status'?styles.activeItem:null)+ ' flex items-center gap-2'}><FaBookmark /> <span className={(state?null:styles.hidden)+' mt-1'}>Check Application Status</span></p>
            </div>

            </div>
            </div>
        </div>

 
    </IconContext.Provider>
    </>
    : ""}
    
    </>
}
