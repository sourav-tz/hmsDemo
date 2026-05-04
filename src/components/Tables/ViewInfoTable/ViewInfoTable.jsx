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
import { HiOutlineBellAlert } from "react-icons/hi2";
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogHeader, DialogDescription } from "@/components/ui/dialog";
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

  // Bug fix by Ravi: Bug 8/9 - Save button had no onClick; inputs were uncontrolled so values couldn't be read
  // External dialog state so the save handler can access the latest edited values
  const [editRowData, setEditRowData] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const adminData = useSelector(state => state.userStorage.data);
  const adminDataValues = adminData?.dataValues || {};
  const adminInfo = {
    name: adminDataValues?.name || adminData?.name || "Admin",
    email: adminDataValues?.email || adminData?.email || "admin@example.com"
  };

  console.log("Admin info in ViewInfoTable:", adminInfo);

  const roleType = adminData?.roleType || adminData?.role;

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

  // Bug fix by Ravi: Bug 8/9 - Save function calls PATCH /HA/updateSingleStudent with the edited data
  const saveStudent = async () => {
    try {
      await axios({
        method: 'patch',
        url: import.meta.env.VITE_BASE_URL + '/HA/updateSingleStudent',
        withCredentials: true,
        data: editRowData,
      });
      toast.success('Student updated successfully!');
      setEditDialogOpen(false);
      setEditRowData(null);
    } catch (err) {
      toast.error('Failed to update student');
    }
  };

  const [colDefs] = useState([
    // Bug fix by Ravi: Bug 16 - filter: true enables AG Grid's built-in column filter
    // Replaced hardcoded width with flex+minWidth so columns fill available space instead of truncating on smaller/production screens
    { field: 'rollNo', filter: true, pinned: 'left', minWidth: 120 },
    { field: 'firstName', filter: true, pinned: 'left', flex: 1, minWidth: 130 },
    { field: 'lastName', filter: true, pinned: 'left', flex: 1, minWidth: 130 },
    { field: 'year', filter: true, minWidth: 90 },
    // Bug fix by Ravi: Bug 17 - courseId was showing numeric ID; course.courseName shows readable name (backend already includes course association)
    // { field: 'courseId', width: 120, headerName: 'Course ID' },  // Bug 17: commented out - showed numeric courseId instead of name
    { field: 'course.courseName', filter: true, flex: 1, minWidth: 140, headerName: 'Course' },
    { field: 'email', filter: true, flex: 2, minWidth: 220, tooltipField: 'email' },
    { field: 'profile.contactNumber', filter: true, headerName: 'Contact', minWidth: 140 },
    // Bug fix by Ravi: Bug 18 - Room allotment information was missing from the student list
    { field: 'roomId', filter: true, headerName: 'Room No', minWidth: 100 },
    // Bug fix by Ravi: Bug 20 - Hostel number was missing from student records
    { field: 'hostelNo', filter: true, headerName: 'Hostel No', minWidth: 110 },
    // Bug fix by Ravi: Bug 21 - Hostel category (Boys/Girls) was missing from student records
    { field: 'hostel.type', filter: true, headerName: 'Hostel Type', minWidth: 120 },
    {
      field: 'remarkTracking',
      headerName: 'Remarks',
      width: 180,
      cellRenderer: (params) => {
        const unseenCount = Number(params.data?.unseenRemarksCount || 0);
        const latestRemarkBy = params.data?.latestRemarkBy;
        const latestRemarkAt = params.data?.latestRemarkAt;

        if (!latestRemarkAt && unseenCount === 0) {
          return <span className="text-xs text-gray-500">No remarks</span>;
        }

        return (
          <div className="flex flex-col justify-center py-1">
            <div className="flex items-center gap-1 text-xs font-medium">
              {unseenCount > 0 ? (
                <>
                  <HiOutlineBellAlert className="text-orange-500" />
                  <span className="text-orange-600">
                    {unseenCount} new for {roleType === 'SuperAdmin' ? 'SA' : 'HA'}
                  </span>
                </>
              ) : (
                <span className="text-green-600">Up to date</span>
              )}
            </div>
            {latestRemarkAt && (
              <span className="text-[11px] text-gray-500">
                Latest: {latestRemarkBy || 'Internal'} on {new Date(latestRemarkAt).toLocaleDateString()}
              </span>
            )}
          </div>
        );
      }
    },
    {
      field: 'viewInfo',
      headerName: 'View',
      minWidth: 90,
      cellRenderer: (params) => {
        return <Button className="bg-blue-600 hover:bg-blue-500 transition-all" size="sm" onClick={() => { Dispatcher(changeModalState(true)); setModalData(params.data); }}><MdOutlineRemoveRedEye />
        </Button>
      }
    },
    {
      field: 'edit',
      headerName: 'Edit',
      minWidth: 90,
      cellRenderer: (params) => {
        // Bug fix by Ravi: Bug 8/9 - Old inline Dialog had no Save onClick handler and uncontrolled inputs
        // Replaced with external dialog (below) so save handler can access current state values
        // Old inline approach (commented out to preserve original code):
        // return <Dialog>
        //   <DialogTrigger asChild>
        //     <Button className="bg-green-600 hover:bg-green-500 transition-all" size="sm"><CiEdit /></Button>
        //   </DialogTrigger>
        //   <DialogContent>
        //     ... all Input fields with defaultValue (uncontrolled - save had no access to values) ...
        //     <Button className="bg-green-600 hover:bg-green-500 transition-all" size="sm">Save</Button>  {/* No onClick */}
        //   </DialogContent>
        // </Dialog>
        return (
          <Button
            className="bg-green-600 hover:bg-green-500 transition-all"
            size="sm"
            onClick={() => {
              setEditRowData({ ...params.data, ...(params.data.profile || {}) });
              setEditDialogOpen(true);
            }}
          >
            <CiEdit />
          </Button>
        );
      }
    },
    // Bug fix by Ravi: Bug 7/11 - Delete button was completely missing from the student management table
    {
      field: 'delete',
      headerName: 'Delete',
      minWidth: 100,
      cellRenderer: (params) => {
        return (
          <Button
            className="bg-red-600 hover:bg-red-500 transition-all"
            size="sm"
            onClick={async () => {
              if (!window.confirm(`Delete student ${params.data.rollNo}? This cannot be undone.`)) return;
              try {
                await axios.delete(
                  import.meta.env.VITE_BASE_URL + '/HA/deleteStudent',
                  { data: { rollNo: params.data.rollNo, email: params.data.email }, withCredentials: true }
                );
                toast.success('Student deleted successfully');
              } catch (err) {
                toast.error('Failed to delete student');
              }
            }}
          >
            Delete
          </Button>
        );
      }
    },
  ]);

  // Replaced fitGridWidth autoSizeStrategy with onFirstDataRendered sizeColumnsToFit — fitGridWidth compresses columns on load before font metrics are available in production, causing truncation
  const onFirstDataRendered = (params) => {
    params.api.sizeColumnsToFit();
  };

  return <>
    {/* overflow-x-auto allows horizontal scroll instead of compressing columns on narrow screens */}
    <div className="w-full overflow-x-auto">
      <div className="ag-theme-quartz" style={{ height: 475, minWidth: '1200px' }}>

        {/* Bug fix by Ravi: Bug 16 - floatingFilter shows per-column search boxes at the top */}
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          rowSelection='single'
          floatingFilter={true}
          onFirstDataRendered={onFirstDataRendered}
        />
        <Modal data={modalData} />
        <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} />
      </div>
    </div>

    {/* Bug fix by Ravi: Bug 8/9 - External edit dialog with controlled inputs so Save can read and submit current values */}
    {editDialogOpen && editRowData && (
      <Dialog open={editDialogOpen} onOpenChange={(open) => { if (!open) { setEditDialogOpen(false); setEditRowData(null); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>Edit the details of the student</DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px] rounded-md border p-4">
            <div className="flex flex-col gap-4">
              <Label>Roll No</Label>
              <Input placeholder="Roll No" value={editRowData.rollNo || ''} onChange={(e) => setEditRowData(prev => ({ ...prev, rollNo: e.target.value }))} />
              <Label>First Name</Label>
              <Input placeholder="First Name" value={editRowData.firstName || ''} onChange={(e) => setEditRowData(prev => ({ ...prev, firstName: e.target.value }))} />
              <Label>Last Name</Label>
              <Input placeholder="Last Name" value={editRowData.lastName || ''} onChange={(e) => setEditRowData(prev => ({ ...prev, lastName: e.target.value }))} />
              <Label>Year</Label>
              <Select value={String(editRowData.year || '')} onValueChange={(val) => setEditRowData(prev => ({ ...prev, year: val }))}>
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
              <Input placeholder="Email" value={editRowData.email || ''} onChange={(e) => setEditRowData(prev => ({ ...prev, email: e.target.value }))} />
              <Label>Contact Number</Label>
              <Input placeholder="Contact Number" value={editRowData.contactNumber || ''} onChange={(e) => setEditRowData(prev => ({ ...prev, contactNumber: e.target.value }))} />
              <Label>Course ID</Label>
              <Input placeholder="Course ID" value={editRowData.courseId || ''} onChange={(e) => setEditRowData(prev => ({ ...prev, courseId: e.target.value }))} />
              <Label>DOB</Label>
              <Input placeholder="DOB" value={editRowData.dob || ''} onChange={(e) => setEditRowData(prev => ({ ...prev, dob: e.target.value }))} />
              <Label>Blood Group</Label>
              <Input placeholder="Blood Group" value={editRowData.bloodGroup || ''} onChange={(e) => setEditRowData(prev => ({ ...prev, bloodGroup: e.target.value }))} />
              <Label>Identification Mark</Label>
              <Input placeholder="Identification Mark" value={editRowData.identificationMark || ''} onChange={(e) => setEditRowData(prev => ({ ...prev, identificationMark: e.target.value }))} />
              <Label>Gender</Label>
              <Select value={editRowData.gender || ''} onValueChange={(val) => setEditRowData(prev => ({ ...prev, gender: val }))}>
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
              <Input placeholder="Personal Email" value={editRowData.pEmail || ''} onChange={(e) => setEditRowData(prev => ({ ...prev, pEmail: e.target.value }))} />
              <Label>Address</Label>
              <Textarea placeholder="Address" value={editRowData.subAddress || ''} onChange={(e) => setEditRowData(prev => ({ ...prev, subAddress: e.target.value }))} />
              <Label>City</Label>
              <Input placeholder="City" value={editRowData.city || ''} onChange={(e) => setEditRowData(prev => ({ ...prev, city: e.target.value }))} />
              <Label>State</Label>
              <Input placeholder="State" value={editRowData.state || ''} onChange={(e) => setEditRowData(prev => ({ ...prev, state: e.target.value }))} />
              <Label>Pincode</Label>
              <Input placeholder="Pincode" value={editRowData.pinCode || ''} onChange={(e) => setEditRowData(prev => ({ ...prev, pinCode: e.target.value }))} />
            </div>
          </ScrollArea>
          <DialogFooter className="mt-4">
            {/* Bug fix by Ravi: Bug 8/9 - Save button now calls saveStudent which hits PATCH /HA/updateSingleStudent */}
            <Button className="bg-green-600 hover:bg-green-500 transition-all" size="sm" onClick={saveStudent}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )}
  </>
};

export default ViewInfoTable;
