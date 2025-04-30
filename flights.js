flights.js
document.addEventListener('DOMContentLoaded', function() {
    // Domestic cities (India)
    const domesticCities = ['delhi', 'jaipur', 'chennai', 'kolkata', 'mumbai'];
    
    // Price ranges
    const domesticPriceRange = { min: 2000, max: 10000 };
    const internationalPriceRange = { min: 15000, max: 50000 };
    
    // Business class multiplier
    const businessClassMultiplier = 2.5;

    // Tab switching functionality
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const returnGroup = document.querySelector('.return-group');
            if (this.dataset.tab === 'one-way') {
                returnGroup.style.display = 'none';
                document.getElementById('return-date').value = '';
            } else {
                returnGroup.style.display = 'block';
            }
        });
    });

    // Initialize with one-way selected
    document.querySelector('.return-group').style.display = 'none';

    // Swap from/to locations
    const swapBtn = document.querySelector('.swap-btn');
    swapBtn.addEventListener('click', function() {
        const fromSelect = document.getElementById('from-city');
        const toSelect = document.getElementById('to-city');
        const temp = fromSelect.value;
        fromSelect.value = toSelect.value;
        toSelect.value = temp;
    });

    // Form submission
    const flightSearchForm = document.getElementById('flight-search-form');
    flightSearchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fromCity = document.getElementById('from-city').value;
        const toCity = document.getElementById('to-city').value;
        const departureDate = document.getElementById('departure-date').value;
        const returnDate = document.getElementById('return-date').value;
        const travellersClass = document.getElementById('travellers-class').value;
        
        // Validate form
        if (!fromCity || !toCity) {
            alert('Please select both departure and arrival cities');
            return;
        }
        
        if (fromCity === toCity) {
            alert('Departure and arrival cities cannot be the same');
            return;
        }
        
        if (!departureDate) {
            alert('Please select a departure date');
            return;
        }
        
        if (document.querySelector('.tab.active').dataset.tab === 'round-trip' && !returnDate) {
            alert('Please select a return date for round trips');
            return;
        }
        
        // Show results
        showFlightResults(fromCity, toCity, departureDate, returnDate, travellersClass);
    });

    // Function to show flight results
    function showFlightResults(fromCity, toCity, departureDate, returnDate, travellersClass) {
        document.querySelector('.flight-booking-container').classList.add('hidden');
        
        const resultsContainer = document.querySelector('.flight-results-container');
        resultsContainer.classList.remove('hidden');
        
        // Set city names
        const fromCityName = document.getElementById('from-city').options[document.getElementById('from-city').selectedIndex].text.split(',')[0];
        const toCityName = document.getElementById('to-city').options[document.getElementById('to-city').selectedIndex].text.split(',')[0];
        
        document.getElementById('from-city-result').textContent = fromCityName;
        document.getElementById('to-city-result').textContent = toCityName;
        
        // Generate date options
        generateDateOptions(departureDate, returnDate);
        
        // Generate flights
        generateFlights(fromCity, toCity, travellersClass);
    }

    // Generate date options with prices
    function generateDateOptions(depDate, retDate) {
        const dateSelector = document.querySelector('.date-selector');
        dateSelector.innerHTML = '';
        
        const isInternational = !(domesticCities.includes(document.getElementById('from-city').value) || !(domesticCities.includes(document.getElementById('to-city').value)));
        
        // Generate 7 days of options starting from departure date
        const startDate = new Date(depDate);
        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            
            const dateOption = document.createElement('div');
            dateOption.className = 'date-option' + (i === 0 ? ' selected' : '');
            
            const day = currentDate.toLocaleDateString('en-US', { weekday: 'short' });
            const date = currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            // Generate random price based on route type
            const priceRange = isInternational ? internationalPriceRange : domesticPriceRange;
            const price = Math.floor(Math.random() * (priceRange.max - priceRange.min + 1)) + priceRange.min;
            
            dateOption.innerHTML = `
                <div class="day">${day}</div>
                <div class="date">${date}</div>
                <div class="price">₹${price.toLocaleString('en-IN')}</div>
            `;
            
            dateOption.addEventListener('click', function() {
                document.querySelectorAll('.date-option').forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                // In real app, would filter flights by selected date
            });
            
            dateSelector.appendChild(dateOption);
        }
    }

    // Generate flight listings
    function generateFlights(fromCity, toCity, travellersClass) {
        const flightListings = document.querySelector('.flight-listings');
        flightListings.innerHTML = '';
        
        const isInternational = !(domesticCities.includes(fromCity)) || !(domesticCities.includes(toCity));
        const priceRange = isInternational ? internationalPriceRange : domesticPriceRange;
        
        // Sample airlines
        const airlines = [
            { name: 'IndiGo', code: '6E', icon: 'fas fa-plane', color: '#004080' },
            { name: 'Air India', code: 'AI', icon: 'fas fa-plane', color: '#FF0000' },
            { name: 'Vistara', code: 'UK', icon: 'fas fa-plane', color: '#800080' },
            { name: isInternational ? 'Emirates' : 'SpiceJet', code: isInternational ? 'EK' : 'SG', icon: 'fas fa-plane', color: isInternational ? '#D71921' : '#FF8C00' }
        ];
        
        // Generate 3-5 random flights
        const flightCount = Math.floor(Math.random() * 3) + 3;
        for (let i = 0; i < flightCount; i++) {
            const airline = airlines[Math.floor(Math.random() * airlines.length)];
            const flightNumber = `${airline.code} ${Math.floor(Math.random() * 900) + 100}`;
            
            // Generate random departure time (6am-10pm)
            const hour = Math.floor(Math.random() * 17) + 6;
            const minute = Math.floor(Math.random() * 12) * 5;
            const departureTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            
            // Calculate arrival time (1-5 hours later)
            const durationHours = isInternational ? 
                Math.floor(Math.random() * 5) + 8 : // 8-12 hours for international
                Math.floor(Math.random() * 2) + 1;  // 1-2 hours for domestic
            
            const arrivalHour = (hour + durationHours) % 24;
            const arrivalTime = `${arrivalHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            
            // Calculate price
            const basePrice = Math.floor(Math.random() * (priceRange.max - priceRange.min + 1)) + priceRange.min;
            const isBusiness = travellersClass.includes('business');
            const finalPrice = isBusiness ? Math.round(basePrice * businessClassMultiplier) : basePrice;
            
            // Create flight card
            const flightCard = document.createElement('div');
            flightCard.className = 'flight-card';
            flightCard.innerHTML = `
                <div class="flight-header">
                    <div class="airline-info">
                        <div class="airline-logo" style="background-color: ${airline.color}">
                            <i class="${airline.icon}" style="color: white"></i>
                        </div>
                        <div>
                            <div class="airline-name">${airline.name}</div>
                            <div class="flight-duration">${durationHours}h ${minute}m</div>
                        </div>
                    </div>
                    <div class="flight-price">₹${finalPrice.toLocaleString('en-IN')}</div>
                </div>
                <div class="flight-details">
                    <div class="departure-arrival">
                        <div>
                            <div class="time">${departureTime}</div>
                            <div class="airport-code">${document.getElementById('from-city').options[document.getElementById('from-city').selectedIndex].text.split(',')[1].trim()}</div>
                        </div>
                        <div class="flight-stops">Non-stop</div>
                        <div>
                            <div class="time">${arrivalTime}</div>
                            <div class="airport-code">${document.getElementById('to-city').options[document.getElementById('to-city').selectedIndex].text.split(',')[1].trim()}</div>
                        </div>
                    </div>
                </div>
                <div class="flight-actions">
                    <div class="rewards">${isInternational ? 'Earn ' + Math.floor(finalPrice/1000) + ' reward points' : 'Free meal included'}</div>
                    <button class="book-btn">Book Now</button>
                </div>
            `;
            
            flightCard.querySelector('.book-btn').addEventListener('click', function() {
                // Redirect to book.html when clicked
                window.location.href = 'book.html';
            });
            
            flightListings.appendChild(flightCard);
        }
    }

    // Cookie consent
    const acceptCookiesBtn = document.querySelector('.accept-cookies');
    acceptCookiesBtn.addEventListener('click', function() {
        document.querySelector('.cookie-consent').style.display = 'none';
    });

    // Initialize date picker with tomorrow's date as default
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('departure-date').valueAsDate = tomorrow;
});
