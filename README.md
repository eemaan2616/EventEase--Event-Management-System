<<<<<<< HEAD
# EventHub - Event Booking Platform

A full-stack MERN (MongoDB, Express, React, Node.js) event/workshop booking platform with role-based access, ticket booking, PDF ticket generation, blogs, notifications, and analytics.

## Features

- **Three User Roles**: Attendee, Organizer, Admin
- **Event Management**: Full CRUD with categories, ticket tiers, and status tracking
- **Booking System**: Select events, choose tickets, simulated payments
- **PDF Tickets**: Server-generated PDF tickets with event details and ticket ID
- **Search & Filter**: Search events by title, category, and date with pagination
- **Role-based Dashboards**: Custom views for attendees, organizers, and admins
- **Blog System**: Organizers and admins can publish blog posts
- **Notifications**: Real-time booking confirmations and reminders
- **Analytics**: Platform-wide and per-organizer statistics
- **Social Sharing**: Share events on Facebook, Twitter, WhatsApp
- **Contact Form**: Public contact page with location map
- **Admin Panel**: User management, event management, platform analytics
- **Responsive Design**: Mobile-first UI with Tailwind CSS

## Tech Stack

- **Frontend**: React 19, Redux Toolkit, React Router, Tailwind CSS v4, Axios, React Toastify, React Share
- **Backend**: Node.js, Express.js, JWT Authentication, bcrypt, express-validator
- **Database**: MongoDB with Mongoose ODM
- **PDF Generation**: PDFKit (server-side)

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
cd backend && npm install
cd ../frontend && npm install
```

3. Configure environment variables:

```bash
cp backend/.env.example backend/.env
```

Open `backend/.env` and set the following values:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string (local or Atlas) | `mongodb://localhost:27017/event_booking` |
| `JWT_SECRET` | Secret key used to sign JWT tokens — use a long random string in production | `your_jwt_secret_key_here` |
| `PORT` | Port the backend server listens on | `5000` |
| `NODE_ENV` | `development` or `production` | `development` |

> **Tip:** If you're using MongoDB Atlas, your `MONGO_URI` will look like
> `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>`

4. Seed the database (optional, provides sample data):

```bash
cd backend && npm run seed
```

5. Start the development servers:

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

6. Open http://localhost:3000

### Demo Accounts (after seeding)

Run the seed script to populate the database with sample users, events, and blog posts:

```bash
cd backend && npm run seed
```

You can then log in at **http://localhost:3000/login** with any of these accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@eventhub.com` | `password123` |
| Organizer | `organizer@eventhub.com` | `password123` |
| Attendee | `john@eventhub.com` | `password123` |

**What each role can do:**

- **Admin** — Full platform access: manage all users, events, and blog posts; view platform-wide analytics.
- **Organizer** — Create and manage their own events; publish blog posts; view per-organizer analytics.
- **Attendee** — Browse and search events; book tickets; download PDF tickets; manage their bookings.

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Events
- `GET /api/events` - List events (search, filter, paginate)
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create event (organizer/admin)
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/me` - User's bookings
- `PUT /api/bookings/:id/pay` - Process payment
- `GET /api/bookings/:id/ticket` - Download PDF ticket

### Blogs, Notifications, Contact, Analytics, Admin
See the full API in the backend routes directory.

## Project Structure

```
backend/
  config/        - Database configuration
  controllers/   - Route handlers
  middleware/     - Auth, error handler, validation
  models/        - Mongoose schemas
  routes/        - API routes
  utils/         - PDF generator, seed script
  server.js      - Entry point

frontend/
  src/
    components/  - Reusable UI components
    layouts/     - Page layouts
    pages/       - Route pages
    redux/       - Store and slices
    utils/       - API client
    App.jsx      - Router configuration
    main.jsx     - Entry point
```
=======

