import React, { useState } from 'react';
import axios from 'axios';
import forgot from './component/forgot.png';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgetPassword = () => {
  const Navigator = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false); // State to track loading

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!email) {
      toast.error('Email cannot be empty');
      return;
    }

    setLoading(true); // Set loading to true
    try {
      const res = await axios({
        method: 'post',
        url: import.meta.env.VITE_BASE_URL + '/sendotp',
        data: { email },
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      if (res.status === 200) {
        toast.success(res.data.message);
        Navigator('/VerifyOtp', { state: { email } });
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        toast.error(`User doesn't exists`); // Use data.message for error response
      } else {
        toast.error('An error occurred. Please try again later.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full">   
      <div className="flex-1">
        <img className="mt-[150px] h-auto w-[500px]" src={forgot} alt="Forgot Password" />
      </div>
      <div className="flex-1 bg-[#131133] flex-row justify-right px-6 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto mt-20 sm:w-full max-w-md">
          <h2 className="text-center text-2xl font-semibold text-white">Forgot Password?</h2>
        </div>
        <div className="text-base text-center text-white py-4">
          Please enter your e-mail address to receive a verification code.
        </div>
        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="px-4 py-6 bg-[#131133] sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-lg font-large text-white">Email Address</label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    onChange={handleEmail}
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>                                                                                
                <h2 className="text-base text-center text-white py-4">We'll never share your email with anyone else.</h2>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex-2 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${loading ? 'bg-gray-400' : 'bg-[#5F57FF] hover:bg-[#33CFFF]'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  {loading ? 'Sending...' : 'Send'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ForgetPassword;
