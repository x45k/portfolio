const LOCATION_CACHE_KEY = 'location_data';
const LOCATION_CACHE_EXPIRY_MS = 60 * 60 * 1000;

async function fetchCountryAndCurrency() {
    const cachedRaw = localStorage.getItem(LOCATION_CACHE_KEY);
    if (cachedRaw) {
        try {
            const cached = JSON.parse(cachedRaw);
            const now = Date.now();
            if (now - cached.timestamp < LOCATION_CACHE_EXPIRY_MS) {
                return cached.data;
            }
        } catch (e) {
        }
    }

    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const result = { country: data.country_name, currency: data.currency };

        localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify({
            data: result,
            timestamp: Date.now()
        }));

        return result;
    } catch (error) {
        return { country: 'your location', currency: 'GBP' };
    }
}

async function getExchangeRate(userCurrency) {
    if (userCurrency != 'GBP') {
        try {
            const response = await fetch(`https://api.frankfurter.dev/v1/latest?base=GBP&symbols=${userCurrency}`);
            const data = await response.json();
            return data.rates[userCurrency];
        } catch (error) {
            return 1;
        }
    } else {
        return 1
    }
}

function getCurrencySymbol(currencyCode) {
    const symbols = {
        'USD': '$', 'EUR': '\u20ac', 'GBP': '\u00a3',
        'JPY': '\u00a5', 'CAD': 'CA$', 'AUD': 'A$',
        'CNY': '\u00a5', 'INR': '\u20b9'
    };
    return symbols[currencyCode] || '';
}

function formatPrice(chfAmount, exchangeRate, currencySymbol, currencyCode) {
    const converted = chfAmount * exchangeRate;
    const roundedTo99 = Math.round(converted + 0.01) - 0.01;
    return `${currencySymbol}${roundedTo99.toFixed(2)} ${currencyCode}`;
}

function replacePlaceholders(text, pricesCHF, exchangeRate, currencySymbol, currencyCode) {
    return text.replace(/\{\{(\w+)\}\}/g, function(_, key) {
        if (pricesCHF[key] !== undefined) {
            return formatPrice(pricesCHF[key], exchangeRate, currencySymbol, currencyCode);
        }
        return `{{${key}}}`;
    });
}

async function fetchPackages() {
    const container = document.getElementById('packages-container');
    if (!container) return;

    try {
        const [jsonResponse, locationData] = await Promise.all([
            fetch('./packages.json'),
            fetchCountryAndCurrency()
        ]);

        const data = await jsonResponse.json();
        const exchangeRate = await getExchangeRate(locationData.currency);
        const currencySymbol = getCurrencySymbol(locationData.currency);

        const html = data.packages.map(function(pkg) {
            const priceStr = formatPrice(
                data.pricesCHF[pkg.priceKey],
                exchangeRate, currencySymbol, locationData.currency
            );

            var checkSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
            var xSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>';

            const featuresHtml = pkg.features.map(function(f) {
                var text = replacePlaceholders(f.text, data.pricesCHF, exchangeRate, currencySymbol, locationData.currency);
                var icon = f.included ? checkSvg : xSvg;
                var cls = f.included ? '' : ' class="not-included"';
                return '<li' + cls + '><span class="feature-icon">' + icon + '</span> ' + text + '</li>';
            }).join('');

            var popularClass = pkg.popular ? ' popular' : '';
            var badgeHtml = pkg.popular ? '<div class="package-badge">Most Popular</div>' : '';

            return (
                '<div class="package-card' + popularClass + '">' +
                    badgeHtml +
                    '<h3>' + pkg.name + '</h3>' +
                    '<div class="package-price">' + (pkg.pricePrefix || '') + priceStr + '</div>' +
                    '<p class="package-description">' + pkg.description + '</p>' +
                    '<ul class="package-features">' + featuresHtml + '</ul>' +
                    '<a href="#" data-section="contact" class="btn btn-primary btn-block">Get Started</a>' +
                '</div>'
            );
        }).join('');

        container.innerHTML = html;

        observeNewCards();
        attachScrollLinks();
    } catch (error) {
        container.innerHTML = '<div class="loading-packages">Failed to load packages. Please refresh.</div>';
    }
}

function observeNewCards() {
    var cards = document.querySelectorAll('.package-card');
    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        cards.forEach(function(el) {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    } else {
        cards.forEach(function(el) {
            el.classList.add('visible');
        });
    }
}

function scrollToSection(sectionId) {
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

function attachScrollLinks() {
    const scrollLinks = document.querySelectorAll('[data-section]');
    scrollLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            if (sectionId) {
                scrollToSection(sectionId);
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    var body = document.body;
    var hamburger = document.getElementById('hamburger');
    var nav = document.getElementById('main-nav');
    var backdrop = document.getElementById('nav-backdrop');
    var header = document.querySelector('header');

    function closeNav() {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
        backdrop.classList.remove('active');
        body.classList.remove('nav-open');
    }

    function openNav() {
        hamburger.classList.add('active');
        nav.classList.add('active');
        backdrop.classList.add('active');
        body.classList.add('nav-open');
    }

    hamburger.addEventListener('click', function() {
        if (nav.classList.contains('active')) {
            closeNav();
        } else {
            openNav();
        }
    });

    backdrop.addEventListener('click', closeNav);

    document.querySelectorAll('nav a').forEach(function(link) {
        link.addEventListener('click', closeNav);
    });

    var staticElements = document.querySelectorAll(
        '.portfolio-card, .section-header, .contact-card'
    );

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        staticElements.forEach(function(el) {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    } else {
        staticElements.forEach(function(el) {
            el.classList.add('visible');
        });
    }

    var lastScrollY = window.scrollY;
    var ticking = false;
    var backToTop = document.querySelector('.back-to-top');

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                var currentY = window.scrollY;
                if (nav.classList.contains('active')) {
                    ticking = false;
                    return;
                }
                if (currentY > 100 && currentY > lastScrollY) {
                    header.classList.add('header--hidden');
                } else {
                    header.classList.remove('header--hidden');
                }

                if (backToTop) {
                    if (currentY > 400) {
                        backToTop.classList.add('visible');
                    } else {
                        backToTop.classList.remove('visible');
                    }
                }

                lastScrollY = currentY;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    attachScrollLinks();
    fetchPackages();
});
