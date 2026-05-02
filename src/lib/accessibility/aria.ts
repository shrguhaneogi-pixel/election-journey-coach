/**
 * Manages focus on state transitions to ensure screen readers announce
 * new context changes appropriately.
 */
export function focusMainHeading() {
  const heading = document.getElementById("main-heading");
  if (heading) {
    // Adding tabindex="-1" allows non-interactive elements to receive focus programmatically
    heading.setAttribute("tabindex", "-1");
    heading.focus();
    // Remove outline for mouse users but keep it for keyboard users via global CSS if needed
    heading.style.outline = "none";
  }
}
