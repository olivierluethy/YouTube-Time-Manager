var input = document.getElementById("goalInput");
var goalsList = document.getElementById("goals");
var goalsTable = document.getElementById("goalsTable");

const rangeInput = document.querySelector(".goal-range");
const valueDisplay = document.querySelector(".range-value");

rangeInput.addEventListener("input", () => {
  valueDisplay.textContent = "Current Value: " + rangeInput.value;
});

// Load saved goals when the page loads
chrome.storage.sync.get("goals", function (data) {
  if (data.goals) {
    data.goals.forEach(function (goal) {
      addGoalToList(goal.text, goal.value, goal.date); // Include date
    });
  }
});

// Function to add a goal to the list
function addGoalToList(goalText, rangeValue, date) {
  var row = document.createElement("tr");
  row.className = "goal-item";

  var goalCell = document.createElement("td");
  goalCell.textContent = goalText;

  var valueCell = document.createElement("td");
  valueCell.textContent = rangeValue;

  var dateCell = document.createElement("td"); // New cell for the date
  dateCell.textContent = date;

  var actionCell = document.createElement("td");
  var removeButton = document.createElement("button");
  removeButton.textContent = "Remove";
  removeButton.className = "remove-goal";
  removeButton.onclick = function () {
    removeGoal(goalText, row);
  };

  actionCell.appendChild(removeButton);
  row.appendChild(goalCell);
  row.appendChild(valueCell);
  row.appendChild(dateCell); // Append the date cell
  row.appendChild(actionCell);
  goalsList.appendChild(row);

  // Check if the table should be displayed
  toggleTableVisibility();
}

function formatDateForGoalWithYear() {
  const date = new Date();
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' }); // Get the full month name
  const year = date.getFullYear();

  // Add the appropriate suffix for the day
  const suffix = (day) => {
      if (day > 3 && day < 21) return 'th'; // Catch 11th-13th
      switch (day % 10) {
          case 1: return 'st';
          case 2: return 'nd';
          case 3: return 'rd';
          default: return 'th';
      }
  };

  return `${month} ${day}${suffix(day)}, ${year}`; // Return formatted date
}

// Event Listener for the input
input.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent default Enter key behavior

    // Get the entered text
    var goalText = input.value.trim();
    var rangeValue = rangeInput.value; // Get the current range value

    if (goalText) {
      // Regular expression to check for special characters
      var isValidInput = /^[a-zA-Z0-9\s]*$/.test(goalText); // Allows letters, numbers, and spaces

      if (isValidInput) {
        var currentDate = formatDateForGoalWithYear(); // Use the function for "5th January"

        addGoalToList(goalText, rangeValue, currentDate); // Pass the date

        // Clear the input field after adding
        input.value = "";

        // Save the new goal in Chrome Storage
        chrome.storage.sync.get("goals", function (data) {
          var goals = data.goals || [];
          goals.push({ text: goalText, value: rangeValue, date: currentDate }); // Add the new goal with its value and date

          // Save the updated array back to Chrome Storage
          chrome.storage.sync.set({ goals: goals }, function () {
            console.log("Goals saved:", goals);
          });
        });
      } else {
        alert("Please enter a valid goal (no special characters allowed).");
      }
    } else {
      alert("Please enter a goal.");
    }
  }
});

// Function to remove a goal
function removeGoal(goalText, row) {
  // Remove the goal from the displayed table
  goalsList.removeChild(row);

  // Remove the goal from Chrome Storage
  chrome.storage.sync.get("goals", function (data) {
    var goals = data.goals || [];
    goals = goals.filter((goal) => goal.text !== goalText); // Filter out the removed goal

    // Save the updated array back to Chrome Storage
    chrome.storage.sync.set({ goals: goals }, function () {
      console.log("Updated goals after removal:", goals);
    });
  });

  // Check if the table should be displayed
  toggleTableVisibility();
}

// Function to toggle the visibility of the table
function toggleTableVisibility() {
  if (goalsList.children.length === 0) {
    goalsTable.style.display = "none"; // Hide the table if no goals
    document.querySelector(".inputExamples").style.display = "block";
  } else {
    goalsTable.style.display = ""; // Show the table if there are goals
    document.querySelector(".inputExamples").style.display = "none";
  }
}
