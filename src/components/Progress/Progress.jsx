import styles from './Progress.module.scss';

import { useEffect,useState } from 'react';

const CircularProgress = ()=>{

const [selfIncrement, setSelfIncrement] = useState(0);

useEffect(()=>{
    setTimeout(()=>{
        if(selfIncrement<=1){
        setSelfIncrement(prev=>prev+0.1)
        }else{
            setSelfIncrement(0);
        }
    },200)
},[selfIncrement])

    return<>
    <progress className={styles.progressElement} value={selfIncrement} />
    </>
}


export default CircularProgress;