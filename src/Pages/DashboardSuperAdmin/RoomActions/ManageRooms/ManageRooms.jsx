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
import { useEffect, useState } from "react"
import {Chart, ArcElement, Tooltip, Legend, Title} from 'chart.js';
import { Doughnut } from "react-chartjs-2";
import backgroundImage from '../../../../Assets/hostel11.jpg';

  
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import {
  Select, SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select';


Chart.register(ArcElement, Tooltip, Legend, Title);
Chart.defaults.plugins.tooltip.backgroundColor = 'rgb(0, 0, 156)';
Chart.defaults.plugins.legend.position = 'left';
Chart.defaults.plugins.legend.title.display = true;
Chart.defaults.plugins.legend.title.font = 'Helvetica Neue';
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
  // console.log(data);
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

    // console.log(response.data)
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
    // console.error(error.response.data.message)
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



// CHART FOR SUPERADMIN
const [totalRooms,setTotalRooms] = useState(0);
const [partiallyFilled,setPartiallyFilled] = useState(0);
const [vacant,setVacant] = useState(0);
const [fullyFilled,setFullyFilled] = useState(0);

const [hostelData, setHostelData] = useState([]);
const [hostelNo, setHostelNo] = useState();
// Bug fix by Ravi: Bug 4 - SA had no way to view hostel capacity stats
const [capacitySummary, setCapacitySummary] = useState({});
// Bug fix by Ravi: Bug 6 - Block-wise filtering was missing; rooms grouped by block
const [allRooms, setAllRooms] = useState([]);
const [blockFilter, setBlockFilter] = useState('all');


const getHostelRoomsData = async ()=>{
    try{
      
      // console.log("Calling for _>",hostelNo)
        const res = await axios({
            method: 'get',
            url:import.meta.env.VITE_BASE_URL  + '/SA/getAllRoomsData',
            params: { tokenHostelNo: hostelNo }, // Send data as query parameters
            withCredentials:true
          });
          // console.log("HOSTELS DATA _>",res);
          setTotalRooms(res.data.totalRooms);
          setPartiallyFilled(res.data.partiallyFilledCount);
          setVacant(res.data.vacantCount);
          setFullyFilled(res.data.fullyFilledCount);
    }catch(err){
        console.log(err);
    }
}

useEffect(()=>{
    getHostelsTry();
    if (hostelNo) {
      getHostelRoomsData();
      // Bug fix by Ravi: Bug 4 - fetch capacity summary when hostel changes
      fetchCapacitySummary();
      // Bug fix by Ravi: Bug 6 - fetch all rooms for block filtering
      fetchAllRooms();
    }
},[hostelNo])

// Bug fix by Ravi: Bug 4 - Fetches aggregated capacity stats per hostel from new /SA/hostelCapacity endpoint
const fetchCapacitySummary = async () => {
  try {
    const res = await axios({ url: import.meta.env.VITE_BASE_URL + '/SA/hostelCapacity', method: 'GET', withCredentials: true });
    setCapacitySummary(res.data.result || {});
  } catch (err) { console.log(err); }
};

// Bug fix by Ravi: Bug 6 - Fetch rooms so block filter dropdown can be built
const fetchAllRooms = async () => {
  try {
    const res = await axios({ url: import.meta.env.VITE_BASE_URL + '/SA/getrooms', method: 'GET', withCredentials: true });
    setAllRooms(res.data || []);
  } catch (err) { console.log(err); }
};


// getting hostel names
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

  } catch (error) {
    console.log(error);
  }
}


const handleNoChange = (e) => {
  setHostelNo(() => {
    let hostelNoForm = e.split(" ")[0].substring(1);
    // console.log("HOSTEL NO _>", hostelNoForm);
    return hostelNoForm;

  })
}


Chart.defaults.plugins.legend.title.text = totalRooms ? `Out of: ${totalRooms}` : "No rooms available";

