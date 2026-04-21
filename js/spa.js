/**
 * SPA Navigator - Smooth transitions, caching, Pretty URLs, and Component Loading.
 */

const cache = new Map();
const parser = new DOMParser();

/**
 * Normalizes a URL for fetching.
 */
function getFetchUrl(url) {
    const u = new URL(url, window.location.origin);
    if (u.pathname !== '/' && !u.pathname.endsWith('.html') && !u.pathname.includes('.')) {
        u.pathname += '.html';
    }
    return u.toString();
}

// Pre-load current page into cache
const initialFetchUrl = getFetchUrl(window.location.href);
const initialContent = document.documentElement.outerHTML;
cache.set(initialFetchUrl, initialContent);

// If we are currently on the 404 page (either by reload or error), 
// cache this as the master 404 template to avoid ever fetching it.
if (document.title.includes('404')) {
    cache.set(getFetchUrl('/404.html'), initialContent);
}

function getDisplayUrl(url) {
    return url.replace(/\.html$/, '').replace(/\/index$/, '/');
}

/**
 * Component Loader: Fetches and injects shared parts (Sidebar, Footer).
 */
async function loadComponents(container = document) {
    const components = [
        { selector: '#sidebar-placeholder', url: '/components/sidebar.html' },
        { selector: 'footer', url: '/components/footer.html' }
    ];

    for (const comp of components) {
        const placeholder = container.querySelector(comp.selector);
        if (placeholder && !placeholder.hasChildNodes()) {
            try {
                if (!cache.has(comp.url)) {
                    const res = await fetch(comp.url);
                    const html = await res.text();
                    cache.set(comp.url, html);
                }
                placeholder.innerHTML = cache.get(comp.url);
            } catch (e) {
                console.warn(`Failed to load component: ${comp.url}`, e);
            }
        }
    }
}

async function fetchPage(url) {
    const fetchUrl = getFetchUrl(url);
    if (cache.has(fetchUrl)) return cache.get(fetchUrl);
    
    try {
        const res = await fetch(fetchUrl);
        
        // Handle 404 Not Found
        if (res.status === 404) {
            const master404Url = getFetchUrl('/404.html');
            if (cache.has(master404Url)) return cache.get(master404Url);
            
            const errorRes = await fetch('/404.html');
            const errorHtml = await errorRes.text();
            cache.set(master404Url, errorHtml);
            return errorHtml;
        }

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        
        const html = await res.text();
        cache.set(fetchUrl, html);
        return html;
    } catch (e) {
        return null;
    }
}

async function navigate(url, addHistory = true) {
    const contentContainer = document.querySelector('#content');
    const navbar = document.querySelector('.navbar');
    
    if (!contentContainer) {
        window.location.href = url;
        return;
    }

    const currentUrl = new URL(window.location.href);
    const fetchUrl = getFetchUrl(url);
    
    if (getFetchUrl(currentUrl.href) === fetchUrl && addHistory) {
        return;
    }

    contentContainer.style.opacity = '0';
    
    try {
        const html = await fetchPage(fetchUrl);
        if (!html) {
            window.location.href = url;
            return;
        }

        const doc = parser.parseFromString(html, 'text/html');
        const newContent = doc.querySelector('#content');
        const newNavbar = doc.querySelector('.navbar');
        
        if (!newContent) {
            window.location.href = url;
            return;
        }

        await new Promise(r => setTimeout(r, 200));

        syncHead(doc);

        if (navbar && newNavbar) navbar.innerHTML = newNavbar.innerHTML;

        contentContainer.innerHTML = newContent.innerHTML;
        document.title = doc.title;

        if (addHistory) {
            window.history.pushState({ fetchUrl }, '', getDisplayUrl(url));
        }

        window.scrollTo(0, 0);

        // Load components for the new content
        await loadComponents(contentContainer);

        executeScriptsInContainer(contentContainer);
        contentContainer.style.opacity = '1';

    } catch (err) {
        window.location.href = url;
    }
}

function syncHead(newDoc) {
    const head = document.head;
    const newHeadTags = newDoc.head.querySelectorAll('link[rel="stylesheet"], style');
    newHeadTags.forEach(newTag => {
        const isDuplicate = Array.from(head.querySelectorAll('link[rel="stylesheet"], style')).some(oldTag => {
            if (newTag.tagName === 'LINK' && oldTag.tagName === 'LINK') return newTag.href === oldTag.href;
            if (newTag.tagName === 'STYLE' && oldTag.tagName === 'STYLE') return newTag.textContent === oldTag.textContent;
            return false;
        });
        if (!isDuplicate) head.appendChild(newTag.cloneNode(true));
    });
}

function executeScriptsInContainer(container) {
    container.querySelectorAll('script').forEach(oldScript => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
        newScript.textContent = oldScript.textContent;
        oldScript.parentNode.replaceChild(newScript, oldScript);
    });
}

// --- Event Listeners ---

document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link || !link.href) return;
    const url = new URL(link.href, window.location.origin);
    const isLocal = url.origin === window.location.origin;
    if (isLocal && !link.hasAttribute('download') && link.target !== '_blank' && !link.href.startsWith('javascript:')) {
        e.preventDefault();
        navigate(link.href);
    }
});

document.addEventListener('mouseover', (e) => {
    const link = e.target.closest('a');
    if (link && link.href) {
        const url = new URL(link.href, window.location.origin);
        if (url.origin === window.location.origin && !link.target && !link.href.includes('#') && !link.href.startsWith('javascript:')) {
            fetchPage(link.href).catch(() => {});
        }
    }
});

window.addEventListener('popstate', (e) => {
    const target = (e.state && e.state.fetchUrl) ? e.state.fetchUrl : window.location.href;
    navigate(target, false);
});

// Initial load
document.addEventListener('DOMContentLoaded', () => loadComponents());

(function injectStyles() {
    if (document.getElementById('spa-nav-styles')) return;
    const style = document.createElement('style');
    style.id = 'spa-nav-styles';
    style.textContent = `#content { transition: opacity 0.2s ease-in-out; will-change: opacity; }`;
    document.head.appendChild(style);
})();
