# YouRecoHide

<p align="center">
<img src="icon/icon.png" alt="Logo" width="200" height="200">
</p>

YouRecoHide is a simple yet effective Chrome extension that improves your focus by hiding YouTube recommendations, other users' playlists, and the tab list while you're watching videos. This ensures that you're not distracted by unrelated content and can focus on what's important.

## Features

- **Hide YouTube Recommendations:** Automatically hides all video recommendations displayed on the side while watching YouTube videos.
- **Hide Playlists from Other Users:** Ensures that only your playlists are visible while hiding playlists from other users.
- **Hide Tab List:** The tab list containing "Up Next" videos is also hidden to minimize distractions.

## How It Works

### Background Process

The extension works by inserting a content script into YouTube pages. This script manipulates the DOM to hide certain elements, including recommendations, external playlists, and the tab list. The extension's state (enabled/disabled) is stored in Chrome's sync cache, allowing it to persist across browser sessions and devices.

### User Interface

The user interface consists of a simple popup with information about the extension. The extension is already working and nothing has to be done further.

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

As soon as you have downloaded it, it workes already and nothing further needs to be done.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author

- **Olivier Lüthy** - _Developer and Maintainer_

## Acknowledgements

- Special thanks to the Chrome Extensions documentation and various online resources for guidance in developing this extension.
