import styles from './MultiSelect.module.scss';
import {useState,useEffect} from 'react';
import { animated,useSpring } from '@react-spring/web'
import { FaChevronDown } from "react-icons/fa6";
import { IconContext } from "react-icons";



const MultiSelect = ({list,onClick,FOR})=>{
    const [rotate,setRotate] = useState(false);
    const [selectedItem,setSelectedItem] = useState("Select Option");

    const handleWindowClick = () => {
        setRotate(false);
      };
    
      useEffect(() => {
        window.addEventListener('click', handleWindowClick);
    
        return () => {
          window.removeEventListener('click', handleWindowClick);
        };
      }, []);
    

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
        <div onClick={(e) => {
            e.stopPropagation(); // Prevent the window click event from being triggered
            setRotate((prev) => !prev);
          }} className={styles.container}>
            <div className={styles.selected}>{selectedItem}<animated.div style={iconProp}><FaChevronDown /></animated.div></div>
            <animated.div className={styles.inputList} style={listProp} >
                {list.map(d=><p className={styles.listItem} onClick={(e)=>
                {   if(e.target.innerText==='None'){
                        setSelectedItem("Select Option");
                    }else{
                        setSelectedItem(e.target.innerText);
                    }
                    
                    onClick(e,FOR);}}>{d}</p>)}

            </animated.div>
        </div>
        </IconContext.Provider>
    </>
}


export default MultiSelect;