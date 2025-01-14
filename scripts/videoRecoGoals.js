// https://chatgpt.com/share/6786bd5d-087c-8008-be48-4893fe8212f9
function searchVideos(goals) {
  // Überprüfe, ob eine Liste von Zielen ("goals") vorhanden ist und ob sie leer ist.
  if (!goals || goals.length === 0) {
    console.log("Keine Ziele angegeben. Beende die Funktion.");
    return; // Verlasse die Funktion, wenn keine Ziele vorhanden sind.
  }

  // Ein "Beobachter" wird erstellt, der auf Änderungen in der Webseite reagiert.
  const observer = new MutationObserver((mutations) => {
    // Versuche, das Element mit der ID "primary" zu finden.
    const primaryElement = document.getElementById("primary");

    // Wenn das Element gefunden wird, führe die folgende Aktion aus:
    if (primaryElement) {
      // Stoppe den Beobachter, da wir das gesuchte Element gefunden haben.
      observer.disconnect();

      // Rufe gespeicherte Daten aus dem Browser-Speicher ab.
      chrome.storage.sync.get(["doubleGoals", "videoData"], (res) => {
        // Lade gespeicherte Ziele und Videos, falls vorhanden. Wenn nichts gespeichert ist, setze Standardwerte.
        const storedGoals = res.doubleGoals || {};
        const storedVideos = res.videoData || {};

        // Kopiere die gespeicherten Videos in ein neues Objekt.
        const goalVideos = { ...storedVideos };

        // Extrahiere nur die Text-Beschreibungen aus den übergebenen Zielen.
        const goalTexts = goals.map((goal) => goal.text);

        // Finde neue Ziele, die noch nicht gespeichert sind.
        const goalsToAdd = goalTexts.filter((text) => !storedGoals[text]);

        // Finde gespeicherte Ziele, die nicht mehr in den übergebenen Zielen vorhanden sind.
        const goalsToRemove = Object.keys(storedGoals).filter(
          (storedGoal) => !goalTexts.includes(storedGoal)
        );

        // Wenn es keine neuen Ziele oder zu entfernenden Ziele gibt, führe keine API-Abfrage durch.
        if (goalsToAdd.length === 0 && goalsToRemove.length === 0) {
          console.log(
            "Alle Ziele sind bereits gespeichert. Keine API-Anfrage erforderlich."
          );
          displayVideos(goalVideos); // Zeige die gespeicherten Videos an.
          return;
        }

        // Verarbeite die neuen Ziele, falls vorhanden.
        if (goalsToAdd.length > 0) {
          console.log("Neue Ziele zum Hinzufügen:", goalsToAdd);

          // Rufe Videos für die neuen Ziele von der YouTube-API ab.
          Promise.all(
            goalsToAdd.map((goalText) => {
              // Suche das entsprechende Ziel aus der Liste der übergebenen Ziele.
              const goal = goals.find((g) => g.text === goalText);

              // Verwende entweder den "prompt"-Wert des Ziels oder den Text selbst.
              const prompt = goal ? goal.prompt : goalText;

              console.log("Der Text für die API-Anfrage lautet: " + prompt);

              // Baue die URL für die YouTube-API.
              const apiKey = "AIzaSyBYmLMpFyEjHVEvVhob4ncb9QYAse32kJo";
              const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
                prompt
              )}&type=video&key=${apiKey}`;

              // Sende die Anfrage an die YouTube-API.
              return fetch(url)
                .then((response) => response.json()) // Konvertiere die Antwort in JSON-Format.
                .then((data) => {
                  // Filtere die erhaltenen Videos und schließe YouTube Shorts aus.
                  const shortsRegex = /#?short/i;

                  const videos = data.items
                    .map((item) => ({
                      videoId: item.id.videoId,
                      title: item.snippet.title,
                      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
                      description: item.snippet.description,
                      thumbnail: item.snippet.thumbnails.medium.url,
                    }))
                    .filter(
                      (video) =>
                        !shortsRegex.test(video.title) &&
                        !shortsRegex.test(video.description)
                    );

                  // Speichere die neuen Videos für das Ziel.
                  goalVideos[goalText] = videos;
                  storedGoals[goalText] = true;
                });
            })
          )
            .then(() => {
              // Speichere die aktualisierten Daten im Browser-Speicher.
              chrome.storage.sync.set(
                { doubleGoals: storedGoals, videoData: goalVideos },
                () => {
                  console.log(
                    "Gespeicherte Ziele und Videos aktualisiert:",
                    goalVideos
                  );
                  displayVideos(goalVideos); // Zeige die aktualisierten Videos an.
                }
              );
            })
            .catch((error) =>
              console.error("Fehler beim Abrufen der Videos:", error)
            );
        }

        // Entferne Ziele, die nicht mehr benötigt werden.
        if (goalsToRemove.length > 0) {
          console.log("Ziele zum Entfernen:", goalsToRemove);
          goalsToRemove.forEach((goalText) => {
            // Entferne das Ziel und die zugehörigen Videos.
            delete goalVideos[goalText];
            delete storedGoals[goalText];
          });

          // Speichere die aktualisierten Daten im Browser-Speicher.
          chrome.storage.sync.set(
            { doubleGoals: storedGoals, videoData: goalVideos },
            () => {
              console.log(
                "Gespeicherte Ziele nach Entfernung aktualisiert:",
                storedGoals
              );
              displayVideos(goalVideos); // Zeige die aktualisierten Videos an.
            }
          );
        } else {
          // Zeige die Videos an, falls keine Änderungen vorgenommen werden müssen.
          displayVideos(goalVideos);
        }
      });
    }
  });

  // Starte den Beobachter, um Änderungen im DOM zu überwachen.
  observer.observe(document.body, { childList: true, subtree: true });
}

// Function to display videos grouped by goal
function displayVideos(goalVideos) {
  // Suche das HTML-Element mit der ID "primary", in dem die Videos angezeigt werden sollen.
  const primaryElement = document.getElementById("primary");

  // Lösche alle Inhalte, die bereits im "primary"-Element angezeigt werden.
  primaryElement.innerHTML = "";

  // Erstelle einen Container für die Buttons am oberen Rand der Seite.
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "goal-buttons";

  // Stelle den Container so ein, dass er wie eine Leiste aussieht.
  buttonContainer.style.display = "flex"; // Ordne die Buttons nebeneinander an.
  buttonContainer.style.gap = "8px"; // Lasse Platz zwischen den Buttons.
  buttonContainer.style.marginBottom = "1rem"; // Abstand nach unten.
  buttonContainer.style.padding = "1rem"; // Innenabstand.
  buttonContainer.style.position = "fixed"; // Fixiere den Container oben auf der Seite.
  buttonContainer.style.width = "100%"; // Der Container soll die ganze Seitenbreite einnehmen.
  buttonContainer.style.top = "50px"; // Positioniere den Container 50 Pixel unter der oberen Kante.
  buttonContainer.style.backgroundColor = "#0f0f0f"; // Färbe den Hintergrund dunkelgrau.
  buttonContainer.style.zIndex = "1000"; // Stelle sicher, dass der Container über anderen Elementen liegt.

  // Erstelle für jedes Ziel (Thema) einen Button.
  for (const [goalKey, videos] of Object.entries(goalVideos)) {
    // Hole den Namen des Ziels, falls es als Objekt gespeichert ist.
    const goalName =
      typeof goalKey === "object"
        ? goalKey.text || "Unbekanntes Ziel"
        : goalKey;

    // Erstelle einen neuen Button für das Ziel.
    const goalButton = document.createElement("button");
    goalButton.textContent = goalName; // Beschrifte den Button mit dem Zielnamen.
    goalButton.title = "Klicke, um zum Abschnitt von " + goalName; // zu springen

    // Gestalte den Button.
    goalButton.style.padding = "0.8rem 1.2rem";
    goalButton.style.borderRadius = "6px";
    goalButton.style.cursor = "pointer";
    goalButton.style.backgroundColor = "rgba(255,255,255,0.2)"; // Halbtransparenter Hintergrund.
    goalButton.style.color = "white";
    goalButton.style.border = "none"; // Keine Umrandung.
    goalButton.style.transition = "background-color 0.3s"; // Sanfter Farbübergang beim Hover.

    // Füge eine Aktion hinzu, wenn der Button angeklickt wird.
    goalButton.addEventListener("click", () => {
      const goalElement = document.getElementById(`goal-${goalName}`); // Suche den Abschnitt des Ziels.
      const offset = 110; // Platz zwischen Abschnitt und Seitenanfang.

      // Berechne die Scroll-Position und scrolle dorthin.
      const elementPosition =
        goalElement.getBoundingClientRect().top + window.scrollY;
      const targetPosition = elementPosition - offset;

      // Scrolle sanft zur Zielposition.
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    });

    // Ändere die Hintergrundfarbe, wenn die Maus über den Button fährt.
    goalButton.addEventListener("mouseover", () => {
      goalButton.style.backgroundColor = "#555";
    });
    goalButton.addEventListener("mouseout", () => {
      goalButton.style.backgroundColor = "#333";
    });

    // Füge den Button dem Button-Container hinzu.
    buttonContainer.appendChild(goalButton);
  }

  // Füge den Button-Container dem "primary"-Element hinzu.
  primaryElement.appendChild(buttonContainer);

  // Überprüfe, ob es keine Videos gibt.
  if (Object.keys(goalVideos).length === 0) {
    primaryElement.innerHTML += "<p>Keine Videoempfehlungen gefunden.</p>";
    return; // Beende die Funktion, wenn es keine Videos gibt.
  }

  // Variable, um festzustellen, ob es der erste Zielabschnitt ist.
  let isFirstGoal = true;

  // Gehe jedes Ziel durch und zeige die zugehörigen Videos an.
  for (const [goalKey, videos] of Object.entries(goalVideos)) {
    const goalName =
      typeof goalKey === "object"
        ? goalKey.text || "Unbekanntes Ziel"
        : goalKey;

    // Erstelle einen neuen Abschnitt für das Ziel.
    const goalSection = document.createElement("div");
    goalSection.id = `goal-${goalName}`; // Setze eine eindeutige ID für den Abschnitt.
    goalSection.style.marginBottom = "2rem";

    // Füge einen Titel mit dem Zielnamen hinzu.
    const goalTitle = document.createElement("h2");
    goalTitle.textContent = goalName; // Titeltext.
    goalTitle.style.color = "white";

    // Füge beim ersten Ziel mehr Abstand nach oben hinzu.
    if (isFirstGoal) {
      goalTitle.style.marginTop = "6rem";
      isFirstGoal = false; // Danach kein zusätzlicher Abstand.
    } else {
      goalTitle.style.marginTop = "2rem";
    }
    goalTitle.style.marginLeft = "1rem";
    goalTitle.style.marginBottom = "1rem";
    goalSection.appendChild(goalTitle);

    // Erstelle einen Container für die Videos unter dem Ziel.
    const videoContainer = document.createElement("div");
    videoContainer.style.display = "flex";
    videoContainer.style.flexWrap = "wrap";
    videoContainer.style.gap = "16px"; // Platz zwischen Videos.
    videoContainer.style.justifyContent = "flex-start";
    videoContainer.style.marginLeft = "1rem";

    // Gehe durch jedes Video und erstelle eine Karte dafür.
    videos.forEach((video) => {
      const videoElement = document.createElement("div");
      videoElement.style.flex = "1 1 300px";
      videoElement.style.maxWidth = "315px";
      videoElement.style.borderRadius = "8px";
      videoElement.style.overflow = "hidden";
      videoElement.style.backgroundColor = "black";
      videoElement.style.boxShadow =
        "0px 0px 10px 0px rgba(255, 255, 255, 0.8)";
      videoElement.style.transition = "background-color 0.5s ease-in-out";

      // Füge das Video als anklickbaren Link mit Bild und Beschreibung hinzu.
      videoElement.innerHTML = `
        <a title='${video.description}' style='text-decoration:none;' href="${video.url}" target="_blank">
          <img width="100%" height="180" src="${video.thumbnail}" alt="${video.title}" style="display: block; border-radius: 8px 8px 0 0;">
          <h3 style="color: white; margin: 0.5rem 0.5rem 0 0.5rem;">${video.title}</h3>
          <p style="color: white; margin: 0.5rem;">${video.description}</p>
        </a>
      `;

      // Ändere die Hintergrundfarbe, wenn die Maus über das Video fährt.
      const anchorElement = videoElement.querySelector("a");
      anchorElement.style.color = "white";
      anchorElement.addEventListener("mouseover", () => {
        videoElement.style.backgroundColor = "#484848";
      });
      anchorElement.addEventListener("mouseout", () => {
        videoElement.style.backgroundColor = "black";
      });

      // Füge das Video dem Video-Container hinzu.
      videoContainer.appendChild(videoElement);
    });

    // Füge den Video-Container dem Zielabschnitt hinzu.
    goalSection.appendChild(videoContainer);
    primaryElement.appendChild(goalSection); // Füge den Zielabschnitt dem "primary"-Element hinzu.
  }
}
