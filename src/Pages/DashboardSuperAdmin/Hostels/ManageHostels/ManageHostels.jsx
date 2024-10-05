import React, { useEffect, useState} from 'react'
import { Input } from '../../../../components/ui/input';
import { Select,SelectTrigger,SelectContent,SelectValue,SelectItem } from '../../../../components/ui/select';
import { Button } from '../../../../components/ui/button';
import { AgGridReact } from 'ag-grid-react'; 
import "ag-grid-community/styles/ag-grid.css"; 
import "ag-grid-community/styles/ag-theme-quartz.css";
import { ImBin } from "react-icons/im";
import { FaRegEdit } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import {useForm,Controller, set} from 'react-hook-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


import { ToastContainer,toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useRef } from 'react';


import axios from "axios";



const ManageHostels = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const noRef = useRef();
  const yesRef = useRef();
  const {register, handleSubmit, formState: { errors },control,setValue} = useForm({
    mode: 'all',
    values:{
      hostelName:"",
      bodyHostelNo:"",
      type:""
    },
  });
  const [editMode, setEditMode] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);

       let [rowData, setRowData] = useState([]);
       let [hostel, setHostel] = useState ({
        hostelName:null, newHostelNo:null,type:""
       });
  const [showAdmins, setShowAdmins] = useState(false);
  const [adminsData, setAdminsData] = useState([]);
  const [hostelValues,setHostelValues] = useState({
    hostelName:"",
    bodyHostelNo:"",
    type:""
  })





  const getHostels = async () => {
    try {
      const res = await axios({
        url:import.meta.env.VITE_BASE_URL + "/SA/getHostels",
        method: "GET",
        headers: {
          "Content-Type":"application/json"
        },
        withCredentials:true
      }) 
      setRowData(res.data);
      console.log(res);
    
    } catch(error) {
      console.log(error);
    }
  }


       useEffect(()=>{
        getHostels();
       },[]) 

       const setName=(e)=>{
        setHostel((prev)=>{return {...prev,hostelName:e.target.value}});
        // setFormErrors({...FormErrors, [e.target.name]: ''});
       }

       
       const setHostelNumber=(e)=>{

        setHostel((prev)=>{return {...prev,newHostelNo:e.target.value}});

        // setFormErrors({...FormErrors, [e.target.name]: ''});

       }

       const handleSelectChange=(e)=>{
        setHostel((prev)=>{return {...prev,type:e}});
       }

        const deleteConfirmation = () => { 
          return new Promise((resolve, reject) => {
            setConfirmModal(true);
            yesRef.current.onclick = () => {
              resolve(true);
              setConfirmModal(false);
            }
            noRef.current.onclick = () => {
              resolve(false);
              setConfirmModal(false);
            }
          });
        }




      const handleDeleteRow = (hostelNo) => {
        ;(async () => {
          try {
            const res =  await deleteConfirmation();
            if(!res) return;
            await axios.delete(import.meta.env.VITE_BASE_URL + `/SA/removeHostel?hostelNo=${hostelNo}&softdelete=true`,{
              headers:{
                "Content-Type":"application/json"
              },
              withCredentials:true
            });
            // Remove the deleted row from rowData
            setRowData(prevData => prevData.filter(row => row.hostelNo !== hostelNo));
            toast.success("Hostel Deleted Successfully !!",{
              position:'top-right'
            })
          } catch (error) {
            console.log(error);
            toast.error("Error While Deleting !!",{
              position:'top-right'
            })
          }
        })()
      };
      
      const handleHostel =(e)=>{
        e.preventDefault();
        ;(async () => { 
          try {
            const res = await axios({
              url: import.meta.env.VITE_BASE_URL + '/SA/addHostel',
              method: 'POST',
              data: hostel,
              headers: {
                "Content-Type":"application/json"
              },
              withCredentials:true
            });
            // console.log(res);
            toast.success("Hostel Added Successfully !!",{
              position:'top-right'
            })
            getHostels();
        }catch(error){
          console.log(error);
        }
      })()

      }


      const handleEditClick = (e) => {
        setEditMode(true);
        setHostelValues(e);
        console.log(e);
      };
    
      const handleCellValueChanged = (event) => {
        console.log("Cell value changed: ", event.data);
      };


      const getAdminsAgainstHostel = async (e) => {
        console.log(e.hostelNo);
        setShowAdmins(true);
        try{
          const res = await axios({
            url:import.meta.env.VITE_BASE_URL + '/SA/getAdminsAgainstHostel',
            method:'post',
            data:{hostelNo:e.hostelNo},
            headers:{
              "Content-Type":"application/json"
            },
            withCredentials:true
          })
          console.log(res);
          setAdminsData(res.data);

        }catch(error){
          console.log(error);
        }
      }
      

      const [colDefs, setColDefs] = useState([
      {
        field: "hostelName", 
        headerClass: "font-bold border p-2 font-bold text-md", 
        editable: editMode, 
        cellStyle: {textAlign: 'center'}
      },
      {
        field: "hostelNo", 
        headerClass:"font-bold border p-2 font-bold text-md", 
        editable: editMode, 
        cellStyle: {textAlign: 'center'}
      },
      {
        field: "type", 
        headerClass:"font-bold border p-2 font-bold text-md", 
        editable: editMode, 
        cellStyle: {textAlign: 'center'}
      },
      {
        field: "Edit",
        headerClass: "font-bold border p-2 font-bold text-md",
        cellRenderer:({data})=> <Button className='p-3 h-[40px] bg-blue-700 hover:bg-blue-500' onClick={()=>handleEditClick(data)}><FaRegEdit size={10}/></Button>,
        cellStyle: {textAlign: 'center'}
      },
        

        // {field: "Edit", headerClass:"font-bold border p-2 font-bold text-md", cellRenderer:()=> <Button className='p-3' onClick={()=> handleHostelEdit}><FaRegEdit /></Button>},

      // {
      //   field: "Active/Inactive", 
      //   headerClass:"font-bold border p-2 font-bold text-md", 
      //   cellRenderer:({ data }) => <Button onClick={() => handleEnableHostel(data.hostelNo)}><Switch/></Button>,
      //   cellStyle: {textAlign: 'center'}
      // },

      {
        field: "View Admins", 
        headerClass:"font-bold border p-2 font-bold text-md", 
        cellRenderer:({data})=> <Button onClick={()=>getAdminsAgainstHostel(data)} className='p-3 h-[40px] bg-orange-700 hover:bg-orange-500'><MdAccountCircle size={10}/></Button>, 
        cellStyle: {textAlign: 'center'}
      },
      {
        field: "Delete", 
        headerClass:"font-bold border p-2 font-bold text-md", 
        cellRenderer:({ data }) => <Button className='p-3 h-[40px] bg-red-700 hover:bg-red-500' onClick={() => handleDeleteRow(data.hostelNo)}><ImBin size={10}/></Button>, 
        cellStyle: {textAlign: 'center'}
      },

    
   ])

   const [adminCol, setAdminCol] = useState([
    {
      field:"hostelNo",
      headerClass:"font-bold border p-2 font-bold text-md",
      cellStyle: {textAlign: 'center'},
      width:120
    },
    {
      field: "name", 
      headerClass: "font-bold border p-2 font-bold text-md", 
      editable: editMode, 
      cellStyle: {textAlign: 'center'},
      width:160
    },
    {
      field: "email", 
      headerClass:"font-bold border p-2 font-bold text-md", 
      editable: editMode, 
      cellStyle: {textAlign: 'center'},
      width:200
    },
    {
      field: "mobile", 
      headerClass:"font-bold border p-2 font-bold text-md", 
      editable: editMode, 
      cellStyle: {textAlign: 'center'},
      width:200
    },

  ])  



