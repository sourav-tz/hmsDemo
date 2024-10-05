import React, { useEffect, useState, useRef } from 'react'
import { Input } from '../../../../components/ui/input';
import {
  Select, SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select';
import { Button } from '../../../../components/ui/button';
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { Fullscreen } from 'lucide-react';
import { ImBin } from "react-icons/im";
import { update } from '@react-spring/web';
import axios from "axios";
import { CiEdit } from "react-icons/ci";
import { ToastContainer, toast } from 'react-toastify';
import { useForm, Controller, set } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


const ManageAdmin = () => {


  const [Pass, setPass] = useState("");

  const [rowData, setRowData] = useState([]);
  const [hostelData, setHostelData] = useState([]);


  const yesRef = useRef();
  const noRef = useRef();
  const [confirmModal, setConfirmModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const { register, handleSubmit, control } = useForm(
    {
      mode: "all"
    }
  );



  let [admin, setAdmin] = useState({
    email: "", name: "", roleType: "Hostel-Authority", mobile: "", password: "", hostelNo: ""
  });
  const [editValues, setEditValues] = useState({
    email: "", name: "", mobile: "", hostelNo: ""
  });

  const getAdmins = async () => {
    try {
      const res = await axios({
        url: import.meta.env.VITE_BASE_URL + '/SA/getAdmins',
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      })

      console.log(res);
      setRowData(res.data);

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAdmins();
  }, [])

  const handleName = (e) => {
    setAdmin((prev) => { return { ...prev, name: e.target.value } })
  }
  const handleMobile = (e) => {
    setAdmin((prev) => {
      return { ...prev, mobile: e.target.value }
    })
  }
  const handleEmail = (e) => {
    setAdmin((prev) => {
      return { ...prev, email: e.target.value }
    })
  }
  const handleNoChange = (e) => {
    setAdmin((prev) => {


      // let hostelNoForm = e[1];
      let hostelNoForm = e.split(" ")[0].substring(1);
      // console.log("HOSTEL NO _>", hostelNoForm);
      return { ...prev, hostelNo: hostelNoForm };

    })
    console.log("ADMIN_> ", admin);
  }
  // let {email,name,roleType,mobile,password,hostelNo} = admin;

  const handleAdmin = (e) => {
    e.preventDefault();
    // setRowData([...rowData,{name,hostelNo,mobile}])
    ; (async () => {
      try {
        const res = await axios({
          url: import.meta.env.VITE_BASE_URL + '/SA/adminReg',
          method: 'post',
          data: admin,
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        })
        console.log(res);
        toast.success("Hostel Admin Created Email Sent !", {
          position: "top-center"
        });
        getAdmins();

      } catch (error) {
        console.log(error);
        toast.error("Error in Transaction !", {
          position: "top-center"
        });
      }
    })()

    console.log(admin);
    setPass("");

  }


  //code for deletion of a row 
  // const handleDelete = () => {


  // }


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
    })
  }


  const deleteAdmin = async (e) => {
    console.log(e.data.email);
    const deleteRes = await deleteConfirmation();

    try {
      const res = await axios({
        url: import.meta.env.VITE_BASE_URL + '/SA/deleteAdmin',
        method: 'post',
        data: { email: e.data.email },
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      })
      console.log(res);
      toast.success("Admin Deleted Successfully", {
        position: "top-center"
      });
      getAdmins();
    } catch (error) {
      console.log(error);
      toast.error("Error in Transaction !", {
        position: "top-center"
      });
    }
  }

  const handleEdit = (e) => {
    console.log(e);
    setEditMode(true);
    setEditValues(e);

  }


  // Column Definitions: Defines & controls grid columns.
  const [colDefs, setColDefs] = useState([
    { field: "name", headerClass: "font-bold border p-2 font-bold  text-lg " },
    { field: "hostelNo", headerClass: "font-bold border p-2 font-bold   text-lg" },
    { field: "mobile", headerClass: "font-bold border p-2 font-bold  text-lg" },
    {
      field: "delete", headerClass: "font-bold border p-2 font-bold  text-lg",
      cellRenderer: (e) => <div className='flex w-full justify-center'><Button onClick={() => deleteAdmin(e)} className='bg-red-700 h-8 p-[10px] hover:bg-red-500' > <ImBin size={10} /> </Button></div>
    },
    {
      field: "edit", headerClass: "font-bold border p-2 font-bold  text-lg",
      cellRenderer: ({ data }) => <div className='flex w-full justify-center'><Button onClick={() => handleEdit(data)} className='bg-blue-700 h-8 p-[10px] hover:bg-blue-500' > <CiEdit size={10} /> </Button></div>
    },
  ]);


  const passwordGenerator = (e) => {
    e.preventDefault();
    let passw = "";
    let str = "abcdefghijklmnopqrstruvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (let i = 1; i <= 8; i++) {
      let char = Math.floor(Math.random() * str.length);
      passw += str.charAt(char);
    }

    setPass(passw)
    setAdmin((prev) => {
      return { ...prev, password: passw }
    })
  }

  const onSubmitEdit = async (data) => {
    console.log(data);
    setEditMode(false);
    if (data.hostelNo !== '') {
      try {
        const res = await axios({
          url: import.meta.env.VITE_BASE_URL + '/SA/changeHostel',
          method: 'post',
          data: { emailOfHA: editValues.email, newHostelNo: data.hostelNo },
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        })
        console.log(res);
        toast.success("Admin Edited Successfully", {
          position: "top-center"
        });
        getAdmins();
      } catch (error) {
        console.log(error);
        toast.error("Error in Transaction !", {
          position: "top-center"
        });
      }

    }
  }

  const getHostelsTry = async () => {
    try {
      const res1 = await axios({
        url: import.meta.env.VITE_BASE_URL + "/SA/getHostels",
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      })

      let arr = res1.data.map((elem) => {
        return `H${elem.hostelNo}  ${elem.hostelName}`;
      })

      setHostelData(arr);
      // console.log("ARR->", arr);
      // console.log("RES ->", res1.data);

    } catch (error) {
      console.log(error);
    }
  }



  // console.log(hostelData);


  useEffect(() => {
    getHostelsTry();
  }, [])

  return (

    <>
      <div className='flex flex-col items-center justify-center'>
        <div className=' m-6 p-5  max-w-max rounded-[30px] shadow-[0_3px_10px_rgb(0,0,0,0.2)] '>
          <form  >
            <div>
              <h1 className='text-2xl m-2 font-bold'>Register Admin</h1>
            </div>
            <div className='flex'>

              <Input name="name" onChange={handleName} className='w-60 m-2 text-lg p-3 placeholder:text-black bg-white  shadow-[0_3px_10px_rgb(0,0,0,0.2)] ' type="text" placeholder='Name' />
              {/* <Input name="hostelNo" onChange={handleNoChange} className='w-60 m-2  text-lg p-3 placeholder:text-black bg-white  shadow-[0_3px_10px_rgb(0,0,0,0.2)]' type="number" min="1" max="11"  placeholder='Hostel No'/> */}


              {/* <select onChange={handleNoChange} id="options" name="options" className='w-60 m-2  text-lg p-3 placeholder:text-black bg-white  shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
                <option >Hostel No.</option>
                <hr />
               

              </select> */}
            

              
              <Select onValueChange={handleNoChange} >
                <SelectTrigger className="mt-2 w-[270px] ml-2 text-base">
                  <SelectValue placeholder="Select Hostel" />
                </SelectTrigger>
                <SelectContent  >
                  {hostelData.map((elem, index) => {
                    // console.log("PRINT ->", elem)
                    return <SelectItem key={index + 1} value={elem} >{elem} </SelectItem>;
                  })}


                  {/* <SelectGroup>
                   <SelectItem value="h1">{hostelData} </SelectItem>
                    </SelectGroup> */}
                  {/* <SelectGroup  >
                      <SelectLabel >Boys</SelectLabel>
                      <hr />
                      <SelectItem value="h1">Abhimanyu Bhawan H-1</SelectItem>
                      <SelectItem value="h2"> Bhishma Bhawan H-2</SelectItem>
                      <SelectItem value="h3">Chakradhar Bhawan H-3</SelectItem>
                      <SelectItem value="h4">Dronacharya Bhawan H-4</SelectItem>
                      <SelectItem value="h5">Eklavya Bhawan H-5</SelectItem>
                      <SelectItem value="h6">Fanibhushan Bhawan H-6</SelectItem>
                      <SelectItem value="h7">Girivar Bhawan H-7</SelectItem>
                      <SelectItem value="h8">Harihar Bhawan H-8</SelectItem>
                      <SelectItem value="h9">Indivar Bhawan H-9</SelectItem>
                      <SelectItem value="h10">Visvesvaraya Bhawan H-10</SelectItem>
                      <SelectItem value="h11">Vivekananda Bhawan H-11</SelectItem>

                  </SelectGroup>
                  <SelectGroup>
                      <SelectLabel >Girls</SelectLabel>
                      <hr />
                      <SelectItem value="h12">Bhagirathi Bhawan</SelectItem>
                      <SelectItem value="h13">Cauvery Bhawan</SelectItem>
                      <SelectItem value="h14">Kalpana Chawla Hostel</SelectItem>  
                      <SelectItem value="h15">Alaknanda Bhawan</SelectItem>

                      </SelectGroup>  */}

                </SelectContent>
              </Select>

            </div>


            <div className='flex'>
              <Input name="mobile" onChange={handleMobile} className='w-60 m-2  text-lg p-3 placeholder:text-black bg-white  shadow-[0_3px_10px_rgb(0,0,0,0.2)]' type="tel" placeholder='Mobile No' />
              <Input name="email" onChange={handleEmail} className='w-60 m-2  text-lg p-3 placeholder:text-black bg-white  shadow-[0_3px_10px_rgb(0,0,0,0.2)]' type="email" placeholder='Email' />

            </div>


            <div className='flex' >


              <Button className=' w-60 m-2 p-3 bg-[#5F57FF] hover:bg-[#7870ff] text-white rounded-lg  text-lg  shadow-[0_3px_10px_rgb(0,0,0,0.2)]' onClick={passwordGenerator}  >Generate Password</Button>
              <Input name="password" value={Pass} onChange={(e) => setPass(e.target.value)} className='w-60 m-2 text-lg p-3 placeholder:text-black bg-white   shadow-[0_3px_10px_rgb(0,0,0,0.2)]' type="text" placeholder='Password' disabled />
              <Button onClick={handleAdmin} className=' w-36  m-2 p-3 bg-[#5F57FF] hover:bg-[#7870ff] text-white rounded-lg  text-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)]' >Register</Button>

            </div>
          </form>

        </div>



        <div className='mt-4 mb-2 p-1 w-2/3 h-[380px] rounded-xl shadow-[0_3px_10px_rgb(0,0,0,0.2)] '>

          <div className="ag-theme-quartz  " style={{ height: '100%', width: '800' }}>
            <AgGridReact rowData={rowData} columnDefs={colDefs} />
          </div>

        </div>
      </div>
      <ToastContainer />


      <div className={`flex justify-center items-center -translate-y-full ${confirmModal ? 'translate-y-0' : null} top-0 left-0 transition-all fixed w-full min-h-screen`}>
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
              <Button ref={noRef} onClick={() => { setConfirmModal(false) }} className="bg-green-700">No</Button>
              <Button ref={yesRef} onClick={() => { }} className="bg-red-700">Yes</Button>
            </CardFooter>
          </Card>
        </div>
      </div>



      <div className={`-translate-y-full ${editMode ? 'translate-y-0' : null} flex justify-center items-center fixed top-0 left-0 transition-all w-full min-h-screen z-50`}>
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
                  <Input defaultValue={editValues.name} {...register("name")} name="name" onChange={handleName} className='w-full m-2 text-lg p-3 placeholder:text-black bg-white  shadow-[0_3px_10px_rgb(0,0,0,0.2)] ' type="text" placeholder='Name' />
                  <Input defaultValue={editValues.hostelNo} {...register("hostelNo")} name="hostelNo" onChange={handleNoChange} className='w-full m-2  text-lg p-3 placeholder:text-black bg-white  shadow-[0_3px_10px_rgb(0,0,0,0.2)]' type="number" placeholder='Hostel No' min="0" max="11" />
                  <Input defaultValue={editValues.mobile} {...register("mobile")} name="mobile" onChange={handleMobile} className='w-full m-2  text-lg p-3 placeholder:text-black bg-white  shadow-[0_3px_10px_rgb(0,0,0,0.2)]' type="tel" placeholder='Mobile No' />
                  <Input defaultValue={editValues.email} {...register("email")} name="email" onChange={handleEmail} className='w-full m-2  text-lg p-3 placeholder:text-black bg-white  shadow-[0_3px_10px_rgb(0,0,0,0.2)]' type="text" placeholder='Email' />
                </div>


                <div className='p-4 flex justify-between'>

                  <Button type="button" onClick={() => { setEditMode(false); setErrorMessage('') }} className="bg-red-700">Close</Button>
                  <Button type="submit" className="bg-green-700">Submit</Button>

                </div>

              </form>
            </CardContent>
          </Card>

        </div>

      </div>
      <DevTool control={control} />


    </>


  )
}


export default ManageAdmin;