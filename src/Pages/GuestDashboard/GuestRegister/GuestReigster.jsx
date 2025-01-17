import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
<<<<<<< HEAD
<<<<<<< HEAD
import uploadIconCoud from "./upload-icon.svg"
import axios from "axios";
import { Button } from "@/components/ui/button"
import { ToastContainer,toast } from "react-toastify";
import backgroundImage from '../../../Assets/hostel11.jpg'; // Ensure the path to your image is correct.
import 'react-toastify/dist/ReactToastify.css';

const GuestReigster = () => {
  const [formData, setFormData] = useState({
      first_name: "",
      last_name: "",
      guest_email: "",
      referrer_email: "",
      id_proof_no: "",
      hostel_no: "",
      contact_number: "",
      address: "",
      checkin_date: "",
      checkout_date: "",
      gender: "",
      city: "",
      state: "",
      pincode: "",
      number_of_guests: "",
      additional_requests: "",
      purpose_of_visit: ""
  });

=======

const GuestReigster = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    referrelEmail:"",
    contactNumber: "",
    state: "",
    city: "",
    pincode: "",
    address: "",
    checkInDate: "",
    checkOutDate: "",
    gender: "",
    numberOfGuests: "",
    purposeOfVisit: "",
    additionalGuestNames: "",
    additionalRequests: "",
  });


>>>>>>> 07c25747cd639ac7289eb18de540cf27e72319d2
=======

const GuestReigster = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    referrelEmail:"",
    contactNumber: "",
    state: "",
    city: "",
    pincode: "",
    address: "",
    checkInDate: "",
    checkOutDate: "",
    gender: "",
    numberOfGuests: "",
    purposeOfVisit: "",
    additionalGuestNames: "",
    additionalRequests: "",
  });


