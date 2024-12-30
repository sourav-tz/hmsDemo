import React from 'react'
import { Link } from 'react-router-dom'
import GuestReigster from '../GuestRegister/GuestReigster'
import GuestStatus from '../GuestStatus/GuestStatus'

const GuestLanding = () => {
  return (
    <>
    <div className='flex flex-col items-center w-full bg-gray-100 min-h-screen mx-auto item-center gap-5'>
        <h1 className='text-3xl font-semibold mt-10 max-md:mt-24 '>Welcome, Guest</h1>
        <Link className="bg-purple-600 text-white font-bold py-2 px-4 rounded hover:bg-purple-700 self-start" to="/">Change Role</Link>
        <Link className="bg-purple-600 text-white font-bold py-2 px-4 rounded hover:bg-purple-700" to="/guest/register">Go to Register Guest</Link>
        <Link className="bg-purple-600 text-white font-bold py-2 px-4 rounded hover:bg-purple-700" to="/guest/status">Go to Check Guest Status</Link>
    </div>

    </>
  )
}

export default GuestLanding