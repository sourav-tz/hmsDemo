import { useEffect, useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import axios from 'axios';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [selectedValue, setSelectedValue] = useState('view'); // Track the selected value in the dropdown
  const [isDescriptionDialogOpen, setIsDescriptionDialogOpen] = useState(false); // State for description dialog

  // Fetch complaints from API
  const fetchComplaints = async () => {
    // const userData = JSON.parse(localStorage.getItem('persist:root'));
    // const hostelNo = JSON.parse(userData.userStorage).data.dataValues.hostelNo;

    try {
      const response = await axios({
        method: 'get',
        url: import.meta.env.VITE_BASE_URL + '/HA/getComplaints',
        withCredentials: true,
      });

      if (response.data.result && Array.isArray(response.data.result)) {
        setComplaints(response.data.result);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Function to resolve complaint
  const resolveComplaint = async (complaintId) => {
    try {
      await axios.post(
        import.meta.env.VITE_BASE_URL + '/HA/resolveComplaint',
        { complaintId },
        { withCredentials: true }
      );
      fetchComplaints(); // Refresh the complaint list
    } catch (err) {
      console.error(err);
    }
  };

  // Function to reject complaint
  const rejectComplaint = async (complaintId) => {
    try {
      await axios.post(
        import.meta.env.VITE_BASE_URL + '/HA/rejectComplaint',
        { complaintId },
        { withCredentials: true }
      );
      fetchComplaints(); // Refresh the complaint list
    } catch (err) {
      console.error(err);
    }
  };

  // Handle action change
  const handleActionChange = (complaintId, action) => {
    if (action === 'view') {
      const complaintToView = complaints.find(c => c.complaintId === complaintId);
      setSelectedComplaint(complaintToView); // Set the selected complaint for viewing
      setIsDescriptionDialogOpen(true); // Open description dialog
      setSelectedValue('view'); // Reset to view if selected
    } else if (action === 'resolve' || action === 'reject') {
      setSelectedComplaint(complaintId); // Set the selected complaint
      setActionType(action); // Set action type for confirmation
      setSelectedValue(action); // Set dropdown value to the action
    }
  };

  // Confirm action
  const confirmAction = () => {
    if (actionType === 'resolve') {
      resolveComplaint(selectedComplaint);
    } else if (actionType === 'reject') {
      rejectComplaint(selectedComplaint);
    }
    setActionType(null); // Reset action type
    setSelectedComplaint(null); // Close the dialog
  };

  // Handle cancel action
  const handleCancel = () => {
    setActionType(null); // Reset action type
    setSelectedComplaint(null); // Close the dialog
    setSelectedValue('view'); // Reset dropdown selection to 'view'
  };

  // Close description dialog
  const closeDescriptionDialog = () => {
    setIsDescriptionDialogOpen(false);
    setSelectedComplaint(null); // Clear selected complaint
  };

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className='flex flex-col items-center w-full bg-gray-100 min-h-screen mx-auto'>
      <h1 className='text-3xl font-semibold mt-10'>Complaint Management</h1>
      <p className='text-gray-500'>Complaints From Students</p>

      <Card className="w-[900px] mt-10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Complaint ID</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {complaints.map((complaint) => (
              <TableRow key={complaint.complaintId}>
                <TableCell className="font-medium">{complaint.complaintId}</TableCell>
                <TableCell>{complaint.subject}</TableCell>
                <TableCell>{complaint.status}</TableCell>
                <TableCell>{formatDate(complaint.createdAt)}</TableCell>
                <TableCell>
                  <Button 
                    className="text-xs bg-green-600 hover:bg-green-500" // Small size and green color
                    onClick={() => {
                      // Close any open description dialog before opening a new one
                      if (isDescriptionDialogOpen) {
                        closeDescriptionDialog();
                      }
                      const complaintToView = complaints.find(c => c.complaintId === complaint.complaintId);
                      setSelectedComplaint(complaintToView);
                      setIsDescriptionDialogOpen(true);
                    }}
                  >
                    Show Description
                  </Button>
                </TableCell>
                <TableCell className="text-right">
                  <Select value={selectedValue} onValueChange={(value) => handleActionChange(complaint.complaintId, value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Actions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="view">View</SelectItem>
                      <SelectItem value="resolve">Resolve</SelectItem>
                      <SelectItem value="reject">Reject</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Dialog for confirming action */}
      {selectedComplaint && actionType && (
        <Dialog open={Boolean(selectedComplaint)} onOpenChange={() => handleCancel()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{actionType === 'resolve' ? 'Confirm Resolve' : 'Confirm Reject'}</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <p>Are you sure you want to {actionType} this complaint?</p>
            </DialogDescription>
            <div className='flex justify-end gap-4'>
              <Button className='bg-gray-300' onClick={handleCancel}>Cancel</Button>
              <Button className='bg-red-600 hover:bg-red-400' onClick={confirmAction}>Confirm</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog for viewing complaint description */}
      {selectedComplaint && isDescriptionDialogOpen && (
        <Dialog open={isDescriptionDialogOpen} onOpenChange={closeDescriptionDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Complaint Description</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <p><strong>Description:</strong> {selectedComplaint.description}</p>
            </DialogDescription>
            <div className='flex justify-end'>
              <Button onClick={closeDescriptionDialog}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Complaints;
