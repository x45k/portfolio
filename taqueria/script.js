document.querySelectorAll('.nav a, .logo').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const hash = this.getAttribute('href');
        if (hash && hash.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(hash);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        } else if (hash === '#') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
});

(function arrangeTacoCards() {
    const container = document.querySelector('.taco-cards');
    if (!container) return;
    const cards = Array.from(container.children);
    if (cards.length !== 7) return;
    const topFour = cards.slice(0, 4);
    const bottomThree = cards.slice(4, 7);
    container.innerHTML = '';
    const topRow = document.createElement('div');
    topRow.className = 'top-row';
    const bottomRow = document.createElement('div');
    bottomRow.className = 'bottom-row';
    topFour.forEach(card => topRow.appendChild(card));
    bottomThree.forEach(card => bottomRow.appendChild(card));
    container.appendChild(topRow);
    container.appendChild(bottomRow);
})();

(function arrangeContactCards() {
    const container = document.querySelector('.contact-grid');
    if (!container) return;
    const cards = Array.from(container.children);
    if (cards.length !== 6) return;
    const topFour = cards.slice(0, 4);
    const bottomTwo = cards.slice(4, 6);
    container.innerHTML = '';
    const topRow = document.createElement('div');
    topRow.className = 'contact-top-row';
    const bottomRow = document.createElement('div');
    bottomRow.className = 'contact-bottom-row';
    topFour.forEach(card => topRow.appendChild(card));
    bottomTwo.forEach(card => bottomRow.appendChild(card));
    container.appendChild(topRow);
    container.appendChild(bottomRow);
})();