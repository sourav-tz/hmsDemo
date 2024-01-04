import styles from './UploadInfo.module.scss';
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
import StudentTable from '../../../../Components/StudentTable/StudentTable';

const UploadInfo = ()=>{

    const inputElement = useRef();
    const [file,setFiles] = useState(0);
    const [dragging, setDragging] = useState(false);
    const [rows,setRows] = useState(null);


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
                  reject("Duplicate Data");
                }else{
                    resolve();
              }
            })
            .catch(err => {
              console.log(err);
              reject("Server Error Or Format is Not Proper"); // Reject the Promise in case of an error
            });
        });
      };
      
      const handleFile = () => {
        setFiles(inputElement.current.files[0]);

      };
      
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
            <div className={styles.Header}><h1>Upload Student Info</h1></div>
            <div className={styles.uploadContainer}>

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

export default UploadInfo;