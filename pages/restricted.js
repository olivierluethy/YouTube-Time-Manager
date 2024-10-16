// Function to update the remaining time in the <h3> element
function updateRemainingTime(minutesRemaining) {
  const remainingTimeElement = document.getElementById("remainingTime");
  const banMessageElement = document.getElementById("banMessage");

  // Convert minutes to milliseconds for accurate countdown
  let timeRemainingMs = minutesRemaining * 60000;

  // Set the initial display only if the remaining time is significant
  if (timeRemainingMs > 60000) {
    const updateDisplay = () => {
      const minutes = Math.floor(timeRemainingMs / 60000);
      const seconds = Math.floor((timeRemainingMs % 60000) / 1000);
      remainingTimeElement.textContent = `${minutes}m ${seconds}s`;
    };

    // Set the initial display
    updateDisplay();
  }

  const intervalId = setInterval(() => {
    // Decrease the remaining time
    timeRemainingMs -= 1000;

    if (timeRemainingMs <= 0) {
      // Clear the interval when the block time is over
      clearInterval(intervalId);
      remainingTimeElement.textContent = "now"; // Show "now" when the block is over
      banMessageElement.style.color = "green"; // Optional: Change message style to indicate block end
      return;
    }

    // Update the display with the new remaining time
    const updateDisplay = () => {
      const minutes = Math.floor(timeRemainingMs / 60000);
      const seconds = Math.floor((timeRemainingMs % 60000) / 1000);
      remainingTimeElement.textContent = `${minutes}m ${seconds}s`;
    };
    updateDisplay();
  }, 1000); // Update every second

  // Clear the interval when the user navigates away from the page
  window.addEventListener("unload", () => {
    clearInterval(intervalId);
  });
}

// Fetch the remainingBlockTime from Chrome storage and update the page
chrome.storage.sync.get(
  ["wasteTimeCounter", "blockUntil"],
  function (data) {
    if (blockUntil > currentTime) {
      const minutesRemaining = Math.ceil((blockUntil - currentTime) / 60000);

      updateRemainingTime(minutesRemaining);
    } else {
      // Handle the case where the block time has already expired
      remainingTimeElement.textContent = "now"; // Show "now"
      banMessageElement.style.color = "green"; // Optional: Change message style
    }
  }
);
