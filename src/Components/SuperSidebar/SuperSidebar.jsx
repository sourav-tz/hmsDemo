import { useEffect, useState } from 'react';
import styles from './SuperSidebar.module.scss';
import { FaUserLarge } from "react-icons/fa6";
import { IconContext } from 'react-icons';
import { IoHome } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa6";
import { FaInfo } from "react-icons/fa";
import { MdOutlineBedroomChild } from "react-icons/md";
import { FaGear } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import { setActiveOption,setActiveSubOption,openMenu,closeMenu } from '../../Store/Reducers/superSidebarSlice';
import { BsHouses } from "react-icons/bs";

export default function SuperSidebar(){


    const Navigator = useNavigate();
    const Dispatcher = useDispatch();

    const state = useSelector(state=>state.superSideBarStates.state);
    const userData = useSelector(state=>state.userStorage.data);
    const activeOption = useSelector(state=>state.superSideBarStates.activeOption);
    const activeSubOption = useSelector(state=>state.superSideBarStates.activeSubOption);

    useEffect(()=>{
        console.log(activeOption);
        console.log(activeSubOption);
    },[activeOption])

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

        }else if(value === 'roomInfo'){
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

    const changeActiveOption = (value)=>{
            Dispatcher(setActiveOption(value));
    }

    const changeActiveSubOption = (value)=>{
        Dispatcher(setActiveSubOption(value));
    }



    return<>
    <IconContext.Provider value={{size:"20px"}} >
        <div id="Sidebar" onMouseOver={()=>Dispatcher(openMenu())} onMouseLeave={()=>Dispatcher(closeMenu())} className={(styles.sidebarContainer)+' '+(state?styles.active:styles.inActive)}>
           <div className={styles.itemsContainer}>
            <div className={styles.userItem}>
                <div id="userIconSidebar" className={styles.userIcon}>
                {userData.avatar!=undefined?<img className={styles.avatarImage} src={userData.avatar} />:<FaUserLarge size="1.5em" color="white"/>}
                </div>
                <div className={state?null:styles.hidden} style={{marginLeft:'8px',marginTop:'0px'}}><p>{userData.name!==undefined?userData.name:'Null'}<br/><span className={styles.userRole} style={{fontSize:'12px'}}>{userData.roleType!==undefined?`Role: ${userData.roleType}`:'Role: Null'}</span></p></div>
            </div>
            <div className={styles.listContainer}>
            <div  className={(styles.item) +' '+' '+(state?styles.ItemOpenMenu:styles.ItemCloseMenu)}>
                        <p onClick={()=>{changeSubMenu('Home')}} className={(activeOption==='Home'?styles.activeItem:null) + ' flex items-center gap-2'}><i><IoHome  size="20px"/></i> <span className={(state?null:styles.hidden)+' mt-1'}>Main</span></p>
                        <ul className={state&&subHome?null:styles.hidden} >
                        <li onClick={()=>{changeActiveOption('Home');changeActiveSubOption('Home')}} className={styles.subOptions+' ' + (activeSubOption==='Home'?styles.activeSubOption:null)}>Home</li>
                        </ul>
            </div>
            <div  className={styles.item +' '+(state?styles.ItemOpenMenu:styles.ItemCloseMenu)}>
                        <p onClick={()=>{changeSubMenu('studentInfo')}} className={(activeOption==='studentInfo'?styles.activeItem:null)+ ' flex items-center gap-2'}><FaInfo /> <span className={(state?null:styles.hidden)+' mt-1'}>Student Actions</span></p>
                        <ul className={state&&subStudent?null:styles.hidden}>
                        <li onClick={()=>{changeActiveOption('studentInfo'); changeActiveSubOption('siViewInfo')}} className={styles.subOptions+' ' + (activeSubOption==='siViewInfo'?styles.activeSubOption:null)}>View Info</li>
                        <li onClick={()=>{changeActiveOption('studentInfo'); changeActiveSubOption('siUploadInfo')}} className={styles.subOptions+' ' + (activeSubOption==='siUploadInfo'?styles.activeSubOption:null)}>Add Courses</li>
                        </ul>
            </div>
            <div  className={styles.item +' '+(state?styles.ItemOpenMenu:styles.ItemCloseMenu)}>
                        <p onClick={()=>{changeSubMenu('roomInfo')}} className={(activeOption==='roomInfo'?styles.activeItem:null)+ ' flex items-center gap-2'}><MdOutlineBedroomChild /> <span className={(state?null:styles.hidden)+' mt-1'}>Room Actions</span></p>
                        <ul className={state&&subRoom?null:styles.hidden}>
                        <li onClick={()=>{changeActiveOption('roomInfo');changeActiveSubOption('riAllotRoom')}} className={(state?null:styles.hidden)+' '+styles.subOptions+' ' + (activeSubOption==='riAllotRoom'?styles.activeSubOption:null)}>Allocate</li>
                        </ul>
            </div>
            <div  className={styles.item +' '+(state?styles.ItemOpenMenu:styles.ItemCloseMenu)}>
                        <p onClick={()=>{changeSubMenu('hostels')}} className={(activeOption==='hostels'?styles.activeItem:null)+ ' flex items-center gap-2'}><BsHouses /> <span className={(state?null:styles.hidden)+' mt-1'}>Hostels</span></p>
                        <ul className={state&&subHostel?null:styles.hidden}>
                        <li onClick={()=>{changeActiveOption('hostels');changeActiveSubOption('hmManageHostel')}} className={(state?null:styles.hidden)+' '+styles.subOptions+' ' + (activeSubOption==='hmManageHostel'?styles.activeSubOption:null)}>Manage Hostels</li>
                        <li onClick={()=>{changeActiveOption('hostels');changeActiveSubOption('hmManageAdmin')}} className={(state?null:styles.hidden)+' '+styles.subOptions+' ' + (activeSubOption==='hmManageAdmin'?styles.activeSubOption:null)}>Manage Admins</li>
                        </ul>
            </div>
            </div>
            </div>
            <div className={styles.Settings}>
            <div  className={styles.item +' '+(state?styles.ItemOpenMenu:styles.ItemCloseMenu)}>
                        <p onClick={()=>{changeSubMenu('settings')}} className={' flex items-center gap-2'+(activeOption==='settings'?styles.activeItem:null)}><FaGear /> <span className={state?null:styles.hidden}>Settings</span></p>
                        <ul className={state&&subSettings?null:styles.hidden}>
                        <li onClick={()=>{changeActiveOption('settings');changeActiveSubOption('profileSettings');changeActiveSubOption('profileSettings')}} className={(state?null:styles.hidden)+' '+styles.subOptions+' ' + (activeSubOption==='profileSettings'?styles.activeSubOption:null)}>Profile Settings</li>
                        <li onClick={()=>{changeActiveOption('settings');changeActiveSubOption('securitySettings');changeActiveSubOption('securitySettings')}} className={(state?null:styles.hidden)+' '+styles.subOptions +' ' + (activeSubOption==='securitySettings'?styles.activeSubOption:null)}>Security Settings</li>
                        </ul>
            </div>
            </div>
        </div>
    </IconContext.Provider>
    </>
}


