import { Tag, Tags } from 'lucide-react'
import React from 'react'
import { Page } from 'react-pdf'
import {Textarea} from "@/components/ui/textarea";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {useForm,Controller} from 'react-hook-form'

import { DevTool } from '@hookform/devtools';


const Register = () => {

  const {register, handleSubmit,formState:{errors},control} = useForm(
    {
      mode:'onBlur',
      defaultValues:{
        tags:'',
        subject:'',
      }
    }
  );



  return (
<>

<div className='flex flex-col min-h-screen bg-gray-100 w-full justify-start py-10 items-center'>
    <div className=''>
      <h1 className='text-3xl font-semibold'>Register Complaint</h1>
      <p className='text-gray-500'>Please fill the form to register a complaint</p>
    </div>
    <div>
      <form>
      <div className='flex flex-col w-[600px] gap-4 mt-6'>
        <div className='flex flex-col gap-2'>
          <label className='text-sm font-semibold'>Subject</label>
          <Input {...register} placeholder='Enter Subject' />
        </div>
        <div className='flex flex-col gap-2'>
          <label className='text-sm font-semibold'>Tags</label>
          <Controller 
            name='tags'
            control={control}
            render={({field})=>(
              <Select {...field} 
                onValueChange={(e)=>field.onChange(e)}
                value={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a Tag"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electricity">electricity</SelectItem>
                  <SelectItem value="water">water</SelectItem>
                  <SelectItem value="internet">internet</SelectItem>
                  <SelectItem value="carpenter">carpenter</SelectItem>
                  <SelectItem value="plumber">plumber</SelectItem>
                  <SelectItem value="cleaning">cleaning</SelectItem>
                  <SelectItem value="other">other</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className='flex flex-col gap-2'>
          <label className='text-sm font-semibold'>Complaint</label>
          <Textarea col="20" row="100" placeholder='Enter Complaint' />
        </div>
        <Button className="bg-blue-700 hover:bg-blue-500">Register</Button>
      </div>
      </form>
    </div>
    <DevTool control={control} placement='top-right' />
</div>

</>
  )
}

export default Register



