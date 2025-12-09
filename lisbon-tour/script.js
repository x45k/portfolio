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

function initializeActiveButton() {
    const targetBtn = document.querySelector(`[data-target="home"]`);
    
    if (targetBtn) {
        setActiveButton(targetBtn);
    } else {
        const homeBtn = document.querySelector('[data-target="home"]');
        setActiveButton(homeBtn);
    }
}

navBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        setActiveButton(this);
        
        const targetId = this.getAttribute('data-target');
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
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
    
    btn.addEventListener('touchstart', function() {
        this.style.backgroundColor = 'rgba(77, 171, 247, 0.1)';
    });
    
    btn.addEventListener('touchend', function() {
        if (!this.classList.contains('active')) {
            this.style.backgroundColor = '';
        }
    });
});

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
    document.getElementById('tours').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
    
    const toursBtn = document.querySelector('[data-target="tours"]');
    setActiveButton(toursBtn);
});

window.addEventListener('resize', () => {
    const activeBtn = document.querySelector('.nav-btn.active');
    if (activeBtn) {
        updateActiveIndicator(activeBtn);
    }
});

window.addEventListener('load', () => {
    document.body.style.overflowX = 'hidden';
    
    const activeBtn = document.querySelector('.nav-btn.active');
    if (activeBtn) {
        updateActiveIndicator(activeBtn);
    }
});