import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PopoverTrigger, PopoverContent, Popover } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useSelector } from "react-redux";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, XCircle, Loader2, CalendarDays as CalendarDaysIcon } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { format } from "date-fns";
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import FileUpload from "@/components/FileUpload/FileUpload";

// Helper function for displaying toasts to prevent duplicates
const toastTimers = {};
function showToast(message, type = 'error') {
  const key = `${message}_${type}`;
  if (toastTimers[key]) {
    clearTimeout(toastTimers[key].timer);
    if (toast.isActive(toastTimers[key].id)) {
      return;
    }
  }
  let id;
  if (type === 'error') {
    id = toast.error(message, { autoClose: 5000 });
  } else if (type === 'success') {
    id = toast.success(message, { autoClose: 3000 });
  } else {
    id = toast.info(message, { autoClose: 3000 });
  }
  toastTimers[key] = {
    id,
    timer: setTimeout(() => {
      delete toastTimers[key];
    }, 6000),
  };
}

export default function StudentSelfProfiling() {
  const userData = useSelector(state => state.userStorage.data);
  const [isTempStudent, setIsTempStudent] = useState(false);
  const [status, setStatus] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [date, setDate] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const Navigator = useNavigate();
  const [formProgress, setFormProgress] = useState(0);

  const getDefaultFormData = () => ({
    rollNo: "",
    firstName: "",
    lastName: "",
    dob: "",
    course: "",
    semester: "1",
    branch: "",
    specialization: "",
    contactNumber_1: "",
    contactNumber_2: "",
    phoneNumber: "",
    email: "",
    identificationMark: "",
    bloodGroup: "",
    gender: "",
    fatherName: "",
    fatherContact: "",
    fatherOccupation: "",
    motherName: "",
    motherContact: "",
    motherOccupation: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    localGuardian: "",
    localGuardianContact: "",
    localGuardianAddress: "",
    addharNumber: "",
    aadharCardDocument: "",
    photoLink: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrxb9rKS0KgjTtqrKPK8dodc0pEeaoC-pY_w&s"
  });

  const [formData, setFormData] = useState(getDefaultFormData());
  const [allCourseDetails, setAllCourseDetails] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [availableBranches, setAvailableBranches] = useState([]);
  const [availableSpecializations, setAvailableSpecializations] = useState([]);
  const [errors, setErrors] = useState({});
  const rollNumberCheckTimeout = useRef(null);

  const calculateFormProgress = useCallback((data) => {
    const requiredFields = [
      'rollNo', 'firstName', 'dob', 'course', 'semester', 'branch',
      'contactNumber_1', 'email', 'gender', 'bloodGroup', 'fatherName',
      'fatherContact', 'motherName', 'motherContact', 'address', 'city',
      'state', 'pinCode', 'addharNumber', 'aadharCardDocument', 'photoLink'
    ];
    let filledFields = requiredFields.filter(field => data[field] && data[field].toString().trim() !== '' && data[field] !== 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrxb9rKS0KgjTtqrKPK8dodc0pEeaoC-pY_w&s').length;
    
    // Dynamically add specialization to progress calculation if it's required
    if (availableSpecializations.length > 0) {
        requiredFields.push('specialization');
        if (data.specialization && data.specialization.trim() !== '') {
            filledFields++;
        }
    }

    return Math.round((filledFields / requiredFields.length) * 100);
  }, [availableSpecializations]);

  const updateFormData = useCallback((newData) => {
    setFormData(prevData => {
      const updatedData = { ...prevData, ...newData };
      if (status !== 'profile_submitted' && status !== 'approved') {
        setFormProgress(calculateFormProgress(updatedData));
      }
      return updatedData;
    });
  }, [status, calculateFormProgress]);
  
  const checkRollNumber = useCallback(async (rollNo) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/student/checkRollNumber/${rollNo}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error('Error checking roll number:', error);
      return { success: false, exists: false };
    }
  }, []);

  const validateField = useCallback((id, value) => {
    let error = null;
    const isRequired = [
      'rollNo', 'firstName', 'dob', 'course', 'semester', 'branch',
      'contactNumber_1', 'email', 'gender', 'bloodGroup', 'fatherName',
      'fatherContact', 'motherName', 'motherContact',
      'address', 'city', 'state', 'pinCode',
      'addharNumber', 'aadharCardDocument', 'photoLink'
    ].includes(id);

    const strValue = String(value || '').trim();
    if (!strValue && !isRequired) return null;

    switch (id) {
      case 'rollNo':
        if (!/^\d+$/.test(strValue)) error = "Roll number must contain only digits";
        break;
      case 'firstName':
      case 'lastName':
      case 'fatherName':
      case 'motherName':
      case 'localGuardian':
        if (strValue && !/^[A-Za-z\s.]+$/.test(strValue)) error = "Name can only contain letters, spaces, and periods.";
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(strValue)) error = "Invalid email format.";
        break;
      case 'contactNumber_1':
      case 'fatherContact':
      case 'motherContact':
      case 'contactNumber_2':
      case 'phoneNumber':
      case 'localGuardianContact':
        if (strValue) {
          if (!/^\d*$/.test(strValue)) {
            error = "Contact number must contain only digits.";
          } else if (!/^[6-9]\d{9}$/.test(strValue)) {
            error = "Contact number must be 10 digits and start with 6, 7, 8, or 9.";
          }
        }
        break;
      case 'pinCode':
        if (strValue) {
          if (!/^\d*$/.test(strValue)) {
            error = "Pin code must contain only digits.";
          } else if (strValue.length !== 6) {
            error = "Pin code must be exactly 6 digits.";
          }
        }
        break;
      case 'addharNumber':
        if (strValue) {
          if (!/^\d*$/.test(strValue)) {
            error = "Aadhaar number must contain only digits.";
          } else if (strValue.length !== 12) {
            error = "Aadhaar number must be exactly 12 digits.";
          }
        }
        break;
      default:
        break;
    }
    return error;
  }, []);

  const handleChange = useCallback((e) => {
    if (status === 'profile_submitted' || status === 'approved') return;
    const { id, value } = e.target;
    updateFormData({ [id]: value });
    const fieldError = validateField(id, value);
    setErrors(prev => ({ ...prev, [id]: fieldError }));

    if (id === 'rollNo' && value.length >= 5 && /^\d+$/.test(value)) {
      clearTimeout(rollNumberCheckTimeout.current);
      rollNumberCheckTimeout.current = setTimeout(async () => {
        const result = await checkRollNumber(value);
        if (result.success && result.exists) {
          setErrors(prev => ({ ...prev, rollNo: 'This roll number already exists.' }));
        }
      }, 500);
    }
  }, [status, updateFormData, validateField, checkRollNumber]);

  const handleSelectChange = useCallback((value, id) => {
    if (status === 'profile_submitted' || status === 'approved') return;
    const newFormData = { [id]: value };
    if (id === 'course') {
      newFormData.branch = "";
      newFormData.specialization = "";
    }
    if (id === 'branch') {
      newFormData.specialization = "";
    }
    updateFormData(newFormData);
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: null }));
    }
  }, [status, updateFormData, errors]);

  const handleDateChange = useCallback((newDate) => {
    if (status === 'profile_submitted' || status === 'approved') return;
    setDate(newDate);
    updateFormData({ dob: newDate ? format(newDate, 'yyyy-MM-dd') : '' });
    if (errors.dob) {
      setErrors(prev => ({ ...prev, dob: null }));
    }
  }, [status, updateFormData, errors]);

  const fetchAvailableCourses = useCallback(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/student/getAvailableCourses`, { withCredentials: true });
      if (response.data.success && Array.isArray(response.data.courses)) {
        setAllCourseDetails(response.data.courses);
        const uniqueCourses = [...new Set(response.data.courses.map(c => c.courseName))].map(course => ({ value: course, label: course }));
        setAvailableCourses(uniqueCourses);
      } else {
        showToast("Could not load course information.", "error");
      }
    } catch (error) {
      console.error("CRITICAL error while fetching available courses:", error);
      showToast("A network error occurred while loading course data.", "error");
    }
  }, []);
  
  const fetchProfileData = useCallback(async () => {
    const userEmail = userData?.email || localStorage.getItem('email');
    const userRole = userData?.roleType || localStorage.getItem('role');
    if (!userEmail || !userRole) {
      toast.error("User information is missing. Please log in again.");
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/student/getProfile`, { params: { tokenEmail: userEmail, TokenRole: userRole }, withCredentials: true });
      if (response.data.success) {
        const apiStatus = response.data.status || 'pending';
        setStatus(apiStatus);
        if (apiStatus === 'rejected' && response.data.rejectionReason) {
          setRejectionReason(response.data.rejectionReason);
        }
        if (response.data.exists) {
          const profile = response.data.profile;
          if (profile.dob) 
            setDate(new Date(profile.dob));
          // Use a function to merge to ensure all default keys are present
          setFormData(prev => ({ ...getDefaultFormData(), ...profile }));
        } else {
          setFormData({ ...getDefaultFormData(), email: userEmail });
        }
      } else {
        showToast(response.data.message || "Failed to load profile data", "error");
      }
    } catch (apiError) {
      console.error("Error fetching profile data:", apiError);
      if (apiError.response?.status === 404) {
        showToast("Please complete your profile information", "info");
        setFormData({ ...getDefaultFormData(), email: userEmail });
      } else {
        showToast("Failed to load profile data.", "error");
      }
    }
  }, [userData]);
  
  useEffect(() => {
    if (formData.course && allCourseDetails.length > 0) {
      const branches = allCourseDetails.filter(d => d.courseName === formData.course).map(d => d.department);
      setAvailableBranches([...new Set(branches)].map(b => ({ value: b, label: b })));
    } else {
      setAvailableBranches([]);
    }
  }, [formData.course, allCourseDetails]);

  useEffect(() => {
    if (formData.course && formData.branch && allCourseDetails.length > 0) {
      const specs = allCourseDetails.filter(d => d.courseName === formData.course && d.department === formData.branch).map(d => d.specialization).filter(s => s && s !== 'NA');
      setAvailableSpecializations([...new Set(specs)].map(s => ({ value: s, label: s })));
    } else {
      setAvailableSpecializations([]);
    }
  }, [formData.course, formData.branch, allCourseDetails]);

  const handleSubmit = useCallback(async (e) => 
  {
    e.preventDefault();
    const newErrors = {};
    const requiredFields = {
      rollNo: "Roll Number", firstName: "First Name", dob: "Date of Birth", course: "Course", branch: "Branch",
      contactNumber_1: "Contact Number", gender: "Gender", bloodGroup: "Blood Group", fatherName: "Father's Name",
      fatherContact: "Father's Contact", motherName: "Mother's Name", motherContact: "Mother's Contact",
      address: "Address", city: "City", state: "State", pinCode: "Pin Code", email: "Email",
      photoLink: "Profile Photo", aadharCardDocument: "Aadhar Card Document", addharNumber: "Aadhaar Number"
    };

    Object.entries(requiredFields).forEach(([field, label]) => {
      if (!formData[field] || formData[field] === "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrxb9rKS0KgjTtqrKPK8dodc0pEeaoC-pY_w&s") {
        newErrors[field] = `${label} is required.`;
      }
    });

    if (availableSpecializations.length > 0 && !formData.specialization) {
      newErrors.specialization = "Specialization is required.";
    }
    
    // Comprehensive validation for all filled fields
    Object.keys(formData).forEach(field => {
        if(formData[field]) {
            const fieldError = validateField(field, formData[field]);
            if(fieldError) newErrors[field] = fieldError;
        }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast("Please fill all required fields and correct the errors.", "error");
      return;
    }
    
    setSubmitting(true);
    try {
      const submissionData = { ...formData, rollNo: parseInt(formData.rollNo, 10), semester: 1, tokenEmail: formData.email, TokenRole: isTempStudent ? 'TempStudent' : 'Student' };
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/student/studentSelfProfiling`, submissionData, { withCredentials: true });
      if (response.data.success) {
        showToast("Profile submitted successfully", "success");
        setStatus('profile_submitted');
        if (status === 'rejected') setRejectionReason('');
      } else {
        showToast(response.data.message || "Failed to submit profile", "error");
      }
    } catch (error) {
      console.error("Error submitting profile:", error);
      showToast(error.response?.data?.message || "Failed to submit profile. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  }, [formData, isTempStudent, availableSpecializations, validateField, status]);
  
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      const userRole = userData?.roleType || localStorage.getItem('role');
      if (userRole === 'Student') {
        Navigator('/studentDashboard/main/home');
        return;
      }
      await fetchAvailableCourses();
      if (userRole === 'TempStudent') {
        setIsTempStudent(true);
        await fetchProfileData();
      } else {
        const userEmail = userData?.email || localStorage.getItem('email');
        if (userEmail) updateFormData({ email: userEmail });
      }
      setLoading(false);
    };
    loadInitialData();
  }, []); // Run only once on mount

  const handleClear = () => {
    if (status === 'profile_submitted' || status === 'approved') return;
    const userEmail = formData.email;
    setFormData({ ...getDefaultFormData(), email: userEmail });
    setDate(null);
    setErrors({});
    setFormProgress(calculateFormProgress({ ...getDefaultFormData(), email: userEmail }));
    showToast("Form data cleared", "success");
  };

  const isReadOnly = status === 'profile_submitted' || status === 'approved';
  const readOnlyClass = isReadOnly ? "bg-gray-100 cursor-not-allowed" : "";

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading Profile...</span>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-8 py-8 px-4 md:px-6 lg:px-8" onSubmit={handleSubmit}>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      
      {isTempStudent && (
        <Alert className={`mb-4 ${
          status === 'approved' ? 'bg-green-50 border-green-200 text-green-800' :
          status === 'rejected' ? 'bg-red-50 border-red-200 text-red-800' :
          status === 'profile_submitted' ? 'bg-blue-50 border-blue-200 text-blue-800' :
          'bg-yellow-50 border-yellow-200 text-yellow-800'
        }`}>
          { status === 'approved' ? <CheckCircle2 className="h-5 w-5 text-green-600" /> :
            status === 'rejected' ? <XCircle className="h-5 w-5 text-red-600" /> :
            status === 'profile_submitted' ? <CheckCircle2 className="h-5 w-5 text-blue-600" /> :
            <AlertCircle className="h-5 w-5 text-yellow-600" />
          }
          <AlertTitle className="font-medium">
            { status === 'approved' ? 'Profile Approved' :
              status === 'rejected' ? 'Profile Rejected' :
              status === 'profile_submitted' ? 'Profile Submitted' :
              'Action Required'
            }
          </AlertTitle>
          <AlertDescription>
            { status === 'approved' ? 'Your profile has been approved. You now have full access.' :
              status === 'rejected' ? (
                <div>
                  <p>Your profile was rejected. Please update your information and resubmit.</p>
                  {rejectionReason && (
                    <div className="mt-2 p-2 bg-red-100 rounded-md">
                      <p className="font-semibold">Reason for rejection:</p>
                      <p>{rejectionReason}</p>
                    </div>
                  )}
                </div>
              ) :
              status === 'profile_submitted' ? 'Your profile is under review. You will be notified of any updates.' :
              'Please complete your profile information below and submit for verification.'
            }
          </AlertDescription>
        </Alert>
      )}

      <div className="text-center w-full max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold">Student Self Profiling</h1>
        {status !== 'profile_submitted' && status !== 'approved' && (
          <div className="mt-4 mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span>Form Completion</span>
              <span>{formProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  formProgress < 30 ? 'bg-red-500' :
                  formProgress < 70 ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${formProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
      <div className="bg-blue-50 p-3 rounded-md border border-blue-200 mb-4">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Note:</span> Fields marked with <span className="text-red-500">*</span> are required.
          </p>
        </div>
      <div className="grid gap-8 rounded-md border border-gray-200 bg-white p-6 shadow-sm">
        <center>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          
          {/* Personal Details */}
          <div className="space-y-1">
            <Label htmlFor="rollNo">Roll Number <span className="text-red-500">*</span></Label>
            <Input id="rollNo" required type="text" value={formData.rollNo} onChange={handleChange} className={`${errors.rollNo ? "border-red-500" : ""} ${readOnlyClass}`} disabled={isReadOnly} />
            {errors.rollNo && <p className="text-red-500 text-xs">{errors.rollNo}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
            <Input id="firstName" required type="text" value={formData.firstName} onChange={handleChange} className={`${errors.firstName ? "border-red-500" : ""} ${readOnlyClass}`} disabled={isReadOnly} />
            {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" type="text" value={formData.lastName} onChange={handleChange} className={`${errors.lastName ? "border-red-500" : ""} ${readOnlyClass}`} disabled={isReadOnly} />
            {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="dob">Date of Birth <span className="text-red-500">*</span></Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={`w-full justify-start pl-3 text-left font-normal ${!date && "text-muted-foreground"} ${errors.dob ? "border-red-500" : ""} ${readOnlyClass}`} disabled={isReadOnly}>
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                  <CalendarDaysIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={handleDateChange} fromYear={1950} toYear={new Date().getFullYear()} captionLayout="dropdown" disabled={(d) => d > new Date() || d < new Date("1950-01-01")} />
              </PopoverContent>
            </Popover>
            {errors.dob && <p className="text-red-500 text-xs">{errors.dob}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="gender">Gender <span className="text-red-500">*</span></Label>
            <Select value={formData.gender} onValueChange={(value) => handleSelectChange(value, 'gender')} required disabled={isReadOnly}>
              <SelectTrigger className={`${errors.gender ? "border-red-500" : ""} ${readOnlyClass}`}><SelectValue placeholder="Select gender" /></SelectTrigger>
              <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent>
            </Select>
            {errors.gender && <p className="text-red-500 text-xs">{errors.gender}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="bloodGroup">Blood Group <span className="text-red-500">*</span></Label>
            <Select value={formData.bloodGroup} onValueChange={(value) => handleSelectChange(value, 'bloodGroup')} required disabled={isReadOnly}>
                <SelectTrigger className={`${errors.bloodGroup ? "border-red-500" : ""} ${readOnlyClass}`}><SelectValue placeholder="Select blood group" /></SelectTrigger>
                <SelectContent><SelectItem value="A+">A+</SelectItem><SelectItem value="A-">A-</SelectItem><SelectItem value="B+">B+</SelectItem><SelectItem value="B-">B-</SelectItem><SelectItem value="AB+">AB+</SelectItem><SelectItem value="AB-">AB-</SelectItem><SelectItem value="O+">O+</SelectItem><SelectItem value="O-">O-</SelectItem></SelectContent>
            </Select>
            {errors.bloodGroup && <p className="text-red-500 text-xs">{errors.bloodGroup}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="identificationMark">Identification Mark</Label>
            <Input id="identificationMark" type="text" value={formData.identificationMark} onChange={handleChange} className={readOnlyClass} disabled={isReadOnly} />
          </div>

          {/* Academic Details */}
          <div className="space-y-1">
            <Label htmlFor="course">Course <span className="text-red-500">*</span></Label>
            <Select value={formData.course} onValueChange={(value) => handleSelectChange(value, 'course')} required disabled={isReadOnly}>
              <SelectTrigger className={`${errors.course ? "border-red-500" : ""} ${readOnlyClass}`}><SelectValue placeholder="Select course" /></SelectTrigger>
              <SelectContent>{availableCourses.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
            </Select>
            {errors.course && <p className="text-red-500 text-xs">{errors.course}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="branch">Branch <span className="text-red-500">*</span></Label>
            <Select value={formData.branch} onValueChange={(value) => handleSelectChange(value, 'branch')} required disabled={isReadOnly || !formData.course}>
              <SelectTrigger className={`${errors.branch ? "border-red-500" : ""} ${readOnlyClass}`}><SelectValue placeholder="Select branch" /></SelectTrigger>
              <SelectContent>{availableBranches.map(b => <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>)}</SelectContent>
            </Select>
            {errors.branch && <p className="text-red-500 text-xs">{errors.branch}</p>}
          </div>
          {availableSpecializations.length > 0 && (
            <div className="space-y-1">
              <Label htmlFor="specialization">Specialization <span className="text-red-500">*</span></Label>
              <Select value={formData.specialization} onValueChange={(value) => handleSelectChange(value, 'specialization')} required disabled={isReadOnly || !formData.branch}>
                <SelectTrigger className={`${errors.specialization ? "border-red-500" : ""} ${readOnlyClass}`}><SelectValue placeholder="Select specialization" /></SelectTrigger>
                <SelectContent>{availableSpecializations.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
              </Select>
              {errors.specialization && <p className="text-red-500 text-xs">{errors.specialization}</p>}
            </div>
          )}
          <div className="space-y-1">
            <Label htmlFor="semester">Semester <span className="text-red-500">*</span></Label>
            <Select value="1" disabled={true}><SelectTrigger className={readOnlyClass}><SelectValue>1st</SelectValue></SelectTrigger><SelectContent><SelectItem value="1">1st</SelectItem></SelectContent></Select>
          </div>

          {/* Contact Details */}
          <div className="space-y-1">
            <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
            <Input id="email" required type="email" value={formData.email} onChange={handleChange} className={`${errors.email ? "border-red-500" : ""} bg-gray-100 cursor-not-allowed`} disabled={true} />
            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="contactNumber_1">Contact Number <span className="text-red-500">*</span></Label>
            <Input id="contactNumber_1" required type="tel" value={formData.contactNumber_1} onChange={handleChange} className={`${errors.contactNumber_1 ? "border-red-500" : ""} ${readOnlyClass}`} disabled={isReadOnly} />
            {errors.contactNumber_1 && <p className="text-red-500 text-xs">{errors.contactNumber_1}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="contactNumber_2">Contact Number 2</Label>
            <Input id="contactNumber_2" type="tel" value={formData.contactNumber_2} onChange={handleChange} className={`${errors.contactNumber_2 ? "border-red-500" : ""} ${readOnlyClass}`} disabled={isReadOnly} />
            {errors.contactNumber_2 && <p className="text-red-500 text-xs">{errors.contactNumber_2}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input id="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleChange} className={`${errors.phoneNumber ? "border-red-500" : ""} ${readOnlyClass}`} disabled={isReadOnly} />
            {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber}</p>}
          </div>
          
          {/* Guardian Details */}
          <div className="space-y-1">
            <Label htmlFor="fatherName">Father's Name <span className="text-red-500">*</span></Label>
            <Input id="fatherName" required type="text" value={formData.fatherName} onChange={handleChange} className={`${errors.fatherName ? "border-red-500" : ""} ${readOnlyClass}`} disabled={isReadOnly} />
            {errors.fatherName && <p className="text-red-500 text-xs">{errors.fatherName}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="fatherContact">Father's Contact <span className="text-red-500">*</span></Label>
            <Input id="fatherContact" required type="tel" value={formData.fatherContact} onChange={handleChange} className={`${errors.fatherContact ? "border-red-500" : ""} ${readOnlyClass}`} disabled={isReadOnly} />
            {errors.fatherContact && <p className="text-red-500 text-xs">{errors.fatherContact}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="fatherOccupation">Father's Occupation</Label>
            <Input id="fatherOccupation" type="text" value={formData.fatherOccupation} onChange={handleChange} className={`${errors.fatherOccupation ? "border-red-500" : ""} ${readOnlyClass}`} disabled={isReadOnly} />
             {errors.fatherOccupation && <p className="text-red-500 text-xs">{errors.fatherOccupation}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="motherName">Mother's Name <span className="text-red-500">*</span></Label>
            <Input id="motherName" required type="text" value={formData.motherName} onChange={handleChange} className={`${errors.motherName ? "border-red-500" : ""} ${readOnlyClass}`} disabled={isReadOnly} />
            {errors.motherName && <p className="text-red-500 text-xs">{errors.motherName}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="motherContact">Mother's Contact <span className="text-red-500">*</span></Label>
            <Input id="motherContact" required type="tel" value={formData.motherContact} onChange={handleChange} className={`${errors.motherContact ? "border-red-500" : ""} ${readOnlyClass}`} disabled={isReadOnly} />
            {errors.motherContact && <p className="text-red-500 text-xs">{errors.motherContact}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="motherOccupation">Mother's Occupation</Label>
            <Input id="motherOccupation" type="text" value={formData.motherOccupation} onChange={handleChange} className={`${errors.motherOccupation ? "border-red-500" : ""} ${readOnlyClass}`} disabled={isReadOnly} />
            {errors.motherOccupation && <p className="text-red-500 text-xs">{errors.motherOccupation}</p>}
          </div>
          
          {/* Address Details */}
          <div className="space-y-1 xl:col-span-2">
            <Label htmlFor="address">Address <span className="text-red-500">*</span></Label>
            <textarea id="address" rows={2} className={`resize-none border rounded-md w-full p-2 ${errors.address ? "border-red-500" : "border-gray-300"} ${readOnlyClass}`} value={formData.address} onChange={handleChange} required disabled={isReadOnly} />
            {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
            <Input id="city" required type="text" value={formData.city} onChange={handleChange} className={`${errors.city ? "border-red-500" : ""} ${readOnlyClass}`} disabled={isReadOnly} />
            {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="state">State <span className="text-red-500">*</span></Label>
            <Select value={formData.state} onValueChange={(value) => handleSelectChange(value, 'state')} required disabled={isReadOnly}>
                <SelectTrigger id="state" className={`${errors.state ? "border-red-500" : ""} ${readOnlyClass}`}><SelectValue placeholder="Select state" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="Andhra Pradesh">Andhra Pradesh</SelectItem><SelectItem value="Arunachal Pradesh">Arunachal Pradesh</SelectItem><SelectItem value="Assam">Assam</SelectItem><SelectItem value="Bihar">Bihar</SelectItem><SelectItem value="Chhattisgarh">Chhattisgarh</SelectItem><SelectItem value="Goa">Goa</SelectItem><SelectItem value="Gujarat">Gujarat</SelectItem><SelectItem value="Haryana">Haryana</SelectItem><SelectItem value="Himachal Pradesh">Himachal Pradesh</SelectItem><SelectItem value="Jharkhand">Jharkhand</SelectItem><SelectItem value="Karnataka">Karnataka</SelectItem><SelectItem value="Kerala">Kerala</SelectItem><SelectItem value="Madhya Pradesh">Madhya Pradesh</SelectItem><SelectItem value="Maharashtra">Maharashtra</SelectItem><SelectItem value="Manipur">Manipur</SelectItem><SelectItem value="Meghalaya">Meghalaya</SelectItem><SelectItem value="Mizoram">Mizoram</SelectItem><SelectItem value="Nagaland">Nagaland</SelectItem><SelectItem value="Odisha">Odisha</SelectItem><SelectItem value="Punjab">Punjab</SelectItem><SelectItem value="Rajasthan">Rajasthan</SelectItem><SelectItem value="Sikkim">Sikkim</SelectItem><SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem><SelectItem value="Telangana">Telangana</SelectItem><SelectItem value="Tripura">Tripura</SelectItem><SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem><SelectItem value="Uttarakhand">Uttarakhand</SelectItem><SelectItem value="West Bengal">West Bengal</SelectItem><SelectItem value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</SelectItem><SelectItem value="Chandigarh">Chandigarh</SelectItem><SelectItem value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</SelectItem><SelectItem value="Delhi">Delhi</SelectItem><SelectItem value="Jammu and Kashmir">Jammu and Kashmir</SelectItem><SelectItem value="Ladakh">Ladakh</SelectItem><SelectItem value="Lakshadweep">Lakshadweep</SelectItem><SelectItem value="Puducherry">Puducherry</SelectItem>
                </SelectContent>
            </Select>
            {errors.state && <p className="text-red-500 text-xs">{errors.state}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="pinCode">Pin Code <span className="text-red-500">*</span></Label>
            <Input id="pinCode" required type="text" value={formData.pinCode} onChange={handleChange} className={`${errors.pinCode ? "border-red-500" : ""} ${readOnlyClass}`} disabled={isReadOnly} />
            {errors.pinCode && <p className="text-red-500 text-xs">{errors.pinCode}</p>}
          </div>

          {/* Local Guardian Details */}
          <div className="space-y-1">
            <Label htmlFor="localGuardian">Local Guardian</Label>
            <Input id="localGuardian" type="text" value={formData.localGuardian} onChange={handleChange} className={`${errors.localGuardian ? "border-red-500" : ""} ${readOnlyClass}`} disabled={isReadOnly} />
            {errors.localGuardian && <p className="text-red-500 text-xs">{errors.localGuardian}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="localGuardianContact">Guardian Contact</Label>
            <Input id="localGuardianContact" type="tel" value={formData.localGuardianContact} onChange={handleChange} className={`${errors.localGuardianContact ? "border-red-500" : ""} ${readOnlyClass}`} disabled={isReadOnly} />
            {errors.localGuardianContact && <p className="text-red-500 text-xs">{errors.localGuardianContact}</p>}
          </div>
          <div className="space-y-1 xl:col-span-2">
            <Label htmlFor="localGuardianAddress">Guardian Address</Label>
            <textarea id="localGuardianAddress" rows={2} className={`resize-none border rounded-md w-full p-2 ${errors.localGuardianAddress ? "border-red-500" : "border-gray-300"} ${readOnlyClass}`} value={formData.localGuardianAddress} onChange={handleChange} disabled={isReadOnly} />
            {errors.localGuardianAddress && <p className="text-red-500 text-xs">{errors.localGuardianAddress}</p>}
          </div>

          {/* Document Details */}
          <div className="space-y-1">
            <Label htmlFor="addharNumber">Aadhaar Number <span className="text-red-500">*</span></Label>
            <Input id="addharNumber" required type="text" value={formData.addharNumber} onChange={handleChange} className={`${errors.addharNumber ? "border-red-500" : ""} ${readOnlyClass}`} disabled={isReadOnly} />
            {errors.addharNumber && <p className="text-red-500 text-xs">{errors.addharNumber}</p>}
          </div>
        </div>

        {/* Document Upload Section */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 mt-6">
            <div className="bg-gray-50 rounded-lg shadow-inner p-6">
                <h2 className="text-xl font-bold mb-4 text-center text-gray-700">Upload Documents</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Photo Upload */}
                    <div className="border rounded-lg p-4 bg-white">
                        <h3 className="font-medium mb-2">Profile Photo <span className="text-red-500">*</span></h3>
                        <FileUpload label="Upload Photo (Passport size)" accept="image/*" fieldName="profilePhoto" fileUrl={formData.photoLink !== "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrxb9rKS0KgjTtqrKPK8dodc0pEeaoC-pY_w&s" ? formData.photoLink : null} onUploadSuccess={(url) => updateFormData({ photoLink: url })} disabled={isReadOnly} />
                        {errors.photoLink && <p className="text-red-500 text-xs mt-1">{errors.photoLink}</p>}
                    </div>
                    {/* Aadhar Upload */}
                    <div className="border rounded-lg p-4 bg-white">
                        <h3 className="font-medium mb-2">Aadhar Card Document <span className="text-red-500">*</span></h3>
                        <FileUpload label="Upload Aadhar Card" accept="image/*,.pdf" fieldName="aadharCard" fileUrl={formData.aadharCardDocument} onUploadSuccess={(url) => updateFormData({ aadharCardDocument: url })} disabled={isReadOnly} />
                        {errors.aadharCardDocument && <p className="text-red-500 text-xs mt-1">{errors.aadharCardDocument}</p>}
                    </div>
                </div>
            </div>
        </div>
        
        {/* Buttons Section */}
        <div className="flex justify-between gap-4 pt-6 mt-6 border-t col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4">
            <div className="flex-1 relative group">
                <Button className="w-full" type="button" variant="outline" onClick={handleClear} disabled={submitting || isReadOnly}>Clear</Button>
                {isReadOnly && <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">Form is in read-only mode</div>}
            </div>
            <div className="flex-1 relative group">
                <Button className="w-full" type="submit" disabled={submitting || isReadOnly}>
                    {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : "Submit"}
                </Button>
                {isReadOnly && <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    {status === 'profile_submitted' ? 'Profile is already submitted' : 'Profile has been approved'}
                </div>}
            </div>
        </div>
        </center>
      </div>
    </form>
  );
}