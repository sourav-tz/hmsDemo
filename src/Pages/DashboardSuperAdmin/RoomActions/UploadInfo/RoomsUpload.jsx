import styles from './RoomsUpload.module.scss';
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
import { FaFileCsv } from "react-icons/fa6";
import FileCheckLoading from '../../../../components/Loadingpage/FileCheckLoading';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import backgroundImage from '../../../../Assets/hostel11.jpg';

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

    // console.log('Dropped files:', droppedFiles);
  };



    const callFileUpload = () => {
        return new Promise((resolve, reject) => {
          const bodyForData = new FormData();
          bodyForData.append("file", file);
      
          axios
            .post(import.meta.env.VITE_BASE_URL+'/SA/bulkCreate', bodyForData, {
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
              reject(err);
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
              return data.response.data;}
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


    const handleDownloadClick =()=>{
      ;(async ()=>{
        try{
          const res = await axios({
            url:import.meta.env.VITE_BASE_URL + '/SA/downloadfile?path=public/downloads/rooms.csv&filename=rooms.csv',
            method:'get',
            responseType: 'blob', // Important
            withCredentials: true

          })

          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'rooms.csv'); //or any other extension
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


    return<>
    <div className="relative min-h-screen w-full flex flex-col justify-start py-10 items-center">
          {/* Background Image Layer */}
          <div
            className="absolute top-0 left-0 w-full h-full bg-center bg-cover bg-no-repeat bg-fixed blur-sm opacity-50 z-[-1]"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
      {/* Header section with responsive font size */}
      <div className="w-full">
        <h1 className="text-2xl md:text-3xl lg:text-4xl text-center">Bulk Upload Rooms</h1> 
      </div>
  
      {/* File upload container, responsive width for different screens */}
      <div className="w-full md:w-[80%] lg:w-[60%] px-4 mt-4 rounded-[30px] shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white/30">
        {/* File upload area with responsive padding and border */}
        <div 
          className={`p-4 border border-dashed rounded-[30px] shadow-[0_3px_10px_rgb(0,0,0,0)] bg-white/0 bg-gray-50 ${dragging ? 'bg-blue-100' : ''}`} 
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {/* Step 1: File Input */}
          {step === 1 ? (
            <>
              <input className="hidden" type="file" ref={inputElement} onChange={handleFile} />
              <IoIosCloudUpload size="60" className="mx-auto my-4" />
              <p className="text-center">Drag and Drop Files <br />Or</p>
              {/* Responsive button with margin */}
              <Button 
                onClick={handleButtonClick} 
                className="block mx-auto mt-4" 
                variant="contained" 
                text="Browse Files" 
              />
            </>
          ) : null}
  
          {/* Step 0: Loading State */}
          {step === 0 ? <FileCheckLoading /> : null}
  
          {/* Step 2: File Preview and Upload */}
          {step === 2 ? (
            <>
              <div className="flex items-center justify-center my-4">
                <FaFileCsv size="60" /> 
                <p className="ml-4 text-center">{file.name}</p> 
              </div>
              <div className="flex gap-4 justify-center">
                <Button 
                  className="mt-4" 
                  onClick={() => { setStep(1); setFiles(null); }} 
                  text="Discard" 
                />
                <Button 
                  disable={false} 
                  onClick={uploadFile} 
                  className="mt-4" 
                  variant="contained" 
                  text="Upload" 
                />
              </div>
            </>
          ) : null}
        </div>
  
        {/* Accordion for upload instructions */}
        <div className="w-full md:w-[90%] lg:w-[80%] mx-auto mt-4">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>File Upload Instructions</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc ml-6">
                  <li>Data Must be Uploaded in CSV Format.</li>
                  <li>Must Match The Fields in Demo File</li>
                  <li>Unique Data can only be uploaded once, but it can be modified after reuploading.</li>
                  <li>Required Attributes are roomNo, block, floorNo, maxOccupancy, hostelNo.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Demo CSV File</AccordionTrigger>
              <AccordionContent>
                <Button onClick={handleDownloadClick} text="Download" />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      <ToastContainer />
    </div>
  </>
  

};


export default RoomsUpload;