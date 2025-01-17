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

  var editButton = document.createElement("button");
  editButton.textContent = "Edit"; // Set the button text
  editButton.className = "edit-goal"; // Set the class name
  editButton.title = "Edit Goal"; // Set the title
  editButton.onclick = function () {
    editGoal(row);
  };

  actionCell.appendChild(editButton);
  actionCell.appendChild(removeButton);
  row.appendChild(goalCell);
  row.appendChild(valueCell);
  row.appendChild(dateCell); // Append the date cell
  row.appendChild(actionCell);
  goalsList.appendChild(row);

  // Check if the table should be displayed
  toggleTableVisibility();
}

// Um für jedes Ziel eine Identifikation anhand von einer ID hinzufügt. Diese ID wird nur für die Erstellung eines Zieles genutzt und das nur einmal pro Ziel.
async function generateUniqueID(goal) {
  const stringToHash = `${goal.text}-${goal.value}-${goal.prompt || ""}`;
  const salt = Math.random().toString(36).substring(2, 15);
  const combinedString = stringToHash + salt;

  // Konvertiere den String in ein ArrayBuffer
  const encoder = new TextEncoder();
  const data = encoder.encode(combinedString);

  // Erzeuge den Hash
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  // Konvertiere den Hash in einen Hex-String
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 5);

  return `${timestamp}-${randomString}-${hash.substring(0, 16)}`;
}

function editGoal(row) {
  // Get the modal
  var modal = document.getElementById("myModal");

  // Get the input fields
  var goalInput = document.getElementById("goalTextEdit");
  var valueInput = document.getElementById("rangeValueEdit");
  var rangeValueDisplay = document.querySelector(".range-valueEdit");

  // Extract current goal values from the row
  var originalText = row.cells[0].textContent;
  var originalValue = parseInt(row.cells[1].textContent, 10);

  // Set the current values in the input fields
  goalInput.value = originalText; // Set goal text
  valueInput.value = originalValue; // Set range value
  rangeValueDisplay.textContent = originalValue; // Display range value

  // Open the modal
  modal.style.display = "block";

  // Update the displayed value when the slider is moved
  valueInput.oninput = function () {
    rangeValueDisplay.textContent = this.value;
  };

  // Close button functionality
  var closeButtons = document.querySelectorAll(".close");
  closeButtons.forEach(function (button) {
    button.onclick = function () {
      modal.style.display = "none";
    };
  });

  // Cancel modal functionality
  var closeBtn = document.querySelector(".closeBtn");
  closeBtn.onclick = function () {
    modal.style.display = "none";
  };

  // Close the modal when clicking outside
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  // Save changes button functionality
  document.getElementById("saveChanges").onclick = function () {
    var updatedText = goalInput.value.trim();
    var updatedValue = parseInt(valueInput.value, 10);

    // Überprüfe, ob sich der Name oder Wert geändert hat
    if (updatedText === originalText && updatedValue === originalValue) {
      modal.style.display = "none";
      return;
    }

    const newPrompt = generatePrompt(updatedText, updatedValue);

    chrome.storage.sync.get("goals", function (data) {
      var goals = data.goals || [];

      const goalIndex = goals.findIndex((goal) => goal.text === originalText);

      if (goalIndex !== -1) {
        // Wenn sich der Name geändert hat, entferne den alten Eintrag aus `storedGoals`
        if (updatedText !== originalText) {
          chrome.storage.sync.get("doubleGoals", (res) => {
            let storedGoals = res.doubleGoals || {};
            delete storedGoals[originalText];
            chrome.storage.sync.set({ doubleGoals: storedGoals });
          });
        }

        // Aktualisiere das Ziel
        goals[goalIndex].text = updatedText;
        goals[goalIndex].value = updatedValue;
        goals[goalIndex].prompt = newPrompt;
      }

      chrome.storage.sync.set({ goals: goals }, function () {
        console.log("Updated goals:", goals);
      });
    });

    row.cells[0].textContent = updatedText;
    row.cells[1].textContent = updatedValue;

    modal.style.display = "none";
  };
}

function generatePrompt(goalText, rangeValue) {
  let prompt = ""; // Prompt wird initialisiert

  if (rangeValue >= 0 && rangeValue <= 25) {
    // Beginner-Prompts
    const beginnerPrompts = [
      `${goalText} for absolute beginners`,
      `${goalText} tutorial for dummies`,
      `Easiest way to learn ${goalText}`,
      `${goalText} - The complete beginner's guide`,
      `${goalText} step-by-step guide`,
    ];
    prompt =
      beginnerPrompts[Math.floor(Math.random() * beginnerPrompts.length)];
  } else if (rangeValue > 25 && rangeValue <= 75) {
    // Advanced-Prompts
    const advancedPrompts = [
      `Advanced ${goalText} concepts explained`,
      `${goalText} in-depth tutorial`,
      `Mastering ${goalText}: Best practices`,
      `${goalText} advanced techniques`,
      `${goalText} real-world applications`,
    ];
    prompt =
      advancedPrompts[Math.floor(Math.random() * advancedPrompts.length)];
  } else if (rangeValue > 75 && rangeValue <= 100) {
    // Pro-Prompts
    const proPrompts = [
      `Pioneering innovations in ${goalText}`,
      `State-of-the-art ${goalText} methodologies`,
      `Exploring the future of ${goalText}`,
      `Theoretical foundations and breakthroughs in ${goalText}`,
      `Unsolved problems in ${goalText}`,
    ];
    prompt = proPrompts[Math.floor(Math.random() * proPrompts.length)];
  }

  return prompt; // Gib den generierten Prompt zurück
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

input.onkeyup = function () {
  const goalInput = document.getElementById("goalInput");
  const subGoalButton = document.getElementById("subGoal");

  if (goalInput.value.trim() === "") {
    subGoalButton.style.display = "none";
  } else {
    subGoalButton.style.display = "inline-block";
  }
};

document.getElementById("subGoal").addEventListener("click", function () {
  // Get the entered text
  var goalText = input.value.trim();
  var rangeValue = rangeInput.value; // Get the current range value

  getEnteredInputInformation(goalText, rangeValue);
});

async function getEnteredInputInformation(goalText, rangeValue) {
  // Regular expression to check for special characters
  var isValidInput = /^[a-zA-Z0-9\s#\-_äöüÄÖÜ]*$/.test(goalText);

  if (isValidInput) {
    var currentDate = formatDateForGoalWithYearAndTime(); // Use the function for "5th January"

    // Clear the input field after adding
    input.value = "";

    // Save the new goal in Chrome Storage
    chrome.storage.sync.get("goals", async function (data) {
      var goals = data.goals || [];

      let prompt = generatePrompt(goalText, rangeValue);

      // Generate the unique ID for the goal
      let hash = await generateUniqueID({
        text: goalText,
        value: rangeValue,
        prompt: prompt,
      });

      // Add new goal data with the unique ID
      goals.push({
        id: hash, // Add the unique ID here
        text: goalText,
        value: rangeValue,
        date: currentDate,
        prompt: prompt,
      });

      addGoalToList(goalText, rangeValue, currentDate);

      // Save the updated array back to Chrome Storage
      chrome.storage.sync.set({ goals: goals }, function () {
        console.log("Goals saved:", goals);
      });
    });
  } else {
    alert("Please enter a valid goal (no special characters allowed).");
  }
}

// Event Listener for the input
input.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent default Enter key behavior

    // Get the entered text
    var goalText = input.value.trim();
    var rangeValue = rangeInput.value; // Get the current range value

    if (goalText) {
      getEnteredInputInformation(goalText, rangeValue);
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
