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

Start the app:

```sh
npm run start
```

The server prints the available URLs, for example:

```txt
Admin dashboard: http://YOUR_IP:4173/admin
Default board: http://YOUR_IP:4173/s/main
Default survey: http://YOUR_IP:4173/s/main?view=survey
```

## Admin Dashboard

Open:

```txt
http://YOUR_IP:4173/admin
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
http://YOUR_IP:4173/s/main
```

The board shows:

- Live vote totals by character.
- A QR code for the matching participant survey.
- The leading personality.
- A hidden control bar that appears on board activity and hides again after a short idle period.

## Participant Survey

Participants should open the survey through the QR code or a survey URL:

```txt
http://YOUR_IP:4173/s/main?view=survey
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

If you need to force the public URL used in QR codes, start the server with:

```sh
PUBLIC_BASE_URL=http://YOUR_REACHABLE_IP:4173 npm run start
```

## Data Storage

Session data and votes are currently stored in server memory. Restarting the server resets sessions back to the default `main` session.

For production or long-running events, add persistent storage before relying on this for historical results.

## Main Files

- `live-survey/server.js` - HTTP server, session API, admin API, QR generation, live updates.
- `live-survey/admin.html` - Admin session manager.
- `live-survey/Live Survey.dc.html` - Presenter board and participant survey experience.
- `live-survey/quiz-data.js` - Personality quiz questions and scoring data.
