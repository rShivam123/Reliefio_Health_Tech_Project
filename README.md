# Reliefio Health Tech

Reliefio is a complete healthcare website solution that connects patients with healthcare professionals such as doctors, physiotherapists, and diagnostic laboratories.

---

## Features

- Doctors: Search for and schedule appointments with doctors.
- Physiotherapy: Schedule physiotherapy appointments and recovery programs.
- Diagnostic Labs: Find partner laboratories, review diagnostic packages and book tests.
- Role-based workflows: Interface and workflows for both patients and healthcare providers.
- REST API: Endpoints for user management, listing, bookings, and record keeping.

---

## Tech Stack

- Frontend: React.js, React Router, Axios, CSS Modules / Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB, Mongoose ODM
- Authentication: JSON Web Tokens (JWT), bcrypt

---

## Project Structure

`text
reliefio-health-tech/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/     # UI components
│       ├── pages/          # Doctors, Physio, Labs, and Patients views
│       ├── services/       # API request utilities
│       └── App.js
├── server/                 # Express backend
│   ├── config/             # Connect to database
│   ├── controllers/        # Request handling
│   ├── models/             # Schemas in Mongoose (Doctors, Physio, Labs, Booking)
│   ├── routes/             # Express routes
│   └── server.js
├── .gitignore
└── README.md
