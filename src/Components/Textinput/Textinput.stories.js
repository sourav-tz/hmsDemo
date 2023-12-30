import react from 'react';
import Textinput from './Textinput.jsx';


export default {
    title: 'Input Text',
    component:Textinput,
    argTypes:{
        label:'text',
        onClick:{action:'clicked'}
    }
}


export const Input = {
    args:{
        label:'text',
        
    }
}