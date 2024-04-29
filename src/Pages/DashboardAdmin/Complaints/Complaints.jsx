import {Table, TableHeader, TableRow, TableHead, TableBody, TableCell} from '@/components/ui/table';
import {Card} from '@/components/ui/card';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';


const Complaints = () => {
    return (
        <>
        <div className='flex flex-col items-center w-full bg-gray-100 min-h-screen mx-auto item-center'>
        <h1 className='text-3xl font-semibold mt-10'>Complaint</h1>
        <p className='text-gray-500'>Complaints From Students</p>
        <Card className="w-[900px] mt-10">
        <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[100px]">Complaint ID</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Tag</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                <TableHead className="text-right">View</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                <TableCell className="font-medium">1</TableCell>
                <TableCell>Clogged Pipe</TableCell>
                <TableCell>Pending</TableCell>
                <TableCell className="text-left">12-05-2024</TableCell>
                <TableCell className="text-left">Tag 1</TableCell>
                <TableCell className="text-right">
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Actions"></SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="resolve">Resolve</SelectItem>
                            <SelectItem value="unresolved">Unresolved</SelectItem>
                        </SelectContent>
                    </Select>
                    </TableCell>
                    <TableCell className="text-right">
                    <Dialog>
            <DialogTrigger>
            <Button className="bg-blue-700 hover:bg-blue-500">View</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Resolve Complaint</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                <p>Select an Action for Complaint</p>
                </DialogDescription>
                <div>
                    <Label>Subject</Label>
                    <Input disabled placeholder="Subject" />
                </div>
                <div>
                    <Label>Status</Label>
                    <Input disabled placeholder="Status" />
                </div>
                <div>
                    <Label>Date</Label>
                    <Input disabled placeholder="Date" />
                </div>
                <div>
                    <Label>Tag</Label>
                    <Input disabled placeholder="Tag" />
                </div>
                <div>
                    <Label>Complaint</Label>
                    <Textarea disabled placeholder="Complaint" />
                </div>
                <div className='flex w-full gap-4'>
                <Button className='flex-1 bg-green-600 hover:bg-green-400'>Resolve</Button>
                <Button className='flex-1 bg-red-600 hover:bg-red-400'>Reject</Button>
                </div>
                <Button className="bg-blue-700 hover:bg-blue-500">Close</Button>
            </DialogContent>
        </Dialog>               
        </TableCell>
                </TableRow>
                <TableRow>
                <TableCell className="font-medium">1</TableCell>
                <TableCell>Clogged Pipe</TableCell>
                <TableCell>Pending</TableCell>
                <TableCell className="text-left">12-05-2024</TableCell>
                <TableCell className="text-left">Tag 1</TableCell>
                <TableCell className="text-right">
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Actions"></SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="resolve">Resolve</SelectItem>
                            <SelectItem value="unrsolved">Unresolved</SelectItem>
                        </SelectContent>
                    </Select>
                    </TableCell>
                    <TableCell className="text-right"><Button className="bg-blue-700 hover:bg-blue-500">View</Button></TableCell>
                </TableRow>
                <TableRow>
                <TableCell className="font-medium">1</TableCell>
                <TableCell>Clogged Pipe</TableCell>
                <TableCell>Pending</TableCell>
                <TableCell className="text-left">12-05-2024</TableCell>
                <TableCell className="text-left">Tag 1</TableCell>
                <TableCell className="text-right">
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Actions"></SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="resolve">Resolve</SelectItem>
                            <SelectItem value="unresolved">Unresolved</SelectItem>
                        </SelectContent>
                    </Select>
                    </TableCell>
                    <TableCell className="text-right"><Button className="bg-blue-700 hover:bg-blue-500">View</Button></TableCell>
                </TableRow>
            </TableBody>
        </Table>
        </Card>
        </div>

<div>


</div>
        </>

    );
    }

export default Complaints;


// table should contain the following columns:
// - Complaint ID
// - Subject
// - Status
// - Date
// - Actions
//action is a select dropdown with options:
// - View
// - Resolve
// - Close

// dialog should contains all the fields on the above table along with the action buttons 
