// popup.js

// ─────────────────────────────────────────────────────────────────────────────
// Config — change this to your deployed backend URL
// ─────────────────────────────────────────────────────────────────────────────
const API_BASE = "http://localhost:4000/api";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const $ = (id) => document.getElementById(id);

async function apiCall(path, method = "GET", body = null, token = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || json.error || "Request failed");
  return json;
}

function getToken() {
  return new Promise((resolve) =>
    chrome.storage.local.get("jt_token", (r) => resolve(r.jt_token || null))
  );
}

function setToken(token) {
  return new Promise((resolve) =>
    chrome.storage.local.set({ jt_token: token }, resolve)
  );
}

function clearToken() {
  return new Promise((resolve) =>
    chrome.storage.local.remove(["jt_token"], resolve)
  );
}

function showView(id) {
  ["view-login", "view-main"].forEach((v) => $(v).classList.add("hidden"));
  $(id).classList.remove("hidden");
}

function setFormError(msg) {
  const el = $("form-error");
  if (msg) { el.textContent = msg; el.classList.remove("hidden"); }
  else el.classList.add("hidden");
}

function setFormSuccess(msg) {
  const el = $("form-success");
  if (msg) { el.textContent = msg; el.classList.remove("hidden"); }
  else el.classList.add("hidden");
}

function setLoginError(msg) {
  const el = $("login-error");
  if (msg) { el.textContent = msg; el.classList.remove("hidden"); }
  else el.classList.add("hidden");
}

// ─────────────────────────────────────────────────────────────────────────────
// Detect if current tab is a supported job page
// ─────────────────────────────────────────────────────────────────────────────
const JOB_PATTERNS = [
  /linkedin\.com\/jobs\//,
  /indeed\.com/,
  /naukri\.com/,
  /internshala\.com\/(jobs|internships)\//,
  /glassdoor\.com\/(job-listing|Jobs)\//,
  /wellfound\.com\/(jobs|role)\//,
];

function isJobPage(url) {
  return JOB_PATTERNS.some((re) => re.test(url));
}

