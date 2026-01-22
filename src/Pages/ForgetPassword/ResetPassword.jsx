import React, { useState } from 'react';
import Reset from './component/Reset.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const VerifyOtp = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { email } = location.state || {};
    const [loading, setLoading] = useState(false);

    const handlePassword = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if passwords match
        if (password !== confirmPassword) {
            toast.error('Passwords do not match!');
            return;
        }
        setLoading(true);
        try {
            const res = await axios({
                method: 'post',
                url: import.meta.env.VITE_BASE_URL + '/forgotPassword',
                data: { email, password, confirmPassword }, // Send the email and passwords
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

            if (res.status === 200 && res.data.success) {
                toast.success('Password reset successful!');
                const value = localStorage.getItem('role');
                if(value === "Admin"){
                    navigate('/Adminlogin');
                }
                else if(value === "SuperAdmin"){
                    navigate('/superAdminLogin')
                }
                else if(value === "Student"){
                    navigate('/studentLogin')
                }

                 // Redirect to login after success
            } else {
                toast.error(res.data.message || 'Error resetting password.');
                setLoading(false);
            }
        } catch (error) {
            toast.error('Error resetting password. Please try again later.');
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full">
            <div className="flex-1">
                <img className="mt-[50px] h-auto w-[500px]" src={Reset} alt="Reset Password" />
            </div>

            <div className="flex-1 bg-[#131133] flex-row justify-right px-6 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto mt-20 sm:w-full max-w-md">
                    <h2 className="text-center text-2xl font-semibold text-white">Reset Password</h2>
                </div>
                <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="px-4 py-6 bg-[#131133] sm:rounded-lg sm:px-10">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="new-password" className="block text-lg font-large text-white">
                                    New Password
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="new-password"
                                        name="new-password"
                                        type="password"
                                        autoComplete="new-password"
                                        value={password}
                                        onChange={handlePassword}
                                        required
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="confirm-password" className="block text-lg font-large text-white">
                                    Confirm Password
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="confirm-password"
                                        name="confirm-password"
                                        type="password"
                                        autoComplete="new-password"
                                        value={confirmPassword}
                                        onChange={handleConfirmPassword}
                                        required
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div>
                                <button
                                    type="submit" disabled={loading}
                                    className="w-full flex-2 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#5F57FF] hover:bg-[#33CFFF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    
                                    {loading ? 'Submiting...' : 'Submit'}
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
