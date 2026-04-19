import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ReactPaginate from 'react-paginate'
import '../../../../MainStyles/Pagination.css'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

function StudentVerifyProfile() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [rejectionReason, setRejectionReason] = useState('')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showRejectionDialog, setShowRejectionDialog] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage] = useState(5)

  // Fetch pending profiles
  useEffect(() => {
    const fetchPendingProfiles = async () => {
      try {
        setLoading(true)
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/HA/pendingProfiles`,
          { withCredentials: true }
        )

        if (response.data.success) {
          setStudents(response.data.profiles)
        } else {
          toast.error(response.data.error || 'Failed to fetch pending profiles')
        }
      } catch (error) {
        console.error('Error fetching pending profiles:', error)
        toast.error('Failed to fetch pending profiles. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchPendingProfiles()
  }, [])

  // Calculate page count
  const pageCount = Math.ceil(students.length / itemsPerPage)

  // Get current items
  const currentItems = students.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  )

  // Handle page change
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected)
  }

  // Handle approval
  const handleApprove = async (student) => {
    try {
      setSelectedStudent(student)
      setActionLoading(true)

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/HA/approveProfile`,
        { email: student.email },
        { withCredentials: true }
      )

      if (response.data.success) {
        // Remove the approved student from the list
        const updatedStudents = students.filter(s => s.email !== student.email)
        setStudents(updatedStudents)

        toast.success(`${student.firstName} ${student.lastName || ''}'s profile has been approved`)
      } else {
        toast.error(response.data.error || 'Failed to approve profile')
      }
    } catch (error) {
      console.error('Error approving profile:', error)

      // Check for specific error types
      if (error.response?.status === 409) {
        // Conflict error - likely duplicate roll number
        const errorMessage = error.response.data.error || 'Duplicate roll number detected'
        toast.error(errorMessage)

        // If it's a duplicate roll number, suggest rejecting the profile
        if (errorMessage.includes('roll number')) {
          // Set rejection reason to include duplicate roll number information
          setRejectionReason(`Your roll number (${student.rollNo}) already exists in our system. Please check if you entered it correctly and resubmit your profile.`)
          // Open the rejection dialog
          openRejectionDialog(student)
        }
      } else if (error.response?.status === 400) {
        // Bad request - likely course mapping error
        const errorMessage = error.response.data.error || 'Failed to approve profile'
        toast.error(errorMessage)

        // If it's a course mapping error, suggest rejecting the profile
        if (errorMessage.includes('No matching course found')) {
          // Set rejection reason to include course mapping information
          setRejectionReason(`We couldn't find a matching course for "${student.course} - ${student.branch}" in our system. Please check your course and branch information and resubmit your profile.`)
          // Open the rejection dialog
          openRejectionDialog(student)
        }
      } else {
        toast.error('Failed to approve profile. Please try again.')
      }
    } finally {
      setActionLoading(false)
      setSelectedStudent(null)
    }
  }

  // Open rejection dialog
  const openRejectionDialog = (student) => {
    setSelectedStudent(student)
    setRejectionReason('')
    setShowRejectionDialog(true)
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Handle rejection
  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection')
      return
    }

    try {
      setActionLoading(true)

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/HA/rejectProfile`,
        {
          email: selectedStudent.email,
          rejectionReason: rejectionReason.trim()
        },
        { withCredentials: true }
      )

      if (response.data.success) {
        // Remove the rejected student from the list
        const updatedStudents = students.filter(s => s.email !== selectedStudent.email)
        setStudents(updatedStudents)

        toast.success(`${selectedStudent.firstName} ${selectedStudent.lastName || ''}'s profile has been rejected`)
        setShowRejectionDialog(false)
      } else {
        toast.error(response.data.error || 'Failed to reject profile')
      }
    } catch (error) {
      console.error('Error rejecting profile:', error)
      toast.error('Failed to reject profile. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className='flex flex-col items-center w-full bg-gray-100 min-h-screen mx-auto'>
      <ToastContainer />
      <h1 className='text-3xl font-semibold mt-10 max-md:mt-24'>Verify Student Profiles</h1>

      {/* Student List */}
      <Card className="w-4/5 mt-10">
        <CardHeader>
          <CardTitle className="text-xl">Pending Student Verifications</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-purple-700" />
              <span className="ml-2">Loading profiles...</span>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-medium text-center">Roll No</TableHead>
                    <TableHead className="text-center">Name</TableHead>
                    <TableHead className="text-center">Email</TableHead>
                    <TableHead className="text-center">Course</TableHead>
                    <TableHead className="text-center">Semester</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.length > 0 ? (
                    currentItems.map((student) => (
                      <TableRow key={student.rollNo}>
                        <TableCell className="text-center">{student.rollNo}</TableCell>
                        <TableCell className="text-center">{`${student.firstName} ${student.lastName || ''}`}</TableCell>
                        <TableCell className="text-center">{student.email}</TableCell>
                        <TableCell className="text-center">{student.course}</TableCell>
                        <TableCell className="text-center">{student.semester}</TableCell>
                        <TableCell className="text-center">
                          <Dialog>
                            <DialogTrigger>
                              <Button className="bg-purple-700 hover:bg-purple-500">View Details</Button>
                            </DialogTrigger>
                            <DialogContent className="min-w-fit max-w-4xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="text-xl">{`Student ID: ${student.rollNo} - ${student.firstName} ${student.lastName || ''}`}</DialogTitle>
                              </DialogHeader>

                              <div className="grid gap-8 p-6">
                                {/* Student Photo and Documents */}
                                <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-4">
                                  {/* Profile Photo */}
                                  <div className="flex flex-col items-center">
                                    <h3 className="text-sm font-medium text-gray-500 mb-2">Profile Photo</h3>
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-purple-500">
                                      <img
                                        src={student.photoLink}
                                        alt={`${student.firstName} ${student.lastName || ''}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          e.target.src = "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";
                                        }}
                                        
                                      />
                                      
                                    </div>
                                    <a
                    href={student.photoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    View uploaded photo
                  </a>
                                  </div>

                                  {/* Aadhar Card Document */}
                                  {student.aadharCardDocument && (
                                    <div className="flex flex-col items-center">
                                      <h3 className="text-sm font-medium text-gray-500 mb-2">Aadhar Card</h3>
                                      <div className="w-48 h-32 overflow-hidden border-2 border-purple-500 rounded-md">
                                        <img
                                          src={student.aadharCardDocument}
                                          alt="Aadhar Card"
                                          className="w-full h-full object-contain"
                                          onError={(e) => {
                                            e.target.src = "https://banner2.cleanpng.com/20180618/oti/kisspng-public-domain-encapsulated-postscript-clip-art-mime-5b278bfc564795.1619805915293183963534.jpg";
                                          }}
                                        />
                                        
                                      </div>
                                      <a
                    href={student.aadharCardDocument}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    View uploaded document
                  </a>
                                    </div>
                                  )}
                                </div>

                                {/* Basic Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-4">
                                    <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
                                    <div className="grid grid-cols-2 gap-y-2">
                                      <Label className="text-gray-600">Roll Number:</Label>
                                      <div>{student.rollNo}</div>

                                      <Label className="text-gray-600">Name:</Label>
                                      <div>{`${student.firstName} ${student.lastName || ''}`}</div>

                                      <Label className="text-gray-600">Email:</Label>
                                      <div>{student.email}</div>

                                      <Label className="text-gray-600">Course:</Label>
                                      <div>{student.course}</div>

                                      <Label className="text-gray-600">Branch:</Label>
                                      <div>{student.branch}</div>

                                      <Label className="text-gray-600">Specialization:</Label>
                                      <div>{student.specialization}</div>

                                      <Label className="text-gray-600">Semester:</Label>
                                      <div>{student.semester}</div>

                                      <Label className="text-gray-600">Date of Birth:</Label>
                                      <div>{formatDate(student.dob)}</div>
                                    </div>
                                  </div>

                                  <div className="space-y-4">
                                    <h3 className="text-lg font-semibold border-b pb-2">Contact & Personal Details</h3>
                                    <div className="grid grid-cols-2 gap-y-2">
                                      <Label className="text-gray-600">Gender:</Label>
                                      <div>{student.gender}</div>

                                      <Label className="text-gray-600">Blood Group:</Label>
                                      <div>{student.bloodGroup}</div>

                                      <Label className="text-gray-600">Contact Number 1:</Label>
                                      <div>{student.contactNumber_1}</div>

                                      <Label className="text-gray-600">Contact Number 2:</Label>
                                      <div>{student.contactNumber_2 || 'N/A'}</div>

                                      <Label className="text-gray-600">Phone Number:</Label>
                                      <div>{student.phoneNumber || 'N/A'}</div>

                                      <Label className="text-gray-600">Identification Mark:</Label>
                                      <div>{student.identificationMark || 'N/A'}</div>

                                      <Label className="text-gray-600">Aadhar Number:</Label>
                                      <div>{student.addharNumber}</div>
                                    </div>
                                  </div>
                                </div>

                                {/* Family Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-4">
                                    <h3 className="text-lg font-semibold border-b pb-2">Father&apos;s Information</h3>
                                    <div className="grid grid-cols-2 gap-y-2">
                                      <Label className="text-gray-600">Name:</Label>
                                      <div>{student.fatherName}</div>

                                      <Label className="text-gray-600">Contact:</Label>
                                      <div>{student.fatherContact}</div>

                                      <Label className="text-gray-600">Occupation:</Label>
                                      <div>{student.fatherOccupation || 'N/A'}</div>
                                    </div>
                                  </div>

                                  <div className="space-y-4">
                                    <h3 className="text-lg font-semibold border-b pb-2">Mother&apos;s Information</h3>
                                    <div className="grid grid-cols-2 gap-y-2">
                                      <Label className="text-gray-600">Name:</Label>
                                      <div>{student.motherName}</div>

                                      <Label className="text-gray-600">Contact:</Label>
                                      <div>{student.motherContact}</div>

                                      <Label className="text-gray-600">Occupation:</Label>
                                      <div>{student.motherOccupation || 'N/A'}</div>
                                    </div>
                                  </div>
                                </div>

                                {/* Address Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-4">
                                    <h3 className="text-lg font-semibold border-b pb-2">Permanent Address</h3>
                                    <div className="grid grid-cols-2 gap-y-2">
                                      <Label className="text-gray-600">Address:</Label>
                                      <div>{student.address}</div>

                                      <Label className="text-gray-600">City:</Label>
                                      <div>{student.city}</div>

                                      <Label className="text-gray-600">State:</Label>
                                      <div>{student.state}</div>

                                      <Label className="text-gray-600">Pin Code:</Label>
                                      <div>{student.pinCode}</div>
                                    </div>
                                  </div>

                                  <div className="space-y-4">
                                    <h3 className="text-lg font-semibold border-b pb-2">Local Guardian Details</h3>
                                    <div className="grid grid-cols-2 gap-y-2">
                                      <Label className="text-gray-600">Name:</Label>
                                      <div>{student.localGuardian || 'N/A'}</div>

                                      <Label className="text-gray-600">Contact:</Label>
                                      <div>{student.localGuardianContact || 'N/A'}</div>

                                      <Label className="text-gray-600">Address:</Label>
                                      <div>{student.localGuardianAddress || 'N/A'}</div>
                                    </div>
                                  </div>
                                </div>

                                {/* Verification Actions */}
                                <div className="border-t pt-4 mt-4">
                                  <h3 className="text-lg font-semibold mb-4">Verification Actions</h3>
                                  <div className="flex flex-col md:flex-row gap-4 justify-center">
                                    <Button
                                      className="bg-green-600 hover:bg-green-500 px-8 py-2"
                                      onClick={() => handleApprove(student)}
                                      disabled={actionLoading && selectedStudent?.email === student.email}
                                    >
                                      {actionLoading && selectedStudent?.email === student.email ? (
                                        <>
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                          Approving...
                                        </>
                                      ) : (
                                        "Approve Profile"
                                      )}
                                    </Button>
                                    <Button
                                      className="bg-red-600 hover:bg-red-500 px-8 py-2"
                                      onClick={() => openRejectionDialog(student)}
                                      disabled={actionLoading && selectedStudent?.email === student.email}
                                    >
                                      Reject Profile
                                    </Button>
                                  </div>
                                  <div className="mt-4 text-center">
                                    <p className="text-sm text-gray-500">Approving this profile will allow the student to access the hostel management system.</p>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No pending student profiles to verify
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {students.length > itemsPerPage && (
                <div className="flex justify-center mt-4">
                  <ReactPaginate
                    previousLabel={"Previous"}
                    nextLabel={"Next"}
                    pageCount={pageCount}
                    onPageChange={handlePageChange}
                    containerClassName={"pagination"}
                    previousLinkClassName={"pagination__link"}
                    nextLinkClassName={"pagination__link"}
                    disabledClassName={"pagination__link--disabled"}
                    activeClassName={"pagination__link--active"}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Rejection Dialog */}
      {selectedStudent && (
        <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Student Profile</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting {selectedStudent.firstName} {selectedStudent.lastName || ''}&apos;s profile.
                This will be sent to the student.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="rejectionReason" className="mb-2 block">Reason for Rejection</Label>
              <Textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide specific details about what needs to be corrected..."
                className="min-h-[100px]"
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowRejectionDialog(false)}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-500"
                onClick={handleReject}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  "Reject Profile"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default StudentVerifyProfile