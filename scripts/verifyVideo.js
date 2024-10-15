// Check if the title matches any goals
let messagesDisplayed = false;

function compareVideoWithGoals() {
  // Function to compare the video title with the user's goals
  function checkTitleAndGoals() {
    const titleElement = document.querySelector(
      "yt-formatted-string.style-scope.ytd-watch-metadata"
    );
    if (titleElement) {
      const title = titleElement.innerHTML;

      if (title && !messagesDisplayed) {
        chrome.storage.sync.get(["goals", "wasteTimeCounter"], function (data) {
          const goals = data.goals || [];
          let wasteTimeCounter = data.wasteTimeCounter || 0;

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
          } else {
            console.log("The video does not match any goals.");

            // Increment the wasteTimeCounter if the video doesn't match the goals
            wasteTimeCounter++;
            console.log(`WasteTimeCounter: ${wasteTimeCounter}`);

            // Save the updated counter to chrome storage
            chrome.storage.sync.set({ wasteTimeCounter }, function () {
              console.log("Updated wasteTimeCounter saved:", wasteTimeCounter);

              // Check if the counter exceeds the limit (e.g., 10)
              if (wasteTimeCounter >= 10) {
                alert(
                  "You have watched too many videos that don't match your goals. Time to focus!"
                );
              }
            });
          }

          // Set the flag after displaying messages
          messagesDisplayed = true;
        });
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
