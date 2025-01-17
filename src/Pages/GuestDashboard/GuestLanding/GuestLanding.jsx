import React from 'react';
import { Link } from 'react-router-dom';
import styles from './GuestLanding.module.scss';
import GuestReigster from '../GuestRegister/GuestReigster'
import GuestStatus from '../GuestStatus/GuestStatus'
import hostel from '../../../Assets/hostel11.jpg';
// import logo from '../../../Assets/nit-logo.png';
import backgroundImage from '../../../Assets/hostel11.jpg'; // Ensure the path to your image is correct.

const GuestLanding = () => {
  return (
    <>
    <div className=" min-h-screen w-screen absolute left-0">
          {/* Background image container */}
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              filter: 'blur(3px)', // Optional: Adds a blur effect
              opacity: 0.5, // Slightly reduce opacity for effect
              zIndex: -1, // Place the background behind the content
            }}
          ></div>
      <div className={styles.container}>
        {/* Header Section */}
        <div className={styles.header}>
          <div>
              {/* <img src={logo} alt="NIT Kurukshetra Logo" className={styles.logo} /> */}
              <h1 className={styles.title1}>WELCOME TO</h1>
              <h1 className={styles.title2}>NIT KURUKSHETRA</h1>
              <div className={styles.contact}>
          </div>          
        </div>
        

          <div className={styles.buttons} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', backgroundColor:'#5757FF' }}>
            <Link className={styles.button} to="/">
                Home
            </Link>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <span className='text-l font-bold cursor-pointer text-white pt-2 pr-2 block'>
                Contact-email:{' '}
              <a href="guest@nitkkr.ac.in">guest@nitkkr.ac.in</a>
              </span>
              <span className='text-l font-bold ml-4 text-white pt-2 pr-4 block'>Phone: +01233445555</span>
            </div>
          </div>

        </div>

        {/* Image Section */}
        {/* <div className={styles.imageContainer}>
          <img src={hostel} alt="NIT Kurukshetra Building" />
        </div> */}

        {/* Buttons Section */}
        <div className='w-full bg-[#e7e6e6]'>
          <div className={styles.buttons}>
            <h2 className='text-xl font-bold'> Book Room</h2>
              <Link className={styles.button} to="/guest/register">
                Register
              </Link>
            <h2 className='text-xl font-bold'> Already booked?</h2>
            <Link className={styles.button} to="/guest/status">
              Check Status
            </Link>
           
          </div>
        </div>
        

        {/* Content Section */}
        <div className={styles.content}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Rules & Regulations</h2>
    
            <ol className="list-decimal ml-4 text-l text-blue-900">
              <li>Only the students on roll of the Institute are eligible to reside in the hostels.</li>
              <li>All students must possess their Identity Cards (Institute and Hostel) at all the times. All
                    residents are required to produce, whenever asked, their valid identity cards issued to them
                    by the authority</li>
              <li>Non-vegetarian food is not allowed in the hostel as per the district administration
              rules/guidelines</li>
              <li>All residents are required to maintain standards of behavior expected of students of an
                Institute of National Importance. They are expected to behave courteously and fairly with
                  everyone inside and outside the Hostels/Institute. </li>
              <li>The use of electrical appliances such as immersion heaters, electric stove / heaters / electric
              iron etc. are prohibited in any of the rooms allotted to the residents. Private cooking in the
              hostels/students room is strictly prohibited. Such appliances, if found will be confiscated and
              a fine will also be imposed as decided by the warden. </li>
            </ol>
          </div>
          <div className={styles.card}>

            <h2 className={styles.cardTitle}>
            Documents and Eligibility
            </h2>
            <ul className="list-disc ml-4 text-l text-blue-900">
              <li>Adhar Card</li>
              <li>Voter ID</li>
              <li>Driving License</li>
              <li>Ration Card</li>
              <li>Passport with visa (for international visitors)</li>
              <li>
              A guest must be at least 18 years old. Guests under 18 are to be accompanied by an adult or a legal guardian.
              </li>
              <li>
                Upload document for primary guest only (for multiple guest)
              </li>
              <li>Accepted formats jpg,png,pdf only</li>
              <li>File size should be less than 1mb</li>
              <li>Referrer email should be a valid Institute email</li>
            </ul>
          </div>
          </div>
        </div>
      </div>
    </>

<<<<<<< HEAD
  );
};

=======
>>>>>>> 07c25747cd639ac7289eb18de540cf27e72319d2
export default GuestLanding;