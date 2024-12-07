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

let intervalId = null; // Global speichern

function noGoalStopper() {
  if (window.location.href.startsWith("https://www.youtube.com/results?")) {
    // Verhindert mehrere Intervalle
    if (intervalId) clearInterval(intervalId);

    intervalId = setInterval(() => {
      console.log("We are listening to your goals");

      chrome.storage.sync.get("goals", function (data) {
        const goals = data.goals || [];

        if (goals.length === 0) {
          console.log("Es wurden keine Ziele definiert");
          const mainElement = document.querySelector(
            ".style-scope.ytd-page-manager[role='main']"
          );

          const searchResults = document.querySelector("#primary");
          if (searchResults) {
            searchResults.style.display = "none";
          }

          const container = document.querySelector(".style-scope.ytd-search");
          if (container) {
            container.style.display = "none";
          }

          const header = document.querySelector(
            ".style-scope.ytd-page-manager[role='main']"
          );
          if (header) {
            header.style.height = "50vh";
          }

          const filterButton = document.querySelector(
            '.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--text[aria-label="Suchfilter"]'
          );
          if (filterButton) {
            filterButton.style.display = "none";
          }

          const existingWarning = document.querySelector(".goal-warning");
          if (mainElement && !existingWarning) {
            const warningDiv = document.createElement("div");
            warningDiv.className = "goal-warning";
            warningDiv.style.cssText = `
              text-align: center;
              margin-top: auto;
              margin-bottom: auto;
            `;

            const h1Element = document.createElement("h1");
            h1Element.textContent = "Please define your goals first.";
            h1Element.style.cssText = `
              color: white;
              font-size: 30px;
            `;

            const defineGoalsButton = document.createElement("button");
            defineGoalsButton.textContent = "Define Goals";
            defineGoalsButton.title = "Click here to define your goals";
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

            defineGoalsButton.addEventListener("mouseover", function () {
              defineGoalsButton.style.backgroundColor = "white";
              defineGoalsButton.style.color = "blue";
              defineGoalsButton.style.transform = "scale(1.05)";
            });

            defineGoalsButton.addEventListener("mouseout", function () {
              defineGoalsButton.style.backgroundColor = "blue";
              defineGoalsButton.style.color = "white";
              defineGoalsButton.style.transform = "scale(1)";
            });

            defineGoalsButton.addEventListener("click", function () {
              chrome.runtime.sendMessage({ action: "openGoalsPage" });
            });

            warningDiv.appendChild(h1Element);
            warningDiv.appendChild(defineGoalsButton);
            mainElement.insertBefore(warningDiv, mainElement.firstChild);

            clearInterval(intervalId); // Stoppe hier das Intervall, da es den Zweck erfüllt hat
          }
        } else {
          const searchResults = document.querySelector("#primary");
          if (searchResults) {
            searchResults.style.display = "block";
          }

          const filterButton = document.querySelector(
            '.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--text[aria-label="Suchfilter"]'
          );
          if (filterButton) {
            filterButton.style.display = "inline-block";
          }

          const existingWarning = document.querySelector(".goal-warning");
          if (existingWarning) {
            existingWarning.remove();
          }

          clearInterval(intervalId); // Stoppe das Intervall, wenn Ziele existieren
        }
      });

      // Prüfen, ob die URL die Suchseite verlässt
      if (
        !window.location.href.startsWith("https://www.youtube.com/results?")
      ) {
        clearInterval(intervalId);
        intervalId = null; // Setze es zurück
      }
    }, 1000);
  }
}

function searchObserve() {
  const urlObserver = new MutationObserver(() => {
    if (window.location.href.startsWith("https://www.youtube.com/results?")) {
      console.log("Searching without goal!");
      noGoalStopper();
    } else if (intervalId) {
      clearInterval(intervalId);
      intervalId = null; // Zurücksetzen, wenn nicht auf der Suchseite
    }
  });

  urlObserver.observe(document, {
    subtree: true,
    childList: true,
  });
}
searchObserve();

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
