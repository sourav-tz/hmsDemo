import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useForm, Controller } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import axios from 'axios';
import { useSelector } from "react-redux";

const UploadNoticeSA = () => {

  const { register, handleSubmit, control, formState: { errors } } = useForm(
    {
      mode: 'onBlur',
      defaultValues: {
        title: '',
        notice: null
      }
    }
  );

  const userData = useSelector(state => state.userStorage.data);

  useEffect(() => {
    console.log(userData);
  }, [])



  const onSubmit = (data) => {
    console.log(data.notice[0])

    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('file', data.notice[0]);

      // console.log("USER DATA_>",userData);
      const res = axios({
        method: 'post',
        url: import.meta.env.VITE_BASE_URL + '/SA/addnotice',
        data: formData,
        // tokenHostelNo:userData.hostelNo,
        headers: {
          "Content-Type": "multipart/form-data; boundary=${formData.getBoundary()}",
          "x-rapidapi-host": "file-upload8.p.rapidapi.com",
          "x-rapidapi-key": "af582c969cmshc0186c63f1e9d28p10fbf5jsn1a1c05604d94",
        },
        withCredentials: true
      });
      toast.promise(res, {
        pending: 'Uploading...',
        success: 'Notice Uploaded',
        error: 'Error Uploading Notice'
      });
    } catch (err) {
      console.log(err);
      toast.error('Error Uploading Notice');

    }


  }




  return (
    <>
      <div className='flex flex-col min-h-screen  bg-gray-100 w-full justify-start py-10 items-center'>
        <div className=''>
          <h1 className='text-3xl font-semibold max-md:mt-16' >Super Admin Upload Notice</h1>
          <p className='text-gray-500'>Please upload the notice in pdf format</p>
        </div>
        <div className="max-sm:pl-72 max-md:pl-40">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-col w-[600px] gap-4 mt-6'>
              <div className='flex flex-col gap-2'>
                <label className=' text-sm font-semibold'>Notice Title</label>
                <Input {...register("title", { required: { value: true, message: 'Title is required' } })} className="w-full max-w-lg" name="title" placeholder='Enter Title' />
              </div>
              <p className='text-red-500 text-sm'>{errors.title && errors.title.message}</p>
              <div className='flex flex-col gap-2'>
                <label className='text-sm font-semibold'>Upload Notice</label>
                <Input {...register("notice", { required: { value: true, message: 'Notice is required', } })} className="w-full max-w-lg" type='file' name="notice" />
                <p className='text-red-500 text-sm'>{errors.notice && errors.notice.message}</p>
              </div>
              <Button className="bg-blue-700 hover:bg-blue-500 w-full max-w-lg" >Upload</Button>
            </div>
          </form>
        </div>

      </div>
      <ToastContainer />
      <DevTool control={control} placement="top-right" />
    </>
  )
}

export default UploadNoticeSA;
// - make upload page with a form to upload notice in pdf form
// apply check if not pdf then show error with toastify
// make drag drop area to upload pdf

