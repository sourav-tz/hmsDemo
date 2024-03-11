import styles from './Roomsbargraph.module.scss';
import { AgChartsReact } from 'ag-charts-react';
import { useState } from 'react';

const Roomsbargraph = ()=>{

    const [chartOptions, setChartOptions] = useState({

        title:{
            text:"Rooms Status",
        },
        // Data: Data to be displayed in the chart
        data: [
           
            { Status: 'Vacant', numberOfRooms: 20 },
            { Status: 'Fully Filled',  numberOfRooms: 140 },
            { Status: 'Partially Filled', numberOfRooms: 40 },
            { Status: 'Total Rooms', numberOfRooms: 204 },
           
        ],
        // Series: Defines which chart type and data to use
        series: [{ type: 'bar', xKey: 'Status', yKey: 'numberOfRooms' }],
      });



    return <>
    <AgChartsReact lable="Rooms Status" options={chartOptions} />
    </>
}


export default Roomsbargraph;