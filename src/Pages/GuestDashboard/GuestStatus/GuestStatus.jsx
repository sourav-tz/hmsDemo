import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import backgroundImage from '../../../Assets/hostel11.jpg'; // Ensure the path to your image is correct.

const GuestStatus = () => {
  const [referralNumber, setReferralNumber] = useState('');
  const [status, setStatus] = useState('');

  const checkStatus = () => {
    // Simulate checking status (replace this logic with actual API call if needed)
    if (referralNumber.trim() === 'ABCD1234') {
      setStatus('Pending');
    } else {
      setStatus('Not Found');
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
          <div className="bg-[#5757FF] rounded-lg p-10 w-[400px] sm:w-[450px] text-white shadow-lg">
            <div className="mb-6">
              <label htmlFor="referralNumber" className="block text-lg font-medium mb-3">
                Enter Referral Number
              </label>
              <input
                id="referralNumber"
                type="text"
                value={referralNumber}
                onChange={(e) => setReferralNumber(e.target.value)}
                className="w-full p-3 rounded-md text-black"
                placeholder="Enter Referral Number"
              />
            </div>
            <div className="flex items-center justify-between mt-4">
            <button onClick={checkStatus} className="bg-[#131133] text-white font-bold py-3 px-5 rounded-md hover:bg-gray-700">
              Check Status
            </button>
          <Link className="bg-red-700 text-white font-bold py-3 px-10 rounded-md hover:bg-red-500 self-start mt-" to="/guest/home">Cancel</Link>
          </div>
            <div className="mt-8">
              <label htmlFor="status" className="block text-lg font-medium mb-3">
                Status
              </label>
              <div id="status" className="w-full p-3 rounded-md bg-white text-black text-center font-semibold">
                {status || 'Enter Referral Number to Check Status'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestStatus;
