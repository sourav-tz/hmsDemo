
import { Tag, Tags } from 'lucide-react';
import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, Controller } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navigate, useNavigate } from 'react-router-dom';

const Register = () => {
  const { register, handleSubmit, formState: { errors, isValid }, control } = useForm({
    mode: 'onChange',
    defaultValues: {
      tag: '',
      subject: '',
      description: '',
      otherTitle: ''
    },
  });
  const navigate = useNavigate();
  const [showOtherTitle, setShowOtherTitle] = useState(false);

  const cleanInput = (value) => value.trim().replace(/\s+/g, ' ');

  const handleTitle = (selectedValue) => {
    setShowOtherTitle(selectedValue === 'other');
  };

  const onSubmit = async (data) => {
    console.log("Data to be sent:", data);
    
    let userData = localStorage.getItem('persist:root');
    const hostelNo = JSON.parse(JSON.parse(userData).userStorage).data.hostelNo;
    console.log(hostelNo);
    const rollNo = JSON.parse(JSON.parse(userData).userStorage).data.rollNo;
    console.log(rollNo);

    const dataToSend = {
      subject: cleanInput(data.subject), 
      tag: data.tag === 'other' ? cleanInput(data.otherTitle) : data.tag, 
      description: cleanInput(data.description), 
      hostelNo: hostelNo ,  
      rollNo : rollNo              
    };

    try {
      const res = await axios({
        method: 'post',
        url: import.meta.env.VITE_BASE_URL + '/student/raiseComplaint',
        data: dataToSend, 
        withCredentials: true
      });
    
      if (res.status === 200) {
        toast.success("Complaint raised successfully");
        navigate('/studentDashboard/complaints/status');
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      if (err.response) {
        toast.error(`Error: ${err.response.data.message || 'Failed to raise complaint.'}`);
      } else {
        toast.error("Network error. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 w-full justify-start py-10 items-center [@media(min-width:100px)]:pt-24 sm:py-16">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-semibold">Register Complaint</h1>
        <p className="text-gray-500">Please fill the form to register a complaint</p>
      </div>
      <div className="w-full max-w-lg px-4 sm:px-6">
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow rounded-lg p-6 sm:p-8">
          <div className="flex flex-col gap-6">

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">
                Subject <span className="text-red-500">*</span>
              </label>
              <Input 
                {...register('subject', { required: 'Subject is required' })}
                placeholder="Enter Subject"
              />
              {errors.subject && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.subject.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">
                Tag <span className="text-red-500">*</span>
              </label>
              <Controller
                name="tag"
                control={control}
                rules={{ required: 'Please select a tag' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    onValueChange={(e) => {
                      field.onChange(e);
                      handleTitle(e);
                    }}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Tag" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electricity">Electricity</SelectItem>
                      <SelectItem value="water">Water</SelectItem>
                      <SelectItem value="internet">Internet</SelectItem>
                      <SelectItem value="carpenter">Carpenter</SelectItem>
                      <SelectItem value="plumber">Plumber</SelectItem>
                      <SelectItem value="cleaning">Cleaning</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.tag && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.tag.message}
                </p>
              )}
            </div>

            {showOtherTitle && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">
                  Other Tag Title <span className="text-red-500">*</span>
                </label>
                <Input 
                  {...register('otherTitle', {
                    required: 'Please provide a title for "Other"'
                  })}
                  placeholder="Enter other tag title"
                />
                {errors.otherTitle && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.otherTitle.message}
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">
                Description <span className="text-red-500">*</span>
              </label>
              <Textarea
                {...register('description', { required: 'Description is required' })}
                className="border p-2 w-full mt-2"
                placeholder="Enter your description"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <Button 
              type="submit"
              className="bg-blue-700 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded"
              disabled={!isValid}
            >
              Register
            </Button>
          </div>
        </form>
      </div>
      <DevTool control={control} placement="top-right" />
    </div>
  );
};

export default Register;

