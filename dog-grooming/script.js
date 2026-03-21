document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.header');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '80px';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.backgroundColor = 'var(--white)';
                navLinks.style.padding = '24px';
                navLinks.style.gap = '20px';
                navLinks.style.boxShadow = 'var(--shadow-md)';
                navLinks.style.borderRadius = '0 0 24px 24px';
            }
        });
    }
    
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            if (navLinks) {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'row';
                navLinks.style.position = 'static';
                navLinks.style.padding = '0';
                navLinks.style.backgroundColor = 'transparent';
                navLinks.style.boxShadow = 'none';
            }
        } else {
            if (navLinks && navLinks.style.display !== 'flex') {
                navLinks.style.display = 'none';
            }
        }
    });
    
    navLinksItems.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerHeight = header ? header.offsetHeight : 80;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                navLinksItems.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                if (window.innerWidth <= 768 && navLinks) {
                    navLinks.style.display = 'none';
                }
            }
        });
    });
    
    function updateActiveNavOnScroll() {
        const scrollPosition = window.scrollY + (header ? header.offsetHeight + 100 : 120);
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                const currentId = section.getAttribute('id');
                navLinksItems.forEach(link => {
                    link.classList.remove('active');
                    const href = link.getAttribute('href').substring(1);
                    if (href === currentId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNavOnScroll);
    updateActiveNavOnScroll();
    
    let currentTestimonial = 0;
    const testimonials = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    
    function showTestimonial(index) {
        if (!testimonials.length) return;
        
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.remove('active');
            if (dots[i]) dots[i].classList.remove('active');
        });
        
        const newIndex = ((index % testimonials.length) + testimonials.length) % testimonials.length;
        testimonials[newIndex].classList.add('active');
        if (dots[newIndex]) dots[newIndex].classList.add('active');
        currentTestimonial = newIndex;
    }
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => showTestimonial(currentTestimonial - 1));
        nextBtn.addEventListener('click', () => showTestimonial(currentTestimonial + 1));
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => showTestimonial(index));
        });
    }
    
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (img) {
                const modal = document.createElement('div');
                modal.style.position = 'fixed';
                modal.style.top = '0';
                modal.style.left = '0';
                modal.style.width = '100%';
                modal.style.height = '100%';
                modal.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
                modal.style.zIndex = '2000';
                modal.style.display = 'flex';
                modal.style.alignItems = 'center';
                modal.style.justifyContent = 'center';
                modal.style.cursor = 'pointer';
                
                const modalImg = document.createElement('img');
                modalImg.src = img.src;
                modalImg.style.maxWidth = '90%';
                modalImg.style.maxHeight = '90%';
                modalImg.style.borderRadius = '16px';
                modalImg.style.objectFit = 'contain';
                
                modal.appendChild(modalImg);
                document.body.appendChild(modal);
                
                modal.addEventListener('click', function() {
                    modal.remove();
                });
                
                document.addEventListener('keydown', function(e) {
                    if (e.key === 'Escape' && document.body.contains(modal)) {
                        modal.remove();
                    }
                });
            }
        });
    });
    
    const today = new Date();
    const dayOfWeek = today.getDay();
    
    const hourGroups = document.querySelectorAll('.hour-group');
    hourGroups.forEach(group => {
        const daysAttr = group.getAttribute('data-days');
        let shouldHighlight = false;
        
        if (daysAttr === 'mon-fri' && dayOfWeek >= 1 && dayOfWeek <= 5) {
            shouldHighlight = true;
        } else if (daysAttr === 'saturday' && dayOfWeek === 6) {
            shouldHighlight = true;
        } else if (daysAttr === 'sunday' && dayOfWeek === 0) {
            shouldHighlight = true;
        }
        
        if (shouldHighlight) {
            group.classList.add('today-highlight');
        }
    });
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .service-card, .gallery-item, .about-content, .contact-info {
            animation: fadeInUp 0.6s ease forwards;
        }
        
        .service-card:nth-child(1) { animation-delay: 0.1s; }
        .service-card:nth-child(2) { animation-delay: 0.2s; }
        .service-card:nth-child(3) { animation-delay: 0.3s; }
        .service-card:nth-child(4) { animation-delay: 0.4s; }
    `;
    document.head.appendChild(style);
});