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
function noGoalStopper() {
  if (
    window.location.href.startsWith(
      "https://www.youtube.com/results?search_query="
    )
  ) {
    // Intervall erstellen, um die Überprüfung alle 30 Sekunden durchzuführen
    const intervalId = setInterval(() => {
      console.log("We are listening to your goals");

      // Überprüfe, ob Ziele definiert sind
      const goals = getDefinedGoals(); // Funktion zum Abrufen der definierten Ziele

      // Hole das Element mit der Klasse "style-scope ytd-page-manager" und dem Role "main"
      const mainElement = document.querySelector(
        ".style-scope.ytd-page-manager[role='main']"
      );

      document.querySelector(".style-scope.ytd-search").style.display = "none";

      // Überprüfen, ob die Elemente bereits existieren
      const existingH1 = document.querySelector("h1.goal-warning");
      const existingButton = document.querySelector("button.define-goals");

      // Wenn keine Ziele definiert sind, informiere den Benutzer
      if (goals.length === 0 && mainElement) {
        // Wenn die Warnung noch nicht angezeigt wurde
        if (!existingH1 && !existingButton) {
          const h1Element = document.createElement("h1");
          h1Element.textContent = "Please define your goals first.";
          h1Element.className = "goal-warning"; // Klasse hinzufügen, um das Element später zu finden
          h1Element.style.cssText = `
            color: white;
            font-size: 30px;
          `;
          mainElement.insertBefore(h1Element, mainElement.firstChild);

          // Erstelle einen Button
          const defineGoalsButton = document.createElement("button");
          defineGoalsButton.textContent = "Define Goals";
          defineGoalsButton.className = "define-goals"; // Klasse hinzufügen, um das Element später zu finden
          defineGoalsButton.style.cssText = `
            background-color: blue;
            color: white;
            margin-top: 100px;
            padding: 18px 32px;
            cursor: pointer;
            border: none;
            margin-right: auto;
            box-shadow: 0px 0px 29px 0px rgba(255, 255, 255, 0.8);
            font-size: 15px;
          `;

          // Füge den Button nach dem h1-Element hinzu
          mainElement.insertBefore(defineGoalsButton, h1Element.nextSibling);

          // Füge einen Klick-EventListener hinzu, um den Benutzer zur Zieldefinition zu leiten
          defineGoalsButton.addEventListener("click", function () {
            // Send a message to the background script to create a new tab
            chrome.runtime.sendMessage({ action: "openGoalsPage" });
          });          

          // Remove Discover Section
          const discover = document.querySelector(".style-scope.ytd-guide-renderer:nth-child(4)");
          if(discover){
            discover.style.display="none";
          }
          document.getElementById("primary").style.display = "none";
          clearInterval(intervalId); // Intervall beenden, wenn der Benutzer benachrichtigt wurde
        }
      } else if (goals.length > 0) {
        console.log("Goals are defined, continue searching...");
      } else {
        console.warn(
          "Element mit der Klasse 'style-scope ytd-page-manager[role='main']' nicht gefunden."
        );
      }
    }, 250);
  }
}

// Funktion zum Abrufen der definierten Ziele
function getDefinedGoals() {
  return JSON.parse(localStorage.getItem("definedGoals")) || [];
}

noGoalStopper();

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
