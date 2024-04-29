import styles from './AllotRooms.module.scss';
import Button from '../../../../components/Button/Button';
import TableLoader from '../../../../components/TableLoader/TableLoader';
import RoomTable from '../../../../components/Tables/RoomTable/RoomTable';
import Modal from '../../../../components/Modals/Modal';
import { changeModalState } from '../../../../Store/Reducers/viewInfoSlice';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
  } from "@/components/ui/dialog"

import {Textarea} from "@/components/ui/textarea"


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
  
  import {Input} from "@/components/ui/input"

  import { IoIosCloseCircleOutline } from "react-icons/io";
  import { toast, ToastContainer } from 'react-toastify';
  import "react-toastify/dist/ReactToastify.css";

  import {Chart, ArcElement, Tooltip, Legend, Title} from 'chart.js';
import { Doughnut } from "react-chartjs-2";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAllot,setView,setAllotData } from '../../../../Store/Reducers/roomSlice';
import axios from 'axios';
import './Pagination.css';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';
import { set } from 'date-fns';



Chart.register(ArcElement, Tooltip, Legend, Title);
Chart.defaults.plugins.tooltip.backgroundColor = 'rgb(0, 0, 156)';
Chart.defaults.plugins.legend.position = 'left';
Chart.defaults.plugins.legend.title.display = true;
Chart.defaults.plugins.legend.title.font = 'Helvetica Neue';


// const items = [
//     {
//       title: "24 March 2022",
//       cardTitle: "Room Entry",
//       cardSubtitle: "Rollno:52211123, 522145323",
//       cardDetailedText: "Akshat Jain, Ritik Occupied this Room",
//     },
//     {
//         title: "2 February 2022",
//         cardTitle: "Room Leave",
//         cardSubtitle: "Rollno:52211211",
//         cardDetailedText: "Maaz Ansari Leaved the Room",
//     },
//     {
//       title: "1 January 2022",
//       cardTitle: "Room Entry",
//       cardSubtitle: "RollNo:52211211",
//       cardDetailedText: "Maaz Ansari Occupied this Room",
//     },
//   ];




const AllotRooms = ()=>{
    const navigator = useNavigate();
    const [rowData,setRowData] = useState(null);
    const [loading,setLoading] = useState(false);
    const allotModal = useSelector(state=>state.haRoom.allot);
    const viewModal = useSelector(state=>state.haRoom.view);
    const Dispatcher = useDispatch();
    const [totalRooms,setTotalRooms] = useState(0);
    const [partiallyFilled,setPartiallyFilled] = useState(0);
    const [vacant,setVacant] = useState(0);
    const [fullyFilled,setFullyFilled] = useState(0);
    const roomData = useSelector(state=>state.haRoom.roomData);
    const allotData = useSelector(state=>state.haRoom.allotData);
    const [totalPages,setTotalPage] = useState(0);
    const [rooms, setRooms] = useState();
    const [status,setStatus] = useState('');
    const [floorNo,setFloorNo] = useState('');
    const viewStudent = useSelector(state=>state.viewInfoStates.modalState);
    const [viewStudentInfoModalData,setViewInfoModal] = useState({});
    const [comment,setComment] = useState('');
    const [loadHistory,setLoadHistory] = useState(false);
    useEffect(()=>{
        console.log(allotData);
    },[allotData]);

    const [myItems,setMyItems] = useState([]);

    useEffect(()=>{
        console.log(myItems);
    },[myItems])


    const loadRoomHistory = async()=>{
        setLoadHistory(false);
        try{

            const res = axios({
                method:'GET',
                url:`${import.meta.env.VITE_BASE_URL}/HA/getRoomTimeLine`,
                params:{
                    roomId:roomData.roomId
                },
                withCredentials:true                        
            })
            
            res.then((data)=>{
                    let makeMydata=[];

                    console.log(data.data.roomData);
                    data.data.roomData.forEach(d=>{

                        if(d.checkOutDate){
                            let checkout = new Date(d.checkOutDate);
                            checkout = checkout.toLocaleDateString(
                                'en-GB',
                                {
                                    year:'numeric',
                                    month:'long',
                                    day:'numeric'
                                }
                            );

                            let checkin = new Date(d.createdAt);
                            checkin = checkin.toLocaleDateString(
                                'en-GB',
                                {
                                    year:'numeric',
                                    month:'long',
                                    day:'numeric'
                                }
                            );

                            makeMydata.unshift({
                                title:checkin,
                                cardTitle:'Room Entry',
                                cardSubtitle:`Rollno:${d.rollNo}`,
                                cardDetailedText:`${d.student.firstName} ${d.student.lastName} Occupied this Room`
                        }
                        )
                            makeMydata.unshift({
                                title:checkout,
                                cardTitle:'Room Leave',
                                cardSubtitle:`Rollno:${d.rollNo}`,
                                cardDetailedText:`${d.student.firstName} ${d.student.lastName} --  comment: ${d.comment}`
                            })

                        }else{
                            let checkin = new Date(d.createdAt);
                            checkin = checkin.toLocaleDateString(
                                'en-GB',
                                {
                                    year:'numeric',
                                    month:'long',
                                    day:'numeric'
                                }
                            );
                            makeMydata.unshift({
                                title:checkin,
                                cardTitle:'Room Entry',
                                cardSubtitle:`Rollno:${d.rollNo}`,
                                cardDetailedText:`${d.student.firstName} ${d.student.lastName} Occupied this Room`
                        }
                        )
                    }
                
                })


                setMyItems(makeMydata);
                setLoadHistory(true);

                })
    
    }catch(err){
            console.log(err);
        }   
    }

    useEffect(()=>{

        if(viewModal){
              loadRoomHistory();
        }else{
            setMyItems([]);
        }

    },[viewModal])



    const initialLoad = async ()=>{
        try{
            const res = await axios({
                method: 'GET',
                url:import.meta.env.VITE_BASE_URL  + '/HA/getRoomsData',
                params: {
                    "hostelNo":"1",
                },
                withCredentials:true
              });
              setRowData(res.data.roomsData);
              setTotalRooms(res.data.totalRooms);
              setPartiallyFilled(res.data.partiallyFilledCount);
              setVacant(res.data.vacantCount);
              setFullyFilled(res.data.fullyFilledCount);
              setTotalPage(res.data.roomsData[0].previous.totalpages);
        }catch(err){
            console.log(err);
            if(err.status === 401){
                navigator('/adminLogin');
            }
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
                method:'POST',
                url:import.meta.env.VITE_BASE_URL + '/HA/singleRoomAllot',
                data:allotData,
                withCredentials:true
            })
            roomSuccess();
            Dispatcher(setAllot(false));

            initialLoad();
            console.log(res);
        
        }catch(err){
            roomFailed(err);
            Dispatcher(setAllot(false));
            console.log(err);

            if(err.status===401){
                navigator('/')
            }
        }
    })()
    document.body.style.overflowY='auto';
}