>>>>>>> 07c25747cd639ac7289eb18de540cf27e72319d2
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
<<<<<<< HEAD
<<<<<<< HEAD
  const handleSubmit = async(e) => {
    e.preventDefault();
    // console.log("Form Data as JSON:", formData);

    // api call
    try {
      const res = await axios({
        method: 'post',
        url: import.meta.env.VITE_BASE_URL + '/guest/register',
        data: formData, 
        headers:{
            "Content-Type": "application/json",
          },
        withCredentials: true
      });

      console.log("RES",res);
      console.log("RES STATUS",res.status)

      if(res.status === 201){
        toast.success("Guest information created successfully.")
        // toast.success(res.data.application_id)
        toast.success(`Your Application ID: ${res.data.application_id}`);
      // toast.success(res.response.data.message)
      }

      setFormData({
        first_name: "",
        last_name: "",
        guest_email: "",
        referrer_email: "",
        id_proof_no: "",
        hostel_no: "",
        contact_number: "",
        address: "",
        checkin_date: "",
        checkout_date: "",
        gender: "",
        city: "",
        state: "",
        pincode: "",
        number_of_guests: "",
        additional_requests: "",
        purpose_of_visit: ""
      });
    } catch (err) {
      console.error(err); // Log the error for debugging
      toast.error(err.response.data.message)

    }
    // alert("Form submitted successfully!"); // Optional: Display success message
  };

  const clearForm = () =>{
    setFormData({
      first_name: "",
      last_name: "",
      guest_email: "",
      referrer_email: "",
      id_proof_no: "",
      hostel_no: "",
      contact_number: "",
      address: "",
      checkin_date: "",
      checkout_date: "",
      gender: "",
      city: "",
      state: "",
      pincode: "",
      number_of_guests: "",
      additional_requests: "",
      purpose_of_visit: ""
    });
  }

  
  return (
    <div>
    <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              filter: 'blur(3px)', // Optional: Adds a blur effect
              opacity: 0.5, // Slightly reduce opacity for effect
              zIndex: -1, // Place the background behind the content
            }}
          >
          </div>
    <div className=" flex  flex-row  w-full bg-grey-950 p-2 items-center justify-center h-screen overflow-y-hidden ">
       {/* <Button onClick className="bg-purple-700 hover:bg-purple-500 absolute top-10 left-24">Go Back</Button> */}
        <Link className="bg-[#5757FF] text-white font-bold py-2 px-4 rounded hover:bg-grey-700 self-start mt-4 mr-4" to="/guest/home">Go Back</Link>
      <div className=" flex flex-row p-2 bg-slate-200 rounded-sm   h-full  w-max w-11/12 pr-4 pl-4">
        <div className="flex flex-col gap-4 w-1/3 w-[30%]">
          <div className="bg-[#5757FF] max-w-72 p-4  rounded-md ">
            <h1 className="text-base font-semibold text-white">Document Accepted</h1>
            <ul className="list-disc ml-3 p-2 text-xs text-white">
              <li>Adhar Card</li>
              <li>Voter ID</li>
              <li>Driving License</li>
              <li>Ration Card</li>
              <li>Passport with visa (for international visitors)</li>
            </ul>

            <h1 className="text-base font-semibold mt-1 text-white">
              File Upload Instructions
            </h1>
            <ul className="list-disc ml-3 p-2 text-xs text-white">
              <li>
                Guest should be greater than 18 if less to be accompanied by
              </li>
              <li>
                Upload document for primary guest only (for multiple guest)
              </li>
              <li>Accepted formats jpg,png,pdf only</li>
              <li>File size should be less than 1mb</li>
            </ul>
          </div>

          <div className="flex flex-col justify-center items-center rounded-md gap-1">
            <h1 className="text-lg font-semibold ">Upload Document here</h1>
            <img src={uploadIconCoud} className="ml-4"></img>
            <div className="flex flex-col justify-center items-center">
              <div className="text-gray-500 ">
                Drag and Drop files here
              </div>
              <div className="text-gray-500 ">OR</div>
            </div>
            <button className="bg-sky-400 text-white  hover:bg-blue-600 rounded-xl px-4 py-2">
              Browse Files
            </button>
          </div>
        </div>

        {/* right panel */}

        <div className=" ml-4 p-5 rounded-lg w-full bg-slate-50 shadow-lg">
          <div>
            <h1 className="text-3xl font-bold text-center mb-4">
              Guest Registration Form
            </h1>
          </div>
          <form onSubmit={handleSubmit} className="gap-4">
            {/* Form Fields */}
            <div className="grid grid-cols-4 gap-3">
              {/* Row 1 */}
              <div className="flex flex-col">
                <label className="block font-medium">*First Name</label>
                <input
                  type="text"
                  required
                  placeholder="First Name"
                  value={formData.first_name}
                  name="first_name"
                  onChange={handleChange}
                  className="mt-0 p-2 border rounded-lg focus:outline-blue-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="block font-medium">Last Name</label>
                <input
                  type="text"
                  placeholder="Last Name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="mt-0 p-2 border rounded-lg focus:outline-blue-500"
                />
              </div>
              <div className="flex flex-col">
                <label className="block font-medium">*ID Proof Number</label>
                <input
                  type="text"
                  required
                  placeholder="ABC123"
                  name="id_proof_no"
                  value={formData.id_proof_no}
                  onChange={handleChange}
                  className="mt-0 p-2 border rounded-lg focus:outline-blue-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="block font-medium">*Your Email</label>
                <input
                  type="email"
                  required
                  value={formData.guest_email}
                  onChange={handleChange}
                  placeholder="eg:prashant454@gmail.com"
                  name="guest_email"
                  className="mt-0 p-2 border rounded-lg focus:outline-blue-500"
                />
              </div>

              {/* Row 2 */}
              <div className="flex flex-col">
                <label className="block font-medium">*Referrer Email</label>
                <input
                  type="email"
                  required
                  placeholder="eg:523110020@nitkkr.ac.in"
                  name="referrer_email"
                  value={formData.referrer_email}
                  onChange={handleChange}
                  pattern="[0-9]+@nitkkr\.ac\.in$"
                  className="mt-0 p-2 border rounded-lg focus:outline-blue-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="block font-medium">*Contact Number</label>
                <input
                  type="text"
                  required
                  value={formData.contact_number}
                  onChange={handleChange}
                  placeholder="Contact Number (e.g., +91 1234567890)"
                  name="contact_number"
                  maxLength="10"
                  pattern="\d{10}"
                  className="mt-0 p-2 border rounded-lg focus:outline-blue-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="block font-medium">*City</label>
                <input
                  type="text"
                  required
                  placeholder="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="mt-0 p-2 border rounded-lg focus:outline-blue-500"
                />
              </div>

              {/* Row 3 */}

              <div className="flex flex-col">
                <label className="block font-medium">*State</label>
                <input
                  type="text"
                  required
                  placeholder="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="mt-0 p-2 border rounded-lg focus:outline-blue-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="block font-medium">*Pincode</label>
                <input
                  type="text"
                  required
                  maxLength="6"
                  pattern="\d{6}"
                  placeholder="eg:209306"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="mt-0 p-2 border rounded-lg focus:outline-blue-500"
                />
              </div>

              <div className="flex flex-col col-span-3">
                <label className="block font-medium">*Address</label>
                <input
                  type="text"
                  required
                  placeholder="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="mt-0 p-2 border rounded-lg focus:outline-blue-500"
                />
              </div>

              {/* Row 4 */}
              <div className="flex flex-col">
                <label className="block font-medium">*Check-in Date</label>
                <input
                  type="date"
                  required
                  name="checkin_date"
                  value={formData.checkin_date}
                  onChange={handleChange}
                  className="mt-0 p-2 border rounded-lg focus:outline-blue-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="block font-medium">*Check-out Date</label>
                <input
                  type="date"
                  required
                  name="checkout_date"
                  value={formData.checkout_date}
                  onChange={handleChange}
                  className="mt-0 p-2 border rounded-lg focus:outline-blue-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="block font-medium">*Gender</label>
                <select
                  className="mt-0 p-2 border rounded-lg focus:outline-blue-500"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option>Choose</option>
                  <option>male</option>
                  <option>female</option>
                  <option>other</option>
                </select>
              </div>

              {/* Row 5 */}
              <div className="flex flex-col">
                <label className="block font-medium">*Number of Guests</label>
                <input
                  type="number"
                  required
                  placeholder="Number of Guests"
                  name="number_of_guests"
                  value={formData.number_of_guests}
                  onChange={handleChange}
                  className="mt-0 p-2 border rounded-lg focus:outline-blue-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="block font-medium">
                  *Choose Hostel Number
                </label>
                <select
                  className="mt-0 p-2 border rounded-lg focus:outline-blue-500"
                  name="hostel_no"
                  value={formData.hostel_no}
                  onChange={handleChange}
                  required
                >
                  <option>Choose</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                  <option>7</option>
                  <option>8</option>
                  <option>9</option>
                  <option>10</option>
                  <option>11</option>
                </select>
              </div>

              <div className="flex flex-col col-span-3">
                <label className="block font-medium">*Purpose of Visit</label>
                <input
                  type="text"
                  required
                  placeholder="Purpose of Visit"
                  name="purpose_of_visit"
                  value={formData.purpose_of_visit}
                  onChange={handleChange}
                  className="mt-0 p-2 border rounded-lg focus:outline-blue-500"
                />
              </div>

              <div className="flex flex-col col-span-4 row-span-2">
                <label className="block font-medium">Additional Requests</label>
                <textarea
                  rows="3"
                  placeholder="Additional Requests"
                  name="additional_requests"
                  value={formData.additional_requests}
                  onChange={handleChange}
                  className="mt-0 p-2 border rounded-lg focus:outline-blue-500 resize-none"
                ></textarea>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-between mt-4 gap-4">
              <button
              onClick={clearForm}
                type="reset"
                className="px-6 py-2 bg-gray-300 rounded-xl hover:bg-gray-400 w-1/2"
              >
                Clear
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#5757FF] text-white rounded-xl hover:bg-gray-900 w-1/2"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
      </div>
    </div>
