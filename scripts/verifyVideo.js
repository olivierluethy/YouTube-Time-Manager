// Check if the title matches any goals
let messagesDisplayed = false;
const BLOCK_DURATION_MINUTES = 10;

function compareVideoWithGoals() {
  // Function to compare the video title with the user's goals
  function checkTitleAndGoals() {
    const titleElement = document.querySelector(
      "yt-formatted-string.style-scope.ytd-watch-metadata"
    );
    if (titleElement) {
      const title = titleElement.innerHTML;

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
                }
              );
            }

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

            // Normalize the title for comparison (case insensitive)
            const normalizedTitle = title.toLowerCase();

            // Split the title into individual words (this helps with exact word matching)
            const titleWords = normalizedTitle.split(/\s+/);

            // Check if any goal word matches a word in the title
            const goalMatches = goals.some((goal) => {
              const normalizedGoal = goal.toLowerCase();
              return titleWords.includes(normalizedGoal);
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
                  "Updated wasteTimeCounter saved: ",
                  wasteTimeCounter
                );

                // Check if the counter exceeds the limit (e.g., 10)
                if (wasteTimeCounter >= 10) {
                  const blockUntilTime =
                    new Date().getTime() + BLOCK_DURATION_MINUTES * 60000;

                  // Überprüfe, ob der Alert bereits gezeigt wurde
                  chrome.storage.sync.get(["alertShown"], function (result) {
                    const alertShown = result.alertShown || false; // Fallback falls der Wert noch nicht existiert

                    if (!alertShown) {
                      // Zeige den Alert nur, wenn er noch nicht gezeigt wurde
                      chrome.storage.sync.set(
                        { alertShown: true, blockUntil: blockUntilTime },
                        function () {
                          alert(
                            `You have watched too many videos that don't match your goals. You are blocked for ${BLOCK_DURATION_MINUTES} minutes.`
                          );
                          chrome.runtime.sendMessage({ action: "blockSite" });
                        }
                      );
                    } else {
                      // Blockiere die Seite direkt, wenn der Alert bereits gezeigt wurde
                      chrome.storage.sync.set(
                        { blockUntil: blockUntilTime },
                        function () {
                          chrome.runtime.sendMessage({ action: "blockSite" });
                        }
                      );
                    }
                  });
                }
              });
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

// Call the function to start the observer
compareVideoWithGoals();
