# Yourway Live Personality Survey

Live presenter board, participant survey, and admin session manager for the Yourway personality quiz.

## What It Does

- Admins create separate live survey sessions.
- Each session has a unique board URL and survey URL.
- Participants scan the board QR code to open that session's survey.
- Results update live on the board as responses come in.
- Admins can see all sessions, view results, stop sessions, and delete sessions.
- Stopped sessions keep the board/results visible, but the QR is replaced with a survey-over message.

## Requirements

- Node.js
- npm

Install dependencies:

```sh
npm install
```

Run locally in development:

```sh
npm run dev
```

Build for deployment:

```sh
npm run build
```

Run the production build locally:

```sh
npm run start
```

The Next app serves:

```txt
Admin dashboard: /admin
Default board: /s/main
Default survey: /s/main?view=survey
```

The old custom Node server is still available for local-only use:

```sh
npm run start:legacy
```

## Deployment

This project is now a Next.js app and can be deployed to v0/Vercel-style hosting.

Typical deployment settings:

```txt
Root directory: ./
Install command: npm install
Build command: npm run build
Start command: npm run start
```

On Vercel, the framework should be detected as Next.js automatically.

If v0 shows `Could not find a Next.js root layout to patch` or `Script not found "build"`, make sure the project root is the folder that contains `package.json`, `app/layout.js`, and `vercel.json`. Do not set the root directory to `live-survey/`.

If a board link opens as `Not found` in v0, redeploy this latest version. Public board and survey routes now create a missing session shell automatically. For real events, still configure Supabase so sessions created in the admin dashboard persist across serverless instances and deployments.

After deployment, open `/api/health`. A healthy production setup should return `"storage":"supabase"` and `"ok":true`. If it returns `"storage":"memory"`, the Supabase environment variables are missing. If it returns an error, rerun `supabase/schema.sql` in Supabase and redeploy.

If created session links open a Vercel/v0 "Deployment not found" page, `PUBLIC_BASE_URL` is pointing to the wrong deployment. Either remove `PUBLIC_BASE_URL` so the app uses the current request host, or set it to the exact production domain with no trailing slash.

If images do not load in Vercel/v0, make sure the real `live-survey/uploads` image files are committed. This repo should not use Git LFS for `.png` or `.gif` assets, because deployments can receive pointer files instead of the actual images.

## Supabase Storage

For deployed surveys, use Supabase so sessions, votes, and response records survive restarts and work across serverless instances.

1. Create a Supabase project.
2. Open the Supabase SQL editor.
3. Run the SQL in `supabase/schema.sql`.
4. Add these environment variables to your deployment:

```txt
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

Keep `SUPABASE_SERVICE_ROLE_KEY` server-only. Do not expose it in browser code or use a `NEXT_PUBLIC_` prefix.

## Admin Dashboard

Open:

```txt
https://YOUR_DOMAIN/admin
```

To use admin controls, enter an email ending in:

```txt
@yourwaylearning.com
```

From the admin dashboard you can:

- Create a new survey session.
- See every session and its response totals.
- Open each session's board and survey links.
- Stop a session.
- Delete a session.

## Running Multiple Sessions

Every session gets its own ID and URLs:

```txt
Board:  /s/{sessionId}
Survey: /s/{sessionId}?view=survey
```

Because each session stores separate vote counts, several surveys can run at the same time.

## Presenter Board

Open a board URL such as:

```txt
https://YOUR_DOMAIN/s/main
```

The board shows:

- Live vote totals by character.
- A QR code for the matching participant survey.
- The leading personality.
- A hidden control bar that appears on board activity and hides again after a short idle period.

## Participant Survey

Participants should open the survey through the QR code or a survey URL:

```txt
https://YOUR_DOMAIN/s/main?view=survey
```

The survey view does not show the presenter/admin control bar.

## Stopping A Session

When an admin stops a session:

- The board stays active.
- Results remain visible.
- The QR code is replaced by a "Survey is over" message.
- New participant votes are rejected.
- Participants opening the survey see a closed-session message.

## Network Notes

For phones to scan and join, the board URL must use an address reachable from the phone on the same network. The server tries to detect a LAN IP automatically.

If you need to force the public URL used in QR codes, set `PUBLIC_BASE_URL`:

```sh
PUBLIC_BASE_URL=https://YOUR_DOMAIN npm run start
```

## Data Storage

When `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set, session data is stored in Supabase:

- `survey_sessions` stores each dashboard/session, stop state, and current vote totals.
- `survey_responses` stores each submitted survey as an individual response row, including name, email, school, submission date, answers for each question, primary result, backed-by result, role, scores, and survey session.

Admins can fetch saved entries for a session at:

```txt
/api/admin/sessions/{sessionId}/responses
```

Include the `X-Admin-Email` header with an `@yourwaylearning.com` email.

For CSV export, use:

```txt
/api/admin/sessions/{sessionId}/responses?format=csv
```

If the Supabase variables are not set, the app falls back to server memory for local demos. In-memory data resets when the server restarts and should not be used for production events.

## Main Files

- `app/` - Next.js pages and API route handlers used for deployment.
- `lib/sessions.js` - Shared session storage used by Next routes. Uses Supabase when configured, otherwise local memory.
- `live-survey/server.js` - Legacy local HTTP server.
- `live-survey/admin.html` - Admin session manager.
- `live-survey/Live Survey.dc.html` - Presenter board and participant survey experience.
- `live-survey/quiz-data.js` - Personality quiz questions and scoring data.
- `supabase/schema.sql` - Database schema for persistent survey storage.
