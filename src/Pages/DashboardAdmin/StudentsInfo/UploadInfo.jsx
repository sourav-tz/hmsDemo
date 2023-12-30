import styles from './UploadInfo.module.scss';
import { IoIosCloudUpload } from "react-icons/io";
import Button from '../../../Components/Button/Button';
import { useEffect, useRef,useState } from 'react';

const UploadInfo = ()=>{

    const inputElement = useRef();
    const [files,setFiles] = useState(0);



    const handleFile = ()=>{
        setFiles(inputElement.current.files[0]);

    }

    const handleButtonClick = ()=>{
        inputElement.current.click();
    }

    return<>
        <div className={styles.container}>
            <div className={styles.Header}><h1>Upload Student Info</h1></div>
            <div className={styles.uploadContainer}>
                <div className={styles.uploadArea}>
                <input className={styles.myFile} type="file" ref={inputElement} onChange={handleFile}/>
                    <IoIosCloudUpload size="60"/>
                    <p>Drag and Drop Files <br/>Or</p>
                    <Button onClick={handleButtonClick} variant="contained" style={{marginTop:'10px'}} text="Browser Files" />
                </div>
            </div>
        </div>
    </>
};

export default UploadInfo;