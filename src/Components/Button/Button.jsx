import styles from './Button.module.scss';



export default function(props){
    if(props.variant === 'contained'){
        return<>
            <button 
                onClick={props.onClick} 
                className={styles.contained}>
                {props.text}
            </button>
        </>
    }else{
        return<>

        </>
    }
}