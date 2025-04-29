/**
 * v0 by Vercel.
 * @see https://v0.dev/t/0gRW3DtWS5h
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Input } from "@/components/ui/input";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import React, { useState } from "react";

const passwordValidation = (value) => {
  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumbers = /\d/.test(value);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(value);
  const isValidLength = value.length >= 8;

  let errorMessages = [];

  if (!isValidLength) {
    errorMessages.push("at least 8 characters long");
  }
  if (!hasUpperCase) {
    errorMessages.push("contains at least one uppercase letter [A-Z]");
  }
  if (!hasLowerCase) {
    errorMessages.push("contains at least one lowercase letter [a-z]");
  }
  if (!hasNumbers) {
    errorMessages.push("contains at least one number [0-9]");
  }
  if (!hasSpecialChars) {
    errorMessages.push(
      'contains at least one special character [!@#$%^&*(),.?":{}|<>]'
    );
  }

  // If there are no error messages, return true for valid password
  if (errorMessages.length === 0) {
    return true;
  }

  // Join the error messages into a single string
  return "Password must: " + errorMessages.join(", ") + ".";
};

export default function RegisterStudent() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm({
    mode: "onTouched",
  });
  const [isRollNumberFilled, setIsRollNumberFilled] = useState(true);
  const handleRollNumberChange = (event) => {
    const value = event.target.value;
    console.log(value);
    setIsRollNumberFilled(value.trim() !== "");
  };

  const [contactInfo, setContactInfo] = useState({
    contact: "",
    secondaryContact: "",
    fatherContact: "",
    motherContact: "",
  });
  const handleContactChange = (e) => {
    const { name, value } = e.target;
    // Only allow digits (0-9)
    if (/^\d*$/.test(value) && value.length <= 10) {
      setContactInfo((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <div className="w-full bg-gray-100">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Register Student
            </h1>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Register a New Student
            </p>
          </div>
          <form
            className="space-y-8 divide-y divide-gray-200 dark:divide-gray-800"
            onSubmit={handleSubmit(RegisterStudent)}
          >
            <div className="space-y-8 sm:space-y-5">
              <div>
                <h2 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-50">
                  Personal Information
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                  This information will be displayed publicly so be careful what
                  you share.
                </p>

              </div>
              <div className="space-y-6 sm:space-y-5">
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
                  <label
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 dark:text-gray-300"
                    htmlFor="roll-number"
                  >
                    Roll Number
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0 space-y-2 ">
                    <Input
                      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:border-gray-600 dark:bg-gray-950 dark:text-gray-50"
                      id="roll-number"
                      name="roll-number"
                      type="text"
                      {...register("rollnumber", {
                        required: {
                          value: true,
                          message: "Roll Number is required",
                        }, // Provide a value for the 'message' property
                      })}
                    />
                    <p className="col-span-4 text-red-500 text-xs text-left">
                      {errors.rollnumber
                        ? `* ${errors.rollnumber.message}`
                        : ""}
                    </p>
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
                  <label
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 dark:text-gray-300"
                    htmlFor="first-name"
                  >
                    First Name
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0 space-y-2">
                    <Input
                      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:border-gray-600 dark:bg-gray-950 dark:text-gray-50"
                      id="first-name"
                      name="first-name"
                      type="text"
                      {...register("firstName", {
                        required: {
                          value: true,
                          message: "first name is required",
                        }, // Provide a value for the 'message' property
                      })}
                    />
                    <p className="col-span-4 text-red-500 text-xs text-left">
                      {errors.firstName ? `* ${errors.firstName.message}` : ""}
                    </p>
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
                  <label
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 dark:text-gray-300"
                    htmlFor="last-name"
                  >
                    Last Name
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    <Input
                      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:border-gray-600 dark:bg-gray-950 dark:text-gray-50"
                      id="last-name"
                      name="last-name"
                      type="text"
                    />
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
                  <label
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 dark:text-gray-300"
                    htmlFor="year"
                  >
                    Year
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    <Select
                      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:border-gray-600 dark:bg-gray-950 dark:text-gray-50"
                      id="year"
                      name="year"
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1st Year</SelectItem>
                        <SelectItem value="2">2nd Year</SelectItem>
                        <SelectItem value="3">3rd Year</SelectItem>
                        <SelectItem value="4">4th Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
                  <label
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 dark:text-gray-300"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    <Input
                      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:border-gray-600 dark:bg-gray-950 dark:text-gray-50"
                      id="password"
                      name="password"
                      required
                      type="password"
                      {...register("password", {
                        validate: passwordValidation,
                      })}
                    />
                    {errors.password && (
                      <p className="text-red-500 text-xs">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
                  <label
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 dark:text-gray-300"
                    htmlFor="department"
                  >
                    Department
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    <Select
                      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:border-gray-600 dark:bg-gray-950 dark:text-gray-50"
                      id="department"
                      name="department"
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cse">Computer Science</SelectItem>
                        <SelectItem value="ece">Electronics</SelectItem>
                        <SelectItem value="mech">Mechanical</SelectItem>
                        <SelectItem value="civil">Civil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
                  <label
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 dark:text-gray-300"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    <Input
                      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:border-gray-600 dark:bg-gray-950 dark:text-gray-50"
                      id="email"
                      name="email"
                      type="email"
                      required
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Please enter a valid email address",
                        },
                      })}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
                  <label
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 dark:text-gray-300"
                    htmlFor="official-email"
                  >
                    Official Email
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    <Input
                      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:border-gray-600 dark:bg-gray-950 dark:text-gray-50"
                      id="official-email"
                      name="official-email"
                      type="email"
                      {...register("official-email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Please enter a valid email address",
                        },
                      })}
                    />
                    {errors["official-email"] && (
                      <p className="text-red-500 text-xs">
                        {errors["official-email"].message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
                  <label
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 dark:text-gray-300"
                    htmlFor="gender"
                  >
                    Gender
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    <Select
                      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:border-gray-600 dark:bg-gray-950 dark:text-gray-50"
                      id="gender"
                      name="gender"
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
                  <label
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 dark:text-gray-300"
                    htmlFor="course"
                  >
                    Course
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    <Select
                      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:border-gray-600 dark:bg-gray-950 dark:text-gray-50"
                      id="course"
                      name="course"
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="btech">B.Tech</SelectItem>
                        <SelectItem value="mtech">M.Tech</SelectItem>
                        <SelectItem value="mba">MBA</SelectItem>
                        <SelectItem value="mca">MCA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
                  <label
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 dark:text-gray-300"
                    htmlFor="dob"
                  >
                    Date of Birth
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    <input
                      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:border-gray-600 dark:bg-gray-950 dark:text-gray-50"
                      id="dob"
                      name="dob"
                      type="date"
                      required
                    />
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
                  <label
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 dark:text-gray-300"
                    htmlFor="contact"
                  >
                    Contact Number
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    <Input
                      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:border-gray-600 dark:bg-gray-950 dark:text-gray-50"
                      id="contact"
                      name="contact"
                      required
                      type="tel"
                      value={contactInfo.contact}
                      onChange={handleContactChange}
                    />
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
                  <label
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 dark:text-gray-300"
                    htmlFor="secondary-contact"
                  >
                    Secondary Number
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    <Input
                      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:border-gray-600 dark:bg-gray-950 dark:text-gray-50"
                      id="secondaryContact"
                      name="secondaryContact"
                      type="tel"
                      value={contactInfo.secondaryContact}
                      onChange={handleContactChange}
                    />
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
                  <label
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 dark:text-gray-300"
                    htmlFor="father-name"
                  >
                    Father's Name
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    <Input
                      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:border-gray-600 dark:bg-gray-950 dark:text-gray-50"
                      id="father-name"
                      name="father-name"
                      required
                      type="text"
                    />
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
                  <label
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 dark:text-gray-300"
                    htmlFor="father-occupation"
                  >
                    Father's Occupation
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    <Input
                      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:border-gray-600 dark:bg-gray-950 dark:text-gray-50"
                      id="father-occupation"
                      name="father-occupation"
                      type="text"
                    />
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
                  <label
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 dark:text-gray-300"
                    htmlFor="father-contact"
                  >
                    Father's Contact Number
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    <Input
                      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:border-gray-600 dark:bg-gray-950 dark:text-gray-50"
                      id="fatherContact"
                      name="fatherContact"
                      required
                      type="tel"
                      value={contactInfo.fatherContact}
                      onChange={handleContactChange}
                    />
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
                  <label
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 dark:text-gray-300"
                    htmlFor="mother-name"
                  >
                    Mother's Name
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    <Input
                      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:border-gray-600 dark:bg-gray-950 dark:text-gray-50"
                      id="mother-name"
                      name="mother-name"
                      type="text"
                      required
                    />
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
                  <label
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 dark:text-gray-300"
                    htmlFor="mother-occupation"
                  >
                    Mother's Occupation
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    <Input
                      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:border-gray-600 dark:bg-gray-950 dark:text-gray-50"
                      id="mother-occupation"
                      name="mother-occupation"
                      type="text"
                    />
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
                  <label
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 dark:text-gray-300"
                    htmlFor="mother-contact"
                  >
                    Mother's Contact Number
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    <Input
                      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:border-gray-600 dark:bg-gray-950 dark:text-gray-50"
                      id="motherContact"
                      name="motherContact"
                      type="tel"
                      value={contactInfo.motherContact}
                      onChange={handleContactChange}
                    />
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
                  <label
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 dark:text-gray-300"
                    htmlFor="blood-group"
                  >
                    Blood Group
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="a+">A+</SelectItem>
                        <SelectItem value="a-">A-</SelectItem>
                        <SelectItem value="b+">B+</SelectItem>
                        <SelectItem value="b-">B-</SelectItem>
                        <SelectItem value="ab+">AB+</SelectItem>
                        <SelectItem value="ab-">AB-</SelectItem>
                        <SelectItem value="o+">O+</SelectItem>
                        <SelectItem value="o-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
                  <label
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 dark:text-gray-300"
                    htmlFor="identification-mark"
                  >
                    Identification Mark
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    <Input
                      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:border-gray-600 dark:bg-gray-950 dark:text-gray-50"
                      id="identification-mark"
                      name="identification-mark"
                      type="text"
                    />
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
                  <label
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 dark:text-gray-300"
                    htmlFor="address"
                  >
                    Address
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    <Textarea
                      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:border-gray-600 dark:bg-gray-950 dark:text-gray-50"
                      id="address"
                      name="address"
                      required
                    />
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
                  <label
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 dark:text-gray-300"
                    htmlFor="state"
                  >
                    State
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ap">Andhra Pradesh</SelectItem>
                        <SelectItem value="ar">Arunachal Pradesh</SelectItem>
                        <SelectItem value="as">Assam</SelectItem>
                        <SelectItem value="br">Bihar</SelectItem>
                        <SelectItem value="cg">Chhattisgarh</SelectItem>
                        <SelectItem value="ga">Goa</SelectItem>
                        <SelectItem value="gj">Gujarat</SelectItem>
                        <SelectItem value="hr">Haryana</SelectItem>
                        <SelectItem value="hp">Himachal Pradesh</SelectItem>
                        <SelectItem value="jk">Jammu and Kashmir</SelectItem>
                        <SelectItem value="jh">Jharkhand</SelectItem>
                        <SelectItem value="ka">Karnataka</SelectItem>
                        <SelectItem value="kl">Kerala</SelectItem>
                        <SelectItem value="mp">Madhya Pradesh</SelectItem>
                        <SelectItem value="mh">Maharashtra</SelectItem>
                        <SelectItem value="mn">Manipur</SelectItem>
                        <SelectItem value="ml">Meghalaya</SelectItem>
                        <SelectItem value="mz">Mizoram</SelectItem>
                        <SelectItem value="nl">Nagaland</SelectItem>
                        <SelectItem value="or">Odisha</SelectItem>
                        <SelectItem value="pb">Punjab</SelectItem>
                        <SelectItem value="rj">Rajasthan</SelectItem>
                        <SelectItem value="sk">Sikkim</SelectItem>
                        <SelectItem value="tn">Tamil Nadu</SelectItem>
                        <SelectItem value="tg">Telangana</SelectItem>
                        <SelectItem value="tr">Tripura</SelectItem>
                        <SelectItem value="ut">Uttarakhand</SelectItem>
                        <SelectItem value="up">Uttar Pradesh</SelectItem>
                        <SelectItem value="wb">West Bengal</SelectItem>
                        <SelectItem value="an">Andaman and Nicobar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
                  <label
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 dark:text-gray-300"
                    htmlFor="account-holder-name"
                  >
                    Account Holder Name
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    <Input
                      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:border-gray-600 dark:bg-gray-950 dark:text-gray-50"
                      id="account-holder-name"
                      name="account-holder-name"
                      type="text"
                    />
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
                  <label
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 dark:text-gray-300"
                    htmlFor="account-number"
                  >
                    Account Number
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    <Input
                      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:border-gray-600 dark:bg-gray-950 dark:text-gray-50"
                      id="account-number"
                      name="account-number"
                      type="text"
                      inputMode="numeric"
                      pattern="\d*"
                      maxLength="18"
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/\D/g, "");
                      }}
                    />
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
                  <label
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 dark:text-gray-300"
                    htmlFor="bank-name"
                  >
                    Bank Name
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    <Input
                      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:border-gray-600 dark:bg-gray-950 dark:text-gray-50"
                      id="bank-name"
                      name="bank-name"
                      type="text"
                    />
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
                  <label
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 dark:text-gray-300"
                    htmlFor="ifsc"
                  >
                    IFSC
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    <Input
                      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:border-gray-600 dark:bg-gray-950 dark:text-gray-50"
                      id="ifsc-code"
                      name="ifsc-code"
                      type="text"
                      maxLength="11"
                      pattern="^[A-Z]{4}0[A-Z0-9]{6}$"
                      title="Please enter a valid IFSC code (e.g., SBIN0001234)"
                      onInput={(e) => {
                        e.target.value = e.target.value.toUpperCase();
                      }}
                    />
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4" />
              </div>
            </div>
            <div>
              <Button className="w-full bg-blue-700 hover:bg-blue-500">
                Register
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
