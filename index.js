const searchBtn = document.getElementById("search-btn");
const currentLocationBtn = document.getElementById("current-location-btn");
const apiKey = "6c35c0f8dd094b4cbe6160553240310";
const cityInput = document.getElementById("city-name");
const dropdown = document.getElementById("dropdown");
let recentlySearched = [];

// checking whether we have recently searched fields or not
if (localStorage.getItem("recently")) {
    recentlySearched = JSON.parse(localStorage.getItem("recently"));
}

function fillInput(ele) {
    cityInput.value = ele;
}

// rendering the current day weather data
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

// rendering the 5 days forecast weather data
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

// using weatherApi for fetching the weather data of particular city
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
            renderCurrentDayData(data);
            renderForecastData(data);
        })
        .catch((err) => alert("Enter valid city name!"));
}

// successCallback function for getting user's current location
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

// errorCallback if unable to get user's current location
function errorCallback(error) {
    console.log("Error", error.message);
    alert("Unable to get current location!");
}

// search button eventListner for displaying weather data
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();

    if (city) {
        if (!recentlySearched.includes(city)) {
            recentlySearched.push(city);
            localStorage.setItem("recently", JSON.stringify(recentlySearched));
        }
        fetchWeatherData(city);
    } else {
        alert("Please enter a city name!");
    }
});

// ENTER key press functionality for displaying weather data
cityInput.addEventListener("keydown", (e) => {
    const city = cityInput.value.trim();

    if (city && e.key === "Enter") {
        if (!recentlySearched.includes(city)) {
            recentlySearched.push(city);
            localStorage.setItem("recently", JSON.stringify(recentlySearched));
        }
        fetchWeatherData(city);
    } else if (city === "" && e.key === "Enter") {
        alert("Please enter a city name!");
    }
});

// dropdown opens up when user clicks on the city input field
cityInput.addEventListener("focus", () => {
    if (recentlySearched?.length > 0) {
        const da = recentlySearched
            .map((ele) => `<li class="cursor-pointer hover:text-black active:scale-90">${ele}</li>`)
            .join("");
        dropdown.innerHTML = `<ul>${da}</ul>`;
        dropdown.classList.remove("hidden");
    }
});

dropdown.addEventListener("click", (event) => {
    const li = event.target.closest("li");
    if (li) {
        const cityName = li.textContent;
        fillInput(cityName);
        // dropdown.classList.add("hidden");
    }
});

// preventing the event
dropdown.addEventListener("mousedown", (event) => {
    event.preventDefault();
});

// hiding the dropdown if user is not focusing on the input field
cityInput.addEventListener("blur", () => {
    dropdown.classList.add("hidden");
});

// getting user's current location
currentLocationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
        alert("Geo Location is not supported.");
    }
});

fetchWeatherData("Gurgaon");
