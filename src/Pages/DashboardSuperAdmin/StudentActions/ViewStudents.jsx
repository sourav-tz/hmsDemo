import styles from './ViewInfo.module.scss';
import ComplexSearch from '../../../components/ComplesSearch/ComplesSearch';
import Button from '../../../components/Button/Button';
import TableLoader from '../../../components/TableLoader/TableLoader';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ViewInfoTable from '../../../components/Tables/ViewInfoTable/ViewInfoTable';
import config from '../../../config/config';
import { useDispatch, useSelector } from 'react-redux';
import ReactPaginate from 'react-paginate';
import { setSearchQuery } from '../../../Store/Reducers/viewInfoSlice';
import { useNavigate } from 'react-router-dom';
import './Pagination.css';
import backgroundImage from '../../../Assets/hostel11.jpg';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const ViewInfo = ()=>{
  const [data,setData] = useState([]);
  const searchQuery = useSelector(state=>state.viewInfoStates.searchQuery);
  const [totalPages , setTotalPages] = useState(null);
  const [tableLoading,setTableLoading] = useState(true);
  const Dispatcher = useDispatch();
  const [mycourses,setMyCourses] = useState([]);
  const [noOfYears,setNoOfYears] = useState(8);
  const [years,setMyYears] = useState([1,2,3,4]);
  // const [currHostelOnly, setCurrHostelOnly] = useState(false);
  const Navigator = useNavigate();
  const [selectedState, setSelectedState] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedHostel, setSelectedHostel] = useState('');
  

  useEffect(()=>{
      axios.get(import.meta.env.VITE_BASE_URL + '/HA/studentsInfo?page=1&limit=10&total=0',config)
      .then(res=>{
        console.log("API Response:", res.data);
        if (res.data && Array.isArray(res.data) && res.data.length > 0 && res.data[0].previous) {
          setTotalPages(res.data[0].previous.totalpages);
          const studentData = res.data.length > 2 ? res.data.slice(2) : [];
          console.log("Student data:", studentData);
          setData(studentData);
        } else {
          console.log("No student data found or invalid response format");
          setData([]);
        }
        setTableLoading(false);
      })
      .catch(err=>{console.log("API Error:", err);setTableLoading(false)});

      ;(async ()=>{

        try{

          const res = await axios({
            url:import.meta.env.VITE_BASE_URL + '/HA/getCourses',
            method:'get',
            withCredentials:true
          })

          console.log(res);
          const courses = res.data.map(d => {return `${d.courseId}-${d.courseName}-${d.department}`})
          setMyCourses(courses)

        }catch(err){
          console.log(err.response);
          if(err.response.status===401){
            Navigator('/adminLogin');
          }
        }

      })()

  },[])

  useEffect(()=>{
    const myyears = [];
    for(let i =1; i<=noOfYears; i++)
      myyears.push(i);

    setMyYears(myyears);
  },[noOfYears])


  useEffect(()=>{
    console.log(searchQuery);
  },[searchQuery]);


  const indianStates = [
      'Andhra Pradesh',
      'Arunachal Pradesh',
      'Assam',
      'Bihar',
      'Chhattisgarh',
      'Goa',
      'Gujarat',
      'Haryana',
      'Himachal Pradesh',
      'Jharkhand',
      'Karnataka',
      'Kerala',
      'Madhya Pradesh',
      'Maharashtra',
      'Manipur',
      'Meghalaya',
      'Mizoram',
      'Nagaland',
      'Odisha',
      'Punjab',
      'Rajasthan',
      'Sikkim',
      'Tamil Nadu',
      'Telangana',
      'Tripura',
      'Uttar Pradesh',
      'Uttarakhand',
      'West Bengal',
      'Andaman and Nicobar Islands',
      'Chandigarh',
      'Dadra and Nagar Haveli and Daman and Diu',
      'Lakshadweep',
      'Delhi',
      'Puducherry',
      'None'
    ];

    const repeatedArray = Array(6).fill().map((_, index) => index + 1);
    repeatedArray.push('None')


  const handleSearch = () => {
    setTableLoading(true);
    const controller = new AbortController();
    axios({
      method: 'get',
      url:import.meta.env.VITE_BASE_URL + '/HA/studentsInfo',
      // signal: controller.signal,
      headers: {
        "Content-Type": "application/json"
      },
      withCredentials: true,
      params:{
        page:1,
        limit:10,
        total:0,
        // currHostel:currHostelOnly,
        ...((searchQuery.firstName !== '' && searchQuery.firstName !== null) && { firstName: searchQuery.firstName }),
        ...((searchQuery.lastName !== '' && searchQuery.lastName !== null) && { lastName: searchQuery.lastName}),
        ...((searchQuery.rollNo !== '' && searchQuery.rollNo !== null) && { rollNo: searchQuery.rollNo}),
        ...((searchQuery.state !== '' && searchQuery.state !== null) && { state: searchQuery.state}),
        ...((searchQuery.courseId !== '' && searchQuery.courseId !== null) && { courseId: searchQuery.courseId}),
        ...((searchQuery.year !== '' && searchQuery.year !== null) && { year: searchQuery.year}),
        ...((searchQuery.hostel !== '') && { hostel: searchQuery.hostel }),
      },
    })
    .then((res) => {
      console.log("Search API Response:", res.data);
      if (res.data && Array.isArray(res.data) && res.data.length > 0 && res.data[0].previous) {
        setTotalPages(res.data[0].previous.totalpages);
        const studentData = res.data.length > 2 ? res.data.slice(2) : [];
        console.log("Search Student data:", studentData);
        setData(studentData);
      } else {
        console.log("No student data found or invalid response format on search");
        setData([]);
        setTotalPages(0);
      }
      setTableLoading(false);
    })
    .catch((err) => {
      console.log("Search API Error:", err);
      setTableLoading(false);
      if(err.response && err.response.status===401){
        Navigator('/adminLogin');
      }
    });

    setTimeout(() => {
      controller.abort()
  }, 100)

    };


