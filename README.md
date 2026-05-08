# Trip Kuwait — Web Project
### Team Deployment Guide

---

## 1. Overview

This guide walks every team member through setting up and running the Trip Kuwait project on their local machine. The project has two parts:

- `server/` — Node.js + Express backend (runs on port **5001**)
- `website/` — React frontend (runs on port **3000**)
- **MongoDB Atlas** — cloud-hosted database (connection via Atlas URI)

The project is also **live and hosted**:
- **Frontend:** https://trip-kuwait.surge.sh (hosted on Surge.sh)
- **Backend API:** https://web-project-m6qq.onrender.com (hosted on Render)

---

## 2. Prerequisites

Install the following before anything else:

- **Node.js v18+** — https://nodejs.org
- **MongoDB Compass** *(optional, for browsing the Atlas database)* — https://www.mongodb.com/try/download/compass
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

## 4. Set Up MongoDB Atlas (Cloud Database)

This project uses **MongoDB Atlas** — a cloud-hosted database. There is no local MongoDB installation required.

The connection is handled automatically through the `MONGO_URI_LOCAL` variable in the backend `.env` file (see Section 5). As long as that variable is set correctly, the backend will connect to Atlas on startup.

If you want to browse the database visually, you can use **MongoDB Compass**:

1. Open MongoDB Compass.
2. In the connection field, paste the full Atlas URI your team leader provides:
   ```
   mongodb+srv://<db_username>:<db_password>@cluster0.ugl4moa.mongodb.net/trip_kuwait
   ```
3. Click **Connect**.

> ⚠️ Make sure your IP address is whitelisted in the Atlas project's Network Access settings. Ask your team leader to add your IP if you cannot connect.

---

## 5. Create the `.env` File (Backend)

Inside the `server/` folder, create a new file named exactly `.env` and paste the following — fill in the values your team leader provides:

This is the link of the MongoDatabase:
mongodb+srv://<db_username>:<db_password>@cluster0.ugl4moa.mongodb.net/trip_kuwait?appName=Cluster0

```env
MONGO_URI_LOCAL=mongodb+srv://<db_username>:<db_password>@cluster0.ugl4moa.mongodb.net/trip_kuwait?appName=Cluster0

GOOGLE_API_KEY='Your_Google_API_Key'
API_KEY_HOTELS='YOUR_SERPAPI_API_KEY'
BREVO_USER=your_brevo_login_email
BREVO_PASS=your_brevo_smtp_key
FRONTEND_URL=https://trip-kuwait.surge.sh
```

| Variable | Description |
|---|---|
| `MONGO_URI_LOCAL` | MongoDB Atlas connection string — use exactly as shown above |
| `GOOGLE_API_KEY` | Google Places API key (used for restaurants and reviews) |
| `API_KEY_HOTELS` | SerpAPI key (used for hotels and events) |
| `BREVO_USER` | Your Brevo account login email — used to send password reset emails |
| `BREVO_PASS` | Your Brevo SMTP key — found in Brevo dashboard under Transactional → SMTP & API |
| `FRONTEND_URL` | Deployed frontend URL — used to generate the password reset link sent via email |

> ⚠️ To get your Brevo credentials: sign up at https://brevo.com → go to **Transactional → SMTP & API → SMTP tab** → copy your login email and SMTP key.

> ⚠️ `FRONTEND_URL` must point to the live frontend (`https://trip-kuwait.surge.sh`) so that password reset emails contain the correct link. When testing locally, you may change this to `http://localhost:3000`.

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
npm run dev
```

The terminal should print:
```
[nodemon] 3.1.14
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node server.js`
Connecting to MongoDB...
connected to DB
Listening to port 5001
```

> ⚠️ Keep this terminal open. The backend must stay running for the frontend to work.

---

## 7. Populate the Database with API Data *(Optional)*

The backend fetches hotels, restaurants, and events from external APIs and stores them in MongoDB Atlas. To load this data into the database, call these endpoints **once** after the server is running (use a browser or Postman):

- **Hotels:** `GET http://localhost:5001/api/hotels/google`
- **Restaurants:** `GET http://localhost:5001/api/restaurants/db`
- **Events:** `GET http://localhost:5001/api/events`

After calling these, open MongoDB Compass (connected to Atlas) and refresh — you will see the `Hotel_info`, `Restaurants_info`, and `Event_info` collections inside `trip_kuwait`.

---

## 8. Install & Run the Frontend

