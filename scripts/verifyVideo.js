let videoIntervalId = null; // Global variable to store the interval ID
let isVideoChecked = false; // Status variable to track if the video has been checked
const BLOCK_DURATION_MINUTES = 10;
let messagesDisplayed = false;

function compareVideoWithGoals() {
  if (isVideoChecked == true) {
    console.log("Nothing happens");
  } else {
    console.log("compareVideoWithGoals started");

    // Clear any existing interval to avoid multiple checks
    if (videoIntervalId) clearInterval(videoIntervalId);

    // Start a new interval to check the video title and goals
    videoIntervalId = setInterval(() => {
      console.log("Checking the current video...");
      checkTitleAndGoals();
    }, 1000);

    function checkTitleAndGoals() {
      const titleElement = document.querySelector(
        "span.style-scope.yt-formatted-string"
      );
      const descriptionElement = document.querySelector(
        ".yt-core-attributed-string--link-inherit-color"
      );

      if (titleElement) {
        const title = titleElement.innerHTML;
        const description = descriptionElement.innerText;

        if (title && !messagesDisplayed) {
          chrome.storage.sync.get(
            ["goals", "wasteTimeCounter", "blockUntil"],
            function (data) {
              const goals = data.goals || [];
              let wasteTimeCounter = data.wasteTimeCounter || 0;
              const blockUntil = data.blockUntil || 0;
              const currentTime = new Date().getTime();

              // Reset wasteTimeCounter if block time has expired
              if (blockUntil > 0 && blockUntil <= currentTime) {
                wasteTimeCounter = 0;
                chrome.storage.sync.set(
                  { wasteTimeCounter, blockUntil: 0 },
                  function () {
                    console.log("Block time expired, counter reset.");
                    handleVideoGoals();
                  }
                );
              } else {
                handleVideoGoals();
              }

              function handleVideoGoals() {
                if (blockUntil > currentTime) {
                  chrome.runtime.sendMessage({ action: "blockSite" });
                  return;
                }

                const normalizedTitle = title
                  .toLowerCase()
                  .replace(/[.,!?]/g, "");
                const normalizedDescription = description
                  .toLowerCase()
                  .replace(/[.,!?]/g, "");

                // Check if any goal matches the title or description
                const goalMatches = goals.some((goal) => {
                  const words = goal
                    .toLowerCase()
                    .replace(/[.,!?]/g, "")
                    .split(" ");
                  return words.some(
                    (word) =>
                      normalizedTitle.includes(word) ||
                      normalizedDescription.includes(word)
                  );
                });

                if (goalMatches) {
                  console.log("Video matches goals.");
                  if (wasteTimeCounter > 0) {
                    wasteTimeCounter--;
                    chrome.storage.sync.set({ wasteTimeCounter });
                  }
                  console.log("WasteTimeCounter: " + wasteTimeCounter);
                  isVideoChecked = true; // Mark the video as checked
                } else {
                  console.log("The video does not match any goals.");

                  // Increment the wasteTimeCounter if the video doesn't match the goals
                  wasteTimeCounter++;
                  console.log(`WasteTimeCounter: ${wasteTimeCounter}`);

                  // Save the updated counter to chrome storage
                  chrome.storage.sync.set({ wasteTimeCounter }, function () {
                    console.log(
                      "Updated wasteTimeCounter saved:",
                      wasteTimeCounter
                    );

                    // Check if the counter exceeds the limit of 5
                    if (wasteTimeCounter >= 5) {
                      const blockUntilTime =
                        new Date().getTime() + BLOCK_DURATION_MINUTES * 60000;

                      // Check if the alert has already been shown
                      chrome.storage.sync.get(
                        ["alertShown", "dailyWasteTimeCounter"],
                        function (result) {
                          const alertShown = result.alertShown || false;
                          const dailyWasteTimeCounter =
                            result.dailyWasteTimeCounter || {}; // Change here

                          const currentDate = new Date()
                            .toISOString()
                            .split("T")[0]; // Get the current date in YYYY-MM-DD format

                          // Check if the wasteTimeCounter has reached 5
                          if (wasteTimeCounter >= 5) {
                            // Check if the date has changed
                            if (!dailyWasteTimeCounter[currentDate]) {
                              // Initialize the count for the new day
                              dailyWasteTimeCounter[currentDate] = 1; // Start counting for the new day
                            } else {
                              // Increment the count for the current day
                              dailyWasteTimeCounter[currentDate]++;
                            }

                            // Update storage with the new dailyWasteTimeCounter
                            chrome.storage.sync.set(
                              { dailyWasteTimeCounter: dailyWasteTimeCounter },
                              function () {
                                if (!alertShown) {
                                  // Show alert only if it hasn't been shown
                                  chrome.storage.sync.set(
                                    {
                                      alertShown: true,
                                      blockUntil: blockUntilTime,
                                    },
                                    function () {
                                      alert(
                                        `You have watched too many videos that don't match your goals. You are blocked for ${BLOCK_DURATION_MINUTES} minutes.`
                                      );
                                      chrome.runtime.sendMessage({
                                        action: "blockSite",
                                      });
                                    }
                                  );
                                } else {
                                  // Block the site directly if the alert has already been shown
                                  chrome.storage.sync.set(
                                    { blockUntil: blockUntilTime },
                                    function () {
                                      chrome.runtime.sendMessage({
                                        action: "blockSite",
                                      });
                                    }
                                  );
                                }
                              }
                            );
                          }
                        }
                      );
                    }

                    isVideoChecked = true; // Mark the video as checked
                    clearInterval(videoIntervalId); // Stop the interval
                  });
                }
                clearInterval(videoIntervalId); // Stop the interval
              }
              // Set the flag after displaying messages
              messagesDisplayed = true;
            }
          );
        }
      }
    }
  }
  // Set up the MutationObserver to watch for DOM changes
  const observer = new MutationObserver(() => {
    // Check if the title has loaded on the page
    const titleElement = document.querySelector(
      "span.style-scope.yt-formatted-string"
    );
    if (titleElement && !messagesDisplayed) {
      checkTitleAndGoals();
      observer.disconnect(); // Stop observing once the title is found and checked
    }
  });

  // Start observing changes to the entire document body
  observer.observe(document.body, {
    childList: true, // Monitor direct children of the body for changes
    subtree: true, // Watch all levels in the DOM tree
  });
}

