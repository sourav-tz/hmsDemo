import React, { useEffect, useState } from "react";
import students from "../../Assets/students.svg"
import { useNavigate } from "react-router-dom";
import {useForm, Controller} from 'react-hook-form'
import { DevTool } from "@hookform/devtools";
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { ToastContainer,toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";


const StudentSignUp = () => {
  const [name, setName] = useState("");
  const [Roll, setRoll] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const Navigator = useNavigate();
  const [step, setStep] = useState(1);
  
  const {register,handleSubmit,reset, watch,formState:{errors},control} = useForm({
    mode: 'onBlur',
    defaultValues:{
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      rollNo: ''
    }
  });




  const onSubmit = async (data) => {

    try{
      const res = await axios({
        method: 'post',
        url: import.meta.env.VITE_BASE_URL + '/student/studentReg',
        data: 
        {
          rollNo: data.rollNo,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          password: data.password
        },
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      })
      console.log(res);
      if(res.data.success === 'Student Register into db Successfully'){
        setStep(2);
      }
    }
    catch(err){
      console.log(err);
      if(err.response.status === 400){
        toast.error('User Already Existed');
      }
    }

  };

    
  // function to handle visible/hidden password
  const [visiblePassword,setVisiblePassword] = useState(false);
  const [visibleConfirmPassword,setVisibleConfirmPassword] = useState(false);
  const handleShowPassword = ()=>{
    setVisiblePassword(!visiblePassword);
  }
  const handleShowConfirmPassword = ()=>{
    setVisibleConfirmPassword(!visibleConfirmPassword);
  }


  return (
    <>
    {step===1?<section
      className="bg-indigo-600 min-h-screen h-full
      flex items-center justify-center"

    >
      {/* login  container */}
      <div className="bg-white flex flex-col md:flex-row rounded-2xl shadow-lg w-[80%] md:w-[900px] p-5">
        <div className="flex-1 p-0  justify-center items-center">
          <img src={students} alt="students" className="w-full h-full"></img>
        </div>

        <div className="flex-1 px-8">
          <h2 className="font-bold text-2xl mt-2 mx-2">Request Your Account</h2>
          <form
            className="flex flex-col gap-1"
            action="#"
            onSubmit={handleSubmit(onSubmit)}
            method="POST"
          >
            <p className="mt-6 text-xs font-semibold">First Name*</p>
            <input
              className="p-2 rounded-lg border mt-0 shadow-sm"
              placeholder="Enter First name"
              type="text"
              name="firstName"
              {...register("firstName",
              {required:{value:true,message:'First Name Required'}})}
            ></input>
            <p className="text-red-600 text-xs">{errors.firstName?.message}</p>
            <p className="mt-2 text-xs font-semibold">Last Name*</p>
            <input
              className="p-2 rounded-lg border mt-0 shadow-sm"
              placeholder="Enter Last name"
              type="text"
              name="lastName"
              {...register("lastName",
              {required:{value:true,message:'Last Name Required'}})}
            ></input>
            <p className="text-red-600 text-xs">{errors.lastName?.message}</p>
            <p className="mt-2 text-xs font-semibold ">Email*</p>
            <input
              className="shadow-sm p-2 rounded-lg border mt-0 "
              placeholder="Enter your E-Mail"
              type="text"
              name="email"
              {...register("email",
              {required:{value:true,message:'Email Required'},
              pattern:{value:/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/i,message:'Invalid Email'}})}
            ></input>
            <p className="text-red-600 text-xs">{errors.email?.message}</p>
          {/* only numerical value for roll no */}
            <p className="mt-2 text-xs font-semibold ">Roll Number*</p>
            <input
              className="shadow-sm p-2 rounded-lg border mt-0 "
              placeholder="Enter your Roll No."
              type="text"
              name="rollNo"
              {...register("rollNo",{required:{value:true,
                message:'Roll No Required'},pattern:{value:/^[0-9]+$/i,
                message:'Only Numbers Allowed',},minLength:{value:4,message:'Enter a valid Roll No'},
                maxLength:{value:12,message:'Enter a valid Roll No'}})}
            ></input>
            <p className="text-red-600 text-xs">{errors.rollNo?.message}</p>
            <p className="mt-2 text-xs font-semibold">Password*</p>
            <div className="relative">
              <input
                className="shadow-sm p-2 rounded-lg border mt-0 w-full"
                placeholder="Enter password"
                type={visiblePassword?'text': 'password'}
                name="password"
                {...register("password",
                {required:{value:true,message:'Password Required'},
                minLength:{value:6,message:'Password length must be greater than 6'}})}
              ></input>
                 
              {visiblePassword?<FaEye className='absolute top-3 right-3 cursor-pointer min-[300px]:size-6 sm:size-4 md:size-4' color='#5F57FF' onClick={handleShowPassword}></FaEye>:             
              <FaEyeSlash className='absolute top-3 right-3 cursor-pointer min-[300px]:size-6 sm:size-4 md:size-4' color='#5F57FF' onClick={handleShowPassword}></FaEyeSlash>}

            </div>
            <p className="text-red-600 text-xs">{errors.password?.message}</p>
            <p className="mt-2 text-xs font-semibold">Confirm Password*</p>
            <div className="relative">
              <input
                className="shadow-sm p-2 rounded-lg border mt-0 w-full"
                placeholder="Enter password"
                type={visibleConfirmPassword?'text': 'password'}
                name="confirmPassword"
                {...register("confirmPassword",
                {required:{value:true,message:'Password Required'},
                minLength:{value:6,message:'Password length must be greater than 6'},
                validate: value => value === watch('password') || "Passwords do not match"
              })}
              ></input>
              
              {visibleConfirmPassword?<FaEye className='absolute top-3 right-3 cursor-pointer min-[300px]:size-6 sm:size-4 md:size-4' color='#5F57FF' onClick={handleShowConfirmPassword}></FaEye>:             
              <FaEyeSlash className='absolute top-3 right-3 cursor-pointer min-[300px]:size-6 sm:size-4 md:size-4' color='#5F57FF' onClick={handleShowConfirmPassword}></FaEyeSlash>}
              
            </div>
            <p className="text-red-600 text-xs">{errors.confirmPassword?.message}</p>
            <button
              type="submit"
              className="p-2 my-4 bg-indigo-600 rounded-lg text-white hover:bg-indigo-500 focus:outline-none focus:ring focus:border-blue-300 active:transform active:scale-95 transition-all duration-150 shadow-2xl "
            >
              {" "}
              Sign Up{" "}
            </button>
          </form>

          <div
            className="mt-0 mb-2 grid grid-cols-3
              items-center text-gray-500 "
          >
            <hr className="outline-gray-500"></hr>
            <p className="text-center text-sm">OR</p>
            <hr className="outline-gray-500"></hr>
          </div>

          <button className="mb-2 items-center justify-center flex bg-white border py-2 w-full rounded-xl font-bold mt-3 focus:outline-none focus:ring focus:border-grey-100 active:transform active:scale-95 transition-all duration-150">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              className="mr-3"
              width="20"
              height="20"
              viewBox="0 0 48 48"
            >
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              ></path>
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              ></path>
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
            </svg>
            Sign Up with Google
          </button>
          <p className="items-centere flex justify-center text-sm mt-2">
            Already have an account?
            <span onClick={()=>{Navigator('/studentLogin')}} className="text-indigo-950 font-semibold underline hover:text-indigo-600 cursor-pointer">  Login</span>
          </p>
        </div>
      </div>
      <DevTool control={control} />
      <ToastContainer />
    </section>:null}


    {step===2?<div className="flex min-h-[100dvh] w-full items-center justify-center bg-gray-100 px-4 dark:bg-gray-950">
      <div className="mx-auto w-full max-w-md space-y-6 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900">
        <div className="flex flex-col items-center space-y-4 text-center">
          <CheckCircleIcon className="h-12 w-12 text-green-500" />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Account Created!</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Congratulations, your account has been successfully created.
            </p>
          </div>
          <Button onClick={()=>{Navigator('/studentLogin')}} className="bg-indigo-700 hover:bg-indigo-500">
            Go to Login
            </Button>
        </div>
      </div>
    </div>:null}


    </>
  );
};

function CheckCircleIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}



export default StudentSignUp;
