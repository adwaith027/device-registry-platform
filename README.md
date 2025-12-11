# Device Management App

A web application built with Django (backend) and React (frontend) for managing hardware or product-based devices within an organization.

It provides tools to:
- Register new devices with their serial numbers
- Approve or allocate devices
- Map devices to customers
- Manage authorized user access through a login system

Designed for businesses and enterprises that need a streamlined device-tracking and allocation workflow.

---

## Features

- **Device registration** with unique serial numbers
- **Device approval and allocation workflow** - approve devices before allocation
- **Customer–device mapping** - assign devices to customers and view existing mappings
- **Secure login** for authorized users (UI implemented, authentication pending)
- **Clear UI** for managing assets and lifecycle stages
- **Backend APIs** built for extendability

---

## Tech Stack

**Frontend:** React (Vite)  
**Backend:** Django + Django REST Framework  
**Database:** MariaDB  
**Auth:** Django authentication  
**API Style:** REST (DRF)

---

## Project Structure

```
project-root/
├── BE/              # Backend (Django)
│   ├── manage.py
│   ├── models.py
│   ├── views.py
│   └── ...
├── FE/              # Frontend (React + Vite)
│   ├── src/
│   └── ...
└── README.md
```

---

## Current Status

### Implemented
- ✅ Add Serial Number page with full CRUD operations
  - Add new serial numbers
  - Approve serial numbers
  - Allocate serial numbers
  - Delete unapproved/unallocated serial numbers
- ✅ Device-Customer Mapping page
  - View existing mappings
  - Add new customer-device mappings
- ✅ Login page UI
- ✅ Backend API endpoints under `/products/`
- ✅ CORS configured for local development

### Pending
- ⏳ Login authentication functionality
- ⏳ User role-based access control

---

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- MariaDB

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Backend Setup

#### a. Create Virtual Environment
```bash
cd BE
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

#### b. Install Dependencies
```bash
pip install -r requirements.txt
```

#### c. Configure Environment Variables
Create a `.env` file in the `BE/` directory with the following:

```env
SECRET_KEY=your-secret-key-here
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=localhost
DB_PORT=3306
```

#### d. Database Setup
The project includes a `models.py` file created using Django's `inspectdb` command from an existing database. To set up your database:

1. Create your MariaDB database
2. Use the models in `models.py` as reference to create your tables
3. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

#### e. Run Backend Server
```bash
python manage.py runserver 8001
```

The backend will be available at `http://127.0.0.1:8001/`

### 3. Frontend Setup

#### a. Install Dependencies
```bash
cd FE
npm install
```

#### b. Run Development Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173/` (default Vite port)

---

## API Endpoints

Base URL: `http://127.0.0.1:8001/products/`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/get_serial_numbers/` | GET | Retrieve all serial numbers |
| `/add_serial_number/` | POST | Add a new serial number |
| `/approve_serial_number/` | PATCH | Approve a serial number |
| `/allocate_serial_number/` | PATCH | Allocate a serial number |
| `/getSerialNumber/` | GET | Get unallocated serial numbers |

---

## Configuration Notes

### Backend (Django)
- **Allowed Hosts:** Currently set to `localhost` for development
- **CORS:** Configured to accept connections from `http://localhost:5173` (Vite default port)
- **Database:** MariaDB connection configured via environment variables

### Frontend (React)
- **Dev Server Port:** 5173 (Vite default)
- **API Base URL:** `http://127.0.0.1:8001/sil/` (hardcoded in components, to be updated to `/products/`)

---

## Application Pages

1. **Add Serial Number Page**
   - Add new serial numbers to the system
   - View all serial numbers in a table
   - Approve serial numbers (production team)
   - Allocate approved serial numbers (sales/project team)
   - Delete unapproved and unallocated serial numbers

2. **Device-Customer Mapping Page**
   - View existing device-to-customer mappings
   - Add new mappings between customers and devices

3. **Login Page**
   - User authentication interface (authentication logic not yet implemented)

---

## User Roles

- **Production/Hardware Team:** Register and manage serial numbers
- **Sales/Project Team:** Allocate devices and map them to customers

---

## Development Workflow

1. **Adding Serial Numbers:** Production team adds devices with unique serial numbers
2. **Approval:** Devices are approved for allocation
3. **Allocation:** Approved devices are marked as allocated
4. **Customer Mapping:** Sales/project team maps allocated devices to customers

---

## Known Issues

- Login authentication not yet implemented
- No user role-based access control yet

---

## License

This project is licensed under the **CC BY-NC 4.0** license.  
You may use and modify the project for **non-commercial purposes**, with proper attribution.

---

## Support

For issues or questions, please open an issue in the repository.
