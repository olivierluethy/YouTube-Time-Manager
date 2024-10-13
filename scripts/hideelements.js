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
// YouTube Video Vorschläge ausblenden am Ende eines Videos
// Funktion, um YouTube Videoempfehlungen am Ende eines Videos auszublenden
function removeRecoOnVideo() {
  console.log("Bereit!");

  // Überprüfen, ob die aktuelle URL eine Video-Seite ist
  function istVideoSeite() {
    return window.location.href.includes("youtube.com/watch?v=");
  }

  // Funktion, die darauf wartet, dass das Videoempfehlungen-Element erscheint, bevor es ausgeblendet wird
  function warteUndEntferneEmpfehlungen(selector, callback) {
    const intervalId = setInterval(() => {
      const element = document.querySelector(selector);
      if (element) {
        clearInterval(intervalId); // Stoppt die Schleife, wenn das Element gefunden wurde
        callback(element); // Führt die Aktion aus, wenn das Element existiert
      }
    }, 500); // Alle 500ms wird geprüft, ob das Element vorhanden ist
  }

  // Ausblenden der Videoempfehlungen am Ende des Videos
  function ausblendenEmpfehlungen(element) {
    element.style.display = "none";
    console.log("Videoempfehlungen ausgeblendet!");
  }

  // Beim Laden der Seite prüfen, ob es sich um eine Video-Seite handelt
  if (istVideoSeite()) {
    warteUndEntferneEmpfehlungen(
      ".html5-endscreen.ytp-player-content.videowall-endscreen.ytp-endscreen-paginate.ytp-show-tiles",
      ausblendenEmpfehlungen
    );
  }

  // Beobachter, der auf Änderungen in der URL reagiert
  const urlBeobachter = new MutationObserver(function () {
    if (istVideoSeite()) {
      warteUndEntferneEmpfehlungen(
        ".html5-endscreen.ytp-player-content.videowall-endscreen.ytp-endscreen-paginate.ytp-show-tiles",
        ausblendenEmpfehlungen
      );
    }
  });

  // Starten des Beobachters, um Änderungen im DOM zu überwachen
  urlBeobachter.observe(document.body, { childList: true, subtree: true });
}

removeRecoOnVideo();
