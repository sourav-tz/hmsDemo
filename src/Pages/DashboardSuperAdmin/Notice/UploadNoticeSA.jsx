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
        notice: null,
        // Bug fix by Ravi: Bug 23 - description field was missing from notice creation form
        description: '',
        // Bug fix by Ravi: Bug 12 - audience targeting was missing; SA always created global notices
        audience: 'all',
        // Bug fix by Ravi: Bug 26 - priority field missing for notice urgency
        priority: 'medium',
        // Bug fix by Ravi: Bug 26 - expiresAt field missing for notice expiry
        expiresAt: '',
      }
    }
  );

  const userData = useSelector(state => state.userStorage.data);

  // Bug fix by Ravi: Bug 12 - fetch hostel list so SA can target specific hostels
  const [hostels, setHostels] = useState([]);

  useEffect(() => {
    console.log(userData);
    // Bug fix by Ravi: Bug 12 - load hostels for audience targeting dropdown
    axios.get(import.meta.env.VITE_BASE_URL + '/SA/getHostels', { withCredentials: true })
      .then(r => setHostels(r.data || []))
      .catch(() => setHostels([]));
  }, [])



  const onSubmit = (data) => {
    console.log(data.notice[0])

    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('file', data.notice[0]);
      // Bug fix by Ravi: Bug 23 - append description to form data
      if (data.description) formData.append('description', data.description);
      // Bug fix by Ravi: Bug 12/13/25 - append audience so backend can target specific hostel(s) or category
      formData.append('audience', data.audience || 'all');
      // Bug fix by Ravi: Bug 26 - append priority and expiresAt for rich notice workflow
      formData.append('priority', data.priority || 'medium');
      if (data.expiresAt) formData.append('expiresAt', data.expiresAt);

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
          <p className='text-gray-500'>Please upload the notice in PDF, JPG, JPEG, or PNG format</p>
        </div>
        <div className="max-sm:pl-72 max-md:pl-40">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-col w-[600px] gap-4 mt-6'>
              <div className='flex flex-col gap-2'>
                <label className=' text-sm font-semibold'>Notice Title</label>
                <Input {...register("title", { required: { value: true, message: 'Title is required' } })} className="w-full max-w-lg" name="title" placeholder='Enter Title' />
              </div>
              <p className='text-red-500 text-sm'>{errors.title && errors.title.message}</p>

              {/* Bug fix by Ravi: Bug 23 - description field was missing from notice creation */}
              <div className='flex flex-col gap-2'>
                <label className='text-sm font-semibold'>Description (optional)</label>
                <Textarea {...register("description")} className="w-full max-w-lg" placeholder='Enter notice description' />
              </div>

              {/* Bug fix by Ravi: Bug 12/13/25 - audience targeting was missing; SA could only create global notices */}
              <div className='flex flex-col gap-2'>
                <label className='text-sm font-semibold'>Target Audience</label>
                <Controller
                  name="audience"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-full max-w-lg">
                        <SelectValue placeholder="Select audience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Hostels (Global)</SelectItem>
                        {/* Bug fix by Ravi: Bug 25 - Boys/Girls hostel category targeting was missing */}
                        <SelectItem value="boys">Boys Hostels Only</SelectItem>
                        <SelectItem value="girls">Girls Hostels Only</SelectItem>
                        {/* Bug fix by Ravi: Bug 13 - individual hostel targeting; single hostelNo sent as audience value */}
                        {hostels.map(h => (
                          <SelectItem key={h.hostelNo} value={String(h.hostelNo)}>
                            H{h.hostelNo} — {h.hostelName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Bug fix by Ravi: Bug 26 - priority field missing for notice urgency */}
              <div className='flex flex-col gap-2'>
                <label className='text-sm font-semibold'>Priority</label>
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-full max-w-lg">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Bug fix by Ravi: Bug 26 - expiresAt field missing for auto-expiring notices */}
              <div className='flex flex-col gap-2'>
                <label className='text-sm font-semibold'>Expiry Date (optional)</label>
                <Input {...register("expiresAt")} className="w-full max-w-lg" type='date' name="expiresAt" />
              </div>

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
