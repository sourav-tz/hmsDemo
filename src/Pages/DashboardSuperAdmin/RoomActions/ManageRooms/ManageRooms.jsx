/**
 * v0 by Vercel.
 * @see https://v0.dev/t/tyylSvQO5pt
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function MangageRooms() {
  return (
    <>
      <main className="bg-gray-100 py-8 px-6">
        <div className="container mx-auto">
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Add New Room</h3>
            <form className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="room-number">Room Number</Label>
                <Input id="room-number" type="number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="floor">Floor</Label>
                <Input id="floor" type="number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="block">Block</Label>
                <Input id="block" type="text" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input id="capacity" type="number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Hostel Number</Label>
                <Input id="capacity" type="number" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="amenities">Amenities</Label>
                <Textarea id="amenities" rows={3} />
              </div>
              <div className="col-span-2 flex justify-end">
                <Button variant="primary">Add Room</Button>
              </div>
            </form>
          </div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Rooms</h2>
            <Button className="px-4 py-2" variant="primary">
              Add Room
            </Button>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full table-auto">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left">Room #</th>
                  <th className="px-4 py-3 text-left">Floor</th>
                  <th className="px-4 py-3 text-left">Block</th>
                  <th className="px-4 py-3 text-left">Capacity</th>
                  <th className="px-4 py-3 text-left">Amenities</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-3">101</td>
                  <td className="px-4 py-3">1</td>
                  <td className="px-4 py-3">A</td>
                  <td className="px-4 py-3">4</td>
                  <td className="px-4 py-3">
                    <ul className="list-disc pl-4">
                      <li>Bed</li>
                      <li>Desk</li>
                      <li>Closet</li>
                    </ul>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <Button size="sm" variant="secondary">
                      Edit
                    </Button>
                    <Button size="sm" variant="danger">
                      Delete
                    </Button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3">102</td>
                  <td className="px-4 py-3">1</td>
                  <td className="px-4 py-3">A</td>
                  <td className="px-4 py-3">2</td>
                  <td className="px-4 py-3">
                    <ul className="list-disc pl-4">
                      <li>Bed</li>
                      <li>Desk</li>
                    </ul>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <Button size="sm" variant="secondary">
                      Edit
                    </Button>
                    <Button size="sm" variant="danger">
                      Delete
                    </Button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3">103</td>
                  <td className="px-4 py-3">2</td>
                  <td className="px-4 py-3">B</td>
                  <td className="px-4 py-3">6</td>
                  <td className="px-4 py-3">
                    <ul className="list-disc pl-4">
                      <li>Bed</li>
                      <li>Desk</li>
                      <li>Closet</li>
                      <li>Ensuite Bathroom</li>
                    </ul>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <Button size="sm" variant="secondary">
                      Edit
                    </Button>
                    <Button size="sm" variant="danger">
                      Delete
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-8 flex justify-end">
            <Button variant="danger">Drop All Rooms</Button>
          </div>
        </div>
      </main>
    </>
  )
}