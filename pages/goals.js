var input = document.getElementById("goalInput");
var goalsList = document.getElementById("goals");
var goalsTable = document.getElementById("goalsTable");
const searchInput = document.getElementById("searchGoals");

// Modal selectors
const close = document.querySelector(".close");
const dialog = document.getElementById("myModal");
const closeBtn = document.querySelector(".closeBtn");

const rangeInput = document.querySelector(".goal-range");
const valueDisplay = document.querySelector(".range-value");

updateSearchVisibility();
toggleTableVisibility();

rangeInput.addEventListener("input", () => {
  valueDisplay.textContent = rangeInput.value;
});

// https://chatgpt.com/c/678c16b6-fa5c-8008-8c15-a1896c50767e
// Funktion, um die Inhalte dynamisch zu erstellen
function createStockTickerContent() {
  const stockTicker = document.querySelector(".stock-ticker");
  if (!stockTicker) {
    console.error('Element mit der Klasse "stock-ticker" nicht gefunden.');
    return;
  }

  // Liste der Inhalte
  const quotes = [
    "C#",
    "Dancing",
    "Video Editing",
    "Fusion 360",
    "Cooking",
    "Drone Building",
    "Climbing",
    "Photoshop",
    "Photography",
    "Baking",
    "Painting",
    "Drawing",
    "Guitar",
    "Woodworking",
    "Gardening",
    "Writing",
    "Reading",
    "Chess",
    "Algebra",
  ];

  // Beide Listen erzeugen
  for (let i = 0; i < 2; i++) {
    const ul = document.createElement("ul");
    if (i === 1) {
      ul.setAttribute("aria-hidden", "true");
      ul.style.marginLeft = "-2.5rem";
    }

    // Paragraphen mit Buttons hinzufügen
    quotes.forEach((quote) => {
      const p = document.createElement("p");
      p.className = "quote";

      const textNode = document.createTextNode(quote);
      p.appendChild(textNode);

      const button = document.createElement("button");
      button.className = "quote-button";
      button.title = `Use ${quote}`;
      button.textContent = "Use";
      p.appendChild(button);

      ul.appendChild(p);
    });

    stockTicker.appendChild(ul);
  }
}

// Funktion aufrufen
createStockTickerContent();

// Funktion, um die Inhalte für die Klasse stock-flicker dynamisch zu erstellen
function createStockFlickerContent() {
  const stockFlicker = document.querySelector(".stock-flicker");
  if (!stockFlicker) {
    console.error('Element mit der Klasse "stock-flicker" nicht gefunden.');
    return;
  }

  // Liste der Inhalte
  const quotes = [
    "Yoga",
    "3D Printing",
    "Calligraphy",
    "Sculpting",
    "Singing",
    "Piano",
    "Traveling",
    "Fishing",
    "Swimming",
    "Puzzles",
    "Bird Watching",
    "DIY Projects",
    "Martial Arts",
    "German",
    "Origami",
    "Astronomy",
    "Cake Decorating",
  ];

  // Beide Listen erzeugen
  for (let i = 0; i < 2; i++) {
    const ul = document.createElement("ul");
    if (i === 1) {
      ul.setAttribute("aria-hidden", "true");
      ul.style.marginLeft = "-2.5rem";
    }

    // Paragraphen mit Buttons hinzufügen
    quotes.forEach((quote) => {
      const p = document.createElement("p");
      p.className = "quote";

      const textNode = document.createTextNode(quote);
      p.appendChild(textNode);

      const button = document.createElement("button");
      button.className = "quote-button";
      button.title = `Use ${quote}`;
      button.textContent = "Use";
      p.appendChild(button);

      ul.appendChild(p);
    });

    stockFlicker.appendChild(ul);
  }
}

// Funktion aufrufen
createStockFlickerContent();

