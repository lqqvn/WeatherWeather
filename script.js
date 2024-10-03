const apiKey = '9e1bc3267aa20da05a1a8f03bb6c2fb5'; // Replace with your OpenWeatherMap API key

document.getElementById('search-btn').addEventListener('click', getWeather);
document.getElementById('city-input').addEventListener('input', showSuggestions);

function getWeather() {
    const city = document.getElementById('city-input').value;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            document.getElementById('weather-info').innerText = error.message;
            clearSuggestions(); // Clear suggestions on error here !
        });
}

function displayWeather(data) {
    const weatherInfo = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p>Weather: ${data.weather[0].description}</p>
        <p>Temperature: ${data.main.temp} °C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;
    document.getElementById('weather-info').innerHTML = weatherInfo;
    clearSuggestions(); // Clear suggestions after searching
}

function showSuggestions() {
    const input = document.getElementById('city-input').value;

    // Clear previous suggestions
    clearSuggestions();

    if (input.length < 2) return; // Only show suggestions if at least 2 characters

    // Fetch city suggestions based on input
    const url = `https://api.openweathermap.org/data/2.5/find?q=${input}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const suggestionsContainer = document.getElementById('suggestions');

            data.list.forEach(city => {
                const suggestionItem = document.createElement('div');
                suggestionItem.innerText = `${city.name}, ${city.sys.country}`;
                suggestionItem.addEventListener('click', () => {
                    document.getElementById('city-input').value = city.name;
                    getWeather(); 
                });
                suggestionsContainer.appendChild(suggestionItem);
            });

            if (suggestionsContainer.children.length === 0) {
                suggestionsContainer.innerHTML = '<div>No suggestions found</div>';
            }
        })
        .catch(error => {
            console.error('Error fetching suggestions:', error);
        });
}

function clearSuggestions() {
    document.getElementById('suggestions').innerHTML = ''; 
}
