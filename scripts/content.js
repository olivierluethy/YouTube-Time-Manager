"use strict";
// Initialisierung
redirectToSubscriptions();
// If you try to enter trends
cheatingRedirect();
observeDOMForRecommendations(hideYouTubeRecommendations);
hideYouTubeRecommendations();
// Initialisiere den Listener beim ersten Laden der Seite
addLogoClickListener();
// Funktion um Videovorschläge nach dem Betrachten eines Videos auszublenden
/* Blauer Knopf wenn ein Abonnent ein neues Video hochgeladen hat ausblenden */
// Hole alle Elemente mit der ID "items"

function hideNewnessDots() {
  // Konfiguriere den MutationObserver, um Änderungen an der DOM-Struktur zu beobachten
  const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        // Wenn ein Kind-Element hinzugefügt oder entfernt wurde, suchen wir nach neuen "newness-dot" Elementen
        const newnessDots = document.querySelectorAll("#newness-dot");
        newnessDots.forEach((dot) => {
          dot.style.display = "none";
        });
      }
    }
  });

  // Beobachte alle Elemente mit der ID "items" auf Veränderungen in der Kinderliste
  const itemsElements = document.querySelectorAll("#items");
  itemsElements.forEach((item) => {
    observer.observe(item, { childList: true });
  });
}

hideNewnessDots();

/* YouTube Titel mit Anzahl notifications entfernen */
function removeNotificationFromTitle() {
  // Überprüfe, ob der Titel Benachrichtigungen enthält und entferne sie
  if (/\(\d+\)/.test(document.title)) {
    document.title = document.title.replace(/\s*\(\d+\)/g, "");
  }
}

// Initialisierung des MutationObservers für den Titel
function observeTitle() {
  const titleObserver = new MutationObserver(() => {
    removeNotificationFromTitle();
  });

  // Beobachte nur das `head`-Element, um Titeländerungen zu erkennen
  const target = document.querySelector("head > title");
  if (target) {
    titleObserver.observe(target, {
      childList: true,
      subtree: true, // Beobachte Änderungen innerhalb des title-Elements
    });
  }
}
// Initialisiere den MutationObserver für den Titel
observeTitle();
