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

// Funktion, um fremde Playlists auszublenden, nur eigene werden angezeigt
function hideForeignPlaylists(userChannelName) {
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
  hideForeignPlaylists("Dein Kanalname"); // Fremde Playlists ausblenden
  hideElement("ytd-watch-next-secondary-results-renderer"); // Tablist ausblenden

// hideElement('.style-scope ytd-page-manager [role="main"]'); // YouTube Feed ausblenden
  hideElement('.yt-simple-endpoint[title="Shorts"]'); // Shorts ausblenden
  hideElement('.yt-simple-endpoint[title="Startseite"]'); // Startseite ausblenden
  hideElement(".style-scope.ytd-guide-renderer:nth-child(3)"); // Entdecken ausblenden
}

// YouTube-Weiterleitung zur Abonnementseite
function redirectToSubscriptions() {
  if (
    window.location.hostname === "www.youtube.com" &&
    window.location.pathname === "/"
  ) {
    window.location.href = "https://www.youtube.com/feed/subscriptions";
  }
}

// Observer zur Beobachtung von DOM-Änderungen einrichten
function observeDOMChanges(callback) {
  const observer = new MutationObserver(callback);
  observer.observe(document.body, { childList: true, subtree: true });
}

// Initialisierung
redirectToSubscriptions();
observeDOMChanges(hideYouTubeRecommendations);
hideYouTubeRecommendations();