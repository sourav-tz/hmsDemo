import React, { useState} from 'react'
import { Input } from '../../../../Components/ui/input';
import { Select,SelectTrigger,SelectContent,SelectValue,SelectItem } from '../../../../Components/ui/select';
import { Button } from '../../../../Components/ui/button';
import { AgGridReact } from 'ag-grid-react'; 
import "ag-grid-community/styles/ag-grid.css"; 
import "ag-grid-community/styles/ag-theme-quartz.css";
import { ImBin } from "react-icons/im";
import { FaRegEdit } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";

const ManageHostels = () => {
  const [sel,setSelect] = useState("");
       const [rowData, setRowData] = useState([]);
       const [FormErrors,setFormErrors] = useState({ HostelName:"",HostelNo:"",HostelType: ""})

       const [hostel, setHostel] = useState ({
        HostelName:"", HostelNo:"",HostelType:""
       });

       const handleChange=(e)=>{
        setHostel({...hostel,[e.target.name]:e.target.value});
        setFormErrors({...FormErrors, [e.target.name]: ''});

       }

       const handleSelectChange=(e)=>{
        setSelect(e);
       }
       hostel.HostelType = sel;

       let {HostelName, HostelNo, HostelType} = hostel;

       const handleHostel = (e) => {
        e.preventDefault();
        console.log(hostel);
        let errors = {};

        //input validation
        if (hostel.HostelName.trim() === '') {
          errors.HostelName = "Hostel name is required"
        }

        if(hostel.HostelNo.trim() == '') {
          errors.HostelNo = "Hostel no. is required"
        }

        setFormErrors(errors);

        if(Object.keys(errors).length === 0) {
          setRowData([...rowData,{HostelName, HostelNo, HostelType}]);
          setSelect("");
          hostel.HostelName="";
          hostel.HostelNo="";
          hostel.actInact="";
        }
       }

       //const handleDeleteRow = () => {

       // }

       const [colDefs, setColDefs] = useState([
        {field: "HostelName", headerClass: "font-bold border p-2 font-bold text-md"},
        {field: "HostelNo", headerClass:"font-bold border p-2 font-bold text-md"},
        {field: "HostelType", headerClass:"font-bold border p-2 font-bold text-md"},
        {field: "Edit", headerClass:"font-bold border p-2 font-bold text-md", cellRenderer:()=> <Button className='p-3'><FaRegEdit /></Button>},
        {field: "Active/Inactive", headerClass:"font-bold border p-2 font-bold text-md"},
        {field: "View Admins", headerClass:"font-bold border p-2 font-bold text-md", cellRenderer:()=> <Button className='p-3'><MdAccountCircle/></Button>},
        {field: "Delete", headerClass:"font-bold border p-2 font-bold text-md", cellRenderer:()=> <Button className='p-3'><ImBin /></Button>},
       ])

  return (

    <>
    <div className=''>
      <div className= 'm-6 p-5  max-w-md rounded-[30px] shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
        <form onSubmit={handleHostel} >
          <div>
            <h1 className='text-2xl m-2 font-bold'>Add Hostel</h1>
          </div> 
          <div className='flex'>
            <div className='fex-col'>
              <Input name="HostelName" className='w-40 h-12 m-2 text-md p-3 placeholder:text-black bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)]' type="text" value= {hostel.HostelName} onChange={handleChange} placeholder='Hostel name' />
              {FormErrors.HostelName && <div className='px-4 text-red-600'>{FormErrors.HostelName}</div>}
            </div>
            <Select name="HostelType" value={hostel.HostelName} onValueChange={handleSelectChange}>
              <SelectTrigger className="w-40 h-12 text-md p-3 m-2 text-black bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                <SelectValue  placeholder="Hostel No." />
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
              <Input name="HostelNo" onChange={handleChange} value={hostel.HostelNo} className='w-40 h-12 m-2  text-md p-3 placeholder:text-black bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)]' type="text"  placeholder='Hostel No.'/>
              {FormErrors.HostelNo && <div className='px-4 text-red-600'>{FormErrors.HostelNo}</div>}
            </div>
          </div>

          <div className='flex'>
          <Button type='submit' className=' w-20 h-10  m-2 p-3 bg-[#5F57FF] text-white rounded-lg  text-md shadow-[0_3px_10px_rgb(0,0,0,0.2)]' >ADD</Button>
          </div>
        </form>

      </div>

      <div className='mt-4 mb-2 p-1 w-5/6 h-[380px] rounded-xl shadow-[0_3px_10px_rgb(0,0,0,0.2)] '>

        <div className="ag-theme-quartz" style={{ height: '100%' , width: '100%'}}>
            <AgGridReact rowData={rowData} columnDefs={colDefs}  />
        </div>       

      </div>

    </div>

  </>
  
  )


};

export default ManageHostels;