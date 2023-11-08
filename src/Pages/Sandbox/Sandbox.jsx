import Button from "../../Components/Button/Button"

export default function(){
    return <>
    <Button onClick={()=>{console.log('hello world')}} variant='contained' text='click me'/>
    </>
}