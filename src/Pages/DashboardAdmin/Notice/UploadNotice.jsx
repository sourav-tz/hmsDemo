import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { ToastContainer,toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useForm,Controller } from "react-hook-form";
import { DevTool } from "@hookform/devtools";


const UploadNotice = ()=>{

    const {register,handleSubmit,control} = useForm();




    return(
        <>
        <div className='flex flex-col min-h-screen bg-gray-100 w-full justify-start py-10 items-center'>
            <div className=''>
              <h1 className='text-3xl font-semibold'>Upload Notice</h1>
              <p className='text-gray-500'>Please upload the notice in pdf format</p>
            </div>
            <div>
              <form>
              <div className='flex flex-col w-[600px] gap-4 mt-6'>
                <div className='flex flex-col gap-2'>
                  <label className='text-sm font-semibold'>Notice Title</label>
                  <Input {...register("title")} name="title" placeholder='Enter Title' />
                </div>
                <div className='flex flex-col gap-2'>
                  <label className='text-sm font-semibold'>Notice Description</label>
                  <Textarea {...register("description")} name="description" col="20" row="100" placeholder='Enter Description' />
                </div>
                <div className='flex flex-col gap-2'>
                  <label className='text-sm font-semibold'>Upload Notice</label>
                  <Controller
                    name="notice"
                    control={control}
                    render={({ field }) => <Input type="file" {...field} />}
                    />
                </div>
                <Button className="bg-blue-700 hover:bg-blue-500">Upload</Button>
              </div>
              </form>
            </div>
            
        </div>
        <ToastContainer />
        <DevTool control={control} placement="top-right" />
        </>
    )
}

export default UploadNotice;


// - make upload page with a form to upload notice in pdf form
// apply check if not pdf then show error with toastify
// make drag drop area to upload pdf