const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const navLinks = document.querySelectorAll('[data-section]');
const scrollIcon = document.querySelector('.scroll-icon');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    sidebar.classList.toggle('active');
});

menuToggle.addEventListener('mousedown', (e) => {
    e.preventDefault();
});

menuToggle.addEventListener('touchstart', (e) => {
    e.preventDefault();
});

function smoothScroll(targetId) {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;
    
    const headerOffset = 80;
    const elementPosition = targetElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

function handleNavigation(e) {
    e.preventDefault();
    const targetSection = this.getAttribute('data-section');
    
    menuToggle.classList.remove('active');
    sidebar.classList.remove('active');
    
    if (targetSection) {
        smoothScroll(targetSection);
    }
}

navLinks.forEach(link => {
    link.addEventListener('click', handleNavigation);
});

if (scrollIcon) {
    scrollIcon.addEventListener('click', () => {
        smoothScroll('menu');
    });
}

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
});

document.querySelectorAll('.menu-item').forEach((item, index) => {
    item.style.animationDelay = `${index * 0.2}s`;
});

document.querySelectorAll('.about-card').forEach((card, index) => {
    card.style.animationDelay = `${index * 0.2}s`;
});

document.querySelectorAll('.contact-card').forEach((card, index) => {
    card.style.animationDelay = `${index * 0.2}s`;
});

document.querySelectorAll('.contact-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.stopPropagation();
    });
});

const hourRows = document.querySelectorAll('.hour-row');
hourRows.forEach(row => {
    row.addEventListener('mouseenter', () => {
        row.style.transform = 'translateX(10px)';
        row.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
    });
    
    row.addEventListener('mouseleave', () => {
        row.style.transform = 'translateX(0)';
        row.style.boxShadow = 'none';
    });
});

const features = document.querySelectorAll('.feature');
features.forEach(feature => {
    feature.addEventListener('mouseenter', () => {
        const icon = feature.querySelector('.feature-icon svg');
        if (icon) {
            icon.style.transform = 'scale(1.2) rotate(10deg)';
        }
    });
    
    feature.addEventListener('mouseleave', () => {
        const icon = feature.querySelector('.feature-icon svg');
        if (icon) {
            icon.style.transform = 'scale(1) rotate(0deg)';
        }
    });
});

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    setTimeout(() => {
        document.querySelectorAll('.menu-item').forEach(item => {
            item.style.opacity = '1';
        });
    }, 500);
});

function highlightCurrentDayHours() {
    const daysMap = {
        0: 'Sunday',
        1: 'Monday - Thursday',
        2: 'Monday - Thursday',
        3: 'Monday - Thursday',
        4: 'Monday - Thursday',
        5: 'Friday - Saturday',
        6: 'Friday - Saturday'
    };
    
    const today = new Date().getDay();
    const currentDayRange = daysMap[today];
    
    const hourRows = document.querySelectorAll('.hour-row');
    hourRows.forEach(row => {
        row.classList.remove('highlight-row');
        row.classList.remove('current-day');
    });
    
    hourRows.forEach(row => {
        const dayElement = row.querySelector('.day');
        if (dayElement && dayElement.textContent.trim() === currentDayRange) {
            row.classList.add('highlight-row');
            row.classList.add('current-day');
        }
    });
}

highlightCurrentDayHours();