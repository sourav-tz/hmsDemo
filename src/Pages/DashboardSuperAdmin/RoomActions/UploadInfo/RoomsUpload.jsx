import styles from './RoomsUpload.module.scss';
import { IoIosCloudUpload } from "react-icons/io";
import Button from '../../../../Components/Button/Button';
import { useEffect, useRef,useState } from 'react';
import Progress from '../../../../Components/Progress/Progress';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import config from '../../../../config/config';
import formdataConfig from '../../../../config/formdata';
import axios from 'axios';
import TableLoader from '../../../../Components/TableLoader/TableLoader';
import StudentTable from '../../../../Components/Tables/StudentsTable/StudentTable';
import Accordion from '../../../../Components/Accordion/Accordion';
import { FaFileCsv } from "react-icons/fa6";
import FileCheckLoading from '../../../../Components/Loadingpage/FileCheckLoading';

const RoomsUpload = ()=>{

    const inputElement = useRef();
    const [file,setFiles] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [rows,setRows] = useState(null);
    const [step,setStep] = useState(1);


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






    const callFileUpload = () => {
        return new Promise((resolve, reject) => {
          const bodyForData = new FormData();
          bodyForData.append("file", file);
      
          axios
            .post('http://localhost:3000/SA/bulkCreate', bodyForData, {
              headers: {
                "Content-Type": "multipart/form-data; boundary=${formData.getBoundary()}",
                "x-rapidapi-host": "file-upload8.p.rapidapi.com",
                "x-rapidapi-key": "af582c969cmshc0186c63f1e9d28p10fbf5jsn1a1c05604d94",
              },
              withCredentials: true,
            })
            .then(res => {
             console.log(res);
             setStep(1);
             resolve(res.data);
            })
            .catch(err => {
              rej(err);
             console.log(err);
            });
        });
      };
      
      const errorFile = () => {
        toast.error("File is not in CSV !", {
          position: "top-right"
        });
      }

      useEffect(()=>{
        if(file!==null && file.name.split('.')[1]==='csv'){
          setStep(2);
        }else if(file!==null && file.name.split('.')[1]!=='csv'){
          setFiles(null);
          setStep(1);
          errorFile();

        }
      },[file])
      
      const handleFile =  () => {
        setStep(0);
        setFiles(inputElement.current.files[0]);
      };



    const uploadFile = ()=>{
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
      
    const handleButtonClick = ()=>{
        inputElement.current.click();

    }

    return<>
        <div className={styles.container+' mt-8'}>
            <div className={styles.Header}><h1 className='text-3xl'>Allocate Rooms</h1></div>
            <div className={styles.uploadContainer}>

                <div  className={styles.uploadArea+' '+(dragging?styles.drag:null)}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                {step===1?<><input className={styles.myFile} type="file" ref={inputElement} onChange={handleFile}/>
                    <IoIosCloudUpload size="60"/>
                    <p>Drag and Drop Files <br/>Or</p>
                    <Button onClick={handleButtonClick} variant="contained" style={{marginTop:'10px'}} text="Browser Files" /></>:null}
                    {step===0?<FileCheckLoading/>:null}
                    {step===2?<><div className='flex items-center'>
                      <FaFileCsv size="60"/><p className='ml-4'>{file.name}</p>
                    </div>
                    <div className='flex gap-4'>
                      <Button className="mt-4" onClick={()=>{setStep(1);setFiles(null);}} text="Discard"/>
                      <Button disable={false} onClick={uploadFile}  className="mt-4" variant="contained" text="Upload"/>
                    </div></>:null}
                </div>
                <div className={styles.uploadInfoAccord}>
                  <Accordion accordData={accordData}/>
                </div>

                {/* <TableLoader /> */}
                {/* <div className={styles.duplicateTable}>
                    <h3>Duplicate Data</h3>
                    <StudentTable />
                    <div className={styles.buttonArea}>
                        <Button text="Discard" />
                        <Button style={{marginLeft:'25px'}} variant="contained" text="Upload" />
                    </div>
                </div> */}
            </div>
            <ToastContainer />
        </div>
    </>

};


export default RoomsUpload;