// Load saved goals when the page loads
chrome.storage.sync.get("goals", function (data) {
  if (data.goals) {
    data.goals.forEach(function (goal) {
      addGoalToList(goal.text, goal.value, goal.date); // Include date
    });
  }
});
// https://chatgpt.com/c/678c0b51-ce00-8008-96f8-7e69fb1a2983
function levenshteinDistance(a, b) {
  const matrix = [];

  // Initialisiere die Matrix
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fülle die Matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

function filterGoals() {
  const filter = searchInput.value.toLowerCase().trim(); // Leerzeichen entfernen
  const rows = Array.from(goalsList.getElementsByTagName("tr"));

  if (!filter) {
    // Keine Eingabe: Originalreihenfolge beibehalten
    rows.forEach((row) => (row.style.display = ""));
    return;
  }

  // Ziele mit Distanz berechnen
  const scoredRows = rows.map((row) => {
    const goalCell = row.getElementsByTagName("td")[0];
    if (!goalCell) return { row, distance: Infinity };

    const goalText = goalCell.textContent.toLowerCase();
    const distance = levenshteinDistance(goalText, filter);
    return { row, distance };
  });

  // Sortieren nach Distanz
  scoredRows.sort((a, b) => a.distance - b.distance);

  // Neu sortierte Reihenfolge anwenden
  scoredRows.forEach(({ row }) => {
    goalsList.appendChild(row);
    row.style.display = ""; // Alle anzeigen
  });
}

// Beispiel für das Hinzufügen von Zielen
function addGoalToList(goalText, rangeValue, date) {
  var row = document.createElement("tr");
  row.className = "goal-item";

  var goalCell = document.createElement("td");
  goalCell.textContent = goalText;

  var valueCell = document.createElement("td");
  valueCell.textContent = rangeValue;

  var dateCell = document.createElement("td");
  dateCell.textContent = date;

  var actionCell = document.createElement("td");

  var removeButton = document.createElement("button");
  removeButton.textContent = "X";
  removeButton.className = "remove-goal";
  removeButton.title = "Remove Goal";
  removeButton.onclick = function () {
    removeGoal(row);
  };

  var editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.className = "edit-goal";
  editButton.title = "Edit Goal";
  editButton.onclick = function () {
    editGoal(row);
  };

  actionCell.appendChild(editButton);
  actionCell.appendChild(removeButton);
  row.appendChild(goalCell);
  row.appendChild(valueCell);
  row.appendChild(dateCell);
  row.appendChild(actionCell);
  goalsList.appendChild(row);

  // Überprüfen, ob die Tabelle angezeigt werden soll
  toggleTableVisibility();
}
searchInput.addEventListener("input", filterGoals);

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

closeBtn.addEventListener("click", () => {
  dialog.classList.add("closing"); // Schließ-Animation starten
  dialog.addEventListener(
    "animationend",
    () => {
      dialog.classList.remove("closing"); // Animation zurücksetzen
      dialog.close(); // Dialog endgültig schließen
    },
    { once: true } // Event-Listener nach einmaliger Ausführung entfernen
  );
});

close.addEventListener("click", () => {
  dialog.classList.add("closing"); // Schließ-Animation starten
  dialog.addEventListener(
    "animationend",
    () => {
      dialog.classList.remove("closing"); // Animation zurücksetzen
      dialog.close(); // Dialog endgültig schließen
    },
    { once: true } // Event-Listener nach einmaliger Ausführung entfernen
  );
});

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
      `${goalText} advanced concepts`,
      `How to master ${goalText}`,
      `${goalText} in-depth tutorial`,
      `${goalText} advanced techniques`,
    ];
    prompt =
      advancedPrompts[Math.floor(Math.random() * advancedPrompts.length)];
  } else if (rangeValue > 75 && rangeValue <= 100) {
    // Pro-Prompts
    const proPrompts = [
      `${goalText} for professionals`,
      `${goalText} like a pro`,
      `${goalText} challenges`,
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

/* https://www.blackbox.ai/share/752a1e5a-a065-4258-bc04-ba89b1eb6ef5 */
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
        updateSearchVisibility(); // Sichtbarkeit des Suchfelds aktualisieren
      });
    });
  } else {
    alert("Please enter a valid goal (no special characters allowed).");
  }
}

function updateSearchVisibility() {
  // Überprüfe die Anzahl der Ziele im Chrome Storage
  chrome.storage.sync.get("goals", function (data) {
    var goals = data.goals || [];
    if (goals.length == 0) {
      document.querySelector(".enter").style.marginTop = "-1rem";
    }
    if (goals.length >= 1 && goals.length < 4) {
      document.querySelector(".enter").style.marginTop = "1rem";
    }
    // Suchfeld wird angezeigt
    if (goals.length >= 4) {
      searchInput.style.display = "block";
      document.querySelector(".table-container").style.marginTop = "2rem";
    }
    // Suchfeld wird ausgeblendet
    else if (goals.length < 4 && goals.length > 1) {
      searchInput.style.display = "none";
      document.querySelector(".table-container").style.marginTop = "0rem";
    }
  });
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

function editGoal(row) {
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
  dialog.showModal(); // Dialog öffnen

  // Update the displayed value when the slider is moved
  valueInput.oninput = function () {
    rangeValueDisplay.textContent = this.value;
  };

  // Save changes button functionality
  document.getElementById("saveChanges").onclick = function () {
    var updatedText = goalInput.value.trim();
    var updatedValue = parseInt(valueInput.value, 10);

    // Überprüfe, ob sich der Name oder Wert geändert hat
    if (updatedText === originalText && updatedValue === originalValue) {
      dialog.classList.add("closing"); // Schließ-Animation starten
      dialog.addEventListener(
        "animationend",
        () => {
          dialog.classList.remove("closing"); // Animation zurücksetzen
          dialog.close(); // Dialog endgültig schließen
        },
        { once: true } // Event-Listener nach einmaliger Ausführung entfernen
      );
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

    dialog.classList.add("closing"); // Schließ-Animation starten
    dialog.addEventListener(
      "animationend",
      () => {
        dialog.classList.remove("closing"); // Animation zurücksetzen
        dialog.close(); // Dialog endgültig schließen
      },
      { once: true } // Event-Listener nach einmaliger Ausführung entfernen
    );
  };
}

// Function to remove a goal
function removeGoal(row) {
  console.log(row);
  // Remove the goal from the displayed table
  goalsList.removeChild(row);

  // Remove the goal from Chrome Storage
  chrome.storage.sync.get("goals", function (data) {
    var goals = data.goals || [];
    // Extract current goal values from the row
    var originalText = row.cells[0].textContent;
    goals = goals.filter((goal) => goal.text !== originalText); // Filter out the removed goal

    // Save the updated array back to Chrome Storage
    chrome.storage.sync.set({ goals: goals }, function () {
      console.log("Updated goals after removal:", goals);
      updateSearchVisibility(); // Sichtbarkeit des Suchfelds aktualisieren
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
