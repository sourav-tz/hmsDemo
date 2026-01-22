// import NewMenuPDF from './messmenu.pdf';
// import { Card } from '@/components/ui/card';

// const NewMenu = () => {


//     return (
//         <div className="flex flex-col bg-gray-100 min-h-screen items-center">
//             <h1 className='text-3xl mt-10 mb-4 text-blue-700'>New Mess Menu</h1>
//             <p className='text-gray-500 mb-2'>Check out the new menu for the week</p>
//             <Card className="p-2 min-w-[300px] md:w-[1200px] mb-4">
//             <embed className='rounded-md shadow-lg' src={NewMenuPDF} type="application/pdf"  width="100%" height="600px" />
//             </Card>
//         </div>
//     )
// }

// export default NewMenu;




import NewMenuPDF from './messmenu.pdf';
import { Card } from '@/components/ui/card';

const NewMenu = () => {
  return (
    <div className="flex flex-col bg-gray-100 min-h-screen items-center px-4 [@media(min-width:100px)]:py-16 sm:px-8 py-10">
      <h1 className="text-3xl mt-5 mb-4 text-blue-700 text-center">New Mess Menu</h1>
      <p className="text-gray-500 mb-4 text-center">Check out the new menu for the week</p>
      <Card className="p-4 w-full max-w-6xl mb-4">
        <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
          <embed
            className="absolute top-0 left-0 w-full h-full rounded-md shadow-lg"
            src={NewMenuPDF}
            type="application/pdf"
          />
        </div>
      </Card>
    </div>
  );
};

export default NewMenu;

