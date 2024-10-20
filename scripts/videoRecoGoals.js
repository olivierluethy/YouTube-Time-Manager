/* YouTube API interaction for feed results */
function searchVideos(goals) {
  if (!goals || goals.length === 0) {
    console.log("No goals provided. Exiting the function.");
    return;
  }

  chrome.storage.sync.get(["doubleGoals", "videoData"], (res) => {
    const storedGoals = res.doubleGoals || [];
    const storedVideos = res.videoData || [];

    // Compare the current goals with stored goals
    if (JSON.stringify(storedGoals) === JSON.stringify(goals)) {
      console.log("Goals are the same, displaying cached videos.");
      console.log("Cached Videos:", storedVideos); // Debugging output

      // Create a MutationObserver to watch for changes to the body
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.addedNodes.length) {
            const primaryElement = document.getElementById("primary");
            if (primaryElement) {
              // Clear existing content
              primaryElement.innerHTML = "";

              const videoContainer = document.createElement("div");
              videoContainer.style.marginTop = "1rem";
              videoContainer.style.marginLeft = "1rem";
              videoContainer.style.display = "flex";
              videoContainer.style.flexWrap = "wrap";
              videoContainer.style.gap = "16px";
              videoContainer.style.justifyContent = "flex-start";

              storedVideos.forEach((video) => {
                const videoElement = document.createElement("div");
                videoElement.style.flex = "1 1 300px";
                videoElement.style.maxWidth = "315px";
                videoElement.style.borderRadius = "8px";
                videoElement.style.overflow = "hidden";
                videoElement.style.boxShadow =
                  "0px 0px 10px 0px rgba(255, 255, 255, 0.8)";

                // Add hover effect styles
                videoElement.style.transition =
                  "background-color 0.5s ease-in-out"; // Transition for smoother effect

                videoElement.innerHTML = `
                  <a title='${video.description}' style='text-decoration:none;' href="${video.url}" target="_blank">
                    <img width="100%" height="180" src="${video.thumbnail}" alt="${video.title}">
                    <h3 style="color: white;margin-left:0.5rem;">${video.title}</h3>
                    <p style="color: white;margin-left:0.5rem;">${video.description}</p>
                  </a>
                `;

                // Add event listeners to the anchor element (a)
                const anchorElement = videoElement.querySelector("a");
                anchorElement.style.color = "black"; // Set default text color for the anchor

                anchorElement.addEventListener("mouseover", () => {
                  videoElement.style.backgroundColor = "#484848";
                });
                anchorElement.addEventListener("mouseout", () => {
                  videoElement.style.backgroundColor = "black";
                });

                videoContainer.appendChild(videoElement);
              });

              primaryElement.appendChild(videoContainer);

              // Stop observing after the primary element is found and updated
              observer.disconnect();
            }
          }
        });
      });

      // Start observing the body for changes
      observer.observe(document.body, { childList: true, subtree: true });
    } else {
      const apiKey = "AIzaSyBYmLMpFyEjHVEvVhob4ncb9QYAse32kJo";
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        goals.join(" ")
      )}&type=video&key=${apiKey}`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            console.error("API Error:", data.error);
            handleAPIErrors(data.error);
            return;
          }

          const videos = data.items
            ? data.items.filter((video) => {
                const titleLower = video.snippet.title.toLowerCase();
                const descriptionLower =
                  video.snippet.description?.toLowerCase(); // Optional chaining for description
                return !(
                  titleLower.includes("shorts") ||
                  (descriptionLower && descriptionLower.includes("shorts"))
                );
              })
            : [];

          console.log("Video Recommendations:", videos);

          if (videos.length === 0) {
            document.getElementById("primary").innerHTML =
              "<p>No video recommendations found.</p>";
            return;
          }

          const videoData = videos.map((video) => ({
            title: video.snippet.title,
            url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
            description: video.snippet.description,
            thumbnail: video.snippet.thumbnails.default.url,
          }));

          // Store the new goals and videos in Chrome Storage
          chrome.storage.sync.set(
            { doubleGoals: goals, videoData: videoData },
            () => {
              console.log("Goals and video data stored:", goals, videoData);
            }
          );

          displayVideos(videoData);
        })
        .catch((error) => {
          console.error("Error fetching video recommendations:", error);
          // Redirect or handle error
        });
    }
  });
}

function displayVideos(videoData) {
  console.log("The Videos are here! " + videoData);

  const primaryElement = document.getElementById("primary");
  primaryElement.innerHTML = ""; // Clear existing content

  if (videoData.length === 0) {
    primaryElement.innerHTML = "<p>No video recommendations found.</p>";
    return; // Early exit if no videos
  }

  const videoContainer = document.createElement("div");
  videoContainer.style.marginTop = "1rem";
  videoContainer.style.marginLeft = "1rem";
  videoContainer.style.display = "flex";
  videoContainer.style.flexWrap = "wrap";
  videoContainer.style.gap = "16px";
  videoContainer.style.justifyContent = "flex-start";

  storedVideos.forEach((video) => {
    const videoElement = document.createElement("div");
    videoElement.style.flex = "1 1 300px";
    videoElement.style.maxWidth = "315px";
    videoElement.style.borderRadius = "8px";
    videoElement.style.overflow = "hidden";
    videoElement.style.boxShadow = "0px 0px 10px 0px rgba(255, 255, 255, 0.8)";

    // Add hover effect styles
    videoElement.style.transition = "background-color 0.5s ease-in-out"; // Transition for smoother effect

    videoElement.innerHTML = `
            <a title='${video.description}' style='text-decoration:none;' href="${video.url}" target="_blank">
              <img width="100%" height="180" src="${video.thumbnail}" alt="${video.title}">
              <h3 style="color: white;margin-left:0.5rem;">${video.title}</h3>
              <p style="color: white;margin-left:0.5rem;">${video.description}</p>
            </a>
          `;

    // Add event listeners to the anchor element (a)
    const anchorElement = videoElement.querySelector("a");

    anchorElement.style.color = "black"; // Set default text color for the anchor

    anchorElement.addEventListener("mouseover", () => {
      videoElement.style.backgroundColor = "#484848";
    });
    anchorElement.addEventListener("mouseout", () => {
      videoElement.style.backgroundColor = "black";
    });

    videoContainer.appendChild(videoElement);
  });

  primaryElement.appendChild(videoContainer);
}

function handleAPIErrors(error) {
  if (error.code === 403 || error.status === "PERMISSION_DENIED") {
    // Handle permissions and redirect logic
  }
}
