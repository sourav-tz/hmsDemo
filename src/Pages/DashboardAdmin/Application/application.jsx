import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm, Controller } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import Papa from 'papaparse';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import backgroundImage from '../../../Assets/hostel11.jpg';


const Application = () => {
  const { register, handleSubmit,reset, formState: { errors, isValid }, control, setValue } = useForm({
    mode: 'onChange',
    defaultValues: {
      tag: '',
      subject: '',
      description: '',
      otherTitle: '',
      preferredHostel: ''
    },
  });

  const [showOtherTitle, setShowOtherTitle] = useState(false);
  const [changeHostel, setChangeHostel] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const [showCsvUpload, setShowCsvUpload] = useState(false);

  const handleTitle = (selectedValue) => {
    setShowOtherTitle(selectedValue === 'other');
    setChangeHostel(selectedValue === 'hostel-change-bulk');
    setShowCsvUpload(selectedValue === 'hostel-change-bulk');

    if (selectedValue !== 'hostel-change-bulk') {
      setValue('preferredHostel', '');
    }
    if (selectedValue !== 'other') {
      setValue('otherTitle', '');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
        toast.error("Only CSV files are allowed.");
        return;
      }

      Papa.parse(file, {
        complete: (result) => {
          const rows = result.data.slice(1); // skip header row
          const rollNumbers = rows.map((row) => row[0]).filter(Boolean);
          setCsvData(rollNumbers);
          toast.success(`CSV file processed successfully. ${rollNumbers.length} roll numbers found.`);
        },
        error: (error) => {
          toast.error(`Error parsing CSV file: ${error.message}`);
        },
        header: false,
      });
    }
  };

  const onSubmit = async (data) => {
    const finalData = {
      subject: data.subject,
      description: data.description || "",
      tag: data.tag,
      extraData: {
        hostelNo: data.preferredHostel || "",
        rollNos: csvData,
      },
    };

    try {
      const response = await axios({
        method: "post",
        url: import.meta.env.VITE_BASE_URL + "/HA/applications/bulk-hostel-change",
        data: finalData,
        withCredentials: true,
      });
      console.log(response)
      if (response.status === 201) {
        toast.success("Application submitted successfully!");
        reset();
      } else {
        toast.error(response.data.message || "Failed to submit application.");
      }
    } catch (err) {
      console.error("Error submitting application:", err);
      toast.error(err.response?.data?.message || "Failed to submit application.");
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-start py-10 items-center">
          {/* Background Image Layer */}
          <div
            className="absolute top-0 left-0 w-full h-full bg-center bg-cover bg-no-repeat bg-fixed blur-sm opacity-50 z-[-1]"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
      <div className="text-center mb-6">
        <h1 className="text-3xl text-[#5F57FF]">Application</h1>
        <p className="text-gray-500">Please fill out the form below.</p>
      </div>

      <div className="w-full max-w-lg px-4 sm:px-6 rounded-[30px] shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white/30">
        <form onSubmit={handleSubmit(onSubmit)} className="rounded-lg p-6 sm:p-8">
          <div className="flex flex-col gap-6">
            
            {/* Subject */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">
                Subject <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('subject', { required: 'Subject is required' })}
                placeholder="Enter Subject"
              />
              {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
            </div>

            {/* Tag Selection */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">
                Tag <span className="text-red-500">*</span>
              </label>
              <Controller
                name="tag"
                control={control}
                rules={{ required: 'Please select a tag' }}
                render={({ field }) => (
                  <select
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleTitle(e.target.value);
                    }}
                    value={field.value}
                    className="border p-2 rounded"
                  >
                    <option value="">Select a Tag</option>
                    <option value="hostel-change-bulk">Hostel Change in Bulk</option>
                  </select>
                )}
              />
              {errors.tag && <p className="text-red-500 text-sm mt-1">{errors.tag.message}</p>}
            </div>

            {/* Hostel Change Section */}
            {changeHostel && (
              <>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold">
                    Select Hostel <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="preferredHostel"
                    control={control}
                    rules={{ required: 'Please select a hostel' }}
                    render={({ field }) => (
                      <select {...field} className="border p-2 rounded">
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
                    )}
                  />
                  {errors.preferredHostel && <p className="text-red-500 text-sm mt-1">{errors.preferredHostel.message}</p>}
                </div>
              </>
            )}

            {/* Description / Reason */}
            {changeHostel && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">
                  Description / Reason for Hostel Change <span className="text-red-500">*</span>
                </label>
                <Textarea
                  {...register('description', { required: 'Please provide a description or reason for hostel change' })}
                  className="border p-2 w-full mt-2"
                  placeholder="Enter your description or reason for hostel change"
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
              </div>
            )}

            {/* CSV Upload */}
            {showCsvUpload && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">
                  Upload CSV <span className="text-red-500">*</span>
                </label>
                <Input type="file" accept=".csv" onChange={handleFileUpload} />
                <p className="text-sm text-gray-500 mt-2">
                  Note: The CSV file must only contain roll numbers in the first column (no other data or headers).
                </p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="bg-[#131133] rounded-xl hover:bg-blue-500 w-[30%] transition transform hover:scale-105 duration-300 ease-in-out"
              disabled={!isValid}
            >
              Submit
            </Button>

          </div>
        </form>
      </div>

      {/* DevTool for Debugging */}
      <DevTool control={control} placement="top-right" />

      {/* Toast Notifications */}
      <ToastContainer 
        position="top-right" 
        autoClose={5000} 
        hideProgressBar={false} 
        newestOnTop={true} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />
    </div>
  );
};

export default Application;
