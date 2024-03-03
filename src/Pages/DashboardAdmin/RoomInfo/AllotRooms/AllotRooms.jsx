import styles from './AllotRooms.module.scss';
import Roomsbargraph from '../../../../components/Roomsbargraph/Roomsbargraph';
import ComplexSearchRooms from '../../../../components/ComplesSearch/ComplexSearchRooms';
import MultiSelect from '../../../../components/MultiSelect/MultiSelect';
import Button from '../../../../components/Button/Button';
import TableLoader from '../../../../components/TableLoader/TableLoader';
import RoomTable from '../../../../components/Tables/RoomTable/RoomTable';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

  import { Chrono } from "react-chrono";
  
  import {Input} from "@/components/ui/Input"

  import { IoIosCloseCircleOutline } from "react-icons/io";
  import { toast, ToastContainer } from 'react-toastify';
  import "react-toastify/dist/ReactToastify.css";

  import {Chart, ArcElement, Tooltip, Legend, Title} from 'chart.js';
import { Doughnut } from "react-chartjs-2";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAllot,setView,setAllotData } from '../../../../Store/Reducers/roomSlice';
import axios from 'axios';

Chart.register(ArcElement, Tooltip, Legend, Title);
Chart.defaults.plugins.tooltip.backgroundColor = 'rgb(0, 0, 156)';
Chart.defaults.plugins.legend.position = 'left';
Chart.defaults.plugins.legend.title.display = true;
Chart.defaults.plugins.legend.title.font = 'Helvetica Neue';


const items = [
    {
      title: "24 March 2022",
      cardTitle: "Room Entry",
      cardSubtitle: "Rollno:52211123, 522145323",
      cardDetailedText: "Akshat Jain, Ritik Occupied this Room",
    },
    {
        title: "2 February 2022",
        cardTitle: "Room Leave",
        cardSubtitle: "Rollno:52211211",
        cardDetailedText: "Maaz Ansari Leaved the Room",
    },
    {
      title: "1 January 2022",
      cardTitle: "Room Entry",
      cardSubtitle: "RollNo:52211211",
      cardDetailedText: "Maaz Ansari Occupied this Room",
    },
  ];




const AllotRooms = ()=>{

    const [rowData,setRowData] = useState(null);

    const allotModal = useSelector(state=>state.haRoom.allot);
    const viewModal = useSelector(state=>state.haRoom.view);
    const Dispatcher = useDispatch();
    const [totalRooms,setTotalRooms] = useState(0);
    const [partiallyFilled,setPartiallyFilled] = useState(0);
    const [vacant,setVacant] = useState(0);
    const [fullyFilled,setFullyFilled] = useState(0);
    const roomData = useSelector(state=>state.haRoom.roomData);
    const allotData = useSelector(state=>state.haRoom.allotData);

    useEffect(()=>{
        console.log(allotData);
    },[allotData]);


    const initialLoad = async ()=>{
        try{
            const res = await axios({
                method: 'get',
                url: 'http://localhost:3000/HA/getRoomsData',
                params: {
                    "hostelNo":"11"
                }
              });
              setRowData(res.data.roomsData);
              setTotalRooms(res.data.totalRooms);
              setPartiallyFilled(res.data.partiallyFilledCount);
              setVacant(res.data.vacantCount);
              setFullyFilled(res.data.fullyFilledCount);
        }catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        initialLoad();
    },[])

Chart.defaults.plugins.legend.title.text = `Out of ${totalRooms}`;
    const data = {
        labels: ["fully filled", "Vacant", "Partially Filled"],
        datasets: [
          {
            data: [fullyFilled, vacant, partiallyFilled],
            backgroundColor: ["green", "skyblue", "orange"],
          },
        ],
        borderWidth: 2,
        radius: '40%' 
      };

const handleAllotRollno = (e)=>{
    Dispatcher(setAllotData({...allotData,rollNo:e.target.value}));
}

const roomSuccess = () => {
    toast.success("Room Allotement Successful!", {
        position: "top-center"
      });}

const roomFailed = (err) => {
        toast.error(`${err.response.data.message}`, {
            position: "top-center",
});}
    

