# Job Trackly — Chrome Extension

Save job listings to Job Trackly in one click from LinkedIn, Indeed, Naukri, Internshala, Glassdoor, and Wellfound.

---

## Setup

### 1. Point it at your backend

Open `popup.js` and update the first line:

```js
const API_BASE = "http://localhost:4000/api"; // ← change to your deployed URL
```

### 2. Add icons

Place three PNG icons inside the `icons/` folder:
- `icon16.png` — 16×16 px
- `icon48.png` — 48×48 px
- `icon128.png` — 128×128 px

You can use any Job Trackly logo or a simple briefcase icon.

### 3. Load in Chrome

1. Go to `chrome://extensions`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked**
4. Select this `jobtrackly-extension/` folder

The extension icon will appear in your toolbar.

---

## How it works

1. Navigate to any job listing on a supported site
2. Click the Job Trackly extension icon
3. The form auto-fills with company, role, location, and job type scraped from the page
4. Adjust status/priority if needed, then click **Save to Job Trackly**
5. The application is sent directly to your backend via `POST /api/applications`

---

## Supported sites

| Site | Auto-detects |
|---|---|
| LinkedIn | Company, Role, Location |
| Indeed | Company, Role, Location |
| Naukri | Company, Role, Location, Job Type |
| Internshala | Company, Role, Location, Job Type |
| Glassdoor | Company, Role, Location |
| Wellfound | Company, Role, Location |

---

## Backend CORS

Make sure your backend allows the extension origin. In `app.js`, the `cors` config needs to include:

```js
origin: [
  "http://localhost:5173",          // your frontend
  "chrome-extension://*",           // extension (development)
],
```

Or for production, add your specific extension ID:
```js
"chrome-extension://YOUR_EXTENSION_ID_HERE"
```

You can find the extension ID on `chrome://extensions` after loading it.
