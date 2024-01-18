import styles from './ComplexSearch.module.scss';
import { FaChevronDown } from "react-icons/fa6";
import { IconContext } from "react-icons";
import { animated,useSpring } from '@react-spring/web'
import { useState,useEffect } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { setSearchQuery,resetQuery } from '../../Store/Reducers/viewInfoSlice';




const ComplexSearch = ()=>{
const previousQuery = useSelector(state => state.viewInfoStates.searchQuery);
const Dispatcher = useDispatch();
const [rotate,setRotate] = useState(false);
const [queryItem, setQueryItem] = useState('First Name');


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
        from:{transform:"rotate(0deg)",transformOrigin:"center"},
        to:{transform:rotate?"rotate(180deg)":"rotate(0deg)",transformOrigin:"center"},
      })

      const listProp = useSpring({
        from:{transform:"scaleY(0%)"},
        to:{transform:rotate?"scaleY(100%)":"scaleY(0%)"},
      });

const handleChange = (e)=>{
  if(queryItem === 'First Name'){
    Dispatcher(setSearchQuery({...previousQuery,firstName:e.target.value,lastName:'',rollNo:''}))
  }else if(queryItem === 'Last Name'){
    Dispatcher(setSearchQuery({...previousQuery,firstName:'',lastName:e.target.value,rollNo:''}))
  }else if(queryItem === 'Roll No'){
    Dispatcher(setSearchQuery({...previousQuery,firstName:'',lastName:'',rollNo:e.target.value}))
  }

  console.log(previousQuery);
}


    return <>
    <IconContext.Provider value={{ color: "blue",size:"13"}}>
            <div className={styles.inputContainer}>
            <div onClick={(e)=>{e.stopPropagation();setRotate(prev=>!prev);console.log(rotate)}} className={styles.selector}><p>{queryItem}</p><animated.div className="mt-1 origin-center tranfrom" style={iconProp}><FaChevronDown /></animated.div></div>
                <input onChange={handleChange} className="py-4 pl-40 rounded-md outline-2 border-black border-2 outline-indigo-900 min-w-[200px] md:min-w-[450px]" type="text" onFocus={()=>{setRotate(false)}}/>
            <animated.div className={styles.inputList} style={listProp} >
                <p className={styles.listItem} onClick={()=>{setQueryItem('First Name');setRotate(false);}}>First Name</p>
                <p className={styles.listItem} onClick={()=>{setQueryItem('Last Name');setRotate(false)}}>Last Name</p>
                <p className={styles.listItem} onClick={()=>{setQueryItem('Email');setRotate(false)}}>Email</p>
                <p className={styles.listItem} onClick={()=>{setQueryItem('Roll No');setRotate(false)}}>Roll No</p>
            </animated.div>
            </div>
    </IconContext.Provider>
    </>
}


export default ComplexSearch;