# Device Management App

A full-stack web application built with Django (backend) and React (frontend) for managing hardware or product-based devices within an organization.

It provides tools to:
- Register new devices with their serial numbers
- Approve devices for allocation
- Track device allocation status (managed externally)
- Map devices to customers with comprehensive filtering and sorting
- Manage authorized user access through JWT-based authentication

Designed for businesses and enterprises that need a streamlined device-tracking and allocation workflow.

---

## Features

### Authentication & Authorization
- **User signup and login** with JWT token-based authentication
- **Secure cookie-based session management** with automatic token refresh
- **Protected routes** requiring authentication
- **Role-based user system** (configurable during signup)

### Device Management
- **Device registration** with unique serial numbers following pattern validation
- **Device approval workflow** - approve devices before allocation
- **Allocation tracking** - devices allocated externally, status reflected in UI
- **Device details display** - IMSI, IMEI, and Device ID tracking
- **Special device handling** - Support for devices with custom workflow

### Customer Mapping
- **Device-to-customer mapping** - assign approved devices to customers
- **Comprehensive filtering** - filter by serial number, customer code, customer name, company, device type, approval status, and date range
- **Advanced search** - global search across multiple fields
- **Sorting capabilities** - sort by any column (ascending/descending)
- **Pagination** - configurable page sizes (5, 10, 25, 50 records per page)
- **Full CRUD operations** - create, read, update mappings
- **Auto-detection** - device type automatically detected from serial number format

### User Interface
- **Responsive design** - works on desktop, tablet, and mobile devices
- **Modal-based forms** - clean interface for adding and editing mappings
- **Real-time validation** - client-side and server-side validation
- **Loading states** - clear feedback during API operations
- **Error handling** - comprehensive error messages and user feedback

---

## Tech Stack

**Frontend:** React 19.2.0 + Vite  
**Backend:** Django 5.2 + Django REST Framework  
**Database:** MariaDB  
**Authentication:** JWT (djangorestframework-simplejwt) with HTTP-only cookies  
**API Style:** REST (DRF)  
**HTTP Client:** Axios with token refresh interceptor

---

## Project Structure

```
project-root/
├── BE/                          # Backend (Django)
│   ├── manage.py
│   ├── BE/
│   │   ├── settings.py         # Django settings with environment variables
│   │   ├── urls.py             # Main URL configuration
│   │   └── wsgi.py
│   ├── ProductRegistration/    # Main Django app
│   │   ├── models.py           # Database models
│   │   ├── serializers.py      # DRF serializers
│   │   ├── views/
│   │   │   ├── auth_views.py   # Authentication endpoints
│   │   │   ├── device_views.py # Device management endpoints
│   │   │   └── mapping_views.py # Customer mapping endpoints
│   │   └── urls.py             # App URL patterns
│   └── .env                    # Environment variables (not in repo)
│
├── FE/                          # Frontend (React + Vite)
│   ├── src/
│   │   ├── assets/
│   │   │   └── js/
│   │   │       ├── axiosConfig.js    # Axios setup with interceptors
│   │   │       └── auth.js           # Auth utility functions
│   │   ├── components/
│   │   │   ├── CustomerForm.jsx      # Device-customer mapping form
│   │   │   ├── Modal.jsx             # Reusable modal component
│   │   │   ├── ProtectedRoute.jsx    # Route protection wrapper
│   │   │   └── Sidebar.jsx           # Navigation sidebar
│   │   ├── pages/
│   │   │   ├── AddSerialNum.jsx      # Serial number management page
│   │   │   ├── Home.jsx              # Dashboard home page
│   │   │   ├── Layout.jsx            # App layout wrapper
│   │   │   ├── ListingPage.jsx       # Device-customer mapping page
│   │   │   ├── LoginPage.jsx         # User login page
│   │   │   └── SignupPage.jsx        # User registration page
│   │   ├── styles/                   # CSS files
│   │   └── main.jsx                  # React entry point
│   ├── package.json
│   ├── vite.config.js
│   └── .env                          # Environment variables (not in repo)
│
└── README.md
```

---

## Current Status

### ✅ Implemented Features

