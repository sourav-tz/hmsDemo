// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import axios from "axios";
// import { IoCheckmarkDoneCircle } from "react-icons/io5";
// import { ImCross } from "react-icons/im";

// const GuestReferralDialog = ({ guest, removeRequest }) => {
//   const [accept, setAccept] = useState(false)
//   const [reject, setReject] = useState(false)

//   const acceptGuestApplication = async() =>{
//     try {
//       const res = await axios({
//           method: 'put',
//           url: import.meta.env.VITE_BASE_URL + '/guest/acceptApplication/' + guest.application_id,
//           withCredentials: true,
                
//       })
//       if (res.data.success) {
//         setAccept(true);
//         // removes the request entry from the frontend
//         removeRequest(guest.application_id)
//       }
//   } catch (err) {
//       console.log(err);
//   }
//   }


//   const rejectGuestApplication = async() =>{
//     try {
//       const res = await axios({
//           method: 'put',
//           url: import.meta.env.VITE_BASE_URL + '/guest/rejectApplication/' + guest.application_id,
//           withCredentials: true,
                
//       })

//       console.log(res)
//       if (res.data.success) {
//         setReject(true);
//         removeRequest(guest.application_id)
//       }
//   } catch (err) {
//       console.log(err);
//   }
//   }

//     return (
//         <>
//         {!(accept || reject) ?
//           <div className="flex items-center justify-center bg-gray-50">
//             <div className="bg-white shadow-lg rounded-md w-max">
//               <div className="grid grid-cols-1 md:grid-cols-6 gap-4 text-sm p-4">
//                 {/* Application ID */}
//                 <div>
//                   <label className="font-semibold text-sm text-gray-700">
//                     Application ID
//                   </label>
//                   <div className="border rounded-md p-2 text-gray-800">
//                     {guest.application_id}
//                   </div>
//                 </div>
  
//                 {/* First Name */}
//                 <div>
//                   <label className="font-semibold text-sm text-gray-700">
//                     *First Name
//                   </label>
//                   <div className="border rounded-md p-2 text-gray-800">
//                     {guest.first_name}
//                   </div>
//                 </div>
  
//                 {/* Last Name */}
//                 <div>
//                   <label className="font-semibold text-sm text-gray-700">
//                     *Last Name
//                   </label>
//                   <div className="border rounded-md p-2 text-gray-800">
//                     {guest.last_name}
//                   </div>
//                 </div>
  
//                 {/* Gender */}
//                 <div>
//                   <label className="font-semibold text-sm text-gray-700">*Gender</label>
//                   <div className="border rounded-md p-2 text-gray-800">
//                     {guest.gender || "N/A"}
//                   </div>
//                 </div>
  
//                 {/* Guest Email */}
//                 <div>
//                   <label className="font-semibold text-sm text-gray-700">
//                     *Guest Email
//                   </label>
//                   <div className="border rounded-md p-2 text-gray-800">
//                     {guest.guest_email}
//                   </div>
//                 </div>
  
//                 {/* Referrer Email */}
//                 <div>
//                   <label className="font-semibold text-sm text-gray-700">
//                     *Referrer Email
//                   </label>
//                   <div className="border rounded-md p-2 text-gray-800">
//                     {guest.referrer_email}
//                   </div>
//                 </div>
  
//                 {/* Contact Number */}
//                 <div>
//                   <label className="font-semibold text-sm text-gray-700">
//                     *Contact Number
//                   </label>
//                   <div className="border rounded-md p-2 text-gray-800">
//                     {guest.contact_number}
//                   </div>
//                 </div>
  
//                 {/* ID Proof Number */}
//                 <div>
//                   <label className="font-semibold text-sm text-gray-700">
//                     *ID Proof Number
//                   </label>
//                   <div className="border rounded-md p-2 text-gray-800">
//                     {guest.id_proof_no}
//                   </div>
//                 </div>
  
//                 {/* Hostel Number */}
//                 <div>
//                   <label className="font-semibold text-sm text-gray-700">
//                     *Hostel Number
//                   </label>
//                   <div className="border rounded-md p-2 text-gray-800">
//                     {guest.hostel_no}
//                   </div>
//                 </div>
  
//                 {/* City */}
//                 <div>
//                   <label className="font-semibold text-sm text-gray-700">*City</label>
//                   <div className="border rounded-md p-2 text-gray-800">
//                     {guest.city || "N/A"}
//                   </div>
//                 </div>
  
//                 {/* State */}
//                 <div>
//                   <label className="font-semibold text-sm text-gray-700">*State</label>
//                   <div className="border rounded-md p-2 text-gray-800">
//                     {guest.state || "N/A"}
//                   </div>
//                 </div>
  
//                 {/* Pincode */}
//                 <div>
//                   <label className="font-semibold text-sm text-gray-700">
//                     *Pincode
//                   </label>
//                   <div className="border rounded-md p-2 text-gray-800">
//                     {guest.pincode || "N/A"}
//                   </div>
//                 </div>
  
