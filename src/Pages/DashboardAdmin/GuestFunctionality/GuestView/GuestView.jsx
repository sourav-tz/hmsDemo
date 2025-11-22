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
import backgroundImage from '../../../../Assets/hostel11.jpg';

const GuestView = () => {
  
  const totalPages = 10;

    const [guestsScheduleList,setGuestsScheduleList] = useState([]);
    const getGuestsScheduleList = async() =>{
      try {
        const res = await axios({
            method: 'get',
            url: import.meta.env.VITE_BASE_URL + '/guest/getApprovedApplicationAdmin',
            withCredentials: true,
                  
        })
        // console.log("RES",res);
        // console.log(res.data.result);
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
    <div className="relative min-h-screen w-full flex flex-col justify-start py-10 items-center">
                  {/* Background Image Layer */}
                  <div
                    className="absolute top-0 left-0 w-full h-full bg-center bg-cover bg-no-repeat bg-fixed blur-sm opacity-50 z-[-1]"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                  />
         <h1 className='text-3xl text-[#5F57FF] mt-10 max-md:mt-24 '>View Guest Applications</h1>
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