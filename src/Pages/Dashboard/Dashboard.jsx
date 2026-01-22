import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Dashboard = () => {
  const [notices, setNotices] = useState([]);
  const userData = useSelector((state) => state.userStorage.data);

  /* ================= GET NOTICES ================= */
  const getNotices = async () => {
    try {
      if (userData?.hostelNo) {
        const res = await axios.get(
          import.meta.env.VITE_BASE_URL + "/student/getNotices",
          {
            withCredentials: true,
            params: { hostelNo: userData.hostelNo },
          }
        );

        // sort by latest date
        const sortedNotices = res.data.result.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setNotices(sortedNotices.slice(0, 3)); // only latest 3
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getNotices();
  }, []);

  /* ================= DIRECT DOWNLOAD ================= */
  const downloadNotice = (public_id) => {
    window.location.href =
      `${import.meta.env.VITE_BASE_URL}/SA/downloadNotice/${public_id}`;
  };

  return (
    <div className="flex">
      <div className="flex flex-wrap min-h-screen w-full justify-center items-start bg-gray-100 pt-24 p-8 lg:p-24 gap-6">

        {/* ================= NOTICES ================= */}
        <div className="rounded-lg w-[600px] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Notices</h2>
            <Link
              className="text-sm font-medium text-blue-500 hover:underline"
              to="/studentDashboard/notices/view"
            >
              View all
            </Link>
          </div>

          <div className="mt-4 space-y-4">
            {userData?.hostelNo ? (
              notices.map((d) => (
                <div
                  key={d.public_id}
                  className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">{d.title}</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {new Date(d.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">

                      {/* VIEW */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </DialogTrigger>

                        <DialogContent className="max-w-4xl h-[80vh] p-0 flex flex-col">
                          <DialogHeader className="px-6 py-3 border-b">
                            <DialogTitle>{d.title}</DialogTitle>
                          </DialogHeader>

                          <div className="flex-1 overflow-hidden">
                            <iframe
                              src={`${d.url}#view=FitH&toolbar=0&navpanes=0`}
                              className="w-full h-full"
                              style={{ border: "none", background: "white" }}
                              title="Notice PDF"
                            />
                          </div>
                        </DialogContent>
                      </Dialog>

                      {/* DOWNLOAD */}
                      <Button
                        size="sm"
                        className="bg-blue-700 hover:bg-blue-600 text-white"
                        onClick={() => downloadNotice(d.public_id)}
                      >
                        Download
                      </Button>

                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full p-4 text-center font-bold text-xl">
                Student not allotted a hostel yet.
              </div>
            )}
          </div>
        </div>

        {/* ================= COMPLAINTS ================= */}
        <div className="w-[600px] rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Complaints</h2>
            <Link
              className="text-sm font-medium text-blue-500 hover:underline"
              to="#"
            >
              View all
            </Link>
          </div>

          <div className="mt-4 space-y-4">

            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">
                    Broken Washing Machine
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    April 20, 2023
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className="bg-yellow-100 text-yellow-800"
                    variant="outline"
                  >
                    In Progress
                  </Badge>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                The washing machine in the laundry room is not working properly.
                Please look into this issue as soon as possible.
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Clogged Sink</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    April 15, 2023
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className="bg-green-100 text-green-800"
                    variant="outline"
                  >
                    Resolved
                  </Badge>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                The sink in the common bathroom is clogged, causing water to
                back up.
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Faulty Light Bulb</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    April 12, 2023
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className="bg-red-100 text-red-800"
                    variant="outline"
                  >
                    Open
                  </Badge>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500">
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