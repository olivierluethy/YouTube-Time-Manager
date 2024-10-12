"use strict";

// Initialisierung
redirectToSubscriptions();
// If you try to enter trends
cheatingRedirect();
observeDOMForRecommendations(hideYouTubeRecommendations);
hideYouTubeRecommendations();
// Funktion um Videovorschläge nach dem Betrachten eines Videos auszublenden
removeRecoOnVideo();
// Initialisiere den Listener beim ersten Laden der Seite
addLogoClickListener();

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

// YouTube Video Vorschläge ausblenden am Ende eines Videos
function removeRecoOnVideo() {
  // Überprüfen, ob die aktuelle URL ein YouTube-Video ist
  const isVideoPage = () =>
    window.location.href.includes("youtube.com/watch?v=");

  // Funktion zum Ausblenden der Videoempfehlungen
  const hideRecommendations = () => {
    const distOnVid = document.querySelector(
      ".html5-endscreen.ytp-player-content.videowall-endscreen.ytp-endscreen-paginate.ytp-show-tiles"
    );
    if (distOnVid) {
      distOnVid.style.display = "none";
    }
  };

  // Initiales Überprüfen der URL
  if (isVideoPage()) {
    hideRecommendations();
  }

  // Observer, um Änderungen der URL zu überwachen
  const observer = new MutationObserver(() => {
    if (isVideoPage()) {
      hideRecommendations();
    }
  });

  // Observer-Konfiguration
  observer.observe(document.body, { childList: true, subtree: true });
}

/* YouTube API interaction for feed results */
function searchVideos(goals) {
  if (!goals || goals.length === 0) {
    console.log("No goals provided. Exiting the function.");
    return;
  }

  chrome.storage.sync.get(["doubleGoals", "videoData"], (res) => {
    const storedGoals = res.doubleGoals || [];
    const storedVideos = res.videoData || [];

    // TODO: Make the feed created by extension look originally like this from youtube itself
    // TODO: Make it possible to save videos recommended
    // TODO: Auf der Startliste anzeigen für welches Ziel welche Videos angezeigt werden und nicht flach alles auf einmal
    // Compare the current goals with stored goals
    if (JSON.stringify(storedGoals) === JSON.stringify(goals)) {
      console.log("Goals are the same, displaying cached videos.");
      console.log("Cached Videos:", storedVideos); // Debugging output

      // Dieser Teil soll nach 5 Sekunden erst geladen werden
      setTimeout(() => {
        const primaryElement = document.getElementById("primary");

        // Überprüfe, ob das primäre Element existiert
        if (!primaryElement) {
          console.error("Element mit ID 'primary' wurde nicht gefunden.");
          return; // Beende die Funktion, wenn das Element nicht existiert
        }

        primaryElement.innerHTML = ""; // Clear existing content

        const videoContainer = document.createElement("div");
        videoContainer.style.display = "flex";
        videoContainer.style.flexWrap = "wrap";
        videoContainer.style.gap = "16px";
        videoContainer.style.justifyContent = "flex-start";

        storedVideos.forEach((video) => {
          const videoElement = document.createElement("div");
          videoElement.style.flex = "1 1 300px";
          videoElement.style.maxWidth = "320px";
          videoElement.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
          videoElement.style.borderRadius = "8px";
          videoElement.style.overflow = "hidden";
          videoElement.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.3)";

          videoElement.innerHTML = `
        <a href="${video.url}" target="_blank">
          <img width="100%" height="180" src="${video.thumbnail}" alt="${video.title}">
        </a>
        <h3 style="color: white;margin-left:0.5rem;">${video.title}</h3>
        <p style="color: white;margin-left:0.5rem;">${video.description}</p>
      `;

          videoContainer.appendChild(videoElement);
        });

        primaryElement.appendChild(videoContainer);
      }, 200); // 5000 Millisekunden = 5 Sekunden
    } else {
      const apiKey = "AIzaSyBYmLMpFyEjHVEvVhob4ncb9QYAse32kJo";
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        goals.join(" ")
      )}&type=video&key=${apiKey}`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            console.error("API Error:", data.error);
            handleAPIErrors(data.error);
            return;
          }

          const videos = data.items
            ? data.items.filter((video) => {
                const titleLower = video.snippet.title.toLowerCase();
                const descriptionLower =
                  video.snippet.description?.toLowerCase(); // Optional chaining for description
                return !(
                  titleLower.includes("shorts") ||
                  (descriptionLower && descriptionLower.includes("shorts"))
                );
              })
            : [];

          console.log("Video Recommendations:", videos);

          if (videos.length === 0) {
            document.getElementById("primary").innerHTML =
              "<p>No video recommendations found.</p>";
            return;
          }

          const videoData = videos.map((video) => ({
            title: video.snippet.title,
            url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
            description: video.snippet.description,
            thumbnail: video.snippet.thumbnails.default.url,
          }));

          // Store the new goals and videos in Chrome Storage
          chrome.storage.sync.set(
            { doubleGoals: goals, videoData: videoData },
            () => {
              console.log("Goals and video data stored:", goals, videoData);
            }
          );

          displayVideos(videoData);
        })
        .catch((error) => {
          console.error("Error fetching video recommendations:", error);
          // Redirect or handle error
        });
    }
  });
}

function displayVideos(videoData) {
  console.log("The Videos are here! " + videoData);

  const primaryElement = document.getElementById("primary");
  primaryElement.innerHTML = ""; // Clear existing content

  if (videoData.length === 0) {
    primaryElement.innerHTML = "<p>No video recommendations found.</p>";
    return; // Early exit if no videos
  }

  const videoContainer = document.createElement("div");
  videoContainer.style.display = "flex";
  videoContainer.style.flexWrap = "wrap";
  videoContainer.style.gap = "16px";
  videoContainer.style.justifyContent = "flex-start";

  videoData.forEach((video) => {
    const videoElement = document.createElement("div");
    videoElement.style.flex = "1 1 300px";
    videoElement.style.maxWidth = "320px";
    videoElement.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
    videoElement.style.borderRadius = "8px";
    videoElement.style.overflow = "hidden";
    videoElement.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.3)";

    videoElement.innerHTML = `
      <a href="${video.url}" target="_blank">
        <img width="100%" height="180" src="${video.thumbnail}" alt="${video.title}">
      </a>
      <h3 style="color: white;">${video.title}</h3>
      <p style="color: white;">${video.description}</p>
    `;

    videoContainer.appendChild(videoElement);
  });

  primaryElement.appendChild(videoContainer);
}

function handleAPIErrors(error) {
  if (error.code === 403 || error.status === "PERMISSION_DENIED") {
    // Handle permissions and redirect logic
  }
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
    try {
      // Sicherstellen, dass der Chrome-Storage-Zugriff nur erfolgt, wenn der Kontext gültig ist
      if (chrome && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(["hideFeed"], (res) => {
          const hideFeed = res.hideFeed ?? false; // Fallback zu false, wenn nicht gesetzt
          toggleFeed(hideFeed); // Überprüfe, ob der Feed angezeigt werden soll
        });
      } else {
        console.error("Chrome Storage API ist nicht verfügbar.");
      }
    } catch (err) {
      console.error("Fehler beim Zugriff auf Chrome Storage: ", err);
    }
  });

  // Beobachte Änderungen an der Seite (dynamische Inhalte)
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

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
// YouTube Titel mit Anzahl notifications zu entfernen
document.title = document.title.replace(/\s*\(\d+\)/g, "");
