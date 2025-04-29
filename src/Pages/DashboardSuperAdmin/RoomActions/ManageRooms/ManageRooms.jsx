
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { DevTool } from "@hookform/devtools"
import axios from "axios";
import { ToastContainer,toast } from "react-toastify"
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useState } from "react"
export default function MangageRooms() {

const { register, handleSubmit, control } = useForm({
  defaultValues: {
    roomNo: "",
    floorNo: "",
    block: "",
    maxOccupancy: "",
    hostelNo: "",
  },
  mode: "onBlur",
})


const onSubmit = async (data) => {
  console.log(data);
  try {
    const response = await axios({
      url: import.meta.env.VITE_BASE_URL + "/SA/addroom",
      method: "POST",
      data: {
        roomNo: data.roomNo,
        block: data.block,
        floorNo: data.floorNo,
        maxOccupancy: data.maxOccupancy,
        hostelNo: data.hostelNo,
      },
      withCredentials: true,
    })

    console.log(response.data)
    toast.success('Room Added Succesfully', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      });

  } catch (error) {
    console.error(error.response.data.message)
    toast.error(error.response.data.message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
  })
}
}


// Table for Rooms
  const [rowData, setRowData] = useState([
      { make: "Tesla", model: "Model Y", price: 64950, electric: true },
      { make: "Ford", model: "F-Series", price: 33850, electric: false },
      { make: "Toyota", model: "Corolla", price: 29600, electric: false },
  ]);

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState([
      { field: "make" },
      { field: "model" },
      { field: "price" },
      { field: "electric" }
  ]);





  return (
    <>
    
      <main className="bg-gray-100 py-8 px-6 min-h-screen">
        <div className="container mx-auto">
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Add New Room</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="room-number">Room Number</Label>
                <Input {...register('roomNo')} id="room-number" type="number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="floor">Floor</Label>
                <Input {...register('floorNo')} id="floor" type="number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="block">Block</Label>
                <Input {...register('block')} id="block" type="text" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input {...register('maxOccupancy')} id="capacity" type="number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Hostel Number</Label>
                <Input {...register('hostelNo')} id="capacity" type="number" />
              </div>
              <div className="col-span-2 flex justify-end">
                <Button className="bg-blue-600 hover:bg-blue-500 text-white" variant="primary" size="sm">Add Room</Button>
              </div>
            </form>
          </div>
          <div className="mb-6 mt-10">
            <h2 className="text-2xl font-bold">Rooms</h2>
            <div className="ag-theme-quartz" style={{ height: 400, width: "100%" }}>
              <AgGridReact
                      rowData={rowData}
                      columnDefs={colDefs}
                      rowHeight={50}
                      headerHeight={50}

              />
          </div>
          </div>
         </div>
      </main>
      <DevTool control={control} />
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  )
}