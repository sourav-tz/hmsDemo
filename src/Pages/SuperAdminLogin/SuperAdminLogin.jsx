import styles from './SuperAdminLogin.module.scss'
import Textinput from '../../components/Textinput/Textinput'
import Button2 from '../../components/Button/Button'
import logoImage from '../../Assets/nit-logo.png'
import { IoArrowBack } from 'react-icons/io5'
import { IconContext } from 'react-icons'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUserData } from '../../Store/Reducers/userSlice'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FaEye, FaEyeSlash } from "react-icons/fa";


import GoogleButton from '../../components/Button/GoogleButton'

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp'

import { Button } from '@/components/ui/button'
import { FaE } from 'react-icons/fa6'


export default function SuperAdminLogin() {
  const [data, setData] = useState({ email: null, password: null })
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(false)
  const [OTP,setOTP] = useState(null);
  const Navigator = useNavigate();
  const Dispatcher = useDispatch();
  const [expire, setExpire] = useState('5:00');



  useEffect(() => {
    if(step){
      const interval = setInterval(() => {
        setExpire((prev) => {
          const time = prev.split(':')
          let min = parseInt(time[0])
          let sec = parseInt(time[1])
          if (min === 0 && sec === 0) {
            clearInterval(interval)
            return '0:00'
          }
          if (sec === 0) {
            min = min - 1
            sec = 59
          } else {
            sec = sec - 1
          }
          return `${min}:${sec}`
        })
      }, 1000)

      return () => clearInterval(interval)
    }

  }, [step,expire])



 


  const handleEmail = (e) => {
    setData((prev) => {
      return { ...prev, email: e.target.value }
    })
  }

  const handlePassword = (e) => {
    setData((prev) => {
      return { ...prev, password: e.target.value }
    })
  }

  const handleEnterSubmit = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e)
    }
  }

  const takeOTP = (e) => {
    setOTP(e);
  }

  const handleOtpEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      verfiyOTP()
    }
  }

  // GOOGLE OAuth
  const handelGoogleClick = async () => {}

  const handleSubmit = async (e) => {
    e?.preventDefault()
    setLoading(true)
    try {
      const res = await axios({
        method: 'post',
        url: import.meta.env.VITE_BASE_URL + '/SA/superlogin',
        data: data,
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })
      if (res.data.userData.role !== 'SuperAdmin') {
        toast.error('Invalid Credentials')
        setLoading(false)
        return
      }
      // verify otp code
      setStep(true)

      // Navigator('/superAdminDashboard/main/home');
      setLoading(false)
    } catch (err) {
      toast.error('FE:Error in SA Login')
      setLoading(false)
    }
  }


  const verfiyOTP = async () => {
    try {
      const res = await axios({
        method: 'post',
        url: import.meta.env.VITE_BASE_URL + '/SA/superAdminLoginToken',
        data: { otp: OTP,email:data.email },
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })
      if (res.data.message === 'OTP verified Successfully') {
        Dispatcher(setUserData(res.data));
        Navigator('/superAdminDashboard/main/home');
      }
    } catch (err) {
      toast.error('Invalid OTP')
    }
  }

  const againOTP = async () => {
    try {
      const res = await axios({
        method: 'post',
        url: import.meta.env.VITE_BASE_URL + '/SA/superlogin',
        data: data,
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })
      if (res.data.message === 'Otp sent successfully') {
        
        Dispatcher(setUserData(res.data));
        toast.success('OTP sent');
        setExpire('5:00');
      }
    } catch (err) {
      toast.error('Invalid OTP')
    }
  }

  // function to handle visible/hidden password
  const [visible,setVisible] = useState(false);
  const handleShowPassword = ()=>{
    setVisible(!visible);
  }

  return (
    <>
      {!step ? (
        <div className={styles.container}>
          <div className={styles.logoSection}>
            <div className={styles.opacityCover}></div>
            <div
              onClick={() => {
                Navigator('/role')
                localStorage.removeItem('role')
              }}
              className={`cursor-pointer h-12 absolute top-8 left-4 px-4 py-2 
                flex justify-center items-center rounded-full bg-blue-600 
                hover:bg-blue-500 text-white`}
            >
              <IconContext.Provider value={{ size: 20 }}>
                <p className='flex justify-center items-center gap-1'>
                  <IoArrowBack className={`cursor-pointer text-white`} />
                  <span id='role-content'>Change Role</span>
                </p>
              </IconContext.Provider>
            </div>
            <div className={styles.logoContent}>
              <img className={styles.logo} src={logoImage} />
              <h1 className='text-4xl font-normal'>
                NIT Hostel Management <br />
                System
              </h1>
            </div>
          </div>
          <div className={styles.contentSection}>
            <div className={styles.contentHeadings}>
              <h3 className='text-2xl font-semibold'>Super Admin</h3>
              <p>Enter your Email and Password to login to dashboard</p>
            </div>
            <div className={styles.inputSection}>
              <div className={styles.inputBoxes}>
                <Textinput
                  style={{ minWidth: '300px' }}
                  onChange={handleEmail}
                  onKeyDown={handleEnterSubmit}
                  label='Email'
                />
                <div className='relative'>
                <Textinput
                  type={visible?'text': 'password'}
                  style={{ marginTop: '0px', minWidth: '300px' }}
                  onChange={handlePassword}
                  onKeyDown={handleEnterSubmit}
                  label='Password' 
                />
                {visible?<FaEye className='absolute min-[300px]:top-[3.1rem] sm:top-9 md:top-8 right-3 cursor-pointer min-[300px]:size-6 sm:size-4 md:size-4' color='#5F57FF' onClick={handleShowPassword}></FaEye>:             
                <FaEyeSlash className='absolute min-[300px]:top-[3.1rem] sm:top-9 md:top-8 right-3 cursor-pointer min-[300px]:size-6 sm:size-4 md:size-4' color='#5F57FF' onClick={handleShowPassword}></FaEyeSlash>}
   
                </div>
                
              
                <Button2
                  onClick={handleSubmit}
                  loading={loading}
                  variant='contained'
                  style={{ marginTop: '0px', minWidth: '300px' }}
                  text='login'
                />

                <GoogleButton
                  onClick={handelGoogleClick}
                  loading={loading}
                  variant='contained'
                  style={{ marginTop: '0px' }}
                  text='Continue With Google'
                />

<p onClick={()=>{Navigator('/forgetPass')}} className='cursor-pointer' style={{ marginTop: '0px' }}>Forgot Password?</p>
              </div>
            </div>
          </div>
          <ToastContainer />
        </div>
      ) : null}

      {step ? (
        <div className='flex flex-col items-center bg-indigo-600 min-h-screen w-full text-white'>
          <h1 className='text-3xl font-semibold mt-10'>OTP Verification</h1>
          <p className='text-indigo-950'>Enter the OTP sent to your email</p>
          <p className='text-indigo-950'>Expires in : {expire}</p>
          <div
            className='mt-36 flex-col items-center'
            onKeyDown={handleOtpEnter}
          >
            <InputOTP maxLength={6} onChange={takeOTP}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            <div className='mt-10'>
              <Button onClick={verfiyOTP} className='bg-white text-black  hover:bg-gray-200 w-full'>
                Verify
              </Button>
              <p className='text-center mt-4'>
                Didn't receive the OTP?{' '}
                <button type='button' className={`${expire==='0:00'?'text-indigo-950 hover:text-white cursor-pointer':'text-gray-300 hover:text-gray-300 cursor-wait'} `} disable={expire==='0:00'?false:true} onClick={()=>{againOTP()}}>Resend</button>
              </p>
            </div>
          </div>
          <ToastContainer />
        </div>
      ) : null}
    </>
  )
}
