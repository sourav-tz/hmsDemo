import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useState,useCallback, useEffect } from 'react';
import './ViewInfoTable.css';
import { Button } from "@/components/ui/button"
import Modal from '../../Modals/Modal';
import { useDispatch } from 'react-redux';
import { changeModalState,setModalData } from '../../../Store/Reducers/viewInfoSlice';
import PdfDownload from './PdfDownload';




const ViewInfoTable = ({data})=>{
  console.log(data);
  // Row Data: The data to be displayed.

  const [rowData, setRowData] = useState([]);
  const Dispatcher = useDispatch();
  const [modalData,setModalData] = useState(null);
 


  useEffect(() => {
    if (data && data.length > 0) {
      setRowData(data);
    }
  }, [data]);









  
  // Column Definitions: Defines & controls grid columns.
  const [colDefs, setColDefs] = useState([
        {field:'rollNo',pinned:'left',width:100},
        {field:'firstName', pinned:'left',width:120},
        {field:'lastName',pinned:'left',width:120},
        {field:'year',width:80},
        {field:'courseId',width:120},
        {field:'email'},
        {field:'profile.contactNumber', headerName: 'Contact Number',width:150},
        {field:'viewInfo',width:110,cellRenderer:(params)=>{return <Button size="sm" onClick={()=>{Dispatcher(changeModalState(true));setModalData(params.data);console.log(params.data)}}>View</Button>}},
        {field:'generatePDF',width:145,cellRenderer:(params)=>{ return<><PdfDownload myData={params.data}/></>}  }
         
  ]);





    return<>
        <div className="ag-theme-quartz" style={{ height: 475, width:1000 }}>
        {/* The AG Grid component */}
        <AgGridReact  rowData={rowData} columnDefs={colDefs}  rowSelection='single' rowMultiSelectWithClick={true}/>
        <Modal data={modalData}/>
        </div>
    </>


};



export default ViewInfoTable;






    
    
  



