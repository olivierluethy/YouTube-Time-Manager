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
              const normalizedTitle = title
                .toLowerCase()
                .replace(/[.,!?]/g, ""); // Remove punctuation
              const normalizedDescription = description
                .toLowerCase()
                .replace(/[.,!?]/g, ""); // Remove punctuation

              console.log("The normalized video title: " + normalizedTitle);
              console.log(
                "Normalized video description: " + normalizedDescription
              );

              // Check if any goal matches the title or description
              const goalMatches = goals.some((goal) => {
                const words = goal
                  .toLowerCase()
                  .replace(/[.,!?]/g, "") // Entfernt Satzzeichen
                  .split(" "); // Teilt das Ziel in einzelne Wörter auf

                console.log("Checking individual words for goal:", words);

                // Überprüfe, ob mindestens ein Wort im Titel oder der Beschreibung vorkommt
                return words.some((word) => {
                  console.log("Checking word:", word);
                  return (
                    normalizedTitle.includes(word) ||
                    normalizedDescription.includes(word)
                  );
                });
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
                });
              }
            }

            // Set the flag after displaying messages
            messagesDisplayed = true;
          }
        );
      }
    } else {
      console.log("Title or description does not exist yet.");
    }
  }

  // Set up the MutationObserver to watch for DOM changes
  const observer = new MutationObserver(() => {
    console.log("Mutation detected, checking title...");
    checkTitleAndGoals();
  });

  // Start observing changes to the title element specifically
  const titleElement = document.querySelector(
    "yt-formatted-string.style-scope.ytd-watch-metadata"
  );

  if (titleElement) {
    observer.observe(titleElement, {
      childList: true, // Monitor direct children for changes
      subtree: true, // Watch all levels in the DOM tree
    });
  }

  // Fallback: Check title every second if the observer doesn't catch it
  const intervalId = setInterval(() => {
    if (
      document.querySelector(
        "yt-formatted-string.style-scope.ytd-watch-metadata"
      )
    ) {
      checkTitleAndGoals();
    }
  }, 1000);

  // Clear the interval when the observer is triggered
  observer.disconnect();
  clearInterval(intervalId);
}

// Call the function to start the observer if on a video page
if (window.location.href.includes("youtube.com/watch?v=")) {
  compareVideoWithGoals();
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
