// import React from 'react'
import { Link } from 'react-router-dom';
import backgroundImage from '../../../Assets/hostel11.jpg';


import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

  import Chart from "chart.js/auto";
  import { CategoryScale } from "chart.js";
  import { useState } from "react";
  import { Data } from "../../../utils/data.js";
  import { Line } from "react-chartjs-2";
  Chart.register(CategoryScale);

  import { AiOutlineRightCircle } from "react-icons/ai";


const Home = () => {

    const [chartData, setChartData] = useState({
        labels: Data.map((data) => data.month), 
        type: 'line',
        datasets: [
          {
            label: "Mess Spendings",
            data: Data.map((data) => data.spendings),
            borderColor: "green",
            borderWidth: 1,
            tension:0.3

          },
          {
            label: "Extra Spendings",
            data: Data.map((data) => data.extra),
            borderColor: "blue",
            borderWidth: 1,
            tension:0.3
          }

        ]
      });

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-start py-10 items-center">
      {/* Background Image Layer */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-center bg-cover bg-no-repeat bg-fixed blur-sm opacity-50 z-[-1]"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
        <h1 className='text-3xl p-4'>Welcome, Super Admin</h1>
        <div className='flex flex-col md:flex-row rounded-[30px] shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white/30'>
        <div className='p-4 w-full md:min-w-[400px] h-full'>
          <Card>
              <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>Here are the action you can take</CardDescription>
              <CardContent>
                  <ul className='mt-4'>
                  <Link to="/superAdminDashboard/roomActions/allocateRooms"><li className='flex items-center gap-2 px-2 text-gray-600 text-xl cursor-pointer hover:translate-x-3 transition-all hover:text-purple-700 font-medium'><AiOutlineRightCircle /> Upload Rooms in Bulk</li></Link>
                  <Link to="/superAdminDashboard/roomActions/manageRooms"><li className='flex items-center gap-2 px-2 text-gray-600 text-xl cursor-pointer hover:translate-x-3 transition-all hover:text-purple-700 font-medium'><AiOutlineRightCircle /> Manage Rooms</li></Link>
                  <Link to="/superAdminDashboard/hostels/manageAdmins"><li className='flex items-center gap-2 px-2 text-gray-600 text-xl cursor-pointer hover:translate-x-3 transition-all hover:text-purple-700 font-medium'><AiOutlineRightCircle /> Add Admins & Manage Admins</li></Link>
                  <Link to="/superAdminDashboard/studentActions/addCourses"><li className='flex items-center gap-2 px-2 text-gray-600 text-xl cursor-pointer hover:translate-x-3 transition-all hover:text-purple-700 font-medium'><AiOutlineRightCircle /> Add Courses</li></Link>
                  <Link to="/superAdminDashboard/hostels/manageHostels"><li className='flex items-center gap-2 px-2 text-gray-600 text-xl cursor-pointer hover:translate-x-3 transition-all hover:text-purple-700 font-medium'><AiOutlineRightCircle /> Add & Manage Hostels</li></Link>
                  </ul>
              </CardContent>
              </CardHeader>
          </Card>
        </div>
        <div className='p-4 w-full h-full'>
            <Card>
            <CardContent  className='p-2 w-full md:w-[500px]'>
                <Line
                data={chartData}
                options={{
                plugins: {
                    title: {
                    display: true,
                    text: "Hostel Spendings in Rupees"
                    },
                    legend: {
                    display: false
                    }
                }
                }}
            />
          </CardContent>
          <CardFooter className="flex justify-center items-center">
            <div>
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a Hostel" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="6">6</SelectItem>
                        <SelectItem value="7">7</SelectItem>
                        <SelectItem value="8">8</SelectItem>
                        <SelectItem value="9">9</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="11">11</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </CardFooter>
          </Card>
        </div>
        </div>
    </div>
  )
}

export default Home