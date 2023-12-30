import styles from './Role.module.scss';
import Button from '../../Components/Button/Button';
import adminImage from './assets/admin.png';
import studentImage from './assets/student.png';
import Footer from '../../Components/Footer/Footer';
import { useNavigate } from 'react-router-dom';


export default function(){

    const Navigator = useNavigate();


    return <>
        <main>
        <div className={styles.container} >
            <div className={styles.header}>
            <h3>Welcome To</h3>
            <h2 className={styles.logo}>NIT <span className={styles.wrapText}>Hostel Management System</span> </h2>
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
                    <Button onClick={
                        ()=>{
                                Navigator('/studentLogin');
                                localStorage.setItem('role','Student');
                            }
                        } 
                    variant='contained' text='Student' />
                </div>
                <div className={styles.card}>
                <div className={styles.cardImage}>
                    <img src={adminImage} alt='Admin-Image' />
                    </div>
                    <Button onClick={()=>{Navigator('/adminLogin');localStorage.setItem('role','Admin');}} variant='contained' text='Admin' />
                </div>
                </div>
            </div>
       </div>
       </main>
            <Footer />
    </>
}