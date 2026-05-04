# Project 3 — Event / Workshop Booking Platform (MERN Stack)

## 1. Project Overview

A full-stack web application where:
- Organizers create and manage events/workshops
- Attendees browse and book tickets
- Admin monitors platform activity

Focus areas:
- Core business logic (events, bookings)
- Personal productivity (profiles, dashboards)
- Collaboration (notifications, sharing)

---

## 2. Technology Stack

### Frontend
- React.js
- Redux Toolkit
- Tailwind CSS / Bootstrap
- Axios
- React Router

### Backend
- Node.js
- Express.js
- JWT Authentication
- bcrypt

### Database
- MongoDB (Mongoose)

---

## 3. User Roles

### Attendee
- Browse events
- Book tickets
- View bookings

### Organizer
- Create/manage events
- Track attendees

### Admin
- Manage users/events
- View analytics

---

## 4. Core Features

### 4.1 Dashboard + Navbar + Sidebar
- Role-based dashboards
- Sidebar:
  - Browse Events
  - My Bookings
  - Create Event

### 4.2 Authentication
- Email/password login & signup
- JWT authentication
- Role-based access

### 4.3 Event Management (CRUD)
- Create, update, delete events
- Fields:
  - Title, description
  - Date & time
  - Location
  - Ticket tiers

### 4.4 Booking System
- Select event → choose ticket → confirm booking
- Booking stored in database

### 4.5 Dummy Payment System
- No real payment gateway
- Simulated payment:
  - User clicks "Pay"
  - Booking marked as "Paid"
- Store payment status in DB

### 4.6 PDF Ticket Generation
- Generate simple PDF ticket with:
  - Event name
  - User name
  - Ticket ID

### 4.7 Search
- Search events by:
  - Title
  - Category
  - Date

### 4.8 User Profiles
- Attendee:
  - Booking history
- Organizer:
  - Created events

### 4.9 Blogs
- Admin/organizer can create blog posts

### 4.10 Social Sharing
- Share event links

### 4.11 Contact + Location
- Contact form
- Event location displayed (text or map link)

### 4.12 Notifications
- Booking confirmation
- Event reminders

### 4.13 Analytics Dashboard
- Admin:
  - Total events
  - Total bookings
- Organizer:
  - Event bookings count

---

## 5. Universal Requirements

### UI/UX
- Responsive design
- Clean interface
- Easy navigation

### Security
- JWT authentication
- Password hashing (bcrypt)
- Input validation

### Redux Usage
- Manage auth state
- User data
- Notifications

### Error Handling
- API error handling
- Form validation messages

### Code Quality
- Modular structure
- Clean code practices

### Subdomains (optional for deployment)
- app
- api

---

## 6. Database Design

### Users
- name
- email
- password
- role

### Events
- title
- description
- date
- location
- tickets

### Bookings
- userId
- eventId
- ticketType
- status

### Blogs
- title
- content

### Notifications
- userId
- message

---

## 7. API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login

### Events
- GET /api/events
- POST /api/events
- PUT /api/events/:id
- DELETE /api/events/:id

### Bookings
- POST /api/bookings
- GET /api/bookings/user

---

## 8. Frontend Pages

- Home Page
- Login / Signup
- Dashboard
- Event Listing
- Event Details
- Booking Page
- Profile Page
- Blog Page
- Admin Panel

---

## 9. Key Workflow

### Booking Flow
1. User selects event
2. Chooses ticket
3. Clicks pay (dummy)
4. Booking saved
5. Notification shown

---

## 10. Deployment

- Frontend: Vercel / Netlify
- Backend: Render / Railway
- Database: MongoDB Atlas

---

## 11. Summary

This project includes all required features:
- Authentication
- CRUD operations
- Dashboard
- Search
- Profiles
- Notifications
- Analytics

Simplifications made:
- No real payment integration
- No AI recommendation system
- No external APIs beyond basic requirements

