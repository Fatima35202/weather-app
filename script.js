async function searchWeather() {
    const city = document.getElementById('cityInput').value;
    const apiKey = 'eb60673632e9917a458098f0c690abed';
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        // Fetch current weather data
        const currentResponse = await fetch(currentWeatherUrl);
        const currentData = await currentResponse.json();

        // Fetch forecast data
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();

        // Extract necessary weather data from the responses
        const currentWeather = {
            name: currentData.name,
            temperature: currentData.main.temp,
            description: currentData.weather[0].description,
            icon: currentData.weather[0].icon
        };

        const dailyForecast = forecastData.list.filter(item => item.dt_txt.includes('12:00:00')).map(item => ({
            date: new Date(item.dt * 1000),
            temperature: item.main.temp,
            description: item.weather[0].description,
            icon: item.weather[0].icon
        }));

        const hourlyForecast = forecastData.list.filter((item, index) => {
            // Filter hourly forecast for the next five hours
            const currentTime = new Date().getTime();
            const forecastTime = new Date(item.dt_txt).getTime();
            return (forecastTime - currentTime > 0) && (forecastTime - currentTime <= 5 * 60 * 60 * 1000);
        }).map(item => ({
            date: new Date(item.dt * 1000),
            temperature: item.main.temp,
            description: item.weather[0].description,
            icon: item.weather[0].icon
        }));

        // Display current weather
        displayCurrentWeather(currentWeather);

        // Display daily forecast
        displayDailyForecast(dailyForecast);

        // Display hourly forecast
        displayHourlyForecast(hourlyForecast);

        // Update background color based on temperature
        updateBackgroundColor(currentWeather.temperature);

    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

async function compareWeather() {
    const cities = document.querySelectorAll('.cityInput');
    const apiKey = 'eb60673632e9917a458098f0c690abed';
    const comparisonInfo = document.getElementById('comparisonInfo');
    comparisonInfo.innerHTML = '';

    try {
        for (const cityInput of cities) {
            const city = cityInput.value;
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            const temperature = data.main.temp;
            const cityName = data.name;

            const cityInfo = document.createElement('div');
            cityInfo.innerHTML = `<p>${cityName}: ${temperature}°C</p>`;
            comparisonInfo.appendChild(cityInfo);
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function updateBackground(temperature) {
    let color = '';
    let imageUrl = '';

    if (temperature > 30) {
        color = 'red';
        imageUrl = 'url(path_to_hot_image)';
    } else if (temperature > 20) {
        color = 'orange';
        imageUrl = 'url(path_to_warm_image)';
    } else {
        color = 'blue';
        imageUrl = 'url(path_to_cold_image)';
    }

    document.body.style.backgroundColor = color;
    document.body.style.backgroundImage = imageUrl;
}


function displayCurrentWeather(weather) {
    document.getElementById('weatherInfo').innerHTML = `
        <h2>${weather.name}</h2>
        <img class="weather-icon" src="icons/${weather.icon}.png" alt="${weather.description}">
        <p>Temperature: ${weather.temperature}°C</p>
        <p>Description: ${weather.description}</p>
    `;
}

function displayDailyForecast(forecast) {
    const forecastContainer = document.getElementById('forecastInfo');
    forecastContainer.innerHTML = '';

    forecast.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.classList.add('forecast-day');
        dayElement.innerHTML = `
            <h3>${day.date.toLocaleDateString('en-US', { weekday: 'long' })}</h3>
            <img class="weather-icon" src="icons/${day.icon}.png" alt="${day.description}">
            <p>Temperature: ${day.temperature}°C</p>
            <p>Description: ${day.description}</p>
        `;
        forecastContainer.appendChild(dayElement);
    });
}

function displayHourlyForecast(forecast) {
    const forecastContainer = document.getElementById('hourlyForecastInfo');
    forecastContainer.innerHTML = '';

    forecast.forEach(hour => {
        const hourElement = document.createElement('div');
        hourElement.classList.add('hourly-forecast-item');
        hourElement.innerHTML = `
            <p>${hour.date.toLocaleTimeString('en-US')}</p>
            <img class="weather-icon" src="icons/${hour.icon}.png" alt="${hour.description}">
            <p>Temperature: ${hour.temperature}°C</p>
            <p>Description: ${hour.description}</p>
        `;
        forecastContainer.appendChild(hourElement);
    });
}
