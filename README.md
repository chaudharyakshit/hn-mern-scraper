# HN Board — Hacker News Dashboard

A full-stack web app that scrapes top stories from Hacker News and presents them in a clean, modern dashboard. Users can sign up, log in, browse stories, and bookmark the ones they want to read later.

## Demo Video

**Watch the full walkthrough here:**
https://www.loom.com/share/6b4945611a584d41b947b9b4811619ae

---

## What I Built

I wanted to build something that actually feels like a real product — not just a basic CRUD app. So I picked Hacker News as the data source because it's familiar, and focused on making the whole experience smooth from login to bookmarking.

Here's what the app does:

- Scrapes the top stories from Hacker News automatically when the server starts
- Shows them in a paginated feed sorted by points
- Lets users register and log in (JWT-based auth)
- Logged-in users can bookmark stories and view them later
- Has a manual refresh button (rate-limited to prevent abuse)
- The entire UI is custom-built — dark theme, responsive, works on all devices

---

## Tech Stack

| Layer | What I Used |
|-------|-------------|
| Frontend | React, React Router, Axios |
| Backend | Node.js, Express |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT + bcrypt for password hashing |
| Scraper | Axios + Cheerio |
| Styling | Custom CSS (no UI library) |

I didn't use any component library like Material UI or Bootstrap — all the styles are handwritten to keep things lightweight and give me full control over the design.

---

## How to Run Locally

### You'll need:
- Node.js (v18 or newer)
- A MongoDB database (Atlas works great, local is fine too)

### Steps:

```bash
# Clone the repo
git clone <repo-url>
cd hn-board

# Set up environment variables
# Create a file: server/.env
```

Put this in `server/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=any_random_secret_string
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

Then:

```bash
# Install and start the server
cd server
npm install
npm run dev

# In a new terminal — install and start the client
cd client
npm install
npm start
```

Open `http://localhost:3000` and you're good to go.

---

## Production Build

For production, the Express server serves the React build directly — so you only need one process running.

```bash
# Build the React app
cd client
npm run build

# Update server/.env
# Change NODE_ENV=production

# Start the server
cd ../server
npm start
```

Now everything runs on `http://localhost:5000` — both the frontend and the API from a single server.

---

## API Endpoints

| Method | Endpoint | Auth Required | What it does |
|--------|----------|---------------|--------------|
| POST | /api/auth/register | No | Create a new account |
| POST | /api/auth/login | No | Log in, get a token |
| GET | /api/stories | No | Get paginated stories |
| GET | /api/stories/bookmarks | Yes | Get your bookmarks |
| POST | /api/stories/:id/bookmark | Yes | Bookmark/unbookmark a story |
| POST | /api/stories/scrape | No | Trigger a fresh scrape |
| GET | /api/health | No | Check if server is alive |

---

## Project Structure

```
hn-board/
├── server/
│   ├── index.js               # Entry point, Express setup
│   ├── config/db.js           # MongoDB connection
│   ├── controllers/           # Business logic
│   ├── middleware/auth.js     # JWT verification
│   ├── models/                # User and Story schemas
│   ├── routes/                # API route definitions
│   ├── scraper/               # Hacker News scraper
│   └── .env                   # Environment config
├── client/
│   ├── public/                # Static assets (login background, etc.)
│   └── src/
│       ├── api/axios.js       # API client setup
│       ├── components/        # Navbar, ProtectedRoute
│       ├── context/           # Auth state management
│       ├── pages/             # Login, Register, Home, Bookmarks
│       └── App.css            # All styles
└── README.md
```

---

## Design Decisions

- **No external UI library** — I wanted full control over the look and feel. The login page uses glassmorphism, floating particles, and a cinematic dark layout that I designed from scratch.
- **Optimistic UI for bookmarks** — When you click bookmark, it updates instantly on the frontend without waiting for the server. If the server fails, it rolls back. This makes the app feel snappy.
- **Single-server production** — Instead of deploying frontend and backend separately, the Express server serves the React build in production. Simpler to deploy, fewer moving parts.
- **Rate-limited scraping** — The scraper has a 60-second cooldown so users can't hammer the server with refresh requests.

---

## Demo Credentials

If you just want to test it without registering:

```
Email:    akshit2@test.com
Password: 123456
```

---

## What I'd Add Next

If I had more time, I'd probably add:
- Search and filter stories by keyword
- Push notifications for trending stories
- User profile page with reading history
- Deploy on a cloud platform with a custom domain

---

## License

MIT
