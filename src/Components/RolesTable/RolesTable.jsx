import styles from './RolesTable.module.scss';
import { AgGridReact } from 'ag-grid-react'; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import { useState } from 'react';


const RolesTable = ()=>{

  // Row Data: The data to be displayed.
  const [rowData, setRowData] = useState([
  {User:'Kapil Gupta',Access:'Warden'},
  {User:'Parveen',Access:'Admin'},
  {User:'Xyz',Access:'Admin'},
  {User:'Abc',Access:'Warden'},
  ]);
  
  // Column Definitions: Defines & controls grid columns.
  const [colDefs, setColDefs] = useState([
    {field:'User',width:150},
    {field:'Access',width:180}
  ]);


    return (
    <div className="ag-theme-quartz" style={{ height: 300,width:350}}>
        <AgGridReact rowData={rowData} columnDefs={colDefs} />
    </div>
    )

}


export default RolesTable;