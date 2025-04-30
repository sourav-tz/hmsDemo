import {
  Table,
  TableBody,
  TableCaption,
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
  const [expandedApplicationId, setExpandedApplicationId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isEditingHostel, setIsEditingHostel] = useState(false);
  

  const fetchApplications = async (status = "all") => {
    const userData = localStorage.getItem("persist:root");
    const rollNo = JSON.parse(JSON.parse(userData).userStorage).data.rollNo;

    setLoading(true);
    setError(null);

    try {
      const response = await axios({
        method: "get",
        url: import.meta.env.VITE_BASE_URL + "/student/applications",
        params: { rollNo , status },
        withCredentials: true,
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

  const handleRefresh = () => {
    fetchApplications();
    setStatusFilter("all")
  };

  const toggleDescription = (applicationId) => {
    setExpandedApplicationId(expandedApplicationId === applicationId ? null : applicationId);
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
  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    fetchApplications(value);
  };
  const getTagDisplay = (tag) => {
    return tag.toLowerCase() === 'hostel-change' ? 'Change Hostel' : tag;
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
                        <SelectItem value="pendingAtAdmin">Pending at Admin</SelectItem>
                        <SelectItem value="pendingAtSuperAdmin">Pending at Super Admin</SelectItem>
                        <SelectItem value="approvedByAdmin">Approved by Admin</SelectItem>
                        <SelectItem value="approvedBySuperAdmin">Approved by Super Admin</SelectItem>
                        <SelectItem value="rejectedByAdmin">Rejected by Admin</SelectItem>
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
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No applications found
                </TableCell>
              </TableRow>
            ) : (
              applications.map((application) => (
                <React.Fragment key={application.applicationId}>
                  <TableRow>
                    <TableCell className="font-medium">{application.applicationId}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                      {formatDate(application.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{getTagDisplay(application.tag)}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadgeForTable(application.status)}</TableCell>
                    <TableCell className="text-right">
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-left justify-start"
                          onClick={() => toggleDescription(application.applicationId)}
                        >
                          {expandedApplicationId === application.applicationId ? 
                            "Hide details" : "View details"}
                        </Button>
                    </TableCell>
                  </TableRow>
                  {expandedApplicationId === application.applicationId && (
                    <TableRow>
                      <TableCell colSpan={5} className="bg-gray-50 p-4">
                        <div className="grid gap-4">
                        <div>
                            <h3 className="font-medium mb-2">Subject</h3>
                            <p className="text-gray-700">{application.title}</p>
                          </div>
                          <div>
                            <h3 className="font-medium mb-2">Description</h3>
                            <p className="text-gray-700">{application.description}</p>
                          </div>
                          
                          {application.extraData && (
                            <div>
                              <h3 className="font-medium mb-2">Additional Details</h3>
                              <div className="grid grid-cols-2 gap-4">
                                {Object.entries(application.extraData).map(([key, value]) => (
                                  <div key={key}>
                                    <p className="text-sm text-gray-500 capitalize">{key}</p>
                                    <p className="font-medium">{value}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {application.adminComment && (
                              <div>
                                <h3 className="font-medium mb-2">Admin Response</h3>
                                <p className="text-gray-700">{application.adminComment}</p>
                              </div>
                            )}
                            {application.superAdminComment && (
                              <div>
                                <h3 className="font-medium mb-2">Super Admin Response</h3>
                                <p className="text-gray-700">{application.superAdminComment}</p>
                              </div>
                            )}
                          </div>

                          <div className="text-sm text-gray-500">
                          Last updated: {formatDate(application.updatedAt)}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default ApplicationStatus;