Open a **second terminal** (keep the backend terminal running), navigate to the `website/` folder:

### Step 1 — Install dependencies
```bash
cd website
npm install
```

### Step 2 — Create the `.env` File (Frontend)

Inside the `website/` folder, create a new file named exactly `.env` and paste the following — fill in the values your team leader provides:

```env
REACT_APP_OPENAI_API_KEY=YOUR_OPENAI_API_KEY
REACT_APP_API_URL=https://web-project-m6qq.onrender.com
```

| Variable | Description |
|---|---|
| `REACT_APP_OPENAI_API_KEY` | OpenAI API key used by the frontend |
| `REACT_APP_API_URL` | The deployed backend URL — the frontend sends all API requests here |

> ⚠️ When running locally and you want to use your local backend instead, change `REACT_APP_API_URL` to `http://localhost:5001`.

> ⚠️ Never commit the `.env` file to Git. It is listed in `.gitignore` for this reason.

### Step 3 — Start the React app
```bash
npm start
```

This opens the website in your browser at:
```
http://localhost:3000
```

> ⚠️ Both the backend (port 5001) and frontend (port 3000) must be running at the same time.

---

## 9. Deploying Frontend Changes to Surge.sh

The frontend is hosted at **https://trip-kuwait.surge.sh**. To deploy any update:

### Step 1 — Install Surge *(first time only)*
```bash
npm install --global surge
```

### Step 2 — Build and deploy
```bash
cd website
npm run build
surge build trip-kuwait.surge.sh
```

> ⚠️ You must be logged into Surge with the project account. If prompted, enter the team credentials.

> ⚠️ Always run `npm run build` before deploying — deploying without a fresh build may push outdated code.

---

## 10. Logging in as Admin

Go to `http://localhost:3000/login` and enter:

- **Email field:** `admin`
- **Password:** `admin`

The site will redirect you directly to the Admin Dashboard at `/admin`. The **Dashboard** link also appears in the navigation bar — only visible to the admin account.

---

## 11. Password Reset (Forgot Password)

The forgot password flow sends a reset link via **Brevo** (transactional email service). For this to work, `BREVO_USER`, `BREVO_PASS`, and `FRONTEND_URL` must be set in the backend `.env`. The flow:

1. User clicks **"Forgot password?"** on the login page.
2. They enter their email and click **Send Reset Link**.
3. They receive an email with a reset link (pointing to `FRONTEND_URL`) that expires in **15 minutes**.
4. The link takes them to the Reset Password page.
5. After resetting, they are redirected to login.

---

## 12. Quick Command Reference

| What | Command |
|---|---|
| Install backend | `cd server && npm install` |
| Seed admin *(once only)* | `cd server && node scripts/seedAdmin.js` |
| Start backend | `cd server && npm run dev` |
| Install frontend | `cd website && npm install` |
| Start frontend | `cd website && npm start` |
| Deploy frontend to Surge | `cd website && npm run build && surge build trip-kuwait.surge.sh` |

---

## 13. Port & URL Reference

| Service | Local URL | Deployed URL |
|---|---|---|
| Backend API | http://localhost:5001 | https://web-project-m6qq.onrender.com |
| Frontend | http://localhost:3000 | https://trip-kuwait.surge.sh |
| MongoDB Atlas | — | mongodb+srv://cluster0.ugl4moa.mongodb.net/trip_kuwait |

---

## 14. Common Issues & Fixes

**"MONGO_URI is undefined" when running seedAdmin.js**
- Make sure the `.env` file is inside the `server/` folder
- Make sure you are running the command from inside the `server/` folder

**Backend shows "connected to DB" but frontend shows no data**
- The API data hasn't been fetched yet — call the 3 endpoints in Section 7 once

**Login with admin/admin fails**
- The seed script hasn't been run yet. Run `node scripts/seedAdmin.js` from inside `server/` and check the terminal output.

**Password reset email not received**
- Check `BREVO_USER` and `BREVO_PASS` in the backend `.env`
- `BREVO_PASS` must be the SMTP key from your Brevo dashboard, not your Brevo account password
- Check that `FRONTEND_URL` is set correctly in the backend `.env`
- Check the spam folder

**Frontend shows no data when pointed at deployed backend**
- Confirm `REACT_APP_API_URL` in the frontend `.env` is set to `https://web-project-m6qq.onrender.com`
- The Render backend may take ~1 minute to spin up if it has been inactive

---

*Trip Kuwait — Web Project 335 | Deployment Guide*