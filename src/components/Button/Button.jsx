import styles from './Button.module.scss';
import {useState,useEffect} from 'react';
import loadingImage from '../../Assets/loading.svg';
import loadingOutlined from '../../Assets/loadingOutlined.svg';
export default function({type,variant,onClick,text,style,loading=false,className,disable}){

    const [svariant, setVariant] = useState('outlined');

    useEffect(()=>{
        setVariant(variant);
    },[])

        return<>
            <button 
                disabled={loading||disable}
                type={type}
                onClick={onClick} 
                style={style}
                className={(svariant==='contained'?styles.contained:styles.outlined)+' '+styles.outlined+' '+(loading?styles.loadingState:null)+' '+className+` ${disable?' hover:bg-slate-400 hover:text-white bg-slate-400':null}`}>
                {text} 
                {loading?svariant==='contained'?<img width="25px" src={loadingImage}/>:<img width="25px" src={loadingOutlined}/>:null}
            </button>
        </>
}