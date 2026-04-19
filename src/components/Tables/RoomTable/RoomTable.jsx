import React, { useEffect, useState } from 'react'
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { Button } from "@/components/ui/button"
import { setAllot, setView, setAllotData, setRoomData } from '../../../Store/Reducers/roomSlice';
import { useDispatch } from 'react-redux';

const RoomTable = ({ data }) => {

  const Dispatcher = useDispatch();

  const handleAllot = (data) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.style.overflowY = 'hidden';

    Dispatcher(setAllotData({
      roomNo: data.roomNo,
      hostelNo: data.hostelNo,
      rollNo: null
    }));

    Dispatcher(setAllot(true));
  };

  const handleView = (data) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.style.overflowY = 'hidden';

    Dispatcher(setRoomData(data));
    Dispatcher(setView(true));
  };

  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    if (data) {
      console.log("TABLE DATA:", data); // 🔥 debug
      setRowData(data);   // ✅ FIXED
    }
  }, [data]);

  const [colDefs] = useState([
    { field: "roomNo", pinned: 'left', width: 90 },
    { field: "floorNo", width: 100 },
    { field: "maxOccupancy", width: 120 },
    { field: "currentOccupancy", headerName: "Status", width: 140 },
    {
      field: "allotRooms",
      width: 160,
      cellRenderer: (params) => (
        <Button
          onClick={() => handleAllot(params.data)}
          className="bg-blue-600 hover:bg-blue-500"
          size="sm"
        >
          Allot
        </Button>
      )
    },
    {
      field: "viewDetails",
      width: 160,
      cellRenderer: (params) => (
        <Button
          onClick={() => handleView(params.data)}
          className="bg-blue-600 hover:bg-blue-500"
          size="sm"
        >
          View Info
        </Button>
      )
    }
  ]);

  return (
    <div className="ag-theme-quartz" style={{ height: 480 }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
      />
    </div>
  );
};

export default RoomTable;