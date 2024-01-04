import styles from './Button.module.scss';
import {useState,useEffect} from 'react';
import loadingImage from '../../Assets/loading.svg';
import loadingOutlined from '../../Assets/loadingOutlined.svg';
export default function({type,variant,onClick,text,style,loading=false}){

    const [svariant, setVariant] = useState('outlined');

    useEffect(()=>{
        setVariant(variant);
    },[])

        return<>
            <button 
                disabled={loading}
                type={type}
                onClick={onClick} 
                style={style}
                className={(svariant==='contained'?styles.contained:styles.outlined)+' '+styles.outlined+' '+(loading?styles.loadingState:null)}>
                {text} 
                {loading?svariant==='contained'?<img width="25px" src={loadingImage}/>:<img width="25px" src={loadingOutlined}/>:null}
            </button>
        </>
}