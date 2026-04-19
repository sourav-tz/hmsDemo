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
import backgroundImage from '../../../Assets/hostel11.jpg';

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
  //Sourav
  const initialLoad = async () => {
    try {
      const res = await axios({
        method: 'get',
        url: import.meta.env.VITE_BASE_URL + '/SA/getCourses',
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      });

      // Directly set all courses (active + inactive)
      setCourses(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  //
  useEffect(() => {
    initialLoad();
  }
    , [])




  const onSubmitEdit = async (data) => {
    console.log("Edit form data:", data);

    //  Fixed duplicate check
    const checkSpecializationExists = (data) => {
      const { courseId, specialization } = data;

      // If specialization is empty or "NA"... no need to check duplicates
      if (!specialization || specialization.trim() === "" || specialization.trim().toLowerCase() === "na") {
        return false;
      }

      return courses.some((course) => {
        return (
          course.courseId !== courseId && // Don't compare with itself
          course.specialization && // Ensure specialization exists
          course.specialization.trim().toLowerCase() === specialization.trim().toLowerCase()
        );
      });
    };

    const specializationExists = checkSpecializationExists(data);
    if (specializationExists) {
      toast.error("Course with same specialization already exists");
      return;
    }

    try {
      // Send courseDuration as number
      const updateData = {
        "courseId": data.courseId,
        "courseName": data.courseName,
        "department": data.department,
        "specialization": data.specialization || "NA", // Handle empty specialization
        "courseDuration": Number(data.courseDuration) // Convert to number
      };

      console.log("Sending update:", updateData);

      const res = await axios({
        method: 'patch',
        url: import.meta.env.VITE_BASE_URL + '/SA/updateCourse',
        data: updateData,
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      });

      console.log("Update result:", res);

      // Handle active/inactive status
      if (data.isActive === true && !courses.find(c => c.courseId === data.courseId)?.active) {
        // If changing from inactive to active
        await axios({
          method: 'post',
          url: import.meta.env.VITE_BASE_URL + '/SA/enableCourse',
          data: { "courseId": data.courseId },
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        });
        console.log("Course enabled");
      }
      else if (data.isActive === false && courses.find(c => c.courseId === data.courseId)?.active) {
        // If changing from active to inactive
        await axios({
          method: 'delete',
          url: `${import.meta.env.VITE_BASE_URL}/SA/removeCourse`,
          params: { courseId: data.courseId },
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        });
        console.log("Course disabled");
      }

      await initialLoad();
      toast.success("Course updated successfully");

    } catch (err) {
      console.log("Error updating course:", err);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || "Failed to update course";
      toast.error(errorMsg);
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

  const recalculateSerialNumbers = (updatedCourses) => {
    return updatedCourses.map((course, index) => ({
      ...course,
      serialNumber: index + 1,
    }));
  };

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

      // Step 1: Filter out the deleted course
      const updatedCourses = courses.filter(course => course.courseId !== courseId);

      // Step 2: Recalculate serial numbers
      const recalculatedCourses = recalculateSerialNumbers(updatedCourses);

      // Step 3: Update the state with the new list
      setCourses(recalculatedCourses);

      toast.success("Course deleted successfully");
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete course");
    }
  };


  return (
    <div className="relative min-h-screen w-full flex flex-col justify-start py-10 items-center">
      {/* Background Image Layer */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-center bg-cover bg-no-repeat bg-fixed blur-sm opacity-50 z-[-1]"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="container mx-auto py-8 px-4 sm:px-8">
        <div className="flex flex-col justify-center items-center gap-8">
          {/* Add New Course Section */}
          <div className="w-full lg:w-[600px] ">
            <h1 className="text-2xl font-bold mb-4 text-center text-blue-700">Manage Courses</h1>
            <Card className="rounded-[30px] shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white/30">
              <CardHeader>
                <CardTitle>Add New Course</CardTitle>
              </CardHeader>
              <CardContent>
                <MyForm />
              </CardContent>
            </Card>
          </div>

          {/* Course List Section */}
          <div className="w-[90%]">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Course List</h2>
              <Button size="sm" className="bg-blue-700 hover:bg-blue-500 mt-2 sm:mt-0">Export to CSV</Button>
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
                    <TableHead>Active</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course.courseId}>
                      <TableCell>{course.courseId}</TableCell>
                      <TableCell>{course.courseName}</TableCell>
                      <TableCell>{course.department}</TableCell>
                      <TableCell>{course.specialization}</TableCell>
                      <TableCell>{course.courseDuration}</TableCell>
                      <TableCell>
                        <Badge variant={course.active ? "success" : "secondary"}>  {/* sourav */}
                          {course.active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="flex justify-center items-center gap-2">
                        {/* Edit Course Dialog */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              className="mt-2"
                              onClick={() => setDefaultValues(course)}
                              variant="outline"
                            >
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                              <DialogTitle>Edit Course</DialogTitle>
                              <DialogDescription>
                                Update the details of the selected course.
                              </DialogDescription>
                            </DialogHeader>
                            <form ref={editForm} onSubmit={handleSubmit(onSubmitEdit)}>
                              <div className="grid gap-6 py-4">
                                {/* Course ID */}
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label className="text-right" htmlFor="courseId">
                                    Course ID
                                  </Label>
                                  <Input
                                    {...register("courseId")}
                                    name="courseId"
                                    className="col-span-3"
                                    disabled
                                    id="courseId"
                                    value={course.courseId}
                                  />
                                </div>

                                {/* Course Name */}
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label className="text-right" htmlFor="courseName">
                                    Course Name
                                  </Label>
                                  <Input
                                    {...register("courseName", {
                                      required: { value: true, message: "Course name is required" },
                                    })}
                                    name="courseName"
                                    className="col-span-3"
                                    defaultValue={course.courseName}
                                    id="courseName"
                                  />
                                  <p className="col-span-4 text-red-500 text-sm text-right">
                                    {errors.courseName?.message}
                                  </p>
                                </div>

                                {/* Department */}
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label className="text-right" htmlFor="department">
                                    Department
                                  </Label>
                                  <Input
                                    {...register("department", {
                                      required: { value: true, message: "Department is required" },
                                    })}
                                    name="department"
                                    className="col-span-3"
                                    defaultValue={course.department}
                                    id="department"
                                  />
                                  <p className="col-span-4 text-red-500 text-sm text-right">
                                    {errors.department?.message}
                                  </p>
                                </div>

                                {/* Specialization */}
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label className="text-right" htmlFor="specialization">
                                    Specialization
                                  </Label>
                                  <Input
                                    {...register("specialization")}
                                    name="specialization"
                                    className="col-span-3"
                                    defaultValue={course.specialization}
                                    id="specialization"
                                  />
                                  <p className="col-span-4 text-red-500 text-sm text-right">
                                    {errors.specialization?.message}
                                  </p>
                                </div>

                                {/* Course Duration */}
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label className="text-right" htmlFor="courseDuration">
                                    Course Duration
                                  </Label>
                                  <Input
                                    {...register("courseDuration", {
                                      required: { value: true, message: "Course duration is required" },
                                    })}
                                    name="courseDuration"
                                    className="col-span-3"
                                    defaultValue={course.courseDuration}
                                    type="number"
                                  />
                                  <p className="col-span-4 text-red-500 text-sm text-right">
                                    {errors.courseDuration?.message}
                                  </p>
                                </div>

                                {/* Is Active Switch */}
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
                                          onCheckedChange={(e) => {
                                            field.onChange(e);
                                          }}
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
                                    <Button
                                      type="button"
                                      onClick={() => {
                                        reset();
                                      }}
                                      variant="outline"
                                    >
                                      Cancel
                                    </Button>
                                  </DialogTrigger>
                                </div>
                                <div>
                                  <Button
                                    type="submit"
                                    className="bg-blue-700 hover:bg-blue-500"
                                  >
                                    Save Changes
                                  </Button>
                                </div>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>

                        {/* Delete Course Dialog */}
                        {/* Toggle Active / Inactive Confirmation */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              className={`mt-2 ${course.active ? 'bg-yellow-500 hover:bg-yellow-400' : 'bg-green-600 hover:bg-green-500'}`}
                            >
                              {course.active ? 'Deactivate' : 'Activate'}
                            </Button>
                          </DialogTrigger>

                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                {course.active ? 'Deactivate Course' : 'Activate Course'}
                              </DialogTitle>
                              <DialogDescription>
                                {course.active
                                  ? 'Are you sure you want to deactivate this course?'
                                  : 'Are you sure you want to activate this course?'}
                              </DialogDescription>
                            </DialogHeader>

                            <DialogFooter>
                              <DialogTrigger asChild>
                                <Button
                                  className={`${course.active ? 'bg-yellow-500 hover:bg-yellow-400' : 'bg-green-600 hover:bg-green-500'}`}
                                  onClick={async () => {
                                    try {
                                      if (course.active) {
                                        // Soft delete (deactivate)
                                        await axios.delete(`${import.meta.env.VITE_BASE_URL}/SA/removeCourse`, {
                                          params: { courseId: course.courseId, softdelete: false },
                                          withCredentials: true,
                                        });
                                        toast.info("Course marked as inactive");
                                      } else {
                                        // Restore (activate)
                                        await axios.post(`${import.meta.env.VITE_BASE_URL}/SA/enableCourse`, {
                                          courseId: course.courseId,
                                        }, { withCredentials: true });
                                        toast.success("Course activated successfully");
                                      }

                                      await initialLoad();
                                    } catch (err) {
                                      console.error(err);
                                      toast.error("Failed to update course status");
                                    }
                                  }}
                                >
                                  Confirm
                                </Button>
                              </DialogTrigger>

                              <DialogTrigger asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogTrigger>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        {/*end*/}
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
    if (data.specialization === '') {
      data.specialization = "NA";
    }

    try {
      const res = await axios({
        method: 'post',
        url: import.meta.env.VITE_BASE_URL + '/SA/addCourse',
        data: {
          "courseName": data.courseName,
          "department": data.department,
          "specialization": data.specialization || "NA",
          "courseDuration": data.courseDuration
        },
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      });

      reset();
      await initialLoad();
      toast.success(res.data.msg || "Course added successfully");

    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.msg || "Failed to add course";
      toast.error(errorMsg);
    }


  };


  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        {/* Grid layout for input fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Course Name Field */}
          <div className="space-y-2">
            <Label htmlFor="courseName">Course Name</Label>
            <Input
              {...register("courseName", {
                required: { value: true, message: "Course name is required" },
              })}
              name="courseName"
              id="courseName"
              placeholder="Enter course name"
            />
            <p className="text-red-500 text-sm">{errors.courseName?.message}</p>
          </div>

          {/* Department Field */}
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input
              {...register("department", {
                required: { value: true, message: "Department is required" },
              })}
              name="department"
              id="department"
              placeholder="Enter department"
            />
            <p className="text-red-500 text-sm">{errors.department?.message}</p>
          </div>
        </div>

        {/* Grid layout for specialization and duration fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Specialization Field */}
          <div className="space-y-2">
            <Label htmlFor="specialization">Specialization</Label>
            <Input
              {...register("specialization", {
                required: { value: false, message: "Specialization is required" },
              })}
              name="specialization"
              id="specialization"
              placeholder="Enter specialization"
            />
            <p className="text-red-500 text-sm">{errors.specialization?.message}</p>
          </div>

          {/* Course Duration Field */}
          <div className="space-y-2">
            <Label htmlFor="courseDuration">Course Duration</Label>
            <Input
              {...register("courseDuration", {
                required: { value: true, message: "Course duration is required" },
                min: { value: 1, message: "Minimum must be 1 year" },
                max: { value: 8, message: "Maximum must be 8 years" },
              })}
              name="courseDuration"
              id="courseDuration"
              type="number"
              placeholder="Enter course duration"
            />
            <p className="text-red-500 text-sm">{errors.courseDuration?.message}</p>
          </div>
        </div>

        {/* Button container with responsive flex layout */}
        <div className="flex flex-col md:flex-row justify-end gap-4">
          <Button
            type="button"
            onClick={() => { reset(); }}
            className="justify-self-end bg-red-700 hover:bg-red-500 w-full md:w-auto"
          >
            Cancel
          </Button>

          <Button
            className="justify-self-end bg-blue-700 hover:bg-blue-500 w-full md:w-auto"
            type="submit"
          >
            Add Course
          </Button>
        </div>
      </form>

      {/* Uncomment to include DevTool */}
      {/* <DevTool control={control} placement="top-center"/> */}

      <ToastContainer />
    </>

  )
}