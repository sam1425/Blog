/**
 * Seamless page loader
 * Handles clicks on internal links to load content dynamically without a full page refresh.
 */

export function initLoader() {
  document.addEventListener('click', async (e: MouseEvent) => {
    const link = (e.target as HTMLElement).closest('a');
    
    if (
      link && 
      link.href && 
      link.href.includes(window.location.origin) && 
      !link.getAttribute('href')?.includes('javascript') &&
      !link.hasAttribute('download') &&
      link.target !== '_blank'
    ) {
      e.preventDefault();
      const targetUrl = new URL(link.href);

      try {
        const response = await fetch(targetUrl.href);
        const html = await response.text();
        const parser = new DOMParser();
        const newDoc = parser.parseFromString(html, 'text/html');
        const newContent = newDoc.querySelector('#content');
        const currentContent = document.querySelector('#content');

        if (newContent && currentContent) {
          // Update the content
          currentContent.innerHTML = newContent.innerHTML;

          // Update URL and Title
          window.history.pushState({}, '', targetUrl.href);
          document.title = newDoc.title;
          
          // Scroll to top
          window.scrollTo(0, 0);

          // Re-initialize any scripts if needed
          // For simple sites, you might need to re-run specific init functions here
        } else {
          // Fallback if content structure doesn't match
          window.location.href = link.href;
        }
      } catch (err) {
        console.error('Seamless load failed:', err);
        window.location.href = link.href;
      }
    }
  });

  window.onpopstate = () => location.reload();
}
