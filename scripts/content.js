"use strict";
// Initialisierung
redirectToSubscriptions();
// If you try to enter trends
cheatingRedirect();
observeDOMForRecommendations(hideYouTubeRecommendations);
hideYouTubeRecommendations();
// Initialisiere den Listener beim ersten Laden der Seite
addLogoClickListener();
// Funktion um Videovorschläge nach dem Betrachten eines Videos auszublenden
removeRecoOnVideo();
// YouTube Titel mit Anzahl notifications entfernen
document.title = document.title.replace(/\s*\(\d+\)/g, "");
