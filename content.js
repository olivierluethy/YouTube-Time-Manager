"use strict";

// Funktion, um ein Element anhand eines Selektors auszublenden
function hideElement(selector) {
  const element = document.querySelector(selector);
  if (element) {
    element.style.display = "none";
  }
}

// Funktion, um mehrere Elemente anhand eines Selektors auszublenden
function hideElements(selector) {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    element.style.display = "none";
  });
}

// Funktion, um beim Zuschauen eines Videos innerhalb einer Playlist alle Vorschläge ausblenden nur Playlist soll noch angezeigt werden
function keepPlaylistAlive(userChannelName) {
  const playlists = document.querySelectorAll(
    "#secondary #items ytd-playlist-panel-renderer"
  );
  playlists.forEach((playlist) => {
    const playlistOwner = playlist.querySelector(
      "a.yt-simple-endpoint.style-scope.yt-formatted-string"
    );
    playlist.style.display =
      playlistOwner && playlistOwner.textContent !== userChannelName
        ? "none"
        : "block";
  });
}

// Hauptfunktion, um YouTube-Videovorschläge, Playlists und die Tablist auszublenden
function hideYouTubeRecommendations() {
  hideElements("#secondary #related ytd-compact-video-renderer"); // Empfehlungen ausblenden
  keepPlaylistAlive("Dein Kanalname"); // Fremde Playlists ausblenden
  hideElement("ytd-watch-next-secondary-results-renderer"); // Tablist ausblenden
  hideElement('.yt-simple-endpoint[title="Shorts"]'); // Shorts ausblenden
  hideElement('.yt-simple-endpoint[title="Startseite"]'); // Startseite ausblenden
  hideElement(".style-scope.ytd-guide-renderer:nth-child(3)"); // Entdecken ausblenden
  hideElement(".sbdd_b"); // Remove recommendations as you type at the search prompt
  hideElement(
    "ytd-notification-topbar-button-renderer.style-scope.ytd-masthead"
  ); // Remove notification button
}

// YouTube-Weiterleitung zur Abonnementseite
function redirectToSubscriptions() {
  if (
    window.location.hostname === "www.youtube.com" &&
    window.location.pathname === "/"
  ) {
    // Do search queries exist? If yes, no redirect, stay on the same page and load recommended videos
    chrome.storage.sync.get("goals", function (data) {
      const goals = data.goals || [];
      if (goals.length > 0) {
        searchVideos(goals);
      } else {
        window.location.href = "https://www.youtube.com/feed/subscriptions";
      }
    });
  }
}

/* YouTube API interaction for feed results */
function searchVideos(goals) {
  const apiKey = "AIzaSyBYmLMpFyEjHVEvVhob4ncb9QYAse32kJo"; // Replace with your actual API key
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
    goals.join(" ")
  )}&type=video&key=${apiKey}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // Process the search results and filter out Shorts
      const videos = data.items.filter(
        (video) => !video.id.videoId.includes("shorts")
      ); // Filter out Shorts

      // Log the recommendations to the console
      console.log("Video Recommendations:", videos);

      // Find the primary element to insert videos
      const primaryElement = document.getElementById("primary");
      primaryElement.innerHTML = ""; // Clear existing content

      if (videos.length === 0) {
        primaryElement.innerHTML = "<p>No video recommendations found.</p>";
        return;
      }

      // Create a container for the videos with flexbox styles
      const videoContainer = document.createElement("div");
      videoContainer.style.display = "flex";
      videoContainer.style.flexWrap = "wrap"; // Allow items to wrap
      videoContainer.style.gap = "16px"; // Space between items
      videoContainer.style.justifyContent = "flex-start"; // Align items to the start

      videos.forEach((video) => {
        // Create elements to display video information
        const videoElement = document.createElement("div");

        // Responsive flex properties (optional)
        videoElement.style.flex = "1 1 300px";
        videoElement.style.maxWidth = "320px";

        // Optional styling for aesthetics
        videoElement.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
        videoElement.style.borderRadius = "8px";
        videoElement.style.overflow = "hidden";
        videoElement.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.3)";

        const videoUrl = `https://www.youtube.com/watch?v=${video.id.videoId}`; // Construct the video URL

        videoElement.innerHTML = `
          <a href="${videoUrl}" target="_blank">  <img width="100%" height="180" src="${video.snippet.thumbnails.default.url}" alt="${video.snippet.title}">
          </a>
          <h3 style="color: white;">${video.snippet.title}</h3>
          <p style="color: white;">${video.snippet.description}</p>
        `;

        // Append the video element to the video container
        videoContainer.appendChild(videoElement);
      });

      // Append the video container to the primary element
      primaryElement.appendChild(videoContainer);
    })
    .catch(
      (error) => console.error("Error fetching video recommendations:", error),
      (window.location.href = "https://www.youtube.com/feed/subscriptions")
    );
}