// Set an interval to check for various conditions every second
const checkStart = setInterval(() => {
  const pathname = window.location.pathname;
  const searchParams = new URLSearchParams(window.location.search);

  // Ensure the pathname is correct and the "v" parameter exists and is valid
  if (pathname === "/watch" && searchParams.has("v")) {
    const videoId = searchParams.get("v");

    // Validate that the "v" parameter is not empty and contains exactly 11 characters
    if (videoId && videoId.length === 11) {
      const currentUrl = window.location.href;

      // Retrieve the last stored URL from chrome.storage
      chrome.storage.local.get(["lastUrl"], (result) => {
        const lastUrl = result.lastUrl;

        // Check if the current URL is different from the last stored URL
        if (currentUrl !== lastUrl) {
          console.log("New URL detected:", currentUrl);

          // Store the new URL
          chrome.storage.local.set({ lastUrl: currentUrl }, () => {
            console.log("Stored new URL:", currentUrl);
          });
          videoIntervalId = null;
          isVideoChecked = false;
          messagesDisplayed = false;
          compareVideoWithGoals();
        }
      });
    }
  }
}, 1000); // Check every 1 second

// Check if the user is allowed to access YouTube based on the blockUntil time
function checkYouTubeAccess() {
  chrome.storage.sync.get(["blockUntil"], function (data) {
    const blockUntil = data.blockUntil || 0;
    const currentTime = new Date().getTime();

    // If the current time is before the blockUntil time, block access to YouTube
    if (currentTime < blockUntil) {
      chrome.runtime.sendMessage({ action: "blockSite" });
    }
  });
}

// Call the check function if the user is anywhere on YouTube
if (window.location.href.includes("youtube.com")) {
  checkYouTubeAccess();
}

// Check if the user is allowed to access YouTube based on the blockUntil time
function checkYouTubeAccess() {
  chrome.storage.sync.get(["blockUntil"], function (data) {
    const blockUntil = data.blockUntil || 0;
    const currentTime = new Date().getTime();

    // If the current time is before the blockUntil time, block access to YouTube
    if (currentTime < blockUntil) {
      chrome.runtime.sendMessage({ action: "blockSite" });
    }
  });
}

// Call the check function if the user is anywhere on YouTube
if (window.location.href.includes("youtube.com")) {
  checkYouTubeAccess();
}
