import Textinput from "../../Components/Textinput/Textinput"
import Sidebar from "../../Components/Sidebar/Sidebar"
import Style from './Sandbox.module.scss'
import { Button } from "@/components/ui/button"


export default function(){
    return <>
    {/* <Sidebar /> */}
    <div className={Style.container+` bg-red-500`}>
        <div className={Style.elementContainer}>
hello
<Button variant="outline">Button</Button>


        </div>
    </div>
    </>
}