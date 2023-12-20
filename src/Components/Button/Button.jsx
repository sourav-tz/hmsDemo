import styles from './Button.module.scss';



export default function({variant,onClick,text,style}){



    if(variant === 'contained'){
        return<>
            <button 
                onClick={onClick} 
                style={style}
                className={styles.contained}>
                {text}
            </button>
        </>
    }else{
        return<>

        </>
    }
}