const handleCourse = (e)=>{

Dispatcher(setSearchQuery({...searchQuery,courseId:e}));

;(async ()=>{
  try{
    const res =await axios({
      url:import.meta.env.VITE_BASE_URL + '/HA/getSingleCourse',
      method:'POST',
      withCredentials:true,
      data:{courseId:e}
    })
    console.log(res.data.courseDuration);
    setNoOfYears(res.data.courseDuration);
  }catch(error){
    console.log(error);
    if(err.response.status===401){
      Navigator('/adminLogin');
    }
  }
})()


}

const handleReset = ()=>{
  setTableLoading(true);
  axios.get(import.meta.env.VITE_BASE_URL + '/HA/studentsInfo?page=1&limit=10&total=0',config)
  .then(res=>{
    console.log("Reset API Response:", res.data);
    if (res.data && Array.isArray(res.data) && res.data.length > 0 && res.data[0].previous) {
      setTotalPages(res.data[0].previous.totalpages);
      const studentData = res.data.length > 2 ? res.data.slice(2) : [];
      console.log("Reset Student data:", studentData);
      setData(studentData);
    } else {
      console.log("No student data found or invalid response format on reset");
      setData([]);
    }
    setTableLoading(false);
  })
  .catch(err=>{
    console.log("Reset API Error:", err);
    setTableLoading(false)
    if(err.response && err.response.status===401){
      Navigator('/adminLogin');
    }
  });
  Dispatcher(setSearchQuery({
    firstName:'',
    lastName:'',
    rollNo:'',
    year:'',
    courseId:'',
    department:'',
    state:'',
    hostel:''}));

    // Reset local state for dropdowns
  setSelectedHostel('');
  setSelectedCourse('');
  setSelectedYear('');
  setSelectedState('');
}


