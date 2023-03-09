const apiKey = "32e9f514274698b5e74947a390a7ff34"
var searchForm = document.querySelector("#search-city")
var searchTerm = document.querySelector("#search-term")
var searchCity = document.querySelector("#search-btn")
var renderCity = document.querySelector("#city-name")
var renderTemp = document.querySelector("#temp")
var renderWind = document.querySelector("#wind")
var renderHumid = document.querySelector("#humidity")

function searchWeatherApi(city){
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`).then(function(res){
        return res.json();
    }).then (function(data){
        renderResults(data)
    })
}

function renderResults(resultsData){
    console.log("inside of renderResults")
    console.log(resultsData)
    renderCity.innerHTML = resultsData.name;
    renderTemp.innerHTML = resultsData.main.temp;
    renderWind.innerHTML = resultsData.wind.speed;
    renderHumid.innerHTML = resultsData.main.humidity;
}

searchForm.addEventListener("submit",function(e){
    e.preventDefault();
    var termToSearch = searchTerm.value;
    searchWeatherApi(termToSearch)})