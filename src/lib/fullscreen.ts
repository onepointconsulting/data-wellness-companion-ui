export function enterFullscreen(element: HTMLElement) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
    return;
  }
  const anyElement = element as any;
  if (anyElement.mozRequestFullScreen) {
    // Firefox
    anyElement.mozRequestFullScreen?.();
  } else if (anyElement.webkitRequestFullscreen) {
    // Chrome, Safari and Opera
    anyElement.webkitRequestFullscreen?.();
  } else if (anyElement.msRequestFullscreen) {
    // IE/Edge
    anyElement.msRequestFullscreen?.();
  }
}

export function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  }
  const anyDocument = document as any;
  if (anyDocument.mozCancelFullScreen) {
    // Firefox
    anyDocument.mozCancelFullScreen?.();
  } else if (anyDocument.webkitExitFullscreen) {
    // Chrome, Safari and Opera
    anyDocument.webkitExitFullscreen?.();
  } else if (anyDocument.msExitFullscreen) {
    // IE/Edge
    anyDocument.msExitFullscreen?.();
  }
}