#### Authentication System
- User signup with email, username, and password
- User login with JWT token generation
- Logout functionality with cookie cleanup
- Protected routes requiring authentication
- Automatic token refresh on expiration
- User session management via localStorage

#### Device Management
- Add serial numbers with pattern validation (YYYYMM{AMP|API}XXXXXXB)
- View all registered devices in table format
- Approve serial numbers (production team workflow)
- Track allocation status (allocated externally, displayed in UI)
- Display device details (IMSI, IMEI, Device ID)
- Special handling for UPI PRO devices
- Fetch device details by serial number

#### Customer Mapping
- View all device-customer mappings
- Create new mappings with approved devices
- Edit existing mappings
- Advanced filtering system:
  - Filter by serial number, customer code, customer name
  - Filter by company, device type, approval status
  - Filter by date range (from/to dates)
  - Global search across all fields
- Column-based sorting (all columns)
- Pagination with configurable page sizes
- Auto-detection of device type from serial format
- Full backend API integration

#### User Interface
- Responsive design for all screen sizes
- Modal-based forms for clean UX
- Loading states and error handling
- Mobile-friendly navigation with hamburger menu
- Professional styling and layout

### ⏳ Pending Features

#### Authentication
- ProtectedRoute enhancement to use `/verify-auth/` API endpoint
- User role-based access control (RBAC)
- Permission-based feature restrictions

#### Device Management
- Delete serial numbers endpoint and functionality
- Bulk device operations (approve/allocate multiple devices)

#### Customer Mapping
- Delete mapping endpoint and functionality
- Bulk mapping operations
- Export mappings

---

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 22
- MariaDB 10.5+
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <project-directory>
```

---

### 2. Backend Setup

#### a. Create Virtual Environment
```bash
cd BE
python -m venv venv

# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate
```

#### b. Install Dependencies
```bash
pip install -r requirements.txt (keep with .env)
```

**Required packages** (include in requirements.txt):
- django
- djangorestframework
- djangorestframework-simplejwt
- django-cors-headers
- mysqlclient
- django-environ

#### c. Configure Environment Variables

Create a `.env` file in the `BE/` directory:

```env
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database Configuration
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=localhost
DB_PORT=3306

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

**Security Notes:**
- Set DEBUG=False in production
- Restrict ALLOWED_HOSTS in production
- Use environment-specific CORS_ALLOWED_ORIGINS

#### d. Database Setup

1. **Create MariaDB Database:**
```sql
CREATE DATABASE your_database_name CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. **Run Migrations:**
```bash
python manage.py makemigrations
python manage.py migrate
```

3. **Create Database Stored Procedures:**

The application uses stored procedures for device and mapping operations. You'll need to create these in your database:

- `save_serial_number` - Insert new serial numbers
- `update_serial_number_approval` - Approve serial numbers
- `update_serial_number_allocate` - Update allocation status
- `get_single_unallocated_approved_serial` - Fetch available serial for allocation
- `save_upi_pro_serial_number` - Handle UPI PRO device registration
- `get_device_details_by_serial` - Fetch device details
- `save_serial_customer_details` - Create device-customer mapping
- `update_customer_by_serial` - Update existing mapping
- `get_serial_customer_details` - Fetch mappings with filtering and pagination

#### e. Run Backend Server
```bash
python manage.py runserver 8001
```

The backend will be available at `http://127.0.0.1:8001/`

---

### 3. Frontend Setup

#### a. Navigate to Frontend Directory
```bash
cd ../FE
```

#### b. Install Dependencies
```bash
npm install
```

**Key dependencies:**
- react
- react-dom
- react-router-dom
- axios

#### c. Configure Environment Variables

Create a `.env` file in the `FE/` directory:

```env
VITE_API_BASE_URL=http://127.0.0.1:8001/sil
```

**Notes:**
- Vite requires the `VITE_` prefix for environment variables
- Adjust the base URL based on your backend configuration
- The `/sil` path is the current API endpoint prefix (change accordingly)

#### d. Run Development Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173/` (default Vite port)

---

## API Endpoints

Base URL: `http://127.0.0.1:8001/sil/`

