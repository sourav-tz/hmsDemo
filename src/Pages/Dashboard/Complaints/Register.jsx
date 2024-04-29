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
} from "@/components/ui/select"


const Register = () => {
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
          <Input placeholder='Enter Subject' />
        </div>
        <div className='flex flex-col gap-2'>
          <label className='text-sm font-semibold'>Tags</label>
          <Select>
            <SelectTrigger>
              <SelectValue>Select Tags</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem>Tag 1</SelectItem>
              <SelectItem>Tag 2</SelectItem>
              <SelectItem>Tag 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='flex flex-col gap-2'>
          <label className='text-sm font-semibold'>Complaint</label>
          <Textarea col="20" row="100" placeholder='Enter Complaint' />
        </div>
        <Button className="bg-blue-700 hover:bg-blue-500">Register</Button>
      </div>
      </form>
    </div>
    
</div>

</>
  )
}

export default Register



