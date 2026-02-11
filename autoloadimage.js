document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    
    if (link && link.href && link.href.includes(window.location.origin) && !link.getAttribute('href').includes('javascript')) {
        e.preventDefault();
        const targetUrl = new URL(link.href);

        fetch(targetUrl)
            .then(res => res.text())
            .then(html => {
                const parser = new DOMParser();
                const newDoc = parser.parseFromString(html, 'text/html');
                const newContent = newDoc.querySelector('#content');

                if (newContent) {
                    document.querySelector('#content').innerHTML = newContent.innerHTML;

                    window.history.pushState({}, '', targetUrl);
                    document.title = newDoc.title;
                    window.scrollTo(0, 0);
                }
            })
            .catch(err => console.error('Seamless load failed:', err));
    }
});

window.onpopstate = () => location.reload();
