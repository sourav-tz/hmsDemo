import React from 'react'
import CoursesTable from '../../../../Components/Tables/CoursesTable/CoursesTable';
import TableLoader from '../../../../Components/TableLoader/TableLoader';
import { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../../../config/config';
import styles from './Courses.module.scss';
const Courses = () => {
  const [data,setData] = useState([]);
  const [tableLoading,setTableLoading] = useState(true);


  useEffect(()=>{
    axios.get('http://localhost:3000/SA/getCourses',config)
    .then(res=>{setData(res.data);setTableLoading(false)})
    .catch(err=>{console.log(err);setTableLoading(false)});


},[])

  return (
    <>
    <h1 className='text-3xl mb-4'>Manage Courses</h1>
    {/* <Button onClick={handleSearch} variant="contained" text="Search" /> */}
    <div className={styles.tableArea}>
        {tableLoading?<TableLoader />:null}
        {tableLoading===false?<CoursesTable data={data} />:null}
        </div>
    </>
  )
}

export default Courses