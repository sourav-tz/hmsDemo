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
      
       const [rowData, setRowData] = useState([]);
      


      let [admin,setAdmin] = useState({
        email:"",name:"",roleType:"Admin",mobile:"",password:"",hostelNo:""
      });

      const handleName = (e) =>{
        setAdmin((prev) =>
            {return {...prev,name:e.target.value}})
      }
      const handleMobile = (e) =>{
        setAdmin((prev) => {
           return {...prev,mobile:e.target.value}
        })
      }
      const handleEmail = (e) => {
        setAdmin((prev) =>{
          return {...prev,email:e.target.value}
        })
      }
      const handleSelectChange =(e)=>{
        console.log(e);
        setAdmin((prev) => {
          return {...prev,hostelNo:e}
        })
      }
      let {email,name,roleType,mobile,password,hostelNo} = admin;
      const handleAdmin=(e)=>{
        e.preventDefault();
        setRowData([...rowData,{name,hostelNo,mobile}])
        
        console.log(admin);
        
      }
           
        
      //code for deletion of a row 
      // const handleDelete = () => {

      
      // }
     

     
      
      
    
      // Column Definitions: Defines & controls grid columns.
      const [colDefs, setColDefs] = useState([
        { field: "name",headerClass:"font-bold border p-2 font-bold  text-lg " },
        { field: "hostelNo",headerClass:"font-bold border p-2 font-bold   text-lg"},
        { field: "mobile",headerClass:"font-bold border p-2 font-bold  text-lg" },
        {field: "delete",headerClass:"font-bold border p-2 font-bold  text-lg",
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
        
        setPass(passw)
         setAdmin((prev)=>{
          return {...prev,password:passw}
         })
       } 
        
      
      

return (

    <>
        <div className=''>
         <div className=' m-6 p-5  max-w-max rounded-[30px] shadow-[0_3px_10px_rgb(0,0,0,0.2)] '>
            <form  >
                <div>
                   <h1 className='text-2xl m-2 font-bold'>Register Admin</h1>
                </div>
                <div className='flex'>
                     
                       <Input name="name"  onChange={handleName} className='w-60  h-16 m-2 text-lg p-3 placeholder:text-black bg-white  shadow-[0_3px_10px_rgb(0,0,0,0.2)] '  type="text"  placeholder='Name'/>
                      <Select name="hostelNo" onValueChange={handleSelectChange}  >
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
                       <Input  name="mobile" onChange={handleMobile}  className='w-60 h-16 m-2  text-lg p-3 placeholder:text-black bg-white  shadow-[0_3px_10px_rgb(0,0,0,0.2)]' type="text"  placeholder='Mobile No'/>
                       <Input name="email" onChange={handleEmail}  className='w-60 h-16 m-2  text-lg p-3 placeholder:text-black bg-white  shadow-[0_3px_10px_rgb(0,0,0,0.2)]' type="text"  placeholder='Email'/>
                   
                </div>

                
                 <div className='flex' >
             
        
                    <Button className=' w-60 h-16  m-2 p-3 bg-[#5F57FF] text-white rounded-lg  text-lg  shadow-[0_3px_10px_rgb(0,0,0,0.2)]' onClick={passwordGenerator}  >Generate Password</Button>
                    <Input name="password" value={Pass} className='w-60 h-16 m-2 text-lg p-3 placeholder:text-black bg-white   shadow-[0_3px_10px_rgb(0,0,0,0.2)]' type="text" readOnly placeholder='Password'/>
                    <Button  onClick ={handleAdmin} className=' w-36 h-14  m-2 p-3 bg-[#5F57FF] text-white rounded-lg  text-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)]' >Register</Button>
              
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