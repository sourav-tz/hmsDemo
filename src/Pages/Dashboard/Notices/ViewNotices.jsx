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
import '../../../MainStyles/Pagination.css';
import axios from 'axios';
import { useSelector } from 'react-redux';
// import { set } from 'dayte-fns';

const ViewNotices = () => {

    const totalPages = 10;
    const [notices,setNotices] = useState([]);
    const userData = useSelector(state=>state.userStorage.data);


    const getNotices = async () => {
        try {
        
        // Check if userData and userData.dataValues are defined
        if (!userData ) {
            console.log("User data missing.");
        }
        // Bug -> userData.dataValues does not exist
        if ( !userData.dataValues ) {
            console.log("User data ki data values missing.");
        }

            // if(userData.dataValues.hostelNo==undefined)userData.dataValues.hostelNo=10;
            // console.log(userData.dataValues.hostelNo);
            console.log("STUDENT DATA_>",userData);
            const res = await axios({
                method: 'get',
                url: import.meta.env.VITE_BASE_URL + '/student/getNotices',
                withCredentials: true,
                // params: { hostelNo: userData.dataValues.hostelNo } // Send hostelNo as query parameter
                params: { hostelNo: (10) }, // (Hard Coding for Hostel 10)
                // because hostelNo field is null in userData
                // Solution: allot a hostel to the student, to fetch the notices of that hostel
                // which are relevant to the student.
            })
            console.log(res);
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


    return (
        <>
        <div className='flex flex-col items-center w-full bg-gray-100 min-h-screen mx-auto item-center'>
        <h1 className='text-3xl font-semibold mt-10'>Notice</h1>
        <p className='text-gray-500'>View Notices</p>
        <Card className="w-[900px] mt-10">
        <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="">Notice ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-center">View</TableHead>
                {/* <TableHead className="text-center">Actions</TableHead> */}
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

                {notices.length!==0?notices.map((d,index)=><TableRow>
                {/* <TableCell className="font-medium">{d.public_id}</TableCell> */}
                <TableCell className="font-medium">{index+1}</TableCell>
                <TableCell>{d.title}</TableCell>
                {/* <TableCell className="text-left">{d.createdAt}</TableCell> */}
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
                    <Button className="bg-blue-700 hover:bg-blue-500">Download</Button>
                    </DialogTrigger>
                    <DialogContent>
                    <DialogHeader>
                    <DialogTitle>{d.title}</DialogTitle>
                    </DialogHeader>
                    <a href={d.url} target="_blank">Open PDF</a>
                    </DialogContent>
                    </Dialog>
                </TableCell>
                </TableRow>):null}
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

export default ViewNotices;


















// make table with the following columns:
// noticeId
// title
// description
// date
// - View
// - Delete
//use shadcn ui components
//use tailwind css for styling
