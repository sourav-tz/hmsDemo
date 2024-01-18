import styles from './AllotRooms.module.scss';
import Roomsbargraph from '../../../../Components/Roomsbargraph/Roomsbargraph';
import ComplexSearchRooms from '../../../../Components/ComplesSearch/ComplexSearchRooms';
import MultiSelect from '../../../../Components/MultiSelect/MultiSelect';
import Button from '../../../../Components/Button/Button';
import TableLoader from '../../../../Components/TableLoader/TableLoader';


const AllotRooms = ()=>{

    return<>
    <h1 className='text-3xl'>Rooms Allotement</h1>
    <div className={styles.container}>
    <div className={styles.roomsBarGraph}>
        <Roomsbargraph />
        </div>
        <div className={styles.queryArea}>
        <div>
            <ComplexSearchRooms />
        </div>
            <div className={styles.MultiSelect}>
                <p>Status:</p>
                <MultiSelect list={[]} />
            </div>
            <div className={styles.MultiSelect}>
                <p>Floor:</p>
                <MultiSelect list={[]}/>
            </div>
            <div className={styles.buttonArea}>
                <Button text="Reset" />
                <Button variant="contained" text="Search" />
            </div>

        </div>

        <div className={styles.tableArea}>
                <TableLoader />
            </div>
    </div>
    </>
}


export default AllotRooms;