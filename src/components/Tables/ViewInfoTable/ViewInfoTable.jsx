import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useState, useEffect } from 'react';
import './ViewInfoTable.css';
import { Button } from "@/components/ui/button"
import Modal from '../../Modals/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { changeModalState } from '../../../Store/Reducers/viewInfoSlice';
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { Dialog, DialogTrigger, DialogContent, DialogFooter, DialogTitle, DialogHeader, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea";

const ViewInfoTable = ({ data }) => {

  const [rowData, setRowData] = useState([]);
  const Dispatcher = useDispatch();
  const [modalData, setModalData] = useState(null);
  const [archiveLoading, setArchiveLoading] = useState(false);

  const adminData = useSelector(state => state.userStorage.data);
  const adminDataValues = adminData?.dataValues || {};
  const adminInfo = {
    name: adminDataValues?.name || adminData?.name || "Admin",
    email: adminDataValues?.email || adminData?.email || "admin@example.com"
  };

  console.log("Admin info in ViewInfoTable:", adminInfo);

  useEffect(() => {
    if (data && data.length > 0) {
      setRowData(data);
    }
  }, [data]);

  const addToArchiveTable = async (rollNo) => {
    try {
      setArchiveLoading(true);
      console.log(rollNo)
      const { data } = await axios.post(import.meta.env.VITE_BASE_URL + '/HA/student-archive', { rollNo });
      toast.success(data.message || 'Student archived successfully!');
      setArchiveLoading(false);
    } catch (error) {
      setArchiveLoading(false);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to archive student';
      toast.error(errorMessage);
    }
  };

  const [colDefs] = useState([
    { field: 'rollNo', pinned: 'left', width: 110 },
    { field: 'firstName', pinned: 'left', width: 120 },
    { field: 'lastName', pinned: 'left', width: 120 },
    { field: 'year', width: 80 },
    { field: 'courseId', width: 120, headerName: 'Course ID' },
    { field: 'email' },
    { field: 'profile.contactNumber', headerName: 'Contact', width: 140 },
    {
      field: 'viewInfo',
      headerName: 'View',
      width: 100,
      cellRenderer: (params) => {
        return <Button className="bg-blue-600 hover:bg-blue-500 transition-all" size="sm" onClick={() => { Dispatcher(changeModalState(true)); setModalData(params.data); }}><MdOutlineRemoveRedEye />
        </Button>
      }
    },
    {
      field: 'edit',
      headerName: 'Edit',
      width: 100,
      cellRenderer: (params) => {
        return <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-500 transition-all" size="sm" ><CiEdit /></Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Student</DialogTitle>
              <DialogDescription>Edit the details of the student</DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[400px] rounded-md border p-4">
              <div className="flex flex-col gap-4">
                <Label>Roll No</Label>
                <Input placeholder="Roll No" defaultValue={params.data.rollNo} />
                <Label>First Name</Label>
                <Input placeholder="First Name" defaultValue={params.data.firstName} />
                <Label>Last Name</Label>
                <Input placeholder="Last Name" defaultValue={params.data.lastName} />
                <Label>Year</Label>
                <Select defaultValue={String(params.data.year)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1st Year</SelectItem>
                    <SelectItem value="2">2nd Year</SelectItem>
                    <SelectItem value="3">3rd Year</SelectItem>
                    <SelectItem value="4">4th Year</SelectItem>
                  </SelectContent>
                </Select>
                <Label>Email</Label>
                <Input placeholder="Email" defaultValue={params.data.email} />
                <Label>Contact Number</Label>
                <Input placeholder="Contact Number" defaultValue={params.data.profile.contactNumber} />
                <Label>Course ID</Label>
                <Input placeholder="Course ID" defaultValue={params.data.courseId} />
                <Label>DOB</Label>
                <Input placeholder="DOB" defaultValue={params.data.profile.dob} />
                <Label>Blood Group</Label>
                <Input placeholder="Blood Group" defaultValue={params.data.profile.bloodGroup} />
                <Label>Identification Mark</Label>
                <Input placeholder="Identification Mark" defaultValue={params.data.profile.identificationMark} />
                <Label>Gender</Label>
                <Select defaultValue={params.data.profile.gender}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Male</SelectItem>
                    <SelectItem value="F">Female</SelectItem>
                    <SelectItem value="O">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Label>Personal Email</Label>
                <Input placeholder="Personal Email" defaultValue={params.data.profile.pEmail} />
                <Label>Address</Label>
                <Textarea placeholder="Address" defaultValue={params.data.profile.subAddress} />
                <Label>City</Label>
                <Input placeholder="City" defaultValue={params.data.profile.city} />
                <Label>State</Label>
                <Input placeholder="State" defaultValue={params.data.profile.state} />
                <Label>Pincode</Label>
                <Input placeholder="Pincode" defaultValue={params.data.profile.pinCode} />
              </div>
            </ScrollArea>
            <DialogFooter className="mt-4">
              <Button className="bg-green-600 hover:bg-green-500 transition-all" size="sm">Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    },
  ]);

  // This strategy tells the grid to resize columns to fit the available width.
  const autoSizeStrategy = {
    type: 'fitGridWidth'
  };

  return <>
    {/* I've set the width to 100% to ensure the container takes up full space */}
    <div className="ag-theme-quartz" style={{ height: 475, width: '100%' }}>

      {/* The autoSizeStrategy prop is added here to enable auto-resizing */}
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        rowSelection='single'
        autoSizeStrategy={autoSizeStrategy}
      />
      <Modal data={modalData} />
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} />
    </div>
  </>
};

export default ViewInfoTable;