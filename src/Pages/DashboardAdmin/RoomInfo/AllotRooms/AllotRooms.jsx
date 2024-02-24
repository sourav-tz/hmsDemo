import styles from './AllotRooms.module.scss';
import Roomsbargraph from '../../../../Components/Roomsbargraph/Roomsbargraph';
import ComplexSearchRooms from '../../../../Components/ComplesSearch/ComplexSearchRooms';
import MultiSelect from '../../../../Components/MultiSelect/MultiSelect';
import Button from '../../../../Components/Button/Button';
import TableLoader from '../../../../Components/TableLoader/TableLoader';
import RoomTable from '../../../../Components/Tables/RoomTable/RoomTable';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  import {Input} from "@/components/ui/Input"

const AllotRooms = ()=>{

    return<>
    <h1 className='text-3xl'>Rooms Allotement</h1>
    <div className={styles.container}>
    <div className={styles.roomsBarGraph}>
        <Roomsbargraph />
        </div>
        <div className={styles.queryArea+' mb-4'}>
        <div className='flex'>
        <Select>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Room No" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="light">Floor No</SelectItem>
                <SelectItem value="dark">Name</SelectItem>
                <SelectItem value="system">Roll No</SelectItem>
            </SelectContent>
            </Select>
            <Input/>
        </div>
            <div className={styles.MultiSelect}>
                <p>Status:</p>
                <Select>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Option" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="light">Filled</SelectItem>
                <SelectItem value="dark">Vacant</SelectItem>
                <SelectItem value="system">Partially Filled</SelectItem>
            </SelectContent>
            </Select>
            </div>
            <div className={styles.MultiSelect}>
                <p>Floor:</p>
                <Select>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Option" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="light">G</SelectItem>
                <SelectItem value="dark">1</SelectItem>
                <SelectItem value="system">2</SelectItem>
            </SelectContent>
            </Select>
            </div>
            <div className={styles.buttonArea}>
                <Button text="Reset" />
                <Button variant="contained" text="Search" />
            </div>

        </div>

        <div className={styles.tableArea}>
                {/* <TableLoader /> */}
                <RoomTable />
            </div>
    </div>
    </>
}


export default AllotRooms;