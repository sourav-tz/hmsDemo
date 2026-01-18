import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSelector } from "react-redux";
import axios from "axios";

const ViewNotices = () => {
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

        const sortedNotices = res.data.result.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setNotices(sortedNotices);
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
    <div className="flex flex-col items-center w-full bg-gray-100 min-h-screen px-4 py-10 sm:px-8 lg:py-16">
      <h1 className="text-3xl font-semibold mt-5 text-center">Notice</h1>
      <p className="text-gray-500 text-center">View Notices</p>

      <Card className="w-full max-w-4xl mt-10">
        {!userData?.hostelNo ? (
          <div className="w-full p-10 text-center text-xl font-bold">
            Student not allotted a hostel yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Notice ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {notices.length !== 0 ? (
                  notices.map((d, index) => (
                    <TableRow key={d.public_id}>
                      <TableCell className="font-medium">
                        {index + 1}
                      </TableCell>
                      <TableCell>{d.title}</TableCell>
                      <TableCell>
                        {new Date(d.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        {d.isGlobal ? "Super Admin" : "Admin"}
                      </TableCell>

                      <TableCell className="text-center">
                        <div className="flex justify-center gap-3">

                          {/* ================= VIEW ================= */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                className="border-blue-600 text-blue-600"
                              >
                                View
                              </Button>
                            </DialogTrigger>

                            <DialogContent className="max-w-5xl h-[85vh] p-0 bg-gray-100 flex flex-col">
                              {/* Header */}
                              <div className="px-6 py-3 bg-white border-b shrink-0">
                                <h2 className="text-lg font-semibold">
                                  {d.title}
                                </h2>
                              </div>

                              {/* PDF Viewer */}
                              <div className="flex-1 overflow-hidden">
                                <iframe
                                  src={`${d.url}#view=FitH&toolbar=0&navpanes=0`}
                                  className="w-full h-full"
                                  style={{
                                    background: "white",
                                    border: "none",
                                  }}
                                  title="Notice PDF"
                                />
                              </div>
                            </DialogContent>
                          </Dialog>

                          {/* ================= DOWNLOAD ================= */}
                          <Button
                            onClick={() => downloadNotice(d.public_id)}
                            className="bg-green-700 hover:bg-green-600 text-white"
                          >
                            Download
                          </Button>

                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No notices available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ViewNotices;