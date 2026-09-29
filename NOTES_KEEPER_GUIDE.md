# InkVault Notes Keeper

> A simple guide to the app, its visual style, local setup, and admin controls.

[Open the app](http://localhost:5173) · [Admin page](http://localhost:5173/admin) · [API health](http://localhost:5000/api/health)

## At a glance

InkVault is a private notes workspace built with React, Express, and MongoDB. Create an account to organize notes with categories, tags, colors, pinning, archive, and trash. Sign in to see your own workspace.

### Brand colors

| Color | Hex | Used for |
| --- | --- | --- |
| Aqua Alloy | `#2FAF9A` | Brand, primary buttons, and success accents |
| Peach Shell | `#FF9F86` | Warm highlights and secondary accents |
| Mist Porcelain | `#FDF2F0` | Main text and light details |
| Shadow Ink | `#1B3A3C` | Page, navbar, and card backgrounds |

### Four palette combinations

| Option | Colors | Style |
| --- | --- | --- |
| Aqua Alloy | `#2FAF9A` | Brand, primary buttons, and success accents |
| 2 · Cool | Deep Navy · Teal · Purple · Soft Pink | Calm and creative |
| 3 · Bright | Indigo · Cyan · Lime Green · Charcoal | Lively and energetic |
| 4 · Warm | Dark Orange · Blue · Teal · Off White | Warm and welcoming |

Option 1 is the active app theme. The other three are palette concepts from the reference image; they are not applied to the app.

The app uses a dark background with restrained motion. It respects the device’s reduced-motion setting.

## Get started locally

### 1. Configure the API

In `server/.env`, set the MongoDB connection string, a private JWT secret, and the client address:

```env
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-private-random-secret
CLIENT_URL=http://localhost:5173
```

To make your account an administrator, set `ADMIN_EMAIL` to the same email address you will use to sign in. This setting is in `server/.env`; keep that file private and never commit or share it. The local project already has `ADMIN_EMAIL` configured.

### 2. Start the API

In a terminal:

```sh
cd server
npm install
npm run dev
```

The API health check is [http://localhost:5000/api/health](http://localhost:5000/api/health).

### 3. Start the website

Open a second terminal:

```sh
cd client
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173), create an account, and sign in.

## Set up and use the admin controls

### Get administrator access

1. Open `server/.env` and set `ADMIN_EMAIL` to the email address for your account. Use an account you control. The address is matched without regard to letter case.
2. Save the file and restart the API so it reads the setting.
3. If you do not have an account for that email yet, register at [http://localhost:5173/register](http://localhost:5173/register). It will be created as an administrator.
4. If the account already exists, sign out and sign back in. The API grants the configured address administrator access at login.
5. Open [http://localhost:5173/admin](http://localhost:5173/admin). Admin accounts also see an **Admin** link in the top navigation.

If the Admin link does not appear, check that the email used to sign in matches `ADMIN_EMAIL`, restart the API, and sign in again. Do not change a user's role directly in the database as a workaround.

### User controls

In the **Users** tab, an administrator can review accounts and their access status, then:

- **Make admin**: grant another account administrator access.
- **Remove admin**: change another administrator back to a regular user.
- **Suspend**: block another account from signing in and using the API.
- **Restore access**: allow a suspended account to sign in and use the API again.

The list is paginated. Controls for your own account are not shown, and the API also rejects self-demotion or self-suspension to prevent accidental lockout.

### All notes controls

In **All notes**, an administrator can review notes from every account, see each note's owner and last update date, and permanently delete a note. Permanent deletion cannot be undone. Regular users can only access their own notes through the normal notes pages and API.

Admin access is enforced by the API as well as the page, so hiding the Admin link does not grant or revoke permissions. Keep `ADMIN_EMAIL` and the server environment private. This app does not verify email ownership; only configure an address you control.

## Main pages

| Page | What it does |
| --- | --- |
| Home | Introduces the app and links to the notes and workspace features. |
| All Notes | Search, filter, create, and edit notes. |
| Categories | Group notes into named collections. |
| Archive | Keep notes out of the main list without deleting them. |
| Trash | Restore or permanently delete trashed notes. |
| Admin | Manage accounts and review all notes; admin access required. |

## API routes

All API paths start with `/api`. Private routes require a bearer token. Admin routes require an admin account as well.

| Method | Path | Access |
| --- | --- | --- |
| `POST` | `/auth/register` | Public |
| `POST` | `/auth/login` | Public |
| `GET` | `/auth/me` | Signed in |
| `GET` | `/admin/users` | Admin |
| `PATCH` | `/admin/users/:id/role` | Admin |
| `PATCH` | `/admin/users/:id/access` | Admin |
| `GET` | `/admin/notes` | Admin |
| `DELETE` | `/admin/notes/:id` | Admin |

See [README.md](README.md) for the complete API reference and manual feature checklist. See [DEPLOYMENT.md](DEPLOYMENT.md) for production hosting instructions.

## Project layout

```text
client/   React website and page components
server/   Express API, authentication, and MongoDB models
postman/  API request collection
```
