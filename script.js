const prices = {
    "basichosting": "5",
    "customdomain": "8.73",
    "basic": "50",
    "standard": "80"
}

async function fetchCountryAndCurrency() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        return {
            country: data.country_name,
            currency: data.currency
        };
    } catch (error) {
        return {
            country: 'your location',
            currency: 'GBP'
        };
    }
}

async function getExchangeRate(userCurrency) {
    try {
        const response = await fetch(`https://api.frankfurter.dev/v1/latest?base=CHF&symbols=${userCurrency}`);
        const data = await response.json();
        return data.rates[userCurrency];
    } catch (error) {
        return 1;
    }
}

function getCurrencySymbol(currencyCode) {
    const symbols = {
        'USD': '$',
        'EUR': '€',
        'GBP': '£',
        'JPY': '¥',
        'CAD': 'CA$',
        'AUD': 'A$',
        'CNY': '¥',
        'INR': '₹'
    };
    return symbols[currencyCode] || '';
}

async function updateButtonTextWithCurrency() {
    const locationData = await fetchCountryAndCurrency();
    const exchangeRate = await getExchangeRate(locationData.currency);
    const currencySymbol = getCurrencySymbol(locationData.currency);

    const priceBasicCHF = parseFloat(prices.basic);
    const convertedBasicPrice = priceBasicCHF * exchangeRate;
    const currencyBasicElements = document.querySelectorAll('.currency-text-basic');

    currencyBasicElements.forEach(element => {
        element.textContent = `${currencySymbol}${Math.ceil(convertedBasicPrice).toFixed(2)} ${locationData.currency}`;
    });

    const priceStandardCHF = parseFloat(prices.standard);
    const convertedStandardPrice = priceStandardCHF * exchangeRate;
    const currencyStandardElements = document.querySelectorAll('.currency-text-standard');

    currencyStandardElements.forEach(element => {
        element.textContent = `${currencySymbol}${Math.ceil(convertedStandardPrice).toFixed(2)} ${locationData.currency}`;
    });

    const priceBasicHostingCHF = parseFloat(prices.basichosting);
    const convertedBasicHostingPrice = priceBasicHostingCHF * exchangeRate;
    const currencyBasicHostingElements = document.querySelectorAll('.currency-text-basichosting');

    currencyBasicHostingElements.forEach(element => {
        element.textContent = `${currencySymbol}${Math.ceil(convertedBasicHostingPrice).toFixed(2)} ${locationData.currency}`;
    });

    const priceCustomDomainCHF = parseFloat(prices.customdomain);
    const convertedCustomDomainPrice = priceCustomDomainCHF * exchangeRate;
    const currencyCustomDomainElements = document.querySelectorAll('.currency-text-customdomain');

    currencyCustomDomainElements.forEach(element => {
        element.textContent = `${currencySymbol}${Math.ceil(convertedCustomDomainPrice).toFixed(2)} ${locationData.currency}`;
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // ── Hamburger Menu ──

    const body = document.body;
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('main-nav');
    const backdrop = document.getElementById('nav-backdrop');

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

    // ── Header Shrink on Scroll ──

    const header = document.querySelector('header');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });

    // ── Scroll Animations with IntersectionObserver ──

    const animatedElements = document.querySelectorAll(
        '.example-card, .value-card, .package-card, .section-header, .contact-card'
    );

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(function(el) {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    } else {
        animatedElements.forEach(function(el) {
            el.classList.add('visible');
        });
    }

    // ── Currency ──

    updateButtonTextWithCurrency();
});
