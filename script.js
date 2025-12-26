const prices = {
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
            currency: 'EUR'
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
        element.textContent = `${currencySymbol}${convertedBasicPrice.toFixed(2)} ${locationData.currency}`;
    });
    
    const priceStandardCHF = parseFloat(prices.standard);
    const convertedStandardPrice = priceStandardCHF * exchangeRate;
    const currencyStandardElements = document.querySelectorAll('.currency-text-standard');
    
    currencyStandardElements.forEach(element => {
        element.textContent = `${currencySymbol}${convertedStandardPrice.toFixed(2)} ${locationData.currency}`;
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    const body = document.body;
    
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    if (currentTheme === 'light') {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    } else {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
    
    themeToggle.addEventListener('click', function() {
        themeToggle.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            if (body.classList.contains('dark-mode')) {
                body.classList.remove('dark-mode');
                body.classList.add('light-mode');
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
                localStorage.setItem('theme', 'light');
            } else {
                body.classList.remove('light-mode');
                body.classList.add('dark-mode');
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
                localStorage.setItem('theme', 'dark');
            }
            
            themeToggle.style.transform = 'scale(1)';
        }, 150);
    });

    updateButtonTextWithCurrency();
});