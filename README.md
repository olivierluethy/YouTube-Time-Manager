<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="github.com/Olivier_Luethy/TackPad.git">
    <img src="icon/icon.png" alt="Logo" width="200" height="200">
  </a>

  <h3 align="center">YouRecoHide</h3>
  <h4 align="center">Google Chrome extension to block YouTube video recommendations without affecting the visibility of open playlists</h4>

  <p align="center">
    Here I'll explain how I developed the application called YouRecoHide
    <br />
    <a href="github.com/olivierluethy/YouRecoHide/blob/master/README.md"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/olivierluethy/YouRecoHide/">View Demo</a>
    ·
    <a href="https://github.com/olivierluethy/YouRecoHide/issues">Report Bug</a>
    ·
    <a href="https://github.com/olivierluethy/YouRecoHide/issues">Request Feature</a>
  </p>
</p>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#features">Features</a>
    </li>
    <li>
      <a href="#how-it-works">How It Works</a>
    </li>
    <li>
      <a href="#installation">Installation</a>
    </li>
    <li>
      <a href="#usage">Usage</a>
    </li>
    <li>
      <a href="#license">License</a>
    </li>
    <li>
      <a href="#author">Author</a>
    </li>
  </ol>
</details>

YouRecoHide is a simple yet effective Chrome extension that improves your focus by hiding YouTube recommendations, other users' playlists, and the tab list while you're watching videos. This ensures that you're not distracted by unrelated content and can focus on what's important.

## Features
- 🏠 **Remove YouTube Feeds on the Home Page**  
  Clear out unnecessary content on your YouTube homepage by removing constant updates and recommendations. Maintain a clean and distraction-free environment for better focus.<br>
- 🔥 **Remove the Discovery Section**  
  Trending content can easily pull you away from your goals. YouRecoHide removes the discovery section, allowing you to avoid distractions and stay focused on what matters.<br>
- 🔔 **Control Subscriptions Visibility**  
  Decide whether or not to display videos from channels you’ve subscribed to. Use the toggle within the extension’s popup window to switch visibility on or off, with clear text indicating what’s changed.<br>
- 🛡️ **Smart Blocking for Trending Bypass Attempts**  
  For users who might be tempted to visit the trending section manually, YouRecoHide steps in. If you try to access the trending section via the URL, the extension smartly redirects you to your subscriptions, ensuring a focused experience.<br>
- 🎥 **Keep Playlists Visible While Hiding Recommendations**  
  Unlike other extensions that block recommendations and hide playlists, YouRecoHide maintains playlist visibility so you can easily switch between videos within your playlist while keeping distracting video suggestions out of sight.

## How It Works

### Background Process

The extension works by inserting a content script into YouTube pages. This script manipulates the DOM to hide certain elements, including recommendations, external playlists, and the tab list. The extension's state (enabled/disabled) is stored in Chrome's sync cache, allowing it to persist across browser sessions and devices.

### User Interface
The user interface consists of a simple popup with a toggle switch:
- **Toggle Switch:** Allows the user to enable or disable the hiding of YouTube subscription videos. The state of the switch is synchronized with the state stored in the Chrome cache.
- **Text Indicator:** Displays "Toggle On" or "Toggle Off" depending on the current state of the extension.

### Content Script

The content script (`content.js`) handles all the DOM manipulation:
- **hideYouTubeRecommendations:** This function hides YouTube recommendations, external playlists, and the tab list.
- **hideElement:** This function handles the general selectors which distract for example Trends Tab or Home Tab.
- **hideElements:** This function hides all elements inside a specific selector
- **keepPlaylistAlive:** While watching a video block all video recommendations but keep the playlist alive if the video currently watched is inside of a playlist
- **hideYouTubeRecommendations:** Responsible for running all the disability by using **hideElements** and **keepPlaylistAlive** function
- **redirectToSubscriptions:** After entering YouTube it will redirect you to the subscription feed
- **cheatingRedirect:** People tend to bypass blockings to be still able to see distractions. It blocks access to all feeds related to the **trending** field
- **observeDOMForRecommendations:** Observe DOM-Chases after the page has fully loaded
- **toggleFeed:** Is responsible for handling changes based on the activated toggle inside the popup and uses the **toggleFeed** function itself running
- **observeDOMForFeed:** Observes the activity inside the feed and then uses **toggleFeed** function to do further things
  
The content script (`popup.js`) handles all the DOM for the popup:
- **updateToggleText:** Updates the text illustrating the current state of the toggle
  
## Installation

1. Clone or download this repository to your local machine.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" using the toggle in the top right corner.
4. Click on "Load unpacked" and select the folder where you cloned/downloaded the extension.
5. The extension should now appear in your list of extensions and is ready to use.

## Usage
1. Click on the extension icon in the Chrome toolbar.
2. Use the toggle switch to enable or disable the hiding of YouTube subscription videos.
3. The state of the extension (enabled or disabled) will be remembered for future browsing sessions.

## Nice to have
Originally I had planned to add a slider to the extension so you could turn it on and off as needed. But if you decide to download the extension and want to solve the problem it solves, why would you want to disable it? Why should you download this extension in the first place? For one thing, it would be technically nice to have the design, but it's also unnecessary. If someone else wants to add something, go ahead. Create a bug and I will be informed and can add the feature if it really makes sense.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author

- **Olivier Lüthy** - _Developer and Maintainer_

## Acknowledgements

- Special thanks to the Chrome Extensions documentation and various online resources for guidance in developing this extension.

## Disclaimer
I don't store any of your information. If you don't believe me, all the code is in this repo so you can check it out for yourself. The only data that is stored is on your own computer. This is necessary for Chrome to remember what you chose to hide when you refresh your page.
YouRecoHide for YouTube is not affiliated with YouTube.
