import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
  } from "@/components/ui/input-otp"

import { Button } from "@/components/ui/button"


const SuperAdminOtp = () => {
    return (
      <div className="flex flex-col items-center bg-indigo-600 min-h-screen w-full text-white">
      <h1 className="text-3xl font-semibold mt-10">OTP Verification</h1>
      <p className="text-indigo-950">Enter the OTP sent to your email</p>
      <p className="text-indigo-950">Expires in : 00:59</p>
      <div className="mt-36 flex-col items-center">
      <InputOTP maxLength={6}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
    <div className="mt-10">
      <Button className="bg-white text-black  hover:bg-gray-200 w-full">Verify</Button>
      <p className="text-center mt-4">Didn't receive the OTP? <span className="underline cursor-pointer">Resend</span></p>
      </div>
    </div>
      </div>
    )
}

export default SuperAdminOtp;