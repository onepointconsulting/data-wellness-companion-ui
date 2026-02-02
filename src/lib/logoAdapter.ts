const bodyElement = window?.document?.querySelector("body");

export function logoAdapter() {
  const imageFolder = window.dataWellnessConfig?.imageFolder || "res-ai";
  return bodyElement?.classList.contains("dark")
    ? `${imageFolder}/logo-light.png`
    : `${imageFolder}/logo-dark.png`;
}

export function updateFavicon() {
  const imageFolder = window.dataWellnessConfig?.imageFolder || "res-ai";
  const favicon = document.getElementById("favicon") as HTMLLinkElement;
  if (favicon) {
    favicon.href = `/${imageFolder}/favicon.png`;
  }
}

// Initialize branding
updateFavicon();

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
