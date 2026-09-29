# InkVault documentation

> Your starting point for setting up, using, and deploying InkVault.

InkVault is a private notes workspace for capturing ideas and keeping them organized. Create an account to write notes, group them with categories and tags, and find them later with search and filters.

## Choose a path

| I want to… | Start here |
| --- | --- |
| Understand what InkVault does and how it looks | [Project overview and feature list](../README.md#features) |
| Run the app on my computer | [Local setup](../README.md#local-setup) |
| Use the workspace and admin tools | [Notes Keeper guide](../NOTES_KEEPER_GUIDE.md) |
| Connect to the API | [API overview](../README.md#api-overview) |
| Publish the app | [Deployment guide](../DEPLOYMENT.md) |
| Explore the original implementation notes | [Build notes](../notes.md) |

## What you can do

- Write and edit private notes with colors, tags, categories, and pinning.
- Search and filter notes, then archive, restore, or move them to trash.
- Review note totals and activity on the dashboard.
- Manage accounts and review notes across the app with an administrator account.

## Quick start

You will need Node.js, npm, and a MongoDB connection. Configure `server/.env` and `client/.env` using the checked-in `.env.example` files, then run the API and client in separate terminals:

```sh
# Terminal 1
cd server
npm install
npm run dev
```

```sh
# Terminal 2
cd client
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to create an account and get started. See the [full setup instructions](../README.md#local-setup) for environment variables and administrator setup.

## Project at a glance

| Area | Technology |
| --- | --- |
| Web client | React, Vite, Tailwind CSS, Framer Motion |
| API | Node.js and Express |
| Data and sessions | MongoDB, Mongoose, JWT |

The app uses a dark, calm interface with Aqua Alloy (`#2FAF9A`) as its primary accent. For the full palette and product details, see the [Notes Keeper guide](../NOTES_KEEPER_GUIDE.md).

## Documentation map

- [README](../README.md) — overview, features, configuration, setup, API reference, and manual checklist.
- [Notes Keeper guide](../NOTES_KEEPER_GUIDE.md) — product pages, local usage, palette, and admin access.
- [Deployment guide](../DEPLOYMENT.md) — production hosting and post-deployment steps.
- [Build notes](../notes.md) — project planning and implementation history.

