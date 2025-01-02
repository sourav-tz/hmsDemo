
import React, { useEffect,useState } from 'react';
import { Button } from "@/components/ui/button"
import {Card} from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useForm,Controller } from "react-hook-form"
import { ToastContainer,toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import { DevTool } from "@hookform/devtools"
import ReactPaginate from 'react-paginate';
import '../../../../MainStyles/Pagination.css';
import axios from 'axios';
import { set } from 'date-fns';
import { useSelector } from 'react-redux';
import formdata from '../../../../config/formdata';
import GuestDetailsDialog from './GuestDetailsDialog';

const GuestView = () => {
  
  const totalPages = 10;

  const dummyGuestSchedule = [
    {
      applicationId: "A001",
      guestId: "G101",
      name: "John Doe",
      email: "johndoe@gmail.com",
      referralEmail: "referral@domain.com",
      address: "123 Main Street, Cityville",
      contactNumber: "1234567890",
      relation: "Friend",
      numberOfGuests: 2,
      fromDate: "2024-12-20",
      toDate: "2024-12-25",
      allottedHostel: "Hostel A",
      roomNo: "202",
      purposeOfVisit: "Holiday Visit",
      rejectionReason: "N/A",
    },
    {
      applicationId: "A002",
      guestId: "G102",
      name: "Jane Smith",
      email: "janesmith@gmail.com",
      referralEmail: "referral@domain.com",
      address: "456 Elm Street, Townsville",
      contactNumber: "9876543210",
      relation: "Sister",
      numberOfGuests: 1,
      fromDate: "2024-12-18",
      toDate: "2024-12-22",
      allottedHostel: "Hostel B",
      roomNo: "305",
      purposeOfVisit: "Attending Conference",
      rejectionReason: "N/A",
    },
    {
      applicationId: "A003",
      guestId: "G103",
      name: "Alice Johnson",
      email: "alicejohnson@gmail.com",
      referralEmail: "referral@domain.com",
      address: "789 Oak Street, Villagetown",
      contactNumber: "5678901234",
      relation: "Cousin",
      numberOfGuests: 3,
      fromDate: "2024-12-15",
      toDate: "2024-12-20",
      allottedHostel: "Hostel C",
      roomNo: "101",
      purposeOfVisit: "Family Gathering",
      rejectionReason: "N/A",
    },
    {
      applicationId: "A004",
      guestId: "G104",
      name: "Bob Brown",
      email: "bobbrown@gmail.com",
      referralEmail: "referral@domain.com",
      address: "321 Pine Avenue, Metropolis",
      contactNumber: "4567890123",
      relation: "Brother",
      numberOfGuests: 4,
      fromDate: "2024-12-10",
      toDate: "2024-12-14",
      allottedHostel: "Hostel D",
      roomNo: "207",
      purposeOfVisit: "Wedding",
      rejectionReason: "N/A",
    },
    {
      applicationId: "A005",
      guestId: "G105",
      name: "Charlie Green",
      email: "charliegreen@gmail.com",
      referralEmail: "referral@domain.com",
      address: "654 Birch Lane, Springfield",
      contactNumber: "6789012345",
      relation: "Uncle",
      numberOfGuests: 2,
      fromDate: "2024-12-08",
      toDate: "2024-12-12",
      allottedHostel: "Hostel E",
      roomNo: "309",
      purposeOfVisit: "Cultural Festival",
      rejectionReason: "N/A",
    },
  ];


  // ?------------
    const [guestsScheduleList,setGuestsScheduleList] = useState([]);
    
    const getGuestsScheduleList = async() =>{
      try {
        const res = await axios({
            method: 'get',
            url: import.meta.env.VITE_BASE_URL + '/guest/getApprovedApplicationAdmin',
            withCredentials: true,
                  
        })
        console.log(res.data.result);
        setGuestsScheduleList(res.data.result);   
    } catch (err) {
        console.log(err);
    }
    }
  
    useEffect(() => {
        getGuestsScheduleList();
    }, [])

  return (
    <>
    <div className='flex flex-col items-center w-full bg-gray-100 min-h-screen mx-auto item-center'>
         <h1 className='text-3xl font-semibold mt-10 max-md:mt-24 '>Verify Guest Applications</h1>
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
                 {guestsScheduleList.length !== 0
                  ? guestsScheduleList.map((guest, index) => (
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
                            <Button className="bg-purple-700 hover:bg-purple-500">View Details</Button>
                            </DialogTrigger>
                            <DialogContent className="min-w-fit ">
                            <DialogHeader>
                            <DialogTitle className="text-xl">{"Application ID" + " : " + guest.application_id + " - " + guest.first_name + " " + guest.last_name}</DialogTitle>
                            </DialogHeader>
                            <GuestDetailsDialog className="min-w-fit w-4/5" guest={guest}> </GuestDetailsDialog>
                            </DialogContent>
                          </Dialog> 
                        </TableCell>
                      </TableRow>
                    ))
                  : null}
             </TableBody>
         </Table>
         </Card>
         {/* {notices.length!==0?{notices.map(data=>{
             
         })}} */}
         {/* {notices.length !== 0 ? notices.map(data=>{
           <div>  {data}      <div>  data </div> </div>
     
         }):"blank"} */}
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

export default GuestView