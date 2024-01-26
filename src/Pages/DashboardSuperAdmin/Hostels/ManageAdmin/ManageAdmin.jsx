import React, { useState } from 'react';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    email: '',
    hostelNumber: '',
    role: '',
  });
  const [registrations, setRegistrations] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = () => {
    // You can perform any additional validation here before displaying the data
    setRegistrations([...registrations, formData]);
    setFormData({
      name: '',
      mobileNumber: '',
      email: '',
      hostelNumber: '',
      role: '',
    });
  };

  const generateRandomPassword = () => {
    // You can implement logic to generate a random password here
    // For simplicity, let's generate a random string of length 8
    const randomPassword = Math.random().toString(36).slice(-8);
    setFormData({ ...formData, password: randomPassword });
  };

  return (
    <div className="flex justify-center items-center h-screen max-w">
      <div className="grid grid-cols-1 gap-8 w-full max-w-md p-8 bg-gray-100 rounded-md">
        {/* First Div */}
        <div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Name"
            className="w-full px-3 py-2 mb-2 border rounded"
          />
          <input
            type="text"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleInputChange}
            placeholder="Mobile Number"
            className="w-full px-3 py-2 mb-2 border rounded"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="w-full px-3 py-2 mb-2 border rounded"
          />
          <div className="flex mb-2">
            <select
              name="hostelNumber"
              value={formData.hostelNumber}
              onChange={handleInputChange}
              className="w-1/2 px-3 py-2 mr-2 border rounded"
            >
              <option value="" disabled selected>
                Select Hostel
              </option>
              {/* Add hostel options */}
            </select>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-1/2 px-3 py-2 ml-2 border rounded"
            >
              <option value="" disabled selected>
                Select Role
              </option>
              {/* Add role options */}
            </select>
          </div>
          <div className="flex">
            <input
              type="text"
              name="password"
              value={formData.password || ''}
              readOnly
              placeholder="Random Password"
              className="w-3/4 px-3 py-2 mb-2 border rounded"
            />
            <button
              onClick={generateRandomPassword}
              className="w-1/4 px-2 py-2 ml-2 bg-blue-500 text-white rounded"
            >
              Generate
            </button>
          </div>
        </div>

        {/* Second Div */}
        <div>
          {registrations.length > 0 && (
            <div className="mt-4 p-4 bg-gray-100 rounded-md">
              <h2 className="text-lg font-semibold mb-4">Registration Details</h2>
              <div className="grid grid-cols-5 gap-4">
                <div className="font-semibold border-b-2 border-black">Name</div>
                <div className="font-semibold border-b-2 border-black">Mobile Number</div>
                <div className="font-semibold border-b-2 border-black">Email</div>
                <div className="font-semibold border-b-2 border-black">Hostel Number</div>
                <div className="font-semibold border-b-2 border-black">Role</div>

                {registrations.map((registration, index) => (
                  <React.Fragment key={index}>
                    <div className="border-b border-black">{registration.name}</div>
                    <div className="border-b border-black">{registration.mobileNumber}</div>
                    <div className="border-b border-black">{registration.email}</div>
                    <div className="border-b border-black">{registration.hostelNumber}</div>
                    <div className="border-b border-black">{registration.role}</div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-4">
        <button
          onClick={handleRegister}
          className="w-1/2 px-4 py-2 bg-green-500 text-white rounded"
        >
          Register
        </button>
        <button className="w-1/2 px-4 py-2 bg-gray-500 text-white rounded">
          Reset
        </button>
      </div>
    </div>
  );
};

export default RegistrationForm;