import { useState } from 'react';
import styles from './sidebar.module.scss';
import { FaUserLarge } from "react-icons/fa6";
import { IconContext } from 'react-icons';
import { IoHome } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa6";
import { FaInfo } from "react-icons/fa";
import { MdOutlineBedroomChild } from "react-icons/md";
import { FaGear } from "react-icons/fa6";

export default function Sidebar(){

    const [state,changeMenuState] = useState(false);
    const [activeOption,setActiveOption] = useState('Home');

    const [subHome,setSubHome] = useState(false);
    const [subStudent, setSubStudent] = useState(false);
    const [subRoom, setSubRoom] = useState(false);
    const [subSettings, setSubSettings] = useState(false);

    const openMenu = ()=>{
        changeMenuState(true);
    }

    const closeMenu = ()=>{
        changeMenuState(false);
    }

    const changeSubMenu = (value)=>{

        if(value === 'Home'){
            setSubHome(prev => !prev);
            setSubStudent(false);
            setSubRoom(false);
            setSubSettings(false);
        }else if(value ==='studentInfo'){
            setSubHome(false);
            setSubStudent(prev => !prev);
            setSubRoom(false);
            setSubSettings(false);
        }else if(value === 'roomInfo'){
            setSubHome(false);
            setSubStudent(false);
            setSubRoom(prev=>!prev);
            setSubSettings(false);
        }else if(value === 'settings'){
            setSubHome(false);
            setSubStudent(false);
            setSubRoom(false);
            setSubSettings(prev=>!prev);
        }

    }

    const changeActiveOption = (value)=>{
        if(value==='Home'){
            setActiveOption('Home');
        }else if(value === 'studentInfo'){
            setActiveOption('studentInfo');
        }else if(value === 'roomInfo'){
            setActiveOption('roomInfo')
        }else if(value==='settings'){
            setActiveOption('settings')
        }

    }



    return<>
    <IconContext.Provider value={{size:"20px"}} >
        <div onMouseOver={openMenu} onMouseLeave={closeMenu} className={(styles.sidebarContainer)+' '+(state?styles.active:styles.inActive)}>
           <div className={styles.itemsContainer}>
            <div className={styles.userItem}>
                <div className={styles.userIcon}>
                <FaUserLarge size="1.5em" color="white"/>
                </div>
                <div className={state?null:styles.hidden} style={{marginLeft:'8px',marginTop:'10px'}}><p>Parveen<br/><span className={styles.userRole} style={{fontSize:'12px'}}>Role: Hostel Admin</span></p></div>
            </div>
            <div className={styles.listContainer}>
            <div  className={styles.item +' '+' '+(state?styles.ItemOpenMenu:styles.ItemCloseMenu)}>
                        <p onClick={()=>{changeSubMenu('Home')}} className={activeOption==='Home'?styles.activeItem:null}><i><IoHome  size="20px"/></i> <span className={state?null:styles.hidden}>Main</span></p>
                        <ul className={state&&subHome?null:styles.hidden} >
                        <li onClick={()=>{changeActiveOption('Home')}} className={styles.subOptions}>Home</li>
                        </ul>
            </div>
            <div  className={styles.item +' '+(state?styles.ItemOpenMenu:styles.ItemCloseMenu)}>
                        <p onClick={()=>{changeSubMenu('studentInfo')}} className={activeOption==='studentInfo'?styles.activeItem:null}><i><FaInfo /></i> <span className={state?null:styles.hidden}>Student Info</span></p>
                        <ul className={state&&subStudent?null:styles.hidden}>
                        <li onClick={()=>{changeActiveOption('studentInfo')}} className={styles.subOptions}>View Info</li>
                        <li onClick={()=>{changeActiveOption('studentInfo')}} className={styles.subOptions}>Upload Info</li>
                        </ul>
            </div>
            <div  className={styles.item +' '+(state?styles.ItemOpenMenu:styles.ItemCloseMenu)}>
                        <p onClick={()=>{changeSubMenu('roomInfo')}} className={activeOption==='roomInfo'?styles.activeItem:null}><i><MdOutlineBedroomChild /></i> <span className={state?null:styles.hidden}>Room Info</span></p>
                        <ul className={state&&subRoom?null:styles.hidden}>
                        <li onClick={()=>{changeActiveOption('roomInfo')}} className={(state?null:styles.hidden)+' '+styles.subOptions}>Allot Rooms</li>
                        <li onClick={()=>{changeActiveOption('roomInfo')}} className={(state?null:styles.hidden)+' '+styles.subOptions}>Upload Info</li>
                        </ul>
            </div>
            </div>
            </div>
            <div className={styles.Settings}>
            <div  className={styles.item +' '+(state?styles.ItemOpenMenu:styles.ItemCloseMenu)}>
                        <p onClick={()=>{changeSubMenu('settings')}} className={activeOption==='settings'?styles.activeItem:null}><i><FaGear /></i> <span className={state?null:styles.hidden}>Settings</span></p>
                        <ul className={state&&subSettings?null:styles.hidden}>
                        <li onClick={()=>{changeActiveOption('settings')}} className={(state?null:styles.hidden)+' '+styles.subOptions}>Profile Settings</li>
                        <li onClick={()=>{changeActiveOption('settings')}} className={(state?null:styles.hidden)+' '+styles.subOptions}>Security Settings</li>
                        </ul>
            </div>
            </div>
        </div>
    </IconContext.Provider>
    </>
}