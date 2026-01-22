import Textinput from "../../components/Textinput/Textinput"
import Sidebar from "../../components/Sidebar/Sidebar"
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