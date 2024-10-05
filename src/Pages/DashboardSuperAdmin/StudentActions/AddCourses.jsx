import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import axios from "axios"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { useForm, Controller } from 'react-hook-form';
import { DevTool } from "@hookform/devtools"
import { useRef } from 'react';
import { ToastContainer, toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import { ImBin } from "react-icons/im";




export default function AddCourses() {
  const [courses, setCourses] = useState([
    {
      "courseId": 1,
      "courseName": "B.Tech",
      "department": "CSE",
      "specialization": "",
      "courseDuration": 4,
      "lastUpdatedBy": "Admin",
      "createdAt": "2022-10-10",
      "updatedAt": "2022-10-10",
      "deletedAt": null,
      "active": true
    },
  ]);
  const { register, control, handleSubmit, formState: { errors }, reset } = useForm(
    {
      mode: "all",

    }
  );


  const editForm = useRef(null);

  const initialLoad = async () => {
    try {
      const res = await axios({
        method: 'get',
        url: import.meta.env.VITE_BASE_URL + '/SA/getCourses',
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true

      });
      console.log(res);
      setCourses(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    initialLoad();
  }
    , [])




  const onSubmitEdit = async (data) => {
    console.log(data);
    const checkCourseExists = (data) => {
      const { courseName, department, specialization } = data;

      return courses.some((course) => {
        return (
          course.courseName.trim().toLowerCase() === courseName.trim().toLowerCase() &&
          course.department.trim().toLowerCase() === department.trim().toLowerCase() &&
          course.specialization.trim().toLowerCase() === specialization.trim().toLowerCase()
        );
      });
    };

    const exists = checkCourseExists(data);
    if (exists === true) {
      toast.error("Course with same specialization exist already");
      return;
    }

    else {


      try {
        const res = await axios({
          method: 'patch',
          url: import.meta.env.VITE_BASE_URL + '/SA/updateCourse',
          data: {
            "courseId": data.courseId,
            "courseName": data.courseName,
            "department": data.department,
            "specialization": data.specialization,
            "courseDuration": data.courseDuration,
          },
          headers: {
            "Content-Type": "application/json"
          },
          withCredentials: true

        });
        console.log(res);
        initialLoad();
        toast.success("Course updated successfully");
      } catch (err) {
        console.log(err);
        toast.error("Failed to update course");
      }
    }
  }

  const setDefaultValues = (course) => {
    reset({
      courseId: course.courseId,
      courseName: course.courseName,
      department: course.department,
      specialization: course.specialization,
      courseDuration: course.courseDuration,
      isActive: course.active
    });
  }


  const deleteCourse = async (courseId) => {
    try {
      const res = await axios({
        method: 'delete',
        url: import.meta.env.VITE_BASE_URL + '/SA/removeCourse',
        params: {
          "courseId": courseId,
          softdelete: true
        },
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true

      });
      console.log(res);
      initialLoad();
      toast.success("Course deleted successfully");
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete course");
    }
  }

  return (
    <div className="container mx-auto py-8 px-8 md:px-6">
      <div className="flex flex-col justify-center items-center gap-8">
        <div className="w-[600px]">
          <h1 className="text-2xl font-bold mb-4 text-center text-blue-700">Manage Courses</h1>
          <Card>
            <CardHeader>
              <CardTitle>Add New Course</CardTitle>
            </CardHeader>
            <CardContent>
              <MyForm />
            </CardContent>
          </Card>
        </div>
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Course List</h2>
            <Button size="sm" className="bg-blue-700 hover:bg-blue-500">Export to CSV</Button>
          </div>
          <Card className="">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Last Updated By</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Last Updated At</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>

                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>{course.courseId}</TableCell>
                    <TableCell>{course.courseName}</TableCell>
                    <TableCell>{course.department}</TableCell>
                    <TableCell>{course.specialization}</TableCell>
                    <TableCell>{course.courseDuration}</TableCell>
                    <TableCell>{course.lastUpdatedBy}</TableCell>
                    <TableCell>{course.createdAt}</TableCell>
                    <TableCell>{course.updatedAt}</TableCell>
                    <TableCell>
                      <Badge variant={course.active ? "success" : "danger"}>
                        {course.active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex justify-center items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="mt-2" onClick={() => setDefaultValues(course)} variant="outline">Edit</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>Edit Course</DialogTitle>
                            <DialogDescription>Update the details of the selected course.</DialogDescription>
                          </DialogHeader>
                          <form ref={editForm} onSubmit={handleSubmit(onSubmitEdit)}>
                            <div className="grid gap-6 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right" htmlFor="courseId">
                                  Course ID
                                </Label>
                                <Input {...register("courseId")} name="courseId" className="col-span-3" disabled id="courseId" value={course.courseId} />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right" htmlFor="courseName">
                                  Course Name
                                </Label>
                                <Input
                                  {...register("courseName", {
                                    required: { value: true, message: "Course name is required" }, // Provide a value for the 'message' property
                                  })}
                                  name="courseName"
                                  className="col-span-3"
                                  defaultValue={course.courseName}
                                  id="courseName"
                                />
                                <p className="col-span-4 text-red-500 text-sm text-right">{errors.courseName?.message}</p>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right" htmlFor="department">
                                  Department
                                </Label>
                                <Input {...register("department", {
                                  required: { value: true, message: "Department is required" }, // Provide a value for the 'message' property
                                })} name="department" className="col-span-3" defaultValue={course.department} id="department" />
                                <p className="col-span-4 text-red-500 text-sm text-right">{errors.department?.message}</p>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right" htmlFor="specialization">
                                  Specialization
                                </Label>
                                <Input {...register("specialization")} name="specialization" className="col-span-3" defaultValue={course.specialization} id="specialization" />
                                <p className="col-span-4 text-red-500 text-sm text-right">{errors.specialization?.message}</p>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right" htmlFor="courseDuration">
                                  Course Duration
                                </Label>
                                <Input {...register("courseDuration", {
                                  required: { value: true, message: "Course duration is required" }, // Provide a value for the 'message' property

                                })} name="courseDuration" className="col-span-3" defaultValue={course.courseDuration} type="number" />
                                <p className="col-span-4 text-red-500 text-sm text-right">{errors.courseDuration?.message}</p>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right" htmlFor="isActive">
                                  Active
                                </Label>
                                <div className="col-span-3">
                                  <Controller
                                    name="isActive"
                                    control={control}
                                    render={({ field }) => (
                                      <Switch
                                        defaultChecked={field.value}
                                        onCheckedChange={(e) => { field.onChange(e) }}
                                        {...field}
                                      />
                                    )}
                                  />
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <div>
                                <DialogTrigger asChild>
                                  <Button type="button" onClick={() => { reset(); }} variant="outline">Cancel</Button>
                                </DialogTrigger>
                              </div>
                              <div>
                                <Button type="submit" className="bg-blue-700 hover:bg-blue-500">Save Changes</Button>
                              </div>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="mt-2 bg-red-500 hover:bg-red-400" onClick={() => { console.log("Delete") }}><ImBin /></Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Course</DialogTitle>
                            <DialogDescription>Are you sure you want to delete this course?</DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <DialogTrigger asChild>
                              <Button onClick={() => deleteCourse(course.courseId)} className="bg-red-500 hover:bg-red-400">Delete</Button>
                            </DialogTrigger>
                            <DialogTrigger asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogTrigger>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}

              </TableBody>
            </Table>
          </Card>

        </div>
      </div>
      <DevTool control={control} />
    </div>
  )
}


const MyForm = () => {

  const initialLoad = async () => {
    try {
      const res = await axios({
        method: 'get',
        url: import.meta.env.VITE_BASE_URL + '/SA/getCourses',
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true

      });
      console.log(res);
      setCourses(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handlePress);
    return () => {
      window.removeEventListener("onPress", handlePress);
    };
  }, []);

  const { register, control, handleSubmit, formState: { errors }, reset } = useForm(
    {
      mode: "all",

    }
  );

  const handlePress = (e) => {
    if (e.key === "Escape") {
      reset();
    }
  }

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const res = await axios({
        method: 'post',
        url: import.meta.env.VITE_BASE_URL + '/SA/addCourse',
        data: {
          "courseName": data.courseName,
          "department": data.department,
          "specialization": data.specialization,
          "courseDuration": data.courseDuration
        },
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true

      });
      console.log(res);
      await initialLoad();
      reset();
      toast.success("Course added successfully");
    } catch (err) {
      console.log(err);
      toast.error("Failed to add course");
    }


  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Course Name</Label>
            <Input {...register("courseName",
              {
                required: { value: true, message: 'Course name is required' }
              }
            )} name="courseName" id="courseName" placeholder="Enter course name" />
            <p className="text-red-500 text-sm">{errors.courseName?.message}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input {...register("department",
              {
                required: { value: true, message: 'Department is required' }
              }
            )} name="department" id="department" placeholder="Enter department" />
            <p className="text-red-500 text-sm">{errors.department?.message}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="specialization">Specialization</Label>
            <Input {...register("specialization", {
              required: { value: true, message: 'Specialization is required' }
            })} name="specialization" id="specialization" placeholder="Enter specialization" />
            <p className="text-red-500 text-sm">{errors.specialization?.message}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Course Duration</Label>
            <Input {...register("courseDuration", {
              required: { value: true, message: 'Course duration is required' },
              min: { value: 1, message: 'minimum must be 1 year' },
              max: { value: 8, message: 'maximum must be 8 years' }
            })} name="courseDuration" id="duration" type="number" min="0" placeholder="Enter course duration" />
            <p className="text-red-500 text-sm">{errors.courseDuration?.message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Button type="button" onClick={() => { reset() }} className="justify-self-end bg-red-700 hover:bg-red-500" >
            Cancel
          </Button>

          <Button className="justify-self-end bg-blue-700 hover:bg-blue-500" type="submit">
            Add Course
          </Button>
        </div>
      </form>
      {/* <DevTool control={control} placement="top-center"/> */}
      <ToastContainer />
    </>
  )
}