const data = {
    labels: ["fully filled", "Vacant", "Partially Filled"],
    datasets: [
      {
        data: [fullyFilled, vacant, partiallyFilled],
        backgroundColor: ["green", "skyblue", "orange"],
      },
    ],
    borderWidth:2,
    radius: '40%' 
  };


  return (
    <div className="relative min-h-screen w-full flex flex-col justify-start py-10 items-center">
          {/* Background Image Layer */}
          <div
            className="absolute top-0 left-0 w-full h-full bg-center bg-cover bg-no-repeat bg-fixed blur-sm opacity-50 z-[-1]"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
      <main className="bg-gray-100 w-[60%] py-8 px-6 min-h-screen rounded-[30px] shadow-[0_3px_10px_rgb(0,0,0,0)] bg-white/0">
        <div className="container mx-auto ">
        <div className="mt-8 bg-white p-6 rounded-[30px] shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white/30">
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
              <div className="C">
                <Label htmlFor="capacity">Hostel Number</Label>
                <Input {...register('hostelNo')} id="capacity" type="number" />
              </div>
              <div className="col-span-2 flex justify-end">
                <Button className="bg-[#5F57FF] hover:bg-blue-500 text-white" variant="primary" size="sm">Add Room</Button>
              </div>
            </form>
          </div>
          
         </div>
          {/* Bug fix by Ravi: Bug 4 - Capacity summary card showing total/occupied/vacant for selected hostel */}
        {hostelNo && capacitySummary[hostelNo] && (
          <div className="container mx-auto mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Hostel H{hostelNo} — Capacity Summary</CardTitle>
                <CardDescription>Total beds, occupied, and available capacity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-8 text-sm">
                  <div><span className="font-semibold">Total Beds:</span> {capacitySummary[hostelNo].total}</div>
                  <div><span className="font-semibold text-red-600">Occupied Rooms:</span> {capacitySummary[hostelNo].occupied}</div>
                  <div><span className="font-semibold text-green-600">Vacant Rooms:</span> {capacitySummary[hostelNo].vacant}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Bug fix by Ravi: Bug 6 - Block-wise filter; shows rooms grouped by block for selected hostel */}
        {hostelNo && allRooms.length > 0 && (
          <div className="container mx-auto mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Block-wise Room Filter</CardTitle>
                <CardDescription>Filter rooms by block for Hostel H{hostelNo}</CardDescription>
              </CardHeader>
              <CardContent>
                <Select onValueChange={setBlockFilter} defaultValue="all">
                  <SelectTrigger className="w-[200px] mb-4">
                    <SelectValue placeholder="Select Block" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Blocks</SelectItem>
                    {[...new Set(allRooms.filter(r => String(r.hostelNo) === String(hostelNo)).map(r => r.block).filter(Boolean))].map(b => (
                      <SelectItem key={b} value={b}>Block {b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  {allRooms
                    .filter(r => String(r.hostelNo) === String(hostelNo))
                    .filter(r => blockFilter === 'all' || r.block === blockFilter)
                    .map(r => (
                      <div key={r.roomId} className="border rounded p-2 text-center">
                        <div className="font-semibold">Room {r.roomNo}</div>
                        <div className="text-gray-500">Block {r.block} | Floor {r.floorNo}</div>
                        <div className={r.currentOccupancy === 'vacant' ? 'text-green-600' : 'text-red-600'}>{r.currentOccupancy}</div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="container mx-auto mt-10">
            <Card>
            <CardHeader>
                <CardTitle>Rooms Status</CardTitle>
                <CardDescription>Check the Rooms Status of whole hostel</CardDescription>
            </CardHeader>
            <CardContent>
            <div className="">
            <Select onValueChange={handleNoChange}>
              <SelectTrigger className="mt-2 w-full md:w-[270px] ml-2 text-base">
                <SelectValue placeholder="Select Hostel" />
              </SelectTrigger>
              <SelectContent>
                {hostelData.map((elem, index) => {
                  return <SelectItem key={index + 1} value={elem}>{elem}</SelectItem>;
                })}
              </SelectContent>
            </Select>
            <div className="w-1/3 ">
              <Doughnut type="doughnut" data={data}/>
            </div>
            </div>
            </CardContent>
            </Card>
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
    </div>
  )
}