const handlePageClick = (e)=>{
    
console.log(e)


        ;(async ()=>{
        try{
            const res = await axios({
                url:import.meta.env.VITE_BASE_URL + '/HA/getRoomsData',
                method:'GET',
                params:{
                    page:e.selected+1,
                    roomNo:rooms,
                    floorNo:floorNo
                },
                withCredentials:true
            })
            if(res.data.roomsData!==undefined){
                setRowData(res.data.roomsData);
                setTotalPage(res.data.roomsData[0].previous.totalpages)
            }else{  
                setRowData([]);
            }
        }catch(err){
            console.log(err);
        }
    })()
}

const handleRooms = (e)=>{
    setRooms(e.target.value);
}

const handleStatus = (e)=>{
    console.log(e);
    setStatus(e);
}


const handleFloor = (e) =>{
    setFloorNo(e);
}

const handleSearch = ()=>{


    ;(async ()=>{
        try{
            const res = await axios({
                url:import.meta.env.VITE_BASE_URL + '/HA/getRoomsData',
                method:'get',
                params:{
                    hostelNo:1,
                    roomNo:rooms,
                    status:status,
                    floorNo:floorNo                   
                },
                withCredentials:true
            })

            console.log(res.data)

            if(res.data.roomsData!==undefined){
                setRowData(res.data.roomsData);
                setTotalPage(res.data.roomsData[0].previous.totalpages);

            }else{
                setRowData([]);
                setTotalPage(0);
            }

        }catch(error){

        }
    })()



}


const removeStudentFromRoom = async(d,roomData)=>{
    console.log(d);
    try{
    
        const res = await axios({
            method:'POST',
            url:`${import.meta.env.VITE_BASE_URL}/HA/singleRoomRemove`,
            data:{
                roomNo:roomData.roomNo,
                rollNo:d.rollNo,
                comment:comment
            },
            withCredentials:true
        })
        console.log(res);
        initialLoad();
        toast.success("Student Removed Successfully!", {
            position: "top-center"
            });

    }catch(err){
        console.log(err);

    }

}



const handleStudentInfo =(rollNo)=>{

    setLoading(true);
    ;(async ()=>{
        try{
            const res = await axios({
                url:`${import.meta.env.VITE_BASE_URL}/HA/student/${rollNo}`
            })

            console.log(res);
            setLoading(false);
            setViewInfoModal(res.data);
            Dispatcher(changeModalState(true));

        }catch(error){
            console.log(error);
        }
    })()


}



    return<>
    <h1 className='text-3xl mt-16 md:mt-4 text-blue-600 p-8 md:p-8 text-center'>Rooms Allotement</h1>
    <div className={styles.container + ' flex flex-col items-center'}>

