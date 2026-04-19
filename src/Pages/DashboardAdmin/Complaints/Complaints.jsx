import { useEffect, useState } from 'react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import axios from 'axios';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [comment, setComment] = useState('');
  const [isDescriptionDialogOpen, setIsDescriptionDialogOpen] = useState(false);
  const [actionStates, setActionStates] = useState({});

  // 🔹 Fetch complaints (POST — important)
  const fetchComplaints = async () => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_BASE_URL + '/HA/getComplaints',
        {},
        { withCredentials: true }
      );

      if (response.data.result && Array.isArray(response.data.result)) {
        setComplaints(response.data.result);
        const initialStates = {};
        response.data.result.forEach((c) => {
          initialStates[c.complaintId] = 'view';
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

  // 🔹 Resolve / Reject complaint
  const handleComplaintAction = async (complaintId, action) => {
    try {
      const endpoint =
        action === 'resolve'
          ? '/HA/resolveComplaint'
          : '/HA/rejectComplaint';

      await axios.post(
        import.meta.env.VITE_BASE_URL + endpoint,
        { complaintId, comment },
        { withCredentials: true }
      );

      fetchComplaints();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Handle action change
  const handleActionChange = (complaintId, action) => {
    setActionStates((prev) => ({ ...prev, [complaintId]: action }));

    if (action === 'view') {
      const complaintToView = complaints.find(
        (c) => c.complaintId === complaintId
      );
      setSelectedComplaint(complaintToView);
      setIsDescriptionDialogOpen(true);
    } else {
      setSelectedComplaint(complaintId);
      setActionType(action);
    }
  };

  const confirmAction = () => {
    if (actionType) {
      handleComplaintAction(selectedComplaint, actionType);
    }
    resetState();
  };

  const resetState = () => {
    setActionType(null);
    setSelectedComplaint(null);
    setComment('');
  };

  const closeDescriptionDialog = () => {
    setIsDescriptionDialogOpen(false);
    setSelectedComplaint(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderPriorityBadge = (priority) => {
    if (priority === 'HIGH') {
      return (
        <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-200 rounded-full">
          HIGH
        </span>
      );
    }
    if (priority === 'MEDIUM') {
      return (
        <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-200 rounded-full">
          MEDIUM
        </span>
      );
    }
    if (priority === 'LOW') {
      return (
        <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">
          LOW
        </span>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col items-center w-full bg-gray-100 min-h-screen mx-auto">
      <h1 className="text-3xl font-semibold mt-10">Complaint Management</h1>
      <p className="text-gray-500">Complaints From Students</p>

      <Card className="w-[1000px] mt-10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Roll No</TableHead>
              <TableHead>Room No</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {complaints.map((complaint) => (
              <TableRow key={complaint.complaintId}>
                <TableCell>{complaint.complaintId}</TableCell>
                <TableCell>{complaint.rollNo}</TableCell>
                <TableCell>{complaint.roomNo ?? '—'}</TableCell>
                <TableCell>{complaint.subject}</TableCell>

                <TableCell>
                  <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-200 rounded-full">
                    {complaint.status}
                  </span>
                </TableCell>

                <TableCell className="flex items-center gap-2">
                  {renderPriorityBadge(complaint.priority)}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedComplaint(complaint);
                      setIsDescriptionDialogOpen(true);
                    }}
                  >
                    Why?
                  </Button>
                </TableCell>

                <TableCell>{formatDate(complaint.createdAt)}</TableCell>

                <TableCell>
                  <Button
                    className="text-xs bg-green-600 hover:bg-green-500"
                    onClick={() => {
                      setSelectedComplaint(complaint);
                      setIsDescriptionDialogOpen(true);
                    }}
                  >
                    View
                  </Button>
                </TableCell>

                <TableCell>
                  <Select
                    value={actionStates[complaint.complaintId] || 'view'}
                    onValueChange={(value) =>
                      handleActionChange(complaint.complaintId, value)
                    }
                  >
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

      {/* 🔹 Resolve / Reject Dialog */}
      {selectedComplaint && actionType && (
        <Dialog open onOpenChange={resetState}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {actionType === 'resolve' ? 'Resolve' : 'Reject'} Complaint
              </DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <Textarea
                placeholder="Add mandatory comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </DialogDescription>
            <div className="flex justify-end gap-4">
              <Button onClick={resetState}>Cancel</Button>
              <Button
                disabled={!comment}
                className="bg-red-600 hover:bg-red-500"
                onClick={confirmAction}
              >
                Confirm
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* 🔹 Description + AI Explanation Dialog */}
      {selectedComplaint && isDescriptionDialogOpen && (
        <Dialog open onOpenChange={closeDescriptionDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Complaint Details</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <p className="mb-2">{selectedComplaint.description}</p>
              <p className="text-sm text-gray-600">
                <strong>Why this priority?</strong>
                <br />
                {selectedComplaint.priorityReason}
              </p>
            </DialogDescription>
            <div className="flex justify-end">
              <Button onClick={closeDescriptionDialog}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Complaints;
