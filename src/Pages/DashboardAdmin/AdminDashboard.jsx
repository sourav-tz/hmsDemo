
import styles from './AdminDashboard.module.scss';
import Sidebar from "../../components/Sidebar/Sidebar";
import Roomsbargraph from '../../components/Roomsbargraph/Roomsbargraph';
import ComplaintBox from '../../components/ComplaintBox/ComplaintBox';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Loadingpage from '../../components/Loadingpage/Loadingpage';
import { CiLogout } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../config/config';
import { Chart, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { Doughnut } from "react-chartjs-2";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { driver } from "driver.js";
import "driver.js/dist/driver.css";

Chart.register(ArcElement, Tooltip, Legend, Title);
Chart.defaults.plugins.tooltip.backgroundColor = 'rgb(0, 0, 156)';
Chart.defaults.plugins.legend.position = 'left';
Chart.defaults.plugins.legend.title.display = true;
Chart.defaults.plugins.legend.title.font = 'Helvetica Neue';

const AdminDashboard = () => {
  const [loadingPage, setLoadingPage] = useState(false);
  const Navigator = useNavigate();
  const [totalRooms, setTotalRooms] = useState(0);
  const [partiallyFilled, setPartiallyFilled] = useState(0);
  const [vacant, setVacant] = useState(0);
  const [fullyFilled, setFullyFilled] = useState(0);

  // ✅ Fetch admin details from Redux or localStorage
  const userData = useSelector((state) => state.userStorage.data);
  const adminName = userData?.name || localStorage.getItem("adminName");
  const hostelNo = userData?.hostelNo || localStorage.getItem("hostelNo");

  const initialLoad = async () => {
    try {
      setLoadingPage(true);
      const res = await axios({
        method: 'get',
        url: import.meta.env.VITE_BASE_URL + '/HA/getRoomsData',
        params: {
          hostelNo: hostelNo || "11", // fallback if missing
        },
        withCredentials: true,
      });
      setTotalRooms(res.data.totalRooms);
      setPartiallyFilled(res.data.partiallyFilledCount);
      setVacant(res.data.vacantCount);
      setFullyFilled(res.data.fullyFilledCount);
    } catch (err) {
      console.log(err);
      if (err.status === 401) {
        Navigator('/adminLogin');
      }
    } finally {
      setLoadingPage(false);
    }
  };

  useEffect(() => {
    initialLoad();
  }, [hostelNo]);

  Chart.defaults.plugins.legend.title.text = `Out of ${totalRooms}`;
  const data = {
    labels: ["Fully Filled", "Vacant", "Partially Filled"],
    datasets: [
      {
        data: [fullyFilled, vacant, partiallyFilled],
        backgroundColor: ["green", "skyblue", "orange"],
      },
    ],
    borderWidth: 2,
    radius: '40%',
  };

  // const driverObj = driver({
  //     showProgress: true,
  //     steps: [
  //       { element: '#logout', popover: { title: 'Logout Out Button', description: 'Press this Button To logout from Dashboard', side: "left", align: 'start' }},
  //       { element: '#Sidebar', popover: { title: 'Side Navbar', description: 'Navbar is a navigation tool for our Dashboard', side: "right", align: 'start' }},
  //       { element: '#userIconSidebar', popover: { title: '', description: 'Navbar is a navigation tool for our Dashboard', side: "right", align: 'start' }}
  //     ]
  //   });
  //
  // driverObj.drive();

  // -------------------------------
  // ✅ YOUR EXISTING LAYOUT
  // -------------------------------
  return (
    <>
      {loadingPage ? (
        <Loadingpage />
      ) : (
        <div className={styles.container}>
          {/* Home */}
          <div className={styles.contentSpace + ' flex justify-center'}>
            <div className={styles.Header + ' text-blue-600 text-center text-3xl mt-16 md:mt-0'}>
              {/* ✅ Dynamic welcome */}
              <h1>
                Welcome, {adminName ? adminName : 'Hostel Admin'}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Hostel No: {userData?.dataValues?.hostelNo ?? "N/A"}
              </p>
            </div>

            <div className="">
              <Card>
                <CardHeader>
                  <CardTitle>Rooms Status</CardTitle>
                  <CardDescription>
                    Current Room Occupancy for Hostel {hostelNo || "N/A"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Doughnut type="doughnut" data={data} />
                </CardContent>
              </Card>
            </div>

            <div className={styles.complaintBox}>
              <Card>
                <CardHeader>
                  <CardTitle>Complaint Box</CardTitle>
                  <CardDescription>
                    Check the Complaints of Hostel {hostelNo || "N/A"}
                  </CardDescription>
                  <CardContent>
                    <p>No Complaints</p>
                  </CardContent>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;
