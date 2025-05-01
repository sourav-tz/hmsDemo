import styles from './ComplexSearch.module.scss';
import { FaChevronDown } from "react-icons/fa6";
import { IconContext } from "react-icons";
import { animated,useSpring } from '@react-spring/web'
import { useState,useEffect } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { setSearchQuery,resetQuery } from '../../Store/Reducers/viewInfoSlice';
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


const ComplexSearch = ()=>{
const previousQuery = useSelector(state => state.viewInfoStates.searchQuery);
const Dispatcher = useDispatch();
const [rotate,setRotate] = useState(false);
const [queryItem, setQueryItem] = useState('firstName');


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
  console.log("Search input changed:", e.target.value, "Search type:", queryItem);

  if(queryItem === 'firstName'){
    Dispatcher(setSearchQuery({
      ...previousQuery,
      firstName: e.target.value,
      lastName: '',
      rollNo: ''
    }));
  } else if(queryItem === 'lastName'){
    Dispatcher(setSearchQuery({
      ...previousQuery,
      firstName: '',
      lastName: e.target.value,
      rollNo: ''
    }));
  } else if(queryItem === 'rollNo'){
    Dispatcher(setSearchQuery({
      ...previousQuery,
      firstName: '',
      lastName: '',
      rollNo: e.target.value
    }));
  } else if(queryItem === 'fullname'){
    const myFirstName = e.target.value.split(' ')[0] || '';
    const myLastName = e.target.value.split(' ').slice(1).join(' ') || '';
    Dispatcher(setSearchQuery({
      ...previousQuery,
      firstName: myFirstName,
      lastName: myLastName,
      rollNo: ''
    }));
  }

  console.log("Updated search query:", previousQuery);
}


    return <>
    <IconContext.Provider value={{ color: "blue",size:"13"}}>
            <div className='flex'>
            <Select onValueChange={(e)=>{setQueryItem(e)}}>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="first name" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="firstName">first name</SelectItem>
    <SelectItem value="lastName">last Name</SelectItem>
    <SelectItem value="fullname">full name</SelectItem>
    <SelectItem value="rollNo">Roll No</SelectItem>
  </SelectContent>
</Select>
  <Input onChange={handleChange} className='md:w-[250px]'/>
            </div>
    </IconContext.Provider>
    </>
}


export default ComplexSearch;