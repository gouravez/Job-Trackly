// content.js — runs on supported job listing pages
// Scrapes job details and stores them for the popup to read.

(() => {
  const host = location.hostname;

  function getText(selectors) {
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el) return el.innerText.trim();
    }
    return "";
  }

  function scrape() {
    // ── LinkedIn ──────────────────────────────────────────────────────────────
    if (host.includes("linkedin.com")) {
      return {
        company:  getText([
          ".job-details-jobs-unified-top-card__company-name a",
          ".jobs-unified-top-card__company-name a",
          ".topcard__org-name-link",
        ]),
        role: getText([
          ".job-details-jobs-unified-top-card__job-title h1",
          ".jobs-unified-top-card__job-title h1",
          ".topcard__title",
        ]),
        location: getText([
          ".job-details-jobs-unified-top-card__primary-description-without-tagline .tvm__text",
          ".jobs-unified-top-card__bullet",
          ".topcard__flavor--bullet",
        ]),
        jobType: "",
        jobUrl: location.href.split("?")[0],
      };
    }

    // ── Indeed ────────────────────────────────────────────────────────────────
    if (host.includes("indeed.com")) {
      return {
        company: getText([
          '[data-testid="inlineHeader-companyName"] a',
          '[data-testid="inlineHeader-companyName"]',
          ".jobsearch-InlineCompanyRating-companyHeader a",
        ]),
        role: getText([
          '[data-testid="jobsearch-JobInfoHeader-title"] span',
          "h1.jobsearch-JobInfoHeader-title",
          "h1[data-testid='jobsearch-JobInfoHeader-title']",
        ]),
        location: getText([
          '[data-testid="job-location"]',
          ".jobsearch-JobInfoHeader-subtitle .jobsearch-JobInfoHeader-locationWrapper",
        ]),
        jobType: "",
        jobUrl: location.href.split("?")[0],
      };
    }

    // ── Naukri ────────────────────────────────────────────────────────────────
    if (host.includes("naukri.com")) {
      return {
        company: getText([
          ".jd-header-comp-name a",
          ".comp-name",
        ]),
        role: getText([
          ".jd-header-title",
          "h1.title",
        ]),
        location: getText([
          ".location-container span",
          ".loc span",
        ]),
        jobType: getText([".job-tag-li .static-chip"]) || "",
        jobUrl: location.href.split("?")[0],
      };
    }

    // ── Internshala ───────────────────────────────────────────────────────────
    if (host.includes("internshala.com")) {
      return {
        company: getText([
          ".company-name a",
          "#company-name",
          ".heading_4_5.company-name",
        ]),
        role: getText([
          ".profile h1",
          ".internship_heading h1",
          "#internship_category_segment .profile",
        ]),
        location: getText([
          ".location_link",
          "#location_names span",
        ]),
        jobType: location.href.includes("/internships/") ? "Internship" : "Full-time",
        jobUrl: location.href.split("?")[0],
      };
    }

    // ── Glassdoor ─────────────────────────────────────────────────────────────
    if (host.includes("glassdoor.com")) {
      return {
        company: getText([
          '[data-test="employer-name"]',
          ".EmployerProfile_profileContainer__63w3R .EmployerProfile_employerName__Xemli",
          ".e1tk4kwz1",
        ]),
        role: getText([
          '[data-test="job-title"]',
          "h1.heading_Heading__BqX5J",
        ]),
        location: getText([
          '[data-test="location"]',
          ".JobDetails_locationWrapper__OBFek span",
        ]),
        jobType: "",
        jobUrl: location.href.split("?")[0],
      };
    }

    // ── Wellfound (AngelList) ─────────────────────────────────────────────────
    if (host.includes("wellfound.com")) {
      return {
        company: getText([
          ".startup-link",
          '[data-test="StartupResult_name"]',
          ".styles_component__Ey28k h2",
        ]),
        role: getText([
          "h1.styles_title__xpQDw",
          "h1[class*='title']",
          ".styles_component__Ey28k h1",
        ]),
        location: getText([
          ".styles_location__aJAr_",
          "[class*='location']",
        ]),
        jobType: "Full-time",
        jobUrl: location.href.split("?")[0],
      };
    }

    return null;
  }

  // Store scraped data so popup can read it immediately
  const data = scrape();
  if (data) {
    chrome.storage.local.set({ scrapedJob: { ...data, scrapedAt: Date.now() } });
  }

  // Also respond to on-demand requests from popup
  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.type === "SCRAPE_JOB") {
      sendResponse(scrape() || {});
    }
  });
})();
