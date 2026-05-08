# HN Board

A full-stack **Hacker News Dashboard** built with the MERN stack. Scrapes top stories from Hacker News, provides JWT authentication, and lets users bookmark their favorite stories.

## Features

- Live scraping of top Hacker News stories (Cheerio)
- Stories sorted by points with pagination
- JWT authentication (register / login)
- Bookmark stories with optimistic UI toggle
- Manual refresh with 60-second rate limit
- Premium dark-themed login page with glassmorphism UI
- Fully responsive design

## Tech Stack

| Layer     | Tech                          |
|-----------|-------------------------------|
| Frontend  | React 19, React Router 7, Axios |
| Backend   | Express 5, Mongoose 9, JWT   |
| Scraper   | Axios, Cheerio                |
| Database  | MongoDB (Atlas or local)      |
| Styling   | Custom CSS, Inter font        |

---

## Local Development

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas URI)

### 1. Clone

```bash
git clone <your-repo-url>
cd hn-board
```

### 2. Environment Variables

Create `.env` in the **project root**:

```env
MONGO_URI=mongodb://localhost:27017/hn-board
JWT_SECRET=your_jwt_secret_here
PORT=5000
CLIENT_URL=http://localhost:3000
```

### 3. Install & Run

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Start server (from /server)
cd ../server
npm run dev

# Start client (from /client — in a separate terminal)
cd ../client
npm start
```

- Server: `http://localhost:5000`
- Client: `http://localhost:3000`

---

## Production Deployment (IP-based, No Domain)

Use this when deploying on a VPS/cloud server accessed via IP address (e.g. `http://123.45.67.89`).

### 1. Server Setup

SSH into your server and clone the repo:

```bash
git clone <your-repo-url>
cd hn-board
```

### 2. Environment Variables

Create `.env` in the **project root**:

```env
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/hn-board
JWT_SECRET=your_strong_secret_here
PORT=5000
CLIENT_URL=http://<YOUR_SERVER_IP>:3000
```

> Replace `<YOUR_SERVER_IP>` with your actual server IP.

### 3. Build the React Client

```bash
cd client
npm install

# Set API URL for production build
# Linux/Mac:
REACT_APP_API_URL=http://<YOUR_SERVER_IP>:5000/api npm run build

# Windows (PowerShell):
$env:REACT_APP_API_URL="http://<YOUR_SERVER_IP>:5000/api"; npm run build
```

This generates a `client/build/` folder with static files.

### 4. Serve Static Build from Express

Add this to `server/index.js` **before** the 404 handler (already supports it, but if not present):

```js
// Serve React build in production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}
```

### 5. Install Server Deps & Start

```bash
cd server
npm install

# Run directly
NODE_ENV=production node index.js

# Or use PM2 (recommended)
npm install -g pm2
NODE_ENV=production pm2 start index.js --name hn-board
pm2 save
pm2 startup
```

### 6. Open Firewall Ports

```bash
# Allow port 5000 (or whichever PORT you set)
sudo ufw allow 5000
```

### 7. Access the App

Open `http://<YOUR_SERVER_IP>:5000` in your browser.

---

## Quick Deploy Checklist

| Step | Command / Action |
|------|-----------------|
| Clone repo | `git clone <url> && cd hn-board` |
| Create `.env` | Add MONGO_URI, JWT_SECRET, PORT, CLIENT_URL |
| Build client | `cd client && REACT_APP_API_URL=http://IP:5000/api npm run build` |
| Install server | `cd server && npm install` |
| Start server | `NODE_ENV=production pm2 start index.js --name hn-board` |
| Open firewall | `sudo ufw allow 5000` |
| Visit app | `http://YOUR_IP:5000` |

---

## API Endpoints

| Method | Endpoint                  | Auth | Description               |
|--------|---------------------------|------|---------------------------|
| POST   | /api/auth/register        | No   | Register a new user       |
| POST   | /api/auth/login           | No   | Login and get JWT         |
| GET    | /api/stories              | No   | Get stories (paginated)   |
| GET    | /api/stories/bookmarks    | Yes  | Get user's bookmarks      |
| GET    | /api/stories/:id          | No   | Get a single story        |
| POST   | /api/stories/:id/bookmark | Yes  | Toggle bookmark on story  |
| POST   | /api/stories/scrape       | No   | Trigger manual scrape     |
| GET    | /api/health               | No   | Health check              |

## Project Structure

```
hn-board/
├── .env                        # Environment variables
├── server/
│   ├── index.js                # Express entry point
│   ├── config/db.js            # MongoDB connection
│   ├── controllers/            # Route handlers
│   ├── middleware/auth.js      # JWT middleware
│   ├── models/                 # Mongoose schemas
│   │   ├── User.js
│   │   └── Story.js
│   ├── routes/                 # API routes
│   │   ├── auth.routes.js
│   │   └── story.routes.js
│   └── scraper/hackerScraper.js
├── client/
│   ├── public/
│   │   └── loginbg.png         # Login page background
│   └── src/
│       ├── api/axios.js        # Axios instance
│       ├── components/         # Navbar, ProtectedRoute
│       ├── context/AuthContext.jsx
│       ├── pages/              # Login, Register, Home, Bookmarks
│       └── App.css             # All styles
└── README.md
```

## Demo Credentials

```
Email:    akshit2@test.com
Password: 123456
```

## License

MIT
