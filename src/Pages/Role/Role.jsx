import styles from './Role.module.scss';
import Button from '../../components/Button/Button';
import adminImage from './assets/admin.png';
import studentImage from './assets/student.png';
import guestImage from './assets/guest-thumb.svg';
import Footer from '../../components/Footer/Footer';
import officeImage from '../../Assets/officeImage.svg';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Loadingpage from '../../components/Loadingpage/Loadingpage';

export default function () {
    const Navigator = useNavigate();
    const [loadingPage, setLoadingPage] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            if (localStorage.getItem('role') !== undefined && localStorage.getItem('role') === 'Admin') {
                Navigator('/Adminlogin');
            } else if (localStorage.getItem('role') !== undefined && localStorage.getItem('role') === 'Student') {
                Navigator('/studentLogin');
            } else if (localStorage.getItem('role') !== undefined && localStorage.getItem('role') === 'SuperAdmin') {
                Navigator('/superAdminLogin');
            } else {
                setLoadingPage(false);
            }
        }, 1000)
    }, [])

    return (
        <>
            {loadingPage ? <Loadingpage /> :
                <main>
                    <div className={styles.container}>

                        {/* Top Right Home Button */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem' }}>
                            <Button onClick={() => Navigator('/')} variant="outlined" text="Home" />
                        </div>

                        <div className={styles.header}>
                            <h3 className='text-xl'>Welcome To</h3>
                            <h2 className={styles.logo + ' text-3xl'}>
                                NIT <span className={styles.wrapText}>Hostel Management System</span>
                            </h2>
                        </div>

                        <div className={styles.rollSection}>
                            <div className={styles.whoAreYou}>
                                <h3 className='text-xl'>Who are you?</h3>
                            </div>

                            <div className={styles.cardSection}>

                                {/* Guest */}
                                <div className={styles.card}>
                                    <div className={styles.cardImage}>
                                        <img className='mt-5' src={guestImage} alt='Guest-Image' />
                                    </div>
                                    <Button
                                        onClick={() => {
                                            Navigator('/guest/home');
                                            localStorage.setItem('role', 'Guest');
                                        }}
                                        style={{ width: '100%' }}
                                        variant='contained'
                                        text='Guest'
                                    />
                                </div>

                                {/* Student */}
                                <div className={styles.card}>
                                    <div className={styles.cardImage}>
                                        <img src={studentImage} alt='Student-Image' />
                                    </div>
                                    <Button
                                        onClick={() => {
                                            Navigator('/studentLogin');
                                            localStorage.setItem('role', 'Student');
                                        }}
                                        style={{ width: '100%' }}
                                        variant='contained'
                                        text='Student'
                                    />
                                </div>

                                {/* Admin */}
                                <div className={styles.card}>
                                    <div className={styles.cardImage}>
                                        <img src={adminImage} alt='Admin-Image' />
                                    </div>
                                    <Button
                                        onClick={() => {
                                            Navigator('/adminLogin');
                                            localStorage.setItem('role', 'Admin');
                                        }}
                                        style={{ width: '100%' }}
                                        variant='contained'
                                        text='Admin'
                                    />
                                </div>

                                {/* Super Admin */}
                                <div className={styles.card}>
                                    <div className={styles.cardImage}>
                                        <img src={officeImage} alt='Admin-Image' />
                                    </div>
                                    <Button
                                        onClick={() => {
                                            Navigator('/superAdminLogin');
                                            localStorage.setItem('role', 'SuperAdmin');
                                        }}
                                        style={{ width: '100%' }}
                                        variant='contained'
                                        text='Super Admin'
                                    />
                                </div>

                            </div>
                        </div>
                    </div>
                </main>
            }
            <Footer />
        </>
    );
}
