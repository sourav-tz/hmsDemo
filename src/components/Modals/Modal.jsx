import styles from "./Modal.module.scss";
import axios from 'axios';

import { animated, useSpring } from "@react-spring/web";
import { useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";
import { useSelector, useDispatch } from "react-redux";
import { changeModalState } from "../../Store/Reducers/viewInfoSlice";
import PdfDownload from "../Tables/ViewInfoTable/PdfDownload";
import { toast } from 'react-toastify'



const Modal = ({ data }) => {
  const [loadingModal, setLoading] = useState(true);
  const mopen = useSelector((state) => state.viewInfoStates.modalState);

  const adminInfo = useSelector((state) => state.adminInfo);
  const [archiveLoading, setArchiveLoading] = useState(false);


  const [mdata, setMData] = useState({});

  useEffect(() => {
    if (data) {
      (async function () {
        const myData = await data;
        setMData(myData);
        setLoading(false);
      })();
    }
  }, [data]);
  const Dispatcher = useDispatch();

  // Event handler moved to the useEffect below

  const props = useSpring({
    from: { opacity: "0", transform: "scale(0%)" },
    to: {
      opacity: mopen ? "1" : "0",
      transform: mopen ? "scale(100%)" : "scale(0%)",
    },
    config: {
      duration: 200
    },
  });

  // Fix for React Hook useEffect missing dependency warning
  useEffect(() => {
    const handleEscapeKeyPress = (event) => {
      if (event.key === "Escape") {
        Dispatcher(changeModalState(false));
      }
    };

    window.addEventListener("keydown", handleEscapeKeyPress);
    return () => {
      window.removeEventListener("keydown", handleEscapeKeyPress);
    };
  }, [Dispatcher]);

  const addToArchiveTable = async (rollNo) => {
    try {
      setArchiveLoading(true);
      console.log(rollNo)
      const { data } = await axios.post(import.meta.env.VITE_BASE_URL + '/HA/student-archive', { rollNo });
      toast.success(data.message || 'Student archived successfully!');
      setArchiveLoading(false);
    } catch (error) {
      setArchiveLoading(false);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to archive student';
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <animated.div
        style={props}
        className={styles.container + " " + (mopen ? null : styles.invisible)}
        onClick={(e) => {
          // Close modal when clicking outside content
          if (e.target === e.currentTarget) {
            Dispatcher(changeModalState(false));
          }
        }}
      >

        {loadingModal ? (
          <div className={styles.content}>
            <div className={styles.header}>
              <div className={styles.title}>
                <h1 className="font-bold text-2xl">Student Details</h1>
              </div>
              <div
                onClick={() => {
                  Dispatcher(changeModalState());
                }}
                className={styles.closeIcon}
              >
                <CgClose size="25" />
              </div>
            </div>
            <div className={styles.scrollableContent}>
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.content} onClick={(e) => e.stopPropagation()}>
            <div className={styles.header}>
              <div className={styles.title}>
                <h1 className="font-bold text-2xl">Student Details</h1>
              </div>
              <div
                onClick={() => {
                  Dispatcher(changeModalState());
                }}
                className={styles.closeIcon}
              >
                <CgClose size="25" />
              </div>
            </div>
            <div className={styles.scrollableContent}>
              <div className="max-w-6xl mx-auto px-4">
              {/* Header with student photo */}
              <div className="flex flex-col md:flex-row items-center justify-between mb-8 pb-4 border-b border-gray-200">
                <div className="flex flex-col md:flex-row items-center">
                    <div className="flex flex-col justify-center items-center">
<div className="w-32 h-32 rounded-md overflow-hidden border-4 border-blue-100 flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                    {mdata.profile && mdata.profile.photoLink ? (
                      <img
                        src={mdata.profile.photoLink}
                        alt={`${mdata.firstName} ${mdata.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                          <a
                    href={mdata.profile.photoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-md mr-5 font-bold text-blue-600 hover:underline"
                  >
                    View Profile Photo
                  </a>
                  </div>
      
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">{mdata.firstName} {mdata.lastName}</h1>
                    <p className="text-gray-600">Roll No: <span className="font-semibold">{mdata.rollNo}</span></p>
                    <p className="text-gray-600">Hostel: <span className="font-semibold">{mdata.hostel?.hostelName ? `${mdata.hostel.hostelName} (Hostel ${mdata.hostelNo})` : `Hostel ${mdata.hostelNo}`}</span></p>
                  </div> 

                </div>
                <div className="flex items-center gap-4" style={{marginLeft:"300px"}}>
                  <PdfDownload myData={mdata} adminInfo={adminInfo} />
                  <button
                    onClick={() => {
                      console.log("Archiving rollNo:", mdata.rollNo);
                      addToArchiveTable(mdata.rollNo);
                    }}
                    disabled={archiveLoading}
                    className={`px-4 py-2.5 rounded-lg text-white transition-all ${
                      archiveLoading ? 'bg-yellow-400 cursor-not-allowed' : 'bg-yellow-600 hover:bg-yellow-500'
                    }`}
                    size="sm"
                  >
                    {archiveLoading ? 'Archiving...' : 'Archive'}
                  </button>
                </div>

                <div className="bg-blue-50 px-4 py-2 rounded-lg mt-4 md:mt-0">
                  
                  <p className="text-blue-700 font-medium">Year: <span className="font-bold">{mdata.year}</span></p>
                  <p className="text-blue-700 font-medium">Room: <span className="font-bold">{mdata.roomId || 'Not Assigned'}</span></p>
                </div>

              </div>

              {/* Student Basic Information */}
              <div className="mb-8 bg-white p-6 rounded-lg shadow border border-gray-200">
                <h2 className="text-xl font-bold mb-4 text-blue-600 pb-2 border-b border-blue-100">
                  Student Information
                </h2>
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <p className="text-gray-500 text-sm">Roll Number</p>
                    <p className="font-medium">{mdata.rollNo}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Year</p>
                    <p className="font-medium">{mdata.year || 'Not Available'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Status</p>
                    <p className="font-medium text-green-600">Active</p>
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div className="mb-8 bg-white p-6 rounded-lg shadow border border-gray-200">
                <h2 className="text-xl font-bold mb-4 text-blue-600 pb-2 border-b border-blue-100">
                  Academic Information
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  <div>
                    <p className="text-gray-500 text-sm">Course Name</p>
                    <p className="font-medium">{mdata.course?.courseName || 'Not Available'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Department</p>
                    <p className="font-medium">{mdata.course?.department || 'Not Available'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Course ID</p>
                    <p className="font-medium">{mdata.courseId || 'Not Available'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Email</p>
                    <p className="font-medium">{mdata.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Personal Email</p>
                    <p className="font-medium">{mdata.profile?.pEmail || 'Not Available'}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mb-8 bg-white p-6 rounded-lg shadow border border-gray-200">
                <h2 className="text-xl font-bold mb-4 text-blue-600 pb-2 border-b border-blue-100">
                  Contact Information
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  <div>
                    <p className="text-gray-500 text-sm">Primary Contact</p>
                    <p className="font-medium">{mdata.profile?.contactNumber || 'Not Available'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Secondary Contact</p>
                    <p className="font-medium">{mdata.profile?.secondaryContact || 'Not Available'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Phone Number</p>
                    <p className="font-medium">{mdata.profile?.phoneNumber || 'Not Available'}</p>
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              <div className="mb-8 bg-white p-6 rounded-lg shadow border border-gray-200">
                <h2 className="text-xl font-bold mb-4 text-blue-600 pb-2 border-b border-blue-100">
                  Personal Details
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  <div>
                    <p className="text-gray-500 text-sm">Gender</p>
                    <p className="font-medium">{mdata.profile?.gender || 'Not Available'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Date of Birth</p>
                    <p className="font-medium">{mdata.profile?.dob || 'Not Available'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Blood Group</p>
                    <p className="font-medium">{mdata.profile?.bloodGroup || 'Not Available'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Identification Mark</p>
                    <p className="font-medium">{mdata.profile?.identificationMark || 'Not Available'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Aadhar Number</p>
                    <p className="font-medium">{mdata.profile?.addharNumber || 'Not Available'}</p>
                  </div>
                </div>

                {/* Documents Section */}
                {mdata.profile?.aadharCardDocument && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h3 className="font-semibold mb-2">Aadhar Card Document</h3>
                    <div className="w-full max-w-xs overflow-hidden rounded-md">
                      {/* <img
                        src={mdata.profile.aadharCardDocument}
                        alt="Aadhar Card"
                        className="w-full object-contain "
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/150?text=No+Document";
                        }}
                      /> */}

                           <a
                    href={mdata.profile.aadharCardDocument}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-bold text-blue-600 hover:underline"
                  >
                    View uploaded document
                  </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Address Information */}
              <div className="mb-8 bg-white p-6 rounded-lg shadow border border-gray-200">
                <h2 className="text-xl font-bold mb-4 text-blue-600 pb-2 border-b border-blue-100">
                  Address Information
                </h2>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-gray-500 text-sm">Permanent Address</p>
                    <p className="font-medium">{mdata.profile?.subAddress || 'Not Available'}</p>
                    <p className="font-medium">{mdata.profile?.city && mdata.profile?.state ?
                      `${mdata.profile.city}, ${mdata.profile.state}${mdata.profile.pinCode ? ` - ${mdata.profile.pinCode}` : ''}` :
                      'Not Available'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Local Guardian Address</p>
                    <p className="font-medium">{mdata.profile?.localGuardianAddress || 'Not Available'}</p>
                  </div>
                </div>
              </div>

              {/* Family Information */}
              <div className="mb-8 bg-white p-6 rounded-lg shadow border border-gray-200">
                <h2 className="text-xl font-bold mb-4 text-blue-600 pb-2 border-b border-blue-100">
                  Family Information
                </h2>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <h3 className="font-semibold mb-2">Father&apos;s Details</h3>
                    <p className="text-gray-500 text-sm">Name</p>
                    <p className="font-medium mb-2">{mdata.profile?.fatherName || 'Not Available'}</p>
                    <p className="text-gray-500 text-sm">Contact</p>
                    <p className="font-medium mb-2">{mdata.profile?.fatherContact || 'Not Available'}</p>
                    <p className="text-gray-500 text-sm">Occupation</p>
                    <p className="font-medium">{mdata.profile?.fatherOccupation || 'Not Available'}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Mother&apos;s Details</h3>
                    <p className="text-gray-500 text-sm">Name</p>
                    <p className="font-medium mb-2">{mdata.profile?.motherName || 'Not Available'}</p>
                    <p className="text-gray-500 text-sm">Contact</p>
                    <p className="font-medium mb-2">{mdata.profile?.motherContact || 'Not Available'}</p>
                    <p className="text-gray-500 text-sm">Occupation</p>
                    <p className="font-medium">{mdata.profile?.motherOccupation || 'Not Available'}</p>
                  </div>
                </div>
              </div>

              {/* Local Guardian Information */}
              <div className="mb-4 bg-white p-6 rounded-lg shadow border border-gray-200">
                <h2 className="text-xl font-bold mb-4 text-blue-600 pb-2 border-b border-blue-100">
                  Local Guardian Information
                </h2>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-gray-500 text-sm">Name</p>
                    <p className="font-medium">{mdata.profile?.localGuardian || 'Not Available'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Contact</p>
                    <p className="font-medium">{mdata.profile?.localGuardianContact || 'Not Available'}</p>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>
        )}
        
      </animated.div>
    </>
  );
};

export default Modal;
