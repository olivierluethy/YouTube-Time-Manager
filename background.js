chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "openGoalsPage") {
    // Neuen Tab mit der goals.html-Seite öffnen
    chrome.tabs.create({
      url: chrome.runtime.getURL("pages/goals.html"),
    });
  }
});

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    return { cancel: true }; // Block the request to YouTube
  },
  { urls: ["*://*.youtube.com/*"] }, // This matches all YouTube URLs
  ["blocking"]
);

// Optional: You can add storage logic here to stop blocking after a certain condition.
chrome.storage.sync.get("wasteTimeCounter", function (data) {
  // const wasteTimeCounter = data.wasteTimeCounter || 0;

  // if (wasteTimeCounter >= 10) {
    // Block YouTube
    chrome.webRequest.onBeforeRequest.addListener(
      function (details) {
        return { cancel: true };
      },
      { urls: ["*://*.youtube.com/*"] },
      ["blocking"]
    );
  // }
});
