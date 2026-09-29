# InkVault

InkVault is a MERN notes workspace for capturing, organizing, and finding notes. The client uses React, Vite, Tailwind CSS, and Framer Motion; the API uses Express and MongoDB/Mongoose with JWT authentication.

Start with the [documentation home](docs/index.md) for setup, usage, API, and deployment guides.

For a quick project overview, local setup steps, admin instructions, and the selected color palette, see the [Notes Keeper guide](NOTES_KEEPER_GUIDE.md).

## Screenshots

Replace these placeholders with current product screenshots before publishing.

| Dashboard | Notes and filters |
| --- | --- |
| ![Dashboard screenshot placeholder](docs/screenshots/dashboard.png) | ![Notes screenshot placeholder](docs/screenshots/notes.png) |
| Categories | Note editor |
| ![Categories screenshot placeholder](docs/screenshots/categories.png) | ![Note editor screenshot placeholder](docs/screenshots/note-editor.png) |

## Features

- Register, sign in, and restore a JWT-backed session.
- Create and edit notes with four palette colors, tags, categories, pinning, archive, and trash actions.
- Search notes with debounced suggestions and filter by category, color, status, tag, date, and sort order.
- Browse category cards with note counts and custom icons and colors.
- View dashboard totals, activity, note colors, and popular categories.
- Paginated note and category lists, responsive layouts, reduced-motion support, and loading/error states.

## Design palette

The interface uses four colors with clear, restrained roles:

| Color | Hex | Use |
| --- | --- | --- |
| Aqua Alloy | `#2FAF9A` | Brand, primary buttons, and success accents |
| Peach Shell | `#FF9F86` | Warm highlights and secondary accents |
| Mist Porcelain | `#FDF2F0` | Main text and light details |
| Shadow Ink | `#1B3A3C` | Page, navbar, and card backgrounds |

## Live links

