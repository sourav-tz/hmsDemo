// Hostel-change-bulk was removed from here — it is now handled by TransferStudent.jsx
// (Student Info → Transfer Student) which has a better UI: single/bulk toggle, multi-group,
// filter by hostel/year, pick-from-list, and a pre-submit summary table.
// This page is kept as the entry point for future application types
// (e.g. leave requests, maintenance, fee waivers) that go through the same
// HA → SA approval pipeline.
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Application = () => {
  const navigate = useNavigate();

  // Future application types will be added here as cards
  const applicationTypes = [
    // Example structure for when new types are added:
    // {
    //   title: 'Leave Request',
    //   description: 'Apply for short-term leave from hostel',
    //   route: '/adminDashboard/admin/leaveRequest',
    //   available: false,
    // },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 w-full justify-start py-10 items-center">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold">New Application</h1>
        <p className="text-gray-500 mt-1">Select the type of application you want to raise</p>
      </div>

      <div className="w-full max-w-2xl px-4 flex flex-col gap-4">

        {/* Hostel Transfer — points to TransferStudent */}
        <Card className="border-blue-200 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/adminDashboard/studentInfo/transferStudent')}>
          <CardHeader>
            <CardTitle className="text-base">Hostel Transfer</CardTitle>
            <CardDescription>
              Transfer one or more students to a different hostel. Supports single transfers and bulk year-end migrations.
              Requires Super Admin approval.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="bg-blue-600 hover:bg-blue-500 text-sm">
              Go to Transfer Student
            </Button>
          </CardContent>
        </Card>

        {/* Placeholder for future types */}
        {applicationTypes.length === 0 && (
          <div className="text-center text-gray-400 text-sm py-10 border-2 border-dashed rounded-lg">
            More application types coming soon
          </div>
        )}

        {applicationTypes.map((type, i) => (
          <Card key={i} className={`${type.available ? 'cursor-pointer hover:shadow-md' : 'opacity-50'} transition-shadow`}>
            <CardHeader>
              <CardTitle className="text-base">{type.title}</CardTitle>
              <CardDescription>{type.description}</CardDescription>
            </CardHeader>
            {type.available && (
              <CardContent>
                <Button onClick={() => navigate(type.route)} className="bg-blue-600 hover:bg-blue-500 text-sm">
                  Start Application
                </Button>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Application;
