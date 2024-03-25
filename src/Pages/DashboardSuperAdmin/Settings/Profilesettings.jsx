import React from 'react'
import { Button } from '../../../components/ui/button.jsx'
import { RiDeleteBin6Line } from "react-icons/ri";
import { Input } from '../../../components/ui/input';
import { FiEdit } from "react-icons/fi";
import { Player } from '@lottiefiles/react-lottie-player';
import profileAnimation from '../../../Assets/profilesettings.json';

const Profilesettings = () => {

    // const []


  return (
    <div className='flex'>
        <div className='flex-[2] flex px-8 py-10 flex-col border-[1px] mt-8 border-gray-200 rounded-md'>
            <div>
                <h2 className='text-2xl font-semibold'>Maaz Ansari</h2>
                <p className='text-gray-600'>Super Admin</p>
                <div className='flex'>
                    <div className='mt-4 w-36 h-36 bg-gray-600 rounded-full mr-6'></div>
                    <div className='flex flex-col justify-center gap-2'>
                        <Button className='bg-blue-600 hover:bg-blue-500'>Change Photo</Button>
                        <Button variant="outlined" className="border hover:shadow-md"><i className='text-red-500 mr-2'><RiDeleteBin6Line /></i> Delete</Button>
                    </div>
                </div>
            </div>
            <div className='mt-8'>
            <div className='flex gap-10'>
                <div className='flex flex-col gap-1'>
                    <label className="text-gray-700">First Name</label>
                    <div>
                        <div className='flex gap-2'>
                            <Input className="w-[200px]" type="text" value="Maaz"/>
                            <div className='cursor-pointer rounded-md hover:shadow-md border-[1px] border-gray-200 p-[12px]'>
                                {<FiEdit />}
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col gap-1 mt-4'>
                        <label className="text-gray-700">Last Name</label>
                        <div className='flex gap-2'>
                            <Input className="w-[200px]" type="text" value="Ansari"/>
                            <div className='cursor-pointer rounded-md hover:shadow-md border-[1px] border-gray-200 p-[12px]'>
                                <FiEdit />
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className='flex flex-col gap-1'>
                        <label className="text-gray-700">Email</label>
                        <div className='flex gap-2'>
                            <Input className="w-[200px]" type="text" value="mxansari@gmail.com"/>
                            <div className='cursor-pointer rounded-md hover:shadow-md border-[1px] border-gray-200 p-[12px]'>
                                <FiEdit />
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col gap-1 mt-4'>
                        <label className="text-gray-700">Mobile No.</label>
                        <div className='flex gap-2'>
                            <Input className="w-[200px]" type="text" value="+919457077164"/>
                            <div className='cursor-pointer rounded-md hover:shadow-md border-[1px] border-gray-200 p-[12px]'>
                                <FiEdit />
                            </div>
                        </div>
                    </div>
                </div>
                </div>

            </div>
        </div>
        <div className='mt-12 flex-1'>
        {/* <Player
        src={profileAnimation}
        className="player"
        loop
        autoplay
      /> */}
        </div>
    </div>
  )
}

export default Profilesettings