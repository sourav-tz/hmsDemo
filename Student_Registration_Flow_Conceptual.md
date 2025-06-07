# Student Registration Flow - Conceptual Overview

## 1. Process Overview

The student registration system implements a multi-stage verification process that ensures data integrity and proper administrative control. The flow consists of four main stages:

1. **Temporary Account Creation** - Admin creates temporary accounts for students
2. **Student Self-Profiling** - Students complete their profile information
3. **Admin Verification** - Admins review and approve/reject student profiles
4. **Data Transfer** - Approved profiles are transferred to main system tables

This approach provides several benefits:
- Clear separation between unverified and verified student data
- Structured approval workflow with administrative oversight
- Ability to track and manage the registration process
- Secure handling of student information

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Admin Creates  │     │ Student Submits │     │ Admin Reviews   │     │ System Transfers│
│  Temp Account   │────▶│    Profile      │────▶│   Profile       │────▶│  Data to Main   │
│                 │     │                 │     │                 │     │    Tables       │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
                                 ▲                      │
                                 │                      │
                                 └──────────────────────┘
                                  Rejection & Resubmission
```

## 2. Temporary Account Creation

### Process
1. Hostel admin navigates to the Student Account Creation page
2. Admin enters the student's email address
3. System validates the email (checks for duplicates in both temp and main tables)
4. System generates a random password
5. System creates a temporary account with:
   - Email
   - Hashed password
   - Expiration date (7 days from creation)
   - Status set to "pending"
   - Hostel number (inherited from the admin's assigned hostel)

### Key Features
- **Automatic Password Generation**: System creates a secure random password
- **Hostel Assignment**: Students are automatically assigned to the admin's hostel
- **Expiration Mechanism**: Temporary accounts expire after 7 days if unused
- **Duplicate Prevention**: System prevents creating accounts with existing emails
- **Status Tracking**: Account status is tracked throughout the process

### Data Storage
Temporary accounts are stored in the `studentTemp` table with the following key fields:
- `email` (primary key)
- `password` (hashed)
- `expiresAt`
- `status` (pending, profile_submitted, approved, rejected)
- `hostelNo`
- `rejectionReason` (if applicable)

## 3. Student Self-Profiling

### Process
1. Student receives login credentials (email and password)
2. Student logs in with temporary credentials and is assigned the "TempStudent" role
3. System directs student to the Self-Profiling form
4. Student completes the profile form with personal and academic information
5. Student submits the form
6. System validates all fields and checks for duplicate roll numbers
7. System stores the profile data and updates the account status to "profile_submitted"

### Key Features
- **Role-Based Access**: TempStudent role with limited access to only the profiling page
- **Comprehensive Form**: Collects all necessary student information
- **Validation**: Client and server-side validation of all fields
- **Roll Number Verification**: Checks for duplicate roll numbers
- **Status Update**: Account status changes to reflect submission
- **Resubmission Support**: Students can resubmit if their profile is rejected

### Data Storage
Profile information is stored in the `tempStudentProfiles` table with fields including:
- `rollNo` (primary key)
- `email` (foreign key to studentTemp)
- Personal details (name, contact, etc.)
- Academic details (course, semester, etc.)
- Address information
- Guardian information
- Document references (Aadhar, photo link)

## 4. Admin Verification Process

### Process
1. Admin navigates to the Student Verification page
2. System displays all profiles with "profile_submitted" status
3. Admin can filter profiles by hostel number
4. Admin reviews each profile's details
5. Admin decides to approve or reject the profile
6. If rejecting, admin provides a reason
7. System updates the profile status accordingly

### Key Features
- **Filtered View**: Admins can filter pending profiles by hostel
- **Detailed Review**: Admins can view all submitted information
- **Approval Workflow**: Simple approve/reject decision process
- **Rejection Feedback**: System captures rejection reasons for student notification
- **Hostel-Specific Access**: Admins can only see profiles for their assigned hostel

### Admin Actions
- **Approve**: Initiates data transfer to main tables and changes status to "approved"
- **Reject**: Sets status to "rejected" and stores rejection reason for student feedback

## 5. Data Transfer Mechanism

### Process
When an admin approves a profile:

1. System begins a database transaction
2. System creates a new record in the `users` table
3. System creates a new record in the `students` table
4. System creates a new record in the `profiles` table
5. System creates an empty record in the `bankdetails` table
6. System updates the temporary account status to "approved"
7. Transaction is committed

### Data Mapping
The system maps data from temporary tables to main tables as follows:

**From `studentTemp` and `tempStudentProfiles` to `users`**:
- `email` → `email`
- `password` (hashed) → `password`
- Role is set to "Student" (upgraded from "TempStudent")

**From `tempStudentProfiles` to `students`**:
- `email` → `email`
- `rollNo` → `rollNo`
- `firstName` → `firstName`
- `lastName` → `lastName`
- `semester` → calculated `year` value
- `course` → mapped to appropriate `courseId`
- `hostelNo` from temp account → `hostelNo`
- `roomId` is explicitly set to null

**From `tempStudentProfiles` to `profiles`**:
- `rollNo` → `rollNo`
- Personal details mapped directly
- Contact information mapped directly
- Address information mapped directly
- Guardian information mapped directly
- Document references mapped directly

**For `bankdetails`**:
- `rollNo` → `rollNo`
- Empty placeholders for bank information (to be filled later)

## 6. Email Notification System

The system sends automated email notifications at key points in the registration process:

### Account Creation Notification
- **Timing**: Immediately after admin creates a temporary account
- **Recipient**: Student (using the email provided by admin)
- **Content**:
  - Login credentials (email and temporary password)
  - Account expiration information (7 days from creation)
  - Step-by-step instructions for completing the profile
  - Note about the temporary nature of the account

### Profile Approval Notification
- **Timing**: When admin approves a student profile
- **Recipient**: Student
- **Content**:
  - Confirmation of profile approval
  - Information about account upgrade from temporary to permanent status
  - Instructions for accessing student features
  - Contact information for questions

### Profile Rejection Notification
- **Timing**: When admin rejects a student profile
- **Recipient**: Student
- **Content**:
  - Notification that profile needs updates
  - Specific reason for rejection
  - Instructions for updating and resubmitting the profile
  - Contact information for support

### UI Notifications
For profile submission, the system provides immediate feedback through the user interface:
- Success toast notification when profile is submitted successfully
- Status indicator showing "profile submitted" state
- Form becomes read-only to prevent further edits while pending approval

### Email Template Design
- Professional HTML templates with consistent branding
- Color-coded headers based on message type:
  - Blue for informational emails (account creation)
  - Green for approval emails
  - Red for rejection emails
- Responsive design that works on mobile and desktop devices
- Clear formatting with highlighted important information

## 7. Security and Access Control

### Authentication
- JWT-based authentication system
- Token validation on all protected routes
- Role-based access control for different user types

### Role Permissions
- **TempStudent**: Can only access the self-profiling page
- **Admin**: Can create temporary accounts and verify profiles
- **Student**: Regular student with full access to student features

### Data Protection
- Passwords are hashed using bcrypt
- Sensitive operations use database transactions
- Input validation on both client and server sides
- Protection against duplicate entries

## 7. Edge Cases and Error Handling

### Expired Accounts
- Temporary accounts expire after 7 days if unused
- Expired accounts are not displayed in the verification queue

### Rejected Profiles
- Students can view rejection reasons
- Students can update and resubmit rejected profiles
- Resubmission resets the status to "profile_submitted"

### Duplicate Roll Numbers
- System prevents duplicate roll numbers in both temporary and main tables
- Validation occurs before submission to prevent conflicts

### Failed Transactions
- Database transactions ensure data consistency
- If any part of the data transfer fails, all changes are rolled back

## 8. Future Enhancements

### Email Notifications
- Enhanced automated emails for account creation with more detailed instructions
- More comprehensive status update notifications with additional information
- Improved rejection notifications with more detailed explanations and next steps

### Document Upload
- Support for uploading and storing student documents
- Document verification workflow

### Batch Processing
- Bulk account creation
- Batch approval process

### Reporting
- Registration statistics
- Approval/rejection metrics
- Process efficiency tracking

---

This document provides a comprehensive overview of the student registration flow from temporary account creation to final approval and data transfer. The system is designed to ensure data integrity, administrative control, and a smooth user experience for both students and administrators.
