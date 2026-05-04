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
import PropTypes from 'prop-types';

const ViewInfoTable = ({ data }) => {

  const [rowData, setRowData] = useState([]);
  const Dispatcher = useDispatch();
  const [modalData, setModalData] = useState(null);
  const [remarksDialogOpen, setRemarksDialogOpen] = useState(false);
  const [remarksDialogStudent, setRemarksDialogStudent] = useState(null);
  const [remarksDialogData, setRemarksDialogData] = useState([]);
  const [remarksDialogLoading, setRemarksDialogLoading] = useState(false);
  const [addRemarkDialogOpen, setAddRemarkDialogOpen] = useState(false);
  const [addRemarkStudent, setAddRemarkStudent] = useState(null);
  const [remarkText, setRemarkText] = useState('');
  const [remarkFile, setRemarkFile] = useState(null);
  const [submittingRemark, setSubmittingRemark] = useState(false);
  const [editRowData, setEditRowData] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const adminData = useSelector(state => state.userStorage.data);
  const roleType = adminData?.roleType || adminData?.role;
  const apiPrefix = roleType === 'SuperAdmin' ? '/SA' : '/HA';

  useEffect(() => {
    if (data && data.length > 0) {
      setRowData(data);
    }
  }, [data]);

  const updateStudentRemarkSummary = (student, createdRemark) => {
    if (!student?.rollNo || !createdRemark) {
      return;
    }

    setRowData((currentRows) =>
      currentRows.map((row) => {
        if (row.rollNo !== student.rollNo) {
          return row;
        }

        return {
          ...row,
          latestRemarkAt: createdRemark.createdAt || new Date().toISOString(),
          latestRemarkBy: createdRemark.createdByName || createdRemark.createdByEmail || null,
          unseenRemarksCount: 0,
        };
      })
    );
  };

  const openRemarksDialog = async (student) => {
    if (!student?.rollNo) {
      return;
    }

    try {
      setRemarksDialogStudent(student);
      setRemarksDialogOpen(true);
      setRemarksDialogLoading(true);

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}${apiPrefix}/student/${student.rollNo}/remarks`,
        { withCredentials: true }
      );

      setRemarksDialogData(response.data?.remarks || []);
    } catch (error) {
      setRemarksDialogData([]);
      toast.error(error.response?.data?.message || 'Failed to load remarks');
    } finally {
      setRemarksDialogLoading(false);
    }
  };

  const openAddRemarkDialog = (student) => {
    setAddRemarkStudent(student);
    setRemarkText('');
    setRemarkFile(null);
    setAddRemarkDialogOpen(true);
  };

  const acknowledgeRemark = async (remarkId) => {
    if (!remarksDialogStudent?.rollNo) return;
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}${apiPrefix}/student/${remarksDialogStudent.rollNo}/remarks/${remarkId}/acknowledge`,
        {},
        { withCredentials: true }
      );
      const updatedRemark = response.data?.remark;
      setRemarksDialogData((prev) =>
        prev.map((r) => (r.remarkId === remarkId ? { ...r, ...updatedRemark } : r))
      );
      setRowData((currentRows) =>
        currentRows.map((row) =>
          row.rollNo === remarksDialogStudent.rollNo
            ? { ...row, unseenRemarksCount: Math.max(0, (row.unseenRemarksCount || 1) - 1) }
            : row
        )
      );
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to acknowledge remark');
    }
  };

  const submitRemark = async () => {
    if (!addRemarkStudent?.rollNo) {
      return;
    }

    if (!remarkText.trim() && !remarkFile) {
      toast.error('Add a remark or attach a file');
      return;
    }

    try {
      setSubmittingRemark(true);

      const formData = new FormData();
      formData.append('remarks', remarkText.trim());

      if (remarkFile) {
        formData.append('file', remarkFile);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}${apiPrefix}/student/${addRemarkStudent.rollNo}/remarks`,
        formData,
        { withCredentials: true }
      );

      const createdRemark = response.data?.remark;

      updateStudentRemarkSummary(addRemarkStudent, createdRemark);
      setAddRemarkDialogOpen(false);
      setRemarkText('');
      setRemarkFile(null);
      toast.success('Remark added successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add remark');
    } finally {
      setSubmittingRemark(false);
    }
  };

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

  const colDefs = [
    { field: 'rollNo', pinned: 'left', width: 110 },
    { field: 'firstName', pinned: 'left', width: 120 },
    { field: 'lastName', pinned: 'left', width: 120 },
    { field: 'year', width: 80 },
    { field: 'courseId', width: 120, headerName: 'Course ID' },
    { field: 'email', flex: 1, minWidth: 220 },
    { field: 'profile.contactNumber', headerName: 'Contact', width: 150 },
    {
      field: 'remarkTracking',
      headerName: 'Remarks',
      width: 190,
      minWidth: 190,
      maxWidth: 190,
      suppressSizeToFit: true,
      cellStyle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
cellRenderer: (params) => {
  const unseenCount = Number(params.data?.unseenRemarksCount || 0);
  const latestRemarkAt = params.data?.latestRemarkAt;
  const hasRemarks = Boolean(latestRemarkAt);

  return (
    <div className="flex h-full w-full items-center justify-center gap-2">

      {/* View Button (only if remarks exist) */}
      {hasRemarks ? (
        <Button
          className="inline-flex h-9 min-w-[82px] items-center justify-center gap-1 bg-orange-600 px-3 text-[11px] hover:bg-orange-500"
          size="sm"
          onClick={() => {
            openRemarksDialog(params.data);
          }}
        >
          View
          {unseenCount > 0 && (
            <span className="inline-flex min-w-[18px] items-center justify-center rounded-full bg-white px-1.5 text-[10px] font-semibold text-orange-600">
              {unseenCount}
            </span>
          )}
        </Button>
      ) : (
        <span className="text-xs text-gray-400">No remarks</span>
      )}

      {/* ✅ ALWAYS VISIBLE ADD BUTTON */}
      <Button
        className="inline-flex h-9 min-w-[64px] items-center justify-center bg-slate-700 px-3 text-[11px] hover:bg-slate-600"
        size="sm"
        onClick={() => {
          openAddRemarkDialog(params.data);
        }}
      >
        Add
      </Button>
    </div>
  );
}
    },
    {
      field: 'viewInfo',
      headerName: 'View',
      width: 92,
      minWidth: 92,
      maxWidth: 92,
      suppressSizeToFit: true,
      cellStyle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      cellRenderer: (params) => {
        return <Button className="bg-blue-600 hover:bg-blue-500 transition-all" size="sm" onClick={() => { Dispatcher(changeModalState(true)); setModalData(params.data); }}><MdOutlineRemoveRedEye />
        </Button>
      }
    },
    {
      field: 'edit',
      headerName: 'Edit',
      width: 92,
      minWidth: 92,
      maxWidth: 92,
      suppressSizeToFit: true,
      cellStyle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      cellRenderer: (params) => {
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
    {
      field: 'delete',
      headerName: 'Delete',
      width: 100,
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
  ];

  return <>
    {/* I've set the width to 100% to ensure the container takes up full space */}
    <div
      className="ag-theme-quartz mx-auto"
      style={{ height: 475, width: '92%' }}
    >

      {/* The autoSizeStrategy prop is added here to enable auto-resizing */}
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={{
          resizable: true,
        }}
        rowSelection='single'
        rowHeight={64}
      />
      <Dialog open={remarksDialogOpen} onOpenChange={setRemarksDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Student Remarks</DialogTitle>
            <DialogDescription>
              {remarksDialogStudent
                ? `Internal remarks for ${remarksDialogStudent.firstName} ${remarksDialogStudent.lastName}`
                : 'Internal remarks and attachments'}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4">
              {remarksDialogLoading ? (
                <p className="text-sm text-gray-500">Loading remarks...</p>
              ) : remarksDialogData.length === 0 ? (
                <p className="text-sm text-gray-500">No remarks found for this student.</p>
              ) : (
                remarksDialogData.map((remark) => (
                  <div
                    key={remark.remarkId}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                  >
                    <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                      <span className="font-semibold text-gray-700">
                        {remark.createdByName || remark.createdByEmail || 'Unknown author'}
                      </span>
                      <span>{remark.createdByRole || 'Internal'}</span>
                      <span>
                        {remark.createdAt ? new Date(remark.createdAt).toLocaleString() : ''}
                      </span>
                    </div>

                    {remark.remarks && (
                      <p className="mb-3 whitespace-pre-wrap text-gray-800">{remark.remarks}</p>
                    )}

                    {remark.fileAttachment && (
                      <a
                        href={remark.fileAttachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex text-sm font-medium text-blue-600 hover:underline"
                      >
                        View attached file
                      </a>
                    )}

                    {(() => {
                      const mySeenAt = roleType === 'SuperAdmin'
                        ? remark.seenBySuperAdminAt
                        : remark.seenByHostelAuthorityAt;
                      const showAcknowledge = remark.createdByRole !== roleType && !mySeenAt;
                      return showAcknowledge ? (
                        <div className="mt-3 flex justify-end">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-500 text-xs h-7 px-3"
                            onClick={() => acknowledgeRemark(remark.remarkId)}
                          >
                            Acknowledge
                          </Button>
                        </div>
                      ) : null;
                    })()}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      <Dialog open={addRemarkDialogOpen} onOpenChange={setAddRemarkDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Remark</DialogTitle>
            <DialogDescription>
              {addRemarkStudent
                ? `Add an internal remark for ${addRemarkStudent.firstName} ${addRemarkStudent.lastName}`
                : 'Add an internal remark'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div>
              <Label className="mb-2 block">Remark</Label>
              <Textarea
                value={remarkText}
                onChange={(event) => setRemarkText(event.target.value)}
                placeholder="Add an internal note"
                className="min-h-[120px]"
              />
            </div>
            <div>
              <Label className="mb-2 block">Attach image or PDF</Label>
              <Input
                type="file"
                accept="image/*,.pdf,application/pdf"
                onChange={(event) => setRemarkFile(event.target.files?.[0] || null)}
              />
              {remarkFile && (
                <p className="mt-2 text-sm text-gray-500">{remarkFile.name}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              className="bg-orange-600 hover:bg-orange-500"
              onClick={submitRemark}
              disabled={submittingRemark}
            >
              {submittingRemark ? 'Saving...' : 'Add Remark'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Modal data={modalData} />
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} />
    </div>
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
            <Button className="bg-green-600 hover:bg-green-500 transition-all" size="sm" onClick={saveStudent}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )}
  </>
};

export default ViewInfoTable;

ViewInfoTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
};
