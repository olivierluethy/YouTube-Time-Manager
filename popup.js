document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("toggle");
  const toggleText = document.getElementById("toggOnOff");

  // Lade den aktuellen Zustand aus dem Chrome-Speicher
  chrome.storage.sync.get(["isEnabled"], (result) => {
    // Standardmäßig auf aktiviert (true), falls nicht gesetzt
    const isEnabled = result.isEnabled !== undefined ? result.isEnabled : true;
    toggle.checked = isEnabled;

    // Aktualisiere den Text neben dem Toggle-Schalter mit innerHTML
    toggleText.innerHTML = isEnabled
      ? "Toggle <strong>On</strong>"
      : "Toggle <strong>Off</strong>";

    // Wende den Zustand direkt beim Laden an
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: toggleYouTubeRecommendations,
        args: [isEnabled],
      });
    });
  });

  // Listen for changes to the toggle
  toggle.addEventListener("change", (event) => {
    const isEnabled = event.target.checked;

    // Speichere den neuen Zustand im Chrome-Speicher
    chrome.storage.sync.set({ isEnabled });

    // Aktualisiere den Text neben dem Toggle-Schalter mit innerHTML
    toggleText.innerHTML = isEnabled
      ? "Toggle <strong>On</strong>"
      : "Toggle <strong>Off</strong>";

    // Sende eine Nachricht an das Content-Skript, um dessen Verhalten zu aktualisieren
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: toggleYouTubeRecommendations,
        args: [isEnabled],
      });
    });
  });

  // Hole das HTML-Element, in das das Jahr eingefügt werden soll
  const yearElement = document.getElementById("nameYear");

  // Erstelle ein neues Datumsobjekt und extrahiere das Jahr
  const currentYear = new Date().getFullYear();

  // Setze den Textinhalt des Elements auf das aktuelle Jahr
  yearElement.textContent = `© ${currentYear}. by Olivier Lüthy`;
});

// Function to toggle the YouTube recommendations in the content script
function toggleYouTubeRecommendations(isEnabled) {
  if (isEnabled) {
    hideYouTubeRecommendations();
  } else {
    showYouTubeRecommendations();
  }
}
