import React from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const Dashboard = () => {
  function truncateText(text, limit = 100) {
    const words = text.split(" ");

    if (words.length > limit) {
      return words.slice(0, limit).join(" ") + "...";
    } else {
      return text;
    }
  }

  const [notices, setNotices] = useState([]);
  const userData = useSelector((state) => state.userStorage.data);

  const getNotices = async () => {
    // to give value to the hostelNo
    // userData.hostelNo = 10;
    try {
      // Check if userData and are defined
      if (!userData) {
        console.log("User data missing.");
      }

      // console.log("STUDENT DATA_>", userData);
      if (userData.hostelNo) {
        const res = await axios({
          method: "get",
          url: import.meta.env.VITE_BASE_URL + "/student/getNotices",
          withCredentials: true,
          // params: { hostelNo: userData.hostelNo } // Send hostelNo as query parameter
          params: { hostelNo: userData.hostelNo },
          // because hostelNo field is null in userData
          // Solution: allot a hostel to the student, to fetch the notices of that hostel
          // which are relevant to the student.
        });
        console.log(res);
        // Sort the notices by createdAt in descending order
        const sortedNotices = res.data.result.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setNotices(sortedNotices.slice(0, 3)); // Get only the latest 3 notices
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getNotices();
  }, []);

  return (
    <div className="flex ">
      <div className="flex flex-wrap min-h-screen w-full  justify-center items-start  bg-gray-100 [@media(min-width:100px)]:pt-24 [@media(min-width:100px)]:p-8  sm:gap-1    md:grid-cols-2   lg:pr-14 lg:p-24   xl:pl-6  xl:p-20 ">
        <div className="rounded-lg w-[600px] bg-white p-6 shadow-sm dark:bg-gray-950 ">
          <div className="flex items-center justify-between ">
            <h2 className="text-xl font-semibold">Notices</h2>
            <Link
              className="text-sm font-medium text-blue-500 hover:underline"
              to="/studentDashboard/notices/view"
            >
              View all
            </Link>
          </div>
          <div className="mt-4 space-y-4">
            {userData.hostelNo ? (
              notices.map((d, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">{d.title}</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(d.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{d.title}</DialogTitle>
                            {/* <DialogDescription>
                          {truncateText(
                            "The hostel renovation project is progressing well, and we expect the work to be completed by the end of the month.",
                            50
                          ) + "... (Read more)"}
                        </DialogDescription> */}
                          </DialogHeader>
                          <embed
                            className="rounded-md shadow-lg"
                            src={d.url}
                            type="application/pdf"
                            width="100%"
                            height="500px"
                          />
                        </DialogContent>
                      </Dialog>
                      <Dialog>
                        <DialogTrigger>
                          <Button className="bg-blue-700 hover:bg-blue-500">
                            Download
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{d.title}</DialogTitle>
                          </DialogHeader>
                          <a href={d.url} target="_blank">
                            Open PDF
                          </a>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full h-full p-4 font-bold text-center text-xl">Student not alloted a Hostel yet.</div>
            )}
          </div>
        </div>
        <div className="w-[600px] rounded-lg bg-white p-6 shadow-sm dark:bg-gray-950">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Complaints</h2>
            <Link
              className="text-sm font-medium text-blue-500 hover:underline"
              href="#"
            >
              View all
            </Link>
          </div>
          <div className="mt-4 space-y-4">
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">
                    Broken Washing Machine
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    April 20, 2023
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                    variant="outline"
                  >
                    In Progress
                  </Badge>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                The washing machine in the laundry room is not working properly.
                Please look into this issue as soon as possible.
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Clogged Sink</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    April 15, 2023
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    variant="outline"
                  >
                    Resolved
                  </Badge>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                The sink in the common bathroom is clogged, causing water to
                back up. Please send a plumber to fix this issue.
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Faulty Light Bulb</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    April 12, 2023
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                    variant="outline"
                  >
                    Open
                  </Badge>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                The light bulb in the hallway is not working. Please replace it
                as soon as possible.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