<div className='flex flex-col md:flex-row'>
     <div className='md:min-w-[350px] p-4'>  
    <Card>
    <CardHeader>
        <CardTitle>Rooms Status</CardTitle>
        <CardDescription>Check the Rooms Status of whole hostel</CardDescription>
    </CardHeader>
    <CardContent>
    <Doughnut type="doughnut" data={data} />
        </CardContent>
        </Card>
        </div> 


{/* //Search query */}
    <div className='mt-4 md:mt-0 md:p-4 p-4 min-w-[350px]'>
        <Card>
        <CardHeader>
            <CardTitle>Search Queries</CardTitle>
            <CardDescription>Search Rooms according to queries</CardDescription>
        </CardHeader>
        <div className={' mb-4'}>
        <CardContent>
        <div className='flex flex-col md:min-w-[400px]'>
            <p>Room No:</p>
            <Input onChange={handleRooms} className="md:w-[200px]"/>
        </div>
            <div className={styles.MultiSelect}>
                <p>Status:</p>
                <Select onValueChange={handleStatus}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Option" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Fully-Filled">Fully Filled</SelectItem>
                <SelectItem value="Partially-Filled">Partially Filled</SelectItem>
                <SelectItem value="vacant">Vacant</SelectItem>
                <SelectItem value={null}>None</SelectItem>
            </SelectContent>
            </Select>
            </div>
            <div className={styles.MultiSelect}>
                <p>Floor:</p>
                <Select onValueChange={handleFloor}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Option" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="0">G</SelectItem>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="6">6</SelectItem>
                <SelectItem value="7">7</SelectItem>
                <SelectItem value="8">8</SelectItem>
                <SelectItem value={null}>None</SelectItem>
            </SelectContent>
            </Select>
            </div>
            </CardContent>
            <CardFooter className='flex justify-between'>
                <Button text="Reset" />
                <Button onClick={handleSearch} variant="contained" text="Search" />
                </CardFooter>
            </div>
        </Card>
        </div>
        </div>

        <div className={styles.tableArea+' mt-4 p-4 min-w-[300px] w-full md:min-w-[600px] md:max-w-[900px]'}>
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
                                    <div className='flex gap-2'><Button onClick={()=>handleStudentInfo(d.rollNo)} text="View Details" />
                                    <Dialog>
                                        <DialogTrigger>
                                    <Button className="bg-red-600 text-white border-0 hover:bg-red-500" text="Remove" />
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Remove Student</DialogTitle>
                                            <DialogDescription>Are you sure you want to remove this student from room?</DialogDescription>
                                            <DialogDescription>Comment For this Transaction</DialogDescription>
                                            </DialogHeader>
                                            <div>
                                                <Textarea onChange={(e)=>{setComment(e.currentTarget.value);}}/>
                                            </div>
                                            <DialogFooter>
                                                <DialogTrigger>
                                                <Button onClick={()=>{removeStudentFromRoom(d,roomData);Dispatcher(setView(false));document.body.style.overflowY='auto';}} className="bg-red-600 text-white border-0 hover:bg-red-500" text="Remove" />
                                                <Button text="Cancel" />
                                                </DialogTrigger>
                                            </DialogFooter>                                         
                                    </DialogContent>
                                    </Dialog>
                                    </div>
                                </div>
                            </div>)}
                            </div>
                    <div className='mt-8 h-[400px] w-[600px]'>
                    <h1>Room's History</h1>
                    {loadHistory&&myItems.length!==0?<Chrono
                        items={myItems}
                        mode="VERTICAL"
                        cardHeight={100}
                        mediaHeight={50}
                        fontSizes={{
                            cardSubtitle: '0.85rem',
                            cardText: '0.8rem',
                            cardTitle: '1rem',
                            title: '1rem',
                          }}
                        />:<p>No Rooms History</p>}
                    </div>
                        </div>                   
                    </div>
                </CardContent>
                <CardFooter>

                </CardFooter>
        </Card>
        </div>
      </div>:null}


      {viewStudent&&!loading?<Modal data={viewStudentInfoModalData}/>:null}

      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={totalPages}
        previousLabel="< previous"
        renderOnZeroPageCount={null}
        containerClassName="pagination justify-content-center"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            activeLinkClassName="active-page"
      />
      <ToastContainer />
      <div className='mt-4'></div>
    </div>
    </>
}


export default AllotRooms;