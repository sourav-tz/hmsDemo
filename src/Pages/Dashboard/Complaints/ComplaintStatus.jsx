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
  import { Badge } from "@/components/ui/badge"
  
  const ComplaintStatus = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedComplaintId, setExpandedComplaintId] = useState(null); // State to track the expanded complaint
  
   
    const fetchComplaints = async () => {
      let userData = localStorage.getItem('persist:root'); // Retrieve user data from local storage
      const rollNo = JSON.parse(JSON.parse(userData).userStorage).data.rollNo;
  
      setLoading(true); 
  
      try {
        const response = await axios({
          method: 'post',
          url: import.meta.env.VITE_BASE_URL + '/student/getComplaints',
          data: { rollNo },
          withCredentials: true,
        });
  
       
        console.log(response.data);
  
        
        if (response.data.result && Array.isArray(response.data.result)) {
          setComplaints(response.data.result); 
        } else {
          setError("Unexpected response format.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch complaints. Please try again later.");
      } finally {
        setLoading(false); 
      }
    };
  
  
    useEffect(() => {
      fetchComplaints();
    }, []);
  
    
    const handleRefresh = () => {
      fetchComplaints();
    };
  
    
    const toggleDescription = (complaintId) => {
      setExpandedComplaintId(expandedComplaintId === complaintId ? null : complaintId);
    };
  
    if (loading) {
      return <p className='text-center mt-10'>Loading complaints...</p>;
    }
  
    
    if (error) {
      return <p className='text-center mt-10 text-red-500'>{error}</p>;
    }
  
    return (
      <div className='flex flex-col items-center w-full bg-gray-100 min-h-screen mx-auto'>
        <h1 className='text-3xl font-semibold mt-10'>Complaint Status</h1>
        <p className='text-gray-500 mb-4'>Check the status of your complaints</p>
  
        <Button className="mb-4 bg-blue-700 hover:bg-blue-500" onClick={handleRefresh}>
          Refresh Complaints
        </Button>
  
        <Card className="w-[900px] mt-10">
          <Table>
            <TableCaption>A list of your recent complaints and their statuses.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Complaint ID</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complaints.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No complaints found.
                  </TableCell>
                </TableRow>
              ) : (
                complaints.map((complaint) => (
                  <React.Fragment key={complaint.complaintId}>
                    <TableRow>
                      <TableCell className="font-medium">{complaint.complaintId}</TableCell>
                      <TableCell>{complaint.subject}</TableCell>
                      <TableCell>
                      {complaint.status === "pending" ? (
                        <Badge
                          className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                          variant="outline"
                        >
                          In Progress
                        </Badge>
                      ) : complaint.status === "resolved" ? (
                        <Badge
                          className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                          variant="outline"
                        >
                          Resolved
                        </Badge>
                      ) : complaint.status === "rejected" ? (
                        <Badge
                          className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                          variant="outline"
                        >
                          Rejected
                        </Badge>
                      ) : (
                        complaint.status // Display the status as text for other statuses
                      )}
                    </TableCell>
                      <TableCell className="text-left">
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          className="bg-blue-700 hover:bg-blue-500"
                          onClick={() => toggleDescription(complaint.complaintId)} 
                        >
                          {expandedComplaintId === complaint.complaintId ? 'Hide' : 'View'}
                        </Button>
                      </TableCell>
                    </TableRow>
  
                    {expandedComplaintId === complaint.complaintId && (
                      <TableRow>
                        <TableCell colSpan={5} className="bg-gray-100 p-4">
                          <p><strong>Description:</strong> {complaint.description}</p>
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
  
  export default ComplaintStatus;
  