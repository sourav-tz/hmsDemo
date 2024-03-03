import React from 'react'
import { IoLockClosedOutline } from "react-icons/io5";
import { Input } from '../../../Components/ui/input';
import { Button } from '../../../Components/ui/button';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"


const Securitysettings = () => {
  return (
    <div className='flex flex-col mt-10 p-4 border-[1px] rounded-md w-[400px] shadow-sm border-gray-200'>
        <div className='text-blue-600 w-16 h-16 bg-blue-50 flex justify-center items-center rounded-full'>
            <IoLockClosedOutline size={40}/>
        </div>
        <h1 className='mt-8'>Change Password</h1>
        <div className='flex flex-col mt-4'>
            <label className='text-gray-500'>Current Password</label>
            <Input className="w-[300px]" type="password" />
            <Button className="border hover:shadow-md w-20 mt-2 bg-blue-600 hover:bg-blue-500">Verify</Button>
        </div>
        <div className='mt-4'>
            <label className='text-gray-500'>New Password</label>
            <Input className="w-[300px] mb-2" type="password" />
            <label className='text-gray-500'>Confirm Password</label>
            <Input className="w-[300px]" type="password" />
            <Button className="border hover:shadow-md w-20 mt-2 bg-blue-600 hover:bg-blue-500">Change</Button>

        </div>
    </div>
  )
}

export default Securitysettings