// import React from 'react'

// const StudentSelfProfiling = () => {
//   return (
//     <div>StudentSelfProfiling</div>
//   )
// }

// export default StudentSelfProfiling


import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { PopoverTrigger, PopoverContent, Popover } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { useSelector } from "react-redux"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { useState, useEffect, useCallback, useRef } from "react"
import axios from "axios"
import { format } from "date-fns"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import FileUpload from "@/components/FileUpload/FileUpload"

// Create a debounced toast function to prevent duplicate toasts
// We'll use a combination of message and timestamp to create unique IDs
const toastTimers = {};
function showToast(message, type = 'error') {
  // Create a unique key for this message
  const key = `${message}_${type}`;

  // If we have a timer for this exact message+type, clear it
  if (toastTimers[key]) {
    clearTimeout(toastTimers[key].timer);

    // If the toast is still visible, don't show another one
    if (toast.isActive(toastTimers[key].id)) {
      return;
    }
  }

  // Show the toast based on type
  let id;
  if (type === 'error') {
    id = toast.error(message, { autoClose: 5000 });
  } else if (type === 'success') {
    id = toast.success(message, { autoClose: 3000 });
  } else {
    id = toast.info(message, { autoClose: 3000 });
  }

  // Store the ID and set a timer to clear it
  toastTimers[key] = {
    id,
    timer: setTimeout(() => {
      delete toastTimers[key];
    }, 6000) // Slightly longer than the autoClose time
  };
}

