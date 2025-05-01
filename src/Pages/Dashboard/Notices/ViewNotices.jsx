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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSelector } from "react-redux";
import axios from "axios";

const ViewNotices = () => {
  const [notices, setNotices] = useState([]);
  const userData = useSelector((state) => state.userStorage.data);

  const getNotices = async () => {
    try {
      if (userData?.hostelNo) {
        const res = await axios({
          method: "get",
          url: import.meta.env.VITE_BASE_URL + "/student/getNotices",
          withCredentials: true,
          params: { hostelNo: userData.hostelNo },
        });
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

  return (
    <div className="flex flex-col items-center w-full bg-gray-100 min-h-screen px-4 [@media(min-width:100px)]:py-16 sm:px-8 py-10 lg:py-16">
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
                  <TableHead className="text-left">Notice ID</TableHead>
                  <TableHead className="text-left">Title</TableHead>
                  <TableHead className="text-left">Date</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notices.length !== 0 ? (
                  notices.map((d, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{d.title}</TableCell>
                      <TableCell>
                        {new Date(d.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-center space-x-2">
                        <Dialog>
                          <DialogTrigger>
                            <Button className="bg-blue-700 hover:bg-blue-500 text-white">
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{d.title}</DialogTitle>
                            </DialogHeader>
                            <a
                              href={d.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 underline"
                            >
                              Open PDF
                            </a>
                          </DialogContent>
                        </Dialog>
                       
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No notices available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
      {/* <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={totalPages}
        previousLabel="< previous"
        renderOnZeroPageCount={null}
        containerClassName="pagination justify-content-center"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            activeLinkClassName="active-page"
      /> */}
    </div>
  );
};

export default ViewNotices;




// // make table with the following columns:
// // noticeId
// // title
// // description
// // date
// // - View
// // - Delete
// //use shadcn ui components
// //use tailwind css for styling

