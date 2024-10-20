function updateRemainingTime() {
  const remainingTimeElement = document.getElementById("remainingTime");
  const banMessageElement = document.getElementById("banMessage");

  let intervalId = null; // Variable to store the interval ID

  const updateTimer = () => {
    chrome.storage.sync.get(["blockUntil"], (result) => {
      const blockUntil = result.blockUntil || 0;
      const currentTime = new Date().getTime();

      // Check if the user is currently blocked
      if (blockUntil > currentTime) {
        const totalMillisecondsRemaining = blockUntil - currentTime;
        const minutesRemaining = Math.floor(totalMillisecondsRemaining / 60000);
        const secondsRemaining = Math.floor(
          (totalMillisecondsRemaining % 60000) / 1000
        );

        // Format seconds to always show two digits
        const formattedSeconds =
          secondsRemaining < 10 ? "0" + secondsRemaining : secondsRemaining;

        // Update the UI with the remaining time without leading zeros for minutes
        if (remainingTimeElement) {
          remainingTimeElement.textContent = `${minutesRemaining}m ${formattedSeconds}s`;
        }
      } else {
        clearInterval(intervalId); // Stop the interval if no block time is set or expired
        console.log("No block time set or block time has expired.");
        remainingTimeElement.innerHTML = "No block time set.";
        // Update the UI to reflect no block (optional)
        if (banMessageElement) {
          banMessageElement.textContent = "";
        }
        window.location.href = "https://www.youtube.com/";
      }
    });
  };

  // Start the update timer initially and set an interval of 1 second
  updateTimer();
  intervalId = setInterval(updateTimer, 1000);
}

// Call the function to start the timer
updateRemainingTime();
