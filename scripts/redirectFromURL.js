// Function to redirect traffic from Trending page to Subscriptions page
function cheatingRedirect() {
  if (window.location.pathname.startsWith("/feed/trending")) {
    window.location.href = "https://www.youtube.com/feed/subscriptions";
  }
}

// YouTube-Weiterleitung zur Abonnementseite
function redirectToSubscriptions() {
  if (
    window.location.hostname === "www.youtube.com" &&
    window.location.pathname === "/"
  ) {
    // Check if there are any goals
    chrome.storage.sync.get("goals", function (data) {
      const goals = data.goals || [];

      if (goals.length > 0) {
        // If goals exist, load recommended videos
        searchVideos(goals);
      } else {
        // If there are no goals, check hideFeed value
        chrome.storage.local.get(["hideFeed"], (res) => {
          const hideFeed = res.hideFeed ?? false; // Default to false if not set

          // Hide the "Abos" button based on the hideFeed value
          const abosButton = document.querySelector(
            '.yt-simple-endpoint[title="Abos"]'
          );
          if (abosButton) {
            abosButton.style.display = hideFeed ? "none" : "block"; // Hide or show based on hideFeed
          }

          if (hideFeed === false) {
            // Redirect to the playlist section if hideFeed is false
            window.location.href = "https://www.youtube.com/playlist?list=WL";
          } else {
            // Redirect to the subscriptions page if hideFeed is true
            window.location.href = "https://www.youtube.com/feed/subscriptions";
          }
        });
      }
    });
  }
}
function checkIfLogin() {
  console.log("Loginüberprüfung aktiviert!");
  if (
    window.location.href.startsWith("https://www.youtube.com/playlist?list=WL")
  ) {
    console.log("Du bist in der Playlist!");

    // Intervall erstellen, um die Überprüfung alle 30 Sekunden durchzuführen
    const intervalId = setInterval(() => {
      // Hole das Element mit der ID "alerts"
      const alertsElement = document.getElementById("alerts");

      // Überprüfe, ob das Element gefunden wurde
      if (alertsElement) {
        console.log("Der Alert Text existiert!");
        // Suche nach dem yt-alert-renderer innerhalb von alertsElement
        const alertRenderer = alertsElement.querySelector(
          ".style-scope.ytd-browse"
        );
        if (alertRenderer) {
          // Suche nach dem Element mit der Klasse "ERROR" innerhalb von alertRenderer
          const errorElement = alertRenderer.querySelector(".ERROR");
          if (errorElement) {
            // Wenn das Element existiert, setze den Stil
            alertsElement.style.display = "none";

            // Hole das Element mit der Klasse "style-scope ytd-page-manager" und dem Role "main"
            const mainElement = document.querySelector(
              ".style-scope.ytd-page-manager[role='main']"
            );

            // Wenn das Element existiert, erstelle ein neues h1-Element
            if (mainElement) {
              const h1Element = document.createElement("h1");
              h1Element.textContent = "You are currently not logged in";
              h1Element.style.cssText = `
                color: white;
                font-size: 30px;
              `;
              mainElement.insertBefore(h1Element, mainElement.firstChild);

              // Erstelle einen Button
              const loginButton = document.createElement("button");
              loginButton.textContent = "Sign up for YouTube";
              loginButton.style.cssText = `
                background-color: blue;
                color: white;
                margin-top: 20px;
                padding: 18px 32px;
                cursor: pointer;
                border: none;
                box-shadow: 0px 0px 29px 0px rgba(255, 255, 255, 0.8);
                font-size: 15px;
              `;

              // Füge den Button nach dem h1-Element hinzu
              mainElement.insertBefore(loginButton, h1Element.nextSibling);

              // Füge einen Klick-EventListener hinzu, der zum YouTube-Login führt
              loginButton.addEventListener("click", () => {
                window.location.href =
                  "https://accounts.google.com/ServiceLogin?service=youtube&uilel=3&passive=true&continue=https%3A%2F%2Fwww.youtube.com%2Fsignin%3Faction_handle_signin%3Dtrue%26app%3Ddesktop%26hl%3Dde%26next%3Dhttps%253A%252F%252Fwww.youtube.com%252Fplaylist%253Flist%253DWL&hl=de&ec=65620";
              });

              // Remove Discover Section
              document.querySelector(
                ".style-scope.ytd-guide-renderer:nth-child(4)"
              ).style.display = "none";
              clearInterval(intervalId); // Intervall beenden, wenn beide Elemente gefunden wurden
            } else {
              console.warn(
                "Element mit der Klasse 'style-scope.ytd-page-manager[role='main']' nicht gefunden."
              );
            }
          }
        }
      } else {
        console.warn("Element mit der ID 'alerts' nicht gefunden.");
      }
    }, 250);
  }
}
checkIfLogin();

/* Interaction with YouTube Logo Click */
// Funktion zum Hinzufügen des Event Listeners zum YouTube-Logo
function addLogoClickListener() {
  const logo = document.getElementById("logo");
  if (logo) {
    logo.addEventListener("click", (event) => {
      event.preventDefault(); // Standardverhalten des Links verhindern

      // Retrieve the current value of hideFeed from storage
      chrome.storage.local.get(["hideFeed"], (res) => {
        const hideFeed = res.hideFeed ?? false; // Default to false if not set

        if (hideFeed === false) {
          // Redirect to the playlist section if hideFeed is false
          document.querySelector(
            '.yt-simple-endpoint[title="Abos"]'
          ).style.display = "none";
          window.location.href = "https://www.youtube.com/playlist?list=WL";
        } else {
          // Redirect to the subscriptions page if hideFeed is true
          redirectToSubscriptions();
        }
      });
    });
  }
}

// MutationObserver zur Beobachtung von DOM-Änderungen
const observer = new MutationObserver((mutations) => {
  addLogoClickListener(); // Überprüfe das Vorhandensein des Logos und füge den Listener hinzu
});

// Beobachte den Body auf Änderungen
observer.observe(document.body, {
  childList: true,
  subtree: true,
});
