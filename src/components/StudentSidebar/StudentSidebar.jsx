import { useEffect, useState } from 'react';
import styles from './Sidebar.module.scss';
import { FaUserLarge } from "react-icons/fa6";
import { IconContext } from 'react-icons';
import { IoHome } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa6";
import { FaInfo } from "react-icons/fa";
import { MdOutlineBedroomChild } from "react-icons/md";
import { FaGear } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import { setActiveOption,setActiveSubOption,openMenu,closeMenu } from '../../Store/Reducers/studentSidebar';
import { BsHouses } from "react-icons/bs";
import { FaFeatherPointed } from "react-icons/fa6";
export default function StudentSidebar(){


    const Navigator = useNavigate();
    const Dispatcher = useDispatch();

    const state = useSelector(state=>state.StudentSidebar.state);
    const userData = useSelector(state=>state.userStorage.data);
    const activeOption = useSelector(state=>state.StudentSidebar.activeOption);
    const activeSubOption = useSelector(state=>state.StudentSidebar.activeSubOption);

    useEffect(()=>{
        console.log(activeOption);
        console.log(activeSubOption);
    },[activeOption])

    const [subHome,setSubHome] = useState(false);
    const [subComplaint,setSubComplaint] = useState(false)
    const [subSettings, setSubSettings] = useState(false);



    const changeSubMenu = (value)=>{

        if(value === 'Home'){
            setSubHome(prev => !prev);
            setSubSettings(false);
            setSubComplaint(false);
        }else if(value === 'Complaint'){
            setSubHome(false);
            setSubSettings(false);
            setSubComplaint(prev => !prev);
        }else if(value === 'settings'){
            setSubHome(false);
            setSubSettings(prev => !prev);
            setSubComplaint(false);
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
           
            <div  className={(styles.item) +' '+' '+(state?styles.ItemOpenMenu:styles.ItemCloseMenu)}>
                        <p onClick={()=>{changeSubMenu('Complaint')}} className={(activeOption==='Complaint'?styles.activeItem:null) + ' flex items-center gap-2'}><i><FaFeatherPointed size="20"/></i> <span className={(state?null:styles.hidden)+' mt-1'}>Complaints</span></p>
                        <ul className={state&&subComplaint?null:styles.hidden} >
                        <li onClick={()=>{changeActiveOption('Complaint');changeActiveSubOption('cRegister')}} className={styles.subOptions+' ' + (activeSubOption==='cRegister'?styles.activeSubOption:null)}>Register Complaint</li>
                        <li onClick={()=>{changeActiveOption('Complaint');changeActiveSubOption('cStatus')}} className={styles.subOptions+' ' + (activeSubOption==='cStatus'?styles.activeSubOption:null)}>Register Status</li>
                        </ul>
            </div>
           
            </div>
            </div>
            <div className={styles.Settings}>
            <div  className={styles.item +' '+(state?styles.ItemOpenMenu:styles.ItemCloseMenu)}>
                        <p onClick={()=>{changeSubMenu('settings')}} className={' flex items-center gap-2 '+(activeOption==='settings'?styles.activeItem:null)}><FaGear /> <span className={(state?null:styles.hidden)+' ml-2'}>Settings</span></p>
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