// Function to redirect traffic from Trending page to Subscriptions page
function cheatingRedirect() {
  if (window.location.pathname.startsWith("/feed/trending")) {
    window.location.href = "https://www.youtube.com/feed/subscriptions";
  }
}

// Observer zur Beobachtung von DOM-Änderungen einrichten
function observeDOMForRecommendations(callback) {
  const observer = new MutationObserver(callback);
  observer.observe(document.body, { childList: true, subtree: true });
}

// Funktion, um das Element zu verstecken oder anzuzeigen
function toggleFeed(hideFeed) {
  const feedElement = document.querySelector(
    '.style-scope ytd-page-manager [role="main"]'
  );

  const abosFeedButton = document.querySelector(
    '.yt-simple-endpoint[title="Abos"]'
  );

  // Check if the elements exist and if the current page is the subscriptions page
  if (
    feedElement &&
    abosFeedButton &&
    window.location.pathname === "/feed/subscriptions"
  ) {
    // Show or hide the feed and the Abos button based on hideFeed
    const displayStyle = hideFeed ? "block" : "none";
    feedElement.style.display = displayStyle;
    abosFeedButton.style.display = displayStyle;
  }
}

/* Interaction Chrome Storage to remove subs page videos */
// Funktion zur Initialisierung des MutationObservers für das Feed-Element
function observeDOMForFeed() {
  const observer = new MutationObserver((mutations) => {
    chrome.storage.local.get(["hideFeed"], (res) => {
      const hideFeed = res.hideFeed ?? false; // Fallback zu false, wenn nicht gesetzt
      toggleFeed(hideFeed); // Überprüfe, ob der Feed angezeigt werden soll
    });
  });

  // Beobachte Änderungen an der Seite (dynamische Inhalte)
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// Initialisierung
redirectToSubscriptions();
// If you try to enter trends
cheatingRedirect();
observeDOMForRecommendations(hideYouTubeRecommendations);
hideYouTubeRecommendations();

// Initialen Wert aus dem Storage abrufen und den Feed sofort anpassen
chrome.storage.local.get(["hideFeed"], (res) => {
  const hideFeed = res.hideFeed ?? false;
  toggleFeed(hideFeed); // Feed initial anzeigen/ausblenden
  observeDOMForFeed(); // Beobachte Änderungen am Feed-Element
});

// Echtzeit-Überwachung von Änderungen im Storage
chrome.storage.onChanged.addListener((changes) => {
  if (changes.hideFeed) {
    toggleFeed(changes.hideFeed.newValue); // Ändert den Feed, wenn der Wert sich ändert
  }
});

/* Interaction with YouTube Logo Click */
// Funktion zum Hinzufügen des Event Listeners zum YouTube-Logo
function addLogoClickListener() {
  const logo = document.getElementById("logo");
  if (logo) {
    logo.addEventListener("click", (event) => {
      event.preventDefault(); // Standardverhalten des Links verhindern
      redirectToSubscriptions();
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

// Initialisiere den Listener beim ersten Laden der Seite
addLogoClickListener();
