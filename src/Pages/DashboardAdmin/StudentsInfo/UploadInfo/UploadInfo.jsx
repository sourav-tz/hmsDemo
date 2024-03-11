import styles from './UploadInfo.module.scss';
import { IoIosCloudUpload } from "react-icons/io";
import Button from '../../../../components/Button/Button';
import { useEffect, useRef,useState } from 'react';
import Progress from '../../../../components/Progress/Progress';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import config from '../../../../config/config';
import formdataConfig from '../../../../config/formdata';
import axios from 'axios';
import TableLoader from '../../../../components/TableLoader/TableLoader';
import StudentTable from '../../../../components/Tables/StudentsTable/StudentTable';
import Accordion from '../../../../components/Accordion/Accordion';
import { useSelector } from 'react-redux';


const UploadInfo = ()=>{

    const inputElement = useRef();
    const [file,setFiles] = useState(0);
    const [dragging, setDragging] = useState(false);
    const [rows,setRows] = useState(null);
    const [duplicate,setDuplicate] = useState([]);
    const [loading,setLoading] = useState(false);
    const updateData = useSelector(state=>state.uploadStudent.data);
    const [afterUpdateSuccess,setAfterUpdateSuccess] = useState([]);
    const [afterUpdateFailed, setAfterUpdateFailed] = useState([]);
    const [updateProcess, setUpdateProcess] = useState(false);

    useEffect(()=>{
      console.log(updateData);
    },[updateData])

  const accordData = [
    {
      title:'File Upload Instructions',
      Description:['Data Must be Uploaded in CSV Format.','Must Match The Fields in Demo File','Unique Data can only be uploaded once, But it can be modified after reuploading.'],

    },
    {
      title:'Demo CSV File',
      Description:['Click The Button Below To Download DEMO Csv File'],
      link:'../../../../Assets/main.csv'
    }
  ]





//Drag and drop code

const handleDragEnter = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();

    setDragging(false);

    // const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(e.dataTransfer.files[0]);

    // Process or upload the files as needed
    // You can perform additional logic here

    console.log('Dropped files:', droppedFiles);
  };


/// Make rollno and email are not editable everything else is editable



    const callFileUpload = () => {
      setLoading(true);
        return new Promise((resolve, reject) => {
          const bodyForData = new FormData();
          bodyForData.append("file", file);
      
          axios
            .post('http://localhost:3000/HA/bulkCreate', bodyForData, {
              headers: {
                "Content-Type": "multipart/form-data; boundary=${formData.getBoundary()}",
                "x-rapidapi-host": "file-upload8.p.rapidapi.com",
                "x-rapidapi-key": "af582c969cmshc0186c63f1e9d28p10fbf5jsn1a1c05604d94",
              },
              withCredentials: true,
            })
            .then(res => {
              console.log(res);
              setRows(res.data[1]);
              if(res.data[1].length!=0){
                  setLoading(false);
                  setDuplicate(res.data[1]);;
                  reject("Duplicate Data");
                }else if(res.data[0].length==0){
                  setLoading(false);
                    reject("Invalid Format in CSV");
              }else{
                setLoading(false);
                resolve();
              }
            })
            .catch(err => {
              setLoading(false);
              console.log(err);
              reject("Server Error Or Format is Not Proper"); // Reject the Promise in case of an error
            });
        });
      };
      
      const handleFile = () => {
        setFiles(inputElement.current.files[0]);

      };

      const updateStudents =async ()=>{
        setLoading(true);
        setUpdateProcess(true);
        try{
          const res = await axios.patch('http://localhost:3000/HA/updateBulk',updateData);
          setAfterUpdateSuccess(res.data[0])
          setAfterUpdateFailed(res.data[1])
          setLoading(false);

        }catch(err){
          setLoading(false);
          console.log(err);
        }

      }

      
      
      useEffect(() => {
        if (file) {
            toast.promise(
                callFileUpload(), // Use the Promise returned by callFileUpload
                {
                  pending: 'Uploading Data',
                  success: 'Data Uploaded Successfully 👌',
                  error: {
                    render({data}){
                      // When the promise reject, data will contains the error
                      return data;}
                    },
                },
              )
                .then(() => {
                  // Additional code to execute after the promise is resolved
                  inputElement.current.value = '';
                })
                .catch(error => {
                  // Handle errors here if needed
                  console.error(error);
                  inputElement.current.value = '';
                });
        }
      }, [file]);
      
    const handleButtonClick = ()=>{
        inputElement.current.click();

    }

    return<>
        <div className={styles.container}>
            <div className={styles.Header}><h1 className='text-3xl'>Upload Student Info</h1></div>
            {updateProcess==false&&duplicate.length===0&&loading===false?<div className={styles.uploadContainer}>

                <div  className={styles.uploadArea+' '+(dragging?styles.drag:null)}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                <input className={styles.myFile} type="file" ref={inputElement} onChange={handleFile}/>
                    <IoIosCloudUpload size="60"/>
                    <p>Drag and Drop Files <br/>Or</p>
                    <Button onClick={handleButtonClick} variant="contained" style={{marginTop:'10px'}} text="Browser Files" />
                </div>
                <div className={styles.uploadInfoAccord}>
                  <Accordion accordData={accordData}/>
                </div></div>:null}
                {loading?<TableLoader />:null}
                {duplicate.length!==0?<div className={styles.duplicateTable}>
                    <h3>Duplicate Data</h3>
                    <StudentTable data={duplicate}/>
                    <div className={styles.buttonArea}>
                        <Button onClick={()=>{setDuplicate([])}} text="Discard" />
                        <Button onClick={()=>{updateStudents();setDuplicate([]);}} style={{marginLeft:'25px'}} variant="contained" text="Update" />
                    </div>
                </div>:null}

                {updateProcess===true&&(afterUpdateFailed.length!==0 || afterUpdateSuccess.length!== 0 )?<div className={styles.duplicateTable}>
                    <h3>Successfull Data</h3>
                    <StudentTable data={afterUpdateSuccess}/>
                    <h3 className='mt-4'>Failed Data</h3>
                    <StudentTable data={afterUpdateFailed}/>
                    <div className={styles.buttonArea}>
                        <Button onClick={()=>{setDuplicate([])}} text="Discard" />
                        <Button onClick={()=>{setUpdateProcess(false);setDuplicate([]);}} style={{marginLeft:'25px'}} variant="contained" text="Ok" />
                    </div>
                </div>:null}

            <ToastContainer />
        </div>
    </>
};

export default UploadInfo;