// ─────────────────────────────────────────────────────────────────────────────
// Fill form with scraped data
// ─────────────────────────────────────────────────────────────────────────────
function fillForm(data, jobUrl) {
  if (!data) return;

  const set = (id, val) => { if (val && $(id)) $(id).value = val; };

  set("f-company",  data.company);
  set("f-role",     data.role);
  set("f-location", data.location);

  // Map jobType string to select option
  const typeMap = {
    "Full-time":  "Full-time",
    "Part-time":  "Part-time",
    "Internship": "Internship",
    "Contract":   "Contract",
    "Freelance":  "Freelance",
  };
  if (data.jobType && typeMap[data.jobType]) {
    $("f-jobtype").value = typeMap[data.jobType];
  }

  // Store job URL on the save button for later use
  if (jobUrl) $("btn-save").dataset.url = jobUrl;

  // Show detected badge only when we actually got something
  if (data.company || data.role) {
    $("detected-badge").classList.remove("hidden");
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Init
// ─────────────────────────────────────────────────────────────────────────────
async function init() {
  const token = await getToken();

  if (!token) {
    showView("view-login");
    return;
  }

  // Verify token is still valid
  try {
    await apiCall("/auth/me", "GET", null, token);
  } catch {
    await clearToken();
    showView("view-login");
    return;
  }

  showView("view-main");

  // Get current tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab || !isJobPage(tab.url)) {
    $("not-job-page").classList.remove("hidden");
    $("job-form-wrap").classList.add("hidden");
    return;
  }

  // Try to get scraped data (content script may have already stored it)
  const stored = await new Promise((r) =>
    chrome.storage.local.get("scrapedJob", (res) => r(res.scrapedJob))
  );

  // Fresh scrape if stored data is stale (>10 s) or missing
  if (stored && Date.now() - stored.scrapedAt < 10_000) {
    fillForm(stored, tab.url);
  } else {
    try {
      const data = await new Promise((resolve, reject) => {
        chrome.tabs.sendMessage(tab.id, { type: "SCRAPE_JOB" }, (res) => {
          if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
          else resolve(res);
        });
      });
      fillForm(data, tab.url);
    } catch {
      // Content script not ready — form still usable manually
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Login
// ─────────────────────────────────────────────────────────────────────────────
$("btn-login").addEventListener("click", async () => {
  const email    = $("login-email").value.trim();
  const password = $("login-password").value;

  setLoginError("");

  if (!email || !password) {
    setLoginError("Please enter your email and password.");
    return;
  }

  $("btn-login").disabled = true;
  $("btn-login").textContent = "Signing in…";

  try {
    const res = await apiCall("/auth/signin", "POST", { email, password });
    await setToken(res.data.token);
    showView("view-main");
    init();
  } catch (err) {
    setLoginError(err.message || "Sign in failed. Check your credentials.");
  } finally {
    $("btn-login").disabled = false;
    $("btn-login").textContent = "Sign In";
  }
});

// Allow Enter key on password field
$("login-password").addEventListener("keydown", (e) => {
  if (e.key === "Enter") $("btn-login").click();
});

// ─────────────────────────────────────────────────────────────────────────────
// Logout
// ─────────────────────────────────────────────────────────────────────────────
$("btn-logout").addEventListener("click", async () => {
  await clearToken();
  showView("view-login");
  setLoginError("");
  $("login-email").value = "";
  $("login-password").value = "";
});

// ─────────────────────────────────────────────────────────────────────────────
// Save application
// ─────────────────────────────────────────────────────────────────────────────
$("btn-save").addEventListener("click", async () => {
  setFormError("");
  setFormSuccess("");

  const company = $("f-company").value.trim();
  const role    = $("f-role").value.trim();

  if (!company || !role) {
    setFormError("Company and Role are required.");
    return;
  }

  const token = await getToken();
  if (!token) { showView("view-login"); return; }

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const payload = {
    company,
    role,
    location:    $("f-location").value.trim()  || undefined,
    status:      $("f-status").value,
    priority:    $("f-priority").value,
    jobType:     $("f-jobtype").value           || undefined,
    notes:       $("f-notes").value.trim()      || undefined,
    jobUrl:      $("btn-save").dataset.url      || undefined,
    dateApplied: today,
  };

  $("btn-save").disabled = true;
  $("btn-save").innerHTML = `
    <svg class="spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-opacity="0.3"/>
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
    </svg>
    Saving…`;

  try {
    await apiCall("/applications", "POST", payload, token);
    setFormSuccess("✓ Saved to Job Trackly!");

    // Reset form after short delay
    setTimeout(() => {
      $("f-company").value  = "";
      $("f-role").value     = "";
      $("f-location").value = "";
      $("f-jobtype").value  = "";
      $("f-notes").value    = "";
      $("f-status").value   = "Saved";
      $("f-priority").value = "Medium";
      $("detected-badge").classList.add("hidden");
      setFormSuccess("");
    }, 2500);
  } catch (err) {
    setFormError(err.message || "Failed to save. Try again.");
  } finally {
    $("btn-save").disabled = false;
    $("btn-save").innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
        <polyline points="17 21 17 13 7 13 7 21"/>
        <polyline points="7 3 7 8 15 8"/>
      </svg>
      Save to Job Trackly`;
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Spinner style (injected so no extra CSS file needed)
// ─────────────────────────────────────────────────────────────────────────────
const style = document.createElement("style");
style.textContent = `@keyframes spin{to{transform:rotate(360deg)}} .spin{animation:spin .7s linear infinite}`;
document.head.appendChild(style);

// ─────────────────────────────────────────────────────────────────────────────
// Boot
// ─────────────────────────────────────────────────────────────────────────────
init();
