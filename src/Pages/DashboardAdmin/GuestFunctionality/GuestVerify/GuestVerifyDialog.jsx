import React from "react";
import { Button } from "@/components/ui/button";

const GuestVerifyDialog = ({ guest }) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4 text-sm">
        {/* Primary Guest Info */}
        <div>
          <span className="font-semibold">Primary Guest Name - </span>
          {guest.name}
        </div>
        <div>
          <span className="font-semibold">Guest ID - </span>
          {guest.guestId}
        </div>

        {/* Additional Guest Info */}
        <div>
          <span className="font-semibold">Email Address - </span>
          {guest.email}
        </div>
        <div>
          <span className="font-semibold">Referral Email Address - </span>
          {guest.referralEmail}
        </div>

        {/* Address & Contact Info */}
        <div>
          <span className="font-semibold">Address: </span>
          {guest.address}
        </div>
        <div>
          <span className="font-semibold">Contact Number - </span>
          {guest.contactNumber}
        </div>

        {/* Relation & Guest Details */}
        <div>
          <span className="font-semibold">Relation - </span>
          {guest.relation}
        </div>
        <div>
          <span className="font-semibold">Number of Guests: </span>
          {guest.numberOfGuests}
        </div>

        {/* From-To Dates */}
        <div>
          <span className="font-semibold">From </span>
          {new Date(guest.fromDate).toLocaleDateString("en-US",{
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
        </div>
        <div>
          <span className="font-semibold">To </span>
          {new Date(guest.toDate).toLocaleDateString("en-US",{
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
        </div>

        {/* Alloted Hostel & Room Number */}
        <div>
          <span className="font-semibold">Allotted Hostel: </span>
          {guest.hostel}
        </div>
        <div>
          <span className="font-semibold">Room No: </span>
          {guest.roomNo}
        </div>

        {/* Purpose & Reason */}
        <div className="col-span-2">
          <span className="font-semibold">Purpose of Visit: </span>
          {guest.purpose}
        </div>
        <div className="col-span-2">
          <span className="font-semibold">Reason (if rejected): </span>
          {guest.rejectionReason || "N/A"}
        </div>

        {/* Document */}
        <div>
          <span className="font-semibold">Document: </span>
          <Button className="bg-gray-200 hover:bg-gray-300 text-blue-700">
            Click to view
          </Button>
        </div>
        <br>
        </br>
        <Button onClick className=" bg-blue-700 hover:bg-blue-500">
        Accept
      </Button>
        <Button onClick className=" bg-red-700 hover:bg-red-500">
        Reject
      </Button>
       
      </div>
    </>

  );
};

export default GuestVerifyDialog;
