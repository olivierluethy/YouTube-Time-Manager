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
    // Intervall erstellen, um die Überprüfung regelmäßig durchzuführen
    const intervalId = setInterval(() => {
      console.log("We are listening to your goals");

      // Ziele aus dem Chrome-Speicher abrufen
      chrome.storage.sync.get("goals", function (data) {
        const goals = data.goals || [];

        // Wenn keine Ziele definiert sind
        if (goals.length === 0) {
          console.log("Es wurden keine Ziele definiert");
          // Haupt-Element holen, in dem die Nachricht angezeigt werden soll
          const mainElement = document.querySelector(
            ".style-scope.ytd-page-manager[role='main']"
          );

          // Suchergebnisse ausblenden, falls keine Ziele vorhanden sind
          const searchResults = document.querySelector("#primary");
          if (searchResults) {
            searchResults.style.display = "none";
          }

          // Container Box on the right
          const container = document.querySelector(".style-scope.ytd-search");
          if (container) {
            container.style.display = "none";
          }

          // Search Header
          const header = document.querySelector(
            ".style-scope.ytd-page-manager[role='main']"
          );
          if (header) {
            header.style.height = "50vh";
          }

          // Filter-Knopf ausblenden
          const filterButton = document.querySelector(
            '.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--text[aria-label="Suchfilter"]'
          );
          if (filterButton) {
            filterButton.style.display = "none";
          }

          // Überprüfen, ob die Elemente bereits existieren
          const existingWarning = document.querySelector(".goal-warning");

          // Wenn das Haupt-Element existiert und die Warnung noch nicht erstellt wurde
          if (mainElement && !existingWarning) {
            // Erstelle ein Wrapper-Div für die Warnung und den Button, damit beide in derselben Klasse sind
            const warningDiv = document.createElement("div");
            warningDiv.className = "goal-warning"; // Beide Elemente in dieser Klasse
            warningDiv.style.cssText = `
              text-align: center;
              margin-top: auto;
              margin-bottom: auto;
            `;

            // Nachricht hinzufügen
            const h1Element = document.createElement("h1");
            h1Element.textContent = "Please define your goals first.";
            h1Element.style.cssText = `
              color: white;
              font-size: 30px;
            `;

            // Button hinzufügen
            const defineGoalsButton = document.createElement("button");
            defineGoalsButton.textContent = "Define Goals";
            defineGoalsButton.style.cssText = `
              background-color: blue;
              color: white;
              padding: 18px 32px;
              cursor: pointer;
              border: none;
              box-shadow: 0px 0px 29px 0px rgba(255, 255, 255, 0.8);
              font-size: 15px;
              margin-top: 20px;
              transition-duration: 0.5s;
            `;
            // Add mouseover and mouseout event listeners for hover effect
            defineGoalsButton.addEventListener("mouseover", function () {
              defineGoalsButton.style.backgroundColor = "white"; // Change to desired hover color
              defineGoalsButton.style.color = "blue"; // Change text color on hover if needed
              defineGoalsButton.style.transform = "scale(1.05)"; // Optional scaling
            });

            defineGoalsButton.addEventListener("mouseout", function () {
              defineGoalsButton.style.backgroundColor = "blue"; // Reset to original color
              defineGoalsButton.style.color = "white"; // Reset text color
              defineGoalsButton.style.transform = "scale(1)"; // Reset scaling
            });
            defineGoalsButton.title = "Click here to go to the goals page.";

            // Button-Klick-Event hinzufügen
            defineGoalsButton.addEventListener("click", function () {
              // Nachricht an Hintergrundskript senden, um neuen Tab zu öffnen
              chrome.runtime.sendMessage({ action: "openGoalsPage" });
            });

            // Füge die Nachricht und den Button in den Wrapper-Div ein
            warningDiv.appendChild(h1Element);
            warningDiv.appendChild(defineGoalsButton);

            // Füge das Wrapper-Div an das Haupt-Element ein
            mainElement.insertBefore(warningDiv, mainElement.firstChild);

            // Entdecker-Sektion ausblenden
            const discover = document.querySelector(
              ".style-scope.ytd-guide-renderer:nth-child(4)"
            );
            if (discover) {
              discover.style.display = "none";
            }

            // Intervall beenden, sobald die Nachricht angezeigt wurde
            clearInterval(intervalId);
          }
        } else {
          // Wenn Ziele definiert sind, Suchergebnisse anzeigen
          const searchResults = document.querySelector("#primary");
          if (searchResults) {
            searchResults.style.display = "block"; // Suchergebnisse wieder einblenden
          }

          // Filter-Knopf wieder anzeigen
          const filterButton = document.querySelector(
            '.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--text[aria-label="Suchfilter"]'
          );
          if (filterButton) {
            filterButton.style.display = "inline-block"; // Filter wieder anzeigen
          }

          // Warnung und Button ausblenden, falls vorhanden
          const existingH1 = document.querySelector("h1.goal-warning");
          const existingButton = document.querySelector("button.define-goals");

          if (existingH1) {
            existingH1.remove(); // Entfernt die Warnung
          }
          if (existingButton) {
            existingButton.remove(); // Entfernt den Button
          }

          // Entdecker-Sektion wieder anzeigen
          const discover = document.querySelector(
            ".style-scope.ytd-guide-renderer:nth-child(4)"
          );
          if (discover) {
            discover.style.display = "block"; // Entdecker-Sektion wieder einblenden
          }

          // Intervall beenden, wenn Ziele definiert sind
          clearInterval(intervalId);
        }
      });
    }, 250);
  }
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
