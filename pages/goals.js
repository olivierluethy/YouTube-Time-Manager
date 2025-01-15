var input = document.getElementById("goalInput");
var goalsList = document.getElementById("goals");
var goalsTable = document.getElementById("goalsTable");

const rangeInput = document.querySelector(".goal-range");
const valueDisplay = document.querySelector(".range-value");

rangeInput.addEventListener("input", () => {
  valueDisplay.textContent = rangeInput.value;
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
  removeButton.textContent = "X";
  removeButton.className = "remove-goal";
  removeButton.title = "Remove Goal";
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

function formatDateForGoalWithYearAndTime() {
  const date = new Date();

  // Get the date components
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" }); // Get the full month name
  const year = date.getFullYear();

  // Get the time components
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12; // Convert to 12-hour format
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  // Add the appropriate suffix for the day
  const suffix = (day) => {
    if (day > 3 && day < 21) return "th"; // Catch 11th-13th
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  // Combine date and time into a single string
  return `${month} ${day}${suffix(
    day
  )}, ${year} at ${formattedHours}:${formattedMinutes} ${ampm}`;
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
        var currentDate = formatDateForGoalWithYearAndTime(); // Use the function for "5th January"

        addGoalToList(goalText, rangeValue, currentDate); // Pass the date

        // Clear the input field after adding
        input.value = "";

        // Save the new goal in Chrome Storage
        chrome.storage.sync.get("goals", function (data) {
          var goals = data.goals || [];
          let prompt = ""; // Declare prompt outside the conditionals

          // Beginner Prompts
          if (rangeValue >= 0 && rangeValue <= 25) {
            const beginnerPrompts = [
              `${goalText} for absolute beginners`,
              `${goalText} tutorial for dummies`,
              `Easiest way to learn ${goalText}`,
              `${goalText} - The complete beginner's guide`,
              `${goalText} step-by-step guide`,
              `Best free resources to learn ${goalText}`,
              `${goalText} video tutorial for beginners`,
              `Interactive ${goalText} learning platform`,
              `Top courses to learn ${goalText}`,
              `${goalText} crash course`,
            ];
            prompt =
              beginnerPrompts[
                Math.floor(Math.random() * beginnerPrompts.length)
              ];
          }
          // Advanced Prompts
          else if (rangeValue > 25 && rangeValue <= 75) {
            const advancedPrompts = [
              `Advanced ${goalText} concepts explained`,
              `${goalText} in-depth tutorial`,
              `Mastering ${goalText}: Best practices`,
              `${goalText} advanced techniques`,
              `${goalText} real-world applications`,
              `${goalText} optimization strategies`,
              `How to solve complex problems in ${goalText}`,
              `Advanced ${goalText} course 2025`,
              `${goalText} expert guide`,
              `High-level ${goalText} use cases`,
              `Best tools for ${goalText} professionals`,
              `Deep dive into ${goalText} frameworks`,
              `Exploring the latest trends in ${goalText}`,
              `Expert-level ${goalText} tutorials`,
              `${goalText} advanced tips and tricks`,
              `Common pitfalls in ${goalText} and how to avoid them`,
              `Complete ${goalText} mastery roadmap`,
              `Cutting-edge techniques for ${goalText}`,
              `${goalText} certification preparation guide`,
              `Top books to become an expert in ${goalText}`,
              `${goalText} advanced workflows and tools`,
              `${goalText} performance tuning and scaling`,
              `Implementing ${goalText} in enterprise projects`,
              `Research papers on ${goalText} (2025)`,
            ];
            prompt =
              advancedPrompts[
                Math.floor(Math.random() * advancedPrompts.length)
              ];
          }
          // Pro Prompts
          else if (rangeValue > 75 && rangeValue <= 100) {
            const proPrompts = [
              `Pioneering innovations in ${goalText}`,
              `State-of-the-art ${goalText} methodologies`,
              `Exploring the future of ${goalText}`,
              `Theoretical foundations and breakthroughs in ${goalText}`,
              `Unsolved problems in ${goalText}`,
              `How to contribute to ${goalText} research`,
              `Top conferences and events for ${goalText} experts`,
              `Writing advanced algorithms for ${goalText}`,
              `Open-source projects to master ${goalText}`,
              `Exploring ${goalText}'s role in emerging technologies`,
              `Interdisciplinary applications of ${goalText}`,
              `Deep learning and ${goalText}: Synergies and challenges`,
              `${goalText} research papers 2025`,
              `Becoming a thought leader in ${goalText}`,
              `How ${goalText} is disrupting industries in 2025`,
              `Expert-level ${goalText} optimization techniques`,
              `Building cutting-edge solutions with ${goalText}`,
              `Joining elite forums and communities for ${goalText}`,
              `Exploring ${goalText} in highly complex systems`,
              `Contributing to ${goalText} standards and protocols`,
              `Next-gen tools and frameworks for ${goalText}`,
              `Challenging your ${goalText} knowledge with real-world scenarios`,
              `Participate in ${goalText} hackathons and competitions`,
              `Collaborating on advanced ${goalText} research projects`,
              `Transitioning from ${goalText} expert to innovator`,
              `Latest patents and innovations in ${goalText}`,
              `Exploring ethical dilemmas in advanced ${goalText} usage`,
              `Advanced integrations of ${goalText} with AI/ML`,
              `Cutting-edge ${goalText} techniques in 2025 and beyond`,
            ];
            prompt = proPrompts[Math.floor(Math.random() * proPrompts.length)];
          }

          // Add new goal data
          goals.push({
            text: goalText,
            value: rangeValue,
            date: currentDate,
            prompt: prompt,
          });

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

toggleTableVisibility();

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
// Alle Buttons mit der Klasse 'quote-button' auswählen
const buttons = document.querySelectorAll(".quote-button");

// Für jeden Button einen Click-Event-Listener hinzufügen
buttons.forEach((button) => {
  button.addEventListener("click", function () {
    // Den Text des übergeordneten <p>-Elements abrufen
    const quoteText = this.parentElement.childNodes[0].nodeValue.trim();
    // Das Eingabefeld auswählen
    const inputField = document.getElementById("goalInput");
    // Den Text in das Eingabefeld einfügen
    inputField.value = quoteText;
  });
});
