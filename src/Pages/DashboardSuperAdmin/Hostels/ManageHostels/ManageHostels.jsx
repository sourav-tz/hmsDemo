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
import { Switch } from "@/components/ui/switch"
import config from '../../../../config/config';


import axios from "axios";

const ManageHostels = () => {
  //const [sel,setSelect] = useState("");
  const [editMode, setEditMode] = useState(false);

       let [rowData, setRowData] = useState([]);
       let [hostel, setHostel] = useState ({
        hostelName:null, hostelNo:null,type:""
       });

       useEffect(()=>{
        ;(async () => {
          try {
            const res = await axios({
              url:"http://localhost:3000/SA/getHostels",
              method: "GET"
            }) 
            setRowData(res.data);
            console.log(res);
          
          } catch(error) {
            console.log(error);
          }
        })()
       },[]) 

       const setName=(e)=>{
        setHostel((prev)=>{return {...prev,hostelName:e.target.value}});
        // setFormErrors({...FormErrors, [e.target.name]: ''});
       }

       
       const setHostelNumber=(e)=>{
        setHostel((prev)=>{return {...prev,hostelNo:e.target.value}});

        // setFormErrors({...FormErrors, [e.target.name]: ''});

       }

       const handleSelectChange=(e)=>{
        setHostel((prev)=>{return {...prev,type:e}});
       }

      const handleDeleteRow = (hostelNo) => {
        ;(async () => {
          try {
            const confirmation = window.confirm("Do you really want to delete this hostel?");
            if (!confirmation) return;
            await axios.delete(`http://localhost:3000/SA/removeHostel?hostelNo=${hostelNo}&softdelete=true`);
            // Remove the deleted row from rowData
            setRowData(prevData => prevData.filter(row => row.hostelNo !== hostelNo));
          } catch (error) {
            console.log(error);
          }
        })()
      };
      
      const handleHostel =(e)=>{
        e.preventDefault();
        ;(async () => { 
          try {
            const res = await axios({
              url: 'http://localhost:3000/SA/addHostel',
              method: 'POST',
              data: hostel
            });
            // console.log(res);
            setRowData((prev) => {
              return [                
                ...prev, res.data.data
              ]
              
            });
          } catch(error) {
            console.log(error);
          }
        })()

       }

       const handleEnableHostel = (hostelNo, isActive) => {
        ;(async () => {
          try {
            const updatedRowData = rowData.map(row => {
              if (row.hostelNo === hostelNo) {
                return { ...row, isActive: !isActive };
              }
              return row;
            });
            setRowData(updatedRowData);
            const res = await axios.post('http://localhost:3000/SA/enableHostel', { hostelNo, isActive: !isActive });
            console.log(res.data); 
          } catch(error) {
            console.log(error);
          }
        })();
      };
      
 
      // const handleHostelEdit = (data, updatedData) => {
      //   ;(async (data) => {
      //     try {
      //       const res = await axios ({
      //         url:'http://localhost:3000/SA/updateHostel/hostelNo=${data.hostelNo}', updatedData,
      //         method:'PATCH'
      //       }) 
      //       console.log(res.data);
      //     } catch (error) {
      //       console.log(error);
      //     }
      //   })(data)
      // }

      const handleEditClick = () => {
        setEditMode(true);
      };
    
      const handleCellValueChanged = (event) => {
        console.log("Cell value changed: ", event.data);
      };

      

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
        cellRenderer:()=> <Button className='p-3' onClick={handleEditClick}><FaRegEdit/></Button>,
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
        field: "Active/Inactive", 
        headerClass:"font-bold border p-2 font-bold text-md", 
        cellRenderer:({ data }) => (
          <Button onClick={() => handleEnableHostel(data.hostelNo, !data.isActive)}>
            <Switch isChecked={data.isActive} />
          </Button>
        ),
        cellStyle: {textAlign: 'center'}
      },
      
      


      {
        field: "View Admins", 
        headerClass:"font-bold border p-2 font-bold text-md", 
        cellRenderer:()=> <Button className='p-3'><MdAccountCircle/></Button>, 
        cellStyle: {textAlign: 'center'}
      },
      {
        field: "Delete", 
        headerClass:"font-bold border p-2 font-bold text-md", 
        cellRenderer:({ data }) => <Button className='p-3' onClick={() => handleDeleteRow(data.hostelNo)}><ImBin/></Button>, 
        cellStyle: {textAlign: 'center'}
      },

    
   ])

  return (
    <>
    <div className=''>
      <div className= 'm-6 p-5  max-w-md rounded-[30px] shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
        <form>
          <div>
            <h1 className='text-2xl m-2 font-bold'>Add Hostel</h1>
          </div> 
          <div className='flex'>
            <div className='fex-col'>
              <Input name="HostelName" className='w-40 h-12 m-2 text-md p-3 placeholder:text-black bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)]' type="text" onChange={setName} placeholder='Hostel name' />
              {/* {FormErrors.HostelName && <div className='px-4 text-red-600'>{FormErrors.HostelName}</div>} */}
            </div>
            <Select name="HostelType" onValueChange={handleSelectChange}>
              <SelectTrigger className="w-40 h-12 text-md p-3 m-2 text-black bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
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
              <Input name="HostelNo" onChange={setHostelNumber} className='w-40 h-12 m-2  text-md p-3 placeholder:text-black bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)]' type="number"  placeholder='Hostel No.'/>
              {/* {FormErrors.HostelNo && <div className='px-4 text-red-600'>{FormErrors.HostelNo}</div>} */}
            </div>
          </div>

          <div className='flex'>
          <Button onClick={handleHostel} className=' w-20 h-10  m-2 p-3 bg-[#5F57FF] text-white rounded-lg  text-md shadow-[0_3px_10px_rgb(0,0,0,0.2)]' >ADD</Button>
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

  </>
  
  )


};

export default ManageHostels;