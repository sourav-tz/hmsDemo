import styles from './Button.module.scss';
import {useState,useEffect} from 'react';


export default function({type,variant,onClick,text,style}){

    const [svariant, setVariant] = useState('outlined');

    useEffect(()=>{
        setVariant(variant);
    },[])

        return<>
            <button 
                type={type}
                onClick={onClick} 
                style={style}
                className={(svariant==='contained'?styles.contained:styles.outlined)+' '+styles.outlined}>
                {text}
            </button>
        </>
}