//                 {/* Address */}
//                 <div className="col-span-4">
//                   <label className="font-semibold text-sm text-gray-700">*Address</label>
//                   <div className="border rounded-md p-2 text-gray-800">
//                     {guest.address}
//                   </div>
//                 </div>
  
//                 {/* Check-in Date */}
//                 <div>
//                   <label className="font-semibold text-sm text-gray-700">
//                     *Check-in Date
//                   </label>
//                   <div className="border rounded-md p-2 text-gray-800">
//                     {new Date(guest.checkin_date).toLocaleDateString("en-US")}
//                   </div>
//                 </div>
  
//                 {/* Check-out Date */}
//                 <div>
//                   <label className="font-semibold text-sm text-gray-700">
//                     *Check-out Date
//                   </label>
//                   <div className="border rounded-md p-2 text-gray-800">
//                     {new Date(guest.checkout_date).toLocaleDateString("en-US")}
//                   </div>
//                 </div>
  
//                 {/* Number of Guests */}
//                 <div>
//                   <label className="font-semibold text-sm text-gray-700">*Guests</label>
//                   <div className="border rounded-md p-2 text-gray-800">
//                     {guest.number_of_guests}
//                   </div>
//                 </div>
  
//                 {/* Purpose of Visit */}
//                 <div className="col-span-5">
//                   <label className="font-semibold text-sm text-gray-700">
//                     Purpose of Visit
//                   </label>
//                   <div className="border rounded-md p-2 text-gray-800">
//                     {guest.purpose_of_visit || "N/A"}
//                   </div>
//                 </div>
  
//                 {/* Additional Requests */}
//                 <div className="col-span-6">
//                   <label className="font-semibold text-sm text-gray-700">
//                     Additional Requests
//                   </label>
//                   <div className="border rounded-md p-2 text-gray-800">
//                     {guest.additional_requests || "N/A"}
//                   </div>
//                 </div>
  
  
//                 {/* Buttons */}
//                 <div  className="col-span-6 flex justify-between mt-4 space-x-4">
//                   <Button onClick={acceptGuestApplication} className="w-full bg-blue-700 text-white px-6 py-2 rounded-md shadow hover:bg-blue-500">
//                     Accept
//                   </Button>
//                   <Button onClick={rejectGuestApplication} className="w-full bg-red-700 text-white px-6 py-2 rounded-md shadow hover:bg-red-500">
//                     Reject
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         :
//         <div>
//           {accept ? <div className="flex flex-col justify-center items-center"><IoCheckmarkDoneCircle className="  text-green-500" size={100} /> <div className=" text-3xl text-center font-bold text-green-500">Application Accepted</div> </div>
//           :
//           reject ? <div className="flex flex-col justify-center items-center"><ImCross className="  text-red-500" size={100} /> <div className=" text-3xl text-center font-bold text-red-500">Application Rejected</div> </div> : <div></div>}
//         </div>
//         }
//     </>
//     );
//   };

// export default GuestReferralDialog;











import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { IoCheckmarkDoneCircle, IoClose } from "react-icons/io5";
import { ImCross } from "react-icons/im";

