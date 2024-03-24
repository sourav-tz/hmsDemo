import styles from './ViewInfo.module.scss';
import ComplexSearch from '../../../../components/ComplesSearch/ComplesSearch';
import Button from '../../../../components/Button/Button';
import TableLoader from '../../../../components/TableLoader/TableLoader';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ViewInfoTable from '../../../../components/Tables/ViewInfoTable/ViewInfoTable';
import config from '../../../../config/config';
import { useDispatch, useSelector } from 'react-redux';
import ReactPaginate from 'react-paginate';
import { setSearchQuery } from '../../../../Store/Reducers/viewInfoSlice';
import { useNavigate } from 'react-router-dom';
import './Pagination.css';

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
    const [link,setLink] = useState('');
    const [totalPages , setTotalPages] = useState(null);
    const [tableLoading,setTableLoading] = useState(true);
    const Dispatcher = useDispatch();
    const [mycourses,setMyCourses] = useState([]);
    const [noOfYears,setNoOfYears] = useState(8);
    const [years,setMyYears] = useState([1,2,3,4,5,6,7,8]);
    const Navigator = useNavigate();


    useEffect(()=>{
        axios.get(import.meta.env.VITE_BASE_URL + '/HA/studentsInfo?page=1&limit=10&total=0',config)
        .then(res=>{setTotalPages(res.data[0].previous.totalpages);  res.data.length>2?setData(res.data.slice(2)):setData([]);setTableLoading(false)})
        .catch(err=>{console.log(err);setTableLoading(false)});

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
      
      const academicQualifications = ['MCA', 'M.tech', 'B.tech', 'M.sc', 'Ph.D', 'MBA','None'];
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
          ...((searchQuery.firstName !== '') && { firstName: searchQuery.firstName }),
          ...((searchQuery.lastName !== '') && { lastName: searchQuery.lastName}),
          ...((searchQuery.rollNo !== '') && { rollNo: searchQuery.rollNo}),
          ...((searchQuery.state !== '') && { state: searchQuery.state}),
          ...((searchQuery.cousreId !== '') && { courseId: searchQuery.courseId}),
          ...((searchQuery.year !== '') && { year: searchQuery.year}),
        },
      })
      .then((res) => {
        const newData = res.data.length > 2 ? res.data.slice(2) : [];
        setData(newData);
        setTotalPages(res.data[0].previous.totalpages);
        console.log(res.data);
        setTableLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setTableLoading(false);
        if(err.response.status===401){
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
    axios.get(import.meta.env.VITE_BASE_URL + '/HA/studentsInfo?page=1&limit=10&total=0',config)
    .then(res=>{setTotalPages(res.data[0].previous.totalpages);  res.data.length>2?setData(res.data.slice(2)):setData([]);setTableLoading(false)})
    .catch(err=>{
      console.log(err);
      setTableLoading(false)
      if(err.response.status===401){
        Navigator('/adminLogin');
      }
    });
    Dispatcher(setSearchQuery({firstName:null,lastName:null,rollNo:null,year:null,courseId:null,department:null,state:null}));

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
        total:0,
          ...((searchQuery.firstName !== '') && { firstName: searchQuery.firstName }),
          ...((searchQuery.lastName !== '') && { lastName: searchQuery.lastName}),
          ...((searchQuery.rollNo !== '') && { rollNo: searchQuery.rollNo}),
          ...((searchQuery.state !== '') && { state: searchQuery.state}),
          ...((searchQuery.courseId !== '') && { courseId: searchQuery.courseId}),
          ...((searchQuery.year !== '') && { year: searchQuery.year}),
      },
      headers: {
        "Content-Type": "application/json"
        },
        withCredentials: true
    })
      .then((res) => {
        const newData = res.data.length > 2 ? res.data.slice(2) : [];
        setData(newData);
        setTotalPages(res.data[0].previous.totalpages);
        setTableLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setTableLoading(false);
        if(err.response.status===401){
          Navigator('/adminLogin');
        }
      }); // Return the newLink to update the state


      }

    return <>

        <div className="w-[80%] flex-col justify-center">
        <h1 className='text-3xl mb-4'>Search Students Records</h1>
        <div className="w-[400px] md:w-[700px] rounded-md p-12 flex gap-2 flex-wrap border-[1px] border-gray-200 shadow-sm">
            <ComplexSearch />
            <div>
            <p>State:</p>
            {/* <MultiSelect FOR="state" list={indianStates} onClick={handleMutivalueClick}/> */}
            <Select>
  <SelectTrigger className="w-[180px]">
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
            <Select onValueChange={handleCourse}>
            <SelectTrigger className="w-[180px]">
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
            <Select>
  
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Select" />
  </SelectTrigger>
  <SelectContent>
    {years.map(d=><SelectItem value={d}>{d}</SelectItem>)}
  </SelectContent>
</Select>
            </div>
            <div className={styles.buttonArea+' mt-4'}>
                <div>
                    <Button onClick={handleReset} text="Reset" style={{marginRight:'15px'}}/>
                    <Button onClick={handleSearch} variant="contained" text="Search" />
                </div>
            </div>
        </div>
        </div>
        <div className={styles.tableArea}>
        {tableLoading?<TableLoader />:null}
        {tableLoading===false?<ViewInfoTable data={data} />:null}
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
    </>
}

export default ViewInfo;