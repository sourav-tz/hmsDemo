import React from 'react'
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
    <div className='mt-4 flex flex-col items-center'>
        <h1 className='text-3xl p-4'>Welcome, Super Admin</h1>
        <div className='flex flex-col md:flex-row'>
        <div className='p-4 w-full md:min-w-[400px] h-full'>
        <Card>
            <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>Here are the action you can take</CardDescription>
            <CardContent>
                <ul className='mt-4'>
                    <li className='flex items-center gap-2 px-2 text-gray-600 text-xl cursor-pointer hover:translate-x-3 transition-all hover:text-purple-700 font-medium'><AiOutlineRightCircle /> Upload Rooms in Bulk</li>
                    <li className='flex items-center gap-2 px-2 text-gray-600 text-xl cursor-pointer hover:translate-x-3 transition-all hover:text-purple-700 font-medium'><AiOutlineRightCircle /> Add Admins & Manage Admins</li>
                    <li className='flex items-center gap-2 px-2 text-gray-600 text-xl cursor-pointer hover:translate-x-3 transition-all hover:text-purple-700 font-medium'><AiOutlineRightCircle /> Add Courses</li>
                    <li className='flex items-center gap-2 px-2 text-gray-600 text-xl cursor-pointer hover:translate-x-3 transition-all hover:text-purple-700 font-medium'><AiOutlineRightCircle /> Add & Manage Hostels</li>
                    <li className='flex items-center gap-2 px-2 text-gray-600 text-xl cursor-pointer hover:translate-x-3 transition-all hover:text-purple-700 font-medium'><AiOutlineRightCircle /> Register A Guest</li>
                    <li className='flex items-center gap-2 px-2 text-gray-600 text-xl cursor-pointer hover:translate-x-3 transition-all hover:text-purple-700 font-medium'><AiOutlineRightCircle /> View Student Info</li>
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