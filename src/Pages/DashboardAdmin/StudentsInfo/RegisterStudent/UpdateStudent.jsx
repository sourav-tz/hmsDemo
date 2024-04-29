/**
 * v0 by Vercel.
 * @see https://v0.dev/t/uZMv3rk54v5
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { PopoverTrigger, PopoverContent, Popover } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"

export default function UpdateStudent() {
  return (
    <main className="flex flex-col gap-8 py-8 px-4 md:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Student Information</h1>
        <div className="relative w-full max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          <Input
            className="w-full rounded-md border border-gray-200 bg-white px-10 py-2 text-sm shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50"
            placeholder="Search by name or roll number"
            type="search"
          />
        </div>
      </div>
      <div className="grid gap-8 rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div className="space-y-1">
            <Label htmlFor="roll-number">Roll Number</Label>
            <Input id="roll-number" required type="text" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="first-name">First Name</Label>
            <Input id="first-name" required type="text" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="last-name">Last Name</Label>
            <Input id="last-name" type="text" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="year">Year</Label>
            <Select id="year" required>
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
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input id="password" required type="password" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="department">Department</Label>
            <Select id="department" required>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cse">Computer Science</SelectItem>
                <SelectItem value="ece">Electronics and Communication</SelectItem>
                <SelectItem value="me">Mechanical</SelectItem>
                <SelectItem value="ee">Electrical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" required type="email" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="official-email">Official Email</Label>
            <Input id="official-email" type="email" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="gender">Gender</Label>
            <Select id="gender" required>
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
          <div className="space-y-1">
            <Label htmlFor="course">Course</Label>
            <Select id="course" required>
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
          <div className="space-y-1">
            <Label htmlFor="dob">Date of Birth</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button className="pl-3 text-left font-normal text-gray-500 dark:text-gray-400" variant="outline">
                  Pick a date
                  <CalendarDaysIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-0">
                <Calendar mode="single" />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-1">
            <Label htmlFor="contact">Contact Number</Label>
            <Input id="contact" required type="tel" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="secondary-contact">Secondary Contact</Label>
            <Input id="secondary-contact" type="tel" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="father-name">Father's Name</Label>
            <Input id="father-name" required type="text" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="father-occupation">Father's Occupation</Label>
            <Input id="father-occupation" type="text" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="father-contact">Father's Contact</Label>
            <Input id="father-contact" required type="tel" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="mother-name">Mother's Name</Label>
            <Input id="mother-name" type="text" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="mother-occupation">Mother's Occupation</Label>
            <Input id="mother-occupation" type="text" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="mother-contact">Mother's Contact</Label>
            <Input id="mother-contact" type="tel" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="blood-group">Blood Group</Label>
            <Select id="blood-group">
              <SelectTrigger>
                <SelectValue placeholder="Select blood group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a-positive">A+</SelectItem>
                <SelectItem value="a-negative">A-</SelectItem>
                <SelectItem value="b-positive">B+</SelectItem>
                <SelectItem value="b-negative">B-</SelectItem>
                <SelectItem value="ab-positive">AB+</SelectItem>
                <SelectItem value="ab-negative">AB-</SelectItem>
                <SelectItem value="o-positive">O+</SelectItem>
                <SelectItem value="o-negative">O-</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="identification-mark">Identification Mark</Label>
            <Input id="identification-mark" type="text" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" rows={3} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="state">State</Label>
            <Select id="state">
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ca">California</SelectItem>
                <SelectItem value="ny">New York</SelectItem>
                <SelectItem value="tx">Texas</SelectItem>
                <SelectItem value="fl">Florida</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="account-holder">Account Holder Name</Label>
            <Input id="account-holder" type="text" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="account-number">Account Number</Label>
            <Input id="account-number" type="text" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="bank-name">Bank Name</Label>
            <Input id="bank-name" type="text" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="ifsc-code">IFSC Code</Label>
            <Input id="ifsc-code" type="text" />
          </div>
        </div>
        <div className="flex justify-end">
          <Button className="w-full max-w-[200px]" type="submit">
            Update Student
          </Button>
        </div>
      </div>
    </main>
  )
}

function CalendarDaysIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  )
}


function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}