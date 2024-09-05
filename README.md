<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="github.com/Olivier_Luethy/TackPad.git">
    <img src="icon/icon.png" alt="Logo" width="200" height="200">
  </a>

  <h3 align="center">YouRecoHide</h3>
  <h4 align="center">Google Chrome Extension to block YouTube Video Recommendations</h4>

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

- **Hide YouTube Recommendations:** Automatically hides all video recommendations displayed on the side while watching YouTube videos.
- **Hide Playlists from Other Users:** Ensures that only your playlists are visible while hiding playlists from other users.
- **Hide Tab List:** The tab list containing "Up Next" videos is also hidden to minimize distractions.

## How It Works

### Background Process

The extension works by inserting a content script into YouTube pages. This script manipulates the DOM to hide certain elements, including recommendations, external playlists, and the tab list. The extension's state (enabled/disabled) is stored in Chrome's sync cache, allowing it to persist across browser sessions and devices.

### User Interface

The user interface consists of a simple popup with information about the extension. The extension is already working and nothing else needs to be done.

### Content Script

The content script (`content.js`) handles the DOM manipulation:

- **hideYouTubeRecommendations:** This function hides YouTube recommendations, external playlists, and the tab list.

## Installation

1. Clone or download this repository to your local machine.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" using the toggle in the top right corner.
4. Click on "Load unpacked" and select the folder where you cloned/downloaded the extension.
5. The extension should now appear in your list of extensions and is ready to use.

## Usage

Once you download it, it will work and you do not need to do anything else. If there are any problems in the "Manage Extensions" section, you can ignore them.

## Nice to have
Originally I had planned to add a slider to the extension so you could turn it on and off as needed. But if you decide to download the extension and want to solve the problem it solves, why would you want to disable it? Why should you download this extension in the first place? For one thing, it would be technically nice to have the design, but it's also unnecessary. If someone else wants to add something, go ahead. Create a bug and I will be informed and can add the feature if it really makes sense.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author

- **Olivier Lüthy** - _Developer and Maintainer_

## Acknowledgements

- Special thanks to the Chrome Extensions documentation and various online resources for guidance in developing this extension.
