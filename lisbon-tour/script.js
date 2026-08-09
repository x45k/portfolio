const navBtns = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.section');
const navButtons = document.querySelector('.nav-buttons');
const activeIndicator = document.createElement('div');
activeIndicator.className = 'active-indicator';
navButtons.appendChild(activeIndicator);

let lastActiveSection = 'home';

function updateActiveIndicator(activeBtn) {
    const btnRect = activeBtn.getBoundingClientRect();
    const containerRect = navButtons.getBoundingClientRect();
    activeIndicator.style.width = `${btnRect.width}px`;
    activeIndicator.style.left = `${btnRect.left - containerRect.left}px`;
}

function setActiveButton(btn) {
    navBtns.forEach(b => {
        b.classList.remove('active');
        b.style.backgroundColor = '';
    });
    btn.classList.add('active');
    btn.style.backgroundColor = 'rgba(77, 171, 247, 0.1)';
    updateActiveIndicator(btn);
}

navBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        setActiveButton(this);
        const targetId = this.getAttribute('data-target');
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
    btn.addEventListener('mouseenter', function() {
        if (!this.classList.contains('active')) {
            this.style.transform = 'translateY(-2px)';
            this.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
        }
    });
    btn.addEventListener('mouseleave', function() {
        if (!this.classList.contains('active')) {
            this.style.transform = 'translateY(0)';
            this.style.backgroundColor = '';
        }
    });
});

function initializeActiveButton() {
    const homeBtn = document.querySelector('[data-target="home"]');
    if (homeBtn) setActiveButton(homeBtn);
}
initializeActiveButton();

window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            const sectionId = section.getAttribute('id');
            if (lastActiveSection !== sectionId) {
                lastActiveSection = sectionId;
                navBtns.forEach(btn => {
                    if (btn.getAttribute('data-target') === sectionId) {
                        setActiveButton(btn);
                    }
                });
            }
        }
    });
});

document.querySelector('.cta-btn').addEventListener('click', () => {
    document.getElementById('tours').scrollIntoView({ behavior: 'smooth', block: 'start' });
    const toursBtn = document.querySelector('[data-target="tours"]');
    setActiveButton(toursBtn);
});

window.addEventListener('resize', () => {
    const activeBtn = document.querySelector('.nav-btn.active');
    if (activeBtn) updateActiveIndicator(activeBtn);
});

function splitTextElements() {
    document.querySelectorAll('.split-text').forEach(el => {
        const words = el.textContent.trim().split(/\s+/);
        el.innerHTML = words.map((word, i) => 
            `<span class="word" style="--word-index: ${i}">${word}</span>`
        ).join(' ');
    });
}
splitTextElements();

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target.classList.contains('split-text')) {
                const words = entry.target.querySelectorAll('.word');
                words.forEach((w, i) => {
                    w.style.transitionDelay = `calc(var(--word-index, 0) * 0.07s + 0.05s)`;
                });
            }
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -20px 0px'
});

document.querySelectorAll('[data-animate], .split-text').forEach(el => {
    observer.observe(el);
});

const heroBg = document.querySelector('.hero-bg');
if (heroBg) {
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const maxScale = 1.25;
        const maxTranslate = 60;
        const progress = Math.min(scrollY / 600, 1);
        const scale = 1.08 + progress * (maxScale - 1.08);
        const translate = Math.min(scrollY * 0.25, maxTranslate);
        heroBg.style.transform = `scale(${scale}) translateY(${translate}px)`;
    });
}

const statNumbers = document.querySelectorAll('.stat h4[data-count]');
let countersStarted = false;

function animateCounters() {
    if (countersStarted) return;
    const statsSection = document.getElementById('about');
    if (!statsSection) return;
    const rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
        countersStarted = true;
        statNumbers.forEach(el => {
            const target = parseInt(el.getAttribute('data-count'), 10);
            if (isNaN(target)) return;
            const suffix = el.textContent.replace(/[0-9+]/g, '');
            let current = 0;
            const increment = Math.ceil(target / 60);
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    el.textContent = target + suffix;
                    clearInterval(timer);
                } else {
                    el.textContent = current + suffix;
                }
            }, 18);
        });
    }
}

window.addEventListener('scroll', animateCounters);
window.addEventListener('load', () => {
    setTimeout(animateCounters, 300);
    const activeBtn = document.querySelector('.nav-btn.active');
    if (activeBtn) updateActiveIndicator(activeBtn);
    document.querySelectorAll('[data-animate], .split-text').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.classList.add('visible');
        }
    });
});