const roomAlloted = ()=>{
    ;(async ()=>{
        try{
          const res = await axios({
                method:'post',
                url:'http://localhost:3000/HA/singleRoomAllot',
                data:allotData
            })
            roomSuccess();
            Dispatcher(setAllot(false));

            initialLoad();
            console.log(res);
        
        }catch(err){
            roomFailed(err);
            Dispatcher(setAllot(false));
            console.log(err);
        }
    })()
    document.body.style.overflowY='auto';
}



    return<>
    <h1 className='text-3xl'>Rooms Allotement</h1>
    <div className={styles.container}>
    <Card>
    <CardHeader>
        <CardTitle>Rooms Status</CardTitle>
        <CardDescription>Check the Rooms Status of whole hostel</CardDescription>
    </CardHeader>
    <CardContent>
    <Doughnut type="doughnut" data={data} />
        </CardContent>
        </Card>

        <Card>
        <CardHeader>
            <CardTitle>Search Queries</CardTitle>
            <CardDescription>Search Rooms according to queries</CardDescription>
        </CardHeader>
        <div className={' mb-4'}>
        <CardContent>
        <div className='flex'>
        <Select>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Room No" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="light">Floor No</SelectItem>
                <SelectItem value="dark">Name</SelectItem>
                <SelectItem value="system">Roll No</SelectItem>
            </SelectContent>
            </Select>
            <Input/>
        </div>
            <div className={styles.MultiSelect}>
                <p>Status:</p>
                <Select>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Option" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="light">Filled</SelectItem>
                <SelectItem value="dark">Vacant</SelectItem>
                <SelectItem value="system">Partially Filled</SelectItem>
            </SelectContent>
            </Select>
            </div>
            <div className={styles.MultiSelect}>
                <p>Floor:</p>
                <Select>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Option" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="light">G</SelectItem>
                <SelectItem value="dark">1</SelectItem>
                <SelectItem value="system">2</SelectItem>
            </SelectContent>
            </Select>
            </div>
            </CardContent>
            <CardFooter className='flex justify-between'>
                <Button text="Reset" />
                <Button variant="contained" text="Search" />
                </CardFooter>
            </div>
        </Card>

        <div className={styles.tableArea+' mt-4'}>
                {rowData===null?<TableLoader />
                :<RoomTable data={rowData}/>}
            </div>




    

      {allotModal?<div className='absolute top-0 left-0 w-full h-screen z-50 flex justify-center items-center'>
      <div className='absolute top-0 left-0 w-full h-screen bg-black opacity-70'></div>
            <div className='w-[450px] h-[350px] z-50'>
            <Card>
                <CardHeader>
                    <CardTitle>Allot Room To Student</CardTitle>
                    <CardDescription>You can assign a room using Roll no</CardDescription>
                    <CardContent>
                    <div className='mt-8'>
                        <label>Roll No:</label>
                        <Input onChange={handleAllotRollno} type="text"/>
                    </div>
                    </CardContent>
                    <CardFooter className='flex justify-between'>
                        <Button onClick={()=>{Dispatcher(setAllot(false));document.body.style.overflowY='auto';}} text="Discard" className='mr-2'/>
                        <Button onClick={roomAlloted} variant="contained" text="Allot"/>
                    </CardFooter>
                </CardHeader>
            </Card>
            </div>
      </div>:null}
     
     
      {viewModal?<div className={'absolute top-0 left-0 w-full h-screen z-50 flex justify-center'}>
      <div className='absolute top-0 left-0 w-full h-screen bg-black opacity-70'></div>
        <div className='w-[80%] h-[80vh] z-50 rounded-md mt-8'>
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-between"><h1>Room {roomData.roomNo}</h1> <div onClick={()=>{Dispatcher(setView(false));document.body.style.overflowY='auto';}} className='cursor-pointer text-blue-700 hover:text-blue-500'><IoIosCloseCircleOutline size="30"/></div></CardTitle>
                <CardDescription>Details about room</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='flex flex-col'>
                        <div className='flex gap-4'>
                            <p><span className='font-bold'>Max Occupancy:</span> {roomData.maxOccupancy}</p> 
                            <p><span className='font-bold'>Presently Living:</span> {roomData.roomsStudentMappings.length}</p> 
                        </div>
                        <div className='flex gap-16'>
                        <div className='mt-8 flex flex-col gap-8'>
                        <h1>Occupants</h1>
                            {roomData.roomsStudentMappings.map(d=><div className='flex gap-4'>
                                <div className='bg-gray-500 w-[100px] h-[100px] rounded-full'></div>
                                <div className='flex flex-col'>
                                    <p><span className='font-bold'>Name: </span>{d.student.firstName} {d.student.lastName}</p>
                                    <p><span className='font-bold'>Roll no: </span>{d.rollNo}</p>
                                    <p><span className='font-bold'>email: </span>{d.student.email}</p>
                                    <div className='flex gap-2'><Button text="View Details" />
                                    <Button className="bg-red-600 text-white border-0 hover:bg-red-500" text="Remove" /></div>
                                </div>
                            </div>)}
                            </div>
                    <div className='mt-8 h-[400px] w-[600px]'>
                    <h1>Room's History</h1>
                    <Chrono
                        items={items}
                        mode="VERTICAL"
                        cardHeight={100}
                        mediaHeight={50}
                        />
                    </div>
                        </div>                   
                    </div>
                </CardContent>
                <CardFooter>

                </CardFooter>
        </Card>
        </div>
      </div>:null}
      <ToastContainer />
    </div>
    </>
}


export default AllotRooms;