### Authentication Endpoints

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/signup/` | POST | Register new user | `{username, mailid, password, cpassword, role?}` | User data + success message |
| `/login/` | POST | User login | `{username, password}` | User data + JWT tokens in cookies |
| `/logout/` | POST | User logout | None | Success message + clear cookies |
| `/token/refresh/` | POST | Refresh access token | None (uses refresh_token cookie) | New access token in cookie |
| `/verify-auth/` | GET | Verify authentication | None (uses access_token cookie) | User data if authenticated |
| `/protected/` | GET | Test protected endpoint | None (uses access_token cookie) | User greeting |

**Authentication Flow:**
- Login sets HTTP-only cookies: `access_token` (15 min) and `refresh_token` (7 days)
- Frontend axios interceptor automatically refreshes expired access tokens
- All protected endpoints validate access token from cookies

### Device Management Endpoints

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/get_serial_numbers/` | GET | Retrieve all serial numbers | None | Array of device records |
| `/add_serial_number/` | POST | Add new serial number | `{serialnumber}` | Success/error status |
| `/approve_serial_number/` | PATCH | Approve a serial number | `{serialnumber}` | Success/error status |
| `/allocate_serial_number/` | POST | Mark serial as allocated | `{serialnumber}` | Success/error status |
| `/getSerialNumber/` | GET | Get & allocate unallocated serial | None | Serial number + status |
| `/get_device_details/` | GET | Get device details | Query: `?serialnumber=XXX` | Device details object |

**Serial Number Format:** (change accordingly)
- Pattern: `YYYYMM{AMP|API}XXXXXXB`
- Example: `202505AMP123456B`
- YYYY: Year (4 digits)
- MM: Month (2 digits)
- AMP/API: Device type
- XXXXXX: 6-digit sequence
- B: Suffix

### Customer Mapping Endpoints

| Endpoint | Method | Description | Query Parameters | Response |
|----------|--------|-------------|------------------|----------|
| `/get_customer_mappings/` | GET | Retrieve device-customer mappings | See filtering section below | Paginated mapping data |
| `/create_customer_mapping/` | POST | Create new mapping | See request body below | Success/error status |
| `/update_customer_mapping/` | POST | Update existing mapping | See request body below | Success/error status |

#### Filtering Parameters for GET `/get_customer_mappings/`

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `serialNumber` | string | Filter by serial number | null |
| `customerCode` | number | Filter by customer code | 0 |
| `customerName` | string | Filter by customer name | empty |
| `company` | string | Filter by company | empty |
| `deviceType` | string | Filter by device type (AMP/API) | empty |
| `fromDate` | date | Start date (YYYY-MM-DD) | 2020-01-01 |
| `toDate` | date | End date (YYYY-MM-DD) | current date |
| `approvedStatus` | number | Approval status (-1=all, 0=pending, 1=approved, 2=rejected) | -1 |
| `searchText` | string | Global search across all fields | empty |
| `pageNumber` | number | Offset (not page index) | 0 |
| `pageSize` | number | Records per page | 10 |
| `sortingOrderIndex` | number | Column index to sort (0-10) | 1 |
| `sortingOrderDirection` | number | Sort direction (0=ASC, 1=DESC) | 0 |

**Sorting Column Indices:**
- 0: Serial Number
- 1: Customer Code
- 2: Customer Name
- 3: Company
- 4: Device Type
- 5: Approval Status
- 6: Created Date
- 7: Modified Date

---

## Configuration Details

### Backend (Django)

#### Settings Highlights

```python
# JWT Token Configuration
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': False,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# Cookie Settings (Development)
SESSION_COOKIE_SECURE = False  # Set True in production (HTTPS)
CSRF_COOKIE_SECURE = False     # Set True in production (HTTPS)
SESSION_COOKIE_SAMESITE = 'Lax'
CSRF_COOKIE_SAMESITE = 'Lax'

# CORS Configuration
CORS_ALLOWED_ORIGINS = env.list('CORS_ALLOWED_ORIGINS')
CORS_ALLOW_CREDENTIALS = True
```

