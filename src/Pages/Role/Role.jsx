import styles from './Role.module.scss';
import Button from '../../Components/Button/Button';
import adminImage from './assets/admin.png';
import studentImage from './assets/student.png';
import Footer from '../../Components/Footer/Footer';
import { useNavigate } from 'react-router-dom';


export default function(){

    const Navigator = useNavigate();


    return <>
        <div className={styles.container} >
            <div className={styles.header}>
            <h1>Welcome To</h1>
            <p className={styles.logo}>NIT Hostel Management System</p>
            </div>
            <div className={styles.rollSection}>
            <div className={styles.whoAreYou}>
                <h3>Who are you?</h3>
            </div>
            <div className={styles.cardSection}>
                <div className={styles.card}>
                <div className={styles.cardImage}>
                    <img src={studentImage} alt='Student-Image' />
                    </div>
                    <Button onClick={()=>{Navigator('/studentLogin')}} variant='contained' text='Student' />
                </div>
                <div className={styles.card}>
                <div className={styles.cardImage}>
                    <img src={adminImage} alt='Admin-Image' />
                    </div>
                    <Button onClick={()=>{Navigator('/adminLogin')}} variant='contained' text='Admin' />
                </div>
                </div>
            </div>
            <Footer />
       </div>
    </>
}