
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useForm, Controller } from "react-hook-form"
import { ToastContainer, toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import { DevTool } from "@hookform/devtools"
import ReactPaginate from 'react-paginate';
import '../../../MainStyles/Pagination.css';
import axios from 'axios';
import { set } from 'date-fns';
import { useSelector } from 'react-redux';
import formdata from '../../../config/formdata';


const ViewNotice = () => {

    const totalPages = 10;
    const [notices, setNotices] = useState([]);
    const userData = useSelector(state => state.userStorage.data);

    const getNotices = async () => {
        try {
            const res = await axios({
                method: 'get',
                url: import.meta.env.VITE_BASE_URL + '/HA/getNotices',
                withCredentials: true,
                params: { hostelNo: userData.dataValues.hostelNo }, // Send hostelNo as query parameter       
                // withCredentials: true,
                // params: { hostelNo: userData.dataValues.hostelNo }, // Send hostelNo as query parameter       
            })
            console.log("SENT HOSTEL NO_>", userData.dataValues.hostelNo);
            console.log(res);
            // printing data
            console.log("DATA_>", res.data);
            setNotices(res.data.result);
        } catch (err) {
            console.log(err);
        }
    }


    useEffect(() => {
        getNotices();
    }, [])

    const handlePageClick = (data) => {
        console.log(data.selected);
    }

    const deleteNotice = async (public_id) => {
        try {
            console.log("TRYING DELETE_>", public_id)
            const res = await axios({
                method: 'delete',
                url: import.meta.env.VITE_BASE_URL + '/HA/deleteNotices',
                data: { public_id },
                withCredentials: true
            })
            // console.log(res);
            getNotices();
        } catch (err) {
            console.log(err);
        }
    }


    return (
        <>
            <div className='flex flex-col items-center w-full bg-gray-100 min-h-screen mx-auto item-center'>
                <h1 className='text-3xl font-semibold mt-10 max-md:mt-24 '>Notice</h1>
                <p className='text-gray-500'>View Notices</p>
                <Card className="w-3/4 mt-10 ml-2 max-lg:ml-16 min-lg:ml-16 ">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="">Notice ID</TableHead>
                                {/* <TableHead className="w-[100px]">Notice ID</TableHead> */}
                                <TableHead>Title</TableHead>
                                <TableHead>Date</TableHead>
                                {/* <TableHead className="text-right">Actions</TableHead> */}
                                <TableHead className="text-center">Actions</TableHead>
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

                            {notices.length !== 0 ? notices.map((d, index) => <TableRow>
                                <TableCell className="font-medium">{index + 1}</TableCell>
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
                                    <Button disabled={d.isGlobal}  onClick={() => deleteNotice(d.public_id)} className="bg-red-700 hover:bg-red-500">Delete</Button>
                                </TableCell>
                            </TableRow>) : null}
                        </TableBody>
                    </Table>
                </Card>
                {/* {notices.length!==0?{notices.map(data=>{
            // 
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

export default ViewNotice;

// make table with the following columns:
// noticeId
// title
// description
// date
// - View
// - Delete
//use shadcn ui components
//use tailwind css for styling