**Production Considerations:**
- Set `SESSION_COOKIE_SECURE = True` when using HTTPS
- Set `CSRF_COOKIE_SECURE = True` when using HTTPS
- Consider `SESSION_COOKIE_SAMESITE = 'Strict'` for enhanced security
- Restrict CORS_ALLOWED_ORIGINS to your production domains only

---

## Application Workflow

### User Registration & Authentication
1. User visits signup page
2. Enters username, email, password
3. Backend validates and creates user with hashed password
4. User logs in with credentials
5. Backend generates JWT tokens (access + refresh)
6. Tokens stored in HTTP-only cookies
7. Frontend stores user data in localStorage for UI purposes
8. Protected routes check localStorage for user existence
9. API requests automatically include cookies
10. Expired access tokens automatically refreshed by interceptor

### Device Registration Flow
1. **Production/Hardware Team** adds serial numbers via "Add Serial Number" page
2. Serial number validated against pattern: `YYYYMM{AMP|API}XXXXXXB`
3. Device stored in database with `isapproved=0`, `isallocated=0`
4. **Production Team** reviews and approves devices (`isapproved=1`)
5. **External System** allocates devices (sets `isallocated=1` via API)
6. Web app displays allocation status (read-only in UI)
7. Special handling for UPI PRO devices (auto-approved and allocated)

### Customer Mapping Flow
1. **Sales/Project Team** navigates to "Map Devices" page
2. Clicks "Map New Device" button
3. Modal opens with form
4. Selects from dropdown of approved, unallocated devices
5. Device type auto-detected from serial number
6. Enters customer details (code, name, company, UID)
7. Enters license URL and version details
8. Form validates and submits to backend
9. Backend creates mapping in database
10. Table refreshes to show new mapping
11. Team can edit/update mappings as needed
12. Advanced filtering and search available for finding specific mappings

---

**Note:** Role-based access control (RBAC) is planned but not yet enforced in the UI.

---

## Development Guidelines

### Adding New Features

1. **Backend (Django):**
   - Create/update models in `models.py`
   - Add serializers in `serializers.py`
   - Implement views in appropriate `views/` file
   - Register URLs in `urls.py`
   - Create database migrations: `python manage.py makemigrations`
   - Run migrations: `python manage.py migrate`

2. **Frontend (React):**
   - Create components in `src/components/`
   - Create pages in `src/pages/`
   - Add routes in `main.jsx`
   - Use axios configured in `axiosConfig.js` for API calls
   - Follow existing CSS patterns for styling

---

## Troubleshooting

### Common Issues

#### Backend Issues

**Issue:** `ModuleNotFoundError` when running Django
- **Solution:** Ensure virtual environment is activated and dependencies installed
```bash
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

**Issue:** Database connection errors
- **Solution:** Verify `.env` file has correct database credentials
- Check MariaDB service is running
- Test connection: `mysql -u username -p database_name`

**Issue:** CORS errors in browser console
- **Solution:** Verify `CORS_ALLOWED_ORIGINS` in `.env` includes frontend URL
- Check `django-cors-headers` is installed
- Ensure middleware order is correct in `settings.py`

**Issue:** Stored procedure errors
- **Solution:** Ensure all required stored procedures are created in database
- Check stored procedure parameters match view function calls
- Review database logs for SQL errors

#### Frontend Issues

**Issue:** `Cannot connect to backend`
- **Solution:** Verify `VITE_API_BASE_URL` in frontend `.env` is correct
- Check backend server is running on port 8001
- Inspect network tab in browser dev tools for failed requests

**Issue:** Authentication not working
- **Solution:** Clear browser cookies and localStorage
- Check cookies are being set (inspect Application tab in Chrome DevTools)
- Verify `withCredentials: true` in axios config

**Issue:** Token refresh loop
- **Solution:** Check `/token/refresh/` endpoint is excluded from interceptor
- Verify refresh token cookie hasn't expired (7 days)
- Clear cookies and log in again

**Issue:** Components not rendering
- **Solution:** Check browser console for JavaScript errors
- Verify all imports are correct
- Ensure React Router is configured properly

---

## License

This project is licensed under the **CC BY-NC 4.0** license.  
You may use and modify the project for **non-commercial purposes**, with proper attribution.

---

**Developed by:** Adhwaith
