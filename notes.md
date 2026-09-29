<div align="center">

# ✒️ InkVault — MERN Notes Keeper

### *Write it. Pin it. Never lose it.*

**A full-stack notes app built phase-by-phase with AI prompts**

![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-API-0B1120?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-Vite-7C3AED?style=for-the-badge&logo=react&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-JWT_Auth-2DD4BF?style=for-the-badge&logo=node.js&logoColor=0B1120)
![Deploy](https://img.shields.io/badge/Deploy-Render_+_Vercel-FBBF24?style=for-the-badge&logoColor=0B1120)

</div>

> **About this file:** This is the original phase-by-phase build plan. The application has since grown beyond the original Notes and Categories scope to include tags and administrator tools. The 17 endpoints below describe the original core API, not the complete current API. For current features, setup, and the full API reference, use [README.md](README.md). The checklist at the end tracks the original plan and is not a live project status report.

---

## 🧭 Table of Contents

1. [🎯 Project Overview](#-project-overview)
2. [🧰 Tech Stack](#-tech-stack)
3. [🎨 Design System — Aqua Alloy and Peach Shell](#design-system--aqua-alloy-and-peach-shell)
4. [✨ Animation Blueprint](#-animation-blueprint)
5. [🗂️ Folder Structure](#️-folder-structure)
6. [🗃️ Data Models](#️-data-models)
7. [🔌 Core API Reference (17 planned endpoints)](#-core-api-reference-17-planned-endpoints)
8. [🔐 Auth Flow](#-auth-flow)
9. [✅ Good-Practice Rules](#-good-practice-rules)
10. [🧠 How to Use the Prompts](#-how-to-use-the-prompts)
11. [🪄 Master Context Prompt](#-master-context-prompt-paste-this-first-every-time)
12. [🚀 Phase-wise Build Prompts (Phase 0 → 16)](#-phase-wise-build-prompts)
13. [🛟 Bug-Fix Prompt Library](#-bug-fix-prompt-library)
14. [📊 Progress Tracker](#-progress-tracker)

---

## 🎯 Project Overview

**InkVault** is a secure notes keeper where every user registers, logs in, and manages **only their own** notes.

| Feature | Description |
|---|---|
| 🔑 Authentication | Register, Login, and "Me" endpoint using bcrypt + JWT |
| 📝 Notes | Create, read, update, delete notes with color, tags and category |
| 🗂️ Categories | Group notes into personal categories (Work, Ideas, Study …) |
| 📌 Status | Pin, archive, trash, and restore notes |
| 🔍 Search & Filter | Full-text search + filter by category, color, status, date |
| 📊 Stats | Dashboard counters and charts about your notes |
| 🌈 UI | Four-color Aqua Alloy and Peach Shell theme with smooth animations |

**Resource 1 (main data):** Notes  **Resource 2 (supporting data):** Categories

---

## 🧰 Tech Stack

| Layer | Tools |
|---|---|
| **Backend** | Node.js, Express, Mongoose, bcryptjs (bcrypt), jsonwebtoken, dotenv, cors, express-validator, helmet, morgan |
| **Frontend** | React (Vite), React Router v6, Axios, Context API, Tailwind CSS, Framer Motion, lucide-react, react-hot-toast |
| **Database** | MongoDB Atlas (free M0 cluster) |
| **Testing** | Postman (collection + environment) |
| **Deploy** | Render (API), Vercel or Netlify (React), MongoDB Atlas (DB) — all free plans |

> [!NOTE]
> `bcryptjs` is a pure-JS drop-in for `bcrypt`. It avoids native-build problems on Render's free tier, while the code and API stay identical.

---

## Design System — Aqua Alloy and Peach Shell

The interface uses four brand colors with Shadow Ink as the dark base. Aqua Alloy leads the interface, Peach Shell adds a warm accent, and Mist Porcelain keeps text and light details readable.

| Color | Hex | Usage |
| --- | --- | --- |
| **Aqua Alloy** | `#2FAF9A` | Brand, primary buttons, and success accents |
| **Peach Shell** | `#FF9F86` | Warm highlights and secondary accents |
| **Mist Porcelain** | `#FDF2F0` | Main text and light details |
| **Shadow Ink** | `#1B3A3C` | Page background, navbar, and cards |

**Note colors:** The four selectable note colors use these same palette values. Existing notes saved with the retired `gold` key display as Aqua Alloy.

**Tailwind config snippet (reference):**

```js
theme: {
  extend: {
    colors: {
      ink: "#1B3A3C",
      violet: "#2FAF9A",
      coral: "#FF9F86",
      honey: "#FDF2F0",
      mint: "#2FAF9A",
    },
  },
}
```

---
## ✨ Animation Blueprint

| # | Animation | Where | Tech |
|---|---|---|---|
| 1 | ✒️ **Pen-writing logo** — SVG stroke draws itself on load | Navbar / Login | CSS `stroke-dashoffset` |
| 2 | 🌫️ **Floating aurora blobs** — slow drifting gradient orbs | App background | CSS keyframes |
| 3 | 🎬 **Page transitions** — fade + slide between routes | All pages | Framer Motion `AnimatePresence` |
| 4 | 🃏 **Staggered card entrance** — cards cascade in | Notes grid | Framer Motion `staggerChildren` |
| 5 | 🧲 **Hover lift + glow tilt** — card rises with violet glow | Note cards | Framer Motion `whileHover` |
| 6 | 🌈 **Animated gradient border** — rotating conic border on focus | Inputs, editor | CSS `@property` / keyframes |
| 7 | 📌 **Pin bounce** — pin icon springs and wiggles | Pin button | Framer Motion spring |
| 8 | 🗑️ **Delete shake → fade-out** — card shakes, then shrinks away | Delete action | `AnimatePresence` exit |
| 9 | 🪟 **Modal spring pop** — editor scales from card position | Note editor | `layoutId` shared layout |
| 10 | 💀 **Skeleton shimmer** — loading placeholders | Lists, stats | CSS gradient sweep |
| 11 | 🔢 **Count-up numbers** — stats animate from 0 | Stats cards | Framer Motion `animate` |
| 12 | 🍞 **Toast slide-in** — success/error messages | Global | react-hot-toast (themed) |
| 13 | 🎉 **Confetti burst** — on first note created | Create note | canvas-confetti |
| 14 | 🌊 **Button ripple + press** — tactile feedback | All buttons | CSS + `whileTap` |
| 15 | ♿ **Reduced motion** — all animation off when user prefers | Global | `prefers-reduced-motion` |

---

## 🗂️ Folder Structure

```
inkvault/
├── README.md
├── postman/
│   ├── InkVault.postman_collection.json
│   └── InkVault.postman_environment.json
│
├── server/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Note.js
│   │   └── Category.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── noteController.js
│   │   └── categoryController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── noteRoutes.js
│   │   └── categoryRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── validate.js
│   │   └── errorHandler.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── paginate.js
│   ├── .env.example
│   ├── app.js
│   ├── server.js
│   └── package.json
│
└── client/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   │   ├── layout/        (Navbar, Sidebar, AppShell, AuroraBackground)
    │   │   ├── notes/         (NoteCard, NoteGrid, NoteEditor, NoteFilters, ColorPicker)
    │   │   ├── categories/    (CategoryList, CategoryForm)
    │   │   ├── stats/         (StatCard, StatsPanel)
    │   │   └── ui/            (Button, Input, Modal, Skeleton, EmptyState, Logo)
    │   ├── context/           (AuthContext.jsx, NotesContext.jsx)
    │   ├── hooks/             (useDebounce.js, useAuth.js)
    │   ├── pages/             (Login, Register, Dashboard, Notes, Archive, Trash, Categories, NotFound)
    │   ├── routes/            (ProtectedRoute.jsx, AppRoutes.jsx)
    │   ├── services/          (api.js, authService.js, noteService.js, categoryService.js)
    │   ├── styles/            (index.css, animations.css)
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env.example
    ├── tailwind.config.js
    └── vite.config.js
```

---

## 🗃️ Data Models

**User**
| Field | Type | Rules |
|---|---|---|
| name | String | required, 2–50 chars |
| email | String | required, unique, lowercase, valid email |
| password | String | required, min 6, hashed with bcrypt, `select: false` |
| timestamps | — | createdAt, updatedAt |

**Category**
| Field | Type | Rules |
|---|---|---|
| user | ObjectId → User | required, indexed |
| name | String | required, 1–30 chars, unique per user |
| color | String | one of `violet, mint, coral, gold, navy` |
| icon | String | lucide icon name, default `folder` |

**Note**
| Field | Type | Rules |
|---|---|---|
| user | ObjectId → User | required, indexed |
| category | ObjectId → Category | optional |
| title | String | required, max 100 |
| content | String | required, max 10,000 |
| color | String | one of `violet, mint, coral, gold, navy` |
| tags | [String] | max 8 tags |
| status | String | `active` \| `pinned` \| `archived` \| `trashed` (default `active`) |
| timestamps | — | createdAt, updatedAt |
| indexes | — | text index on `title + content + tags` |

---

## 🔌 Core API Reference (17 planned endpoints)

All responses follow: `{ "success": true|false, "message": "...", "data": ... }`
Lists add: `"pagination": { "page", "limit", "total", "totalPages" }`

### 🔐 Auth (3)

| Method | Endpoint | Access | Description | Success |
|---|---|---|---|---|
| POST | `/api/auth/register` | Public | Hash password, create user, return token | 201 |
| POST | `/api/auth/login` | Public | Verify credentials, return token | 200 |
| GET | `/api/auth/me` | 🔒 Private | Current logged-in user | 200 |

### 📝 Resource 1 — Notes (5)

| Method | Endpoint | Description | Success |
|---|---|---|---|
| POST | `/api/notes` | Create note | 201 |
| GET | `/api/notes?page=1&limit=10` | List own notes (paginated, newest first) | 200 |
| GET | `/api/notes/:id` | Get one own note | 200 |
| PUT | `/api/notes/:id` | Update own note | 200 |
| DELETE | `/api/notes/:id` | Permanently delete own note | 200 |

### 🗂️ Resource 2 — Categories (5)

| Method | Endpoint | Description | Success |
|---|---|---|---|
| POST | `/api/categories` | Create category | 201 |
| GET | `/api/categories?page=1&limit=20` | List own categories (paginated) | 200 |
| GET | `/api/categories/:id` | Get one own category | 200 |
| PUT | `/api/categories/:id` | Update own category | 200 |
| DELETE | `/api/categories/:id` | Delete category (notes become uncategorized) | 200 |

### ⚡ Special APIs (4)

| Method | Endpoint | Description | Success |
|---|---|---|---|
| GET | `/api/notes/search?q=react&page=1&limit=10` | Text search in title, content, tags | 200 |
| PATCH | `/api/notes/:id/status` | Change status: `active/pinned/archived/trashed` | 200 |
| GET | `/api/notes/stats` | Totals per status, per category, per color, last 7 days activity | 200 |
| GET | `/api/notes/filter?category=&color=&status=&tag=&from=&to=&sort=&page=&limit=` | Combined filters | 200 |

> [!IMPORTANT]
> Route order matters in Express: define `/search`, `/stats`, `/filter` **before** `/:id`, otherwise "stats" is treated as an id.

### 📮 Status Codes Used

| Code | Meaning | Example |
|---|---|---|
| 200 | OK | Fetch, update, delete, login |
| 201 | Created | Register, create note/category |
| 400 | Bad Request | Validation failed, invalid ObjectId |
| 401 | Unauthorized | Missing / invalid / expired token, wrong password |
| 404 | Not Found | Note not found **or belongs to another user** |
| 409 | Conflict | Email already registered, duplicate category name |
| 500 | Server Error | Unexpected failure (handled by error middleware) |

---

## 🔐 Auth Flow

```
 ┌──────────┐  1. POST /register   ┌──────────┐
 │  React   │ ───────────────────▶ │  Express │ → bcrypt hash → save user
 │  Client  │ ◀─────────────────── │   API    │ ← 201 + token + user
 │          │  2. POST /login      │          │
 │          │ ───────────────────▶ │          │ → compare hash → sign JWT
 │          │ ◀─────────────────── │          │ ← 200 + token
 │          │  3. Any private API  │          │
 │          │  Authorization:      │  auth    │ → verify JWT → req.user
 │          │  Bearer <token> ───▶ │middleware│ → query { user: req.user.id }
 └──────────┘                      └──────────┘
```

---

## ✅ Good-Practice Rules

- ✔️ Validate every input with `express-validator` and return **400** with a clear message list.
- ✔️ Never return the password hash. Use `select: false`.
- ✔️ Every private query filters by `user: req.user.id`. Someone else's data returns **404**, never 403.
- ✔️ All list endpoints paginate (`page` default 1, `limit` default 10, max 50).
- ✔️ Central error handler. No `try/catch` clutter: use an `asyncHandler` wrapper.
- ✔️ Secrets only in `.env`. Commit `.env.example`, never `.env`.
- ✔️ **Test every API in Postman before building its UI.**
- ✔️ Small commits per phase: `feat(phase-3): auth api`.

---

## 🧠 How to Use the Prompts

1. Open your AI tool (GitHub Copilot Chat, Cursor, Claude, ChatGPT…) with the project folder open.
2. Paste the **Master Context Prompt** once at the start of each new chat session.
3. Paste **one phase prompt at a time**, in order. Do not skip phases.
4. After each phase, run the **✅ Checkpoint**. Only move on when it passes.
5. If something breaks, use the [Bug-Fix Prompt Library](#-bug-fix-prompt-library).
6. Commit after every successful phase.

> [!TIP]
> **Copilot users:** use Copilot Chat in *Agent / Edit mode* for phases that create many files, and reference files with `#file:server/models/Note.js` or `@workspace` so it sees your existing code.

---

## 🪄 Master Context Prompt (paste this first, every time)

```text
You are a senior MERN-stack engineer helping me build "InkVault", a notes keeper app.

STACK
- Backend: Node.js + Express, Mongoose, bcryptjs, jsonwebtoken, dotenv, cors, express-validator, helmet, morgan.
- Frontend: React (Vite), React Router v6, Axios, Context API, Tailwind CSS, Framer Motion, lucide-react, react-hot-toast.
- DB: MongoDB Atlas. Deploy: Render (API), Vercel (client).

FOLDERS
- server/ -> config, models, controllers, routes, middleware, utils
- client/src/ -> pages, components, services, context, hooks, routes, styles

RULES YOU MUST ALWAYS FOLLO
1. Use ES Modules (import/export) on both server and client.
2. Auth: JWT sent as "Authorization: Bearer <token>". Every route except register and login is protected by auth middleware.
3. Every database query for private data MUST filter by the logged-in user (user: req.user.id). Another user's document returns 404.
4. Validate all input with express-validator. Return proper status codes: 200, 201, 400, 401, 404 (and 409 for duplicates, 500 for server errors).
5. Response shape: { success, message, data } and for lists also { pagination: { page, limit, total, totalPages } }.
6. All list endpoints support pagination with ?page and ?limit (default 10, max 50).
7. Secrets only in .env. Never hardcode secrets.
8. Write clean, commented, beginner-readable code. No unused code.
9. Design palette: Aqua Alloy #2FAF9A, Peach Shell #FF9F86, Mist Porcelain #FDF2F0, and Shadow Ink #1B3A3C. Use opacity for tints.
10. When I ask for a phase, generate ONLY that phase's files, list every file path you created or changed, and end with a short "How to test" section.

Reply "Ready" and wait for my first phase prompt.
```

---

## 🚀 Phase-wise Build Prompts

> **Legend:** 🎯 Goal · 📁 Files · 💬 Prompt · ✅ Checkpoint

---

### 🌱 PHASE 0 — Project Setup & Repository

🎯 **Goal:** Create the workspace, Git repo, and base folders.

💬 **Prompt**
```text
PHASE 0 - Project setup.

Create a monorepo named "inkvault" with two folders: server/ and client/.
1. In server/: initialize npm with "type": "module". Install dependencies: express, mongoose, bcryptjs, jsonwebtoken, dotenv, cors, express-validator, helmet, morgan. Install dev dependency: nodemon.
2. Add scripts: "start": "node server.js" and "dev": "nodemon server.js".
3. Create the empty folders: config, models, controllers, routes, middleware, utils.
4. Create server/.env.example with: PORT=5000, MONGO_URI=, JWT_SECRET=, JWT_EXPIRES_IN=7d, CLIENT_URL=http://localhost:5173, NODE_ENV=development.
5. Create a root .gitignore that ignores node_modules, .env, dist, .DS_Store.
6. Give me the exact terminal commands to run, plus git init and the first commit message.
Do not create any application code yet.
```

✅ **Checkpoint:** `npm run dev` is defined, folders exist, `.env` is git-ignored.

---

### 🧱 PHASE 1 — Server Bootstrap & Database Connection

🎯 **Goal:** Express server running and connected to MongoDB Atlas.

💬 **Prompt**
```text
PHASE 1 - Server bootstrap.

Create these files in server/:
1. config/db.js - connectDB() using mongoose.connect(process.env.MONGO_URI), log the host on success, exit process on failure.
2. app.js - create the Express app with helmet, cors (origin from CLIENT_URL, credentials true), express.json(), morgan("dev") only in development. Add a public GET /api/health route returning { success: true, message: "InkVault API is running" }. Add a 404 handler for unknown routes and mount the error handler last.
3. middleware/errorHandler.js - a notFound middleware (404) and a central errorHandler that handles Mongoose ValidationError (400), CastError for invalid ObjectId (400), duplicate key code 11000 (409), JsonWebTokenError and TokenExpiredError (401), and defaults to 500. Hide stack traces in production.
4. utils/asyncHandler.js - wrapper that forwards async errors to next().
5. server.js - load dotenv, connect DB, then start listening on PORT.

Also explain step by step how to create a free MongoDB Atlas M0 cluster, create a database user, allow network access 0.0.0.0/0, and copy the connection string into .env as MONGO_URI (database name: inkvault).
```

✅ **Checkpoint:** `GET http://localhost:5000/api/health` returns 200 in Postman and the console shows "MongoDB connected".

---

### 🧬 PHASE 2 — Mongoose Models

🎯 **Goal:** Create User, Category, and Note schemas.

💬 **Prompt**
```text
PHASE 2 - Mongoose models.

Create three models in server/models/ with timestamps enabled.

1. User.js: name (required, 2-50), email (required, unique, lowercase, trimmed, email regex), password (required, minlength 6, select:false). Add a pre-save hook that hashes the password with bcryptjs (salt rounds 10) only when modified. Add an instance method comparePassword(candidate).

2. Category.js: user (ObjectId ref User, required, index), name (required, trim, max 30), color (enum: violet, mint, coral, gold, navy; default violet), icon (String, default "folder"). Add a compound unique index on { user, name }.

3. Note.js: user (ObjectId ref User, required, index), category (ObjectId ref Category, default null), title (required, trim, max 100), content (required, max 10000), color (same enum, default navy), tags (array of trimmed lowercase strings, max 8 items via validator), status (enum: active, pinned, archived, trashed; default active). Add a text index on title, content and tags with weights (title 5, tags 3, content 1). Add a compound index on { user, status, createdAt: -1 }.

Also create utils/paginate.js exporting getPagination(query) that returns { page, limit, skip } with defaults page 1, limit 10, max limit 50, and buildPagination(total, page, limit) that returns { page, limit, total, totalPages }.
```

✅ **Checkpoint:** Server still starts with no schema errors.

---

### 🔐 PHASE 3 — Authentication APIs (3)

🎯 **Goal:** Register, Login, Me — with bcrypt and JWT.

💬 **Prompt**
```text
PHASE 3 - Authentication API.

Create:
1. utils/generateToken.js - signs a JWT with { id } using JWT_SECRET and JWT_EXPIRES_IN.
2. middleware/validate.js - a reusable middleware that reads express-validator results and returns 400 with { success:false, message:"Validation failed", errors:[{field, message}] }.
3. middleware/authMiddleware.js - protect(): read "Authorization: Bearer <token>", return 401 if missing or invalid, verify the JWT, load the user (without password), return 401 if the user no longer exists, attach to req.user.
4. controllers/authController.js:
   - register: check duplicate email -> 409, create user, return 201 with { token, user } (no password).
   - login: find user by email with +password, compare, return 401 "Invalid email or password" for either failure (do not reveal which), otherwise 200 with { token, user }.
   - getMe: return 200 with req.user.
5. routes/authRoutes.js:
   - POST /register (validate: name 2-50, valid email, password min 6)
   - POST /login (validate: valid email, password not empty)
   - GET /me (protected)
6. Mount at /api/auth in app.js.

Show sample Postman request bodies and expected responses for all 3 endpoints.
```

✅ **Checkpoint (Postman):**
| Test | Expected |
|---|---|
| Register valid | 201 + token |
| Register same email | 409 |
| Register bad email | 400 |
| Login wrong password | 401 |
| Login correct | 200 + token |
| GET /me without token | 401 |
| GET /me with `Bearer <token>` | 200 |

---

### 📝 PHASE 4 — Notes CRUD APIs (5)

🎯 **Goal:** Full notes CRUD, private per user, paginated.

💬 **Prompt**
```text
PHASE 4 - Notes CRUD.

Create controllers/noteController.js and routes/noteRoutes.js. Apply protect middleware to ALL note routes. Mount at /api/notes.

Endpoints:
1. POST / - validate title (required, max 100), content (required, max 10000), optional color (enum), tags (array, max 8), category (valid Mongo id). If category is provided, verify it belongs to the logged-in user, otherwise return 400. Create note with user: req.user.id. Return 201.
2. GET / - list ONLY the logged-in user's notes where status is not "trashed" by default, sorted by pinned first then newest. Support ?page and ?limit using utils/paginate. Populate category name and color. Return 200 with data and pagination.
3. GET /:id - validate id with isMongoId (400), find by { _id, user: req.user.id }, return 404 if not found.
4. PUT /:id - same ownership check, allow updating title, content, color, tags, category. Use runValidators and return the updated note. 404 if not found.
5. DELETE /:id - ownership check, permanently delete, return 200 with a message. 404 if not found.

IMPORTANT: leave room for special routes (/search, /stats, /filter, /:id/status) to be registered BEFORE /:id later. Add a comment in the routes file marking the place.
Use asyncHandler everywhere. Give Postman examples and a list of test cases including a second user trying to read the first user's note (must be 404).
```

✅ **Checkpoint:** Create 12 notes, check `?page=2&limit=5`, and verify user B can't see user A's notes.

---

### 🗂️ PHASE 5 — Categories CRUD APIs (5)

🎯 **Goal:** Supporting resource with full CRUD.

💬 **Prompt**
```text
PHASE 5 - Categories CRUD.

Create controllers/categoryController.js and routes/categoryRoutes.js. Protect all routes. Mount at /api/categories.

1. POST / - validate name (1-30), color (enum), icon (string). Duplicate name for the same user -> 409. Return 201.
2. GET / - list only my categories, paginated (?page, ?limit default 20), sorted by name. For each category include noteCount (use an aggregation or countDocuments on non-trashed notes owned by the user).
3. GET /:id - ownership check, 404 if missing.
4. PUT /:id - ownership check, validate, handle duplicate name (409).
5. DELETE /:id - ownership check. Before deleting, set category to null on all of this user's notes that used it. Return 200.

Give Postman examples and test cases (duplicate name, foreign user's category, deleting a category that has notes).
```

✅ **Checkpoint:** Deleting a category keeps its notes and sets `category: null`.

---

### ⚡ PHASE 6 — Special APIs (4): Search, Status, Stats, Filter

🎯 **Goal:** Add the app's "smart" features.

💬 **Prompt**
```text
PHASE 6 - Special note APIs. Add to noteController.js and noteRoutes.js. Register these routes BEFORE "/:id" so they are not captured as ids.

1. GET /search?q=&page=&limit= 
   - q is required (min 1 char) else 400.
   - Use MongoDB $text search restricted to { user: req.user.id, status: { $ne: "trashed" } }, sorted by text score, paginated. If $text returns nothing for partial words, fall back to a case-insensitive regex on title, content and tags (escape regex special characters).

2. PATCH /:id/status
   - body: { status } must be one of active, pinned, archived, trashed, else 400.
   - Ownership check, 404 if missing. Return the updated note. This powers pin, archive, trash and restore.

3. GET /stats
   - Use aggregation scoped to the logged-in user. Return:
     total (excluding trashed), counts per status, counts per color, counts per category (with category name), and notesLast7Days as an array of { date: "YYYY-MM-DD", count } including days with 0.
   - Response example shape: { totals:{ total, active, pinned, archived, trashed }, byColor:[...], byCategory:[...], last7Days:[...] }.

4. GET /filter?category=&color=&status=&tag=&from=&to=&sort=&page=&limit=
   - All params optional and combinable. Always scoped to the logged-in user.
   - Validate: category isMongoId, color/status enums, from/to valid ISO dates (from <= to), sort in [newest, oldest, title]. 400 on invalid values.
   - Default status filter excludes "trashed" unless status=trashed is requested.
   - Paginated with pagination metadata.

Also update GET / so status=trashed notes are excluded but can be listed via /filter?status=trashed. Provide a Postman test table for every special endpoint.
```

✅ **Checkpoint:** `stats` returns correct numbers, `search?q=` works, status change to `trashed` hides note from `GET /`.

---

### 🧪 PHASE 7 — Postman Testing & Backend Hardening

🎯 **Goal:** Prove all 17 APIs work before touching React.

💬 **Prompt**
```text
PHASE 7 - Postman collection and hardening.

1. Generate a complete Postman collection JSON (v2.1) named "InkVault API" with folders: Auth, Notes, Categories, Special. Include all 17 endpoints with example bodies.
2. Generate a Postman environment JSON with variables: baseUrl (http://localhost:5000/api), token, noteId, categoryId.
3. Add test scripts: after register/login save pm.environment "token"; after create note/category save noteId/categoryId; add status code assertions (201/200/400/401/404) for every request. Use Bearer token auth at the collection level referencing {{token}}.
4. Add express-rate-limit to /api/auth routes (100 requests per 15 minutes).
5. Review the server code and list any security or validation gaps (mass-assignment, missing ownership checks, missing indexes, leaking fields) and fix them.
6. Save files under postman/ at the repo root.
```

✅ **Checkpoint:** Run the Postman collection runner: **all tests green** ✅. 🚦 *Do not start the frontend until this passes.*

| # | Endpoint | Status |
|---|---|---|
| 1–3 | Auth | ⬜ |
| 4–8 | Notes CRUD | ⬜ |
| 9–13 | Categories CRUD | ⬜ |
| 14–17 | Special | ⬜ |

---

### 🎨 PHASE 8 — Client Setup & Aqua Alloy and Peach Shell Design System

🎯 **Goal:** Vite + React + Tailwind + theme + reusable UI kit.

💬 **Prompt**
```text
PHASE 8 - Frontend setup and design system.

1. In client/ create a Vite React app. Install: react-router-dom, axios, framer-motion, lucide-react, react-hot-toast, canvas-confetti, tailwindcss with postcss and autoprefixer. Configure Tailwind.
2. tailwind.config.js: extend the design colors with ink #1B3A3C, violet #2FAF9A, cyber #2FAF9A, mint #2FAF9A, coral #FF9F86, and honey #FDF2F0. Keep semantic aliases on these same values for existing components. Add fonts Poppins (display) and Inter (body) via Google Fonts in index.html. Add custom keyframes and animation utilities.
3. styles/index.css: dark theme, body background ink with text white/95. Add utility classes: .glass (bg-white/5, backdrop-blur, border white/10), .gradient-text (violet to mint), .glow-violet (violet shadow), and custom scrollbar styles.
4. styles/animations.css: implement (a) shimmer skeleton, (b) animated gradient border using conic-gradient rotating, (c) ripple effect for buttons, (d) drawStroke for SVG logo paths, (e) floating aurora blob animation. Add a @media (prefers-reduced-motion: reduce) block that disables all animations.
5. Build reusable components in components/ui/: Button (variants: primary Aqua Alloy, ghost, Peach Shell accent; loading spinner; ripple; whileTap scale), Input (floating label, animated gradient border on focus, error message), Modal (backdrop blur, spring animation), Skeleton, EmptyState (with floating icon), Logo (an SVG pen/ink-drop whose stroke draws itself, with the text "InkVault").
6. components/layout/AuroraBackground.jsx: fixed background with 3 blurred blobs (violet, mint, coral at low opacity) slowly floating.
7. Create client/.env.example with VITE_API_URL=http://localhost:5000/api.
Show a temporary demo page rendering every UI component so I can visually check them.
```

✅ **Checkpoint:** Demo page shows the four brand colors, floating blobs, shimmer, and animated logo.

---

### 🔌 PHASE 9 — Services, Auth Context & Routing

🎯 **Goal:** Connect the client to the API and protect routes.

💬 **Prompt**
```text
PHASE 9 - Services, context and routing.

1. services/api.js - Axios instance with baseURL from import.meta.env.VITE_API_URL. Request interceptor adds "Authorization: Bearer <token>" from localStorage. Response interceptor: on 401 clear token and redirect to /login.
2. services/authService.js (register, login, getMe), services/noteService.js (getNotes, getNote, createNote, updateNote, deleteNote, searchNotes, changeStatus, getStats, filterNotes), services/categoryService.js (full CRUD). Each returns response.data.
3. context/AuthContext.jsx - state: user, token, loading. Functions: register, login, logout. On app load, if a token exists, call getMe to restore the session. Expose via hooks/useAuth.js.
4. routes/ProtectedRoute.jsx - shows a full-page skeleton while loading, redirects to /login if not authenticated. Add a PublicRoute that redirects logged-in users to /dashboard.
5. routes/AppRoutes.jsx with React Router v6: /login, /register (public); /dashboard, /notes, /archive, /trash, /categories (protected); * -> NotFound. Wrap route changes in AnimatePresence with a fade + slide page transition component.
6. components/layout/AppShell.jsx - Navbar (logo, search box, user avatar menu with logout) + Sidebar (Dashboard, All Notes, Categories, Archive, Trash with lucide icons and an animated active indicator using layoutId) + AuroraBackground. Sidebar collapses to a bottom tab bar on mobile.
7. Wrap the app with BrowserRouter, AuthProvider and a themed <Toaster />.
```

✅ **Checkpoint:** Visiting `/dashboard` while logged out redirects to `/login`. Refresh keeps you logged in.

---

### 🔑 PHASE 10 — Login & Register Pages

🎯 **Goal:** Beautiful, animated, validated auth screens.

💬 **Prompt**
```text
PHASE 10 - Login and Register pages.

Build pages/Login.jsx and pages/Register.jsx:
- Split layout: left side is a hero with the animated Logo, a tagline "Write it. Pin it. Never lose it.", and 3 floating sticky-note illustrations (violet, mint, honey gold) that gently bob up and down using Framer Motion. Right side is a glass card with the form.
- Register fields: name, email, password, confirm password. Login fields: email, password with a show/hide eye toggle.
- Client-side validation (required, email format, min 6 password, passwords match) with inline error messages that slide in.
- Show a password strength bar (coral -> honey -> mint).
- Submit button shows a loading spinner. On success: toast, navigate to /dashboard. On API error: show the server message in a toast and shake the form once (Framer Motion).
- Link between the two pages. Fully responsive.
- Stagger the entrance of form fields.
```

✅ **Checkpoint:** Register → auto-login → dashboard. Wrong password shows an error and shakes the card.

---

### 🏠 PHASE 11 — Dashboard & Stats UI

🎯 **Goal:** A dashboard powered by the `/stats` API.

💬 **Prompt**
```text
PHASE 11 - Dashboard page using GET /api/notes/stats.

1. pages/Dashboard.jsx - greeting "Good morning/afternoon/evening, <name>" with a wave emoji that animates.
2. components/stats/StatCard.jsx - shows icon, label, and a count-up animated number (animate from 0 on mount). Four cards: Total Notes (violet), Pinned (honey gold), Archived (mint), Trashed (coral). Cards fade in with stagger and lift on hover.
3. components/stats/StatsPanel.jsx - a 7-day activity bar chart built with plain SVG or divs (no chart library) where bars grow from the bottom with a stagger, using violet-to-mint gradient. Show a tooltip with date and count on hover.
4. A "Notes by color" horizontal bar or donut built with SVG using the five palette colors, and "Top categories" list with progress bars.
5. A "Recent notes" strip showing the latest 5 notes as small cards and a big "+ New Note" floating action button (gradient, pulsing glow).
6. Loading state: skeleton shimmer for all sections. Empty state: friendly EmptyState with CTA "Write your first note".
```

✅ **Checkpoint:** Numbers match Postman `/stats` output. Counters animate.

---

### 📒 PHASE 12 — Notes UI (CRUD, Pin, Archive, Trash)

🎯 **Goal:** The core notes experience.

💬 **Prompt**
```text
PHASE 12 - Notes UI.

1. context/NotesContext.jsx - holds notes list, pagination, loading, and actions (fetch, create, update, remove, changeStatus) that call noteService and update state optimistically, rolling back on error with an error toast.
2. components/notes/NoteCard.jsx - glass card tinted by note.color (translucent palette tint), shows title, 4-line clipped content, tags as small pills, category badge, relative date, and hover actions: Pin (honey gold star/pin), Archive, Trash, Edit. Hover: lift + violet glow. Pinned notes show a small pin badge that bounces once when pinned (spring animation).
3. components/notes/NoteGrid.jsx - responsive masonry-like grid (1/2/3/4 columns). Use Framer Motion layout animations so cards smoothly re-flow when notes are added, removed, or reordered. Stagger entrance. Use AnimatePresence for exit: on delete the card shakes, then shrinks and fades.
4. components/notes/NoteEditor.jsx - a Modal editor with shared-layout expand animation from the clicked card (layoutId). Fields: title, content (auto-growing textarea), tag input (press Enter to add chips, max 8), category select, ColorPicker (5 palette dots with a selected ring animation). Save via create or update. Show character counter. Ctrl+Enter saves, Esc closes.
5. pages/Notes.jsx - header with title, "+ New Note" button, grid, "Load more" button or pagination controls using the API pagination data. Show skeletons while loading and EmptyState when empty.
6. pages/Archive.jsx and pages/Trash.jsx - same grid. Archive card action: Unarchive. Trash card actions: Restore and Delete forever (with a confirm Modal). Add an "Empty trash" button with confirmation.
7. Fire canvas-confetti (using only the five palette colors) the first time the user creates their very first note.
```

✅ **Checkpoint:** Create, edit, pin, archive, trash, restore, and permanently delete all work with animations and toasts.

---

### 🗂️ PHASE 13 — Categories, Search & Filters UI

🎯 **Goal:** Wire up Resource 2 and the remaining special APIs.

💬 **Prompt**
```text
PHASE 13 - Categories, search and filters.

1. pages/Categories.jsx + components/categories/CategoryList.jsx and CategoryForm.jsx - grid of category cards (icon, color, name, note count). Create/edit in a Modal with name, color picker and an icon picker (a grid of 12 lucide icons). Delete with confirm and a note that notes will become uncategorized. Add category creation from inside the NoteEditor via a small "+ New" button.
2. Clicking a category card opens /notes?category=<id>.
3. Navbar search: components use hooks/useDebounce.js (400 ms) to call GET /notes/search. Show results in a dropdown panel with highlighted matches (wrap matched text in a mint highlight), keyboard navigation (up/down/enter), and a "No results" empty state. Pressing Enter opens a full results view on /notes?q=...
4. components/notes/NoteFilters.jsx on the Notes page: chips/dropdowns for category, color (5 dots), status, tag, date range, and sort (newest, oldest, title). All filters are synced to the URL query string and call GET /notes/filter. Show active filters as removable animated chips and a "Clear all" button.
5. Keep the pagination component in sync with the filters, resetting to page 1 whenever a filter changes.
```

✅ **Checkpoint:** Filters combine correctly and survive page refresh via URL params.

---

### 🌟 PHASE 14 — Animation & UX Polish

🎯 **Goal:** Make it feel premium and iconic.

💬 **Prompt**
```text
PHASE 14 - Animation and UX polish. Review the entire client and implement or improve the following without breaking existing code:

1. Pen-writing logo: the SVG stroke draws itself on first load, then the ink drop fills with the violet-to-mint gradient.
2. Aurora background blobs: 3 blobs drifting on different durations (20s, 26s, 32s) with slight scale changes; pause when the tab is hidden.
3. Page transitions: consistent fade + 12px slide, 250 ms ease-out.
4. Button micro-interactions: ripple on click, whileTap scale 0.96, subtle gradient shift on hover.
5. Input focus: rotating conic-gradient border in violet and mint.
6. Toasts: themed glass toasts with icon, slide in from top-right, and coral/mint color per type.
7. Skeleton shimmer everywhere data loads; no layout jumps (reserve heights).
8. Number count-up on the dashboard and on the notes count in the sidebar.
9. Cursor spotlight: a soft violet radial glow that follows the mouse over note cards (CSS variables updated on mousemove).
10. Empty states with floating illustrations.
11. Respect prefers-reduced-motion: disable float, shimmer, confetti and parallax; keep only opacity fades.
12. Accessibility: visible focus rings (violet), aria-labels on icon buttons, keyboard-accessible modals with focus trap, and color contrast at least 4.5:1 for text.
13. Responsive check at 360px, 768px and 1280px.
List every file changed and what animation was added.
```

✅ **Checkpoint:** 60 FPS feel, no console warnings, reduced-motion respected.

---

### 🧹 PHASE 15 — Final QA, Cleanup & Documentation

🎯 **Goal:** Production-ready code.

💬 **Prompt**
```text
PHASE 15 - Final review.

1. Audit the whole project against this checklist and fix problems: every private route protected; every query scoped to req.user.id; input validation on all POST/PUT/PATCH; pagination on all lists; proper status codes; no secrets committed; .env.example files complete; no console.log left; no unused imports; consistent error messages.
2. Add loading and error states to any page missing them; add an ErrorBoundary to the client.
3. Add an axios request timeout (15 s) and a friendly "Server is waking up, please wait" toast for slow first requests (Render free tier sleeps).
4. Write a manual test plan table (feature, steps, expected result) for the final demo.
5. Update README.md: project screenshots placeholders, features, env variables tables, local setup steps, API table, live links placeholders.
```

✅ **Checkpoint:** Fresh clone → `npm install` → `npm run dev` works for both server and client using the `.env.example` files.

---

### ☁️ PHASE 16 — Deployment (All Free)

🎯 **Goal:** Live app on the internet.

💬 **Prompt**
```text
PHASE 16 - Deployment guide and config.

Give me exact, click-by-click steps plus any files needed for:

1. MongoDB Atlas: confirm free M0 cluster, DB user, network access 0.0.0.0/0, final connection string format for production.
2. Render (API): create a Web Service from my GitHub repo, root directory "server", build command "npm install", start command "npm start", Node version, and environment variables (NODE_ENV=production, MONGO_URI, JWT_SECRET, JWT_EXPIRES_IN, CLIENT_URL = my Vercel URL). Explain the cold-start behavior of the free plan and a health-check path /api/health.
3. Vercel (client): import repo, root directory "client", framework Vite, build "npm run build", output "dist", env VITE_API_URL = https://<render-app>.onrender.com/api. Create client/vercel.json with a rewrite so React Router deep links do not 404. (Also give the equivalent client/public/_redirects file for Netlify.)
4. Update CORS in server/app.js so it allows the production client URL and localhost for development.
5. A post-deploy smoke test checklist: register, login, create note, pin, search, filter, stats, refresh on a deep link, logout.
6. Common deployment errors and their fixes (CORS error, 401 after login, blank page on refresh, Mongo connection timeout).
```

✅ **Checkpoint:** Live URL registers and logs in a real user, and data persists in Atlas. 🎉

---

## 🛟 Bug-Fix Prompt Library

Copy, fill in the brackets, and paste when something breaks.

**🐞 General error**
```text
I get this error: [paste full error and stack trace].
It happens when: [action]. Relevant files: #file:[path]. 
Explain the root cause in 2 lines, then give the minimal fix only for the affected lines.
```

**🔒 Auth / 401 problems**
```text
My protected API returns 401 even after login. Check authMiddleware, generateToken, the JWT_SECRET usage, the Authorization header format in the Axios interceptor, and token storage. List the most likely causes in order and fix them.
```

**🌐 CORS problems**
```text
The browser shows a CORS error calling my API from [client URL]. Review cors config in server/app.js and make it work for localhost:5173 and my production URL with credentials and the Authorization header allowed.
```

**🧭 Route order problem**
```text
GET /api/notes/stats returns a CastError for ObjectId. Reorder the routes in noteRoutes.js so special routes come before /:id and explain why.
```

**🎬 Animation glitch**
```text
The [animation name] on [component] stutters / does not play. Review the Framer Motion or CSS code, check for missing keys in AnimatePresence, layout thrash, and animating non-GPU properties. Rewrite using transform and opacity only.
```

**♻️ Refactor**
```text
Refactor #file:[path] for readability without changing behavior: extract repeated logic, add JSDoc comments, and keep the same exports.
```

**🧪 Test generation**
```text
Write Postman tests (pm.test scripts) for [endpoint] covering success, validation failure (400), missing token (401), and not-found or foreign resource (404).
```

---

## 📊 Progress Tracker

- [ ] **Phase 0** — Setup
- [ ] **Phase 1** — Server & DB
- [ ] **Phase 2** — Models
- [ ] **Phase 3** — Auth APIs (3)
- [ ] **Phase 4** — Notes CRUD (5)
- [ ] **Phase 5** — Categories CRUD (5)
- [ ] **Phase 6** — Special APIs (4)
- [ ] **Phase 7** — Postman tests all green
- [ ] **Phase 8** — Client setup & design system
- [ ] **Phase 9** — Services, context, routing
- [ ] **Phase 10** — Login & Register
- [ ] **Phase 11** — Dashboard & stats
- [ ] **Phase 12** — Notes UI
- [ ] **Phase 13** — Categories, search, filters
- [ ] **Phase 14** — Animation polish
- [ ] **Phase 15** — QA & docs
- [ ] **Phase 16** — Deployment 🚀

---

## 🔧 Environment Variables

**server/.env**
| Key | Example | Purpose |
|---|---|---|
| `PORT` | `5000` | API port |
| `MONGO_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/inkvault` | Atlas connection |
| `JWT_SECRET` | long random string | Signs tokens |
| `JWT_EXPIRES_IN` | `7d` | Token lifetime |
| `CLIENT_URL` | `http://localhost:5173` | CORS origin |
| `NODE_ENV` | `development` | Environment |

**client/.env**
| Key | Example |
|---|---|
| `VITE_API_URL` | `http://localhost:5000/api` |

---

## 🏃 Quick Start (after the build)

```bash
# 1. Clone
git clone <your-repo-url> inkvault && cd inkvault

# 2. Backend
cd server && cp .env.example .env   # fill in values
npm install && npm run dev

# 3. Frontend (new terminal)
cd client && cp .env.example .env
npm install && npm run dev
```

Open **http://localhost:5173** ✨

---

<div align="center">

**Built phase-by-phase with AI · Aqua Alloy · Peach Shell · Mist Porcelain · Shadow Ink**

*Made with ✒️ InkVault*

</div>
