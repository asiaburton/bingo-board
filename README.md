# BingoBoard

Local-first Angular bingo app. No server or database required — game config and cards are stored in **localStorage**, and shared via **links**.

## Prerequisites

- **Node.js 18 LTS** recommended (Angular 16)

## Run

```bash
npm install
npm start
```

Open `http://localhost:4200`.

## Routes

| Path | Description |
|------|-------------|
| `/admin/setup` | Configure game, backgrounds, copy share links |
| `/admin/call` | Caller board |
| `/play` | Player card — mark squares manually |

## Admin setup

1. Go to **Admin → Setup** (admin panel always uses `admin-bg.jpg`).
2. Choose **Standard 1–75 bingo** or **Custom square phrases**.
3. Set the **player screen background**:
   - Pick a preset (e.g. Juneteenth), or
   - **Paste** an image (Ctrl+V / Cmd+V), **drag and drop**, or **choose a file** — saved backgrounds appear in **Saved backgrounds** for reuse.
4. Click **Save locally**, then **Copy player link** to share with phones.

Uploaded/pasted images are stored in your browser (up to 20) so you can reuse them without uploading again.

## Player flow

1. Open the player link on a phone or laptop.
2. Get a random bingo card.
3. Mark squares manually as items are called.

## Backup

Use **Download JSON** / **Import JSON** on the admin setup page to move configs between devices.
