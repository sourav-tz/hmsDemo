import styles from './RoomStatusBar.module.scss';



const RoomStatusBar = ()=>{

    return<>
    <div className={styles.Container}>
        <div className={styles.Item}><p style={{backgroundColor:'#FBD0CC',color:'#851D13', padding:'15px', borderRadius:'5px'}}>Total Rooms <br/>204</p></div>
        <div className={styles.Item} style={{borderRight:'none'}}><p style={{backgroundColor:'#B5B5F7',color:'#0D085F', padding:'15px', borderRadius:'5px'}}>Fully Filled <br/>80</p></div>
        <div className={styles.Item} style={{borderBottom:'none'}}><p style={{backgroundColor:'#9FF6C6',color:'#0F4E2C', padding:'15px', borderRadius:'5px'}}>Partially Filled <br/>80</p></div>
        <div className={styles.Item} style={{border:'none'}}><p style={{backgroundColor:'#F2F2C8',color:'#8B8E1D', padding:'15px', borderRadius:'5px'}}>Vacant <br/>80</p></div>
    </div>
    </>
}


export default RoomStatusBar;