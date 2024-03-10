import styles from './Textinput.module.scss';
import { useEffect, useState } from 'react';


export default function({label,onClick,style,type,onChange,ref}){

    const [focus, setFocus] = useState(false);
    const [Label, setLabel] = useState(true);
    
    useEffect(()=>{
        const inp = document.getElementById('input-box');
        
        function checkinput(){
            if(inp.value!=="" && !document.activeElement.id==="input-box"){
                setLabel(false);
            }else{
                setLabel(true);
            }
        }

        inp.addEventListener("input",checkinput)

        return ()=>{
            inp.removeEventListener("input",checkinput);
        }

    },[])

    return <>
        <div className={styles.inputWrapper}>
        {Label?<label className={styles.label} >{label}</label>:null}
        <input ref={ref} onChange={onChange} style={style} id='input-box' type={type} onClick={onClick} onFocus={()=>{setFocus(true)}} onBlur={()=>{setFocus(false)}} className={styles.input+' text-black'} />
        </div>
    </>
}