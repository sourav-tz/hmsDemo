import { useEffect, useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import axios from 'axios';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [comment, setComment] = useState('');
  const [isDescriptionDialogOpen, setIsDescriptionDialogOpen] = useState(false);
  const [actionStates, setActionStates] = useState({});

  // Fetch complaints from API
  const fetchComplaints = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_BASE_URL + '/HA/getComplaints', { withCredentials: true });

      if (response.data.result && Array.isArray(response.data.result)) {
        setComplaints(response.data.result);
        const initialStates = {};
        response.data.result.forEach(complaint => {
          initialStates[complaint.complaintId] = 'view'; // Default state
        });
        setActionStates(initialStates);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Function to resolve or reject complaint
  const handleComplaintAction = async (complaintId, action) => {
    try {
      const endpoint = action === 'resolve' ? '/HA/resolveComplaint' : '/HA/rejectComplaint';
      await axios.post(import.meta.env.VITE_BASE_URL + endpoint, { complaintId, comment }, { withCredentials: true });
      fetchComplaints(); // Refresh the complaint list
    } catch (err) {
      console.error(err);
    }
  };

  // Handle action change
  const handleActionChange = (complaintId, action) => {
    setActionStates(prev => ({ ...prev, [complaintId]: action })); // Update action state
    if (action === 'view') {
      const complaintToView = complaints.find(c => c.complaintId === complaintId);
      setSelectedComplaint(complaintToView);
      setIsDescriptionDialogOpen(true);
    } else if (action === 'resolve' || action === 'reject') {
      // Bug fix by Ravi: Bug 1 & 2 - selectedComplaint was storing only the ID (integer); full object needed so complaint details (subject, rollNo, description) are visible in the action dialog
      setSelectedComplaint(complaints.find(c => c.complaintId === complaintId));
      setActionType(action);
    }
  };

  // Confirm action
  const confirmAction = () => {
    if (actionType) {
      // Bug fix by Ravi: Bug 1 & 2 - extract complaintId from the full selectedComplaint object (was passing the raw ID before)
      handleComplaintAction(selectedComplaint.complaintId, actionType);
    }
    resetState();
  };

  // Reset state function
  const resetState = () => {
    setActionType(null);
    setSelectedComplaint(null);
    setComment('');
    // Bug fix by Ravi: Bug 1 & 2 - use optional chaining since selectedComplaint is now a full object, not a plain ID
    setActionStates(prev => ({ ...prev, [selectedComplaint?.complaintId]: 'view' }));
  };

  // Handle cancel action
  const handleCancel = () => {
    resetState();
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
              <TableHead>Roll No.</TableHead>
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
                <TableCell>{complaint.rollNo}</TableCell>
                <TableCell>{complaint.subject}</TableCell>
                <TableCell>
                  {complaint.status === 'pending' ? (
                    <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-200 rounded-full">
                      {complaint.status}
                    </span>
                  ) : (
                    <span>{complaint.status}</span>
                  )}
                </TableCell>
                <TableCell>{formatDate(complaint.createdAt)}</TableCell>
                <TableCell>
                  <Button 
                    className="text-xs bg-green-600 hover:bg-green-500"
                    onClick={() => {
                      const complaintToView = complaints.find(c => c.complaintId === complaint.complaintId);
                      setSelectedComplaint(complaintToView);
                      setIsDescriptionDialogOpen(true);
                    }}
                  >
                    Show Description
                  </Button>
                </TableCell>
                <TableCell className="text-right">
                  <Select value={actionStates[complaint.complaintId] || 'view'} onValueChange={(value) => handleActionChange(complaint.complaintId, value)}>
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
        <Dialog open={Boolean(actionType)} onOpenChange={() => handleCancel()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{actionType === 'resolve' ? 'Confirm Resolve' : 'Confirm Reject'}</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <p>Are you sure you want to {actionType} this complaint?</p>
              <label className="block mt-4 font-medium">
                Add a comment <span className="text-red-600">*</span>
              </label>
              {/* Bug fix by Ravi: Bug 1 & 2 - complaint details were not shown before resolve/reject; selectedComplaint now holds the full object so these fields are available */}
              <p><strong>Subject:</strong> {selectedComplaint?.subject}</p>
              <p><strong>Roll No:</strong> {selectedComplaint?.rollNo}</p>
              <p><strong>Description:</strong> {selectedComplaint?.description}</p>
              <hr className="my-2" />
              <Textarea
                placeholder="Add a comment (mandatory)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mt-2 w-full h-24 p-2 border rounded-md resize-none"
                required
              />
            </DialogDescription>
            <div className='flex justify-end gap-4'>
              <Button className='bg-blue-500 hover:bg-blue-400' onClick={handleCancel}>Cancel</Button>
              <Button 
                className={`bg-red-600 hover:bg-red-400 ${!comment ? 'opacity-50 cursor-not-allowed' : ''}`} 
                onClick={confirmAction}
                disabled={!comment} // Disable the button if comment is empty
              >
                Confirm
              </Button>
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
              <p>{selectedComplaint.description}</p>
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
