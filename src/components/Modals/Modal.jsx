import styles from "./Modal.module.scss";
import Button from "../Button/Button";
import { animated, useSpring } from "@react-spring/web";
import { useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";
import { useSelector, useDispatch } from "react-redux";
import { changeModalState } from "../../Store/Reducers/viewInfoSlice";
import LoadingPage from "../Loadingpage/Loadingpage";

const Modal = ({ data }) => {
  const [loadingModal, setLoading] = useState(true);
  const mopen = useSelector((state) => state.viewInfoStates.modalState);
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

  const handleEscapeKey = (event) => {
    if (event.key === "Escape") {
      Dispatcher(changeModalState(false));
    }
  };

  useEffect(() => {
    // Add event listener when component mounts
    window.addEventListener("keydown", handleEscapeKey);

    // Remove event listener when component unmounts
    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

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

  return (
    <>
      <animated.div
        style={props}
        className={styles.container + " " + (mopen ? null : styles.invisible)}
      >
        <div className={styles.header}>
          <div className={styles.title}>
            <h1 className="font-bold text-2xl bg-#131133">Student Details</h1>
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

        {loadingModal ? null : (
          <div className={styles.content + " "}>

            <div className="w-3/4 flex-wrap display-full p-8 bg-blue-white shadow-xl rounded-xl m-10 bg-gray-50 ">

            <h1 className="text-2xl font-bold mb-6  text-[#5F57FF] text-center underline">Hostel Vivekanand</h1>
            
              <div className="max-w-5xl mx-auto">
                <h1 className="text-xl font-bold mb-4  text-[#5F57FF] ">Personal Information</h1>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-3 text-lg">
                  
                  <div className="col-span-1 ">
                    <div className=" p-1 flex ">
                      <h2 className="text font-bold mb-2 ">Name: </h2>
                      <div className="mx-1">{mdata.firstName} {mdata.lastName} </div>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="  p-1 flex">
                      <h2 className="text font-bold mb-2">Email : </h2>
                      <div className="  mx-1">{mdata.email} </div>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="  p-1 flex">
                      <h2 className="text font-bold mb-2">Course : </h2>
                      <div className="  mx-1">{mdata.courseId} </div>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="  p-1 flex">
                      <h2 className="text font-bold mb-2">Year:  </h2>
                      <div className="  mx-1">{mdata.year} </div>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="  p-1 flex">
                      <h2 className="text font-bold mb-2">Room Id:  </h2>
                      <div className="  mx-1">{mdata.roomId} </div>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="  p-1 flex">
                      <h2 className="text font-bold mb-2">Contact Number:  </h2>
                      <div className="  mx-1">{mdata.profile.contactNumber} </div>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="  p-1 flex">
                      <h2 className="text font-bold mb-2">Secondary C:  </h2>
                      <div className="  mx-1">{mdata.profile.secondaryContact} </div>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="  p-1 flex">
                      <h2 className="text font-bold mb-2">Hostel No:  </h2>
                      <div className="  mx-1">{mdata.hostelNo} </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="max-w-5xl mx-auto">
                <h1 className="text-xl font-bold mt-5 mb-2 text-[#5F57FF] text-ul underline-offset-8">
                  Additional Information
                </h1>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-3 text-lg"> 
            
                  <div className="col-span-1">
                    <div className="  p-1 flex">
                      <h2 className="text-lg font-bold mb-2">Gender:  </h2>
                      <div className="  mx-1">{mdata.profile.gender} </div>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="  p-1 flex">
                      <h2 className="text-lg font-bold mb-2">Date of Birth:  </h2>
                      <div className="  mx-1">{mdata.profile.dob} </div>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="  p-1 flex">
                      <h2 className="text-xl font-bold mb-2">P. Email :  </h2>
                      <div className="  mx-1">{mdata.profile.pEmail} </div>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="  p-1 flex">
                      <h2 className="text-lg font-bold mb-2">Father's Name: </h2>
                      <div className="  mx-1">{mdata.profile.fatherName} </div>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="  p-1 flex">
                      <h2 className="text-lg font-bold mb-2">Father's Contact:  </h2>
                      <div className="  mx-1">{mdata.profile.fatherContact} </div>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="  p-1 flex">
                      <h2 className="text-lg font-bold mb-2">Father's Occupation: </h2>
                      <div className="  mx-1">{mdata.profile.fatherOccupation} </div>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="  p-1 flex">
                      <h2 className="text-lg font-bold mb-2">Mother's Name:  </h2>
                      <div className="  mx-1">{mdata.profile.motherName} </div>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="  p-1 flex">
                      <h2 className="text-lg font-bold mb-2">Addhar Number: </h2>
                      <div className="  mx-1">{mdata.profile.addharNumber} </div>
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
