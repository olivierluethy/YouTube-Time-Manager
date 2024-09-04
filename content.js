// Funktion, um YouTube-Videovorschläge, fremde Playlists und die Tablist auszublenden
function hideYouTubeRecommendations() {
    const recommendationSections = document.querySelectorAll('#secondary #related ytd-compact-video-renderer');
    recommendationSections.forEach(element => {
        element.style.display = 'none';
    });

    const playlistSections = document.querySelectorAll('#secondary #items ytd-playlist-panel-renderer');
    playlistSections.forEach(playlist => {
        const playlistOwner = playlist.querySelector('a.yt-simple-endpoint.style-scope.yt-formatted-string');
        if (playlistOwner && playlistOwner.textContent !== 'Dein Kanalname') {
            playlist.style.display = 'none';
        } else {
            playlist.style.display = 'block';
        }
    });

    const tabList = document.querySelector('ytd-watch-next-secondary-results-renderer');
    if (tabList) {
        tabList.style.display = 'none';
    }
}

// Funktion, um YouTube-Videovorschläge, fremde Playlists und die Tablist wieder einzublenden
function showYouTubeRecommendations() {
    const recommendationSections = document.querySelectorAll('#secondary #related ytd-compact-video-renderer');
    recommendationSections.forEach(element => {
        element.style.display = '';
    });

    const playlistSections = document.querySelectorAll('#secondary #items ytd-playlist-panel-renderer');
    playlistSections.forEach(playlist => {
        playlist.style.display = '';
    });

    const tabList = document.querySelector('ytd-watch-next-secondary-results-renderer');
    if (tabList) {
        tabList.style.display = '';
    }
}

// Load initial state from storage and apply it
chrome.storage.sync.get(['isEnabled'], (result) => {
    if (result.isEnabled !== false) {
        hideYouTubeRecommendations();
    }
});
