import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm, Controller } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DevTool } from "@hookform/devtools";
import ReactPaginate from "react-paginate";
import "../../../../MainStyles/Pagination.css";
import axios from "axios";
import { set } from "date-fns";
import { useSelector } from "react-redux";
import formdata from "../../../../config/formdata";
import GuestFinalDialog from "./GuestFinalDialog";

const GuestFinal = () => {
  const totalPages = 10;

  const [guestsDetailList,setGuestsDetailList] = useState([]);
  const getGuestsDetailList = async() =>{
    try {
      const res = await axios({
          method: 'get',
          url: import.meta.env.VITE_BASE_URL + '/guest/getSchedule',
          withCredentials: true,
                
      })
      console.log("RES",res);
      console.log(res.data.result);
      setGuestsDetailList(res.data.result);   
  } catch (err) {
      console.log(err);
  }
  }

  useEffect(() => {
      getGuestsDetailList();
  }, [])

  return (
    <>
      <div className="flex flex-col items-center w-full bg-gray-100 min-h-screen mx-auto item-center">
        <h1 className="text-3xl font-semibold mt-10 max-md:mt-24 ">
          View Guest Applications
        </h1>
        <Card className="w-3/4 mt-10 ml-2 max-lg:ml-16 min-lg:ml-16 w-4/5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-medium text-center">Sno</TableHead>
                <TableHead className="font-medium text-center">Booking ID</TableHead>
                <TableHead className="font-medium text-center">Application ID</TableHead>
                <TableHead className="text-center">Room ID</TableHead>
                <TableHead className="text-center">Allocated Hostel</TableHead>
                <TableHead className="text-center">View All Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guestsDetailList.length !== 0
                ? guestsDetailList.map((guest, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium text-center">
                        {index+1}
                      </TableCell>
                      <TableCell className="font-medium text-center">
                        {guest.bookingId}
                      </TableCell>
                      <TableCell className="font-medium text-center">
                        {guest.application_id}
                      </TableCell>
                      <TableCell className="text-center">
                        {guest.roomId}
                      </TableCell>
                      <TableCell className="text-center">
                        {guest.allocatedHostel}
                      </TableCell>
                      <TableCell className="text-center">
                        <Dialog>
                          <DialogTrigger>
                            <Button className="bg-purple-700 hover:bg-purple-500">
                            View All Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="min-w-fit ">
                            <DialogHeader>
                              <DialogTitle className="text-xl">
                                {"Application ID" +
                                  " : " +
                                  guest.application_id}
                              </DialogTitle>
                            </DialogHeader>
                            <GuestFinalDialog
                              className="min-w-fit w-4/5"
                              guest={guest}
                            >
                              {" "}
                            </GuestFinalDialog>
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
  );
};

export default GuestFinal;
