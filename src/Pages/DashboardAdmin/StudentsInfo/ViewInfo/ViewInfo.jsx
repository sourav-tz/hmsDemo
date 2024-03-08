import styles from './ViewInfo.module.scss';
import ComplexSearch from '../../../../Components/ComplesSearch/ComplesSearch';
import Button from '../../../../Components/Button/Button';
import TableLoader from '../../../../Components/TableLoader/TableLoader';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ViewInfoTable from '../../../../Components/Tables/ViewInfoTable/ViewInfoTable';
import config from '../../../../config/config';
import { useSelector } from 'react-redux';
import ReactPaginate from 'react-paginate';
import { setSearchQuery } from '../../../../Store/Reducers/viewInfoSlice';
import { useDispatch } from 'react-redux';
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
    useEffect(()=>{
        axios.get('http://localhost:3000/HA/studentsInfo?page=1&limit=10&total=0',config)
        .then(res=>{setTotalPages(res.data[0].previous.totalpages);  res.data.length>2?setData(res.data.slice(2)):setData([]);setTableLoading(false)})
        .catch(err=>{console.log(err);setTableLoading(false)});


    },[])


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
        url:'http://localhost:3000/HA/studentsInfo',
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
      });

      setTimeout(() => {
        controller.abort()
    }, 100)

      };
      

      const handleMutivalueClick = (e,FOR)=>{
        console.log(e.target.innerText,FOR);
        if(FOR==='state'){
          Dispatcher(setSearchQuery({...searchQuery,state:e.target.innerText}));
        }
      }


  const handleReset = ()=>{
    axios.get('http://localhost:3000/HA/studentsInfo?page=1&limit=10&total=0',config)
    .then(res=>{setTotalPages(res.data[0].previous.totalpages);  res.data.length>2?setData(res.data.slice(2)):setData([]);setTableLoading(false)})
    .catch(err=>{console.log(err);setTableLoading(false)});
    Dispatcher(setSearchQuery({firstName:null,lastName:null,rollNo:null,year:null,courseId:null,department:null,state:null}));

  }


  const handlePageClick = (e)=>{
        const selectedPage = e.selected + 1; // ReactPaginate uses zero-based indexing, so add 1 to get the actual page number

  setTableLoading(true);


    axios({
      url:'http://localhost:3000/HA/studentsInfo',
      params:{
        page:selectedPage,
        limit:10,
        total:0,
        params: {
          page: selectedPage,
          limit: 10,
          total: 0,
          ...((searchQuery.firstName !== '') && { firstName: searchQuery.firstName }),
          ...((searchQuery.lastName !== '') && { lastName: searchQuery.lastName}),
          ...((searchQuery.rollNo !== '') && { rollNo: searchQuery.rollNo}),
          ...((searchQuery.state !== '') && { state: searchQuery.state}),

        },
      },
      headers: {
        "Content-Type": "application/json"
        },
        withCredentials: true
    })
      .then((res) => {
        const newData = res.data.length > 2 ? res.data.slice(2) : [];
        setData(newData);
        setTableLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setTableLoading(false);
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
    <SelectItem value="light">Light</SelectItem>
    <SelectItem value="dark">Dark</SelectItem>
    <SelectItem value="system">System</SelectItem>
  </SelectContent>
</Select>
            </div>
            <div>
            <p>Course:</p>
            {/* <MultiSelect FOR="course" list={academicQualifications} onClick={handleMutivalueClick}/> */}
            <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">MCA</SelectItem>
              <SelectItem value="dark">MBA</SelectItem>
              <SelectItem value="system">MTECH</SelectItem>
              <SelectItem value="system">BTECH</SelectItem>
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
    <SelectItem value="light">Light</SelectItem>
    <SelectItem value="dark">Dark</SelectItem>
    <SelectItem value="system">System</SelectItem>
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