const setEditHostelName=(e)=>{
  setHostelValues((prev)=>{return {...prev,hostelName:e.target.value}});
}

const setEditHostelNo=(e)=>{
  setErrorMessage('you cannot change hostel no');
}

const onSubmitEdit =async (data) => {
  setValue("type",hostelValues.type);
  console.log(data);
  console.log('clicked')
  setErrorMessage('');

  try{
    const res = axios({
      url:import.meta.env.VITE_BASE_URL + '/SA/updateHostel',
      method:'patch',
      data:data,
      headers:{
        "Content-Type":"application/json"
      },
      withCredentials:true
    })
    console.log(res);
    toast.success("Hostel Updated Successfully",{
      position:'top-right'
    })
    setEditMode(false);
    setRowData(prevData => {
      
    
      return prevData.map(row => {
        if (row.hostelNo == data.bodyHostelNo) {
          console.log(row.hostelNo)
          
          return { ...row, ...data }; // Update the row with new data
        } else {
          
          return row; // Return the unchanged row
        }
      });
    });
  }
  catch(error){
    console.log(error);
    toast.error("Error in Transaction",{
      position:'top-right'
    })

  }
}


  return (
  <>
    <div className='mt-20 p-4 md:mt-0 flex flex-col justify-center items-center'>
      <div className= 'm-6 p-5 w-full md:min-w-[300px] md:max-w-[600px] rounded-[30px] shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
        <form>
          <div>
            <h1 className='text-2xl m-2 font-bold'>Add Hostel</h1>
          </div> 
          <div className='flex gap-2'>
            <div className='flex-col'>
              <Input name="HostelName" className='m-2 text-md p-3 placeholder:text-black bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)]' type="text" onChange={setName} placeholder='Hostel name' />
              {/* {FormErrors.HostelName && <div className='px-4 text-red-600'>{FormErrors.HostelName}</div>} */}
            </div>
            <Select name="HostelType" onValueChange={handleSelectChange}>
              <SelectTrigger className="w-40  text-md p-3 m-2 text-black bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                <SelectValue  placeholder="Hostel Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Girls">
                    Girls
                </SelectItem>
                <SelectItem value="Boys">
                    Boys
                </SelectItem>
                <SelectItem value="Co-Head">
                    Co-head
                </SelectItem>
              </SelectContent>

            </Select>
          </div>

          <div className='flex'>
            <div className='flex-col'>
              <Input name="HostelNo" onChange={setHostelNumber} className='w-40 m-2  text-md p-3 placeholder:text-black bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)]' type="number"  placeholder='Hostel No.'/>
              {/* {FormErrors.HostelNo && <div className='px-4 text-red-600'>{FormErrors.HostelNo}</div>} */}
            </div>
          </div>

          <div className='flex'>
          <Button onClick={handleHostel} className='flex-1  m-2 px-10 bg-[#5F57FF] text-white rounded-lg  text-md shadow-[0_3px_10px_rgb(0,0,0,0.2)]' >ADD</Button>
          </div>
        </form>

      </div>

      <div className='mt-4 mb-2 p-1 w-5/6 h-[380px] rounded-xl shadow-[0_3px_10px_rgb(0,0,0,0.2)] '>

        <div className="ag-theme-quartz" style={{ height: '100%' , width: '100%'}}>
            <AgGridReact 
              rowData={rowData} 
              columnDefs={colDefs}  
              defaultColDef={{ resizable: true }}
              onCellValueChanged={handleCellValueChanged}
            />
        </div>       

      </div>
    </div>

    <div className={`flex justify-center items-center -translate-y-full ${confirmModal?'translate-y-0':null} top-0 left-0 transition-all fixed w-full min-h-screen`}> 
    <div className='fixed top-0 left-0 bg-black opacity-70 w-full h-screen'></div>
        <div className='min-w-[300px] z-50'>
          <Card>
            <CardHeader>
              <CardTitle>Confirmation</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Do you really want to delete this hostel?</CardDescription>
            </CardContent>
            <CardFooter className='flex justify-between'>
              <Button ref={noRef} onClick={()=>{setConfirmModal(false)}} className="bg-green-700">No</Button>
              <Button ref={yesRef} onClick={()=>{}} className="bg-red-700">Yes</Button>
            </CardFooter>
          </Card>
        </div>
    </div>


    <div className={`-translate-y-full ${showAdmins?'translate-y-0':null} flex justify-center items-center fixed top-0 left-0 transition-all w-full min-h-screen`}>
    <div className='fixed top-0 left-0 bg-black opacity-70 w-full h-screen'></div>
    <div className='min-w-[300px] z-50'>
          <Card>
            <CardHeader>
              <CardTitle>Admins</CardTitle>
              <CardDescription>Admins Against Hostel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='w-[700px] h-[400px]'>
              <div className="ag-theme-quartz" style={{ height: '100%' , width: '100%'}}>
            <AgGridReact 
              rowData={adminsData} 
              columnDefs={adminCol}  
              defaultColDef={{ resizable: true }}
            />
            </div>   
            </div>
            </CardContent>
            <CardFooter className='flex justify-between'>
            <Button onClick={()=>{setShowAdmins(false)}} className="bg-green-700">Close</Button>
            </CardFooter>
          </Card>
        </div>  
    </div>

    <div className={`-translate-y-full ${editMode?'translate-y-0':null} flex justify-center items-center fixed top-0 left-0 transition-all w-full min-h-screen z-50`}>
    <div className='fixed top-0 left-0 bg-black opacity-70 w-full h-screen'></div>
    <div className='min-w-[300px] z-[1000]'>

          <Card>
            <CardHeader>
              <CardTitle>Edit Hostel</CardTitle>
              <CardDescription>Change Hostel Information</CardDescription>
            </CardHeader>

            <CardContent>
            <form onSubmit={handleSubmit(onSubmitEdit)}>

  
              <div className='w-full min-h-[150px] md:w-[600px]'>
                <Input {...register("hostelName",{required:{value:true,message:"Hostel Must Have a Name"}})} value={hostelValues.hostelName} name="hostelName" className='m-2 text-md p-3 placeholder:text-black bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)]' type="text" onChange={setEditHostelName}/>
                <Input {...register("bodyHostelNo",{required:{value:true,message:"hostel no is required"}})} value={hostelValues.hostelNo} name="bodyHostelNo" className='m-2 text-md p-3 placeholder:text-black bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)]' type="text" onClick={setEditHostelNo}/>
                <p className={`${errorMessage.length==0?'hidden':''} p-2 text-sm text-red-700`}>{errorMessage}</p>
                {/* <Input value={hostelValues.type} name="HostelName" className='m-2 text-md p-3 placeholder:text-black bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)]' type="text" onChange={setName}/> */}
                <Controller
                    name="type"
                    control={control}
                    rules={{ required: { value: false} }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger className="w-40  text-md p-3 m-2 text-black bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                          <SelectValue placeholder={hostelValues.type} defaultValue={hostelValues.type} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Boys">Boys</SelectItem>
                          <SelectItem value="Girls">Girls</SelectItem>
                          <SelectItem value="Co-Head">Co-Head</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
            </div>
            

            <div className='p-4 flex justify-between'>

            <Button type="button" onClick={()=>{setEditMode(false);setErrorMessage('')}} className="bg-red-700">Close</Button>
            <Button type="submit" className="bg-green-700">Submit</Button>

            </div>

            </form>
            </CardContent>
          </Card>

        </div>  
      </div>
  </>

  )
};



export default ManageHostels;