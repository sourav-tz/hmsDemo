import styles from './ViewInfo.module.scss';
import ComplexSearch from '../../../../Components/ComplesSearch/ComplesSearch';
import MultiSelect from '../../../../Components/MultiSelect/MultiSelect';
import Button from '../../../../Components/Button/Button';
import TableLoader from '../../../../Components/TableLoader/TableLoader';


const ViewInfo = ()=>{

    return <>
        <h1>Search Students Records</h1>
        <div className={styles.searchArea}>
        <div className={styles.container}>
            <ComplexSearch />
            <div>
            <p>State:</p>
            <MultiSelect />
            </div>
            <div>
            <p>Course:</p>
            <MultiSelect />
            </div>
            <div>
            <p>Year:</p>
            <MultiSelect />
            </div>
            <div>
            <p>Department:</p>
            <MultiSelect />
            </div>
            <div className={styles.buttonArea}>
                <div>
                    <Button text="Reset" style={{marginRight:'15px'}}/>
                    <Button variant="contained" text="Search" />
                </div>
            </div>
        </div>
        </div>
        <div className={styles.tableArea}>
        <h1>Students Table</h1>
        <TableLoader />
        </div>
    </>
}

export default ViewInfo;