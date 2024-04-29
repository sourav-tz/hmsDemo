import React from 'react';
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

const ViewNotice = () => {

    const totalPages = 10;

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
                <TableHead className="w-[100px]">Notice ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                <TableCell className="font-medium">1</TableCell>
                <TableCell>Notice 1</TableCell>
                <TableCell>Notice Description 1</TableCell>
                <TableCell className="text-left">12-05-2024</TableCell>
                <TableCell className="text-right">
                    <Button className="bg-blue-700 hover:bg-blue-500">View</Button>
                    <Button className="bg-red-700 hover:bg-red-500">Delete</Button>
                </TableCell>
                </TableRow>
                <TableRow>
                <TableCell className="font-medium">2</TableCell>
                <TableCell>Notice 2</TableCell>
                <TableCell>Notice Description 2</TableCell>
                <TableCell className="text-left">12-05-2024</TableCell>
                <TableCell className="text-right">
                    <Button className="bg-blue-700 hover:bg-blue-500">View</Button>
                    <Button className="bg-red-700 hover:bg-red-500">Delete</Button>
                </TableCell>
                </TableRow>
                <TableRow>
                <TableCell className="font-medium">3</TableCell>
                <TableCell>Notice 3</TableCell>
                <TableCell>Notice Description 3</TableCell>
                <TableCell className="text-left">12-05-2024</TableCell>
                <TableCell className="text-right">
                    <Button className="bg-blue-700 hover:bg-blue-500">View</Button>
                    <Button className="bg-red-700 hover:bg-red-500">Delete</Button>
                </TableCell>
                </TableRow>
            </TableBody>
        </Table>
        </Card>
        <ReactPaginate
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
      />
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
