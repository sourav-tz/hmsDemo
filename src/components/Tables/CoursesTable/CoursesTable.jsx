import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useState,useEffect } from 'react';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import config from '../../../config/config';
import axios from 'axios';



const Togglebtn=(props)=>{
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(props.active);

  const handleToggle = async (courseId) => {
    try {
      setLoading(true);
      let response;
      if (props.active) {
        // If active, make a DELETE request to route 1
        response = await axios.delete(`http://localhost:3000/SA/removeCourse?courseId=${courseId}&softdelete=false`, {
          config,
        });
      } else {
        // If inactive, make a POST request to route 2
        response = await axios.post('http://localhost:3000/SA/enableCourse', {
          courseId:courseId,
        });
      }
  
      console.log(response.data);
  
      // Update the state based on the response
      if (response.data.success) {
        setActive(!active);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
    return (
        <div>
            <div className="mb-4">
                <input
                    className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-primary dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
                    type="checkbox"
                    role="switch"
                    id="flexSwitchCheckDefault01" 
                    checked={active}
                    disabled={loading}
                    onClick={()=>handleToggle(props.courseId)}
                    />
                    
            </div>
        </div>
    );
}
const CoursesTable = ({data})=>{
  // Row Data: The data to be displayed.
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    if (data && data.length > 0) {
      setRowData(data);
    }
  }, [data]);

  // Column Definitions: Defines & controls grid columns.
  const [colDefs, setColDefs] = useState([
        {field:'courseId',pinned:"left"},
        {field:'courseName'},
        {field:'department'},
        // {field:'Type',pinned:'left',width:120},
        {field:'specialization'},
        {field:'courseDuration'},
        {field:'active',cellRenderer:(params)=>{return <Togglebtn active={params.data.active} courseId={params.data.courseId}/>}},
        {field:'Edit',cellRenderer:()=>{return <FaEdit />}},
        {field:'Delete',cellRenderer:(params)=>{return  <RiDeleteBin6Line  onClick={()=>{
          axios.delete(`http://localhost:3000/SA/removeCourse?courseId=${params.data.courseId}&softdelete=true`,config)
          .then(res=>{console.log(res.data);})
          .catch(err=>{console.log(err);});          
        }}/>;}}
  ]);

    return<>
        <div className="ag-theme-quartz"  style={{ height: 475, width:1000, }}>
        {/* The AG Grid component */}
        <AgGridReact  rowData={rowData} columnDefs={colDefs}  rowSelection='single' rowMultiSelectWithClick={true}/>
        {/* <Modal data={modalData}/> */}
        </div>
    </>


};

export default CoursesTable;