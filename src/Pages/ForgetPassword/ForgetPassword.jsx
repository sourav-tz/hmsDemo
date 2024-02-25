import React from 'react'
import forgot from './component/forgot.png';
import {useNavigate} from 'react-router-dom';

const ForgetPassword = () => {

  const Navigator = useNavigate();

  return (
  <div className="flex min-h-screen w-full">   
  <div className=" flex-1" >
    <img className="mt-[150px] h-auto w-[500px]" src={forgot}/> 
      </div>
      <div className="flex-1 bg-[#131133] flex-row justify-right px-6 py-12 sm:px-6 lg:px-8">
             <div className="mx-auto mt-20 sm:w-full max-w-md">
               <h2 className="text-center text-2xl font-semibold text-white">Forgot Passsword?</h2>
             </div>
                 <div className="text-base text-center text-white py-4">Please enter your e-mail address to receive a verification code.
                 </div>
               <div className= "mt-4 sm:mx-auto sm:w-full sm:max-w-md">
                 <div className="px-4 py-6 bg-[#131133] sm:rounded-lg sm:px-10">
                    <form className="space-y-6" action="#" method="POST">
                      <div>
                        <label for="email" className="block text-lg font-large text-white">Email Address</label>
                        <div className="mt-2">
                            <input id="email" name="email" type="email" autocomplete="email" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        </div>                                                                                
                        <h2 className="text-base text-center text-white py-4">We'll never share your email with anyone else.</h2>
                      </div>
                      <div>
                          <button onClick={()=>{Navigator('/VerifyOtp');}} type="submit" className="w-full flex-2 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#5F57FF] hover:bg-[#33CFFF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Send</button>
                      </div>
                    </form>
                 </div>
               </div>
       </div>
  </div>
     
  );
  }

export default ForgetPassword
