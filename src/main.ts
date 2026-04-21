import './style.css';
import { initLoader } from './loader';

/**
 * Shared layout component loader
 * This avoids "two sources of truth" by fetching the navbar and sidebar
 * from a single location if they aren't already present.
 */
async function loadSharedComponents() {
  const leftside = document.querySelector('#leftside');
  const content = document.querySelector('#content');

  // Inject sidebar if #leftside is empty or missing it
  if (leftside && !leftside.querySelector('.sidebar')) {
    const response = await fetch('/src/components/sidebar.html');
    leftside.innerHTML = await response.text();
  }

  // Inject sidebar2 if it's missing from the main content layout
  if (content && !document.querySelector('.sidebar2')) {
    const response = await fetch('/src/components/sidebar2.html');
    content.insertAdjacentHTML('beforeend', await response.text());
  }
}

// Initialize
initLoader();
loadSharedComponents();
