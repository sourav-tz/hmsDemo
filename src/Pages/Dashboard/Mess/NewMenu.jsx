import NewMenuPDF from './messmenu.pdf';
import { Card } from '@/components/ui/card';

const NewMenu = () => {


    return (
        <div className="flex flex-col bg-gray-100 min-h-screen items-center">
            <h1 className='text-3xl mt-10 mb-4 text-blue-700'>New Mess Menu</h1>
            <p className='text-gray-500 mb-2'>Check out the new menu for the week</p>
            <Card className="p-2 min-w-[300px] md:w-[1200px] mb-4">
            <embed className='rounded-md shadow-lg' src={NewMenuPDF} type="application/pdf"  width="100%" height="600px" />
            </Card>
        </div>
    )
}

export default NewMenu;