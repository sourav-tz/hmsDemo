import React from 'react'
import { AgGridReact } from 'ag-grid-react'; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import { useState } from 'react';
import { Button } from "@/components/ui/button"

const RoomTable = () => {


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
          { field: "allotRooms",width:180,cellRenderer:()=>{return <Button size="sm">Allot</Button>} },
          { field: "viewDetails",width:180,cellRenderer:()=>{return <Button size="sm">View Info</Button>} }
        ]);
      

  return (
// Container with theme & dimensions
<div className="ag-theme-quartz" style={{ height: 500, width:800 }}>
  {/* The AG Grid component */}
  <AgGridReact rowData={rowData} columnDefs={colDefs} />
</div>
  )
}

export default RoomTable