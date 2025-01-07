import axios from 'axios';
import React, { useEffect, useState } from 'react'

const GuestFinalDialog = ({guest}) => {
  const [guestDetail,setGuestDetail] = useState({});
    const getGuestDetail = async() =>{
      try {
        const res = await axios({
            method: 'get',
            url: import.meta.env.VITE_BASE_URL + '/guest/getDetails' + guest.application_id + "/" + guest.roomId,
            withCredentials: true,
                  
        })
        console.log("RES",res);
        console.log(res.data.result);
        setGuestDetail(res.data.result);   
    } catch (err) {
        console.log(err);
    }
    }
  
    useEffect(() => {
      getGuestDetail();
    },)
  return (
    <>
    <div className="flex items-center justify-center bg-gray-50">
              <div className="bg-white shadow-lg rounded-md w-max">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 text-sm p-4">
                  {/* Booking ID */}
                  <div>
                    <label className="font-semibold text-sm text-gray-700">
                      Booking ID
                    </label>
                    <div className="border rounded-md p-2 text-gray-800">
                      {guest.bookingId}
                    </div>
                  </div>

                  {/* Application ID */}
                  <div>
                    <label className="font-semibold text-sm text-gray-700">
                      Application ID
                    </label>
                    <div className="border rounded-md p-2 text-gray-800">
                      {guest.application_id}
                    </div>
                  </div>

                  {/* Room ID */}
                  <div>
                    <label className="font-semibold text-sm text-gray-700">
                      Room ID
                    </label>
                    <div className="border rounded-md p-2 text-gray-800">
                      {guest.roomId}
                    </div>
                  </div>
    
                  {/* First Name */}
                  <div>
                    <label className="font-semibold text-sm text-gray-700">
                      *First Name
                    </label>
                    <div className="border rounded-md p-2 text-gray-800">
                      {guestDetail.guestInfo.first_name}
                    </div>
                  </div>
    
                  {/* Last Name */}
                  <div>
                    <label className="font-semibold text-sm text-gray-700">
                      *Last Name
                    </label>
                    <div className="border rounded-md p-2 text-gray-800">
                      {guestDetail.guestInfo.last_name}
                    </div>
                  </div>

                        
                  {/* Gender */}
                  <div>
                    <label className="font-semibold text-sm text-gray-700">*Gender</label>
                    <div className="border rounded-md p-2 text-gray-800">
                      {guestDetail.guestInfo.gender || "N/A"}
                    </div>
                  </div>
    
                  {/* Guest Email */}
                  <div>
                    <label className="font-semibold text-sm text-gray-700">
                      *Guest Email
                    </label>
                    <div className="border rounded-md p-2 text-gray-800">
                      {guestDetail.guestInfo.guest_email}
                    </div>
                  </div>
    
                  {/* Referrer Email */}
                  <div>
                    <label className="font-semibold text-sm text-gray-700">
                      *Referrer Email
                    </label>
                    <div className="border rounded-md p-2 text-gray-800">
                      {guestDetail.guestInfo.referrer_email}
                    </div>
                  </div>
    
                  {/* Contact Number */}
                  <div>
                    <label className="font-semibold text-sm text-gray-700">
                      *Contact Number
                    </label>
                    <div className="border rounded-md p-2 text-gray-800">
                      {guestDetail.guestInfo.contact_number}
                    </div>
                  </div>
    
                  {/* ID Proof Number */}
                  <div>
                    <label className="font-semibold text-sm text-gray-700">
                      *ID Proof Number
                    </label>
                    <div className="border rounded-md p-2 text-gray-800">
                      {guestDetail.guestInfo.id_proof_no}
                    </div>
                  </div>
    
                  {/* Hostel Number */}
                  <div>
                    <label className="font-semibold text-sm text-gray-700">
                      *Hostel Number
                    </label>
                    <div className="border rounded-md p-2 text-gray-800">
                      {guestDetail.roomInfo.allocatedHostel}
                    </div>
                  </div>

                  {/* Room Number */}
                  <div>
                    <label className="font-semibold text-sm text-gray-700">
                      *Room Number
                    </label>
                    <div className="border rounded-md p-2 text-gray-800">
                      {guestDetail.roomInfo.roomNo}
                    </div>
                  </div>

                  {/* Block */}
                  <div>
                    <label className="font-semibold text-sm text-gray-700">
                      *Block
                    </label>
                    <div className="border rounded-md p-2 text-gray-800">
                      {guestDetail.roomInfo.block}
                    </div>
                  </div>

                  {/* Floor Number */}
                  <div>
                    <label className="font-semibold text-sm text-gray-700">
                      *Block
                    </label>
                    <div className="border rounded-md p-2 text-gray-800">
                      {guestDetail.roomInfo.floorNo}
                    </div>
                  </div>

                  {/* Room Current Occupancy */}
                  <div>
                    <label className="font-semibold text-sm text-gray-700">
                      *Room Current Occupancy 
                    </label>
                    <div className="border rounded-md p-2 text-gray-800">
                      {guestDetail.roomInfo.currentOccupancy}
                    </div>
                  </div>

                  {/* Room Max Occupancy */}
                  <div>
                    <label className="font-semibold text-sm text-gray-700">
                      *Room Max Occupancy 
                    </label>
                    <div className="border rounded-md p-2 text-gray-800">
                      {guestDetail.roomInfo.maxOccupancy}
                    </div>
                  </div>
    
                  {/* City */}
                  <div>
                    <label className="font-semibold text-sm text-gray-700">*City</label>
                    <div className="border rounded-md p-2 text-gray-800">
                      {guestDetail.guestInfo.city || "N/A"}
                    </div>
                  </div>
    
                  {/* State */}
                  <div>
                    <label className="font-semibold text-sm text-gray-700">*State</label>
                    <div className="border rounded-md p-2 text-gray-800">
                      {guestDetail.guestInfo.state || "N/A"}
                    </div>
                  </div>
    
                  {/* Pincode */}
                  <div>
                    <label className="font-semibold text-sm text-gray-700">
                      *Pincode
                    </label>
                    <div className="border rounded-md p-2 text-gray-800">
                      {guestDetail.guestInfo.pincode || "N/A"}
                    </div>
                  </div>
    
                  {/* Address */}
                  <div className="col-span-4">
                    <label className="font-semibold text-sm text-gray-700">*Address</label>
                    <div className="border rounded-md p-2 text-gray-800">
                      {guestDetail.guestInfo.address}
                    </div>
                  </div>
    
                  {/* Check-in Date */}
                  <div>
                    <label className="font-semibold text-sm text-gray-700">
                      *Check-in Date
                    </label>
                    <div className="border rounded-md p-2 text-gray-800">
                      {new Date(guestDetail.guestInfo.checkin_date).toLocaleDateString("en-US")}
                    </div>
                  </div>
    
                  {/* Check-out Date */}
                  <div>
                    <label className="font-semibold text-sm text-gray-700">
                      *Check-out Date
                    </label>
                    <div className="border rounded-md p-2 text-gray-800">
                      {new Date(guestDetail.guestInfo.checkout_date).toLocaleDateString("en-US")}
                    </div>
                  </div>

    
                  {/* Number of Guests */}
                  <div>
                    <label className="font-semibold text-sm text-gray-700">*Guests</label>
                    <div className="border rounded-md p-2 text-gray-800">
                      {guestDetail.guestInfo.number_of_guests}
                    </div>
                  </div>
    
                  {/* Purpose of Visit */}
                  <div className="col-span-5">
                    <label className="font-semibold text-sm text-gray-700">
                      Purpose of Visit
                    </label>
                    <div className="border rounded-md p-2 text-gray-800">
                      {guestDetail.guestInfo.purpose_of_visit || "N/A"}
                    </div>
                  </div>
    
                  {/* Additional Requests */}
                  <div className="col-span-6">
                    <label className="font-semibold text-sm text-gray-700">
                      Additional Requests
                    </label>
                    <div className="border rounded-md p-2 text-gray-800">
                      {guestDetail.guestInfo.additional_requests || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
   </> 
  )
}

export default GuestFinalDialog