import styles from './MultiSelect.module.scss';
import {useState} from 'react';
import { animated,useSpring } from '@react-spring/web'
import { FaChevronDown } from "react-icons/fa6";
import { IconContext } from "react-icons";



const MultiSelect = ({list})=>{
    const [rotate,setRotate] = useState(false);
    const [selectedItem,setSelectedItem] = useState("Select Option");
    const iconProp = useSpring({
        from:{transform:"rotate(0deg)"},
        to:{transform:rotate?"rotate(180deg)":"rotate(0deg)"},
      })

      const listProp = useSpring({
        from:{transform:"scaleY(0%)"},
        to:{transform:rotate?"scaleY(100%)":"scaleY(0%)"},
      })


    return<>
        <IconContext.Provider value={{ color: "blue",size:"13"}}>
        <div onClick={()=>{setRotate(prev=>!prev)}} className={styles.container}>
            <div className={styles.selected}>{selectedItem}<animated.div style={iconProp}><FaChevronDown /></animated.div></div>
            <animated.div className={styles.inputList} style={listProp} >
                <p className={styles.listItem} onClick={()=>{setQueryItem('item1');setRotate(false)}}>Item1</p>

            </animated.div>
        </div>
        </IconContext.Provider>
    </>
}


export default MultiSelect;