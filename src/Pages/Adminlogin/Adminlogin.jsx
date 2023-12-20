import styles from './Adminlogin.module.scss';
import Textinput from '../../Components/Textinput/Textinput';
import Button from '../../Components/Button/Button';
import logoImage from '../../Assets/nit-logo.png'
import { IoArrowBack } from "react-icons/io5";
import { IconContext } from "react-icons";
import { useNavigate } from 'react-router-dom';

export default function(){


    const onMouse = ()=>{
        document.getElementById('role-content').innerText = "Change Role"; 
    }

    const onLeave = ()=>{
        document.getElementById('role-content').innerText = ""; 
    }

    const Navigator = useNavigate();



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
                    <Textinput style={{minWidth:'300px'}} label="Email"/>
                    <Textinput type='password' style={{marginTop:'25px',minWidth:'300px'}} label="Password"/>
                    <Button variant="contained" style={{marginTop:'25px',minWidth:'300px'}} text="login"/>
                    <p style={{marginTop:'10px'}}>Forgot Password?</p>
                </div>
                </div>
            </div>
        </div>
    </>
}

