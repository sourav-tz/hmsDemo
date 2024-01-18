import styles from './Modal.module.scss';
import Button from '../Button/Button';
import { animated,useSpring } from '@react-spring/web';
import { useEffect, useState } from 'react';
import { CgClose } from "react-icons/cg";
import { useSelector,useDispatch } from 'react-redux';
import { changeModalState } from '../../Store/Reducers/viewInfoSlice';
import LoadingPage from '../Loadingpage/Loadingpage';


const Modal = ({data})=>{

    const [loadingModal,setLoading] = useState(true);
    const mopen = useSelector(state => state.viewInfoStates.modalState);
    const [mdata,setMData] = useState({})

    useEffect(()=>{
        if(data){
        ;(async function(){
            const myData = await data;
            setMData(myData);
            setLoading(false);
        })()
    }
    },[data])
    const Dispatcher = useDispatch();


    const handleEscapeKey = (event) => {
        if (event.key === 'Escape') {
            Dispatcher(changeModalState(false));

        }
      };
    
      useEffect(() => {
        // Add event listener when component mounts
        window.addEventListener('keydown', handleEscapeKey);
    
        // Remove event listener when component unmounts
        return () => {
          window.removeEventListener('keydown', handleEscapeKey);
        };
      }, []); 




    const props = useSpring({
        from:{opacity:"0",transform:"scale(0%)"},
        to:{opacity:mopen?"1":"0",transform:mopen?"scale(100%)":"scale(0%)"},

    })

    return<>
    <animated.div style={props} className={styles.container+' '+(mopen?null:styles.invisible)}>
    <div className={styles.header}>
    <div className={styles.title}><h2>Student Details</h2></div>
        <div onClick={()=>{Dispatcher(changeModalState())}} className={styles.closeIcon}>
        <CgClose size="25"/>
        </div>
    </div>

    {loadingModal?null:<div className={styles.content}>
            <div className={styles.details}>
            <p>Roll No: {mdata.rollNo}</p>
            <p>Name: {mdata.firstName + ' '+ mdata.lastName}</p>
            <p>email: {mdata.email}</p>
            <p>Course: {mdata.courseId}</p>
            <p>year: {mdata.year}</p>
            <p>Room Id: {mdata.roomId}</p>
            <p>Contact Number: {mdata.profile.contactNumber}</p>
            <p>Secondary Contact: {mdata.profile.secondaryContact}</p>
            <p>Hostel No: {mdata.hostelNo}</p>
            <p>gender: {mdata.profile.gender}</p>
            <p>Date of Birth: {mdata.profile.dob}</p>
            <p>personal Email: {mdata.profile.pEmail}</p>
            <p>Father's Name: {mdata.profile.fatherName}</p>
            <p>Father's Contact: {mdata.profile.fatherContact}</p>
            <p>Father's Occupation: {mdata.profile.fatherOccupation}</p>
            <p>Mother's Name: {mdata.profile.motherName}</p>
            <p>Mother's Contact: {mdata.profile.motherContact}</p>
            <p>Mother's Occupation: {mdata.profile.motherOccupation}</p>
            <p>Blood Group: {mdata.profile.bloodGroup}</p>
            <p>Address: {mdata.profile.subAddress}</p>
            <p>City: {mdata.profile.city}</p>
            <p>State: {mdata.profile.state}</p>
            <p>Pin Code: {mdata.profile.pinCode}</p>
            <p>Addhar Number: {mdata.profile.addharNumber}</p>
            <p>Identificaton Mark: {mdata.profile.identificationMark}</p>
            </div>
        
    </div>}
    </animated.div>
    </>
}


export default Modal;