var input = document.getElementById("goalInput");
var goalsList = document.getElementById("goals");

// TODO: Gruppierungen der Ziele hinzufügen
// Lade die gespeicherten Ziele beim Laden der Seite
chrome.storage.sync.get("goals", function (data) {
  if (data.goals) {
    data.goals.forEach(function (goal) {
      addGoalToList(goal);
    });
  }
});

// Funktion, um ein Ziel zur Liste hinzuzufügen
function addGoalToList(goalText) {
  var listItem = document.createElement("p");
  listItem.className = "goal-item";
  listItem.textContent = goalText;

  // Erstelle den "X"-Button
  var removeButton = document.createElement("span");
  removeButton.textContent = "X";
  removeButton.className = "remove-goal";
  removeButton.title = "Remove this goal";
  removeButton.onclick = function () {
    removeGoal(goalText, listItem);
  };

  listItem.appendChild(removeButton);
  goalsList.appendChild(listItem);
}

// Event Listener für die Eingabe
input.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Verhindert das Standardverhalten der Enter-Taste

    // Hole den eingegebenen Text
    var goalText = input.value.trim();

    if (goalText) {
      // Regular expression to check for special characters
      var isValidInput = /^[a-zA-Z0-9\s]*$/.test(goalText); // Allows letters, numbers, and spaces

      if (isValidInput) {
        addGoalToList(goalText);

        // Leere das Eingabefeld nach dem Hinzufügen
        input.value = "";

        // Speichere das neue Ziel im Chrome Storage
        chrome.storage.sync.get("goals", function (data) {
          var goals = data.goals || [];
          goals.push(goalText); // Füge das neue Ziel hinzu

          // Speichere das aktualisierte Array zurück in den Chrome Storage
          chrome.storage.sync.set({ goals: goals }, function () {
            console.log("Ziele gespeichert:", goals);
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

// Funktion, um ein Ziel zu entfernen
function removeGoal(goalText, listItem) {
  // Entferne das Listenelement
  goalsList.removeChild(listItem);

  // Aktualisiere den Chrome Storage
  chrome.storage.sync.get("goals", function (data) {
    var goals = data.goals || [];
    // Entferne das Ziel aus dem Array
    goals = goals.filter((goal) => goal !== goalText);

    // Speichere das aktualisierte Array zurück in den Chrome Storage
    chrome.storage.sync.set({ goals: goals }, function () {
      console.log("Ziele aktualisiert:", goals);
    });
  });
}
