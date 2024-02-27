import React, { useState} from 'react'
import { Input } from '../../../../Components/ui/input';
import { Select,SelectTrigger,SelectContent,SelectValue,SelectItem } from '../../../../Components/ui/select';
import {Button} from '../../../../Components/ui/button';
import { AgGridReact } from 'ag-grid-react'; 
import "ag-grid-community/styles/ag-grid.css"; 
import "ag-grid-community/styles/ag-theme-quartz.css";
import { Fullscreen } from 'lucide-react';
import { ImBin } from "react-icons/im";
import { update } from '@react-spring/web';

const ManageAdmin = () => {
  
       const [Pass,setPass] = useState("");
       const [sel,setSelect] = useState("");
       const [rowData, setRowData] = useState([]);
       const [FormErrors,setFormErrors] = useState({ Name:"",HostelNo:"",MobileNo:"",Email:"",Password:""})


      const [admin,setAdmin] = useState({
        Name:"",HostelNo:"",MobileNo:"",Email:""
      });

      const  handleChange=(e)=>{
      
        setAdmin({...admin,[e.target.name]:e.target.value});
    
        setFormErrors({ ...FormErrors, [e.target.name]: '' });
        

        
        }
      //review
      const handleSelectChange =(e)=>{

        setSelect(e);
  
      }
      //review
      admin.HostelNo = sel;

        

      let {Name,HostelNo,Role,MobileNo,Email} = admin;

      const handleRegister=(e)=>{
        e.preventDefault();
        console.log(admin);
        let errors = {};
           
        //adding validation to input fields
          if (admin.Name.trim() === '') {
                errors.Name = "Username is required";
              }
         if(admin.Email.trim() == ''){
                errors.Email = "Email is required";
              }else if (!(/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(admin.Email.trim()))) {
                errors.Email = "Enter a valid Email";
              }
          if(admin.MobileNo.trim() == ''){
                 errors.MobileNo = "Mobile no. is required"
              }else if( !(/^\d{10}$/.test(admin.MobileNo.trim()))){
                 errors.MobileNo = "Enter a valid number"
              }
              //review
          if( Pass.trim() == ''){
                 errors.Password = "Password is required"
              }
      
          // Set formErrors state based on validation result
                 setFormErrors(errors);
      
          // If no errors, submit the form
          if (Object.keys(errors).length === 0) {
            // Reset form after submission (optional)
            setRowData([...rowData,{Name,HostelNo,Role,MobileNo}]);
              setSelect("");
              // admin.HostelNo="";
              admin.MobileNo="";
              admin.Name="";
              admin.Email="";
              setPass("");
           
             }
       }
      //code for deletion of a row 
      // const handleDelete = () => {

      
      // }
     

     
      
      
    
      // Column Definitions: Defines & controls grid columns.
      const [colDefs, setColDefs] = useState([
        { field: "Name",headerClass:"font-bold border p-2 font-bold  text-lg " },
        { field: "HostelNo",headerClass:"font-bold border p-2 font-bold   text-lg"},
        // { field: "Role",headerClass:"font-bold border p-2 font-bold  text-lg" },
        { field: "MobileNo",headerClass:"font-bold border p-2 font-bold  text-lg" },
        {field: "Delete",headerClass:"font-bold border p-2 font-bold  text-lg",
        cellRenderer:()=> <Button className=' p-3' > <ImBin /> </Button>},
      ]);
      

      const passwordGenerator = (e) => {
        e.preventDefault();
        let passw = "";
        let str = "abcdefghijklmnopqrstruvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
         for(let i=1;i<=8;i++){
          let char = Math.floor(Math.random()*str.length);
          passw += str.charAt(char);
         }
         setPass(passw);
       } 
        
      
      

return (

    <>
        <div className=''>
         <div className=' m-6 p-5  max-w-max rounded-[30px] shadow-[0_3px_10px_rgb(0,0,0,0.2)] '>
            <form  onSubmit={handleRegister} >
                <div>
                   <h1 className='text-2xl m-2 font-bold'>Register Admin</h1>
                </div>
                <div className='flex'>
                     <div className='flex-col'>
                       <Input name="Name" className='w-60  h-16 m-2 text-lg p-3 placeholder:text-black bg-white  shadow-[0_3px_10px_rgb(0,0,0,0.2)] '  type="text" value={admin.Name} onChange={handleChange} placeholder='Name'/>
                       {FormErrors.Name && <div className='px-4 text-red-600'>{FormErrors.Name}</div>} 
                     </div>
                      
                     <Select name="HostelNo" value={admin.HostelNo} onValueChange={handleSelectChange}  >
                          <SelectTrigger  className="w-60 h-16 text-lg p-3 m-2  text-black bg-white  shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                            <SelectValue  placeholder="Hostel No" />
                          </SelectTrigger>
                          <SelectContent   >
                            <SelectItem value="H1">H1</SelectItem>
                            <SelectItem value="H2">H2</SelectItem>
                            <SelectItem value="H3">H3</SelectItem>
                            <SelectItem value="H4">H4</SelectItem>
                            <SelectItem value="H5">H5</SelectItem>
                            <SelectItem value="H6">H6</SelectItem>
                            <SelectItem value="H7">H7</SelectItem>
                            <SelectItem value="H8">H8</SelectItem>
                            <SelectItem value="H9">H9</SelectItem>
                            <SelectItem value="H10">H10</SelectItem>
                            <SelectItem value="H11">H11</SelectItem>
                          </SelectContent>
                      </Select>

                </div>
              

                <div  className='flex'>
                
                {/* <Select name="Role" onChange={handleChange} value={admin.Role} >
                          <SelectTrigger className="w-60 h-16 text-lg p-3 m-2  text-black bg-white  shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                            <SelectValue  placeholder="Role" />
                          </SelectTrigger>
                          <SelectContent >
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Chief Warden">Chief Warden</SelectItem>
                            <SelectItem value="Warden">Warden</SelectItem>
                            <SelectItem value="Supervisor">Supervisor</SelectItem>
                          </SelectContent>
                      </Select> */}
                  <div className='flex-col'>
                       <Input  name="MobileNo" onChange={handleChange} value={admin.MobileNo} className='w-60 h-16 m-2  text-lg p-3 placeholder:text-black bg-white  shadow-[0_3px_10px_rgb(0,0,0,0.2)]' type="text"  placeholder='Mobile No'/>
                       {FormErrors.MobileNo && <div className='px-4 text-red-600'>{FormErrors.MobileNo}</div>}
                  </div>
                  <div className='flex-col'>
                       <Input name="Email" onChange={handleChange} value={admin.Email} className='w-60 h-16 m-2  text-lg p-3 placeholder:text-black bg-white  shadow-[0_3px_10px_rgb(0,0,0,0.2)]' type="text"  placeholder='Email'/>
                       {FormErrors.Email && <div className='px-4 text-red-600'>{FormErrors.Email}</div>}
                  </div>
                </div>

                
                 <div className='flex' >
             
        
                    <Button className=' w-60 h-16  m-2 p-3 bg-[#5F57FF] text-white rounded-lg  text-lg  shadow-[0_3px_10px_rgb(0,0,0,0.2)]' onClick={passwordGenerator}  >Generate Password</Button>
                    <Input name="Pass" onChange={handleChange} value={Pass}  className='w-60 h-16 m-2 text-lg p-3 placeholder:text-black bg-white   shadow-[0_3px_10px_rgb(0,0,0,0.2)]' type="text" readOnly placeholder='Password'/>
                    <Button type='submit' className=' w-36 h-14  m-2 p-3 bg-[#5F57FF] text-white rounded-lg  text-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)]' >Register</Button>
              
                 </div>
             </form>
                 
            </div>
         

        
              <div className='mt-4 mb-2 p-1 w-2/3 h-[380px] rounded-xl shadow-[0_3px_10px_rgb(0,0,0,0.2)] '>

                   <div className="ag-theme-quartz  " style={{ height: '100%' , width: '100%'}}>
                        <AgGridReact rowData={rowData} columnDefs={colDefs}  />
                   </div>       
                      
              </div>
          </div>
     </>
  

  )
}


export default ManageAdmin;