import React from 'react'
import { IoLockClosedOutline } from "react-icons/io5";
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import axios from 'axios'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

import {useForm} from 'react-hook-form'
import { ToastContainer,toast } from 'react-toastify';


const AdminSecuritysettings = () => {
  const [oldPass, setOldPass] = React.useState('');
  const [newPass, setNewPass] = React.useState('');
  const [isVerified, setIsVerified] = React.useState(false);
  const [verifyMessage, setVerifyMessage] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const {register,handleSubmit,reset, formState:{errors}} = useForm();
  
  const handleOldPass = (e) => {
    setOldPass(e.target.value)
  }

  const verifyOldPass = async () => {
    try{
      const res = await axios({
        method: 'post',
        url: import.meta.env.VITE_BASE_URL + '/SA/verifyOldPassword',
        data: {oldPassword: oldPass},
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      })
      console.log(res);
      setVerifyMessage(res.data.message);
      if(res.data.message === 'Password Verified'){
        setIsVerified(true);
      }
    }catch(err){
      console.log(err);
      setIsVerified(false);
      setVerifyMessage('Password Incorrect');
    }
  }

const onSubmit = async (data) => {
      if(data.newPass !== data.confirmPass){
        setErrorMessage('Passwords do not match');
        return;
      }else{
        setErrorMessage('');
        
        try{
        const res = await axios({
          method: 'post',
          url: import.meta.env.VITE_BASE_URL + '/SA/updatePassword',
          data: {newPassword: data.newPass},
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
      }
      )
      console.log(res);
      if(res.data.message === 'Password Changed Successfully'){
        toast.success('Password Updated',{
          position: 'top-right'
        });
        setIsVerified(false);
        setVerifyMessage('');
        reset();
      }
    }
    catch(err){
      console.log(err); 
      if(err.response.status === 401){
        toast.error('Unauthorized',{
          position: 'top-right'
        })
        reset();
    }
  }

  }
}


  return (
    <div className='flex justify-center'>
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col mt-10 p-4 border-[1px] rounded-md w-[400px] shadow-sm border-gray-200'>
        <div className='text-blue-600 w-16 h-16 bg-blue-50 flex justify-center items-center rounded-full'>
            <IoLockClosedOutline size={40}/>
        </div>
        <h1 className='mt-8'>Change Password</h1>
        <div className='flex flex-col mt-4'>
            <label className='text-gray-500'>Current Password</label>
            <Input {...register("oldPass")} onChange={handleOldPass} className="w-[300px]" type="password" />
            <Button type='button' onClick={verifyOldPass} className="border hover:shadow-md w-20 mt-2 bg-blue-600 hover:bg-blue-500">Verify</Button>
            <p className={`${isVerified?'text-green-700':'text-red-700'}`}>{verifyMessage}</p>
        </div>
        <div className='mt-4'>
            <label className='text-gray-500'>New Password</label>
            <Input {...register("newPass",{required:{value:true,message:'Password Required'},minLength:{value:6,message:'password length must be greater than 6'}})} disabled={!isVerified} className="w-[300px] mb-2" type="password" />
            <label className='text-gray-500'>Confirm Password</label>
            <Input {...register("confirmPass",{required:true,minLength:{value:6,message:'password length must be greater than 6'}})} disabled={!isVerified} className="w-[300px]" type="password" />
            <p className='text-red-700'>{errorMessage}</p>
            <p className='text-red-700'>{errors.newPass?errors.newPass.message:null}</p>
            <Button type="submit" disabled={!isVerified} className="border hover:shadow-md w-20 mt-2 bg-blue-600 hover:bg-blue-500">Change</Button>

        </div>
    </form>
      <ToastContainer/>
    </div>
  )
}

export default AdminSecuritysettings;