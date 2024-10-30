function searchVideos(goals) {
  if (!goals || goals.length === 0) {
    console.log("No goals provided. Exiting the function.");
    return;
  }

  // Create a MutationObserver to watch for changes to the body
  const observer = new MutationObserver((mutations) => {
    const primaryElement = document.getElementById("primary");

    if (primaryElement) {
      // Stop observing after the primary element is found
      observer.disconnect();

      // Proceed with fetching goals and videos
      chrome.storage.sync.get(["doubleGoals", "videoData"], (res) => {
        const storedGoals = res.doubleGoals || {};
        const storedVideos = res.videoData || {};

        const goalVideos = { ...storedVideos }; // Initialize goalVideos with stored data

        // Convert the goals array into an object for easier comparison
        const goalsObject = {};
        goals.forEach((goal) => (goalsObject[goal] = true));

        // Check if storedGoals have changed
        const goalsToAdd = goals.filter((goal) => !storedGoals[goal]);
        const goalsToRemove = Object.keys(storedGoals).filter(
          (storedGoal) => !goalsObject[storedGoal]
        );

        // Check if all goals are already stored
        if (goalsToAdd.length === 0 && goalsToRemove.length === 0) {
          console.log(
            "All goals are already stored. No API call will be made."
          );
          displayVideos(goalVideos);
          return; // Exit if no changes
        }

        // TODO: What happens if there are no goals? it should display define goals and handle also api errors
        // Handle added goals by fetching video data
        if (goalsToAdd.length > 0) {
          console.log("Goals to add:", goalsToAdd);

          // Fetch videos for each new goal and add to goalVideos
          Promise.all(
            goalsToAdd.map((goal) => {
              const apiKey = "AIzaSyBYmLMpFyEjHVEvVhob4ncb9QYAse32kJo";
              const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
                goal
              )}&type=video&key=${apiKey}`;

              return fetch(url)
                .then((response) => response.json())
                .then((data) => {
                  const shortsRegex = /#?short/i; // Regular expression to match "short", "shorts", "#short", "#shorts" etc.

                  const videos = data.items
                    .map((item) => ({
                      videoId: item.id.videoId,
                      title: item.snippet.title,
                      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
                      description: item.snippet.description,
                      thumbnail: item.snippet.thumbnails.medium.url,
                    }))
                    .filter((video) => {
                      // Check if title or description contains the regex pattern
                      return (
                        !shortsRegex.test(video.title) &&
                        !shortsRegex.test(video.description)
                      );
                    });

                  goalVideos[goal] = videos; // Store videos for the goal
                  storedGoals[goal] = true; // Mark goal as stored
                });
            })
          )
            .then(() => {
              // Save updated videos and goals to storage
              chrome.storage.sync.set(
                { doubleGoals: storedGoals, videoData: goalVideos },
                () => {
                  console.log(
                    "Updated stored goals and videos:",
                    storedGoals,
                    goalVideos
                  );
                  displayVideos(goalVideos);
                }
              );
            })
            .catch((error) => {
              console.error("Error fetching videos:", error);
            });
        }

        // Handle removed goals by deleting from goal Videos
        if (goalsToRemove.length > 0) {
          console.log("Goals to remove:", goalsToRemove);
          goalsToRemove.forEach((goal) => {
            delete goalVideos[goal];
            delete storedGoals[goal]; // Also remove from storedGoals
          });

          // Update the storage with the new goals
          chrome.storage.sync.set(
            { doubleGoals: storedGoals, videoData: goalVideos },
            () => {
              console.log("Updated stored goals after removal:", storedGoals);
              displayVideos(goalVideos);
            }
          );
        } else {
          // If no goals are removed, just display the videos
          displayVideos(goalVideos);
        }
      });
    }
  });

  // Start observing the entire document for added nodes
  observer.observe(document.body, { childList: true, subtree: true });
}

// Function to display videos grouped by goal
function displayVideos(goalVideos) {
  const primaryElement = document.getElementById("primary");
  primaryElement.innerHTML = ""; // Clear existing content

  // Add button container at the top
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "goal-buttons";
  buttonContainer.style.display = "flex";
  buttonContainer.style.gap = "8px";
  buttonContainer.style.marginBottom = "1rem";
  buttonContainer.style.padding = "1rem";
  buttonContainer.style.position = "fixed";
  buttonContainer.style.width = "100%";
  buttonContainer.style.top = "50"; // This keeps it at the top of the viewport
  buttonContainer.style.backgroundColor = "#0f0f0f"; // Optional: Set a background color
  buttonContainer.style.zIndex = "1000"; // Optional: Ensure it stays on top of other elements

  // Create buttons for each goal
  for (const goalName of Object.keys(goalVideos)) {
    const goalButton = document.createElement("button");
    goalButton.textContent = goalName;
    goalButton.title = "Click to move to the section of " + goalName;
    goalButton.style.padding = "0.8rem 1.2rem";
    goalButton.style.borderRadius = "6px";
    goalButton.style.cursor = "pointer";
    goalButton.style.backgroundColor = "rgba(255,255,255,0.2";
    goalButton.style.color = "white";
    goalButton.style.border = "none";
    goalButton.style.transition = "background-color 0.3s";

    goalButton.addEventListener("click", () => {
      document
        .getElementById(`goal-${goalName}`)
        .scrollIntoView({ behavior: "smooth" });
    });

    goalButton.addEventListener("mouseover", () => {
      goalButton.style.backgroundColor = "#555";
    });
    goalButton.addEventListener("mouseout", () => {
      goalButton.style.backgroundColor = "#333";
    });

    // Add click event to scroll to the goal section
    goalButton.addEventListener("click", () => {
      const goalElement = document.getElementById(`goal-${goalName}`);
      const offset = 110; // Adjust this value as needed

      // Calculate the target scroll position
      const elementPosition =
        goalElement.getBoundingClientRect().top + window.scrollY;
      const targetPosition = elementPosition - offset;

      // Scroll to the target position smoothly
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    });

    buttonContainer.appendChild(goalButton);
  }

  primaryElement.appendChild(buttonContainer);

  // Display the videos grouped by goal
  if (Object.keys(goalVideos).length === 0) {
    primaryElement.innerHTML += "<p>No video recommendations found.</p>";
    return;
  }

  let isFirstGoal = true;
  for (const [goalName, videos] of Object.entries(goalVideos)) {
    // Create a section for each goal
    const goalSection = document.createElement("div");
    goalSection.id = `goal-${goalName}`;
    goalSection.style.marginBottom = "2rem";

    // Add goal name as a title
    const goalTitle = document.createElement("h2");
    goalTitle.textContent = goalName;
    goalTitle.style.color = "white";

    // Apply margin-top of 6rem only for the first goal
    if (isFirstGoal) {
      goalTitle.style.marginTop = "6rem";
      isFirstGoal = false; // Set to false after the first goal
    } else {
      goalTitle.style.marginTop = "2rem";
    }
    goalTitle.style.marginLeft = "1rem";
    goalTitle.style.marginBottom = "1rem";
    goalSection.appendChild(goalTitle);

    // Container for videos under the goal
    const videoContainer = document.createElement("div");
    videoContainer.style.display = "flex";
    videoContainer.style.flexWrap = "wrap";
    videoContainer.style.gap = "16px";
    videoContainer.style.justifyContent = "flex-start";
    videoContainer.style.marginLeft = "1rem";

    videos.forEach((video) => {
      // Individual video card
      const videoElement = document.createElement("div");
      videoElement.style.flex = "1 1 300px";
      videoElement.style.maxWidth = "315px";
      videoElement.style.borderRadius = "8px";
      videoElement.style.overflow = "hidden";
      videoElement.style.backgroundColor = "black";
      videoElement.style.boxShadow =
        "0px 0px 10px 0px rgba(255, 255, 255, 0.8)";
      videoElement.style.transition = "background-color 0.5s ease-in-out";

      videoElement.innerHTML = `
        <a title='${video.description}' style='text-decoration:none;' href="${video.url}" target="_blank">
          <img width="100%" height="180" src="${video.thumbnail}" alt="${video.title}" style="display: block; border-radius: 8px 8px 0 0;">
          <h3 style="color: white; margin: 0.5rem 0.5rem 0 0.5rem;">${video.title}</h3>
          <p style="color: white; margin: 0.5rem;">${video.description}</p>
        </a>
      `;

      const anchorElement = videoElement.querySelector("a");
      anchorElement.style.color = "white";
      anchorElement.addEventListener("mouseover", () => {
        videoElement.style.backgroundColor = "#484848";
      });
      anchorElement.addEventListener("mouseout", () => {
        videoElement.style.backgroundColor = "black";
      });

      videoContainer.appendChild(videoElement);
    });

    goalSection.appendChild(videoContainer);
    primaryElement.appendChild(goalSection);
  }
}