# Admin Workflow

## Authentication
- Secure login for admins using email/password.

## Dashboard
- Admin can see the overview count of:
  - Total courses published
  - Total tests created
  - Total registered students
  - Total active students
  - Total revenue
  - Total purchases

## Manage Courses
- Admin can see the available courses list as a grid view.
- Admin can search the course by name.
- Admin can sort courses by:
  - Course name
  - Newest
  - Price (Low to High)
  - Top Selling
  - Price (High to Low)
  - Most Popular (Trending)
- Admin can filter courses by:
  - Categories
  - Sub-categories
  - Course status (Published, Private, Unpublished, Expired)
- Admin can create or update courses using a form.

### Form Fields:
#### Basic Information:
- Course name
- Course description
- Thumbnail
- Category & sub-category (multiple categories possible)

#### Edit Price:
- **Course Duration Type:**
  - **Single Validity:**
    - Total count
    - Days, Months, Years
    - Price
    - Discount
    - Effective price (auto calculated)
  - **Multi Validity:**
    - Admin can create two course price plans (e.g., 6 months, 3 months)
    - Total count
    - Days, Months, Years
    - Price
    - Discount
    - Effective price (auto calculated)
    - Promote plan checkbox
  - **Lifetime Validity:**
    - Price
    - Discount
    - Effective price (auto calculated)
  - **Course Expiry Date:**
    - Expiry date
    - Price
    - Discount
    - Effective price (auto calculated)

#### Advanced Settings:
- Tax details (0%, 5%, 12%, 18%, 28%)
- Allow download of offline video
- Allow download of PDFs
- Enable live class
- Enable mark as featured
- **Restrictions:**
  - Maximum number of views
  - Maximum number of hours

#### Add Content:
- **Contents (Study Materials):**
  - Admin can edit, remove existing content.
  - Admin can schedule view (content will be unlocked on a set date and time).
  - Admin can create folders to add contents.
  - Admin can upload:
    - Videos
    - Documents
    - Photos
    - Zip files
  - Admin can add online tests.
  - Admin can add subjective tests.
  - Admin can import content from existing courses.
- Admin can delete courses.

## Content Management
### Tests Portal:
- Admin can:
  - View created tests in a list of folders.
  - Create folders, subfolders to organize tests.
  - Search material by name.
  - Sort by:
    - Modified date (ascending/descending)
    - Title (A-Z, Z-A)
    - Last attempted (ascending/descending)
  - Filter via available folders.

### Create a Test:
- Test name
- Test duration (Hours, Minutes)
- Add questions
- Configure grading options
- Add test sections
- Import questions
- Configure test settings

## Chats
- Admin can see available chats.
- Admin can see pending chat requests.
- Admin can reply to messages.

## Analytics
### Reports and Analytics:
- Generate reports on:
  - Active users
  - Popular courses
  - Payment transactions

## Settings
- Admin can control **Anti-Watermark settings**.
- Admin can enable **Safe Net check** to prevent students from using rooted devices.
- Admin can handle **device session control**:
  - Single session on web or mobile.
  - Students can log in on either web or mobile.
- **OTP Auto-Fill Restriction:** Forces students to manually submit OTP.

## User Account Management
- Admin can add faculties to the platform.
- Admin can define allowed features.
