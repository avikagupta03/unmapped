# unmapped — Escape the Ordinary 🏔️

> **🌐 Live Website:** [Click here to visit unmapped](#)

A full-stack travel web application for curated weekend trips and treks across India. Built for travelers who want to escape without the planning hassle — we plan everything, they just show up.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React, TailwindCSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT + Google OAuth |
| Email | Nodemailer |
| Scheduling | node-cron |

---

## Features

- Cinematic homepage with rotating hero slideshow
- Trips listing filtered by experience type (Hills, Beaches, Forests, Desert)
- Trek listing filtered by difficulty (Easy, Moderate, Challenging)
- Live search on trips and trek pages
- Individual trip and trek detail pages — overview, included/excluded, stay info, transport, notes
- Reviews and star ratings per trip
- Save and wishlist trips
- Booking inquiry modal with WhatsApp integration
- Email/password signup and login + Google OAuth
- User profile with booking history and saved trips
- Automated booking confirmation email to user on every inquiry
- Admin notification email on every new booking
- Re-engagement cron job — runs daily at 10am, emails pending inquiries older than 24 hours
- Admin dashboard with full CRUD for trips and treks, inquiry management, status tracking, and internal notes

---

## Project Structure

```
unmapped/
├── backend/
│   ├── models/       # Admin, Trip, Inquiry, User, Review
│   ├── routes/       # auth, users, trips, inquiries, reviews
│   ├── middleware/   # JWT auth
│   ├── utils/        # Email templates
│   └── server.js     # Entry point + cron job + seed data
│
└── frontend/
    ├── app/          # Next.js pages (home, trips, trek, auth, profile, admin)
    ├── components/   # Navbar, Hero, TripCard, BookingModal, HomeSections
    ├── context/      # AuthContext
    └── lib/          # API client
```

---

## Local Development

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill in your values in .env
node server.js
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`

---

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGO_URI=           # MongoDB Atlas connection string
JWT_SECRET=          # Any long random string, min 32 characters
CLIENT_URL=          # http://localhost:3000 for local, Vercel URL in production
ADMIN_EMAIL=         # Email you want to use for admin login
ADMIN_PASSWORD=      # Password you want for admin login
EMAIL_USER=          # Your Gmail address
EMAIL_PASS=          # Gmail App Password (Google Account > Security > App Passwords)
EMAIL_FROM=          # Display name e.g. unmapped <you@gmail.com>
WA_NUMBER=           # WhatsApp number with country code, no + sign e.g. 919876543210
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=            # http://localhost:5000/api for local, Render URL in production
NEXT_PUBLIC_WA_NUMBER=          # WhatsApp number with country code, no + sign
NEXT_PUBLIC_PHONE=              # Display format e.g. +91 98765 43210
NEXT_PUBLIC_EMAIL=              # Contact email
NEXT_PUBLIC_INSTAGRAM=          # Full Instagram URL
NEXT_PUBLIC_GOOGLE_CLIENT_ID=   # From Google Cloud Console > APIs & Services > Credentials
```

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/trips` | All trips with filters and search |
| `/trek` | All treks with filters and search |
| `/trips/[slug]` | Trip detail page |
| `/trek/[slug]` | Trek detail page |
| `/auth` | Login and signup |
| `/profile` | User profile and booking history |
| `/admin/login` | Admin login |
| `/admin/dashboard` | Admin panel |
