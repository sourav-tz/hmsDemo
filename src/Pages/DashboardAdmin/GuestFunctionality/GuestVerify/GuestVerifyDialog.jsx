import React from "react";
import { Button } from "@/components/ui/button";

const GuestVerifyDialog = ({ guest }) => {
  return (
    <div className="flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-md w-max">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm p-4">
          {/* Header */}
          {/* <h1 className="text-lg font-bold text-gray-800 mb-4 col-span-4 text-center">
            Guest Information
          </h1> */}

          {/* First Name */}
          <div>
            <label className="font-semibold text-sm text-gray-700">
              *First Name
            </label>
            <div className="border rounded-md p-2 text-gray-800">
              {guest.name.split(" ")[0]}
            </div>
          </div>

          {/* Last Name */}
          <div>
            <label className="font-semibold text-sm text-gray-700">
              *Last Name
            </label>
            <div className="border rounded-md p-2 text-gray-800">
              {guest.name.split(" ")[1]}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="font-semibold text-sm text-gray-700">
              *Your Email
            </label>
            <div className="border rounded-md p-2 text-gray-800">{guest.email}</div>
          </div>

          {/* Referral Email */}
          <div>
            <label className="font-semibold text-sm text-gray-700">
              *Referrer Email
            </label>
            <div className="border rounded-md p-2 text-gray-800">
              {guest.referralEmail}
            </div>
          </div>

          {/* Contact Number */}
          <div>
            <label className="font-semibold text-sm text-gray-700">
              *Contact Number
            </label>
            <div className="border rounded-md p-2 text-gray-800">
              {guest.contactNumber}
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
              {new Date(guest.fromDate).toLocaleDateString("en-US")}
            </div>
          </div>

          {/* Check-out Date */}
          <div>
            <label className="font-semibold text-sm text-gray-700">
              *Check-out Date
            </label>
            <div className="border rounded-md p-2 text-gray-800">
              {new Date(guest.toDate).toLocaleDateString("en-US")}
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="font-semibold text-sm text-gray-700">*Gender</label>
            <div className="border rounded-md p-2 text-gray-800">
              {guest.gender || "N/A"}
            </div>
          </div>

          {/* Number of Guests */}
          <div>
            <label className="font-semibold text-sm text-gray-700">*Guests</label>
            <div className="border rounded-md p-2 text-gray-800">
              {guest.numberOfGuests}
            </div>
          </div>

          {/* Purpose of Visit */}
          <div className="col-span-4">
            <label className="font-semibold text-sm text-gray-700">
              Purpose of Visit
            </label>
            <div className="border rounded-md p-2 text-gray-800">
              {guest.purpose || "N/A"}
            </div>
          </div>

          {/* Buttons */}
          <div className="col-span-4 flex justify-between mt-4 space-x-4">
            <Button className="w-full bg-blue-700 text-white px-6 py-2 rounded-md shadow hover:bg-blue-500">
              Accept
            </Button>
            <Button className="w-full bg-red-700 text-white px-6 py-2 rounded-md shadow hover:bg-red-500">
              Reject
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestVerifyDialog;
