# FinTrack — Personal Finance & Budget Tracker

## Tech Stack
- **Frontend**: React + Vite + Recharts
- **Backend**: Node.js + Express
- **Database**: MongoDB

---

## 📁 Project Structure

```
fintrack/
├── backend/
│   ├── src/
│   │   ├── config/        → Database connection
│   │   ├── controllers/   → Business logic
│   │   ├── middleware/     → JWT auth middleware
│   │   ├── models/        → MongoDB schemas
│   │   ├── routes/        → API endpoints
│   │   └── index.js       → Entry point
│   ├── .env               → Environment variables (you create this)
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/           → Axios instance
    │   ├── components/    → Layout components
    │   ├── context/       → Auth context
    │   ├── pages/         → Dashboard, Transactions, Budgets, Categories
    │   └── App.jsx        → Routes
    ├── index.html
    └── package.json
```

---

## 🛠 Setup Instructions

### Prerequisites
Install these first (if not already installed):
1. **Node.js** → https://nodejs.org (download LTS version)
2. **MongoDB Community** → https://www.mongodb.com/try/download/community
   - After installing, start MongoDB: run `mongod` in terminal OR use MongoDB Compass

---

### Step 1: Set up the Backend

```bash
# Open a terminal, go into the backend folder
cd fintrack/backend

# Install all required packages
npm install

# Create your environment file
cp .env.example .env
```

Now open `.env` and it will look like this:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fintrack
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```
Change `JWT_SECRET` to any random string like `mysecretkey123abc`.

```bash
# Start the backend server
npm run dev
```
✅ You should see: `Server running on port 5000` and `MongoDB Connected`

---

### Step 2: Set up the Frontend

Open a **new terminal** (keep the backend running):

```bash
# Go into the frontend folder
cd fintrack/frontend

# Install all required packages
npm install

# Start the frontend
npm run dev
```
✅ You should see: `Local: http://localhost:5173`

---

### Step 3: Open the App
Go to your browser and open: **http://localhost:5173**

1. Click "Create one" to register a new account
2. Login with your credentials
3. Start adding categories → then transactions → then budgets

---

## 🔌 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET | /api/dashboard | Dashboard summary |
| GET/POST | /api/transactions | List / Create |
| PUT/DELETE | /api/transactions/:id | Edit / Delete |
| GET/POST | /api/budgets | List / Create |
| PUT/DELETE | /api/budgets/:id | Edit / Delete |
| GET/POST | /api/categories | List / Create |
| PUT/DELETE | /api/categories/:id | Edit / Delete |

