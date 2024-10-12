/* YouTube API interaction for feed results */
function searchVideos(goals) {
    if (!goals || goals.length === 0) {
      console.log("No goals provided. Exiting the function.");
      return;
    }
  
    chrome.storage.sync.get(["doubleGoals", "videoData"], (res) => {
      const storedGoals = res.doubleGoals || [];
      const storedVideos = res.videoData || [];
  
      // TODO: Make the feed created by extension look originally like this from youtube itself
      // TODO: Make it possible to save videos recommended
      // TODO: Auf der Startliste anzeigen für welches Ziel welche Videos angezeigt werden und nicht flach alles auf einmal
      // Compare the current goals with stored goals
      if (JSON.stringify(storedGoals) === JSON.stringify(goals)) {
        console.log("Goals are the same, displaying cached videos.");
        console.log("Cached Videos:", storedVideos); // Debugging output
  
        // Dieser Teil soll nach 5 Sekunden erst geladen werden
        setTimeout(() => {
          const primaryElement = document.getElementById("primary");
  
          // Überprüfe, ob das primäre Element existiert
          if (!primaryElement) {
            console.error("Element mit ID 'primary' wurde nicht gefunden.");
            return; // Beende die Funktion, wenn das Element nicht existiert
          }
  
          primaryElement.innerHTML = ""; // Clear existing content
  
          const videoContainer = document.createElement("div");
          videoContainer.style.display = "flex";
          videoContainer.style.flexWrap = "wrap";
          videoContainer.style.gap = "16px";
          videoContainer.style.justifyContent = "flex-start";
  
          storedVideos.forEach((video) => {
            const videoElement = document.createElement("div");
            videoElement.style.flex = "1 1 300px";
            videoElement.style.maxWidth = "320px";
            videoElement.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
            videoElement.style.borderRadius = "8px";
            videoElement.style.overflow = "hidden";
            videoElement.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.3)";
  
            videoElement.innerHTML = `
          <a href="${video.url}" target="_blank">
            <img width="100%" height="180" src="${video.thumbnail}" alt="${video.title}">
          </a>
          <h3 style="color: white;margin-left:0.5rem;">${video.title}</h3>
          <p style="color: white;margin-left:0.5rem;">${video.description}</p>
        `;
  
            videoContainer.appendChild(videoElement);
          });
  
          primaryElement.appendChild(videoContainer);
        }, 200); // 5000 Millisekunden = 5 Sekunden
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
    videoContainer.style.display = "flex";
    videoContainer.style.flexWrap = "wrap";
    videoContainer.style.gap = "16px";
    videoContainer.style.justifyContent = "flex-start";
  
    videoData.forEach((video) => {
      const videoElement = document.createElement("div");
      videoElement.style.flex = "1 1 300px";
      videoElement.style.maxWidth = "320px";
      videoElement.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
      videoElement.style.borderRadius = "8px";
      videoElement.style.overflow = "hidden";
      videoElement.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.3)";
  
      videoElement.innerHTML = `
        <a href="${video.url}" target="_blank">
          <img width="100%" height="180" src="${video.thumbnail}" alt="${video.title}">
        </a>
        <h3 style="color: white;">${video.title}</h3>
        <p style="color: white;">${video.description}</p>
      `;
  
      videoContainer.appendChild(videoElement);
    });
  
    primaryElement.appendChild(videoContainer);
  }
  
  function handleAPIErrors(error) {
    if (error.code === 403 || error.status === "PERMISSION_DENIED") {
      // Handle permissions and redirect logic
    }
  }