=======
=======
>>>>>>> 07c25747cd639ac7289eb18de540cf27e72319d2
  const handleSubmit = (e) => {
    
    e.preventDefault();
    console.log("Form Data as JSON:", formData);
   


    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      referrelEmail:"",
      contactNumber: "",
      state: "",
      city: "",
      pincode: "",
      address: "",
      checkInDate: "",
      checkOutDate: "",
      gender: "",
      numberOfGuests: "",
      purposeOfVisit: "",
      additionalGuestNames: "",
      additionalRequests: "",
    });
    
    alert("Form submitted successfully!");  // Optional: Display success message
  
  };
  


  return (
    <div className=" flex  flex-row  w-screen bg-blue-950 p-2 items-center justify-center  ">
      <div className="   flex flex-row p-2 bg-slate-50 rounded-sm">

      <div className="flex flex-col gap-4 ">
            <div className="bg-blue-300 max-w-72 p-4  ml-3 rounded-md ">
              
                <h1 className="text-xl font-semibold ">Document Accepted</h1>
              <ul className="list-disc ml-3 p-2 text-sm text-blue-700">
                <li>Adhar Card</li>
                <li>Voter ID</li>
                <li>Driving License</li>
                <li>Ration Card</li>
                <li>Passport with visa (for international visitors)</li>
              </ul>
               

                <h1 className="text-xl font-semibold mt-1">File Upload Instructions</h1>
                <ul className="list-disc ml-3 p-2 text-sm text-blue-700">
                <li>Guest should be greater than 18 if less to be accompanied by</li>
                <li>Upload document for primary guest only (for multiple guest)</li>
                <li>Accepted formats jpg,png,pdf only</li>
                <li>File size should be less than 1mb</li>
                </ul>
                
              </div>

            
    

              <div className="flex flex-col justify-center items-center  rounded-md   mx-w-52">
                <h1 className="text-xl font-semibold">Upload Document here</h1>
                <img src="" className="ml-4"></img>
                <div className="ml-10">
                <div className="text-gray-500 mt-4 ">Drag and Drop files here</div>
                <div className="text-gray-500 ">OR</div>
                </div>
                <button className="bg-sky-400 text-white  py-2 mr-12 ml-7 mt-2 hover:bg-blue-600 rounded-xl">Browse Files</button>
              </div>

            
      </div> 

        {/* right panel */}

      <div className="bg-gray-200 ml-4 p-5  rounded-lg ">
        <div>
          <h1 className="text-3xl font-bold text-center mb-4">Guest Registration Form</h1>
        </div>
        <form onSubmit={handleSubmit} className="gap-4">
          {/* form fields*/}

          <div className="flex flex-row">
            <div className="flex flex-col">
              <label className="block font-medium">*First Name</label>
              <input type="text" required placeholder="First Name" value={formData.firstName} name="firstName"
                  onChange={handleChange} className="mt-0 p-2 w-full border rounded-lg focus:outline-blue-500"></input>

              <label className="block font-medium">*Your Email</label>
              <input type="email"  required value={formData.email}
                  onChange={handleChange} placeholder="eg:prashant454@gmail.com" name="email" className="mt-0 p-2 w-full border rounded-lg focus:outline-blue-500"/>

              <label className="block font-medium">*Contact Number</label>
              <input type="text" required value={formData.contactNumber}
                  onChange={handleChange} placeholder="Contact Number  (e.g., +91 1234567890)" name="contactNumber" maxLength="10" pattern="\d{10}" className="mt-0 p-2 w-full border rounded-lg focus:outline-blue-500"/>

              <label className="block font-medium">*State</label>
              <input type="text" required placeholder="State" name="state" value={formData.state} onChange={handleChange} className="mt-0 p-2 w-full border rounded-lg focus:outline-blue-500"/>
            </div>

            <div className="flex flex-col ml-24">
              <label className="block font-medium">Last Name</label>
              <input type="text" placeholder="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} className="mt-0 p-2 w-full border rounded-lg focus:outline-blue-500"/>

              <label className="block font-medium">*Referrer Email</label>
              <input type="email" required placeholder="eg:523110020@nitkkr.ac.in" name="referrelEmail" value={formData.referrelEmail} onChange={handleChange} pattern="[0-9]+@nitkkr\.ac\.in$" className="mt-0 p-2 w-full border rounded-lg focus:outline-blue-500"/>

              <label className="block font-medium">*City</label>
              <input type="text" required placeholder="City" name="city" value={formData.city} onChange={handleChange} className="mt-0 p-2 w-full border rounded-lg focus:outline-blue-500"/>

              <label className="block font-medium">*Pincode</label>
              <input type="text" required   maxLength="6"
                pattern="\d{6}" placeholder="eg:209306" name="pincode" value={formData.pincode} onChange={handleChange} className="mt-0 p-2 w-full border rounded-lg focus:outline-blue-500"/>
            </div>
          </div>
          <div className="flex flex-col">
            <label className="block font-medium">*Address</label>
            <input type="text" required placeholder="Address" name="address" value={formData.address} onChange={handleChange} className="mt-0 p-2 w-full border rounded-lg focus:outline-blue-500"/>
          </div>

          <div className="flex flex-row ">
            <div className="flex flex-col">
            <label className="block font-medium">*Check in Date</label>
            <input type="date" required placeholder="DD/MM/YYYY" name="checkInDate" value={formData.checkInDate} onChange={handleChange} className="mt-0 p-2 w-full border rounded-lg focus:outline-blue-500"/>
            </div>
            
            <div className="flex flex-col ml-24">
            <label className="block font-medium">*Check out Date</label>
            <input type="date" required placeholder="DD/MM/YYYY" name="checkOutDate" value={formData.checkOutDate} onChange={handleChange} className="mt-0 p-2 w-full border rounded-lg focus:outline-blue-500"/>
            </div>
          </div>
          <div className="flex flex-row">
            <div className="flex flex-col">
              <label className="block font-medium">*Gender</label>
              <select className="mt-0 p-2 w-full border rounded-lg focus:outline-blue-500" name="gender" value={formData.gender} onChange={handleChange} required>
              <option>Choose</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            </div>
            <div className="flex flex-col ml-2">
              <label className="block font-medium">*Number of Guest</label>
              <input type="number" required placeholder="Number of Guests"  name="numberOfGuests" value={formData.numberOfGuests} onChange={handleChange} className="mt-0 p-2 w-full border rounded-lg focus:outline-blue-500"/>
            </div>
            <div className="flex flex-col ml-2">
              <label className="block font-medium">*Purpose of Visit</label>
              <input type="text" required placeholder="Purpose of Visit" name="purposeOfVisit" value={formData.purposeOfVisit} onChange={handleChange} className="mt-0 p-2 w-full border rounded-lg focus:outline-blue-500"/>
            </div>

          </div>
          <div className="flex flex-col">
            <div className="flex flex-col">
              <label className="block font-medium">Additional Guest Names</label>
              <textarea rows="2"  placeholder="Additional Guest Names" name="additionalGuestNames" value={formData.additionalGuestNames} onChange={handleChange} className="mt-0 p-2 w-full border rounded-lg focus:outline-blue-500"></textarea>
            </div>

            <div className="flex flex-col">
              <label className="block font-medium">Additional Request</label>
              <textarea rows="2" placeholder="Additional Requests" name="additionalRequests" value={formData.additionalRequests} onChange={handleChange} className="mt-0 p-2 w-full border rounded-lg focus:outline-blue-500"></textarea>
            </div>

          </div>
          
          <div class=" flex justify-between mt-3">
            <button type="reset" className="px-6 py-2 ml-48 bg-gray-300 rounded-xl hover:bg-gray-400">Clear</button>
            <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600">Submit</button>
          </div>
          

        </form>



      </div>      

      </div>
    </div>
    
<<<<<<< HEAD
>>>>>>> 07c25747cd639ac7289eb18de540cf27e72319d2
=======
>>>>>>> 07c25747cd639ac7289eb18de540cf27e72319d2
  );
};



export default GuestReigster;
