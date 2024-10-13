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
  if (window.location.href.includes("youtube.com/watch?v=")) {
    console.log(
      "Vorschläge werden überwacht und entfernt, sobald sie erscheinen."
    );

    // Callback function to execute when mutations are observed
    const observerCallback = function (mutationsList, observer) {
      // Try to find the container with the class ".ytp-endscreen-content"
      const targetContainer = document.querySelector(".ytp-endscreen-content");
      console.log("Wir haben das ziel im Blick!")

      if (targetContainer) {
        // Find all elements with the class "ytp-videowall-still ytp-videowall-still-round-medium ytp-suggestion-set"
        const elementsToRemove = targetContainer.querySelectorAll(
          ".ytp-videowall-still.ytp-videowall-still-round-medium.ytp-suggestion-set"
        );

        // Iterate through each of those elements and remove them
        elementsToRemove.forEach((element) => {
          console.log("Vorschlag entfernt:", element);
          element.remove();
        });

        // If the elements are found and removed, we can disconnect the observer
        if (elementsToRemove.length > 0) {
          observer.disconnect();
        }
      }
    };

    // Create a MutationObserver instance
    const observer = new MutationObserver(observerCallback);

    // Start observing changes in the body (or more specifically if you know the parent container)
    observer.observe(document.body, { childList: true, subtree: true });
  }
}

// Call the function to start the observer
removeRecoOnVideo();
