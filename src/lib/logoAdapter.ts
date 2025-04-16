const bodyElement = window?.document?.querySelector("body");

export function logoAdapter() {
  return bodyElement?.classList.contains("dark")
    ? "res_ai_logo_dark.png"
    : "res_ai_logo.png";
}

// Create a new MutationObserver instance
const observer = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (
      bodyElement &&
      mutation.type === "attributes" &&
      mutation.attributeName === "class"
    ) {
      const logoImage = document.getElementById("logoImage");
      if (logoImage) {
        logoImage.setAttribute("src", logoAdapter());
      }
    }
  }
});

if (bodyElement) {
  observer.observe(bodyElement, {
    attributes: true, // Observe attribute changes
    attributeFilter: ["class"], // Only watch the 'class' attribute
  });
}
