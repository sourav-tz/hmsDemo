import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import axios from 'axios';
import GuestAllotDialog from './GuestAllotDialog';
import backgroundImage from '../../../../Assets/hostel11.jpg';

const GuestAllot = () => {
  const [guestsRequestList, setGuestsRequestList] = useState([]);

  const getGuestsRequestList = async () => {
    try {
      const res = await axios({
        method: 'get',
        url: import.meta.env.VITE_BASE_URL + '/guest/getApprovedApplicationAdmin',
        withCredentials: true,
      });
      console.log(res.data.result);
      setGuestsRequestList(res.data.result);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getGuestsRequestList();
  }, []);

  const removeRequest = (applicationId) => {
    setTimeout(() => {
      setGuestsRequestList((prevSchedule) =>
        prevSchedule.filter((guest) => guest.application_id !== applicationId)
      );
    }, 3000);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-start py-10 items-center">
                  {/* Background Image Layer */}
                  <div
                    className="absolute top-0 left-0 w-full h-full bg-center bg-cover bg-no-repeat bg-fixed blur-sm opacity-50 z-[-1]"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                  />
      <h1 className='text-3xl text-[#5F57FF] mt-10 max-md:mt-24 '>Room Allotment</h1>
      <Card className="w-3/4 mt-10 ml-2 max-lg:ml-16 min-lg:ml-16 w-4/5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Guest ID</TableHead>
              <TableHead className="text-center">Name</TableHead>
              <TableHead className="text-center">From</TableHead>
              <TableHead className="text-center">To</TableHead>
              <TableHead className="text-center">Allot Room</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {guestsRequestList.length !== 0
              ? guestsRequestList.map((guest, index) => (
                <TableRow key={index}>
                  <TableCell className="text-center">{guest.id_proof_no}</TableCell>
                  <TableCell className="text-center">{guest.first_name + " " + guest.last_name}</TableCell>
                  <TableCell className="text-center">
                    {new Date(guest.checkin_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-center">
                    {new Date(guest.checkout_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-center">
                    <Dialog>
                      <DialogTrigger>
                        <Button className="bg-purple-700 hover:bg-purple-500">Allot Room</Button>
                      </DialogTrigger>
                      <DialogContent className="min-w-fit ">
                        <DialogHeader>
                          <DialogTitle className="text-xl">{"Application ID" + " : " + guest.application_id + " - " + guest.first_name + " " + guest.last_name}</DialogTitle>
                        </DialogHeader>
                        <GuestAllotDialog className="min-w-fit w-4/5" guest={guest} removeRequest={removeRequest} closeDialog={() => setGuestsRequestList([])}> </GuestAllotDialog>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
              : null}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default GuestAllot;