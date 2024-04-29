import React from 'react'

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link } from 'react-router-dom'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

const Dashboard = () => {

  function truncateText(text, limit = 100) {
    const words = text.split(' ');
  
    if (words.length > limit) {
      return words.slice(0, limit).join(' ') + '...';
    } else {
      return text;
    }
  }
  

  return (

  <div className="flex">
 <div className="flex flex-wrap min-h-screen w-full justify-center items-start gap-6 bg-gray-100 p-6  md:grid-cols-2 md:gap-8 lg:p-8">
      <div className="rounded-lg w-[600px] bg-white p-6 shadow-sm dark:bg-gray-950">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Notices</h2>
          <Link className="text-sm font-medium text-blue-500 hover:underline" href="#">
            View all
          </Link>
        </div>
        <div className="mt-4 space-y-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Hostel Renovation Update</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">April 15, 2023</p>
              </div>
              <div className="flex items-center gap-2">
                <Dialog>
                  <DialogTrigger>
                <Button size="sm" variant="outline">
                  View
                </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Hostel Renovation Update</DialogTitle>
                    <DialogDescription>
                      {truncateText('The hostel renovation project is progressing well, and we expect the work to be completed by the end of the month.', 50) + '... (Read more)'}
                    </DialogDescription>
                  </DialogHeader>
                  <embed className='rounded-md shadow-lg' src="https://res.cloudinary.com/dsyxwqrg8/image/upload/v1713949155/ikyatsdeqacznnajneuz.pdf" type="application/pdf"  width="100%" height="600px" />
                </DialogContent>
              </Dialog>

                <Button size="sm">Download</Button>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              The hostel renovation project is progressing well, and we expect the work to be completed by the end of
              the month.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">New Dining Hall Menu</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">April 10, 2023</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  View
                </Button>
                <Button size="sm">Download</Button>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              The new dining hall menu is now available. Check it out and let us know your feedback.
            </p>
          </div>
        </div>
      </div>
      <div className="w-[600px] rounded-lg bg-white p-6 shadow-sm dark:bg-gray-950">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Complaints</h2>
          <Link className="text-sm font-medium text-blue-500 hover:underline" href="#">
            View all
          </Link>
        </div>
        <div className="mt-4 space-y-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Broken Washing Machine</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">April 20, 2023</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                  variant="outline"
                >
                  In Progress
                </Badge>
                <Button size="sm" variant="outline">
                  View
                </Button>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              The washing machine in the laundry room is not working properly. Please look into this issue as soon as
              possible.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Clogged Sink</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">April 15, 2023</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                  variant="outline"
                >
                  Resolved
                </Badge>
                <Button size="sm" variant="outline">
                  View
                </Button>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              The sink in the common bathroom is clogged, causing water to back up. Please send a plumber to fix this
              issue.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Faulty Light Bulb</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">April 12, 2023</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400" variant="outline">
                  Open
                </Badge>
                <Button size="sm" variant="outline">
                  View
                </Button>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              The light bulb in the hallway is not working. Please replace it as soon as possible.
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Dashboard;