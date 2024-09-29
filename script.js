// Initialize the map and set the view
const map = L.map('map').setView([20.5937, 78.9629], 5);

// Add the tile layer from OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Handle map click event to fetch weather data
map.on('click', function(e) {
    const lat = e.latlng.lat;
    const lon = e.latlng.lng;
    fetchWeatherData(lat, lon);
});

// Handle search button click to fetch location coordinates
document.getElementById('search-btn').addEventListener('click', function() {
    const location = document.getElementById('search-box').value;
    if (location) {
        fetchLocationCoordinates(location);
    } else {
        alert('Please enter a location to search');
    }
});

// Fetch location coordinates using geocoding API
function fetchLocationCoordinates(location) {
    const apiKey = '3f55e9ae24e94bce93a5e3ed1a3a49c4'; // Geocoding API key
    const geocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${apiKey}`;

    fetch(geocodeUrl)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                const lat = data.results[0].geometry.lat;
                const lon = data.results[0].geometry.lng;
                fetchWeatherData(lat, lon);
                map.setView([lat, lon], 10); // Move map to searched location
            } else {
                alert('Location not found');
            }
        })
        .catch(error => {
            console.error('Error fetching location coordinates:', error);
            alert('Failed to fetch location data. Please try again.');
        });
}

// Fetch weather data from OpenWeatherMap API
function fetchWeatherData(lat, lon) {
    const apiKey = '63c58cce2d1d491aaf024071b7c06395'; // OpenWeatherMap API key
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            document.getElementById('location-name').textContent = data.name || 'Unknown location';
            document.getElementById('temp-value').textContent = data.main.temp ? `${data.main.temp} °C` : '--';
            document.getElementById('condition-value').textContent = data.weather[0] ? data.weather[0].description : '--';
            document.getElementById('feels-like').textContent = data.main.feels_like ? `${data.main.feels_like} °C` : '--';
            document.getElementById('pressure').textContent = data.main.pressure ? `${data.main.pressure} hPa` : '--';
        })
        .catch(error => console.error('Error fetching weather data:', error));
}
