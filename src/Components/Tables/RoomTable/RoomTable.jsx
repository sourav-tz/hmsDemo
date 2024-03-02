import React from 'react'
import { AgGridReact } from 'ag-grid-react'; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { setAllot,setView } from '../../../Store/Reducers/roomSlice';
import { useDispatch } from 'react-redux';
const RoomTable = () => {

const Dispatcher = useDispatch();
const handleAllot = ()=>{
    Dispatcher(setAllot(true));
}

const handleView = ()=>{
  Dispatcher(setView(true));
}


        const [rowData, setRowData] = useState([
          { roomNo: "115", floorNo: 0, occupancy: 2, status: "filled" },
          { roomNo: "115", floorNo: 0, occupancy: 2, status: "filled" },
          { roomNo: "115", floorNo: 0, occupancy: 2, status: "filled" },
          { roomNo: "115", floorNo: 0, occupancy: 2, status: "filled" }
        ]);
        
        // Column Definitions: Defines & controls grid columns.
        const [colDefs, setColDefs] = useState([
          { field: "roomNo",pinned:'left',width:90 },
          { field: "floorNo",width:100 },
          { field: "occupancy",width:120 },
          { field: "status",width:120 },
          { field: "allotRooms",width:180,cellRenderer:()=>{return <Button onClick={handleAllot} className="bg-blue-600 hover:bg-blue-500" size="sm">Allot</Button>} },
          { field: "viewDetails",width:180,cellRenderer:()=>{return <Button onClick={handleView} className="bg-blue-600 hover:bg-blue-500" size="sm">View Info</Button>} }
        ]);
      



  return (
// Container with theme & dimensions
<div className="ag-theme-quartz" style={{ height: 300, width:800 }}>
  {/* The AG Grid component */}
  <AgGridReact rowData={rowData} columnDefs={colDefs} />
</div>
  )
}

export default RoomTable