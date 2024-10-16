chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "openGoalsPage") {
    // Neuen Tab mit der goals.html-Seite öffnen
    chrome.tabs.create({
      url: chrome.runtime.getURL("pages/goals.html"),
    });
  }
});
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "blockSite") {
    // Update the current tab to show the restricted.html page
    chrome.tabs.update(sender.tab.id, {
      url: chrome.runtime.getURL("pages/restricted.html"),
    });
  }
});
