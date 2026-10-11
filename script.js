
const API_KEY = "PASTE_YOUR_OPENWEATHERMAP_API_KEY_HERE";

const cityForm = document.getElementById("cityForm");
const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");
const message = document.getElementById("message");
const weatherCard = document.getElementById("weatherCard");

cityForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (city === "") {
        showMessage("Please enter a city name.", true);
        return;
    }

    if (API_KEY === "PASTE_YOUR_OPENWEATHERMAP_API_KEY_HERE") {
        showMessage("Please add your OpenWeatherMap API key in script.js.", true);
        return;
    }

    searchButton.disabled = true;
    searchButton.textContent = "Loading...";
    weatherCard.hidden = true;

    showMessage("Fetching weather information...", false);

    try {
        const url =
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("City not found. Check the spelling.");
            }

            if (response.status === 401) {
                throw new Error("Invalid API key. Please check your key.");
            }

            throw new Error("Unable to get weather information. Try again.");
        }

        const data = await response.json();

        // Display the weather information
        document.getElementById("cityName").textContent =
            `${data.name}, ${data.sys.country}`;

        document.getElementById("temperature").textContent =
            `${Math.round(data.main.temp)} °C`;

        document.getElementById("description").textContent =
            data.weather[0].description;

        document.getElementById("feelsLike").textContent =
            `${Math.round(data.main.feels_like)} °C`;

        document.getElementById("humidity").textContent =
            `${data.main.humidity}%`;

        document.getElementById("windSpeed").textContent =
            `${data.wind.speed} m/s`;

        const icon = document.getElementById("weatherIcon");
        icon.src =
            `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        icon.alt = data.weather[0].description;

        weatherCard.hidden = false;
        showMessage("Weather information loaded successfully.", false);

    } catch (error) {
        showMessage(error.message, true);

    } finally {
        searchButton.disabled = false;
        searchButton.textContent = "Get Weather";
    }
});

function showMessage(text, isError) {
    message.textContent = text;
    message.className = isError ? "message-error" : "message-success";
}
