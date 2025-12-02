# RealtimeNewsboard

A full-stack single-page application (SPA) for posting and reading news items — with real-time updates via WebSockets, user authentication, customizable user settings, and a clean React + .NET + SQLite stack.

---

## 🔧 Setup Instructions

### 1. Clone the repository  
```bash
git clone https://github.com/diegopitsillidis/RealtimeNewsboard.git
cd RealtimeNewsboard
```

### 2. Setup & run the backend  
```bash
cd backend
dotnet restore
dotnet ef database update   # apply migrations (creates the SQLite database)
dotnet run
```
- The backend runs on `https://localhost:7080` (or similar HTTPS port).  
- WebSocket endpoint is exposed at `wss://localhost:7080/ws/posts`.

### 3. Setup & run the frontend  
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
- Frontend runs at `http://localhost:5173`.  
- The React app connects to the backend and WebSocket server to fetch and stream posts.

### 4. Login and try the app  
- Open `http://localhost:5173` → use the login page.  
- After login, access Feed, Create Post, and Settings pages.

---

## 🛠 Technology Choices

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React (Vite + TypeScript), React Router, Zustand (state), React Query (data fetching), RxJS (WebSocket stream), Tailwind CSS (styling) |
| **Backend**  | .NET 8 Minimal API, EF Core with SQLite, JWT authentication, WebSocket endpoint with broadcast service |
| **Data persistence** | SQLite (via EF Core) |
| **Real-time updates** | WebSocket + RxJS stream merge on frontend |

This stack was chosen for simplicity, clarity, and to showcase both modern frontend practices (React + hooks + state/data management + styling) and a lightweight backend with real-time support.

---

## 👥 Seed User Credentials

Two users are seeded into the database for testing/demo purposes:

| Username | Password   | Role   |
|----------|------------|--------|
| `admin`  | `admin123` | `admin` |
| `user`   | `user123`  | `user`  |

Use one of these to log in and access the app. Only the **admin** user can create posts. Both users can log in and view the news feed.

---

## ⚠ Known Limitations

- Role-based permissions are basic — only admins can create posts. Other role-specific features are not implemented.
- **Language preference not applied** — the settings page lets you choose a language, but UI is not localized.  
- **No pagination or infinite scroll** — `/posts` returns all posts at once.  
- **WebSocket server uses in-memory storage** — if restarted, live connections are lost; not suitable for scaled multi-instance deployment.  
- **No global error UI / notifications** — API errors are shown inline or not handled globally.  
- **Minimal validation** — backend and frontend only enforce basic “required fields”; no advanced validation or sanitation.  
- **No automated tests provided** — neither unit nor integration tests are implemented.  
- **No Docker / containerization** — project runs locally; no container setup for easy deployment.

---  
