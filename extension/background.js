// background.js — service worker
// Relays API calls from popup so CORS headers from the extension origin are handled cleanly.

chrome.runtime.onInstalled.addListener(() => {
  console.log("Job Trackly extension installed.");
});
