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
Install command: npm install
Build command: npm run build
Start command: npm run start
```

On Vercel, the framework should be detected as Next.js automatically.

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

Session data and votes are currently stored in server memory. Restarting the server resets sessions back to the default `main` session.

For production or long-running events, add persistent storage before relying on this for historical results. Serverless hosts may also create more than one runtime instance, so use a shared store such as Redis/Vercel KV if results need to be durable across instances.

## Main Files

- `app/` - Next.js pages and API route handlers used for deployment.
- `lib/sessions.js` - Shared in-memory session store used by Next routes.
- `live-survey/server.js` - Legacy local HTTP server.
- `live-survey/admin.html` - Admin session manager.
- `live-survey/Live Survey.dc.html` - Presenter board and participant survey experience.
- `live-survey/quiz-data.js` - Personality quiz questions and scoring data.
