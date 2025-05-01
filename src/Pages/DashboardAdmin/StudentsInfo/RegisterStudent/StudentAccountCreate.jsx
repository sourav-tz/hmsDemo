import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import backgroundImage from '../../../../Assets/hostel11.jpg';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

const StudentAccountCreate = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
const filteredItems = items.filter(item =>
  item.email.toLowerCase().includes(searchQuery.toLowerCase())
);


  // Fetch all student temp accounts on load
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_BASE_URL + '/HA/studentList', {
          withCredentials: true,
        });
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching temp accounts:", error);
      }
    };

    fetchStudents();
  }, []);

  const handleAdd = async () => {
    setEmailError(""); // Reset any previous error

    if (email.trim() === "") {
      setEmailError("Email field cannot be empty.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios({
        method: 'post',
        url: import.meta.env.VITE_BASE_URL + '/HA/studentCreate',
        withCredentials: true,
        data: { email },
      });

      const { email: returnedEmail, password, expiresAt } = response.data;
      setItems([...items, { email: returnedEmail, password, expiresAt }]);
      setEmail("");
    } catch (error) {
      console.error("Failed to create temporary student account:", error);
      setEmailError(error.response?.data?.error || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="relative min-h-screen w-full flex flex-col justify-start py-10 items-center">
      {/* Background Image Layer */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-center bg-cover bg-no-repeat bg-fixed blur-sm opacity-50 z-[-1]"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />


      {/* Input Section */}
      <div className="w-3/5 max-h-[400px] overflow-auto rounded-2xl p-12 bg-[#5F57FF] flex gap-2 flex-wrap shadow-sm items-center justify-center">
        <div className="text-center w-full">
          <h1 className="text-3xl font-semibold text-white">Student Account Creation</h1>
          <p className="text-white font-semibold mt-6 mb-6">Enter Student E-mail</p>
        </div>

        <div className="flex items-center gap-4 mt-4 w-full">
          <Input
            type="email"
            value={
              emailError && email
                ? `${email} (${emailError})`
                : email
            }
            onChange={(e) => {
              const rawValue = e.target.value;
              const cleanValue = rawValue.split(" (")[0]; // Remove appended error message if user edits
              setEmail(cleanValue);
              setEmailError(""); // Clear error on change
            }}
            placeholder="Enter email"
            className={`rounded-xl px-4 py-2 mb-2 ${
              emailError
                ? "border-red-500 text-red-600 placeholder-red-500"
                : "border-gray-300"
            }`}
          />


          <Button
            className="bg-[#131133] rounded-xl hover:bg-blue-500 w-[30%] transition transform hover:scale-105 duration-300 ease-in-out"
            onClick={handleAdd}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Account"}
          </Button>
        </div>

      </div>

      {/* Table Section */}
      <div className="w-4/6 mt-6 ml-4 max-lg:ml-16 min-lg:ml-16 flex items-center justify-between rounded-xl p-1">
        <h2 className="text-xl font-semibold text-[#131133]">Emails registered</h2>

        <Input
          type="text"
          placeholder="Search email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-1/3 border border-gray-300 rounded-xl px-4 py-2"
        />
      </div>

      <Card className="w-3/4 mt-4 ml-2 max-lg:ml-16 min-lg:ml-16 max-h-[400px] overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Email</TableHead>
              <TableHead className="text-center">Password</TableHead>
              <TableHead className="text-center">Created At</TableHead>
              <TableHead className="text-center">Expires At</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item, index) => (
              <TableRow key={`created-${index}`}>
                <TableCell className="text-center">{item.email}</TableCell>
                <TableCell className="text-center font-mono">
                  {item.password ? (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">{item.password}</span>
                  ) : (
                    <span className="text-gray-500 italic">Password hidden (hashed)</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {new Date(item.createdAt).toLocaleString()}
                </TableCell>
                <TableCell className="text-center">
                  {new Date(item.expiresAt).toLocaleString()}
                </TableCell>
                <TableCell className="text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === 'approved' ? 'bg-green-100 text-green-800' :
                    item.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    item.status === 'profile_submitted' ? 'bg-orange-100 text-orange-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.status || 'pending'}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

    </div>
  );
};

export default StudentAccountCreate;


//search bar
// front end email validation
//UI implementation of check for wrong entry instead of alert
// Email sending to student implementation||
// status-(red-rejected/green-accepted/orange-approval pending/ yellow-form pending)
//limiting the number of emails of the emails on one page and implementing number of pages