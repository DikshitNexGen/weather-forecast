const searchBtn = document.getElementById('search-btn')
const apiKey = "6c35c0f8dd094b4cbe6160553240310"

function fetchWeatherData(city){
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`

    fetch(url)
        .then(response => {
            if(!response.ok){
                throw new Error("Network response was not ok " + response.statusText)
            }
            return response.json()
        })
        .then(data => console.log(data))
        .catch(err => console.log(err))
}

searchBtn.addEventListener("click", () => {
    const city = document.getElementById('city-name').value.trim()

    if(city){
        fetchWeatherData(city)
    }else{
        alert("Please enter a city name!")
    }
})