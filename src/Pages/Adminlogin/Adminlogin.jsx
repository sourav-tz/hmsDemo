import styles from './Adminlogin.module.scss'
import Textinput from '../../components/Textinput/Textinput'
import Button from '../../components/Button/Button'
import logoImage from '../../Assets/nit-logo.png'
import { IoArrowBack } from 'react-icons/io5'
import { IconContext } from 'react-icons'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUserData } from '../../Store/Reducers/userSlice'
import { useState } from 'react'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { GoogleAuthProvider, getAuth, signInWithPopup } from '@firebase/auth'
import { app } from '../../Firebase/firebase'
import GoogleButton from '../../components/Button/GoogleButton'
import { FaEye, FaEyeSlash } from "react-icons/fa"

export default function AdminLogin() {
  const [data, setData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)

  const Navigator = useNavigate()
  const Dispatcher = useDispatch()

  const handleEmail = (e) => {
    setData((prev) => ({ ...prev, email: e.target.value }))
  }

  const handlePassword = (e) => {
    setData((prev) => ({ ...prev, password: e.target.value }))
  }

  const handleEnterSubmit = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e)
    }
  }

  // 👁 Toggle Password Visibility
  const handleShowPassword = () => setVisible(!visible)

  // 🧠 Normal Email/Password Login
  const handleSubmit = async (e) => {
    e?.preventDefault()
    setLoading(true)
    try {
      const config = {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }

      // ✅ Include role explicitly
      const body = {
        email: data.email,
        password: data.password,
        role: 'Hostel-Authority',
      }

      const res = await axios.post(
        import.meta.env.VITE_BASE_URL + '/HA/adminLogin',
        body,
        config
      )

      Dispatcher(setUserData(res.data))
      Navigator('/adminDashboard/main/home')
      setLoading(false)
    } catch (err) {
      console.log(err)
      setLoading(false)
      toast.error('Invalid Username or Password !', {
        position: toast.POSITION.TOP_RIGHT,
      })
    }
  }

  // 🧠 Google OAuth Login
  const handelGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const auth = getAuth(app)
      const result = await signInWithPopup(auth, provider)

      const data = {
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
        role: 'Hostel-Authority', // ✅ Include role here too
      }

      const config = {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }

      const res = await axios.post(
        import.meta.env.VITE_BASE_URL + '/HA/adminGoogleLogin',
        data,
        config
      )

      Dispatcher(setUserData(res.data))
      Navigator('/adminDashboard/main/home')
      setLoading(false)
    } catch (error) {
      console.log('Could not Login with Google: ' + error)
      setLoading(false)
      toast.error('Google login failed!', {
        position: toast.POSITION.TOP_RIGHT,
      })
    }
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.logoSection}>
          <div className={styles.opacityCover}></div>

          <div
            onClick={() => {
              Navigator('/role')
              localStorage.removeItem('role')
            }}
            className="cursor-pointer h-12 absolute top-8 left-4 px-4 py-2 flex justify-center items-center rounded-full bg-blue-600 hover:bg-blue-500 text-white"
          >
            <IconContext.Provider value={{ size: 20 }}>
              <p className="flex justify-center items-center gap-1">
                <IoArrowBack className="cursor-pointer text-white" />
                <span id="role-content">Change Role</span>
              </p>
            </IconContext.Provider>
          </div>

          <div className={styles.logoContent}>
            <img className={styles.logo} src={logoImage} />
            <h1 className="text-4xl font-normal">
              NIT Hostel Management <br /> System
            </h1>
          </div>
        </div>

        <div className={styles.contentSection}>
          <div className={styles.contentHeadings}>
            <h3 className="text-2xl font-semibold">Admin Login</h3>
            <p>Enter your email and Password to login to dashboard</p>
          </div>

          <div className={styles.inputSection}>
            <div className={styles.inputBoxes}>
              <Textinput
                style={{ minWidth: '300px' }}
                onChange={handleEmail}
                onKeyDown={handleEnterSubmit}
                label="Email"
              />

              <div className="relative">
                <Textinput
                  type={visible ? 'text' : 'password'}
                  style={{ marginTop: '0px', minWidth: '300px' }}
                  onChange={handlePassword}
                  onKeyDown={handleEnterSubmit}
                  label="Password"
                />

                {visible ? (
                  <FaEye
                    className="absolute min-[300px]:top-[3.1rem] sm:top-9 md:top-8 right-3 cursor-pointer min-[300px]:size-6 sm:size-4 md:size-4"
                    color="#5F57FF"
                    onClick={handleShowPassword}
                  />
                ) : (
                  <FaEyeSlash
                    className="absolute min-[300px]:top-[3.1rem] sm:top-9 md:top-8 right-3 cursor-pointer min-[300px]:size-6 sm:size-4 md:size-4"
                    color="#5F57FF"
                    onClick={handleShowPassword}
                  />
                )}
              </div>

              <Button
                onClick={handleSubmit}
                loading={loading}
                variant="contained"
                style={{ marginTop: '0px', minWidth: '300px' }}
                text="Login"
              />

              <GoogleButton
                onClick={handelGoogleClick}
                loading={loading}
                variant="contained"
                style={{ marginTop: '0px' }}
                text="Continue With Google"
              />

              <p
                onClick={() => Navigator('/forgetPass')}
                className="cursor-pointer"
                style={{ marginTop: '0px' }}
              >
                Forgot Password?
              </p>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  )
}
