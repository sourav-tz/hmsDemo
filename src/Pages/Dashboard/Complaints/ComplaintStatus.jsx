
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {Card} from "@/components/ui/card"



const ComplaintStatus = () => {
    return (
        <>
        <div className='flex flex-col items-center w-full bg-gray-100 min-h-screen mx-auto item-center'>
        <h1 className='text-3xl font-semibold mt-10'>Complaint Status</h1>
        <p className='text-gray-500'>Check the status of your complaints</p>
        <Card className="w-[900px] mt-10">
        <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[100px]">Complaint ID</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                <TableCell className="font-medium">1</TableCell>
                <TableCell>Clogged Pipe</TableCell>
                <TableCell>Pending</TableCell>
                <TableCell className="text-left">12-05-2024</TableCell>
                <TableCell className="text-right"><Button className="bg-blue-700 hover:bg-blue-500">View</Button></TableCell>
                </TableRow>
                <TableRow>
                <TableCell className="font-medium">1</TableCell>
                <TableCell>Clogged Pipe</TableCell>
                <TableCell>Pending</TableCell>
                <TableCell className="text-left">12-05-2024</TableCell>
                <TableCell className="text-right"><Button className="bg-blue-700 hover:bg-blue-500">View</Button></TableCell>
                </TableRow>
                <TableRow>
                <TableCell className="font-medium">1</TableCell>
                <TableCell>Clogged Pipe</TableCell>
                <TableCell>Pending</TableCell>
                <TableCell className="text-left">12-05-2024</TableCell>
                <TableCell className="text-right"><Button className="bg-blue-700 hover:bg-blue-500">View</Button></TableCell>
                </TableRow>
            </TableBody>
        </Table>
        </Card>
        </div>
        </>
    )
}



export default ComplaintStatus


// should contains a table of complaints with their status and other details. The table should have the following columns:
// - Complaint ID
// - Subject
// - Status
// - Date
// - Actions


// exmaple table:
//<Card>
// <Table>
//   <TableCaption>A list of your recent invoices.</TableCaption>
//   <TableHeader>
//     <TableRow>
//       <TableHead className="w-[100px]">Invoice</TableHead>
//       <TableHead>Status</TableHead>
//       <TableHead>Method</TableHead>
//       <TableHead className="text-right">Amount</TableHead>
//     </TableRow>
//   </TableHeader>
//   <TableBody>
//     <TableRow>
//       <TableCell className="font-medium">INV001</TableCell>
//       <TableCell>Paid</TableCell>
//       <TableCell>Credit Card</TableCell>
//       <TableCell className="text-right">$250.00</TableCell>
//     </TableRow>
//   </TableBody>
// </Table>
//</Card>