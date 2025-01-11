import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import backgroundImage from '../../../Assets/hostel11.jpg'; // Ensure the path to your image is correct.

const GuestStatus = () => {
  const [guestStatus,setGuestStatus] = useState('');
  const [application_id, setApplicationId] = useState('');
  
  const getGuestsSchedule = async() =>{
    try {
      const res = await axios({
          method: 'get',
          url: import.meta.env.VITE_BASE_URL + '/guest/application-status/' + application_id,
          withCredentials: true,
      })
      console.log("RES",res)
      console.log("MESSGAE ",res.data.status)
      return res.data.status;
      // console.log(res);
      // setGuestStatus(res.status);   
  } catch (err) {
      console.log(err);
      console.log("Chnaging status for error _>")
      setGuestStatus(err.response.data.message)
      return err.response.data.message
  }
  };

  const checkStatus = async () => {
    // Simulate checking status (replace this logic with actual API call if needed)
    const resMessage = await getGuestsSchedule(); // Call API.
    if (!resMessage) {
      setGuestStatus('Error fetching status');
      return;
    }
    setGuestStatus(resMessage)
    switch (resMessage) {
      case 'pendingAtReferrer':
        setGuestStatus('Awaiting Referrer Verification');
        break;
      case 'pendingAtAdmin':
        setGuestStatus('Awaiting Admin Verification');
        break;
      case 'rejectedByReferrer':
        setGuestStatus('Application rejected By Referrer');
        break;
      case 'rejectedByAdmin':
        setGuestStatus('Application rejected By Admin');
        break;
      case 'approvedByAdmin':
        setGuestStatus('Application has been accepted');
        break;
      default:
        setGuestStatus(resMessage);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Background image container */}
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          filter: 'blur(3px)', // Optional: Adds a blur effect
          opacity: 0.5, // Slightly reduce opacity for effect
          zIndex: -1, // Place the background behind the content
        }}
      ></div>

      {/* Content area */}
      {/* Link to Change Role */}
      <div className="flex flex-col min-h-screen items-center py-10">
          <h1 className="text-3xl font-semibold mb-10">Check Application Status</h1>
        <div className="z-10 flex flex-col items-center">
          <div className="bg-[#5757FF] rounded-2xl p-10 w-[400px] sm:w-[450px] text-white shadow-lg">
            <div className="mb-6">
              <label htmlFor="application-id" className="block text-lg font-medium mb-3">
                Enter Application ID
              </label>
              <input
                id="applicationId"
                type="text"
                value={application_id}
                onChange={(e) => setApplicationId(e.target.value)}
                className="w-full p-3 rounded-md text-black"
                placeholder="Enter Application ID"
              />
            </div>
            <div className="flex items-center justify-between mt-4">
            <Link className="bg-red-700 text-white font-bold py-3 px-10 rounded-md hover:bg-red-500 self-start mt-" to="/guest/home">Cancel</Link>
            <button onClick={checkStatus} className="bg-[#131133] text-white font-bold py-3 px-5 rounded-md hover:bg-gray-700">
              Check Status
            </button>
          </div>
          <div className="mt-8">
  <label htmlFor="status" className="block text-lg font-medium mb-3">
    Status
  </label>
  <div
    id="status"
    className={`w-full p-3 rounded-md text-black bg-gray-100 text-center font-bold
      ${guestStatus === 'Awaiting Referrer Verification' || guestStatus === 'Awaiting Admin Verification' ? 'text-orange-500' : ''}
      ${guestStatus === 'Application has been accepted' ? 'text-green-500' : ''}
      ${guestStatus === 'Application rejected By Referrer' || guestStatus === 'Application rejected By Admin' ? 'text-red-500' : ''}
      ${!guestStatus || guestStatus === 'Enter Application Number to Check Status' ? 'bg-gray-300' : ''}
    `}
  >
    {guestStatus || 'Enter Application Number to Check Status'}
  </div>
</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestStatus;
