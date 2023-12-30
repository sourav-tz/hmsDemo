import styles from './AdminDashboard.module.scss';
import Sidebar from "../../Components/Sidebar/Sidebar";
import Roomsbargraph from '../../Components/Roomsbargraph/Roomsbargraph';
import ComplaintBox from '../../Components/ComplaintBox/ComplaintBox';
import Rolestable from '../../Components/RolesTable/RolesTable';
import {lazy, Suspense} from 'react';
import { useSelector } from 'react-redux';
import Loadingpage from '../../Components/Loadingpage/Loadingpage';


// Lazy Imports
const StudentUploadInfo = lazy(()=>import('./StudentsInfo/UploadInfo'));

const AdminDashboard = ()=>{

    const activeOptions = useSelector(state => state.sideBarStates.activeSubOption);

return <>
    <div className={styles.container}>
    <div className={styles.sideBarSpace}>
        <Sidebar />
        </div>

        {/* Home */}
        {activeOptions==='Home'?
        <div className={styles.contentSpace}>
        <div className={styles.Header}><h1>Welcome To Vivekanand</h1></div>
        <div className={styles.roomsBarGraph}>
            <Roomsbargraph />
        </div>
        <div className={styles.complaintBox}>
            <ComplaintBox />
        </div>
        <div className={styles.rolesTable} >
            <Rolestable />
        </div>
        </div>
        :null}


        {/* Student Info Module*/}
        {activeOptions==='siUploadInfo'?
        <div className={styles.contentSpace}>
            <Suspense fallback={<Loadingpage />}>
                <StudentUploadInfo />
            </Suspense>
        </div>
        :null}





    </div>
</>
}

export default AdminDashboard;