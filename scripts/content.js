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
  console.log("I'm running!")
  const observer = new MutationObserver(() => {
    const primaryElement = document.getElementById("primary");

    if (primaryElement) {
      // Stop observing after the primary element is found
      observer.disconnect();

      // Function to check goals and update UI
      const updateUI = () => {
        chrome.storage.sync.get("goals", function (data) {
          const goals = data.goals || [];
          const mainElement = document.querySelector(
            ".style-scope.ytd-page-manager[role='main']"
          );

          if (goals.length === 0) {
            // Hide search results and show warning if no goals are present
            primaryElement.style.display = "none";

            const container = document.querySelector(".style-scope.ytd-search");
            if (container) {
              container.style.display = "none";
            }

            if (mainElement) {
              mainElement.style.height = "50vh"; // Adjust main element height

              const filterButton = document.querySelector(
                '.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--text[aria-label="Suchfilter"]'
              );
              if (filterButton) {
                filterButton.style.display = "none";
              }

              const warningDiv = document.createElement("div");
              warningDiv.className = "goal-warning";
              warningDiv.style.cssText = `
                text-align: center;
                margin-top: auto;
                margin-bottom: auto;
              `;

              const h1Element = document.createElement("h1");
              h1Element.textContent = "Please define your goals first.";
              h1Element.className = "goal-warning"; // Add class for easy removal
              h1Element.style.cssText = `
                color: white;
                font-size: 30px;
              `;

              const defineGoalsButton = document.createElement("button");
              defineGoalsButton.textContent = "Define Goals";
              defineGoalsButton.className = "define-goals"; // Add class for easy removal
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
              defineGoalsButton.title = "Click here to go to the goals page.";

              defineGoalsButton.addEventListener("click", function () {
                chrome.runtime.sendMessage({ action: "openGoalsPage" });
              });

              warningDiv.appendChild(h1Element);
              warningDiv.appendChild(defineGoalsButton);

              if (!document.querySelector(".goal-warning")) {
                mainElement.insertBefore(warningDiv, mainElement.firstChild);
                const discover = document.querySelector(
                  ".style-scope.ytd-guide-renderer:nth-child(4)"
                );
                if (discover) {
                  discover.style.display = "none";
                }
              }
            }
          } else {
            // If goals exist, ensure elements are visible
            primaryElement.style.display = "block";

            const filterButton = document.querySelector(
              '.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--text[aria-label="Suchfilter"]'
            );
            if (filterButton) {
              filterButton.style.display = "inline-block";
            }

            const existingH1 = document.querySelector("h1.goal-warning");
            const existingButton = document.querySelector(
              "button.define-goals"
            );
            if (existingH1) existingH1.remove();
            if (existingButton) existingButton.remove();

            const discover = document.querySelector(
              ".style-scope.ytd-guide-renderer:nth-child(4)"
            );
            if (discover) {
              discover.style.display = "block";
            }
          }
        });
      };

      // Initial UI update
      updateUI();

      // Listen for changes in storage
      chrome.storage.onChanged.addListener(function (changes, namespace) {
        if (namespace === "sync" && changes.goals) {
          updateUI();
        }
      });
    }
  });

  // Start observing the document for changes
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function searchObserve() {
  const urlObserver = new MutationObserver(() => {
    if (window.location.href.startsWith("https://www.youtube.com/results?")) {
      console.log("Searching without goal!")
      noGoalStopper();
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
