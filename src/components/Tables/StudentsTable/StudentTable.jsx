import './StudentTable.module.scss';
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useState,useCallback, useEffect,useRef,useMemo } from 'react';
import './studentsTable.css';
import { setUpdateData } from '../../../Store/Reducers/uploadStudentSlice';
import { useDispatch } from 'react-redux';

const StudentTable = ({data})=>{

  // Row Data: The data to be displayed.
  const [rowData, setRowData] = useState([

 ]);


 const Dispatcher = useDispatch();

 useEffect(()=>{
  setRowData(data);
 },[])


 
  
  // Column Definitions: Defines & controls grid columns.
  const [colDefs, setColDefs] = useState([
        {field:'rollNo',pinned:'left',width:100,headerCheckboxSelection: true,
        checkboxSelection: true,},
        {field:'firstName', pinned:'left',width:120},
        {field:'lastName',pinned:'left',width:120},
        {field:'message',pinned:'left',width:190},
        {field:'year',width:80},
        {field:'courseId',width:120},
        {field:'email'},
        {field:'pEmail'},
        {field:'gender',width:80},
        {field:'hostelNo',width:120},
        {field:'dob',width:120},
        {field:'contactNumber',width:150},
        {field:'secondaryNumber',width:150},
        {field:'fatherName',width:140},
        {field:'fatherOccupation',width:150},
        {field:'fatherContactNumber',width:140},
        {field:'motherName',width:150},
        {field:'motherOccupation',width:150},
        {field:'motherContactNumber',width:150},
        {field:'bloodGroup',width:80},
        {field:'identficationMark',width:130},
        {field:'subAddress'},
        {field:'pinCode'},
        {field:'state',width:120},
        {field:'addharNumber'},
        {field:'accHolderName',},
        {field:'accNumber'},
        {field:'bankName'},
        {field:'IFSC',width:130},  
       
  ]);


  
  const onSelectionChanged = useCallback((event) => {
    var rowCount = event.api.getSelectedNodes();
  
    (async () => {
      try {
        const pushdata=[];
        rowCount.forEach(element => {
          delete element.data.message;
          pushdata.push(element.data);
        });
        console.log(pushdata);
       Dispatcher(setUpdateData(pushdata))
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);



    return<>
        <div className="ag-theme-quartz" style={{ height: 450 }}>
        {/* The AG Grid component */}
        <AgGridReact 
        rowData={rowData} 
        columnDefs={colDefs}  
        rowSelection='multiple' 
        rowMultiSelectWithClick={true} 
        showDisabledCheckboxes={true} 
        onSelectionChanged={onSelectionChanged}
        />
        </div>
    </>


};



export default StudentTable;