const GuestReferralDialog = ({ guest, removeRequest, onClose }) => {
  const [accept, setAccept] = useState(false);
  const [reject, setReject] = useState(false);

  const acceptGuestApplication = async () => {
    try {
      const res = await axios({
        method: "put",
        url:
          import.meta.env.VITE_BASE_URL +
          "/guest/acceptApplication/" +
          guest.application_id,
        withCredentials: true,
      });
      if (res.data.success) {
        setAccept(true);
        removeRequest(guest.application_id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const rejectGuestApplication = async () => {
    try {
      const res = await axios({
        method: "put",
        url:
          import.meta.env.VITE_BASE_URL +
          "/guest/rejectApplication/" +
          guest.application_id,
        withCredentials: true,
      });
      if (res.data.success) {
        setReject(true);
        removeRequest(guest.application_id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {!(accept || reject) ? (
        <div className="flex items-center justify-center bg-gray-50 px-4 py-6">
          <div className="relative bg-white shadow-lg rounded-md w-full max-w-4xl h-[calc(100vh-40px)] overflow-y-auto p-6">
            {/* Close Button */}
            {/* <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <IoClose size={24} />
            </button> */}

            {/* Content */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
              {/* Application ID */}
              <div>
                <label className="font-semibold text-gray-700">Application ID</label>
                <div className="border rounded-md p-2 text-gray-800">
                  {guest.application_id}
                </div>
              </div>

              {/* First Name */}
              <div>
                <label className="font-semibold text-gray-700">*First Name</label>
                <div className="border rounded-md p-2 text-gray-800">
                  {guest.first_name}
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label className="font-semibold text-gray-700">*Last Name</label>
                <div className="border rounded-md p-2 text-gray-800">
                  {guest.last_name}
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="font-semibold text-gray-700">*Gender</label>
                <div className="border rounded-md p-2 text-gray-800">
                  {guest.gender || "N/A"}
                </div>
              </div>

              {/* Guest Email */}
              <div>
                <label className="font-semibold text-gray-700">*Guest Email</label>
                <div className="border rounded-md p-2 text-gray-800 truncate">
                  {guest.guest_email}
                </div>
              </div>

              {/* Referrer Email */}
              <div>
                <label className="font-semibold text-gray-700">*Referrer Email</label>
                <div className="border rounded-md p-2 text-gray-800 truncate">
                  {guest.referrer_email}
                </div>
              </div>

              {/* Contact Number */}
              <div>
                <label className="font-semibold text-gray-700">*Contact Number</label>
                <div className="border rounded-md p-2 text-gray-800">
                  {guest.contact_number}
                </div>
              </div>

              {/* ID Proof Number */}
              <div>
                <label className="font-semibold text-gray-700">*ID Proof Number</label>
                <div className="border rounded-md p-2 text-gray-800">
                  {guest.id_proof_no}
                </div>
              </div>

              {/* Hostel Number */}
              <div>
                <label className="font-semibold text-gray-700">*Hostel Number</label>
                <div className="border rounded-md p-2 text-gray-800">
                  {guest.hostel_no}
                </div>
              </div>

              {/* City */}
              <div>
                <label className="font-semibold text-gray-700">*City</label>
                <div className="border rounded-md p-2 text-gray-800">
                  {guest.city || "N/A"}
                </div>
              </div>

              {/* State */}
              <div>
                <label className="font-semibold text-gray-700">*State</label>
                <div className="border rounded-md p-2 text-gray-800">
                  {guest.state || "N/A"}
                </div>
              </div>

              {/* Pincode */}
              <div>
                <label className="font-semibold text-gray-700">*Pincode</label>
                <div className="border rounded-md p-2 text-gray-800">
                  {guest.pincode || "N/A"}
                </div>
              </div>

              {/* Address */}
              <div className="sm:col-span-2 md:col-span-3 lg:col-span-4">
                <label className="font-semibold text-gray-700">*Address</label>
                <div className="border rounded-md p-2 text-gray-800">
                  {guest.address}
                </div>
              </div>

              {/* Check-in Date */}
              <div>
                <label className="font-semibold text-gray-700">*Check-in Date</label>
                <div className="border rounded-md p-2 text-gray-800">
                  {new Date(guest.checkin_date).toLocaleDateString("en-US")}
                </div>
              </div>

              {/* Check-out Date */}
              <div>
                <label className="font-semibold text-gray-700">*Check-out Date</label>
                <div className="border rounded-md p-2 text-gray-800">
                  {new Date(guest.checkout_date).toLocaleDateString("en-US")}
                </div>
              </div>

              {/* Number of Guests */}
              <div>
                <label className="font-semibold text-gray-700">*Guests</label>
                <div className="border rounded-md p-2 text-gray-800">
                  {guest.number_of_guests}
                </div>
              </div>

              {/* Purpose of Visit */}
              <div className="col-span-full">
                <label className="font-semibold text-gray-700">Purpose of Visit</label>
                <div className="border rounded-md p-2 text-gray-800">
                  {guest.purpose_of_visit || "N/A"}
                </div>
              </div>

              {/* Additional Requests */}
              <div className="col-span-full">
                <label className="font-semibold text-gray-700">
                  Additional Requests
                </label>
                <div className="border rounded-md p-2 text-gray-800">
                  {guest.additional_requests || "N/A"}
                </div>
              </div>

              {/* Buttons */}
              <div className="col-span-full flex flex-col sm:flex-row justify-between mt-6 space-y-4 sm:space-y-0 sm:space-x-4">
                <Button
                  onClick={acceptGuestApplication}
                  className="w-full sm:w-auto bg-blue-700 text-white px-4 py-2 rounded-md shadow hover:bg-blue-500"
                >
                  Accept
                </Button>
                <Button
                  onClick={rejectGuestApplication}
                  className="w-full sm:w-auto bg-red-700 text-white px-4 py-2 rounded-md shadow hover:bg-red-500"
                >
                  Reject
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-6">
          {accept ? (
            <div className="text-center">
              <IoCheckmarkDoneCircle className="text-green-500 mx-auto" size={100} />
              <p className="text-3xl font-bold text-green-500">Application Accepted</p>
            </div>
          ) : (
            reject && (
              <div className="text-center">
                <ImCross className="text-red-500 mx-auto" size={100} />
                <p className="text-3xl font-bold text-red-500">Application Rejected</p>
              </div>
            )
          )}
        </div>
      )}
    </>
  );
};

export default GuestReferralDialog;

