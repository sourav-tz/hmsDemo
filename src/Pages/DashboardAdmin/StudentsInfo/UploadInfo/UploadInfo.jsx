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
import { useSelector } from 'react-redux';
import FileCheckLoading from '../../../../components/Loadingpage/FileCheckLoading';
import { FaFileCsv } from "react-icons/fa6";
import { IoWarningOutline } from "react-icons/io5";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {Table,TableBody,TableCell,TableHead,TableRow} from '@/components/ui/table';
import {Card , CardHeader} from '@/components/ui/card';

const UploadInfo = ()=>{

    const inputElement = useRef();
    const [file,setFiles] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [rows,setRows] = useState(null);
    const [failedData,setFailedData] = useState([]);
    const [successData,setSuccessData] = useState([]);
    const [loading,setLoading] = useState(false);
    const updateData = useSelector(state=>state.uploadStudent.data);
    const [afterUpdateSuccess,setAfterUpdateSuccess] = useState([]);
    const [afterUpdateFailed, setAfterUpdateFailed] = useState([]);
    const [updateProcess, setUpdateProcess] = useState(false);
    const [step,setStep] = useState(1);
    const [mainSteps,setMainSteps] = useState(0);
    const [courseId,setCourseId] = useState([]);
    const userData = useSelector(state=>state.userStorage.data);

    useEffect(()=>{
      console.log(updateData);
    },[updateData])

    const indianStates = [
      {name:'Andhra Pradesh',value:'ap'},
      {name:'Arunachal Pradesh',value:'ar'},
      {name:'Assam',value:'as'},
      {name:'Bihar',value:'br'},
      {name:'Chhattisgarh',value:'cg'},
      {name:'Goa',value:'ga'},
      {name:'Gujarat',value:'gj'},
      {name:'Haryana',value:'hr'},
      {name:'Himachal Pradesh',value:'hp'},
      {name:'Jharkhand',value:'jh'},
      {name:'Karnataka',value:'ka'},
      {name:'Kerala',value:'kl'},
      {name:'Madhya Pradesh',value:'mp'},
      {name:'Maharashtra',value:'mh'},
      {name:'Manipur',value:'mn'},
      {name:'Meghalaya',value:'ml'},
      {name:'Mizoram',value:'mz'},
      {name:'Nagaland',value:'nl'},
      {name:'Odisha',value:'or'},
      {name:'Punjab',value:'pb'},
      {name:'Rajasthan',value:'rj'},
      {name:'Sikkim',value:'sk'},
      {name:'Tamil Nadu',value:'tn'},
      {name:'Telangana',value:'tg'},
      {name:'Tripura',value:'tr'},
      {name:'Uttar Pradesh',value:'up'},
      {name:'Uttarakhand',value:'ut'},
      {name:'West Bengal',value:'wb'},
      {name:'Andaman and Nicobar Islands',value:'an'},
      {name:'Chandigarh',value:'ch'},
      {name:'Dadra and Nagar Haveli and Daman and Diu',value:'dd'},
      {name:'Lakshadweep',value:'ld'},
      {name:'Delhi',value:'dl'},
      {name:'Puducherry',value:'py'},
      {name:'None',value:'none'}
    ]



useEffect(()=>{
  ;(async ()=>{
    try{
        const res = await axios({
          url:import.meta.env.VITE_BASE_URL + '/HA/getCourses',
          method:'get',
          withCredentials:true
        })

        const temp = res.data.map(d=>{return `${d.courseId}-${d.courseName}-${d.department}`})
        setCourseId(temp);
    }catch(error){
      console.log(error)
      if(err.response.status===401){
        Navigator('/adminLogin');
      }
    }
  })()
},[])

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
          bodyForData.append("hostelNo",userData.dataValues.hostelNo);
          console.log(userData.dataValues.hostelNo);
          console.log(file);
      
          axios
            .post(import.meta.env.VITE_BASE_URL + '/HA/bulkCreate', bodyForData, {
              headers: {
                "Content-Type": "multipart/form-data; boundary=${formData.getBoundary()}",
                "x-rapidapi-host": "file-upload8.p.rapidapi.com",
                "x-rapidapi-key": "af582c969cmshc0186c63f1e9d28p10fbf5jsn1a1c05604d94",
              },
              withCredentials: true,
            })
            .then(res => {
              setMainSteps(1);
              setLoading(false)
              if(res.data[0].length!==0){
                setSuccessData(res.data[0]);
                if(res.data[1].length!==0){
                  resolve("Some Data Uploaded Successfully!!");
                }else{
                  resolve("All Data Uploaded Successfully");
                }
              }

              if(res.data[1].length!==0){
                setFailedData(res.data[1]);
                reject("Something Wrong in data!!!");
              }

              
            })
            .catch(err => {
              setLoading(false);
              console.log(err);
              if(err.response.status===401){
                Navigator('/adminLogin');
              }
              reject(err.response.data); // Reject the Promise in case of an error
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


      
      const handleFile = () => {
        setStep(0);
        setFiles(inputElement.current.files[0]);

      };

      const updateStudents =async ()=>{
        setLoading(true);
        setUpdateProcess(true);
        try{
          const res = await axios.patch(import.meta.env.VITE_BASE_URL + '/HA/updateBulk',updateData);
          setAfterUpdateSuccess(res.data[0])
          setAfterUpdateFailed(res.data[1])
          setLoading(false);

        }catch(err){
          setLoading(false);
          console.log(err);
          if(err.response.status===401){
            Navigator('/adminLogin');
          }
        }

      }

      const handleDownloadClick =()=>{
        ;(async ()=>{
          try{
            const res = await axios({
              url:import.meta.env.VITE_BASE_URL + '/HA/downloadfile?path=public/downloads/main.csv&filename=main.csv',
              method:'get',
              responseType: 'blob', // Important
              withCredentials: true

            })

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'main.csv'); //or any other extension
            document.body.appendChild(link);
            link.click();

          }catch(err){  
            console.log(err);
            if(err.response.status===401){
              Navigator('/adminLogin');
            }
          }
        })()
      }

      
      
      const uploadFile = () => {
        if (file) {
            toast.promise(
                callFileUpload(), // Use the Promise returned by callFileUpload
                {
                  pending: 'Uploading Data',
                  success: {
                    render({data}){
                      // When the promise reject, data will contains the error
                      return data;}
                    },
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
      }
      
    const handleButtonClick = ()=>{
        inputElement.current.click();

    }

    return<>
        <div className={styles.container + ' flex flex-col items-center w-full'}>
            <div className={styles.Header}><h1 className=' text-3xl mt-28 md:mt-4 text-blue-600'>Upload Student Info</h1></div>
            {updateProcess==false&&mainSteps===0&&loading===false?<div className={styles.uploadContainer + ' p-4 flex flex-col items-center w-full'}>

                <div  className={styles.uploadArea + ' p-4 min-h-[300px] w-full md:w-[600px]' +' '+(dragging?styles.drag:null)}
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
                <Accordion type="single" collapsible className="w-full md:w-[600px]">
      <AccordionItem value="item-1">
        <AccordionTrigger>File Upload Instructions</AccordionTrigger>
        <AccordionContent>
          <ul>
            <li className='py-2 flex items-center gap-2'><span className='text-yellow-600 text-2xl'><IoWarningOutline /></span> File must be in CSV format</li>
            <li className='py-2 flex items-center gap-2'><span className='text-yellow-600 text-2xl'><IoWarningOutline /></span> File Must have attributes and values defined in Demo Files Below</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Demo Files</AccordionTrigger>
        <AccordionContent>
        <div className=''>
        <p className='text-xs'>Download Demo CSV here <Button onClick={handleDownloadClick} text="Download" /></p>
        </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Course ID must be </AccordionTrigger>
        <AccordionContent>
          <ul>
            {courseId.map(d=><li>{d}</li>)}
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-4">
        <AccordionTrigger>States Must be From</AccordionTrigger>
        <AccordionContent>
          <Card>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>State Name</TableCell>
                <TableCell>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {indianStates.map(d=><TableRow>
                <TableCell>{d.name}</TableCell>
                <TableCell>{d.value}</TableCell>
              </TableRow>)}
            </TableBody>
          </Table>
          </Card>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
                </div></div>:null}
                {loading?<TableLoader />:null}
                {mainSteps==1?<div className={styles.duplicateTable + ' p-4 min-w-[300px] w-full md:w-[800px]'}>
                  <h3>Successfull Data</h3>
                    <StudentTable data={successData}/>
                    <h3 className='mt-4'>Failed Data</h3>
                    <StudentTable data={failedData}/>
                    <div className={styles.buttonArea}>
                        <Button onClick={()=>{setMainSteps(0)}} text="Discard" />
                        <Button onClick={()=>{updateStudents();setMainSteps(2)}} style={{marginLeft:'25px'}} variant="contained" text="Update" />
                    </div>
                </div>:null}

                {updateProcess===true&&(afterUpdateFailed.length!==0 || afterUpdateSuccess.length!== 0 )?<div className={styles.duplicateTable}>
                    <h3>Successfull Data</h3>
                    <StudentTable data={afterUpdateSuccess}/>
                    <h3 className='mt-4'>Failed Data</h3>
                    <StudentTable data={afterUpdateFailed}/>
                    <div className={styles.buttonArea}>
                        <Button onClick={()=>{setMainSteps(0)}} text="Discard" />
                        <Button onClick={()=>{setUpdateProcess(false);setMainSteps(0)}} style={{marginLeft:'25px'}} variant="contained" text="Ok" />
                    </div>
                </div>:null}

            <ToastContainer />
        </div>
    </>
};

export default UploadInfo;