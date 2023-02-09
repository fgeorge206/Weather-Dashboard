// Global variables and element selectors
const apiKey = "77eba3c9ab156265150188630611d486";
const unit = "imperial";
var currentDate = (new Date()).toLocaleDateString('en-US');
var inHistory = false;
var searchedCities = [];

const searchBtn = document.getElementById("search-btn");
const clearBtn = document.getElementById("clear-btn");
const cityEl = document.getElementById("city-name");
const tempEl = document.getElementById("temp");
const windEl = document.getElementById("wind");
const humidityEl = document.getElementById("humidity");
const historyList = document.getElementById("history-list");

// Displays history from local storage on load
displayHistory();

// Displays error if API returns a 404 error, otherwise gets weather information
function checkLocation(){
    var city = document.getElementById("city-input").value;
    var requestURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=" + unit + "&appid=" + apiKey;
    fetch(requestURL)
    .then(function(response){
        if (response.ok === true)
        {
            getWeather(city);
        }
        else
        {
            alert("Please enter a valid location.")
        }
    })
}

// function that gets current weather and 5 day forecast with optional parameter
function getWeather(city = document.getElementById("city-input").value){
    var cityInput = city
    // current weather API call
    var requestURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&units=" + unit + "&appid=" + apiKey;
    fetch(requestURL)
    .then(function(response){
        return response.json()
    })
    .then(function(data){
        // Display data to page
        var city = (data.name);
        var temperature = (data.main.temp);
        var wind = (data.wind.speed);
        var humidity = (data.main.humidity + "%");
        var icon = (data.weather[0].icon);
        var iconEl = document.createElement("img");
        cityEl.innerHTML = (city + " " + "(" + currentDate + ")");
        iconEl.setAttribute("src", "http://openweathermap.org/img/w/" + icon + ".png");
        cityEl.append(iconEl);
        tempEl.innerHTML = ("Temperature: " + temperature + "\u00B0");
        windEl.innerHTML = ("Wind: " + wind + " MPH");
        humidityEl.innerHTML = ("Humidity: " + humidity);

        
        // 5 day forecast API call
        requestURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=" + unit + "&appid=" + apiKey;
        fetch(requestURL)
        .then(function(response){
            return response.json()
        })
        .then(function(data){
            //Display data to page
            var forecastDays = document.querySelectorAll(".col");

            for (let i = 0; i < forecastDays.length; i++) {
                forecastDays[i].innerHTML = "";
                // forecastDataIndex ensures we get values from different days at the same time
                var forecastDataIndex = i * 8 + 4;

                var forecastDate = new Date();
                forecastDate.setDate(forecastDate.getDate() + (i+1));
                forecastDate = forecastDate.toLocaleDateString('en-US');

                var forecastDateEl = document.createElement("h3");
                forecastDateEl.textContent = forecastDate;
                forecastDays[i].append(forecastDateEl);

                var icon = data.list[forecastDataIndex].weather[0].icon;
                var forecastIconEl = document.createElement("img");
                forecastIconEl.setAttribute("src", "http://openweathermap.org/img/w/" + icon + ".png");
                forecastDays[i].append(forecastIconEl);


                var temperature = data.list[forecastDataIndex].main.temp;
                var forecastTempEl = document.createElement("p");
                forecastTempEl.textContent = ("Temperature: " + temperature + "\u00B0");
                forecastDays[i].append(forecastTempEl);

                var wind = data.list[forecastDataIndex].wind.speed;
                var forecastWindEl = document.createElement("p");
                forecastWindEl.textContent = ("Wind: " + wind + " MPH");
                forecastDays[i].append(forecastWindEl);

                var humidity = data.list[forecastDataIndex].main.humidity;
                var forecastHumidityEl = document.createElement("p");
                forecastHumidityEl.textContent = ("Humidity: " + humidity);
                forecastDays[i].append(forecastHumidityEl);

            }
        })
        // Function call for history button listener
        .then(function(){
            btnListener();
        })
    })
}

// Creates a button with a value of searched city
function createHistoryBtn(){
    var city = document.getElementById("city-input").value;
    var requestURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=" + unit + "&appid=" + apiKey;
    fetch(requestURL)
    // prevents button from being generated if invalid city
    .then(function(response){
        if (response.ok === true && !searchedCities.includes(city))
        {
            var historyBtn = document.createElement("btn");
            historyBtn.setAttribute("type", "button");
            historyBtn.setAttribute("class", "btn custom-btn mt-2 history");
            historyBtn.textContent = city;
            historyList.append(historyBtn);
        
            // Save to local storage
            saveHistory(city);     
        }
    })

}

// Button listener for history buttons in function since they are created dynamically
function btnListener(){
    var btns = document.querySelectorAll(".history");
    for (i of btns){
        i.addEventListener("click", weatherBtnHistory)
    }
}

// Redisplays weather for city on history button click
function weatherBtnHistory(event) {
    const buttonClicked = event.target;
    getWeather(buttonClicked.textContent);
}

// Retrieves searches and saves them to local storage
function saveHistory(city) {
    retrieveStoredHistory();
    searchedCities.push(city);
    localStorage.setItem("cities", JSON.stringify(searchedCities));
}

// Checks if history is null and adds searched cities to history
function retrieveStoredHistory(){
    var retrievedHistory = JSON.parse(localStorage.getItem("cities"));
    if (retrievedHistory != null && retrievedHistory.length > 0) {
        searchedCities = retrievedHistory;
    }
}

// Creates and displays history buttons from local storage
function displayHistory(){
    retrieveStoredHistory();
    searchedCities.forEach((item)=>{
        var historyBtn = document.createElement("btn");
        historyBtn.setAttribute("type", "button");
        historyBtn.setAttribute("class", "btn custom-btn mt-2 history");
        historyBtn.textContent = item;
        historyList.append(historyBtn);
    });
    btnListener();
}

// Clears local storage when button is clicked and removes history buttons
function clearHistory(){
    localStorage.clear();
    var historyBtns = document.querySelectorAll("#history-list");
    for (var i=0; item=historyBtns[i]; i++) {
        item.parentNode.removeChild(item);  
    }
}

// Runs error check and creates history button when search button is clicked
searchBtn.addEventListener('click',function(){
    checkLocation();
    createHistoryBtn();
});

// Event listener for clear history button
clearBtn.addEventListener('click', clearHistory);