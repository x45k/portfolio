async function fetchCountryAndCurrency() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        return { country: data.country_name, currency: data.currency };
    } catch (error) {
        return { country: 'your location', currency: 'GBP' };
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
        'USD': '$', 'EUR': '\u20ac', 'GBP': '\u00a3',
        'JPY': '\u00a5', 'CAD': 'CA$', 'AUD': 'A$',
        'CNY': '\u00a5', 'INR': '\u20b9'
    };
    return symbols[currencyCode] || '';
}

function formatPrice(chfAmount, exchangeRate, currencySymbol, currencyCode) {
    const converted = chfAmount * exchangeRate;
    return `${currencySymbol}${Math.ceil(converted).toFixed(2)} ${currencyCode}`;
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

            const featuresHtml = pkg.features.map(function(f) {
                var text = replacePlaceholders(f.text, data.pricesCHF, exchangeRate, currencySymbol, locationData.currency);
                var icon = f.included ? 'fa-check' : 'fa-times';
                var cls = f.included ? '' : ' class="not-included"';
                return '<li' + cls + '><i class="fas ' + icon + '"></i> ' + text + '</li>';
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
                    '<a href="#contact" class="btn btn-primary btn-block">Get Started</a>' +
                '</div>'
            );
        }).join('');

        container.innerHTML = html;

        observeNewCards();
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

document.addEventListener('DOMContentLoaded', function() {
    // ── Hamburger Menu ──

    var body = document.body;
    var hamburger = document.getElementById('hamburger');
    var nav = document.getElementById('main-nav');
    var backdrop = document.getElementById('nav-backdrop');

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

    // ── Scroll Animations ──

    var staticElements = document.querySelectorAll(
        '.example-card, .value-card, .section-header, .contact-card'
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

    // ── Packages (fetched from JSON) ──

    fetchPackages();
});
