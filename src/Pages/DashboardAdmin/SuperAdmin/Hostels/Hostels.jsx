import React from 'react'
import HostelTable from '../../../../Components/Tables/HostelTable/HostelTable';
import TableLoader from '../../../../Components/TableLoader/TableLoader';
import { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../../../config/config';
import styles from './Hostels.module.scss';
import Button from '../../../../Components/Button/Button';

const Hostels = () => {
  const [data,setData] = useState([]);
  const [tableLoading,setTableLoading] = useState(true);


  useEffect(()=>{
    axios.get('http://localhost:3000/SA/getHostels',config)
    .then(res=>{setData(res.data);setTableLoading(false)})
    .catch(err=>{console.log(err);setTableLoading(false)});


},[])

  return (
    <>
    <h1 className='text-3xl mb-4'>Manage Hostels</h1>
    {/* <Button onClick={handleSearch} variant="contained" text="Search" /> */}
    <div className={styles.tableArea}>
        {tableLoading?<TableLoader />:null}
        {tableLoading===false?<HostelTable data={data} />:null}
        </div>
    </>
  )
}

export default Hostels