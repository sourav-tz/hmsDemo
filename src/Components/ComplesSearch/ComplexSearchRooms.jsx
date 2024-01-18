import styles from './ComplexSearch.module.scss';
import { FaChevronDown } from "react-icons/fa6";
import { IconContext } from "react-icons";
import { animated,useSpring } from '@react-spring/web'
import { useState } from 'react';

const ComplexSearchRooms = ()=>{
const [rotate,setRotate] = useState(false);
const [queryItem, setQueryItem] = useState('Room No')
    const iconProp = useSpring({
        from:{transform:"rotate(0deg)"},
        to:{transform:rotate?"rotate(180deg)":"rotate(0deg)"},
      })

      const listProp = useSpring({
        from:{transform:"scaleY(0%)"},
        to:{transform:rotate?"scaleY(100%)":"scaleY(0%)"},
      })

    return <>
    <IconContext.Provider value={{ color: "blue",size:"13"}}>
            <div className={styles.inputContainer}>
            <div onClick={()=>{setRotate(prev=>!prev);console.log(rotate)}} className={styles.selector}><p>{queryItem}</p><animated.div style={iconProp}><FaChevronDown /></animated.div></div>
                <input className={styles.textInput} type="text" onFocus={()=>{setRotate(false)}}/>
            <animated.div className={styles.inputList} style={listProp} >
                <p className={styles.listItem} onClick={()=>{setQueryItem('Room Number');setRotate(false)}}>Room No</p>
                <p className={styles.listItem} onClick={()=>{setQueryItem('Roll No');setRotate(false)}}>Roll No</p>
                <p className={styles.listItem} onClick={()=>{setQueryItem('First Name');setRotate(false)}}>First Name</p>
                <p className={styles.listItem} onClick={()=>{setQueryItem('Last Name');setRotate(false)}}>Last Name</p>
            </animated.div>
            </div>
    </IconContext.Provider>
    </>
}


export default ComplexSearchRooms;