export default function StudentSelfProfiling() {
  const userData = useSelector(state => state.userStorage.data);
  const [isTempStudent, setIsTempStudent] = useState(false);
  const [status, setStatus] = useState('pending');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [date, setDate] = useState();
  const [rejectionReason, setRejectionReason] = useState('');

  // Track form completion progress
  const [formProgress, setFormProgress] = useState(0);

  // Default form data values
  const getDefaultFormData = () => {
    return {
      rollNo: "",
      firstName: "",
      lastName: "",
      dob: "",
      course: "",
      semester: "1", // Always set to 1 for new students
      branch: "",
      contactNumber_1: "",
      // contactNumber_2: "",
      // phoneNumber: "", // Added phoneNumber field
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
      // localGuardianContact: "",
      localGuardianAddress: "",
      addharNumber: "",
      aadharCardDocument: "",
      photoLink: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrxb9rKS0KgjTtqrKPK8dodc0pEeaoC-pY_w&s"
    };
  };

  // Form state
  const [formData, setFormData] = useState(getDefaultFormData());

  // Available courses and branches from the database
  const [availableCourses, setAvailableCourses] = useState([]);
  const [availableBranches, setAvailableBranches] = useState([]);

  // Form validation errors
  const [errors, setErrors] = useState({});

  // Reference for roll number check timeout
  const rollNumberCheckTimeout = useRef(null);

  // Check if roll number exists
  const checkRollNumber = useCallback(async (rollNo) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/student/checkRollNumber/${rollNo}`,
        { withCredentials: true } // Add credentials for authentication
      );

      return response.data;
    } catch (error) {
      console.error('Error checking roll number:', error);
      // If authentication error, don't show validation error to user
      if (error.response?.status === 401) {
        console.log('Authentication required for roll number check');
        return { success: false, exists: false };
      }
      return { success: false, exists: false };
    }
  }, []);

  // Calculate form progress based on required fields
  const calculateFormProgress = useCallback((data) => {
    // Define required fields
    const requiredFields = [
      'rollNo', 'firstName', 'dob', 'course', 'semester', 'branch',
      'contactNumber_1', 'email', 'gender', 'bloodGroup', 'fatherName',
      'fatherContact', 'motherName', 'motherContact',
      'address', 'city', 'state', 'pinCode',
      'addharNumber', 'aadharCardDocument', 'photoLink'
    ];

    // Count filled required fields
    const filledFields = requiredFields.filter(field =>
      data[field] && data[field].toString().trim() !== ''
    ).length;

    // Calculate percentage
    const percentage = Math.round((filledFields / requiredFields.length) * 100);

    return percentage;
  }, []);

  // Simple setFormData function without localStorage
  const updateFormData = useCallback((newData) => {
    setFormData(prevData => {
      const updatedData = { ...prevData, ...newData };

      // Calculate and update form progress
      if (status !== 'profile_submitted' && status !== 'approved') {
        const progress = calculateFormProgress(updatedData);
        setFormProgress(progress);
      }

      return updatedData;
    });
  }, [status, calculateFormProgress]);

  // Validate a single field
  const validateField = useCallback((id, value) => {
    let error = null;

    // Define required fields
    const requiredFields = [
      'rollNo', 'firstName', 'dob', 'course', 'semester', 'branch',
      'contactNumber_1', 'email', 'gender', 'bloodGroup', 'fatherName',
      'fatherContact', 'motherName', 'motherContact',
      'address', 'city', 'state', 'pinCode',
      'addharNumber', 'aadharCardDocument', 'photoLink'
    ];

    // Skip validation for optional fields if they're empty
    const isRequired = requiredFields.includes(id);
    if (!value && !isRequired) {
      return null;
    }

    // Convert to string if it's not already a string
    const strValue = typeof value === 'string' ? value : String(value);
    if (strValue.trim() === '' && !isRequired) {
      return null;
    }

    // Use strValue for all subsequent validations
    value = strValue;

    // Field-specific validation
    switch (id) {
      case 'rollNo':
        // Check if contains non-digit characters
        if (!/^\d+$/.test(value)) {
          error = "Roll number must contain only digits";
        }
        break;

      case 'firstName':
      case 'lastName':
      case 'fatherName':
      case 'motherName':
      case 'localGuardian':
        // Check if contains numbers or special characters
        if (!/^[A-Za-z\s.]+$/.test(value)) {
          error = "Name should contain only letters, spaces, and periods";
        }
        break;

      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Invalid email format";
        }
        break;

      case 'contactNumber_1':
      case 'fatherContact':
      case 'motherContact':
        // Required contact numbers
        // First check if contains non-digit characters (immediate feedback)
        if (!/^\d*$/.test(value)) {
          error = "Contact number must contain only digits";
        }
        // Then check full pattern if all digits
        else if (value.length > 0 && !/^[6-9]\d{9}$/.test(value)) {
          if (value.length !== 10) {
            error = "Contact number must be exactly 10 digits";
          } else if (!/^[6-9]/.test(value)) {
            error = "Contact number must start with 6, 7, 8, or 9";
          } else {
            error = "Invalid contact number format";
          }
        }
        break;

      case 'contactNumber_2':
      case 'phoneNumber':
      case 'localGuardianContact':
        // Optional contact numbers - ONLY validate if they have a meaningful value
        // If empty or just whitespace, skip validation completely
        if (!value || value.trim() === '') {
          return null; // Skip validation for empty values
        }

        // First check if contains non-digit characters (immediate feedback)
        if (!/^\d*$/.test(value)) {
          error = "Contact number must contain only digits";
        }
        // Then check full pattern if all digits
        else if (value.length > 0 && !/^[6-9]\d{9}$/.test(value)) {
          if (value.length !== 10) {
            error = "Contact number must be exactly 10 digits";
          } else if (!/^[6-9]/.test(value)) {
            error = "Contact number must start with 6, 7, 8, or 9";
          } else {
            error = "Invalid contact number format";
          }
        }
        break;

      case 'pinCode':
        // First check if contains non-digit characters
        if (!/^\d*$/.test(value)) {
          error = "Pin code must contain only digits";
        }
        // Then check length if all digits
        else if (value.length > 0 && value.length !== 6) {
          error = "Pin code must be exactly 6 digits";
        }
        break;

      case 'addharNumber':
        // First check if contains non-digit characters
        if (!/^\d*$/.test(value)) {
          error = "Aadhaar number must contain only digits";
        }
        // Then check length if all digits
        else if (value.length > 0 && value.length !== 12) {
          error = "Aadhaar number must be exactly 12 digits";
        }
        break;

      case 'identificationMark':
      case 'fatherOccupation':
      case 'motherOccupation':
        // These fields should not contain special characters except basic punctuation
        if (!/^[A-Za-z0-9\s.,;:'"-]+$/.test(value)) {
          error = "This field contains invalid characters";
        }
        break;

      default:
        // No specific validation for other fields
        break;
    }

    return error;
  }, []);

  // Handle input changes
  const handleChange = useCallback((e) => {
    // Don't update if form is read-only (but allow changes if rejected)
    if (status === 'profile_submitted' || status === 'approved') {
      return;
    }

    const { id, value } = e.target;
    updateFormData({ [id]: value });

    // Validate the field as user types (immediate feedback for type errors)
    const fieldError = validateField(id, value);

    // Update errors state
    if (fieldError) {
      setErrors(prev => ({
        ...prev,
        [id]: fieldError
      }));
    } else if (errors[id]) {
      // Clear error if field is now valid
      setErrors(prev => ({
        ...prev,
        [id]: null
      }));
    }

    // Check roll number when it changes and has at least 5 digits
    if (id === 'rollNo' && value.length >= 5 && !/^\D/.test(value)) { // Only check if it's a valid number
      // Debounce the API call to avoid too many requests
      clearTimeout(rollNumberCheckTimeout.current);
      rollNumberCheckTimeout.current = setTimeout(async () => {
        const result = await checkRollNumber(value);
        if (result.success && result.exists) {
          setErrors(prev => ({
            ...prev,
            rollNo: 'This roll number already exists in the system. Please verify your roll number.'
          }));
        }
      }, 500);
    }
  }, [status, updateFormData, validateField, errors, checkRollNumber]);

  // Handle select changes
  const handleSelectChange = useCallback((value, id) => {
    // Don't update if form is read-only (but allow changes if rejected)
    if (status === 'profile_submitted' || status === 'approved') {
      return;
    }

    updateFormData({ [id]: value });

    // Clear any errors for this field
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: null
      }));
    }
  }, [status, updateFormData, errors]);

  // Handle date change
  const handleDateChange = useCallback((newDate) => {
    // Don't update if form is read-only (but allow changes if rejected)
    if (status === 'profile_submitted' || status === 'approved') {
      return;
    }

    setDate(newDate);
    updateFormData({ dob: newDate ? format(newDate, 'yyyy-MM-dd') : '' });

    // Clear any errors for this field
    if (errors.dob) {
      setErrors(prev => ({
        ...prev,
        dob: null
      }));
    }
  }, [status, updateFormData, errors]);

  // Fetch available courses and branches
  const fetchAvailableCourses = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/student/getAvailableCourses`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setAvailableCourses(response.data.courses);
        setAvailableBranches(response.data.branches);
        console.log("Fetched courses:", response.data.courses);
        console.log("Fetched branches:", response.data.branches);
      } else {
        console.error("Failed to fetch available courses:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching available courses:", error);
      // Fallback to default courses and branches if API fails
      setAvailableCourses([
        { value: "B.Tech", label: "B.Tech" },
        { value: "M.Tech", label: "M.Tech" },
        { value: "MBA", label: "MBA" },
        { value: "MCA", label: "MCA" }
      ]);
      setAvailableBranches([
        { value: "Computer Science", label: "Computer Science" },
        { value: "Electronics and Communication", label: "Electronics and Communication" },
        { value: "Mechanical", label: "Mechanical" },
        { value: "Electrical", label: "Electrical" }
      ]);
    }
  }, []);

  // Fetch profile data
  const fetchProfileData = useCallback(async () => {
    try {
      setLoading(true);

      // Get the user's email and role
      const userEmail = userData?.email || localStorage.getItem('email');
      const userRole = userData?.roleType || localStorage.getItem('role');

      // Make sure we have the email and role
      if (!userEmail || !userRole) {
        toast.error("User information is missing. Please log in again.");
        return;
      }

      // Fetch profile data from API
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/student/getProfile`,
          {
            params: {
              tokenEmail: userEmail,
              TokenRole: userRole
            },
            withCredentials: true
          }
        );

        if (response.data.success) {
          // Update status from API
          const apiStatus = response.data.status || 'pending';
          setStatus(apiStatus);
          console.log("Setting status from API to:", apiStatus);

          // Set rejection reason if applicable
          if (apiStatus === 'rejected' && response.data.rejectionReason) {
            setRejectionReason(response.data.rejectionReason);
          }

          // If profile data exists in the response, use it
          if (response.data.exists) {
            const profile = response.data.profile;

            // Format date if it exists
            if (profile.dob) {
              const dobDate = new Date(profile.dob);
              setDate(dobDate);
            }

            // Set form data from API
            setFormData({
              rollNo: profile.rollNo || "",
              firstName: profile.firstName || "",
              lastName: profile.lastName || "",
              dob: profile.dob || "",
              course: profile.course || "",
              semester: profile.semester?.toString() || "",
              branch: profile.branch || "",
              contactNumber_1: profile.contactNumber_1 || "",
              contactNumber_2: profile.contactNumber_2,
              phoneNumber: profile.phoneNumber || profile.contactNumber_1, // Use contactNumber_1 as fallback
              email: profile.email || "",
              identificationMark: profile.identificationMark || "",
              bloodGroup: profile.bloodGroup || "",
              gender: profile.gender || "",
              fatherName: profile.fatherName || "",
              fatherContact: profile.fatherContact || "",
              fatherOccupation: profile.fatherOccupation || "",
              motherName: profile.motherName || "",
              motherContact: profile.motherContact || "",
              motherOccupation: profile.motherOccupation || "",
              address: profile.address || "",
              city: profile.city || "",
              state: profile.state || "",
              pinCode: profile.pinCode || "",
              localGuardian: profile.localGuardian || "",
              localGuardianContact: profile.localGuardianContact,
              localGuardianAddress: profile.localGuardianAddress || "",
              addharNumber: profile.addharNumber || "",
              aadharCardDocument: profile.aadharCardDocument || "",
              photoLink: profile.photoLink || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrxb9rKS0KgjTtqrKPK8dodc0pEeaoC-pY_w&s"
            });
          } else {
            // If no profile data exists, use default form data
            // but keep the email from user data
            const defaultData = getDefaultFormData();
            setFormData({
              ...defaultData,
              email: userEmail
            });
          }
        } else {
          // If API call was successful but didn't return success status
          toast.error(response.data.message || "Failed to load profile data");
          // Use default form data but keep the email
          const defaultData = getDefaultFormData();
          setFormData({
            ...defaultData,
            email: userEmail
          });
        }
      } catch (apiError) {
        console.error("Error fetching profile data from API:", apiError);

        // Get detailed error message if available
        const errorMessage = apiError.response?.data?.error ||
                            apiError.response?.data?.details ||
                            apiError.message ||
                            "Failed to load profile data";

        // If it's a new user without a profile yet, don't show an error
        if (apiError.response?.status === 404) {
          // This is fine - just means they need to create a profile
          console.log("No profile found, user needs to create one");
          toast.info("Please complete your profile information");

          // Use default form data but keep the email
          const defaultData = getDefaultFormData();
          setFormData({
            ...defaultData,
            email: userEmail
          });
        } else {
          // For other errors, show the error message
          toast.error(errorMessage);
        }
      }
    } catch (error) {
      console.error("Unexpected error in fetchProfileData:", error);
      toast.error("An unexpected error occurred while loading your profile data.");
    } finally {
      setLoading(false);
    }
  }, [userData]);



  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    // Basic validation
    const newErrors = {};

    // Required fields validation
    if (!formData.rollNo) newErrors.rollNo = "Roll number is required";
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.dob) newErrors.dob = "Date of birth is required";
    if (!formData.course) newErrors.course = "Course is required";
    if (!formData.semester) newErrors.semester = "Semester is required";
    if (!formData.branch) newErrors.branch = "Branch is required";
    if (!formData.contactNumber_1) newErrors.contactNumber_1 = "Contact number is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.bloodGroup) newErrors.bloodGroup = "Blood Group is required";
    if (!formData.fatherName) newErrors.fatherName = "Father's name is required";
    if (!formData.fatherContact) newErrors.fatherContact = "Father's contact is required";
    if (!formData.motherName) newErrors.motherName = "Mother's name is required";
    if (!formData.motherContact) newErrors.motherContact = "Mother's contact is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.pinCode) newErrors.pinCode = "Pin code is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.photoLink || formData.photoLink === "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrxb9rKS0KgjTtqrKPK8dodc0pEeaoC-pY_w&s") {
      newErrors.photoLink = "Student Photo is required";
    }
    if (!formData.aadharCardDocument) {
      newErrors.aadharCardDocument = "Aadhar Card Photo is required";
    }
    if (!formData.addharNumber) {
      newErrors.addharNumber = "Aadhaar Number is required";
    }

    // Format validation using validateField function for consistency
    const fieldsToValidate = [
      'rollNo', 'email', 'firstName', 'lastName', 'contactNumber_1', 'contactNumber_2',
      'phoneNumber', 'fatherContact', 'motherContact', 'localGuardianContact',
      'pinCode', 'addharNumber', 'identificationMark', 'fatherName', 'motherName',
      'localGuardian', 'fatherOccupation', 'motherOccupation', 'photoLink','aadharCardDocument'
    ];

    // Define required fields
    const requiredFields = [
      'rollNo', 'firstName', 'dob', 'course', 'semester', 'branch',
      'contactNumber_1', 'email', 'gender', 'fatherName', 'fatherContact',
      'motherName', 'motherContact', 'address', 'city', 'state', 'pinCode',
      'photoLink', 'aadharCardDocument', 'addharNumber', 'bloodGroup'
    ];

    // Validate each field that has a value
    fieldsToValidate.forEach(field => {
      // Skip URL validation for document fields
      if (field === 'photoLink' || field === 'aadharCardDocument') {
        return;
      }

      // Skip validation for empty optional fields
      const isRequired = requiredFields.includes(field);
      const isEmpty = !formData[field] || (typeof formData[field] === 'string' && formData[field].trim() === '');

      if (isEmpty && !isRequired) {
        return;
      }

      if (formData[field]) {
        const fieldError = validateField(field, formData[field]);
        if (fieldError) {
          newErrors[field] = fieldError;
        }
      }
    });

    // Check if there are any errors
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      // Create a more specific error message
      const requiredFieldsMissing = Object.entries(newErrors)
        .filter((entry) => entry[1].includes('required') || entry[1].includes('Required'));

      // Map field keys to user-friendly names
      const fieldLabels = {
        rollNo: "Roll Number",
        firstName: "First Name",
        lastName: "Last Name",
        dob: "Date of Birth",
        course: "Course",
        semester: "Semester",
        branch: "Branch",
        contactNumber_1: "Contact Number",
        contactNumber_2: "Contact Number 2",
        phoneNumber: "Phone Number",
        email: "Email",
        gender: "Gender",
        fatherName: "Father's Name",
        fatherContact: "Father's Contact",
        motherName: "Mother's Name",
        motherContact: "Mother's Contact",
        address: "Address",
        city: "City",
        state: "State",
        pinCode: "Pin Code",
        photoLink: "Profile Photo",
        aadharCardDocument: "Aadhar Card Document",
        addharNumber: "Aadhaar Number",
        localGuardianContact: "Guardian Contact",
        localGuardianAddress: "Guardian Address"
      };

      // Get user-friendly field names
      const missingFieldLabels = requiredFieldsMissing
        .map((entry) => fieldLabels[entry[0]] || entry[0]);

      if (missingFieldLabels.length > 0) {
        toast.error(`Please fill in all required fields: ${missingFieldLabels.join(', ')}`);
      } else {
        toast.error("Please correct the validation errors in the form");
      }

      return;
    }

    // Check if roll number already exists before submitting
    try {
      setSubmitting(true);
      const rollNoResult = await checkRollNumber(formData.rollNo);
      if (rollNoResult.success && rollNoResult.exists) {
        setErrors(prev => ({
          ...prev,
          rollNo: 'This roll number already exists in the system. Please verify your roll number.'
        }));
        showToast("Roll number already exists in the system", "error");
        setSubmitting(false);
        return;
      }
    } catch (error) {
      console.error("Error checking roll number:", error);
      // Continue with submission even if roll number check fails
    }

    // Ensure data types match what backend expects
    // NOTE: All fields are now required in the frontend to ensure clean data in the database
    // This approach prevents validation errors from the backend for empty optional fields
    const submissionData = {
      ...formData,
      rollNo: parseInt(formData.rollNo, 10),
      semester: parseInt(formData.semester, 10),
      tokenEmail: formData.email, // Add tokenEmail for the backend
      TokenRole: isTempStudent ? 'TempStudent' : 'Student', // Add TokenRole for the backend
    };

    try {
      setSubmitting(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/student/studentSelfProfiling`,
        submissionData,
        { withCredentials: true }
      );

      if (response.data.success) {
        showToast("Profile submitted successfully", "success");
        setStatus('profile_submitted');

        // If this was a resubmission after rejection, clear the rejection reason
        if (status === 'rejected') {
          setRejectionReason('');
        }
      } else {
        showToast(response.data.message || "Failed to submit profile", "error");
      }
    } catch (error) {
      console.error("Error submitting profile:", error);
      if (error.response?.data?.errors) {
        // Handle validation errors from the server
        const serverErrors = {};
        const fieldLabels = {
          rollNo: "Roll Number",
          firstName: "First Name",
          lastName: "Last Name",
          dob: "Date of Birth",
          course: "Course",
          semester: "Semester",
          branch: "Branch",
          contactNumber_1: "Contact Number",
          contactNumber_2: "Contact Number 2",
          phoneNumber: "Phone Number",
          email: "Email",
          gender: "Gender",
          fatherName: "Father's Name",
          fatherContact: "Father's Contact",
          motherName: "Mother's Name",
          motherContact: "Mother's Contact",
          address: "Address",
          city: "City",
          state: "State",
          pinCode: "Pin Code",
          photoLink: "Profile Photo",
          aadharCardDocument: "Aadhar Card Document",
          addharNumber: "Aadhaar Number",
          localGuardianContact: "Guardian Contact",
          localGuardianAddress: "Guardian Address"
        };

        // Define optional fields that should be ignored if empty
        const optionalFields = ['lastName', 'contactNumber_2', 'phoneNumber', 'identificationMark',
                               'fatherOccupation', 'motherOccupation', 'localGuardian',
                               'localGuardianContact', 'localGuardianAddress'];

        // Filter out errors for empty optional fields
        const relevantErrors = error.response.data.errors.filter(err => {
          // If it's an optional field, check if it's empty
          if (optionalFields.includes(err.path)) {
            const value = formData[err.path];
            return value && value.trim() !== ''; // Only include if field has a value
          }
          return true; // Include all other errors
        });

        // Process the filtered errors
        relevantErrors.forEach(err => {
          serverErrors[err.path] = err.msg;
        });
        setErrors(serverErrors);

        // Create a more user-friendly error message with only relevant fields
        const errorFields = relevantErrors.map(err =>
          fieldLabels[err.path] || err.path
        );

        if (errorFields.length > 0) {
          showToast(`Please correct these fields: ${errorFields.join(', ')}`, "error");
        } else {
          showToast("Please review your form for any errors", "error");
        }
      } else {
        showToast("Failed to submit profile. Please try again.", "error");
      }
    } finally {
      setSubmitting(false);
      console.log(formData);
    }
  }, [validateField, checkRollNumber, isTempStudent, status, formData]);

  // Check if form should be read-only
  const isReadOnly = status === 'profile_submitted' || status === 'approved';
  // Note: When status is 'rejected', the form is editable so the student can fix the issues

  // All fields are editable when status is 'rejected', including roll number
  // This allows students to correct typos in their roll number

  // CSS class for read-only inputs
  const readOnlyClass = isReadOnly ? "bg-gray-100 cursor-not-allowed" : "";

  // Clear form data
  const handleClear = () => {
    // Get default form data
    const defaultData = getDefaultFormData();

    // Preserve the email from current form data
    const userEmail = formData.email;

    // Clear form data in state but keep the email
    setFormData({
      ...defaultData,
      email: userEmail
    });

    // Reset other state
    setDate(null);
    setErrors({});

    // Show success message
    showToast("Form data cleared successfully", "success");
  };

  // Calculate initial form progress when component mounts
  useEffect(() => {
    // Calculate initial form progress based on current form data
    if (Object.keys(formData).length > 0) {
      const progress = calculateFormProgress(formData);
      setFormProgress(progress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Fetch available courses and branches
    fetchAvailableCourses();

    // Check if user is a temporary student
    if (userData?.roleType === 'TempStudent' || localStorage.getItem('role') === 'TempStudent') {
      setIsTempStudent(true);

      // Set the email from userData or localStorage
      const userEmail = userData?.email || localStorage.getItem('email');
      if (userEmail) {
        updateFormData({ email: userEmail });
      }

      // Fetch profile data from API
      fetchProfileData();
    }
  }, [userData, fetchProfileData, fetchAvailableCourses, updateFormData]);




    // Document upload is now handled by the FileUpload component


  return (
    <form className="flex flex-col gap-8 py-8 px-4 md:px-6 lg:px-8" onSubmit={handleSubmit}>
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Status Banner for Temporary Students */}
      {isTempStudent && (
        <Alert className={`mb-4 ${
          status === 'approved' ? 'bg-green-50 border-green-200 text-green-800' :
          status === 'rejected' ? 'bg-red-50 border-red-200 text-red-800' :
          status === 'profile_submitted' ? 'bg-blue-50 border-blue-200 text-blue-800' :
          'bg-yellow-50 border-yellow-200 text-yellow-800'
        }`}>
          {status === 'approved' ? (
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          ) : status === 'rejected' ? (
            <XCircle className="h-5 w-5 text-red-600" />
          ) : status === 'profile_submitted' ? (
            <CheckCircle2 className="h-5 w-5 text-blue-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-yellow-600" />
          )}
          <AlertTitle className="font-medium">
            {status === 'approved' ? 'Profile Approved' :
             status === 'rejected' ? 'Profile Rejected' :
             status === 'profile_submitted' ? 'Profile Submitted' :
             'Action Required'}
          </AlertTitle>
          <AlertDescription>
            {status === 'approved' ?
              'Your profile has been approved. You now have full access to the system.' :
             status === 'rejected' ? (
              <div>
                <p>Your profile was rejected. Please update your information and submit again.</p>
                {rejectionReason && (
                  <div className="mt-2 p-2 bg-red-100 rounded-md">
                    <p className="font-semibold">Reason for rejection:</p>
                    <p>{rejectionReason}</p>
                    {rejectionReason.includes('roll number') && (
                      <div className="mt-2 p-2 bg-yellow-100 rounded-md">
                        <p className="font-semibold text-yellow-800">Important:</p>
                        <p className="text-yellow-800">Your roll number appears to be already registered in our system. Please check if you entered it correctly.</p>
                        <div className="mt-2">
                          <p className="text-yellow-800">If you&apos;re sure your roll number is correct but still facing issues, please contact your college administration to verify your official roll number.</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
             ) :
             status === 'profile_submitted' ?
              'Your profile is currently under review. You will be notified once it is approved.' :
              'Please complete your profile information below and submit for verification.'}
          </AlertDescription>
        </Alert>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading profile data...</span>
        </div>
      )}

      <div className="flex items-center justify-center">
        <div className="text-center w-full max-w-4xl">
          <h1 className="text-2xl font-bold">Student Self Profiling</h1>

          {/* Form Progress Bar */}
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



          {(status === 'profile_submitted' || status === 'approved') && (
            <div className="mt-2 text-sm font-medium px-4 py-2 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
              <span className="flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                {status === 'profile_submitted'
                  ? 'Your profile is submitted and awaiting approval. Form is in read-only mode.'
                  : 'Your profile has been approved. Form is in read-only mode.'}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-8 rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="bg-blue-50 p-3 rounded-md border border-blue-200 mb-4">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Note:</span> Fields marked with <span className="text-red-500">*</span> are required. All data will be saved to the database when you submit the form.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div className="space-y-1">
            <Label htmlFor="rollNo">Roll Number <span className="text-red-500">*</span></Label>
            <Input
              id="rollNo"
              required
              type="text"
              value={formData.rollNo}
              onChange={handleChange}
              className={`${errors.rollNo ? "border-red-500" : ""} ${readOnlyClass}`}
              disabled={isReadOnly}
            />
            {status === 'rejected' && rejectionReason && rejectionReason.includes('roll number') && (
              <p className="text-sm text-yellow-600 mt-1">
                <span className="font-semibold">Note:</span> Please ensure your roll number is correct before resubmitting.
              </p>
            )}
            {errors.rollNo && <p className="text-red-500 text-xs">{errors.rollNo}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
            <Input
              id="firstName"
              required
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              className={`${errors.firstName ? "border-red-500" : ""} ${readOnlyClass}`}
              disabled={isReadOnly}
            />
            {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              disabled={isReadOnly}
              className={readOnlyClass}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="dob">Date of Birth <span className="text-red-500">*</span></Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  className={`pl-3 text-left font-normal ${errors.dob ? "border-red-500" : ""} ${date ? "text-black" : "text-gray-500"} dark:text-gray-400 ${readOnlyClass}`}
                  variant="outline"
                  required
                  disabled={isReadOnly}
                >
                  {date ? format(date, "PPP") : "Pick a date"}
                  <CalendarDaysIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateChange}
                  disabled={(date) => date > new Date() || date < new Date("1950-01-01")}
                  captionLayout="dropdown"
                  fromYear={1950}
                  toYear={new Date().getFullYear()}
                  className="rounded-md border shadow-sm"
                />
              </PopoverContent>
            </Popover>
            {errors.dob && <p className="text-red-500 text-xs">{errors.dob}</p>}
          </div>

          <div className="flex space-x-4 col-span-1 ">
            <div className="space-y-1 w-1/2">
              <Label htmlFor="course">Course <span className="text-red-500">*</span></Label>
              <Select
                value={formData.course}
                onValueChange={(value) => handleSelectChange(value, 'course')}
                required
                disabled={isReadOnly}
              >
                <SelectTrigger id="course" className={`${errors.course ? "border-red-500" : ""} ${readOnlyClass}`}>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {availableCourses.length > 0 ? (
                    availableCourses.map((course) => (
                      <SelectItem key={course.value} value={course.value}>
                        {course.label}
                      </SelectItem>
                    ))
                  ) : (
                    <>
                      <SelectItem value="B.Tech">B.Tech</SelectItem>
                      <SelectItem value="M.Tech">M.Tech</SelectItem>
                      <SelectItem value="MBA">MBA</SelectItem>
                      <SelectItem value="MCA">MCA</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
              {errors.course && <p className="text-red-500 text-xs">{errors.course}</p>}
            </div>
            <div className="space-y-1 w-1/2">
              <Label htmlFor="semester">Semester <span className="text-red-500">*</span></Label>
              <Select
                value="1"
                disabled={true} // Always disabled since it's fixed to 1
              >
                <SelectTrigger id="semester" className={readOnlyClass}>
                  <SelectValue>1st</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1st</SelectItem>
                </SelectContent>
              </Select>

            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="branch">Branch <span className="text-red-500">*</span></Label>
            <Select
              value={formData.branch}
              onValueChange={(value) => handleSelectChange(value, 'branch')}
              required
              disabled={isReadOnly}
            >
              <SelectTrigger id="branch" className={`${errors.branch ? "border-red-500" : ""} ${readOnlyClass}`}>
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                {availableBranches.length > 0 ? (
                  availableBranches.map((branch) => (
                    <SelectItem key={branch.value} value={branch.value}>
                      {branch.label}
                    </SelectItem>
                  ))
                ) : (
                  <>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Electronics and Communication">Electronics and Communication</SelectItem>
                    <SelectItem value="Mechanical">Mechanical</SelectItem>
                    <SelectItem value="Electrical">Electrical</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
            {errors.branch && <p className="text-red-500 text-xs">{errors.branch}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="contactNumber_1">Contact Number <span className="text-red-500">*</span></Label>
            <Input
              id="contactNumber_1"
              required
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              value={formData.contactNumber_1}
              onChange={handleChange}
              className={`${errors.contactNumber_1 ? "border-red-500" : ""} ${readOnlyClass}`}
              disabled={isReadOnly}
            />
            {errors.contactNumber_1 && <p className="text-red-500 text-xs">{errors.contactNumber_1}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="contactNumber_2">Contact Number 2</Label>
            <Input
              id="contactNumber_2"
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              value={formData.contactNumber_2}
              onChange={handleChange}
              className={`${errors.contactNumber_2 ? "border-red-500" : ""} ${readOnlyClass}`}
              disabled={isReadOnly}
            />
            {errors.contactNumber_2 && <p className="text-red-500 text-xs">{errors.contactNumber_2}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={`${errors.phoneNumber ? "border-red-500" : ""} ${readOnlyClass}`}
              disabled={isReadOnly}
            />
            {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isTempStudent || isReadOnly} // Email is fixed for temp students and in read-only mode
              className={`${errors.email ? "border-red-500" : ""} ${readOnlyClass}`}
              required
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="identificationMark">Identification Mark</Label>
            <Input
              id="identificationMark"
              type="text"
              value={formData.identificationMark}
              onChange={handleChange}
              className={`${errors.identificationMark ? "border-red-500" : ""} ${readOnlyClass}`}
              disabled={isReadOnly}
            />
            {errors.identificationMark && <p className="text-red-500 text-xs">{errors.identificationMark}</p>}
          </div>

          <div className="flex space-x-4 col-span-1">
            {/* Blood Group */}
            <div className="w-1/2 space-y-1">
              <Label htmlFor="bloodGroup">Blood Group <span className="text-red-500">*</span></Label>
              <Select
                value={formData.bloodGroup}
                onValueChange={(value) => handleSelectChange(value, 'bloodGroup')}
                required
                disabled={isReadOnly}
              >
                <SelectTrigger id="bloodGroup" className={`${errors.bloodGroup ? "border-red-500" : ""} ${readOnlyClass}`}>
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
              {errors.bloodGroup && <p className="text-red-500 text-xs">{errors.bloodGroup}</p>}
            </div>

            {/* Gender */}
            <div className="w-1/2 space-y-1">
              <Label htmlFor="gender">Gender <span className="text-red-500">*</span></Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleSelectChange(value, 'gender')}
                required
                disabled={isReadOnly}
              >
                <SelectTrigger id="gender" className={`${errors.gender ? "border-red-500" : ""} ${readOnlyClass}`}>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && <p className="text-red-500 text-xs">{errors.gender}</p>}
            </div>
        </div>





          <div className="space-y-1">
            <Label htmlFor="fatherName">Father&apos;s Name <span className="text-red-500">*</span></Label>
            <Input
              id="fatherName"
              required
              type="text"
              value={formData.fatherName}
              onChange={handleChange}
              className={`${errors.fatherName ? "border-red-500" : ""} ${readOnlyClass}`}
              disabled={isReadOnly}
            />
            {errors.fatherName && <p className="text-red-500 text-xs">{errors.fatherName}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="fatherContact">Father&apos;s Contact <span className="text-red-500">*</span></Label>
            <Input
              id="fatherContact"
              required
              type="tel"
              value={formData.fatherContact}
              onChange={handleChange}
              className={`${errors.fatherContact ? "border-red-500" : ""} ${readOnlyClass}`}
              disabled={isReadOnly}
            />
            {errors.fatherContact && <p className="text-red-500 text-xs">{errors.fatherContact}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="fatherOccupation">Father&apos;s Occupation</Label>
            <Input
              id="fatherOccupation"
              type="text"
              value={formData.fatherOccupation}
              onChange={handleChange}
              className={`${errors.fatherOccupation ? "border-red-500" : ""} ${readOnlyClass}`}
              disabled={isReadOnly}
            />
            {errors.fatherOccupation && <p className="text-red-500 text-xs">{errors.fatherOccupation}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="motherName">Mother&apos;s Name <span className="text-red-500">*</span></Label>
            <Input
              id="motherName"
              required
              type="text"
              value={formData.motherName}
              onChange={handleChange}
              className={`${errors.motherName ? "border-red-500" : ""} ${readOnlyClass}`}
              disabled={isReadOnly}
            />
            {errors.motherName && <p className="text-red-500 text-xs">{errors.motherName}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="motherContact">Mother&apos;s Contact <span className="text-red-500">*</span></Label>
            <Input
              id="motherContact"
              required
              type="tel"
              value={formData.motherContact}
              onChange={handleChange}
              className={`${errors.motherContact ? "border-red-500" : ""} ${readOnlyClass}`}
              disabled={isReadOnly}
            />
            {errors.motherContact && <p className="text-red-500 text-xs">{errors.motherContact}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="motherOccupation">Mother&apos;s Occupation</Label>
            <Input
              id="motherOccupation"
              type="text"
              value={formData.motherOccupation}
              onChange={handleChange}
              className={`${errors.motherOccupation ? "border-red-500" : ""} ${readOnlyClass}`}
              disabled={isReadOnly}
            />
            {errors.motherOccupation && <p className="text-red-500 text-xs">{errors.motherOccupation}</p>}
          </div>



          <div className="space-y-1">
            <Label htmlFor="address">Address <span className="text-red-500">*</span></Label>
            <textarea
              id="address"
              rows={2}
              className={`resize-none border rounded-md w-full p-2 ${errors.address ? "border-red-500" : "border-gray-300"} ${readOnlyClass}`}
              value={formData.address}
              onChange={handleChange}
              required
              disabled={isReadOnly}
            />
            {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
            <Input
              id="city"
              type="text"
              value={formData.city}
              onChange={handleChange}
              className={`${errors.city ? "border-red-500" : ""} ${readOnlyClass}`}
              required
              disabled={isReadOnly}
            />
            {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="state">State <span className="text-red-500">*</span></Label>
            <Select
              value={formData.state}
              onValueChange={(value) => handleSelectChange(value, 'state')}
              required
              disabled={isReadOnly}
            >
              <SelectTrigger id="state" className={`${errors.state ? "border-red-500" : ""} ${readOnlyClass}`}>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="Andhra Pradesh">Andhra Pradesh</SelectItem>
                  <SelectItem value="Arunachal Pradesh">Arunachal Pradesh</SelectItem>
                  <SelectItem value="Assam">Assam</SelectItem>
                  <SelectItem value="Bihar">Bihar</SelectItem>
                  <SelectItem value="Chhattisgarh">Chhattisgarh</SelectItem>
                  <SelectItem value="Goa">Goa</SelectItem>
                  <SelectItem value="Gujarat">Gujarat</SelectItem>
                  <SelectItem value="Haryana">Haryana</SelectItem>
                  <SelectItem value="Himachal Pradesh">Himachal Pradesh</SelectItem>
                  <SelectItem value="Jharkhand">Jharkhand</SelectItem>
                  <SelectItem value="Karnataka">Karnataka</SelectItem>
                  <SelectItem value="Kerala">Kerala</SelectItem>
                  <SelectItem value="Madhya Pradesh">Madhya Pradesh</SelectItem>
                  <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                  <SelectItem value="Manipur">Manipur</SelectItem>
                  <SelectItem value="Meghalaya">Meghalaya</SelectItem>
                  <SelectItem value="Mizoram">Mizoram</SelectItem>
                  <SelectItem value="Nagaland">Nagaland</SelectItem>
                  <SelectItem value="Odisha">Odisha</SelectItem>
                  <SelectItem value="Punjab">Punjab</SelectItem>
                  <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                  <SelectItem value="Sikkim">Sikkim</SelectItem>
                  <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                  <SelectItem value="Telangana">Telangana</SelectItem>
                  <SelectItem value="Tripura">Tripura</SelectItem>
                  <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                  <SelectItem value="Uttarakhand">Uttarakhand</SelectItem>
                  <SelectItem value="West Bengal">West Bengal</SelectItem>


                  <SelectItem value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</SelectItem>
                  <SelectItem value="Chandigarh">Chandigarh</SelectItem>
                  <SelectItem value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</SelectItem>
                  <SelectItem value="Delhi">Delhi</SelectItem>
                  <SelectItem value="Jammu and Kashmir">Jammu and Kashmir</SelectItem>
                  <SelectItem value="Ladakh">Ladakh</SelectItem>
                  <SelectItem value="Lakshadweep">Lakshadweep</SelectItem>
                  <SelectItem value="Puducherry">Puducherry</SelectItem>

              </SelectContent>
            </Select>
            {errors.state && <p className="text-red-500 text-xs">{errors.state}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="pinCode">Pin Code <span className="text-red-500">*</span></Label>
            <Input
              id="pinCode"
              type="text"
              value={formData.pinCode}
              onChange={handleChange}
              className={`${errors.pinCode ? "border-red-500" : ""} ${readOnlyClass}`}
              required
              disabled={isReadOnly}
            />
            {errors.pinCode && <p className="text-red-500 text-xs">{errors.pinCode}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="localGuardian">Local Guardian</Label>
            <Input
              id="localGuardian"
              type="text"
              value={formData.localGuardian}
              onChange={handleChange}
              className={`${errors.localGuardian ? "border-red-500" : ""} ${readOnlyClass}`}
              disabled={isReadOnly}
            />
            {errors.localGuardian && <p className="text-red-500 text-xs">{errors.localGuardian}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="localGuardianContact">Guardian Contact</Label>
            <Input
              id="localGuardianContact"
              type="tel"
              value={formData.localGuardianContact}
              onChange={handleChange}
              className={`${errors.localGuardianContact ? "border-red-500" : ""} ${readOnlyClass}`}
              disabled={isReadOnly}
            />
            {errors.localGuardianContact && <p className="text-red-500 text-xs">{errors.localGuardianContact}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="localGuardianAddress">Guardian Address</Label>
            <textarea
              id="localGuardianAddress"
              rows={2}
              className={`resize-none border ${errors.localGuardianAddress ? "border-red-500" : "border-gray-300"} rounded-md w-full p-2 ${readOnlyClass}`}
              value={formData.localGuardianAddress}
              onChange={handleChange}
              disabled={isReadOnly}
            />
            {errors.localGuardianAddress && <p className="text-red-500 text-xs">{errors.localGuardianAddress}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="addharNumber">Aadhaar Number <span className="text-red-500">*</span></Label>
            <Input
              id="addharNumber"
              type="text"
              value={formData.addharNumber}
              onChange={handleChange}
              className={`${errors.addharNumber ? "border-red-500" : ""} ${readOnlyClass}`}
              disabled={isReadOnly}
            />
            {errors.addharNumber && <p className="text-red-500 text-xs">{errors.addharNumber}</p>}
          </div>


       {/* Document Upload Section */}
       <div className="flex items-center justify-center col-span-1 sm:col-span-2 lg:col-start-2 lg:col-end-4 w-full bg-gray-100">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full">
        <h2 className="text-xl font-bold mb-4 text-center">Upload Documents Here</h2>

        <div className="flex flex-col gap-6">
          {/* Photo Upload Section */}
          <div className="border rounded-lg p-4 bg-white">
            <h3 className="font-medium mb-2">Profile Photo <span className="text-red-500">*</span></h3>
            <FileUpload
              label="Upload Photo (Passport size)"
              accept="image/*"
              fieldName="profilePhoto"
              fileUrl={formData.photoLink !== "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrxb9rKS0KgjTtqrKPK8dodc0pEeaoC-pY_w&s" ? formData.photoLink : null}
              onUploadSuccess={(url) => {
                updateFormData({ photoLink: url });
              }}
              disabled={isReadOnly}
            />
            {errors.photoLink && <p className="text-red-500 text-xs mt-1">{errors.photoLink}</p>}
            {formData.photoLink && formData.photoLink !== "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrxb9rKS0KgjTtqrKPK8dodc0pEeaoC-pY_w&s" && (
              <div className="mt-3 flex items-center">
                <div className="w-12 h-12 mr-3 overflow-hidden rounded border">
                  <img
                    src={formData.photoLink}
                    alt="Uploaded photo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm text-green-600 font-medium">Photo uploaded successfully</p>
                  <a
                    href={formData.photoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    View uploaded photo
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Aadhar Card Document Upload Section */}
          <div className="border rounded-lg p-4 bg-white">
            <h3 className="font-medium mb-2">Aadhar Card Document <span className="text-red-500">*</span></h3>
            <FileUpload
              label="Upload Aadhar Card"
              accept="image/*,.pdf"
              fieldName="aadharCard"
              fileUrl={formData.aadharCardDocument}
              onUploadSuccess={(url) => {
                updateFormData({ aadharCardDocument: url });
              }}
              disabled={isReadOnly}
            />
            {errors.aadharCardDocument && <p className="text-red-500 text-xs mt-1">{errors.aadharCardDocument}</p>}
            {formData.aadharCardDocument && (
              <div className="mt-3 flex items-center">
                {formData.aadharCardDocument.includes('.pdf') ? (
                  <div className="w-12 h-12 mr-3 flex items-center justify-center bg-gray-100 rounded border">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-12 h-12 mr-3 overflow-hidden rounded border">
                    <img
                      src={formData.aadharCardDocument}
                      alt="Uploaded document"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <p className="text-sm text-green-600 font-medium">Aadhar card document uploaded successfully</p>
                  <a
                    href={formData.aadharCardDocument}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    View uploaded document
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>


   {/* Buttons Section */}
              <div className="flex justify-between gap-4 col-span-1 sm:col-span-2 lg:col-span-4 w-full">
                <div className="flex-1 relative group">
                  <Button
                    className="w-full"
                    type="button"
                    variant="outline"
                    onClick={handleClear}
                    disabled={submitting || isReadOnly}
                  >
                    Clear
                  </Button>
                  {isReadOnly && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                      Form is in read-only mode
                    </div>
                  )}
                </div>
                <div className="flex-1 relative group">
                  <Button
                    className="w-full"
                    type="submit"
                    disabled={submitting || isReadOnly}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : "Submit"}
                  </Button>
                  {isReadOnly && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                      {status === 'profile_submitted' ? 'Your profile is already submitted and awaiting approval' :
                       status === 'approved' ? 'Your profile has been approved' : 'Form is in read-only mode'}
                    </div>
                  )}
                </div>
              </div>
      </div>

      </div>



    </form>
  )
}

function CalendarDaysIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  )
}



