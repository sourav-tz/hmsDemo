import styles from './AllotRooms.module.scss';
import Roomsbargraph from '../../../../Components/Roomsbargraph/Roomsbargraph';
import ComplexSearchRooms from '../../../../Components/ComplesSearch/ComplexSearchRooms';
import MultiSelect from '../../../../Components/MultiSelect/MultiSelect';
import Button from '../../../../Components/Button/Button';
import TableLoader from '../../../../Components/TableLoader/TableLoader';
import RoomTable from '../../../../Components/Tables/RoomTable/RoomTable';
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


  import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAllot,setView } from '../../../../Store/Reducers/roomSlice';
ChartJS.register(ArcElement, Tooltip, Legend);


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

    const [rowData,setRowData] = useState([]);

    const allotModal = useSelector(state=>state.haRoom.allot);
    const viewModal = useSelector(state=>state.haRoom.view);
    const Dispatcher = useDispatch();


    useEffect(()=>{
        console.log(allotModal);
    },[allotModal])



    const data = {
        labels: ["Total Rooms", "Vacant", "Partially Filled"],
        datasets: [
          {
            data: [204, 50, 100],
            backgroundColor: ["green", "skyblue", "orange"],
          },
        ],
      };



    return<>
    <h1 className='text-3xl'>Rooms Allotement</h1>
    <div className={styles.container}>
    <div className={styles.roomsBarGraph+' p-8'}>
    <Doughnut type="doughnut" data={data} />
        </div>
        <div className={styles.queryArea+' mb-4'}>
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
            <div className={styles.buttonArea}>
                <Button text="Reset" />
                <Button variant="contained" text="Search" />
            </div>

        </div>

        <div className={styles.tableArea}>
                {/* <TableLoader /> */}
                <RoomTable />
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
                        <Input type="text"/>
                    </div>
                    </CardContent>
                    <CardFooter className='flex justify-between'>
                        <Button onClick={()=>{Dispatcher(setAllot(false))}} text="Discard" className='mr-2'/>
                        <Button  variant="contained" text="Allot"/>
                    </CardFooter>
                </CardHeader>
            </Card>
            </div>
      </div>:null}
     
     
      {viewModal?<div className='absolute top-0 left-0 w-full h-screen z-50 flex justify-center'>
      <div className='absolute top-0 left-0 w-full h-screen bg-black opacity-70'></div>
        <div className='w-[80%] h-[80vh] z-50 rounded-md mt-8'>
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-between"><h1>Room 215</h1> <div onClick={()=>{Dispatcher(setView(false))}} className='cursor-pointer text-blue-700 hover:text-blue-500'><IoIosCloseCircleOutline size="30"/></div></CardTitle>
                <CardDescription>Details about room</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='flex flex-col'>
                        <div className='flex gap-4'>
                            <p><span className='font-bold'>Max Occupancy:</span> 2</p> 
                            <p><span className='font-bold'>Presently Living:</span> 2</p> 
                        </div>
                        <div className='flex gap-16'>
                        <div className='mt-8 flex flex-col gap-8'>
                        <h1>Occupants</h1>
                            <div className='flex gap-4'>
                                <div className='bg-gray-500 w-[100px] h-[100px] rounded-full'></div>
                                <div className='flex flex-col'>
                                    <p><span className='font-bold'>Name: </span>Maaz Ansari</p>
                                    <p><span className='font-bold'>Roll no: </span>52211211</p>
                                    <p><span className='font-bold'>Mobile no: </span>9457077164</p>
                                    <Button text="View Details" />
                                </div>
                            </div>
                            <div className='flex gap-4'>
                                <div className='bg-gray-500 w-[100px] h-[100px] rounded-full'></div>
                                <div className='flex flex-col'>
                                    <p><span className='font-bold'>Name: </span>Ritik Sharma</p>
                                    <p><span className='font-bold'>Roll no: </span>522112321</p>
                                    <p><span className='font-bold'>Mobile no: </span>84545454164</p>
                                    <Button text="View Details" />
                                </div>
                            </div>
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

    </div>
    </>
}


export default AllotRooms;