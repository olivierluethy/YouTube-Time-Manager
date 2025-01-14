// https://chatgpt.com/share/6786bd5d-087c-8008-be48-4893fe8212f9
function searchVideos(goals) {
  if (!goals || goals.length === 0) {
    console.log("No goals provided. Exiting the function.");
    return;
  }

  const observer = new MutationObserver((mutations) => {
    const primaryElement = document.getElementById("primary");

    if (primaryElement) {
      observer.disconnect();

      chrome.storage.sync.get(["doubleGoals", "videoData"], (res) => {
        const storedGoals = res.doubleGoals || {};
        const storedVideos = res.videoData || {};

        const goalVideos = { ...storedVideos };

        const goalTexts = goals.map((goal) => goal.text); // Extrahiere nur den Text
        const goalsToAdd = goalTexts.filter((text) => !storedGoals[text]);
        const goalsToRemove = Object.keys(storedGoals).filter(
          (storedGoal) => !goalTexts.includes(storedGoal)
        );

        if (goalsToAdd.length === 0 && goalsToRemove.length === 0) {
          console.log(
            "All goals are already stored. No API call will be made."
          );
          displayVideos(goalVideos);
          return;
        }

        if (goalsToAdd.length > 0) {
          console.log("Goals to add:", goalsToAdd);

          Promise.all(
            goalsToAdd.map((goalText) => {
              const goal = goals.find((g) => g.text === goalText);
              const prompt = goal ? goal.prompt : goalText;

              console.log("The Prompt made for the new Topic: " + prompt);

              const apiKey = "AIzaSyBYmLMpFyEjHVEvVhob4ncb9QYAse32kJo";
              const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
                prompt
              )}&type=video&key=${apiKey}`;

              return fetch(url)
                .then((response) => response.json())
                .then((data) => {
                  const shortsRegex = /#?short/i;

                  const videos = data.items
                    .map((item) => ({
                      videoId: item.id.videoId,
                      title: item.snippet.title,
                      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
                      description: item.snippet.description,
                      thumbnail: item.snippet.thumbnails.medium.url,
                    }))
                    .filter(
                      (video) =>
                        !shortsRegex.test(video.title) &&
                        !shortsRegex.test(video.description)
                    );

                  goalVideos[goalText] = videos;
                  storedGoals[goalText] = true;
                });
            })
          )
            .then(() => {
              chrome.storage.sync.set(
                { doubleGoals: storedGoals, videoData: goalVideos },
                () => {
                  console.log("Updated stored goals and videos:", goalVideos);
                  displayVideos(goalVideos);
                }
              );
            })
            .catch((error) => console.error("Error fetching videos:", error));
        }

        if (goalsToRemove.length > 0) {
          console.log("Goals to remove:", goalsToRemove);
          goalsToRemove.forEach((goalText) => {
            delete goalVideos[goalText];
            delete storedGoals[goalText];
          });

          chrome.storage.sync.set(
            { doubleGoals: storedGoals, videoData: goalVideos },
            () => {
              console.log("Updated stored goals after removal:", storedGoals);
              displayVideos(goalVideos);
            }
          );
        } else {
          displayVideos(goalVideos);
        }
      });
    }
  });

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
  buttonContainer.style.top = "50px"; // Fix: Added "px" for proper CSS
  buttonContainer.style.backgroundColor = "#0f0f0f"; // Optional: Set a background color
  buttonContainer.style.zIndex = "1000"; // Optional: Ensure it stays on top of other elements

  // Create buttons for each goal
  for (const [goalKey, videos] of Object.entries(goalVideos)) {
    const goalName =
      typeof goalKey === "object" ? goalKey.text || "Unknown Goal" : goalKey;

    const goalButton = document.createElement("button");
    goalButton.textContent = goalName;
    goalButton.title = "Click to move to the section of " + goalName;
    goalButton.style.padding = "0.8rem 1.2rem";
    goalButton.style.borderRadius = "6px";
    goalButton.style.cursor = "pointer";
    goalButton.style.backgroundColor = "rgba(255,255,255,0.2)";
    goalButton.style.color = "white";
    goalButton.style.border = "none";
    goalButton.style.transition = "background-color 0.3s";

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

    goalButton.addEventListener("mouseover", () => {
      goalButton.style.backgroundColor = "#555";
    });
    goalButton.addEventListener("mouseout", () => {
      goalButton.style.backgroundColor = "#333";
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
  for (const [goalKey, videos] of Object.entries(goalVideos)) {
    const goalName =
      typeof goalKey === "object" ? goalKey.text || "Unknown Goal" : goalKey;

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
