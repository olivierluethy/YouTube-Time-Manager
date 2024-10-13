chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "openGoalsPage") {
      // Neuen Tab mit der goals.html-Seite öffnen
      chrome.tabs.create({
        url: chrome.runtime.getURL('pages/goals.html')
      });
    }
  });
  