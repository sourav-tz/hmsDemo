import styles from './Studentlogin.module.scss';
import Textinput from '../../components/Textinput/Textinput';
import Button from '../../components/Button/Button';
import logoImage from '../../Assets/nit-logo.png';
import { IoArrowBack } from "react-icons/io5";
import { IconContext } from "react-icons";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setUserData } from '../../Store/Reducers/userSlice';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Studentlogin = () => {

  const Dispatcher = useDispatch();

  // ✅ Add role: 'Student' here
  const [data, setData] = useState({ email: null, password: null, role: 'Student' });

  const Navigator = useNavigate();

  const onSetMyData = (key, value) => {
    setData((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios({
        method: 'post',
        url: import.meta.env.VITE_BASE_URL + '/student/login',
        data: data, // this now includes role: 'Student'
        withCredentials: true
      });

      console.log('Login response:', res.data);

      if (res.data.roleType) {
        localStorage.setItem('role', res.data.roleType);
        if (res.data.roleType === 'TempStudent' && res.data.status) {
          localStorage.setItem('tempStatus', res.data.status);
        }
      }

      if (res.data.roleType === 'Student' || res.data.role === 'Student') {
        Dispatcher(setUserData({
          ...res.data.dataValues,
          roleType: 'Student'
        }));
        Navigator('/studentDashboard/main/home');
      } else if (res.data.roleType === 'TempStudent') {
        Dispatcher(setUserData({
          email: res.data.email,
          roleType: 'TempStudent',
          status: res.data.status
        }));
        localStorage.setItem('role', 'TempStudent');
        localStorage.setItem('tempStatus', res.data.status);
        Navigator('/studentDashboard/main/selfProfiling');

        if (res.data.status === 'pending') {
          toast.info('Please complete your profile information', {
            position: "top-right",
            autoClose: 5000
          });
        } else if (res.data.status === 'rejected') {
          toast.warning('Your profile was rejected. Please update and resubmit.', {
            position: "top-right",
            autoClose: 5000
          });
        }
      }

    } catch (err) {
      console.log(err);
      toast.error('Invalid Credentials', {
        position: "top-right",
        autoClose: 2000
      });
    }
  };

  // password visibility toggle
  const [visible, setVisible] = useState(false);
  const handleShowPassword = () => setVisible(!visible);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.logoSection}>
          <div className={styles.opacityCover}></div>
          <div
            onClick={() => { Navigator("/role"); localStorage.removeItem('role'); }}
            className={`cursor-pointer h-12 absolute top-8 left-4 px-4 py-2 flex justify-center items-center rounded-full bg-blue-600 hover:bg-blue-500 text-white`}
          >
            <IconContext.Provider value={{ size: 20 }}>
              <p className='flex justify-center items-center gap-1 text-white'>
                <IoArrowBack className={styles.backicon} /><span id="role-content">Change Role</span>
              </p>
            </IconContext.Provider>
          </div>
          <div className={styles.logoContent}>
            <img className={styles.logo} src={logoImage} />
            <h1 className='text-4xl'>NIT Hostel Management <br />System</h1>
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
                <Textinput onChange={(e) => onSetMyData('email', e.target.value)} style={{ minWidth: '300px' }} label="Email" />

                <div className='relative'>
                  <Textinput
                    onChange={(e) => onSetMyData('password', e.target.value)}
                    type={visible ? 'text' : 'password'}
                    style={{ marginTop: '0px', minWidth: '300px' }}
                    label="Password"
                  />
                  {visible
                    ? <FaEye className='absolute min-[300px]:top-[3.1rem] sm:top-9 md:top-8 right-3 cursor-pointer min-[300px]:size-6 sm:size-4 md:size-4' color='#5F57FF' onClick={handleShowPassword} />
                    : <FaEyeSlash className='absolute min-[300px]:top-[3.1rem] sm:top-9 md:top-8 right-3 cursor-pointer min-[300px]:size-6 sm:size-4 md:size-4' color='#5F57FF' onClick={handleShowPassword} />}
                </div>

                <Button variant="contained" type="submit" className={`bg-indigo-500`} style={{ marginTop: '0px', minWidth: '300px' }} text="login" />
              </form>
              <p onClick={() => { Navigator('/forgetPass'); }} className='cursor-pointer' style={{ marginTop: '0px' }}>Forgot Password?</p>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Studentlogin;
