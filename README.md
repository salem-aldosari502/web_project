# Trip Kuwait — Web Project
### Team Deployment Guide

---

## 1. Overview

This guide walks every team member through setting up and running the Trip Kuwait project on their local machine. The project has two parts:

- `server/` — Node.js + Express backend (runs on port **5001**)
- `website/` — React frontend (runs on port **3000**)
- **MongoDB** — local database (MongoDB Compass, no cloud account needed)

---

## 2. Prerequisites

Install the following before anything else:

- **Node.js v18+** — https://nodejs.org
- **MongoDB Community Server** — https://www.mongodb.com/try/download/community
- **MongoDB Compass** — https://www.mongodb.com/try/download/compass
- **Git** — https://git-scm.com

Verify Node.js is installed:
```bash
node -v
npm -v
```

---

## 3. Clone the Repository

```bash
git clone https://github.com/salem-aldosari502/web_project.git
cd web_project
```

---

## 4. Set Up MongoDB (Local Database)

This project uses a **local** MongoDB database — no cloud account or Atlas connection is needed.

1. Start MongoDB on your machine. On Windows, MongoDB usually starts automatically as a service. If it doesn't, open **Services** and start **"MongoDB"**.
2. Open **MongoDB Compass**.
3. In the connection field, enter:
   ```
   mongodb://localhost:27017
   ```
4. Click **Connect**.
5. The database `trip_kuwait` will be created automatically the first time the backend runs — you do not need to create it manually. However, if it insist on writing the collection name, then write in collection name: `user_info` and click create.

> ⚠️ If MongoDB Compass cannot connect, make sure the MongoDB service is running on your machine.

---

## 5. Create the `.env` File (Backend)

Inside the `server/` folder, create a new file named exactly `.env` and paste the following — fill in the values your team leader provides:

```env
MONGO_URI_LOCAL=mongodb://localhost:27017/trip_kuwait

These Keys are my keys so becarful with them:
GOOGLE_API_KEY='AIzaSyAXyzKcabg7lRcR33TzE17M-REE_E6696s'
API_KEY_HOTELS='e293d0e538934fc8ba0687350793011c157f00dea405e891446f16a0c6bde249'
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_gmail_app_password
JWT_SECRET=any_long_random_string it's written in the userController.js
```

| Variable | Description |
|---|---|
| `MONGO_URI_LOCAL` | Local MongoDB connection string — use exactly as shown above |
| `GOOGLE_API_KEY` | Google Places API key (used for restaurants and reviews) |
| `API_KEY_HOTELS` | SerpAPI key (used for hotels and events) |
| `EMAIL_USER` | Gmail address used to send password reset emails |
| `EMAIL_PASS` | Gmail **App Password** — not your regular Gmail password |
| `JWT_SECRET` | Any long random string — used to sign login tokens |

> ⚠️ `EMAIL_PASS` must be a **Gmail App Password**. Go to: Google Account → Security → 2-Step Verification → App Passwords → generate one for "Mail".

> ⚠️ Never commit the `.env` file to Git. It is listed in `.gitignore` for this reason.

---

## 6. Install & Run the Backend

Open a terminal, navigate to the `server/` folder, and run the following commands **in order**:

### Step 1 — Install dependencies
```bash
cd server
npm install
```

### Step 2 — Seed the admin user *(run only once)*

This inserts the admin account into the database. You only need to run this **one time**. Running it again will just show a duplicate error — that's fine.

```bash
node scripts/seedAdmin.js
```

You should see `Admin user created` in the terminal. The admin credentials are:
- **Email/Username:** `admin`
- **Password:** `admin`

### Step 3 — Start the backend server
```bash
node server.js
```

The terminal should print:
```
Connecting to MongoDB...
connected to DB
Listening to port 5001
```

> ⚠️ Keep this terminal open. The backend must stay running for the frontend to work.

---

## 7. Populate the Database with API Data *(Optional)*

The backend fetches hotels, restaurants, and events from external APIs and stores them in MongoDB. To load this data into your local database, call these endpoints **once** after the server is running (use a browser or Postman):

- **Hotels:** `GET http://localhost:5001/api/hotels/google`
- **Restaurants:** `GET http://localhost:5001/api/restaurants`
- **Events:** `GET http://localhost:5001/api/events`

After calling these, open MongoDB Compass and refresh — you will see the `hotels`, `restaurants`, and `events` collections inside `trip_kuwait`.

---

## 8. Install & Run the Frontend

Open a **second terminal** (keep the backend terminal running), navigate to the `website/` folder:

### Step 1 — Install dependencies
```bash
cd website
npm install
```

### Step 2 — Start the React app
```bash
npm start
```

This opens the website in your browser at:
```
http://localhost:3000
```

> ⚠️ Both the backend (port 5001) and frontend (port 3000) must be running at the same time.

---

## 9. Logging in as Admin

Go to `http://localhost:3000/login` and enter:

- **Email field:** `admin`
- **Password:** `admin`

The site will redirect you directly to the Admin Dashboard at `/admin`. The **Dashboard** link also appears in the navigation bar — only visible to the admin account.

---

## 10. Password Reset (Forgot Password)

The forgot password flow sends a reset link via Gmail. For this to work, `EMAIL_USER` and `EMAIL_PASS` must be set in `.env`. The flow:

1. User clicks **"Forgot password?"** on the login page.
2. They enter their email and click **Send Reset Link**.
3. They receive an email with a reset link that expires in **15 minutes**.
4. The link takes them to the Reset Password page.
5. After resetting, they are redirected to login.

---

## 11. Quick Command Reference

| What | Command |
|---|---|
| Install backend | `cd server && npm install` |
| Seed admin *(once only)* | `cd server && node scripts/seedAdmin.js` |
| Start backend | `cd server && node server.js` |
| Install frontend | `cd website && npm install` |
| Start frontend | `cd website && npm start` |

---

## 12. Port Reference

| Service | URL |
|---|---|
| Backend API | http://localhost:5001 |
| Frontend | http://localhost:3000 |
| MongoDB | mongodb://localhost:27017 |

---

## 13. Common Issues & Fixes

**"MONGO_URI is undefined" when running seedAdmin.js**
- Make sure the `.env` file is inside the `server/` folder
- Make sure you are running the command from inside the `server/` folder

**Backend shows "connected to DB" but frontend shows no data**
- The API data hasn't been fetched yet — call the 3 endpoints in Section 7 once

**Login with admin/admin fails**
- The seed script hasn't been run yet. Run `node scripts/seedAdmin.js` from inside `server/` and check the terminal output.

**Password reset email not received**
- Check `EMAIL_USER` and `EMAIL_PASS` in `.env`
- `EMAIL_PASS` must be a Gmail App Password, not your regular password
- Check the spam folder

---

*Trip Kuwait — Web Project 335 | Deployment Guide*