- Client: [Deployment URL placeholder](https://your-inkvault-client.example.com)
- API: [Deployment URL placeholder](https://your-inkvault-api.example.com)
- Health check: `https://your-inkvault-api.example.com/api/health`

Replace the example links with the deployed URLs.

For provider setup, production environment variables, CORS, SPA rewrites, smoke tests, and troubleshooting, follow the [deployment guide](DEPLOYMENT.md).

## Environment variables

Create the environment files from the checked-in examples. Never commit real credentials.

### Server (`server/.env`)

| Variable | Required | Description | Example |
| --- | --- | --- | --- |
| `PORT` | No | HTTP port; hosting providers may supply this. | `5000` |
| `MONGO_URI` | Yes | MongoDB connection string. | `mongodb://127.0.0.1:27017/inkvault` |
| `JWT_SECRET` | Yes | Long, random secret used to sign session tokens. | Generate a private random value. |
| `JWT_EXPIRES_IN` | No | Token lifetime. Defaults to `7d`. | `7d` |
| `CLIENT_URL` | Yes | Exact origin allowed by CORS. | `http://localhost:5173` |
| `ADMIN_EMAIL` | No | Email address granted the first admin role at registration or next sign in. Set this before creating that account. | `admin@example.com` |
| `NODE_ENV` | No | Runtime mode. | `development` |

### Client (`client/.env`)

| Variable | Required | Description | Example |
| --- | --- | --- | --- |
| `VITE_API_URL` | No | API base URL, including `/api`. | `http://localhost:5000/api` |

Vite embeds `VITE_*` values in the browser bundle. Do not put secrets in client environment variables.

## Local setup

Requirements: Node.js, npm, and a reachable MongoDB instance (local or MongoDB Atlas).

After dependencies are installed in both `server/` and `client/`, and `server/.env` is configured, you can start both services from the project root in one terminal with `npm run dev`. The web app is at `http://localhost:5173` and the API health check is at `http://localhost:5000/api/health`. Press Ctrl+C to stop both services. The separate-terminal steps below are an alternative that installs and starts each service individually.

1. Copy `server/.env.example` to `server/.env` and fill in `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL`.
2. Copy `client/.env.example` to `client/.env`. Set `VITE_API_URL` if the API is not at the local default.
3. Install and start the API in one terminal:

   ```sh
   cd server
   npm install
   npm run dev
   ```

4. Install and start the client in another terminal:

   ```sh
   cd client
   npm install
   npm run dev
   ```

5. Open the Vite URL shown in the client terminal (normally `http://localhost:5173`). The API health endpoint is `http://localhost:5000/api/health`.

To create the first administrator, set `ADMIN_EMAIL` in `server/.env` to the email you will register with, restart the API, and register or sign in using that account. The admin page lets administrators list users, change another user's role, suspend or restore account access, review all users' notes, and permanently delete a note. Suspended users are denied new logins and current API access. Keep `ADMIN_EMAIL` private and use an email account you control; this app does not verify email ownership.

For a production client build, run `npm run build` from `client/`; serve the generated `client/dist` directory with a static host. Run the API with `npm start` from `server/` and set its production environment variables in the host dashboard.

## API overview

All routes are prefixed with `/api`. Private routes require `Authorization: Bearer <token>`. List endpoints accept `page` and `limit` and return pagination metadata; the API caps `limit` at 50.

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/health` | Public | API health check. |
| `POST` | `/auth/register` | Public | Create an account. |
| `POST` | `/auth/login` | Public | Sign in and receive a token. |
| `GET` | `/auth/me` | Private | Get the current user. |
| `GET` | `/admin/users` | Admin | List accounts, paginated. |
| `PATCH` | `/admin/users/:id/role` | Admin | Change another account's role. |
| `PATCH` | `/admin/users/:id/access` | Admin | Suspend or restore another account. |
| `GET` | `/admin/notes` | Admin | List all users' notes, paginated. |
| `DELETE` | `/admin/notes/:id` | Admin | Permanently delete a note. |
| `GET` | `/notes` | Private | List all non-trashed notes, paginated. |
| `POST` | `/notes` | Private | Create a note. |
| `GET` | `/notes/search?q=...` | Private | Search notes, paginated. |
| `GET` | `/notes/filter` | Private | Filter and sort notes, paginated. |
| `GET` | `/notes/stats` | Private | Get note totals and dashboard statistics. |
| `GET` | `/notes/:id` | Private | Get an owned note. |
| `PUT` | `/notes/:id` | Private | Update an owned note. |
| `PATCH` | `/notes/:id/status` | Private | Change an owned note's status. |
| `DELETE` | `/notes/:id` | Private | Permanently delete an owned note. |
| `GET` | `/categories` | Private | List owned categories with note counts, paginated. |
| `POST` | `/categories` | Private | Create a category. |
| `GET` | `/categories/:id` | Private | Get an owned category. |
| `PUT` | `/categories/:id` | Private | Update an owned category. |
| `DELETE` | `/categories/:id` | Private | Delete a category and detach its notes. |
| `GET` | `/tags` | Private | List the current user's tags with note counts and pagination. |
| `POST` | `/tags` | Private | Create a tag. |
| `GET` | `/tags/:id` | Private | Get an owned tag and its note count. |
| `PUT` | `/tags/:id` | Private | Rename an owned tag and update its label on the user's notes. |
| `DELETE` | `/tags/:id` | Private | Delete an owned tag and remove its label from the user's notes. |

## Manual demo test plan

| Feature | Steps | Expected result |
| --- | --- | --- |
| Registration | Register with a valid name, email, and password; then try the same email again. | First request creates a session; duplicate email is rejected with a clear message. |
| Login and session restore | Sign out, sign in, reload the page, then sign out again. | Private workspace opens after sign-in and remains available after reload; sign-out returns to login. |
| Private API access | Call `/api/notes` without a token, then with a valid token. | Missing token receives `401`; valid token receives only that account's notes. |
| Note CRUD | Create a note, edit its title/content/color/tags, then reload the list. | Changes persist and the note remains attached to the selected category. |
| Note validation | Submit an empty note, overlong title/content/tag, and an invalid color through the API. | Invalid input receives `400` with validation details; valid values save. |
| Categories | Create a category with a color and icon, edit it, and open its card. | Category appears with the chosen style and count; card opens notes filtered to that category. |
| Tags API | Create a tag, list tags with `page` and `limit`, get one tag, rename it, then delete it. | Tag routes require a JWT, return pagination metadata, renames update matching labels on owned notes, and deletes remove the label from owned notes. |
| Category deletion | Delete a category that has notes and confirm the prompt. | Category is removed and its notes remain, uncategorized. |
| Search | Type a matching phrase, use arrow keys and Enter, then search for a missing phrase. | Suggestions show highlighted matches; Enter opens full results; unmatched search shows an empty state. |
| Filters and pagination | Apply category, color, status, tag, date, and sort filters; go to another page; remove a chip and clear filters. | URL tracks filters, results update, page resets to 1 on filter changes, and clear removes filters. |
| Pin, archive, and restore | Pin a note, archive it, unarchive it, and move it to trash. | Each action updates the right list and dashboard totals. |
| Trash | Restore a trashed note; then permanently delete another and empty the remaining trash. | Restore returns the note to active notes; permanent deletion cannot be undone. |
| Dashboard and loading/error states | Open the dashboard on a slow or unavailable API, then retry when the API is available. | Loading placeholders reserve space; errors offer retry; dashboard metrics load after recovery. |
| Slow API startup | Stop the API, start it again after the first client request begins, and wait for the response. | A friendly “Server is waking up, please wait” toast appears for a slow initial request and clears when it settles. |
| Responsive layouts | Check dashboard, notes, categories, and dialogs at 360px, 768px, and 1280px viewport widths. | Controls wrap without horizontal overflow; mobile navigation and grids adapt; dialogs remain usable. |
| Reduced motion and keyboard access | Enable the OS reduced-motion preference; navigate with Tab/Shift+Tab and Escape through a modal. | Ambient motion, shimmer, parallax, and confetti are suppressed; focus stays inside the open dialog and returns on close. |