const handlePageClick = (e)=>{
      const selectedPage = e.selected + 1; // ReactPaginate uses zero-based indexing, so add 1 to get the actual page number
      console.log(selectedPage);
setTableLoading(true);

  axios({
    url:import.meta.env.VITE_BASE_URL + '/HA/studentsInfo',
    params:{
      page:selectedPage,
      limit:10,
      // currHostel:currHostelOnly,
      total:0,
        ...((searchQuery.firstName !== '' && searchQuery.firstName !== null) && { firstName: searchQuery.firstName }),
        ...((searchQuery.lastName !== '' && searchQuery.lastName !== null) && { lastName: searchQuery.lastName}),
        ...((searchQuery.rollNo !== '' && searchQuery.rollNo !== null) && { rollNo: searchQuery.rollNo}),
        ...((searchQuery.state !== '' && searchQuery.state !== null) && { state: searchQuery.state}),
        ...((searchQuery.courseId !== '' && searchQuery.courseId !== null) && { courseId: searchQuery.courseId}),
        ...((searchQuery.year !== '' && searchQuery.year !== null) && { year: searchQuery.year}),
        ...((searchQuery.hostel !== '' && searchQuery.hostel !== null) && { hostel: searchQuery.hostel }),
    },
    headers: {
      "Content-Type": "application/json"
      },
      withCredentials: true
  })
    .then((res) => {
      console.log("Pagination API Response:", res.data);
      if (res.data && Array.isArray(res.data) && res.data.length > 0 && res.data[0].previous) {
        setTotalPages(res.data[0].previous.totalpages);
        const studentData = res.data.length > 2 ? res.data.slice(2) : [];
        console.log("Pagination Student data:", studentData);
        setData(studentData);
      } else {
        console.log("No student data found or invalid response format on pagination");
        setData([]);
        setTotalPages(0);
      }
      setTableLoading(false);
    })
    .catch((err) => {
      console.log("Pagination API Error:", err);
      setTableLoading(false);
      if(err.response && err.response.status===401){
        Navigator('/adminLogin');
      }
    }); // Return the newLink to update the state


    }
// Function to handle checkbox change
// const handleCheckboxChange = (event) => {
//   setCurrHostelOnly(event.target.checked);  // Update state with checkbox value
// };


    return     <>
    <div className="relative min-h-screen w-full flex flex-col justify-start py-10 items-center">
          {/* Background Image Layer */}
          <div
            className="absolute top-0 left-0 w-full h-full bg-center bg-cover bg-no-repeat bg-fixed blur-sm opacity-50 z-[-1]"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        <div className="w-800px flex flex-col items-center justify-center mt-16 md:mt-0 rounded-[30px] shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white/30">
          <h1 className='text-3xl p-4 mb-4 text-[#5F57FF]'>Search Students Records</h1>
          <div className="w-full md:w-[700px] rounded-md p-12 flex gap-2 flex-1 flex-wrap border-gray-200 shadow-sm justify-center">
              <ComplexSearch />
              <div className="grid grid-cols-2 grid-rows-2 gap-4">
                <div>
                  <p>State:</p>
                  {/* <MultiSelect FOR="state" list={indianStates} onClick={handleMutivalueClick}/> */}
                  <Select
                    value={selectedState}
                    onValueChange={(value) => {
                      setSelectedState(value);
                      Dispatcher(setSearchQuery({ ...searchQuery, state: value }));
                    }}
>
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {indianStates.map(d=><SelectItem value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p>Course:</p>
                  {/* <MultiSelect FOR="course" list={academicQualifications} onClick={handleMutivalueClick}/> */}
                  <Select value={selectedCourse} onValueChange={handleCourse}>
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {mycourses.map((d,id)=><SelectItem value={id+1}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p>Year:</p>
                  {/* <MultiSelect FOR="year" list={repeatedArray} onClick={handleMutivalueClick}/> */}
                  <Select
                  value={selectedYear}
                  onValueChange={(value) => {
                    setSelectedYear(value);
                    Dispatcher(setSearchQuery({ ...searchQuery, year: value }));
                  }}>
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(d=><SelectItem value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
            {/* <div> <label>
                    <input
                      type="checkbox"
                      checked={currHostelOnly}          // Bind the checked state to checkbox
                      onChange={handleCheckboxChange} // Handle changes on checkbox
                      className='mr-2'
                    />
                    Current Hostel Only
                  </label></div> */}
                <div>
                  <p>Hostel:</p>
                  <Select
                    value={selectedHostel}
                    onValueChange={(value) => {
                      setSelectedHostel(value);
                      Dispatcher(setSearchQuery({ ...searchQuery, hostel: value }));
                    }}
                  >
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(16)].map((_, i) => (
                        <SelectItem key={i + 1} value={`${i + 1}`}>{`Hostel ${i + 1}`}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className={styles.buttonArea+' mt-4'}>
                      <Button onClick={handleReset} text="Reset" style={{marginRight:'20px', width:'250px'}}/>
                      <Button onClick={handleSearch} variant="contained" text="Search" style={{marginRight:'35px', width:'250px'}}/>
              </div>
          </div>
        </div>
        <div className={' w-full flex justify-center items-center flex-col md:p-4 '}>
        {tableLoading?<TableLoader />:null}
        {tableLoading===false?<div className='w-full'><ViewInfoTable data={data} /></div>:null}
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
        </div>
        </div>
    </>
}

export default ViewInfo;