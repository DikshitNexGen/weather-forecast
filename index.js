const searchBtn = document.getElementById("search-btn");
const currentLocationBtn = document.getElementById("current-location-btn");
const apiKey = "6c35c0f8dd094b4cbe6160553240310";
const cityInput = document.getElementById("city-name");

function renderCurrentDayData(data) {
    const currentDay = document.getElementById("current-day");
    currentDay.innerHTML = "";

    const currentDayIn = document.createElement("div");
    currentDay.innerHTML = `
    <div class="flex flex-col justify-center items-center">
        <img class="h-[120px]"src="https:${data?.current?.condition?.icon}"/>
        <p class="text-lg">${data?.current?.condition?.text}</p>
    </div>
    <div>
        <p class="text-xl">Today</p>
        <h2 class="text-3xl font-bold mb-4">${data?.location?.name}, ${data?.location?.region}</h2>
        <p class="text-lg text-gray-700">Temperature: ${data?.current?.temp_c}</p>
        <p class="text-lg text-gray-700">Wind: ${data?.current?.wind_kph} km/h</p>
        <p class="text-lg text-gray-700">Humidity: ${data?.current?.humidity}%</p>
    </div>`;

    currentDay.appendChild(currentDayIn);
}

function renderForecastData(data) {
    const forecastWrapper = document.getElementById("day-wrapper");
    forecastWrapper.innerHTML = "";

    const forecastArr = data?.forecast?.forecastday
        .map((ele, index) => {
            if (index === 0) return;

            return ` 
        <div class="shadow-2xl rounded-2xl p-6 w-[200px] font-medium">
            <p >(${ele.date})</p>
            <img class="mb-2 h-[100px]" src="https:${ele?.day?.condition?.icon}"/>
            <p>Temp: ${ele?.day?.avgtemp_c}</p>
            <p>Wind: ${ele?.day?.maxwind_kph} km/h</p>
            <p>Humidity: ${ele?.day?.avghumidity}%</p>
        </div>
        `;
        })
        .join("");
    forecastWrapper.innerHTML = forecastArr;
}

function fetchWeatherData(city) {
    const forecastUrl = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=6&aqi=no&alerts=no`;

    fetch(forecastUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok " + response.statusText);
            }
            return response.json();
        })
        .then((data) => {
            console.log(data);
            renderCurrentDayData(data);
            renderForecastData(data);
        })
        .catch((err) => alert("Enter valid city name!"));
}

function successCallback(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    if (latitude && longitude) {
        const latLong = latitude + "," + longitude;
        fetchWeatherData(latLong);
        cityInput.value = "";
    } else {
        alert("Unable to get current location!");
    }
}

function errorCallback(error) {
    console.log("Error", error.message);
}

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();

    if (city) {
        fetchWeatherData(city);
    } else {
        alert("Please enter a city name!");
    }
});

cityInput.addEventListener("keydown", (e) => {
    if (cityInput.value.trim() && e.key === "Enter") {
        fetchWeatherData(cityInput.value.trim());
    } else if (cityInput.value.trim() === "" && e.key === "Enter") {
        alert("Please enter a city name!");
    }
});

currentLocationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
        alert("Geo Location is not supported.");
    }
});

fetchWeatherData("Gurgaon");
