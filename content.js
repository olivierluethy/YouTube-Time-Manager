// Funktion, um YouTube-Videovorschläge, fremde Playlists und die Tablist auszublenden
function hideYouTubeRecommendations() {
    // Empfehlungen im Seitenleistenbereich ausblenden
    const recommendationSections = document.querySelectorAll('#secondary #related ytd-compact-video-renderer');
    recommendationSections.forEach(element => {
        element.style.display = 'none';
    });

    // Alle Playlists im Sidebar-Bereich durchgehen
    const playlistSections = document.querySelectorAll('#secondary #items ytd-playlist-panel-renderer');
    playlistSections.forEach(playlist => {
        // Hier gehen wir sicher, dass nur Playlists angezeigt werden, die vom Benutzer stammen
        const playlistOwner = playlist.querySelector('a.yt-simple-endpoint.style-scope.yt-formatted-string');
        
        // Check if the playlist belongs to the user (anpassen an deinen Kanalnamen)
        if (playlistOwner && playlistOwner.textContent !== 'Dein Kanalname') { 
            playlist.style.display = 'none';
        } else {
            playlist.style.display = 'block';
        }
    });

    // Tablist auf der rechten Seite ausblenden
    const tabList = document.querySelector('ytd-watch-next-secondary-results-renderer');
    if (tabList) {
        tabList.style.display = 'none';
    }
}

// MutationObserver erstellen, um Änderungen im DOM zu beobachten
const observer = new MutationObserver(hideYouTubeRecommendations);

// Beobachten der Änderungen im Dokument mit der Konfiguration des Observers
observer.observe(document.body, { childList: true, subtree: true });

// Die Funktion sofort aufrufen, falls die Elemente bereits vorhanden sind
hideYouTubeRecommendations();
