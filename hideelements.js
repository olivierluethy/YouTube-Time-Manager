// Funktion, um ein Element anhand eines Selektors auszublenden
function hideElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
      element.style.display = "none";
    }
  }
  
  // Funktion, um mehrere Elemente anhand eines Selektors auszublenden
  function hideElements(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element) => {
      element.style.display = "none";
    });
  }