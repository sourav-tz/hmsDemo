import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { Button } from "@/components/ui/button";
  import { Card } from "@/components/ui/card";
  import React, { useEffect, useState } from "react";
  import axios from "axios";
  import { Badge } from "@/components/ui/badge";
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { Input } from "@/components/ui/input";
  import { toast } from "react-toastify";
  import { Loader2 } from "lucide-react";
  import { Textarea } from "@/components/ui/textarea";
  import { Label } from "@/components/ui/label";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  
  
  const ApplicationStatus = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [editedForwardedTo, setEditedForwardedTo] = useState("");
    const [isApproving, setIsApproving] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null); // "approve" | "reject"
    const [remark, setRemark] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    
    const fetchApplications = async (status = "all") => {
      setLoading(true);
      setError(null);
  
      try {
        const response = await axios({
          method: "get",
          url: `${import.meta.env.VITE_BASE_URL}/SA/applications`,
          withCredentials: true,
          params : {
            status,
          }
        });
  
        if (response.data?.applications) {
          const sortedApplications = response.data.applications.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setApplications(sortedApplications);
        }  else {
          setError("No applications data received");
        }
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError(err.response?.data?.message || "Failed to fetch applications");
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchApplications();
    }, []);

    const handleStatusFilterChange = (value) => {
      setStatusFilter(value);
      fetchApplications(value);
    };
  
  
    const handleRefresh = () => {
      fetchApplications();
      setStatusFilter("all")
    };
  
    const openModal = (application) => {
      setSelectedApplication(application);
      setIsModalOpen(true);
      setEditedForwardedTo(application?.forwardedTo || "");
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
      setSelectedApplication(null);
      setIsApproving(false);
      setIsRejecting(false);
      setConfirmAction(null);
      setRemark("");
    };
  
    const handleApprove = async (remark = "") => {
      if (!selectedApplication) return;
      console.log("Log from handel approve")
        console.log(remark);
      setIsApproving(true);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/SA/applications/approve/${selectedApplication.applicationId}`,
          { remark },
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        fetchApplications();
        closeModal();
        toast.success("Application approved successfully");
      } catch (error) {
        console.log(error.response?.data?.error);
        toast.error(`${error.response?.data?.error || "Error while approving application"}`);
      } finally {
        setIsApproving(false);
      }
    };
  
    const handleReject = async (remark = "") => {
      if (!selectedApplication) return;
      console.log("Log from handel reject")
      console.log(remark);
  
      setIsRejecting(true);
      try {
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/SA/applications/reject/${selectedApplication.applicationId}`,
          { remark },
          { withCredentials: true }
        );
        fetchApplications();
        closeModal();
        toast.success("Application rejected successfully");
      } catch (error) {
        toast.error(error.response?.data?.message || "Error while rejecting application");
        console.error("Error rejecting application:", error);
      } finally {
        setIsRejecting(false);
      }
    };
  
    const handleForward = async () => {
      if (!selectedApplication) return;
      try {
        await axios.patch(
          `${import.meta.env.VITE_BASE_URL}/admin/applications/${selectedApplication.applicationId}`,
          { forwardedTo: editedForwardedTo },
          { withCredentials: true }
        );
        fetchApplications();
        closeModal();
      } catch (error) {
        console.error("Error forwarding application:", error);
      }
    };
  
    const getStatusBadgeClassName = (status) => {
      switch (status) {
        case "pendingAtAdmin":
          return "bg-yellow-500 text-white";
        case "pendingAtSuperAdmin":
          return "bg-purple-500 text-white";
        case "approvedByAdmin":
          return "bg-green-400 text-white";
        case "approvedBySuperAdmin":
          return "bg-green-600 text-white";
        case "rejectedByAdmin":
          return "bg-red-400 text-white";
        case "rejectedBySuperAdmin":
          return "bg-red-600 text-white";
        case "forwarded":
          return "bg-blue-500 text-white";
        default:
          return "bg-gray-200 text-gray-700";
      }
    };
  
    const getStatusBadgeText = (status) => {
      switch (status) {
        case "pendingAtAdmin":
          return "Pending at Admin";
        case "pendingAtSuperAdmin":
          return "Pending at Super Admin";
        case "approvedByAdmin":
          return "Approved by Admin";
        case "approvedBySuperAdmin":
          return "Approved by Super Admin";
        case "rejectedByAdmin":
          return "Rejected by Admin";
        case "rejectedBySuperAdmin":
          return "Rejected by Super Admin";
        case "forwarded":
          return "Forwarded";
        default:
          return status;
      }
    };
  
    const getStatusBadgeForTable = (status) => {
        const className = getStatusBadgeClassName(status);
        const text = getStatusBadgeText(status);
        
        return <Badge className={`${className} hover:${className.split(' ')[0]}`}>{text}</Badge>;
      };
  
    const formatDate = (dateString) => {
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      };
      return new Date(dateString).toLocaleString('en-US', options);
    };
  
    const getTagDisplay = (tag) => {
      return tag?.toLowerCase() === 'hostel-change' ? 'Change Hostel' : tag;
    };
  
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <p>Loading applications...</p>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={handleRefresh}>Retry</Button>
        </div>
      );
    }
  
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">My Applications</h1>
          <p className="text-gray-600">Track the status of your submitted applications</p>
        </div>
  
        <Card>
          <div className="p-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Select 
                value={statusFilter} 
                onValueChange={handleStatusFilterChange}
                >
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Applications</SelectItem>
                  <SelectItem value="pendingAtSuperAdmin">Pending at Super Admin</SelectItem>
                  <SelectItem value="approvedBySuperAdmin">Approved by Super Admin</SelectItem>
                  <SelectItem value="rejectedBySuperAdmin">Rejected by Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
              >
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 16h5v5" />
              </svg>
              Refresh
            </Button>
          </div>
  
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Date</TableHead>
                {/* <TableHead>Reason</TableHead> */}
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No applications found
                  </TableCell>
                </TableRow>
              ) : (
                applications.map((application) => (
                  <TableRow key={application.applicationId}>
                    <TableCell className="font-medium">{application.applicationId}</TableCell>
                    <TableCell>{formatDate(application.createdAt)}</TableCell>
                    {/* <TableCell>{application.title}</TableCell> */}
                    <TableCell>
                      <Badge variant="secondary">{getTagDisplay(application.tag)}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadgeForTable(application.status)}</TableCell>
                    <TableCell>
                    {application.createdByRole === "student" 
                        ? `${application.createdByRole} (Roll No - ${application.createdBy})`
                        : `${application.createdByRole} (Hostel - ${application.createdBy})`}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0 text-left justify-start"
                        onClick={() => openModal(application)}
                      >
                        View details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
  
        {/* Main Application Details Dialog */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-5xl overflow-y-auto max-h-[95vh]">
            <DialogHeader className="border-b pb-4">
              <div>
                <DialogTitle className="text-2xl font-bold">Application Details</DialogTitle>
                <DialogDescription className="text-gray-600">
                  {selectedApplication && `Submitted on ${formatDate(selectedApplication.createdAt)}`}
                </DialogDescription>
              </div>
            </DialogHeader>
  
            {selectedApplication && (
              <div className="py-4 space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Application ID</h3>
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-gray-900">{selectedApplication.applicationId}</p>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClassName(selectedApplication.status)}`}>
                          {getStatusBadgeText(selectedApplication.status)}
                        </span>
                      </div>
                    </div>
  
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Category</h3>
                      <p className="text-gray-900">{getTagDisplay(selectedApplication.tag)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Created By</h3>
                      <p className="text-gray-900">
                        {selectedApplication.createdBy || "Unknown"} ({selectedApplication.createdByRole || "Unknown"})
                      </p>
                    </div>
                  </div>
                </div>
  
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900">Title</h3>
                      <p className="text-gray-700">{selectedApplication.title || "No title"}</p>
                    </div>
  
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900">Description</h3>
                      <div className="bg-gray-50 p-4 rounded border min-h-32">
                        <p className="text-gray-700 whitespace-pre-line">
                          {selectedApplication.description || "No description provided"}
                        </p>
                      </div>
                    </div>
  
                    {selectedApplication.extraData && Object.keys(selectedApplication.extraData).length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-900">Additional Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(selectedApplication.extraData)
                            .filter(([key]) => key !== "rejected")
                            .map(([key, value]) => {
                              if (key === "rollNo" || key === "rollNos" || key === "rollNumbers" || key === "rollNumber") {
                                return (
                                  <div key={key} className="bg-gray-50 p-3 rounded border md:col-span-2">
                                    <h4 className="text-sm font-medium text-gray-500 capitalize mb-2">
                                      {key.replace(/([A-Z])/g, ' $1').trim()}
                                    </h4>
                                    {(() => {
                                      if (typeof value === 'string' && value.includes(',')) {
                                        const rollArray = value.split(',').map(item => item.trim());
                                        return (
                                          <div className="max-h-64 overflow-y-auto p-1 border rounded">
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                              {rollArray.map((rollNo, index) => (
                                                <div key={index} className="bg-white p-2 rounded border">
                                                  <p className="text-gray-900">{rollNo}</p>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        );
                                      } else if (Array.isArray(value)) {
                                        return (
                                          <div className="max-h-64 overflow-y-auto p-1 border rounded">
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                              {value.map((rollNo, index) => (
                                                <div key={index} className="bg-white p-2 rounded border">
                                                  <p className="text-gray-900">{rollNo}</p>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        );
                                      } else {
                                        return <p className="text-gray-900 mt-1">{value?.toString() || "-"}</p>;
                                      }
                                    })()}
                                  </div>
                                );
                              }
                              
                              return (
                                <div key={key} className="bg-gray-50 p-3 rounded border">
                                  <h4 className="text-sm font-medium text-gray-500 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                  </h4>
                                  <p className="text-gray-900 mt-1">{value?.toString() || "-"}</p>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    )}
                  </div>
  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900">Timeline</h3>
                      <div className="bg-gray-50 p-4 rounded border space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Created</p>
                          <p className="text-gray-700">{formatDate(selectedApplication.createdAt)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Last Updated</p>
                          <p className="text-gray-700">{formatDate(selectedApplication.updatedAt)}</p>
                        </div>
                        {selectedApplication.currentHostel && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Current Hostel</p>
                            <p className="text-gray-700">{selectedApplication.currentHostel}</p>
                          </div>
                        )}
                        
                        {selectedApplication.forwardedTo && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Forwarded by</p>
                            <p className="text-gray-700">{selectedApplication.forwardedTo}</p>
                          </div>
                        )}
                      </div>
                    </div>
  
                    <div className="space-y-4">
                      {selectedApplication.adminComment && (
                        <div className="bg-blue-50 p-4 rounded border border-blue-100">
                          <h3 className="text-sm font-medium text-blue-800 mb-1">Admin Response</h3>
                          <p className="text-gray-700">{selectedApplication.adminComment}</p>
                        </div>
                      )}
  
                      {selectedApplication.superAdminComment && (
                        <div className="bg-purple-50 p-4 rounded border border-purple-100">
                          <h3 className="text-sm font-medium text-purple-800 mb-1">Super Admin Response</h3>
                          <p className="text-gray-700">{selectedApplication.superAdminComment}</p>
                        </div>
                      )}
                      {selectedApplication.extraData?.rejected && (
                        <div className="bg-red-50 p-4 rounded border border-red-100">
                          <h3 className="text-sm font-medium text-red-800 mb-1">Rejection Reason</h3>
                          <p className="text-gray-700">{selectedApplication.extraData.rejected}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {selectedApplication?.status === "pendingAtSuperAdmin" && (
              <DialogFooter className="border-t pt-4">
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  {selectedApplication && (
                    <div className="flex-1 flex gap-3">
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => setConfirmAction("reject")}
                        className="flex-1 bg-red-600 hover:bg-red-700"
                        disabled={isApproving || isRejecting}
                      >
                        Reject
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setConfirmAction("approve")}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        disabled={isApproving || isRejecting}
                      >
                        Approve
                      </Button>
                    </div>
                  )}
                </div>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
  
        {/* Confirmation Dialog */}
        <Dialog open={!!confirmAction} onOpenChange={(open) => !open && setConfirmAction(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {confirmAction === "approve" ? "Confirm Approval" : "Confirm Rejection"}
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to {confirmAction === "approve" ? "approve" : "reject"} this application?
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="remark">
                  Remarks (Optional)
                </Label>
                <Textarea
                  id="remark"
                  placeholder="Enter any additional remarks..."
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setConfirmAction(null)}
              >
                Cancel
              </Button>
              <Button
                variant={confirmAction === "approve" ? "default" : "destructive"}
                onClick={() => {
                  if (confirmAction === "approve") {
                    handleApprove(remark);
                  } else {
                    handleReject(remark);
                  }
                }}
                disabled={isApproving || isRejecting}
              >
                {isApproving || isRejecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {confirmAction === "approve" ? "Approving..." : "Rejecting..."}
                  </>
                ) : (
                  `Confirm ${confirmAction === "approve" ? "Approval" : "Rejection"}`
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  };
  
  export default ApplicationStatus;