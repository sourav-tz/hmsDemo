import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
// Bug fix by Ravi: Bug 15 - Input needed for edit dialog
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const ViewNoticeSA = () => {
  const [notices, setNotices] = useState([]);
  const [deleteId, setDeleteId] = useState(null); // 👈 for confirmation popup
  // Bug fix by Ravi: Bug 15 - No edit option existed for notices; adding edit state and dialog
  const [editNotice, setEditNotice] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  /* ================= GET NOTICES ================= */
  const getNotices = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_BASE_URL + "/SA/getNotices",
        { withCredentials: true }
      );
      setNotices(res.data.result || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch notices");
    }
  };

  useEffect(() => {
    getNotices();
  }, []);

  /* ================= DELETE NOTICE ================= */
  const deleteNotice = async () => {
    try {
      await axios.delete(
        import.meta.env.VITE_BASE_URL + "/SA/deleteNotices",
        {
          data: { public_id: deleteId },
          withCredentials: true,
        }
      );
      toast.success("Notice deleted");
      setDeleteId(null); // close popup
      getNotices();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  /* ================= EDIT NOTICE ================= */
  // Bug fix by Ravi: Bug 15 - No edit/update function existed; adds PATCH /SA/editNotice call
  const saveEditNotice = async () => {
    try {
      await axios.patch(
        import.meta.env.VITE_BASE_URL + '/SA/editNotice',
        { public_id: editNotice.public_id, title: editTitle, description: editDescription },
        { withCredentials: true }
      );
      toast.success('Notice updated');
      setEditNotice(null);
      getNotices();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update notice');
    }
  };

  /* ================= DOWNLOAD ================= */
  const downloadNotice = (public_id) => {
    window.location.href =
      `${import.meta.env.VITE_BASE_URL}/SA/downloadNotice/${public_id}`;
  };

  return (
    <>
      <ToastContainer limit={1} />

      <div className="flex flex-col items-center w-full bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-semibold mt-10">Notice</h1>
        <p className="text-gray-500 mb-6">Super Admin View Notices</p>

        <Card className="w-3/4 p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Notice ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {notices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500">
                    No notices found
                  </TableCell>
                </TableRow>
              ) : (
                notices.map((d, index) => (
                  <TableRow key={d.public_id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{d.title}</TableCell>
                    <TableCell>
                      {new Date(d.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="flex justify-center gap-3">

                        {/* ===== VIEW ===== */}
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
                            <div className="px-6 py-3 bg-white border-b">
                              <h2 className="text-lg font-semibold">{d.title}</h2>
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <iframe
                                src={`${d.url}#view=FitH&toolbar=0&navpanes=0`}
                                className="w-full h-full"
                                style={{ background: "white", border: "none" }}
                                title="Notice PDF"
                              />
                            </div>
                          </DialogContent>
                        </Dialog>

                        {/* ===== DOWNLOAD ===== */}
                        <Button
                          onClick={() => downloadNotice(d.public_id)}
                          className="bg-green-700 hover:bg-green-600 text-white"
                        >
                          Download
                        </Button>

                        {/* Bug fix by Ravi: Bug 15 - Edit button was missing; opens edit dialog for title and description */}
                        <Button
                          onClick={() => { setEditNotice(d); setEditTitle(d.title); setEditDescription(d.description || ''); }}
                          className="bg-yellow-500 hover:bg-yellow-400 text-white"
                        >
                          Edit
                        </Button>

                        {/* ===== DELETE (CONFIRM) ===== */}
                        <Button
                          onClick={() => setDeleteId(d.public_id)}
                          className="bg-red-700 hover:bg-red-600 text-white"
                        >
                          Delete
                        </Button>

                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Bug fix by Ravi: Bug 15 - Edit notice dialog; allows updating title and description */}
      <Dialog open={!!editNotice} onOpenChange={() => setEditNotice(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Notice</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-2">
            <Label>Title</Label>
            <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Notice title" />
            <Label>Description (optional)</Label>
            <Textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} placeholder="Notice description" />
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setEditNotice(null)}>Cancel</Button>
            <Button onClick={saveEditNotice} className="bg-yellow-500 hover:bg-yellow-400 text-white">Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ================= CONFIRM DELETE POPUP ================= */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>

          <p className="text-gray-600">
            This action will permanently delete the notice.
          </p>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
            >
              No
            </Button>

            <Button
              onClick={deleteNotice}
              className="bg-red-700 hover:bg-red-600 text-white"
            >
              Yes, Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ViewNoticeSA;