import React, { useEffect } from 'react'
import { AgGridReact } from 'ag-grid-react'; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { setAllot,setView,setAllotData, setRoomData } from '../../../Store/Reducers/roomSlice';
import { useDispatch } from 'react-redux';



const RoomTable = ({data}) => {




const Dispatcher = useDispatch();
const handleAllot = (data)=>{
  console.log(data);
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
  document.body.style.overflowY='hidden';
    Dispatcher(setAllotData({roomNo:data.roomNo,hostelNo:data.hostelNo,rollNo:null}));
    Dispatcher(setAllot(true));
}

const handleView = (data)=>{
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
  document.body.style.overflowY='hidden';
  Dispatcher(setRoomData(data));
  Dispatcher(setView(true));
}



        const [rowData, setRowData] = useState();
        
        useEffect(()=>{
            setRowData(data.slice(2,));
        },[data])
        
  
        // Column Definitions: Defines & controls grid columns.
        const [colDefs, setColDefs] = useState([
          { field: "roomNo",pinned:'left',width:90 },
          { field: "floorNo",width:100 },
          { field: "maxOccupancy",width:120 },
          { field: "currentOccupancy",headerName:"status",width:120 },
          { field: "allotRooms",width:180,
                cellRenderer:(params)=>{
                  return <Button onClick={()=>handleAllot(params.data)} className="bg-blue-600 hover:bg-blue-500" size="sm">Allot</Button>} },
          { field: "viewDetails",width:180,cellRenderer:(params)=>{return <Button onClick={()=>handleView(params.data)} className="bg-blue-600 hover:bg-blue-500" size="sm">View Info</Button>} }
        ]);
      



  return (
// Container with theme & dimensions
<div className="ag-theme-quartz" style={{ height: 480, width:800 }}>
  {/* The AG Grid component */}
  <AgGridReact rowData={rowData} columnDefs={colDefs} />
</div>
  )
}

export default RoomTable