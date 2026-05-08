# HN Board

A full-stack Hacker News dashboard that scrapes top stories and lets users bookmark their favorites.

Built with **React**, **Express**, **MongoDB**, and **Cheerio**.

## Features

- Scrapes top 10 Hacker News stories using Cheerio
- Stories sorted by points with pagination
- JWT authentication (register / login)
- Bookmark stories with optimistic UI toggle
- Manual refresh with 60-second rate limit
- Loading spinners and empty states for good UX

## Tech Stack

| Layer     | Tech                          |
|-----------|-------------------------------|
| Frontend  | React, React Router, Axios    |
| Backend   | Express, Mongoose, JWT        |
| Scraper   | Axios, Cheerio                |
| Database  | MongoDB                       |

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB running locally or a MongoDB Atlas URI

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd hn-board
```

### 2. Set up environment variables

Create a `.env` file in the project root:

```
MONGO_URI=mongodb://localhost:27017/hn-board
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
CLIENT_URL=http://localhost:3000
```

Create a `.env` file in the `client/` directory:

```
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Install dependencies

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 4. Run the app

```bash
# Start the server (from /server)
node index.js

# Start the client (from /client)
npm start
```

Server runs on `http://localhost:5000`, client on `http://localhost:3000`.

The scraper runs automatically on server start and fetches the top 10 HN stories.

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

## Project Structure

```
hn-board/
├── server/
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/auth.js
│   ├── models/
│   ├── routes/
│   ├── scraper/hackerScraper.js
│   └── index.js
├── client/
│   └── src/
│       ├── api/axios.js
│       ├── components/
│       ├── context/AuthContext.jsx
│       └── pages/
└── .env
```

## License

MIT
