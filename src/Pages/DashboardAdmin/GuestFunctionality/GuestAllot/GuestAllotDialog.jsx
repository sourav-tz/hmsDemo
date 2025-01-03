import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { ImCross } from "react-icons/im";

const GuestAllotDialog = ({ guest, removeRequest }) => {
  const [allot, setAllot] = useState(false);
  const [hostelNo, setHostelNo] = useState('');
  const [blockNo, setBlockNo] = useState('');
  const [floorNo, setFloorNo] = useState('');
  const [roomNo, setRoomNo] = useState('');

  const allotGuestApplication = async () => {
    try {
      const res = await axios({
        method: 'put',
        url: import.meta.env.VITE_BASE_URL + '/guest/allotApplicationAdmin/' + guest.application_id,
        withCredentials: true,
        data: {
          hostel_no: hostelNo,
          block_no: blockNo,
          floor_no: floorNo,
          room_no: roomNo,
        }
      });
      console.log(res);
      if (res.data.success) {
        setAllot(true);
        removeRequest(guest.application_id);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {!allot ? (
        <div className="flex items-center justify-center bg-gray-50">
          <div className="bg-white shadow-lg rounded-md w-max relative">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">Enter Room Details</h2>
              <ImCross className="cursor-pointer" onClick={() => setAllot(false)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm p-4">
              {/* Hostel Number */}
              <div>
                <label className="font-semibold text-sm text-gray-700">Hostel No</label>
                <input
                  type="text"
                  className="border rounded-md p-2 text-gray-800 w-full"
                  value={hostelNo}
                  onChange={(e) => setHostelNo(e.target.value)}
                />
              </div>

              {/* Block Number */}
              <div>
                <label className="font-semibold text-sm text-gray-700">Block No</label>
                <input
                  type="text"
                  className="border rounded-md p-2 text-gray-800 w-full"
                  value={blockNo}
                  onChange={(e) => setBlockNo(e.target.value)}
                />
              </div>

              {/* Floor Number */}
              <div>
                <label className="font-semibold text-sm text-gray-700">Floor No</label>
                <input
                  type="text"
                  className="border rounded-md p-2 text-gray-800 w-full"
                  value={floorNo}
                  onChange={(e) => setFloorNo(e.target.value)}
                />
              </div>

              {/* Room Number */}
              <div>
                <label className="font-semibold text-sm text-gray-700">Room No</label>
                <input
                  type="text"
                  className="border rounded-md p-2 text-gray-800 w-full"
                  value={roomNo}
                  onChange={(e) => setRoomNo(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end p-4 border-t space-x-4">
              <Button onClick={() => setAllot(false)} className="bg-red-700 text-white px-6 py-2 rounded-md shadow hover:bg-red-500">
                Cancel
              </Button>
              <Button onClick={allotGuestApplication} className="bg-blue-700 text-white px-6 py-2 rounded-md shadow hover:bg-blue-500">
                Save
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {allot ? (
            <div className="flex flex-col justify-center items-center">
              <IoCheckmarkDoneCircle className="text-green-500" size={100} />
              <div className="text-3xl text-center font-bold text-green-500">Room Allotted</div>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      )}
    </>
  );
};

export default GuestAllotDialog;