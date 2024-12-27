import React from 'react'
import { Link } from 'react-router-dom'

const GuestStatus = () => {
  return (
    <>
    <div className='flex flex-col items-center w-full bg-gray-100 min-h-screen mx-auto item-center gap-5'>
        <h1 className='text-3xl font-semibold mt-10 max-md:mt-24 '>Guest Status</h1>
        <Link className="bg-purple-600 text-white font-bold py-2 px-4 rounded hover:bg-purple-700" to="/guest/home">Go Back</Link>
    </div>

    </>
  )
}

export default GuestStatus