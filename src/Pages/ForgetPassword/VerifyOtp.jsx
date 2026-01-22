import React, { useState } from 'react';
import verifyOtp from './component/verifyOtp.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

const VerifyOtp = () => {
    const [otp, setOtp] = useState('');
    const navigate = useNavigate(); // Use lowercase 'navigate'
    const location = useLocation();
    const { email } = location.state || {};
    const [loading, setLoading] = useState(false); 


    const handleOtpChange = (e) => {
        setOtp(e.target.value);
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setLoading(true);
        try {
            const res = await axios({
                method: 'post',
                url: import.meta.env.VITE_BASE_URL + '/verifyotp',
                data: { otp, email }, // Send the OTP and email
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

            if (res.status === 200) {
                if (res.data.message === true) {
                    toast.success('OTP Verified');
                    navigate('/ResetPassword' , { state: { email } }); // Pass email to ResetPassword
                } else {
                    toast.error(res.data.message);
                    setLoading(false);
                }
            }
        } catch (error) {
            toast.error('Error verifying OTP. Please try again later.');
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setLoading(true);
        try {
            const res = await axios({
                method: 'post',
                url: import.meta.env.VITE_BASE_URL + '/sendotp',
                data: { email }, // Send the email to resend OTP
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

            if (res.status === 200) {
                toast.success('OTP has been resent to your email.');
            }
        } catch (error) {
            toast.error('Error resending OTP. Please try again later.');
        }
        setLoading(false);
    };

    return (
        <div className="flex min-h-screen w-full">
            <div className="flex-1">
                <img className="mt-[10px] h-auto w-[500px]" src={verifyOtp} alt="Verify OTP" />
            </div>

            <div className="flex-1 bg-[#131133] flex-row justify-right px-6 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto mt-20 sm:w-full max-w-md">
                    <h2 className="text-center text-2xl font-semibold text-white">Verify OTP for Password Reset</h2>
                </div>
                <div className="text-base text-center text-white py-4">Please enter the OTP sent to your email address to reset your password.</div>
                <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="px-4 py-6 bg-[#131133] sm:rounded-lg sm:px-10">
                        <form className="space-y-6" onSubmit={handleVerifyOtp}>
                            <div>
                                <label htmlFor="OTP" className="block text-lg font-large text-white">Enter OTP</label>
                                <div className="mt-2">
                                    <input
                                        id="OTP"
                                        name="OTP"
                                        type="text" // OTP input as text
                                        value={otp}
                                        onChange={handleOtpChange}
                                        required
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div>
                                <button 
                                    onClick={handleResendOtp} // Handle resend OTP
                                    type="button" 
                                    disabled = {loading}
                                    className="w-full flex-2 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#5F57FF] hover:bg-[#33CFFF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    {loading ? 'Resending OTP...' : 'Resend OTP'}
                                </button>
                            </div>
                            <div>
                                <button 
                                    type="submit" 
                                    className="w-full flex-2 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#5F57FF] hover:bg-[#33CFFF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    Verify OTP
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

export default VerifyOtp;
