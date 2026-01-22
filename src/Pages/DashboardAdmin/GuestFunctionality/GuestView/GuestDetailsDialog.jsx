import React from "react";
import { Button } from "@/components/ui/button";

const GuestDetailsDialog = ({ guest }) => {
  return (
    <>
      <div className="flex items-center justify-center bg-gray-50">
                <div className="bg-white shadow-lg rounded-md w-max">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 text-sm p-4">
                    {/* Application ID */}
                    <div>
                      <label className="font-semibold text-sm text-gray-700">
                        Application ID
                      </label>
                      <div className="border rounded-md p-2 text-gray-800">
                        {guest.application_id}
                      </div>
                    </div>
      
                    {/* First Name */}
                    <div>
                      <label className="font-semibold text-sm text-gray-700">
                        *First Name
                      </label>
                      <div className="border rounded-md p-2 text-gray-800">
                        {guest.first_name}
                      </div>
                    </div>
      
                    {/* Last Name */}
                    <div>
                      <label className="font-semibold text-sm text-gray-700">
                        *Last Name
                      </label>
                      <div className="border rounded-md p-2 text-gray-800">
                        {guest.last_name}
                      </div>
                    </div>

                          
                    {/* Gender */}
                    <div>
                      <label className="font-semibold text-sm text-gray-700">*Gender</label>
                      <div className="border rounded-md p-2 text-gray-800">
                        {guest.gender || "N/A"}
                      </div>
                    </div>
      
                    {/* Guest Email */}
                    <div>
                      <label className="font-semibold text-sm text-gray-700">
                        *Guest Email
                      </label>
                      <div className="border rounded-md p-2 text-gray-800">
                        {guest.guest_email}
                      </div>
                    </div>
      
                    {/* Referrer Email */}
                    <div>
                      <label className="font-semibold text-sm text-gray-700">
                        *Referrer Email
                      </label>
                      <div className="border rounded-md p-2 text-gray-800">
                        {guest.referrer_email}
                      </div>
                    </div>
      
                    {/* Contact Number */}
                    <div>
                      <label className="font-semibold text-sm text-gray-700">
                        *Contact Number
                      </label>
                      <div className="border rounded-md p-2 text-gray-800">
                        {guest.contact_number}
                      </div>
                    </div>
      
                    {/* ID Proof Number */}
                    <div>
                      <label className="font-semibold text-sm text-gray-700">
                        *ID Proof Number
                      </label>
                      <div className="border rounded-md p-2 text-gray-800">
                        {guest.id_proof_no}
                      </div>
                    </div>
      
                    {/* Hostel Number */}
                    <div>
                      <label className="font-semibold text-sm text-gray-700">
                        *Hostel Number
                      </label>
                      <div className="border rounded-md p-2 text-gray-800">
                        {guest.hostel_no}
                      </div>
                    </div>
      
                    {/* City */}
                    <div>
                      <label className="font-semibold text-sm text-gray-700">*City</label>
                      <div className="border rounded-md p-2 text-gray-800">
                        {guest.city || "N/A"}
                      </div>
                    </div>
      
                    {/* State */}
                    <div>
                      <label className="font-semibold text-sm text-gray-700">*State</label>
                      <div className="border rounded-md p-2 text-gray-800">
                        {guest.state || "N/A"}
                      </div>
                    </div>
      
                    {/* Pincode */}
                    <div>
                      <label className="font-semibold text-sm text-gray-700">
                        *Pincode
                      </label>
                      <div className="border rounded-md p-2 text-gray-800">
                        {guest.pincode || "N/A"}
                      </div>
                    </div>
      
                    {/* Address */}
                    <div className="col-span-4">
                      <label className="font-semibold text-sm text-gray-700">*Address</label>
                      <div className="border rounded-md p-2 text-gray-800">
                        {guest.address}
                      </div>
                    </div>
      
                    {/* Check-in Date */}
                    <div>
                      <label className="font-semibold text-sm text-gray-700">
                        *Check-in Date
                      </label>
                      <div className="border rounded-md p-2 text-gray-800">
                        {new Date(guest.checkin_date).toLocaleDateString("en-US")}
                      </div>
                    </div>
      
                    {/* Check-out Date */}
                    <div>
                      <label className="font-semibold text-sm text-gray-700">
                        *Check-out Date
                      </label>
                      <div className="border rounded-md p-2 text-gray-800">
                        {new Date(guest.checkout_date).toLocaleDateString("en-US")}
                      </div>
                    </div>

      
                    {/* Number of Guests */}
                    <div>
                      <label className="font-semibold text-sm text-gray-700">*Guests</label>
                      <div className="border rounded-md p-2 text-gray-800">
                        {guest.number_of_guests}
                      </div>
                    </div>
      
                    {/* Purpose of Visit */}
                    <div className="col-span-5">
                      <label className="font-semibold text-sm text-gray-700">
                        Purpose of Visit
                      </label>
                      <div className="border rounded-md p-2 text-gray-800">
                        {guest.purpose_of_visit || "N/A"}
                      </div>
                    </div>
      
                    {/* Additional Requests */}
                    <div className="col-span-6">
                      <label className="font-semibold text-sm text-gray-700">
                        Additional Requests
                      </label>
                      <div className="border rounded-md p-2 text-gray-800">
                        {guest.additional_requests || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
     </> 
  );
};

export default GuestDetailsDialog;
