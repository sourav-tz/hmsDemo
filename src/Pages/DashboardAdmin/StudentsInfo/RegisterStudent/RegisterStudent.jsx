/**
 * v0 by Vercel.
 * @see https://v0.dev/t/0gRW3DtWS5h
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Input } from "@/components/ui/input"
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function RegisterStudent() {
  return (
    <div className="w-full bg-gray-100">
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Register Student</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Register a New Student</p>
        </div>
        <form className="space-y-8 divide-y divide-gray-200 dark:divide-gray-800">
          <div className="space-y-8 sm:space-y-5">
            <div>
              <h2 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-50">Personal Information</h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                This information will be displayed publicly so be careful what you share.
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
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <Input
                    className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:border-gray-600 dark:bg-gray-950 dark:text-gray-50"
                    id="roll-number"
                    name="roll-number"
                    required
                    type="text"
                  />
                </div>
              </div>
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
                <label
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 dark:text-gray-300"
                  htmlFor="first-name"
                >
                  First Name
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <Input
                    className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:border-gray-600 dark:bg-gray-950 dark:text-gray-50"
                    id="first-name"
                    name="first-name"
                    required
                    type="text"
                  />
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
                  />
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
                    required
                    type="email"
                  />
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
                  />
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
                  <Calendar
                    className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:border-gray-600 dark:bg-gray-950 dark:text-gray-50"
                    id="dob"
                    name="dob"
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
                    id="secondary-contact"
                    name="secondary-contact"
                    type="tel"
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
                    id="father-contact"
                    name="father-contact"
                    required
                    type="tel"
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
                    id="mother-contact"
                    name="mother-contact"
                    type="tel"
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
                    id="ifsc"
                    name="ifsc"
                    type="text"
                  />
                </div>
              </div>
              
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4" />

            </div>
          </div>
          <div>
            <Button className='w-full bg-blue-700 hover:bg-blue-500' >
              Register
            </Button>
          </div>
        </form>
      </div>
    </div>
    </div>
  )
}


