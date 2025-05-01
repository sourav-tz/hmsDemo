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

export default function StudentSelfProfiling() {
  const userData = useSelector(state => state.userStorage.data);
  const [isTempStudent, setIsTempStudent] = useState(false);
  const [status, setStatus] = useState('pending');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [date, setDate] = useState();
  const [rejectionReason, setRejectionReason] = useState('');

  // Track last save time
  const [lastSaved, setLastSaved] = useState(null);

  // Track saving status (for animation)
  const [isSaving, setIsSaving] = useState(false);

  // Track form completion progress
  const [formProgress, setFormProgress] = useState(0);

  // Reference for localStorage save timeout (debounce)
  const saveTimeoutRef = useRef(null);

  // Get saved form data from localStorage or use default values
  const getSavedFormData = () => {
    const savedData = localStorage.getItem('tempStudentFormData');
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (error) {
        console.error('Error parsing saved form data:', error);
      }
    }
    return {
      rollNo: "",
      firstName: "",
      lastName: "",
      dob: "",
      course: "",
      semester: "",
      branch: "",
      contactNumber_1: "",
      contactNumber_2: "",
      phoneNumber: "", // Added phoneNumber field
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
    };
  };

  // Form state
  const [formData, setFormData] = useState(getSavedFormData());

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
      'contactNumber_1', 'gender', 'fatherName', 'fatherContact',
      'motherName', 'motherContact', 'address', 'city', 'state',
      'pinCode', 'email','aadharCardDocument','photoLink'
    ];

    // Count filled required fields
    const filledFields = requiredFields.filter(field =>
      data[field] && data[field].toString().trim() !== ''
    ).length;

    // Calculate percentage
    const percentage = Math.round((filledFields / requiredFields.length) * 100);

    return percentage;
  }, []);

  // Custom setFormData function that also saves to localStorage with debounce
  const updateFormData = useCallback((newData) => {
    setFormData(prevData => {
      const updatedData = { ...prevData, ...newData };

      // Don't save to localStorage if profile is already submitted
      if (status !== 'profile_submitted' && status !== 'approved') {
        // Show saving indicator
        setIsSaving(true);

        // Calculate and update form progress
        const progress = calculateFormProgress(updatedData);
        setFormProgress(progress);

        // Debounce localStorage save to prevent excessive writes
        // Clear any existing timeout
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }

        // Set a new timeout (500ms debounce)
        saveTimeoutRef.current = setTimeout(() => {
          // Add timestamp to the data
          const dataWithTimestamp = {
            ...updatedData,
            timestamp: new Date().getTime()
          };

          // Save to localStorage
          localStorage.setItem('tempStudentFormData', JSON.stringify(dataWithTimestamp));
          console.log("Saved complete form data to localStorage:", dataWithTimestamp);

          // Update last saved time
          setLastSaved(new Date());

          // Hide saving indicator after a short delay (for visual feedback)
          setTimeout(() => {
            setIsSaving(false);
          }, 300);
        }, 500);
      }

      return updatedData;
    });
  }, [status, calculateFormProgress]);

  // Validate a single field
  const validateField = useCallback((id, value) => {
    let error = null;

    // Skip validation if field is empty (will be caught by required field validation on submit)
    if (!value || value.trim() === '') {
      return null;
    }

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
      case 'contactNumber_2':
      case 'phoneNumber':
      case 'fatherContact':
      case 'motherContact':
      case 'localGuardianContact':
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

      // Check if we have localStorage data
      const savedFormData = localStorage.getItem('tempStudentFormData');
      const savedStatus = localStorage.getItem('tempStatus');
      let useLocalData = false;
      let parsedLocalData = null;

      // Try to parse localStorage data if available
      if (savedFormData) {
        try {
          parsedLocalData = JSON.parse(savedFormData);
          console.log("Found saved form data in localStorage");
        } catch (error) {
          console.error('Error parsing saved form data:', error);
        }
      }

      // Set initial status from localStorage if available
      if (savedStatus) {
        setStatus(savedStatus);
        console.log("Setting initial status from localStorage:", savedStatus);
      }

      // Fetch profile data from API (we still need this for status updates)
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
          // Always update status from API
          const apiStatus = response.data.status || 'pending';
          setStatus(apiStatus);
          localStorage.setItem('tempStatus', apiStatus);
          console.log("Setting status from API to:", apiStatus);

          // Set rejection reason if applicable
          if (apiStatus === 'rejected' && response.data.rejectionReason) {
            setRejectionReason(response.data.rejectionReason);
            localStorage.setItem('rejectionReason', response.data.rejectionReason);

            // For rejected profiles, if we have API data but no localStorage data,
            // immediately save the API data to localStorage so it's available on refresh
            if (response.data.exists && !parsedLocalData && apiStatus === 'rejected') {
              const profile = response.data.profile;
              const formDataToSave = {
                rollNo: profile.rollNo || "",
                firstName: profile.firstName || "",
                lastName: profile.lastName || "",
                dob: profile.dob || "",
                course: profile.course || "",
                semester: profile.semester?.toString() || "",
                branch: profile.branch || "",
                contactNumber_1: profile.contactNumber_1 || "",
                contactNumber_2: profile.contactNumber_2 || "",
                phoneNumber: profile.phoneNumber || profile.contactNumber_1 || "",
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
                localGuardianContact: profile.localGuardianContact || "",
                localGuardianAddress: profile.localGuardianAddress || "",
                addharNumber: profile.addharNumber || "",
                aadharCardDocument: profile.aadharCardDocument || "",
                photoLink: profile.photoLink || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrxb9rKS0KgjTtqrKPK8dodc0pEeaoC-pY_w&s",
                timestamp: new Date().getTime()
              };
              localStorage.setItem('tempStudentFormData', JSON.stringify(formDataToSave));
              console.log("Saved API data to localStorage for rejected profile");
            }
          }

          // Decide whether to use localStorage data or API data based on status
          if (parsedLocalData) {
            // Status-based decision logic
            switch (apiStatus) {
              case 'pending':
                // For pending status, prefer localStorage data (user might be in the middle of filling the form)
                useLocalData = true;
                console.log("Using localStorage data for pending form");
                break;

              case 'rejected':
                // For rejected status, prefer localStorage data (user might be correcting the form)
                useLocalData = true;
                console.log("Using localStorage data for rejected form");
                break;

              case 'profile_submitted':
              case 'approved':
                // For submitted or approved status, use API data (official submission)
                useLocalData = false;
                console.log(`Using API data for ${apiStatus} form`);

                // Clear localStorage data for submitted/approved forms
                // This prevents stale data from being used if status changes later
                localStorage.removeItem('tempStudentFormData');
                break;

              default:
                // For unknown status, prefer localStorage data
                useLocalData = true;
                console.log(`Unknown status: ${apiStatus}, using localStorage data`);
            }
          }

          // Apply the selected data source
          if (useLocalData && parsedLocalData) {
            // Use localStorage data
            setFormData(parsedLocalData);

            // Set date if available in localStorage data
            if (parsedLocalData.dob) {
              try {
                const dobDate = new Date(parsedLocalData.dob);
                setDate(dobDate);
              } catch (e) {
                console.error("Error parsing date from localStorage:", e);
              }
            }
          } else if (response.data.exists) {
            // Use API data
            const profile = response.data.profile;

            // Format date if it exists
            if (profile.dob) {
              const dobDate = new Date(profile.dob);
              setDate(dobDate);
            }

            // Create form data object from API
            const apiFormData = {
              rollNo: profile.rollNo || "",
              firstName: profile.firstName || "",
              lastName: profile.lastName || "",
              dob: profile.dob || "",
              course: profile.course || "",
              semester: profile.semester?.toString() || "",
              branch: profile.branch || "",
              contactNumber_1: profile.contactNumber_1 || "",
              contactNumber_2: profile.contactNumber_2 || "",
              phoneNumber: profile.phoneNumber || profile.contactNumber_1 || "", // Use contactNumber_1 as fallback
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
              localGuardianContact: profile.localGuardianContact || "",
              localGuardianAddress: profile.localGuardianAddress || "",
              addharNumber: profile.addharNumber || "",
              aadharCardDocument: profile.aadharCardDocument || "",
              photoLink: profile.photoLink || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrxb9rKS0KgjTtqrKPK8dodc0pEeaoC-pY_w&s"
            };

            // Set form data in state
            setFormData(apiFormData);

            // For rejected profiles, always save API data to localStorage
            // This ensures the complete form data is available on refresh
            if (apiStatus === 'rejected') {
              const dataToSave = {
                ...apiFormData,
                timestamp: new Date().getTime()
              };
              localStorage.setItem('tempStudentFormData', JSON.stringify(dataToSave));
              console.log("Saved API data to localStorage for rejected profile (from else-if block)");
            }
          } else if (parsedLocalData) {
            // If API doesn't have profile data but we have localStorage data, use that
            setFormData(parsedLocalData);

            // Set date if available in localStorage data
            if (parsedLocalData.dob) {
              try {
                const dobDate = new Date(parsedLocalData.dob);
                setDate(dobDate);
              } catch (e) {
                console.error("Error parsing date from localStorage:", e);
              }
            }
          }
        } else {
          // If API call was successful but didn't return profile data
          // Try to use localStorage data if available
          if (parsedLocalData) {
            setFormData(parsedLocalData);

            // Set date if available in localStorage data
            if (parsedLocalData.dob) {
              try {
                const dobDate = new Date(parsedLocalData.dob);
                setDate(dobDate);
              } catch (e) {
                console.error("Error parsing date from localStorage:", e);
              }
            }
          }
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
        } else {
          // For other errors, show the error message
          toast.error(errorMessage);
        }

        // If API call failed but we have localStorage data, use that
        if (parsedLocalData) {
          setFormData(parsedLocalData);

          // Set date if available in localStorage data
          if (parsedLocalData.dob) {
            try {
              const dobDate = new Date(parsedLocalData.dob);
              setDate(dobDate);
            } catch (e) {
              console.error("Error parsing date from localStorage:", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Unexpected error in fetchProfileData:", error);

      // Try to use localStorage data if available
      tryUseLocalStorageData();
    } finally {
      setLoading(false);
    }
  }, [userData]);

  // Helper function to try using localStorage data
  const tryUseLocalStorageData = () => {
    const savedFormData = localStorage.getItem('tempStudentFormData');
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        setFormData(parsedData);
        console.log("Using localStorage data after API error:", parsedData);

        // Try to set date if dob exists
        if (parsedData.dob) {
          try {
            const dobDate = new Date(parsedData.dob);
            setDate(dobDate);
            console.log("Set date from localStorage:", dobDate);
          } catch (e) {
            console.error("Error parsing date from localStorage:", e);
          }
        }

        // Also try to get status from localStorage
        const savedStatus = localStorage.getItem('tempStatus');
        if (savedStatus) {
          setStatus(savedStatus);
          console.log("Using saved status from localStorage after error:", savedStatus);

          // If status is rejected, check for saved rejection reason
          if (savedStatus === 'rejected') {
            const savedReason = localStorage.getItem('rejectionReason');
            if (savedReason) {
              setRejectionReason(savedReason);
              console.log("Using saved rejection reason from localStorage");
            }
          }
        }
      } catch (error) {
        console.error('Error parsing saved form data:', error);
      }
    } else {
      console.log("No saved form data found in localStorage");
    }
  };

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
    if (!formData.fatherName) newErrors.fatherName = "Father's name is required";
    if (!formData.fatherContact) newErrors.fatherContact = "Father's contact is required";
    if (!formData.motherName) newErrors.motherName = "Mother's name is required";
    if (!formData.motherContact) newErrors.motherContact = "Mother's contact is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.pinCode) newErrors.pinCode = "Pin code is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.email) newErrors.photoLink = "Student Photo is required";
    if (!formData.email) newErrors.aadharCardDocument = "Aadhar Card Photo is required";

    // Format validation using validateField function for consistency
    const fieldsToValidate = [
      'rollNo', 'email', 'firstName', 'lastName', 'contactNumber_1', 'contactNumber_2',
      'phoneNumber', 'fatherContact', 'motherContact', 'localGuardianContact',
      'pinCode', 'addharNumber', 'identificationMark', 'fatherName', 'motherName',
      'localGuardian', 'fatherOccupation', 'motherOccupation', 'photoLink','aadharCardDocument'
    ];

    // Validate each field that has a value
    fieldsToValidate.forEach(field => {
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
      toast.error("Please correct the errors in the form");
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
        toast.error("Roll number already exists in the system");
        setSubmitting(false);
        return;
      }
    } catch (error) {
      console.error("Error checking roll number:", error);
      // Continue with submission even if roll number check fails
    }

    // Ensure data types match what backend expects
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
        toast.success("Profile submitted successfully");
        setStatus('profile_submitted');
        localStorage.setItem('tempStatus', 'profile_submitted');

        // Clear localStorage form data after successful submission
        // This ensures that if the status changes later, we don't have stale data
        localStorage.removeItem('tempStudentFormData');

        // If this was a resubmission after rejection, clear the rejection reason
        if (status === 'rejected') {
          setRejectionReason('');
          localStorage.removeItem('rejectionReason');
        }
      } else {
        toast.error(response.data.message || "Failed to submit profile");
      }
    } catch (error) {
      console.error("Error submitting profile:", error);
      if (error.response?.data?.errors) {
        // Handle validation errors from the server
        const serverErrors = {};
        error.response.data.errors.forEach(err => {
          serverErrors[err.path] = err.msg;
        });
        setErrors(serverErrors);
        toast.error("Please correct the errors in the form");
      } else {
        toast.error("Failed to submit profile. Please try again.");
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
    const defaultFormData = {
      rollNo: "",
      firstName: "",
      lastName: "",
      dob: "",
      course: "",
      semester: "",
      branch: "",
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
    };

    // Clear form data in state
    setFormData(defaultFormData);

    // Clear form data in localStorage
    localStorage.removeItem('tempStudentFormData');

    // Reset other state
    setDate(null);
    setErrors({});

    // Show success message
    toast.success("Form data cleared successfully");
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

      // Try to load data from localStorage first for immediate display
      const savedFormData = localStorage.getItem('tempStudentFormData');
      if (savedFormData) {
        try {
          const parsedData = JSON.parse(savedFormData);
          setFormData(parsedData);
          console.log("Loaded initial form data from localStorage");

          // Set date if available
          if (parsedData.dob) {
            try {
              const dobDate = new Date(parsedData.dob);
              setDate(dobDate);
            } catch (e) {
              console.error("Error parsing date from localStorage:", e);
            }
          }
        } catch (error) {
          console.error('Error parsing saved form data:', error);
        }
      }

      // Fetch profile data from API (may override localStorage data based on status)
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

          {/* Auto-save Indicator */}
          {status !== 'profile_submitted' && status !== 'approved' && (
            <div className="text-xs text-gray-500 mt-1 mb-3 flex items-center justify-center">
              {isSaving ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Saving changes...</span>
                </div>
              ) : lastSaved ? (
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  <span>Changes will be saved automatically</span>
                </div>
              )}
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div className="space-y-1">
            <Label htmlFor="rollNo">Roll Number</Label>
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
            <Label htmlFor="firstName">First Name</Label>
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
            <Label htmlFor="dob">Date of Birth</Label>
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
              <Label htmlFor="course">Course</Label>
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
              <Label htmlFor="semester">Semester</Label>
              <Select
                value={formData.semester}
                onValueChange={(value) => handleSelectChange(value, 'semester')}
                required
                disabled={isReadOnly}
              >
                <SelectTrigger id="semester" className={`${errors.semester ? "border-red-500" : ""} ${readOnlyClass}`}>
                  <SelectValue placeholder="Select Semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1st</SelectItem>
                  <SelectItem value="2">2nd</SelectItem>
                  <SelectItem value="3">3rd</SelectItem>
                  <SelectItem value="4">4th</SelectItem>
                  <SelectItem value="5">5th</SelectItem>
                  <SelectItem value="6">6th</SelectItem>
                  <SelectItem value="7">7th</SelectItem>
                  <SelectItem value="8">8th</SelectItem>
                </SelectContent>
              </Select>
              {errors.semester && <p className="text-red-500 text-xs">{errors.semester}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="branch">Branch</Label>
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
            <Label htmlFor="contactNumber_1">Contact Number*</Label>
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
            <Label htmlFor="email">Email</Label>
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
              className={readOnlyClass}
              disabled={isReadOnly}
            />
          </div>

          <div className="flex space-x-4 col-span-1">
            {/* Blood Group */}
            <div className="w-1/2 space-y-1">
              <Label htmlFor="bloodGroup">Blood Group</Label>
              <Select
                value={formData.bloodGroup}
                onValueChange={(value) => handleSelectChange(value, 'bloodGroup')}
                disabled={isReadOnly}
              >
                <SelectTrigger id="bloodGroup" className={readOnlyClass}>
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
            </div>

            {/* Gender */}
            <div className="w-1/2 space-y-1">
              <Label htmlFor="gender">Gender</Label>
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
            <Label htmlFor="fatherName">Father&apos;s Name</Label>
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
            <Label htmlFor="fatherContact">Father&apos;s Contact</Label>
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
              className={readOnlyClass}
              disabled={isReadOnly}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="motherName">Mother&apos;s Name</Label>
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
            <Label htmlFor="motherContact">Mother&apos;s Contact</Label>
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
              className={readOnlyClass}
              disabled={isReadOnly}
            />
          </div>



          <div className="space-y-1">
            <Label htmlFor="address">Address</Label>
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
            <Label htmlFor="city">City</Label>
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
            <Label htmlFor="state">State</Label>
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
            <Label htmlFor="pinCode">Pin Code</Label>
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
            <Label htmlFor="localGuardian">Local Guardian (if any)</Label>
            <Input
              id="localGuardian"
              type="text"
              value={formData.localGuardian}
              onChange={handleChange}
              className={readOnlyClass}
              disabled={isReadOnly}
            />
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
              className={`resize-none border border-gray-300 rounded-md w-full p-2 ${readOnlyClass}`}
              value={formData.localGuardianAddress}
              onChange={handleChange}
              disabled={isReadOnly}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="addharNumber">Aadhaar Number</Label>
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
            <h3 className="font-medium mb-2">Profile Photo</h3>
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
            <h3 className="font-medium mb-2">Aadhar Card Document</h3>
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



