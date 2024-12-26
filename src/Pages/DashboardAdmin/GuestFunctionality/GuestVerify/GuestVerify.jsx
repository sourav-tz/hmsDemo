
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
import GuestVerifyDialog from './GuestVerifyDialog';

const GuestVerify = () => {
  const totalPages = 10;
  const [guestsSchedule,setGuestsSchedule] = useState([]);
  const userData = useSelector(state=>state.userStorage.data);

  // const getNotices = async () => {
  //     try {
  //         const res = await axios({
  //             method: 'get',
  //             url: import.meta.env.VITE_BASE_URL + '/HA/getNotices',
  //             withCredentials: true,
  //             params: { hostelNo: userData.dataValues.hostelNo }, // Send hostelNo as query parameter       
  //         })
  //         console.log("SENT HOSTEL NO_>",userData.dataValues.hostelNo);
  //         console.log(res);
  //         // printing data
  //         console.log("DATA_>",res.data);
  //         setNotices(res.data.result);   
  //     } catch (err) {
  //         console.log(err);
  //     }
  // }

  // Dummy getGuests function

  const notices = []
  // const dummyGuestSchedule = [
  //   {
  //     applicationId: "A001",
  //     guestId: "G101",
  //     name: "John Doe",
  //     roomNo: "202",
  //     fromDate: "2024-12-20",
  //     toDate: "2024-12-25",
  //     numberOfGuests: 2,
  //   },
  //   {
  //     applicationId: "A002",
  //     guestId: "G102",
  //     name: "Jane Smith",
  //     roomNo: "305",
  //     fromDate: "2024-12-18",
  //     toDate: "2024-12-22",
  //     numberOfGuests: 1,
  //   },
  //   {
  //     applicationId: "A003",
  //     guestId: "G103",
  //     name: "Alice Johnson",
  //     roomNo: "101",
  //     fromDate: "2024-12-15",
  //     toDate: "2024-12-20",
  //     numberOfGuests: 3,
  //   },
  //   {
  //     applicationId: "A004",
  //     guestId: "G104",
  //     name: "Bob Brown",
  //     roomNo: "207",
  //     fromDate: "2024-12-10",
  //     toDate: "2024-12-14",
  //     numberOfGuests: 4,
  //   },
  //   {
  //     applicationId: "A005",
  //     guestId: "G105",
  //     name: "Charlie Green",
  //     roomNo: "309",
  //     fromDate: "2024-12-08",
  //     toDate: "2024-12-12",
  //     numberOfGuests: 2,
  //   },
  // ];

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
  
  
  const getGuestsSchedule = () =>{
    setGuestsSchedule(dummyGuestSchedule);
  }


  useEffect(() => {
      getGuestsSchedule();
  }, [])

  const handlePageClick = (data) => { 
      console.log(data.selected);
  }

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
                 {/* <TableHead className="w-[100px]">Notice ID</TableHead> */}
                 <TableHead className="text-center">Name</TableHead>
                 <TableHead className="text-center">Referral ID</TableHead>
                 <TableHead className="text-center">From</TableHead>
                 <TableHead className="text-center">To</TableHead>
                 <TableHead className="text-center">No. of Guests</TableHead>
                 {/* <TableHead className="text-right">Actions</TableHead> */}
                 <TableHead className="text-center">Verify Details</TableHead>
                 </TableRow>
             </TableHeader>
             <TableBody>
                 {/* {notices.length!==0?{notices.map(d=><TableRow>
                 <TableCell className="font-medium">{d.noticeId}</TableCell>
                 <TableCell>{d.title}</TableCell>
                 <TableCell className="text-left">{d.createdAt}</TableCell>
                 <TableCell className="text-right">
                     <Button className="bg-blue-700 hover:bg-blue-500">View</Button>
                     <Button className="bg-red-700 hover:bg-red-500">Delete</Button>
                 </TableCell>
                 </TableRow>)}:null} */}


                 {guestsSchedule.length !== 0
                  ? guestsSchedule.map((guest, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium text-center">{guest.applicationId}</TableCell>
                        <TableCell className="text-center">{guest.guestId}</TableCell>
                        <TableCell className="text-center">{guest.name}</TableCell>
                        <TableCell className="text-center">{guest.referralEmail}</TableCell>
                        <TableCell className="text-center">
                        {new Date(guest.fromDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                        </TableCell>
                        <TableCell  className="text-center">
                        {new Date(guest.toDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                        </TableCell>
                        <TableCell className="text-center">{guest.numberOfGuests}</TableCell>
                        <TableCell className="text-center">
                          <Dialog>
                            <DialogTrigger>
                            <Button className="bg-purple-700 hover:bg-purple-500">Verify Details</Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-fit">
                            <DialogHeader>
                            <DialogTitle>{"Application ID" + " : " + guest.applicationId + " - " + guest.name}</DialogTitle>
                            </DialogHeader>
                            <GuestVerifyDialog guest={guest}> </GuestVerifyDialog>
                            </DialogContent>
                          </Dialog> 
                        </TableCell>
                      </TableRow>
                    ))
                  : null}

 
                        {/* -----------REMOVE THIS------------ */}
                 {notices.length!==0?notices.map((d,index)=>
                 <TableRow>
                 <TableCell className="font-medium">{index+1}</TableCell>
                 <TableCell>{d.title}</TableCell>
                 {/* <TableCell className="text-left">{d.createdAt.}</TableCell> */}
                 <TableCell className="text-left">
                 {new Date(d.createdAt).toLocaleDateString("en-US", {
                     year: "numeric",
                     month: "long",
                     day: "numeric",
                 })}
                 </TableCell>
                 <TableCell className="text-center">
                     <Dialog>
                     <DialogTrigger>
                     <Button className="bg-blue-700 hover:bg-blue-500 mr-10">Download</Button>
                     </DialogTrigger>
                     <DialogContent>
                     <DialogHeader>
                     <DialogTitle>{d.title}</DialogTitle>
                     </DialogHeader>
                     <a href={d.url} target="_blank">Open PDF</a>
                     </DialogContent>
                     </Dialog>
                     <Button onClick={()=>deleteNotice(d.public_id)} className="bg-red-700 hover:bg-red-500">Delete</Button>
                 </TableCell>
                 </TableRow>
                 )
                 :null}
                 {/* ------------------ */}


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

export default GuestVerify