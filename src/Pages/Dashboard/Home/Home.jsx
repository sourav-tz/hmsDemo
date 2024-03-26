import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import DatePicker from "react-tailwindcss-datepicker";

const Home = () => {
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.js",
    import.meta.url
  ).toString(); // used for pdf viewing in the browser

  const [selectedDate, setSelectedDate] = useState(null) ;

  const handelDateChange = (date) => {
    setSelectedDate(date);
  };

  const Actions = () => {
    
  }

  return (
    <div className="bg-[#F8F9FB] h-screen">
      <h1 className="mt-8">Welcome to Vivekanand</h1>

      <div className="flex gap-20 justify-left  h-auto mt-20 mx-10">
        {/* Notices */}

        <div className="w-1/3 bg-[#d9d9d9] rounded-md p-4">
          <div className="flex font bold justify-between">
            <h1 className="mb-2 font-bold text-2xl">Notices</h1>
            <DatePicker selected={selectedDate}
            onChange={handelDateChange}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select a date"/>
          </div>

          {/* <div className="grid grid-col-1 gap-3 bg-white p-2 rounded-md justify-center"> */}
            <ul className="w-full h-80 overflow-y-auto">
              {Array.from({length:10}, (_,index) => (
              <li key={index} className="py-3">**Notice**</li>))}
            
            </ul>
          {/* </div> */}
        </div>

        {/* Actions */}

        <div className="w-1/3 bg-[#d9d9d9] rounded-md p-4">
          <h1 className="mb-2 font-bold text-2xl">Actions</h1>
          <div className="flex flex-col overflow-auto gap-4">
          {Array.from({length:8}, (_, index) => 
          <button key={index} className=" bg-white rounded-md shadow-lg hover:shadow-2xl border-b-4 text-gray-800">
            Action-{index+1}
          </button>)}
          </div>

            {/* <Document file="/src/example.pdf"> 
           <Page pageNumber={1}/>
          </Document> */}
          
        </div>
      </div>
    </div>
  );
};

export default Home;
