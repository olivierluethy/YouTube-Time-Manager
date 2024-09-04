document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('toggle');

    // Load the current state from Chrome storage
    chrome.storage.sync.get(['isEnabled'], (result) => {
        toggle.checked = result.isEnabled !== false; // Default to enabled if not set
    });

    // Listen for changes to the toggle
    toggle.addEventListener('change', (event) => {
        const isEnabled = event.target.checked;

        // Save the new state in Chrome storage
        chrome.storage.sync.set({ isEnabled });

        // Send a message to the content script to update its behavior
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: toggleYouTubeRecommendations,
                args: [isEnabled]
            });
        });
    });
});

// Function to toggle the YouTube recommendations in the content script
function toggleYouTubeRecommendations(isEnabled) {
    if (isEnabled) {
        hideYouTubeRecommendations();
    } else {
        showYouTubeRecommendations();
    }
}
