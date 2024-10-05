import styles from './Studentlogin.module.scss';
import Textinput from '../../components/Textinput/Textinput';
import Button from '../../components/Button/Button';
import logoImage from '../../Assets/nit-logo.png'
import { IoArrowBack } from "react-icons/io5";
import { IconContext } from "react-icons";
import { useNavigate } from 'react-router-dom';
import {useState} from 'react';
import axios from 'axios';
import { ToastContainer,toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setUserData } from '../../Store/Reducers/userSlice';

const Studentlogin = ()=>{

    const Dispatcher = useDispatch();

    const [data, setData] = useState({ email: null, password: null })
    
    const Navigator = useNavigate();
    const onSetMyData = (key, value) => {
        setData((prev) => {
            return { ...prev, [key]: value }
        }
        )

        console.log(data);
    }
    

    const onSubmit = async (e) => {
        
        e.preventDefault();
        try {
            const res = await axios({
                method: 'post',
                url: import.meta.env.VITE_BASE_URL + '/student/login',
                data: data,
                withCredentials: true
            })
            console.log(res);
            if (res.data.role === 'Student') {
                Dispatcher(setUserData({...res.data.dataValues,roleType:'Student'}))
                Navigator('/studentDashboard/main/home');
            }
        } catch (err) {
            console.log(err);
            toast.error('Invalid Credentials',{
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            
            });
        }
    }






    return <>
    <div className={styles.container}>
        <div className={styles.logoSection}>
        <div className={styles.opacityCover}></div>
        <div onClick={()=>{Navigator("/");localStorage.removeItem('role')}} 
        className={`cursor-pointer h-12 absolute top-8 left-4 px-4 py-2 flex justify-center items-center rounded-full bg-blue-600 hover:bg-blue-500 text-white`}>
        <IconContext.Provider value={{size:20}}>
            <p className='flex justify-center items-center gap-1 text-white'>
            <IoArrowBack className={styles.backicon}/><span id="role-content" >Change Role</span></p>
            </IconContext.Provider>
        </div>
        <div className={styles.logoContent}>
            <img className={styles.logo} src={logoImage} />
            <h1 className='text-4xl'>NIT Hostel Management <br/>System</h1>
        </div>
        </div>
        <div className={styles.contentSection}>
            <div className={styles.contentHeadings}>
                <h3 className='text-3xl'>Student Login</h3>
                <p>Enter your email and Password to login to dashboard</p>
            </div>
            <div className={styles.inputSection}>
            <div className={styles.inputBoxes}>
                <form onSubmit={onSubmit} className='flex flex-col gap-5'>
                <Textinput onChange={(e)=>{
                    onSetMyData('email',e.target.value);
                }} style={{minWidth:'300px'}} label="Email"/>
                <Textinput 
                onChange={
                    (e)=>{
                        onSetMyData('password',e.target.value);
                    }
                }
                type='password' style={{marginTop:'0px',minWidth:'300px'}} label="Password"/>
                <Button variant="contained" type="submit" className={`bg-indigo-500`} style={{marginTop:'0px',minWidth:'300px'}} text="login"/>
                </form>
                <p onClick={()=>{Navigator('/forgetPass')}} className='cursor-pointer' style={{ marginTop: '0px' }}>Forgot Password?</p>
                <div style={{display:'flex', flexDirection: 'row'}}>
                <p style={{marginTop:'10px',marginRight:'10px',fontSize:'14px'}}>Don't Have an Account?</p>
                <div>
                    <Button onClick={()=>{Navigator('/StudentSignUp')}} style={{padding:'5px 20px'}} variant="contained" text="Sign Up" />
                </div>
                </div>
            </div>
            </div>
        </div>
    </div>
    <ToastContainer />
</>
    

}


export default Studentlogin;