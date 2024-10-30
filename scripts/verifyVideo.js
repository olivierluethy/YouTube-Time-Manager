// Check if the title matches any goals
let messagesDisplayed = false;
const BLOCK_DURATION_MINUTES = 10;

function compareVideoWithGoals() {
  // Function to compare the video title with the user's goals
  function checkTitleAndGoals() {
    const titleElement = document.querySelector(
      "yt-formatted-string.style-scope.ytd-watch-metadata"
    );
    const descriptionElement = document.getElementById("description-inner");
    if (titleElement && descriptionElement) {
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

            // Check if the block time has passed and reset the wasteTimeCounter if it has
            if (blockUntil > 0 && blockUntil <= currentTime) {
              wasteTimeCounter = 0;
              chrome.storage.sync.set(
                { wasteTimeCounter, blockUntil: 0 },
                function () {
                  console.log(
                    "Block time expired. wasteTimeCounter reset to 0."
                  );

                  // Continue logic after resetting the counter to 0
                  handleVideoGoals();
                }
              );
            } else {
              // If no reset is needed, continue with normal logic
              handleVideoGoals();
            }

            // Function to handle checking the video goals and updating wasteTimeCounter
            function handleVideoGoals() {
              // Check if the user is currently blocked
              if (blockUntil > currentTime) {
                const minutesRemaining = Math.ceil(
                  (blockUntil - currentTime) / 60000
                );

                // Save the remaining block time to Chrome storage
                chrome.storage.sync.set(
                  { remainingBlockTime: minutesRemaining },
                  function () {
                    console.log(
                      "Remaining block time saved:",
                      minutesRemaining,
                      "minutes"
                    );
                  }
                );

                // Send a message to the background script to redirect the user
                chrome.runtime.sendMessage({ action: "blockSite" });
                return;
              }

              // Normalize the title and description for comparison (case insensitive)
              const normalizedTitle = title.toLowerCase();
              const normalizedDescription = description.toLowerCase();

              // Split the title and description into individual words (this helps with exact word matching)
              const titleWords = normalizedTitle.split(/\s+/);
              const descriptionWords = normalizedDescription.split(/\s+/);

              console.log("The video title: " + titleWords);
              console.log("Video description: " + descriptionWords);

              // Check if any goal word matches a word in the title or description
              const goalMatches = goals.some((goal) => {
                const normalizedGoal = goal.toLowerCase();

                console.log("The Goals: " + goal);

                // Check if the goal matches a word in the title or description
                return (
                  titleWords.includes(normalizedGoal) ||
                  descriptionWords.includes(normalizedGoal)
                );
              });

              if (goalMatches) {
                console.log("The video matches one or more goals.");
                if (wasteTimeCounter > 0) {
                  wasteTimeCounter--;
                  console.log(`WasteTimeCounter: ${wasteTimeCounter}`);

                  // Save the updated counter to chrome storage
                  chrome.storage.sync.set({ wasteTimeCounter }, function () {
                    console.log(
                      "Updated wasteTimeCounter saved:",
                      wasteTimeCounter
                    );
                  });
                }
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
                          result.dailyWasteTimeCounter || {
                            date: "",
                            count: 0,
                          };

                        const currentDate = new Date()
                          .toISOString()
                          .split("T")[0]; // Get the current date in YYYY-MM-DD format

                        // Check if the wasteTimeCounter has reached 5
                        if (wasteTimeCounter >= 5) {
                          // Check if the date has changed
                          if (dailyWasteTimeCounter.date !== currentDate) {
                            // Reset the count for the new day
                            dailyWasteTimeCounter.date = currentDate;
                            dailyWasteTimeCounter.count = 1; // Start counting for the new day
                          } else {
                            // Increment the count for the current day
                            dailyWasteTimeCounter.count++;
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
                });
              }
            }

            // Set the flag after displaying messages
            messagesDisplayed = true;
          }
        );
      }
    } else {
      console.log("Title does not exist yet.");
    }
  }

  // Set up the MutationObserver to watch for DOM changes
  const observer = new MutationObserver(() => {
    // Check if the title has loaded on the page
    const titleElement = document.querySelector(
      "yt-formatted-string.style-scope.ytd-watch-metadata"
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

// Detect when the URL changes (even without reload)
function monitorURLChange() {
  let currentURL = window.location.href;

  // Create a MutationObserver to detect changes in the document
  const observer = new MutationObserver(() => {
    chrome.storage.sync.get(["wasteTimeCounter", "blockUntil"], (result) => {
      const wasteTimeCounter = result.wasteTimeCounter || 0;
      const blockUntil = result.blockUntil || 0;
      const currentTime = Date.now(); // Use Date.now() for better performance

      // Check if the URL has changed
      if (window.location.href !== currentURL) {
        currentURL = window.location.href;

        // Block the site if wasteTimeCounter is 5 or more
        if (wasteTimeCounter >= 5) {
          chrome.runtime.sendMessage({ action: "blockSite" });
          return; // Exit early since we are blocking access
        }

        // Check for specific YouTube video URL changes
        if (currentURL.includes("youtube.com/watch?v=")) {
          console.log("Video URL changed, checking goals.");
          compareVideoWithGoals();
        }
      }

      // Additional block logic based on blockUntil
      if (wasteTimeCounter >= 5 && blockUntil > currentTime) {
        chrome.runtime.sendMessage({ action: "blockSite" });
      }
    });
  });

  // Observe changes to the <body> element to detect URL changes (or <title> tag changes)
  observer.observe(document.body, { childList: true, subtree: true });

  // Disconnect the observer when necessary (optional cleanup)
  window.addEventListener("beforeunload", () => {
    observer.disconnect();
  });
}

if (window.location.href.includes("youtube.com/watch?v=")) {
  // Call the function to start the observer
  compareVideoWithGoals();
}

// Call the function to monitor URL changes (for single-page app behavior)
monitorURLChange();
