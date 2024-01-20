import styles from './Accordion.module.scss';
import { FiPlus } from "react-icons/fi";
import { FiMinus } from "react-icons/fi";
import { IconContext } from "react-icons";
import { useEffect, useState } from 'react';
import { FcInfo } from "react-icons/fc";
import Button from '../Button/Button';
import { Link } from 'react-router-dom';

const Accordion = ({accordData})=>{


    // const accordData = [
    //     {
    //         title:'Some Title',
    //         Description:'Some Description'
    //     },
    //     {
    //         title:'Second Title',
    //         Description:'Second Description'
    //     },
    //     {
    //         title:'Second Title',
    //         Description:'Second Description'
    //     },
    //     {
    //         title:'Second Title',
    //         Description:'Second Description'
    //     }
    // ]

    

    const [states, setState] = useState(-1);
    const [sameState,setSameState] = useState(false);

    return <>
    <IconContext.Provider value={{ color: "#5F57FF",size:"20"}}>
    <div className={styles.container}>
            {accordData.map((d,id)=><><div id={id} onClick={()=>{setState(id);setSameState(prev=>!prev)}} className={styles.accordTitle}>{d.title} {sameState&&states===id?<div><FiMinus /></div>:<FiPlus />}</div>
            <div id={id} className={styles.accordBody +' '+(sameState&&states===id?styles.openAccord:null)}>{d.Description.map((dd)=>{return (<div className={styles.points}><FcInfo /><div className={styles.pointDetail}>{dd}</div></div>)})}{d.link!=undefined?<Link to={d.link} target="_blank" download><Button style={{width:'300px'}} variant="contained" text="Download" /></Link>:null}</div></>)}
    </div>
    </IconContext.Provider>
    </>
}

export default Accordion;