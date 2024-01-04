import styles from './Adminlogin.module.scss';
import Textinput from '../../Components/Textinput/Textinput';
import Button from '../../Components/Button/Button';
import logoImage from '../../Assets/nit-logo.png'
import { IoArrowBack } from "react-icons/io5";
import { IconContext } from "react-icons";
import { useNavigate } from 'react-router-dom';
import { changeLoginStatus } from '../../Store/Reducers/loginSlice';
import { useDispatch } from 'react-redux';
import {useEffect, useState} from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import config from '../../config/config';

export default function(){

    const [data,setData] = useState({email:null,password:null});
    const [loading, setLoading] = useState(false);
    const Dispatcher = useDispatch();

    useEffect(()=>{
        axios.get('http://localhost:3000/HA/adminLogout',config)
        .then(res=>console.log(res))
        .catch(err=>console.log(err))
    },[])

    const onMouse = ()=>{
        document.getElementById('role-content').innerText = "Change Role"; 
    }

    const onLeave = ()=>{
        document.getElementById('role-content').innerText = ""; 
    }

    const Navigator = useNavigate();

    const handleEmail = (e)=>{
        setData((prev) =>{return {...prev,email:e.target.value}});
        console.log(data);
    }

    const handlePassword = (e)=>{
        setData((prev)=>{return {...prev,password:e.target.value}});
        console.log(data);
    }


    const handleSubmit = ()=>{
        setLoading(true);
        const config = {
            headers: {
              "Content-Type": "application/json"
              },
              withCredentials: true
            }
        axios.post('http://localhost:3000/HA/adminLogin',data,config)
        .then((res)=>{
            console.log(res)
            Navigator('/adminDashboard')
            setLoading(false);
        })
            .catch(err=>
                {
                    console.log(err);
                    setLoading(false);
                    toast.error("Invalid UserName or Password !", {
                        position: toast.POSITION.TOP_RIGHT
                      });
                
                });

    }

    return <>
        <div className={styles.container}>
            <div className={styles.logoSection}>
            <div className={styles.opacityCover}></div>
            <div onMouseOver={onMouse} onMouseLeave={onLeave} onClick={()=>{Navigator("/");localStorage.removeItem('role')}} className={styles.changeRole}>
            <IconContext.Provider value={{size:20}}>
                <p><IoArrowBack className={styles.backicon}/><span id="role-content" className={styles.roleContent}></span></p>
                </IconContext.Provider>
            </div>
            <div className={styles.logoContent}>
                <img className={styles.logo} src={logoImage} />
                <h1>NIT Hostel Management <br/>System</h1>
            </div>
            </div>
            <div className={styles.contentSection}>
                <div className={styles.contentHeadings}>
                    <h3>Admin Login</h3>
                    <p>Enter your email and Password to login to dashboard</p>
                </div>
                <div className={styles.inputSection}>
                <div className={styles.inputBoxes}>
                    <Textinput style={{minWidth:'300px'}}  onChange={handleEmail} label="Email"/>
                    <Textinput type='password' style={{marginTop:'25px',minWidth:'300px'}} onChange={handlePassword} label="Password"/>
                    <Button onClick={handleSubmit} loading={loading} variant="contained" style={{marginTop:'25px',minWidth:'300px'}} text="login"/>
                    <p style={{marginTop:'10px'}}>Forgot Password?</p>
                </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    </>
}