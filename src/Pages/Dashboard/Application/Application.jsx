import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
const RaiseApplication = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });


  const [isChangingHostel, setIsChangingHostel] = useState(false);
  const [allowAdminEdit, setAllowAdminEdit] = useState(false);
  const [preferredHostelFilled, setPreferredHostelFilled] = useState(false);
  const navigate = useNavigate();

  const cleanInput = (value) => value?.trim();

  const onSubmit = async (data) => {
    if (isChangingHostel && !preferredHostelFilled && !allowAdminEdit) {
      toast.error("Please enter preferred hostel number or allow admin to choose.");
      return;
    }

    const userData = JSON.parse(localStorage.getItem("persist:root"));
    const { hostelNo, rollNo } = JSON.parse(userData.userStorage).data;
    const baseUrl = import.meta.env.VITE_BASE_URL;

    const applicationData = {
      subject: cleanInput(data.subject),
      tag: data.tag === "changingHostel" ? "hostel-change" : data.tag,
      description: cleanInput(data.description),
      hostelNo,
      rollNo,
      preferredHostel: preferredHostelFilled ? cleanInput(data.preferredHostel) : null,
      allowAdminEdit: !preferredHostelFilled ? true : allowAdminEdit,
    };

    try {
      console.log(applicationData);
      const res = await axios.post(`${baseUrl}/student/applications`, applicationData, {
        withCredentials: true,
      });
      console.log(res);

      if (res.status === 201) {
        toast.success("Application submitted successfully!");
        reset();
      } else {
        toast.error("Something went wrong. Try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Network error. Try again.");
    }
  };

  const selectedTag = watch("tag");

  useEffect(() => {
    const preferredHostel = watch("preferredHostel");
    setPreferredHostelFilled(preferredHostel && preferredHostel.trim().length > 0);
  }, [watch("preferredHostel")]);

  const isSubmitEnabled = preferredHostelFilled || allowAdminEdit;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-8 max-w-lg mx-auto bg-white shadow-lg rounded-lg border-2 border-gray-200 mt-12"
    >
      <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">Raise Application</h2>

      {/* Subject Field */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Subject <span className="text-red-500">*</span>
        </label>
        <input
          {...register("subject", { required: "Subject is required" })}
          placeholder="Enter the subject of the application"
          className="border border-gray-300 rounded-lg w-full p-4 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
      </div>

      {/* Application Type Field */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Application Type <span className="text-red-500">*</span>
        </label>
        <select
          {...register("tag", { required: "Application type is required" })}
          onChange={(e) => {
            const tag = e.target.value;
            setValue("tag", tag);
            setIsChangingHostel(tag === "changingHostel");
          }}
          className="border border-gray-300 rounded-lg w-full p-4 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Application Type</option>
          <option value="changingHostel">Changing Hostel</option>
        </select>
        {errors.tag && <p className="text-red-500 text-sm mt-1">{errors.tag.message}</p>}
      </div>

      {/* Description Field */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register("description", { required: "Description is required" })}
          placeholder="Provide detailed information for the application"
          className="border border-gray-300 rounded-lg w-full p-4 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
      </div>

      {/* Preferred Hostel Section */}
      {isChangingHostel && (
        <div className="space-y-4 border-t pt-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Preferred Hostel (Optional)
            </label>
            <p className="text-sm text-gray-500 italic mb-1">
              Hostel will be allocated based on availability.
            </p>
            <select
              {...register("preferredHostel")}
              className="border border-gray-300 rounded-lg w-full p-4 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select a Hostel</option>
              <option value="1">H1 Abhimanyu Bhawan</option>
              <option value="2">H2 Bhishma Bhawan</option>
              <option value="3">H3 Chakradhar Bhawan</option>
              <option value="4">H4 Dronacharya Bhawan</option>
              <option value="5">H5 Eklavya Bhawan</option>
              <option value="6">H6 Fanibhushan Bhawan</option>
              <option value="7">H7 Girivar Bhawan</option>
              <option value="8">H8 Harihar Bhawan</option>
              <option value="9">H9 Indivar Bhawan</option>
              <option value="10">H10 Jagdishwar Bhawan</option>
              <option value="11">H11 Vivekanand Bhawan</option>
              <option value="12">H12 Alaknanda Bhawan (Girls)</option>
              <option value="13">H13 Cauvery Bhawan (Girls)</option>
              <option value="14">H14 Bhagirati Bhawan (Girls)</option>
              <option value="15">H15 Kalpana Chawala Bhawan (Girls)</option>
            </select>
          </div>

          <div className="inline-flex items-center gap-2 mt-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={allowAdminEdit}
              onChange={() => setAllowAdminEdit((prev) => !prev)}
              className="accent-blue-600"
            />
            Allow admin to choose a hostel for me
          </div>

          {/* Error message if neither preferred hostel nor admin edit is selected */}
          {!preferredHostelFilled && !allowAdminEdit && (
            <p className="text-red-500 text-sm mt-2">
              Please enter a preferred hostel or allow the admin to choose.
            </p>
          )}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!isSubmitEnabled}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg mt-6 w-full hover:bg-blue-700 focus:outline-none disabled:opacity-50"
      >
        Submit Application
      </button>
    </form>
  );
};

export default RaiseApplication;
