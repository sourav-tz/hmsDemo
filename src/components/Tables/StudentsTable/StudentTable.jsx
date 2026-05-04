import './StudentTable.module.scss';
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useCallback, useMemo } from 'react';
import './studentsTable.css';
import { setUpdateData } from '../../../Store/Reducers/uploadStudentSlice';
import { useDispatch } from 'react-redux';

const StudentTable = ({data})=>{

 const Dispatcher = useDispatch();

  const safeText = (value) => value ?? '';
  const rowData = useMemo(() => {
    if (!Array.isArray(data)) {
      return [];
    }

    return data
      .filter((row) => row && typeof row === 'object')
      .map((row) => ({
        ...row,
        message: safeText(row.message),
        rollNo: safeText(row.rollNo),
        firstName: safeText(row.firstName),
        lastName: safeText(row.lastName),
        year: safeText(row.year),
        courseId: safeText(row.courseId),
        email: safeText(row.email),
        pEmail: safeText(row.pEmail),
        gender: safeText(row.gender),
        hostelNo: safeText(row.hostelNo),
        dob: safeText(row.dob),
        contactNumber: safeText(row.contactNumber),
        secondaryContact: safeText(row.secondaryContact),
        phoneNumber: safeText(row.phoneNumber),
        fatherName: safeText(row.fatherName),
        fatherOccupation: safeText(row.fatherOccupation),
        fatherContact: safeText(row.fatherContact),
        motherName: safeText(row.motherName),
        motherOccupation: safeText(row.motherOccupation),
        motherContact: safeText(row.motherContact),
        bloodGroup: safeText(row.bloodGroup),
        identificationMark: safeText(row.identificationMark),
        subAddress: safeText(row.subAddress),
        pinCode: safeText(row.pinCode),
        state: safeText(row.state),
        addharNumber: safeText(row.addharNumber),
        accHolderName: safeText(row.accHolderName),
        accNumber: safeText(row.accNumber),
        bankName: safeText(row.bankName),
        IFSC: safeText(row.IFSC),
      }));
  }, [data]);

  const defaultColDef = useMemo(() => ({
    valueFormatter: ({ value }) => value ?? '-',
  }), []);
 
  
  // Column Definitions: Defines & controls grid columns.
  const colDefs = useMemo(() => [
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
        {field:'secondaryContact',width:150},
        {field:'fatherName',width:140},
        {field:'fatherOccupation',width:150},
        {field:'fatherContact',width:140},
        {field:'motherName',width:150},
        {field:'motherOccupation',width:150},
        {field:'motherContact',width:150},
        {field:'bloodGroup',width:80},
        {field:'identificationMark',width:130},
        {field:'subAddress'},
        {field:'pinCode'},
        {field:'state',width:120},
        {field:'addharNumber'},
        {field:'accHolderName',},
        {field:'accNumber'},
        {field:'bankName'},
        {field:'IFSC',width:130},  
       
  ], []);


  
  const onSelectionChanged = useCallback((event) => {
    var rowCount = event.api.getSelectedNodes();
  
    (async () => {
      try {
        const pushdata=[];
        rowCount.forEach(element => {
          if (!element.data) {
            return;
          }

          const { message, ...studentData } = element.data;
          pushdata.push(studentData);
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
        defaultColDef={defaultColDef}
        rowSelection='multiple' 
        rowMultiSelectWithClick={true} 
        showDisabledCheckboxes={true} 
        onSelectionChanged={onSelectionChanged}
        />
        </div>
    </>


};



export default StudentTable;
