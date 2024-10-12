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
