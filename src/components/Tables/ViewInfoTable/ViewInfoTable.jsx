import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useState,useCallback, useEffect } from 'react';
import './ViewInfoTable.css';
import { Button } from "@/components/ui/button"
import Modal from '../../Modals/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { changeModalState,setModalData } from '../../../Store/Reducers/viewInfoSlice';
import PdfDownload from './PdfDownload';
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import { Card } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent,DialogFooter,DialogTitle,DialogHeader,DialogDescription } from "@/components/ui/dialog";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
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
import {Textarea} from "@/components/ui/textarea";
import {Calendar} from "@/components/ui/calendar";
import {useForm,Controller} from 'react-hook-form';

const ViewInfoTable = ({data})=>{

  // Row Data: The data to be displayed.

  const [rowData, setRowData] = useState([]);
  const Dispatcher = useDispatch();
  const [modalData,setModalData] = useState(null);
  const [edit,setEdit] = useState(false);
  const [date,setDate] = useState(new Date());
  const [archiveLoading, setArchiveLoading] = useState(false);

  // Get admin data from Redux store
  const adminData = useSelector(state => state.userStorage.data);

  // Extract admin data from the nested dataValues property if it exists
  const adminDataValues = adminData?.dataValues || {};

  // Determine the admin information to use
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




  // Column Definitions: Defines & controls grid columns.
  const [colDefs, setColDefs] = useState([
        {field:'rollNo',pinned:'left',width:100},
        {field:'firstName', pinned:'left',width:120},
        {field:'lastName',pinned:'left',width:120},
        {field:'year',width:80},
        {field:'courseId',width:120},
        {field:'email'},
        {field:'profile.contactNumber', headerName: 'Contact Number',width:150},
        {field:'viewInfo',width:110,cellRenderer:(params)=>{return <Button className="bg-blue-600 hover:bg-blue-500 transition-all" size="sm" onClick={()=>{Dispatcher(changeModalState(true));setModalData(params.data);}}><MdOutlineRemoveRedEye />
        </Button>}},
        {field:'edit',width:100,cellRenderer:(params)=>{return <Dialog>
          <DialogTrigger>
          <Button className="bg-green-600 hover:bg-green-500 transition-all" size="sm" ><CiEdit /></Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>Edit the details of the student</DialogDescription>
            </DialogHeader>
          <ScrollArea>
          <div className='w-full h-[400px] overflow-y-scroll bg-white rounded-md z-[50]'>

                  <div className="flex flex-col gap-4 p-2">
                  <Label>Roll No</Label>
                  <Input placeholder="Roll No" defaultValue={params.data.rollNo} />
                  <Label>First Name</Label>
                  <Input placeholder="First Name" value={params.data.firstName} />
                  <Label>Last Name</Label>
                  <Input placeholder="Last Name" value={params.data.lastName} />
                  <Label>Year</Label>
                  <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={params.data.year} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1st Year</SelectItem>
                    <SelectItem value="2">2nd Year</SelectItem>
                    <SelectItem value="3">3rd Year</SelectItem>
                    <SelectItem value="4">4th Year</SelectItem>
                  </SelectContent>
                </Select>
                  <Label>Email</Label>
                  <Input placeholder="Email" value={params.data.email} />
                  <Label>Contact Number</Label>
                  <Input placeholder="Contact Number" value={params.data.profile.contactNumber} />
                  <Label>Course ID</Label>
                  <Input placeholder="Course ID" value={params.data.courseId} />
                  <Label>DOB</Label>
                  <Input placeholder="DOB" value={params.data.profile.dob} />
                  <Label>Blood Group</Label>
                  <Input placeholder="Blood Group" value={params.data.profile.bloodGroup} />
                  <Label>Identification Mark</Label>
                  <Input placeholder="Identification Mark" value={params.data.profile.identificationMark} />
                  <Label>Gender</Label>
                  <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={params.data.profile.gender} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Male</SelectItem>
                    <SelectItem value="F">Female</SelectItem>
                    <SelectItem value="O">Other</SelectItem>
                  </SelectContent>
                </Select>
                  <Label>Personal Email</Label>
                  <Input placeholder="Personal Email" value={params.data.profile.pEmail} />
                  <Label>Address</Label>
                  <Textarea placeholder="Address" value={params.data.profile.subAddress} />
                  <Label>City</Label>
                  <Input placeholder="City" value={params.data.profile.city} />
                  <Label>State</Label>
                  <Input placeholder="State" value={params.data.profile.state} />
                  <Label>Pincode</Label>
                  <Input placeholder="Pincode" value={params.data.profile.pinCode} />
                  </div>
          </div>
          <DialogFooter className="mt-4">
          <Button className="bg-green-600 hover:bg-green-500 transition-all" size="sm">Save</Button>
          <Button className="bg-red-600 hover:bg-red-500 transition-all" size="sm" onClick={()=>{}}>Cancel</Button>
          </DialogFooter>
          </ScrollArea>
          </DialogContent>
          </Dialog> }},
        {field:'delete',width:100,cellRenderer:(params)=>{return <Button className="bg-red-600 hover:bg-red-500 transition-all" size="sm" ><RiDeleteBin5Line /></Button>}}
         
  ]);





    return<>
       <div className="ag-theme-quartz" style={{ height: 475, paddingRight:0, marginRight:0 }}>

        {/* The AG Grid component */}
        <AgGridReact  rowData={rowData} columnDefs={colDefs}  rowSelection='single' rowMultiSelectWithClick={true}/>
        <Modal data={modalData}/>
        {/* <div className={`${edit?'translate-y-0':'-translate-y-full'} w-full h-screen fixed top-0 left-0 z-[1000] flex flex-col justify-center items-center overflow-y-scroll p-10`}>
          <div className="w-full h-full fixed top-0 left-0 bg-gray-900 bg-opacity-50"></div>

        </div> */}
        </div>
    </>


};



export default ViewInfoTable;












