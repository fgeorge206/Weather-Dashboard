const apiKey = "32e9f514274698b5e74947a390a7ff34"
var searchForm = document.querySelector("#search-city")
var searchTerm = document.querySelector("#search-term")
var searchCity = document.querySelector("#search-btn")
var renderCity = document.querySelector("#city-name")
var renderTemp = document.querySelector("#temp")
var renderWind = document.querySelector("#wind")
var renderHumid = document.querySelector("#humidity")
var renderIcon = document.querySelector("#icon")
var forecastData = document.querySelector("#five-day-forecast")

function searchWeatherApi(city){
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`).then(function(res){
        return res.json();
    }).then (function(data){
        renderResults(data)
    })
}

function renderResults(resultsData){
    console.log(resultsData)
    for (let i = 0; i < renderResults.length; i++) {
        const weatherIcon = resultsData.list[0].weather[0].icon;
        console.log(weatherIcon)
        renderCity.innerHTML = resultsData.city.name;
        // renderIcon.innerHTML = resultsData.weather[i].icon;
        renderTemp.innerHTML = `Temp: ${resultsData.list[i].main.temp}℉`;
        renderWind.innerHTML = `Wind: ${resultsData.list[i].wind.speed} MPH`;
        renderHumid.innerHTML = `Humidity: ${resultsData.list[i].main.humidity}%`;
        renderIcon.setAttribute('src', 'http://openweathermap.org/img/w/' + weatherIcon + '.png')
    }
}
// searchWeatherApi("seattle");
// searchWeatherApi("portland");

// for (let i = 0; i < renderResults.length; i++) {
//     const forecastData = renderResults[i];
//     console.log(forecastData)
// }

searchForm.addEventListener("submit",function(e){
    e.preventDefault();
    var termToSearch = searchTerm.value;
    searchWeatherApi(termToSearch)})