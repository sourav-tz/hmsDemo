import styles from './Adminlogin.module.scss'
import Textinput from '../../Components/Textinput/Textinput'
import Button from '../../Components/Button/Button'
import logoImage from '../../Assets/nit-logo.png'
import { IoArrowBack } from 'react-icons/io5'
import { IconContext } from 'react-icons'
import { useNavigate } from 'react-router-dom'
import { changeLoginStatus } from '../../Store/Reducers/loginSlice'
import { useDispatch } from 'react-redux'
import { setUserData } from '../../Store/Reducers/userSlice'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import config from '../../config/config'
import { GoogleAuthProvider, getAuth, signInWithPopup } from '@firebase/auth'
import { app } from '../../Firebase/firebase';
import GoogleButton from '../../Components/Button/GoogleButton';
import { setActiveOption,setActiveSubOption } from '../../Store/Reducers/sideBarSlice'
export default function () {
  const [data, setData] = useState({ email: null, password: null })
  const [loading, setLoading] = useState(false)
  const Dispatcher = useDispatch();

  useEffect(() => {
    axios
      .get('http://localhost:3000/HA/adminLogout', config)
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
  }, [])


  const Navigator = useNavigate()

  const handleEmail = (e) => {
    setData((prev) => {
      return { ...prev, email: e.target.value }
    })
    console.log(data)
  }

  const handlePassword = (e) => {
    setData((prev) => {
      return { ...prev, password: e.target.value }
    })
    console.log(data)
  }

  // GOOGLE OAuth
  const handelGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const auth = getAuth(app)

      const result = await signInWithPopup(auth, provider)
      // console.log(result)

      const data = {
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }

      axios
        .post('http://localhost:3000/HA/adminGoogleLogin', data, config)
        .then((res) => {
          console.log(res)
          Dispatcher(setUserData(res.data));
          Dispatcher(setActiveOption('Home'));
          Dispatcher(setActiveSubOption('Home'));
          Navigator('/adminDashboard')
          setLoading(false)
        })
        .catch((err) => {
          console.log(err)
          setLoading(false)
          toast.error('Invalid UserName or Password !', {
            position: toast.POSITION.TOP_RIGHT,
          })
        })
    } catch (error) {
      console.log('Could not Login with Google' + error)
    }
  }

  const handleSubmit = () => {
    setLoading(true)
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    }
    axios
      .post('http://localhost:3000/HA/adminLogin', data, config)
      .then((res) => {
        console.log(res)
        Dispatcher(setUserData(res.data));
        Dispatcher(setActiveOption('Home'));
        Dispatcher(setActiveSubOption('Home'));
        Navigator('/adminDashboard')
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
        toast.error('Invalid UserName or Password !', {
          position: toast.POSITION.TOP_RIGHT,
        })
      })
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.logoSection}>
          <div className={styles.opacityCover}></div>
          <div

            onClick={() => {
              Navigator('/')
              localStorage.removeItem('role')
            }}
            className={`cursor-pointer h-12 absolute top-8 left-4 px-4 py-2 flex justify-center items-center rounded-full bg-blue-600 hover:bg-blue-500 text-white`}
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
            <h1 className='text-4xl font-semibold'>
              NIT Hostel Management <br />
              System
            </h1>
          </div>
        </div>
        <div className={styles.contentSection}>
          <div className={styles.contentHeadings}>
            <h3 className='text-2xl font-semibold'>Admin Login</h3>
            <p>Enter your email and Password to login to dashboard</p>
          </div>
          <div className={styles.inputSection}>
            <div className={styles.inputBoxes}>
              <Textinput
                style={{ minWidth: '300px' }}
                onChange={handleEmail}
                label='Email'
              />
              <Textinput
                type='password'
                style={{ marginTop: '25px', minWidth: '300px' }}
                onChange={handlePassword}
                label='Password'
              />
              <Button
                onClick={handleSubmit}
                loading={loading}
                variant='contained'
                style={{ marginTop: '25px', minWidth: '300px' }}
                text='login'
              />

              <GoogleButton
                onClick={handelGoogleClick}
                loading={loading}
                variant='contained'
                style={{ marginTop: '25px' }}
                text='Continue With Google'
              />

              <p onClick={()=>{Navigator('/forgetPass')}} className='cursor-pointer' style={{ marginTop: '10px' }}>Forgot Password?</p>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  )
}
