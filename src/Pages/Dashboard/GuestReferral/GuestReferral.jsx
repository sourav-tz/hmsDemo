import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"
import {Card} from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import 'react-toastify/dist/ReactToastify.css'
import '../../../MainStyles/Pagination.css';
import axios from 'axios';
import { useSelector } from 'react-redux';
import GuestReferralDialog from './GuestReferralDialog'

const GuestReferral = () => {
  const totalPages = 10;
  const [guestsSchedule,setGuestsSchedule] = useState([]);
  
  const getGuestsSchedule = async() =>{
    try {
      const res = await axios({
          method: 'get',
          url: import.meta.env.VITE_BASE_URL + '/guest/getPendingApplication',
          withCredentials: true,
                
      })
      console.log(res.data.result);
      setGuestsSchedule(res.data.result);   
  } catch (err) {
      console.log(err);
  }
  }

useEffect(() => {
  getGuestsSchedule();
  }, [])

  const removeRequest = (applicationId) => {
    // Filter out the application with the given ID
    // Executes after an application is either accepted or rejected
    // Delay the function so that the accept/reject screen shows for some time
    setTimeout(() => {
      setGuestsSchedule((prevSchedule) =>
      prevSchedule.filter((guest) => guest.application_id !== applicationId)
    );
  }, 3000); // Delay in milliseconds
  };

  return (
    <>
    <div className='flex flex-col items-center w-full bg-gray-100 min-h-screen mx-auto item-center'>
         <h1 className='text-3xl font-semibold mt-10 max-md:mt-24 '>Guest Referral Received</h1>
         <Card className="w-3/4 mt-10 ml-2 max-lg:ml-16 min-lg:ml-16 w-4/5">
         <Table>
             <TableHeader>
                <TableRow>
                <TableHead className="font-medium text-center">Application ID</TableHead>
                <TableHead className="text-center">Guest ID</TableHead>
                <TableHead className="text-center">Name</TableHead>
                <TableHead className="text-center">Referral ID</TableHead>
                <TableHead className="text-center">From</TableHead>
                <TableHead className="text-center">To</TableHead>
                <TableHead className="text-center">No. of Guests</TableHead>
                <TableHead className="text-center">Verify Details</TableHead>
                </TableRow>
             </TableHeader>
             <TableBody>

                 {guestsSchedule.length !== 0
                  ? guestsSchedule.map((guest, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium text-center">{guest.application_id}</TableCell>
                        <TableCell className="text-center">{guest.id_proof_no}</TableCell>
                        <TableCell className="text-center">{guest.first_name + " " + guest.last_name}</TableCell>
                        <TableCell className="text-center">{guest.referrer_email}</TableCell>
                        <TableCell className="text-center">
                        {new Date(guest.checkin_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                        </TableCell>
                        <TableCell  className="text-center">
                        {new Date(guest.checkout_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                        </TableCell>
                        <TableCell className="text-center">{guest.number_of_guests}</TableCell>
                        <TableCell className="text-center">
                          <Dialog>
                            <DialogTrigger>
                            <Button className="bg-[#5F57FF] hover:bg-[#33CFFF]">Verify Details</Button>
                            </DialogTrigger>
                            <DialogContent className="min-w-fit ">
                            <DialogHeader>
                            <DialogTitle className="text-xl">{"Application ID" + " : " + guest.application_id + " - " + guest.first_name + " " + guest.last_name}</DialogTitle>
                            </DialogHeader>
                            <GuestReferralDialog className="min-w-fit w-4/5"  guest={guest} removeRequest={removeRequest}> </GuestReferralDialog>
                            </DialogContent>
                          </Dialog> 
                        </TableCell>
                      </TableRow>
                    ))
                  : null}
 
             </TableBody>
         </Table>
         </Card>
         
         {/* <ReactPaginate
         breakLabel="..."
         nextLabel="next >"
         onPageChange={handlePageClick}
         pageRangeDisplayed={3}
         pageCount={totalPages}
         previousLabel="< previous"
         renderOnZeroPageCount={null}
         containerClassName="pagination justify-content-center"
             pageClassName="page-item"
             pageLinkClassName="page-link"
             previousClassName="page-item"
             previousLinkClassName="page-link"
             nextClassName="page-item"
             nextLinkClassName="page-link"
             activeLinkClassName="active-page"
       /> */}
         </div>
         
    </>
  )
}

export default GuestReferral;
