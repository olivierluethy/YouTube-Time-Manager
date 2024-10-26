/* YouTube API interaction for feed results */
function searchVideos() {
  // Create a MutationObserver to watch for changes to the document
  const observer = new MutationObserver((mutations) => {
    // Check if the primary element exists on the page
    const primaryElement = document.getElementById("primary");

    if (primaryElement) {
      // Once the primary element is available, we stop observing
      observer.disconnect();

      // Define hardcoded goals with video recommendations
      const hardcodedGoals = {
        learnjava: [
          {
            title: "Learning JavaScript Basics",
            url: "https://www.youtube.com/watch?v=fSROf5ZKNz8",
            description: "An introduction to JavaScript basics and syntax.",
            thumbnail:
              "https://i.ytimg.com/an_webp/QkCa--fyGjA/mqdefault_6s.webp?du=3000&sqp=CIC38rgG&rs=AOn4CLCWYpvJ4vusJ9_BiavtpGAoq3q9Qw",
          },
          {
            title: "Learning JavaScript Basics",
            url: "https://www.youtube.com/watch?v=fSROf5ZKNz8",
            description: "An introduction to JavaScript basics and syntax.",
            thumbnail:
              "https://i.ytimg.com/an_webp/QkCa--fyGjA/mqdefault_6s.webp?du=3000&sqp=CIC38rgG&rs=AOn4CLCWYpvJ4vusJ9_BiavtpGAoq3q9Qw",
          },
          {
            title: "Learning JavaScript Basics",
            url: "https://www.youtube.com/watch?v=fSROf5ZKNz8",
            description: "An introduction to JavaScript basics and syntax.",
            thumbnail:
              "https://i.ytimg.com/an_webp/QkCa--fyGjA/mqdefault_6s.webp?du=3000&sqp=CIC38rgG&rs=AOn4CLCWYpvJ4vusJ9_BiavtpGAoq3q9Qw",
          },
          {
            title: "Learning JavaScript Basics",
            url: "https://www.youtube.com/watch?v=fSROf5ZKNz8",
            description: "An introduction to JavaScript basics and syntax.",
            thumbnail:
              "https://i.ytimg.com/an_webp/QkCa--fyGjA/mqdefault_6s.webp?du=3000&sqp=CIC38rgG&rs=AOn4CLCWYpvJ4vusJ9_BiavtpGAoq3q9Qw",
          },
          {
            title: "Learning JavaScript Basics",
            url: "https://www.youtube.com/watch?v=fSROf5ZKNz8",
            description: "An introduction to JavaScript basics and syntax.",
            thumbnail:
              "https://i.ytimg.com/an_webp/QkCa--fyGjA/mqdefault_6s.webp?du=3000&sqp=CIC38rgG&rs=AOn4CLCWYpvJ4vusJ9_BiavtpGAoq3q9Qw",
          },
        ],
        walking: [
          {
            title: "Learning JavaScript Basics",
            url: "https://www.youtube.com/watch?v=fSROf5ZKNz8",
            description: "An introduction to JavaScript basics and syntax.",
            thumbnail:
              "https://i.ytimg.com/an_webp/QkCa--fyGjA/mqdefault_6s.webp?du=3000&sqp=CIC38rgG&rs=AOn4CLCWYpvJ4vusJ9_BiavtpGAoq3q9Qw",
          },
          {
            title: "Learning JavaScript Basics",
            url: "https://www.youtube.com/watch?v=fSROf5ZKNz8",
            description: "An introduction to JavaScript basics and syntax.",
            thumbnail:
              "https://i.ytimg.com/an_webp/QkCa--fyGjA/mqdefault_6s.webp?du=3000&sqp=CIC38rgG&rs=AOn4CLCWYpvJ4vusJ9_BiavtpGAoq3q9Qw",
          },
          {
            title: "Learning JavaScript Basics",
            url: "https://www.youtube.com/watch?v=fSROf5ZKNz8",
            description: "An introduction to JavaScript basics and syntax.",
            thumbnail:
              "https://i.ytimg.com/an_webp/QkCa--fyGjA/mqdefault_6s.webp?du=3000&sqp=CIC38rgG&rs=AOn4CLCWYpvJ4vusJ9_BiavtpGAoq3q9Qw",
          },
          {
            title: "Learning JavaScript Basics",
            url: "https://www.youtube.com/watch?v=fSROf5ZKNz8",
            description: "An introduction to JavaScript basics and syntax.",
            thumbnail:
              "https://i.ytimg.com/an_webp/QkCa--fyGjA/mqdefault_6s.webp?du=3000&sqp=CIC38rgG&rs=AOn4CLCWYpvJ4vusJ9_BiavtpGAoq3q9Qw",
          },
          {
            title: "Learning JavaScript Basics",
            url: "https://www.youtube.com/watch?v=fSROf5ZKNz8",
            description: "An introduction to JavaScript basics and syntax.",
            thumbnail:
              "https://i.ytimg.com/an_webp/QkCa--fyGjA/mqdefault_6s.webp?du=3000&sqp=CIC38rgG&rs=AOn4CLCWYpvJ4vusJ9_BiavtpGAoq3q9Qw",
          },
        ],
        laughing: [
          {
            title: "Learning JavaScript Basics",
            url: "https://www.youtube.com/watch?v=fSROf5ZKNz8",
            description: "An introduction to JavaScript basics and syntax.",
            thumbnail:
              "https://i.ytimg.com/an_webp/QkCa--fyGjA/mqdefault_6s.webp?du=3000&sqp=CIC38rgG&rs=AOn4CLCWYpvJ4vusJ9_BiavtpGAoq3q9Qw",
          },
          {
            title: "Learning JavaScript Basics",
            url: "https://www.youtube.com/watch?v=fSROf5ZKNz8",
            description: "An introduction to JavaScript basics and syntax.",
            thumbnail:
              "https://i.ytimg.com/an_webp/QkCa--fyGjA/mqdefault_6s.webp?du=3000&sqp=CIC38rgG&rs=AOn4CLCWYpvJ4vusJ9_BiavtpGAoq3q9Qw",
          },
          {
            title: "Learning JavaScript Basics",
            url: "https://www.youtube.com/watch?v=fSROf5ZKNz8",
            description: "An introduction to JavaScript basics and syntax.",
            thumbnail:
              "https://i.ytimg.com/an_webp/QkCa--fyGjA/mqdefault_6s.webp?du=3000&sqp=CIC38rgG&rs=AOn4CLCWYpvJ4vusJ9_BiavtpGAoq3q9Qw",
          },
          {
            title: "Learning JavaScript Basics",
            url: "https://www.youtube.com/watch?v=fSROf5ZKNz8",
            description: "An introduction to JavaScript basics and syntax.",
            thumbnail:
              "https://i.ytimg.com/an_webp/QkCa--fyGjA/mqdefault_6s.webp?du=3000&sqp=CIC38rgG&rs=AOn4CLCWYpvJ4vusJ9_BiavtpGAoq3q9Qw",
          },
          {
            title: "Learning JavaScript Basics",
            url: "https://www.youtube.com/watch?v=fSROf5ZKNz8",
            description: "An introduction to JavaScript basics and syntax.",
            thumbnail:
              "https://i.ytimg.com/an_webp/QkCa--fyGjA/mqdefault_6s.webp?du=3000&sqp=CIC38rgG&rs=AOn4CLCWYpvJ4vusJ9_BiavtpGAoq3q9Qw",
          },
        ],
        hunting: [
          {
            title: "Learning JavaScript Basics",
            url: "https://www.youtube.com/watch?v=fSROf5ZKNz8",
            description: "An introduction to JavaScript basics and syntax.",
            thumbnail:
              "https://i.ytimg.com/an_webp/QkCa--fyGjA/mqdefault_6s.webp?du=3000&sqp=CIC38rgG&rs=AOn4CLCWYpvJ4vusJ9_BiavtpGAoq3q9Qw",
          },
          {
            title: "Learning JavaScript Basics",
            url: "https://www.youtube.com/watch?v=fSROf5ZKNz8",
            description: "An introduction to JavaScript basics and syntax.",
            thumbnail:
              "https://i.ytimg.com/an_webp/QkCa--fyGjA/mqdefault_6s.webp?du=3000&sqp=CIC38rgG&rs=AOn4CLCWYpvJ4vusJ9_BiavtpGAoq3q9Qw",
          },
          {
            title: "Learning JavaScript Basics",
            url: "https://www.youtube.com/watch?v=fSROf5ZKNz8",
            description: "An introduction to JavaScript basics and syntax.",
            thumbnail:
              "https://i.ytimg.com/an_webp/QkCa--fyGjA/mqdefault_6s.webp?du=3000&sqp=CIC38rgG&rs=AOn4CLCWYpvJ4vusJ9_BiavtpGAoq3q9Qw",
          },
          {
            title: "Learning JavaScript Basics",
            url: "https://www.youtube.com/watch?v=fSROf5ZKNz8",
            description: "An introduction to JavaScript basics and syntax.",
            thumbnail:
              "https://i.ytimg.com/an_webp/QkCa--fyGjA/mqdefault_6s.webp?du=3000&sqp=CIC38rgG&rs=AOn4CLCWYpvJ4vusJ9_BiavtpGAoq3q9Qw",
          },
          {
            title: "Learning JavaScript Basics",
            url: "https://www.youtube.com/watch?v=fSROf5ZKNz8",
            description: "An introduction to JavaScript basics and syntax.",
            thumbnail:
              "https://i.ytimg.com/an_webp/QkCa--fyGjA/mqdefault_6s.webp?du=3000&sqp=CIC38rgG&rs=AOn4CLCWYpvJ4vusJ9_BiavtpGAoq3q9Qw",
          },
        ],
        jogging: [
          {
            title: "Learning JavaScript Basics",
            url: "https://www.youtube.com/watch?v=fSROf5ZKNz8",
            description: "An introduction to JavaScript basics and syntax.",
            thumbnail:
              "https://i.ytimg.com/an_webp/QkCa--fyGjA/mqdefault_6s.webp?du=3000&sqp=CIC38rgG&rs=AOn4CLCWYpvJ4vusJ9_BiavtpGAoq3q9Qw",
          },
          {
            title: "Learning JavaScript Basics",
            url: "https://www.youtube.com/watch?v=fSROf5ZKNz8",
            description: "An introduction to JavaScript basics and syntax.",
            thumbnail:
              "https://i.ytimg.com/an_webp/QkCa--fyGjA/mqdefault_6s.webp?du=3000&sqp=CIC38rgG&rs=AOn4CLCWYpvJ4vusJ9_BiavtpGAoq3q9Qw",
          },
          {
            title: "Learning JavaScript Basics",
            url: "https://www.youtube.com/watch?v=fSROf5ZKNz8",
            description: "An introduction to JavaScript basics and syntax.",
            thumbnail:
              "https://i.ytimg.com/an_webp/QkCa--fyGjA/mqdefault_6s.webp?du=3000&sqp=CIC38rgG&rs=AOn4CLCWYpvJ4vusJ9_BiavtpGAoq3q9Qw",
          },
          {
            title: "Learning JavaScript Basics",
            url: "https://www.youtube.com/watch?v=fSROf5ZKNz8",
            description: "An introduction to JavaScript basics and syntax.",
            thumbnail:
              "https://i.ytimg.com/an_webp/QkCa--fyGjA/mqdefault_6s.webp?du=3000&sqp=CIC38rgG&rs=AOn4CLCWYpvJ4vusJ9_BiavtpGAoq3q9Qw",
          },
          {
            title: "Learning JavaScript Basics",
            url: "https://www.youtube.com/watch?v=fSROf5ZKNz8",
            description: "An introduction to JavaScript basics and syntax.",
            thumbnail:
              "https://i.ytimg.com/an_webp/QkCa--fyGjA/mqdefault_6s.webp?du=3000&sqp=CIC38rgG&rs=AOn4CLCWYpvJ4vusJ9_BiavtpGAoq3q9Qw",
          },
        ],
        speaking: [
          {
            title: "Learning JavaScript Basics",
            url: "https://www.youtube.com/watch?v=fSROf5ZKNz8",
            description: "An introduction to JavaScript basics and syntax.",
            thumbnail:
              "https://i.ytimg.com/an_webp/QkCa--fyGjA/mqdefault_6s.webp?du=3000&sqp=CIC38rgG&rs=AOn4CLCWYpvJ4vusJ9_BiavtpGAoq3q9Qw",
          },
          {
            title: "Learning JavaScript Basics",
            url: "https://www.youtube.com/watch?v=fSROf5ZKNz8",
            description: "An introduction to JavaScript basics and syntax.",
            thumbnail:
              "https://i.ytimg.com/an_webp/QkCa--fyGjA/mqdefault_6s.webp?du=3000&sqp=CIC38rgG&rs=AOn4CLCWYpvJ4vusJ9_BiavtpGAoq3q9Qw",
          },
          {
            title: "Learning JavaScript Basics",
            url: "https://www.youtube.com/watch?v=fSROf5ZKNz8",
            description: "An introduction to JavaScript basics and syntax.",
            thumbnail:
              "https://i.ytimg.com/an_webp/QkCa--fyGjA/mqdefault_6s.webp?du=3000&sqp=CIC38rgG&rs=AOn4CLCWYpvJ4vusJ9_BiavtpGAoq3q9Qw",
          },
          {
            title: "Learning JavaScript Basics",
            url: "https://www.youtube.com/watch?v=fSROf5ZKNz8",
            description: "An introduction to JavaScript basics and syntax.",
            thumbnail:
              "https://i.ytimg.com/an_webp/QkCa--fyGjA/mqdefault_6s.webp?du=3000&sqp=CIC38rgG&rs=AOn4CLCWYpvJ4vusJ9_BiavtpGAoq3q9Qw",
          },
          {
            title: "Learning JavaScript Basics",
            url: "https://www.youtube.com/watch?v=fSROf5ZKNz8",
            description: "An introduction to JavaScript basics and syntax.",
            thumbnail:
              "https://i.ytimg.com/an_webp/QkCa--fyGjA/mqdefault_6s.webp?du=3000&sqp=CIC38rgG&rs=AOn4CLCWYpvJ4vusJ9_BiavtpGAoq3q9Qw",
          },
        ],
      };

      // Store all hardcoded video data in Chrome Storage at once
      chrome.storage.sync.set({ goalVideos: hardcodedGoals }, () => {
        console.log("All hardcoded video data stored.");
      });

      // Display hardcoded videos for all goals immediately
      displayVideos(hardcodedGoals);
    }
  });

  // Start observing the entire document for added nodes to detect when 'primary' loads
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

function handleAPIErrors(error) {
  if (error.code === 403 || error.status === "PERMISSION_DENIED") {
    // Handle permissions and redirect logic
  }
}
