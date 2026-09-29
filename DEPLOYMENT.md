# InkVault deployment guide

This guide deploys MongoDB Atlas for data, Render for the Express API, and Vercel for the Vite client. It assumes the project has been pushed to a GitHub repository with `server/` and `client/` directories.

## 1. MongoDB Atlas

### Create a free M0 cluster

1. Sign in at [MongoDB Atlas](https://cloud.mongodb.com/).
2. Choose the organization and project to use (or create a project such as `InkVault`).
3. Open **Project Overview** and click **Create** / **Build a Database**.
4. In the cluster deployment options, choose **M0 Free**. Confirm the tier is marked **Free** before creating it. Atlas currently allows one Free cluster per project.
5. Choose a cloud provider and a region near the Render service region you plan to use. Choose a cluster name such as `inkvault` and click **Create**.
6. If Atlas opens its Security Quickstart during setup, create the database user and configure network access as described below. Otherwise open **Security → Database & Network Access** and use the **Database Users** tab.

Atlas documents M0 as its free cluster tier; it is intended for small development and proof-of-concept workloads and has feature/resource limits. See [Deploy a Free Cluster](https://www.mongodb.com/docs/atlas/tutorial/deploy-free-tier-cluster/).

### Create the application database user

1. In Atlas, open **Security → Database & Network Access → Database Users** and click **Add New Database User**.
2. Choose **Password** authentication.
3. Create a dedicated username such as `inkvault-app` and generate a strong password. Save it in a password manager.
4. Under **Database User Privileges**, prefer **Specific Privileges** and grant the `readWrite` role on the `inkvault` database. If the wizard only offers built-in roles, choose **Read and write to any database** for this demo user.
5. Click **Add User** / **Create User**.

Do not use your Atlas website login as the database username. Never commit the database user's password.

### Allow Render network access

1. In Atlas, open **Security → Database & Network Access → Network Access** (sometimes labeled **IP Access List**).
2. Click **Add IP Address**.
3. Enter `0.0.0.0/0` and add a comment such as `Render API`.
4. Click **Confirm** and wait until the entry is active.

`0.0.0.0/0` allows connections from any public IPv4 address. It is useful when the hosting service's outbound addresses are not fixed, but it widens network access. Keep the database user dedicated, use a long unique password, grant only the database privileges the app needs, and use a fixed outbound IP allowlist if your hosting plan provides one. Atlas describes IP access lists in its [network access documentation](https://www.mongodb.com/docs/atlas/security/ip-access-list/).

### Copy the production connection string

1. Return to **Database → Clusters** (or **Database Deployments**), select the cluster, and click **Connect**.
2. If prompted, confirm the database user and IP access entry exist.
3. Choose **Drivers**, select **Node.js**, and copy the connection string.
4. Replace the username and password placeholders; add the database name `inkvault` after `.net/`.

Use this shape in Render's `MONGO_URI` field:

```text
mongodb+srv://<DB_USER>:<URL_ENCODED_DB_PASSWORD>@<CLUSTER_HOST>.mongodb.net/inkvault?retryWrites=true&w=majority&appName=inkvault
```

For example, `<CLUSTER_HOST>` is the host Atlas copied, such as `cluster0.ab123.mongodb.net`; do not copy that example host literally. URL-encode reserved characters in the database password (`@` becomes `%40`, for example). Do not put spaces, quotes, or angle brackets around the final value. Atlas's [connect your application guide](https://www.mongodb.com/docs/atlas/connect-your-application/) covers the connection URI.

## 2. Render API

### Create the Web Service

1. Push the project to GitHub and make sure the `server/package.json` and `server/package-lock.json` files are in the repository.
2. Sign in to [Render](https://dashboard.render.com/) and click **New → Web Service**.
3. Connect GitHub if prompted, authorize Render to see the repository, then select the InkVault repository.
4. Configure the service:

   | Setting | Value |
   | --- | --- |
   | Name | A unique name, for example `inkvault-api-yourname` |
   | Branch | The branch to deploy, usually `main` |
   | Root Directory | `server` |
   | Runtime / Language | `Node` |
   | Build Command | `npm install` |
   | Start Command | `npm start` |
   | Instance Type | `Free` for a demo |

5. Under **Advanced**, set the health check path to `/api/health`.
6. Create the service. Render shows the service URL after creation, in the form `https://<render-app>.onrender.com`.

The server binds to Render's `PORT` on `0.0.0.0`; Render requires a public web service to bind to that host. See [Render's Express deploy guide](https://render.com/docs/deploy-node-express-app) and [Web Services documentation](https://render.com/docs/web-services).

### Add Render environment variables

Open the service in Render, select **Environment**, and add these variables. Do not add a `PORT` value; Render supplies it.

| Key | Value |
| --- | --- |
| `NODE_ENV` | `production` |
| `NODE_VERSION` | `24.21.0` |
| `MONGO_URI` | The Atlas connection string from the previous section |
| `JWT_SECRET` | A private random value of at least 32 bytes; generate with `node -p "require('crypto').randomBytes(48).toString('hex')"` |
| `JWT_EXPIRES_IN` | `7d` |
| `CLIENT_URL` | The exact Vercel origin, for example `https://inkvault-yourname.vercel.app`; no trailing slash or path |

If you have not deployed Vercel yet, temporarily set `CLIENT_URL` to `http://localhost:5173`, finish the Render deployment, and replace it with the real Vercel origin after step 3. You can also provide multiple exact origins as a comma-separated `CLIENT_URL` value. In production the API allows only configured origins; localhost is enabled only when `NODE_ENV` is not `production`.

Save the variables and allow Render to redeploy. Render's current default for newly created services is Node `24.21.0`; setting `NODE_VERSION` pins the runtime. See [Render's Node.js version documentation](https://render.com/docs/node-version).

### Free plan cold starts and health check

Render's Free web services spin down after 15 minutes without inbound traffic. The next request starts the service again; Render says this can take about a minute. The first browser request may therefore be noticeably slow. The client displays a wake-up toast for a slow first API request and has a 15-second request timeout; if that request times out during a longer cold start, wait for the service to wake and retry, or open the health URL first and wait for it to return.

Check the API at:

```text
https://<render-app>.onrender.com/api/health
```

A working API returns HTTP `200` and JSON containing `"InkVault API is running"`. Set the Render health check path to `/api/health` (path only, no hostname). Free-instance spin-down and wake behavior are described in [Render's Free plan documentation](https://render.com/docs/free).

## 3. Vercel client

The repo now includes `client/vercel.json`, which rewrites client-side routes to `index.html`. This is required for a direct refresh of paths such as `/notes?category=...`. Vercel documents this SPA rewrite in [Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite).

1. Sign in to [Vercel](https://vercel.com/dashboard) and choose **Add New → Project**.
2. Connect GitHub if prompted and **Import** the InkVault repository.
3. In **Configure Project**, set **Root Directory** to `client` (use **Edit** beside the detected directory and confirm it).
4. Confirm the framework preset is **Vite**. Set or confirm:

   | Setting | Value |
   | --- | --- |
   | Build Command | `npm run build` |
   | Output Directory | `dist` |
   | Install Command | `npm install` (or Vercel's detected npm install command) |

5. Expand **Environment Variables** and add:

   | Key | Value |
   | --- | --- |
   | `VITE_API_URL` | `https://<render-app>.onrender.com/api` |

   Select **Production** for the demo deployment. Add Preview scope only if you also configure CORS for the preview hostnames.

6. Click **Deploy** and wait for the build to finish.
7. Open the assigned production domain. If desired, configure a custom domain under **Project → Settings → Domains**.
8. Copy the exact production origin (scheme and hostname only), such as `https://inkvault-yourname.vercel.app`.
9. Return to Render → this service → **Environment**. Set `CLIENT_URL` to the copied origin, save, and wait for the redeploy to finish.
10. Open the Vercel site again and run the smoke tests below.

`VITE_API_URL` is compiled into public browser JavaScript; it is an API address, not a secret. Never put `JWT_SECRET` or `MONGO_URI` in Vercel.

### Netlify equivalent

If deploying the client to Netlify instead, the repository also includes `client/public/_redirects`:

```text
/*  /index.html  200
```

Vite copies this file into `dist`. In Netlify, import the GitHub repository, set **Base directory** to `client`, **Build command** to `npm run build`, **Publish directory** to `dist`, and add `VITE_API_URL` with the same Render API URL. Set Render `CLIENT_URL` to the Netlify production origin. Netlify documents this SPA rule in [Rewrites and proxies](https://docs.netlify.com/manage/routing/redirects/rewrites-proxies/).

## 4. Production smoke test

Use the Vercel production domain in the browser. For protected API requests, the client supplies the bearer token after login.

| Step | Action | Expected result |
| --- | --- | --- |
| 1 | Open `https://<render-app>.onrender.com/api/health`. | HTTP 200 with the InkVault health JSON. The first request after idle may take about a minute. |
| 2 | Open the Vercel site and register a new account. | Registration succeeds and opens the authenticated workspace. |
| 3 | Log out, then log in using that account. | Login succeeds and returns to the workspace. |
| 4 | Create a note with a title and content. | The note appears in the notes list and remains after refresh. |
| 5 | Pin the note. | Pinned styling/status appears and the dashboard count updates. |
| 6 | Search for a unique word in its title or content. | The note appears in suggestions and the full results page. |
| 7 | Filter by a category or color, then clear filters. | The URL reflects the selected filter; results update and Clear all restores the list. |
| 8 | Open the dashboard and inspect totals/activity. | API-backed statistics load without a CORS or server error. |
| 9 | Navigate to `/notes` or `/categories`, then refresh the browser. | The React page loads directly instead of showing the host's 404 page. |
| 10 | Log out. | The client returns to login; protected pages require a new session. |

## 5. Common deployment errors

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Browser reports a CORS error | `CLIENT_URL` differs from the browser origin (wrong scheme, hostname, custom domain, or trailing slash); Render has not redeployed the new value. | Set `CLIENT_URL` to the exact Vercel origin, such as `https://inkvault-yourname.vercel.app`, with no path/trailing slash. Save and wait for Render to redeploy. Include every production/custom origin as a comma-separated exact origin if needed. |
| Login works, but later API calls return 401 | An old/expired token is stored, `JWT_SECRET` changed after the token was issued, or the client is calling the wrong API deployment. | Confirm Vercel `VITE_API_URL` ends in `/api`, confirm Render `JWT_SECRET` is stable, clear the site's local storage or log out, then sign in again. |
| Vercel works from `/` but refresh on `/notes` or `/categories` returns 404 | Rewrite file is absent or outside the configured project root. | Confirm `client/vercel.json` is committed and Vercel Root Directory is `client`; redeploy. For Netlify, confirm `client/public/_redirects` exists so Vite copies it to `dist`. |
| Render/Mongoose reports a Mongo connection timeout or server selection timeout | Atlas IP entry is missing/pending, the URI is wrong, or the database user/password is incorrect. | Confirm Atlas Network Access contains active `0.0.0.0/0`, confirm the database user exists, copy the SRV URI again, URL-encode password characters, and verify `MONGO_URI` in Render. Wait for the Atlas cluster to finish provisioning. |
| Render deploy says it cannot detect a port | Server is not listening on Render's `PORT` or the process exits before `app.listen`. | Keep `PORT` unset in Render; the server reads Render's injected value and binds on `0.0.0.0`. Check Render logs for missing `MONGO_URI`, `JWT_SECRET`, or `CLIENT_URL`. |
| First browser request times out on the Free plan | The service was asleep and took longer than the client's 15-second per-request timeout to wake. | Open the `/api/health` URL and wait for its 200 response, then retry the client action. Upgrade the Render instance if the demo needs consistently warm responses. |
| API health works but site API calls fail | Health is public but app requests may still have bad CORS, API URL, or auth configuration. | Recheck Vercel `VITE_API_URL`, Render `CLIENT_URL`, wait for both deployments, then log out and back in. |

## Official provider references

- [MongoDB Atlas free M0 cluster](https://www.mongodb.com/docs/atlas/tutorial/deploy-free-tier-cluster/)
- [MongoDB Atlas IP access lists](https://www.mongodb.com/docs/atlas/security/ip-access-list/)
- [MongoDB Atlas application connection](https://www.mongodb.com/docs/atlas/connect-your-application/)
- [Render Express deployment](https://render.com/docs/deploy-node-express-app)
- [Render free instance limitations](https://render.com/docs/free)
- [Render Node.js versions](https://render.com/docs/node-version)
- [Vercel Vite SPA routing](https://vercel.com/docs/frameworks/frontend/vite)
- [Netlify SPA rewrites](https://docs.netlify.com/manage/routing/redirects/rewrites-proxies/)
