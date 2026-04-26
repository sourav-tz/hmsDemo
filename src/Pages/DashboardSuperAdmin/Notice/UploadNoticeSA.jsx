import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useForm, Controller } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import axios from 'axios';

const UploadNoticeSA = () => {
  const [hostels, setHostels] = useState([]);
  const [hostelFetchError, setHostelFetchError] = useState('');

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm(
    {
      mode: 'onBlur',
      defaultValues: {
        title: '',
        details: '',
        notice: null,
        isGlobal: 'true',
        hostelNo: ''
      }
    }
  );

  const isGlobalNotice = watch('isGlobal') === 'true';

  useEffect(() => {
    const getHostels = async () => {
      try {
        setHostelFetchError('');

        const primaryUrl = (import.meta.env.VITE_BASE_URL || '') + '/SA/getHostels';
        let res;
        try {
          res = await axios({
            method: 'get',
            url: primaryUrl,
            withCredentials: true,
          });
        } catch (primaryError) {
          res = await axios({
            method: 'get',
            url: '/SA/getHostels',
            withCredentials: true,
          });
        }

        if (!Array.isArray(res.data)) {
          throw new Error(res?.data?.message || 'Invalid hostel response');
        }

        const activeHostels = res.data.filter((hostel) => hostel.active);
        setHostels(activeHostels);
      } catch (err) {
        console.log(err);
        const message = err?.response?.data?.message || err?.message || 'Unable to fetch hostels';
        setHostelFetchError(message);
        toast.error(`Unable to fetch hostels: ${message}`);
      }
    };

    getHostels();
  }, []);


  const onSubmit = (data) => {
    console.log(data.notice[0])
    if (data.isGlobal === 'false' && !data.hostelNo) {
      toast.error('Please select a hostel for hostel-specific notice');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('details', data.details || '');
      formData.append('file', data.notice[0]);
      formData.append('isGlobal', data.isGlobal);
      if (data.isGlobal === 'false' && data.hostelNo) {
        formData.append('hostelNo', data.hostelNo);
      }

      // console.log("USER DATA_>",userData);
      const res = axios({
        method: 'post',
        url: import.meta.env.VITE_BASE_URL + '/SA/addNotice',
        data: formData,
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
                <label className='text-sm font-semibold'>Notice Details</label>
                <Textarea
                  {...register("details")}
                  className="w-full max-w-lg min-h-[120px]"
                  placeholder='Write notice details'
                />
              </div>
              <div className='flex flex-col gap-2'>
                <label className='text-sm font-semibold'>Notice Audience</label>
                <Controller
                  name="isGlobal"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full max-w-lg">
                        <SelectValue placeholder="Select audience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">All Hostels</SelectItem>
                        <SelectItem value="false">Specific Hostel</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              {!isGlobalNotice ? (
                <div className='flex flex-col gap-2'>
                  <label className='text-sm font-semibold'>Select Hostel</label>
                  <Controller
                    name="hostelNo"
                    control={control}
                    rules={{
                      validate: (value) => {
                        if (watch('isGlobal') === 'false' && !value) return 'Hostel is required';
                        return true;
                      }
                    }}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full max-w-lg">
                          <SelectValue placeholder="Choose a hostel" />
                        </SelectTrigger>
                        <SelectContent>
                          {hostels.map((hostel) => (
                            <SelectItem key={hostel.hostelNo} value={String(hostel.hostelNo)}>
                              H{hostel.hostelNo} - {hostel.hostelName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <p className='text-red-500 text-sm'>{errors.hostelNo && errors.hostelNo.message}</p>
                  {hostelFetchError ? <p className='text-red-500 text-sm'>{hostelFetchError}</p> : null}
                </div>
              ) : null}
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
