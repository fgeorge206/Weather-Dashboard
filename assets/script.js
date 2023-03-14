const apiKey = "32e9f514274698b5e74947a390a7ff34"
var searchForm = document.querySelector("#search-city")
var searchTerm = document.querySelector("#search-term")
var searchCity = document.querySelector("#search-btn")
var renderCity = document.querySelector("#city-name")
var renderTemp = document.querySelector("#temp")
var renderWind = document.querySelector("#wind")
var renderHumid = document.querySelector("#humidity")
var renderIcon = document.querySelector("#icon")
var renderDate = document.querySelector("#date")
var forecastData = document.querySelector("#five-day-forecast")

function searchWeatherApi(city){
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`).then(function(res){
        return res.json();
    }).then (function(data){
        renderResults(data)
    })
}

function renderResults(resultsData){
    // console.log(resultsData)
    const weatherIcon = resultsData.list[0].weather[0].icon;
    var unixFormat = dayjs.unix(resultsData.list[0].dt).format('MMMM D, YYYY');

    renderCity.innerHTML = resultsData.city.name;
    renderTemp.innerHTML = `Temp: ${resultsData.list[0].main.temp}℉`;
    renderWind.innerHTML = `Wind: ${resultsData.list[0].wind.speed} MPH`;
    renderHumid.innerHTML = `Humidity: ${resultsData.list[0].main.humidity}%`;
    renderDate.innerHTML =  unixFormat
    renderIcon.setAttribute('src', 'http://openweathermap.org/img/w/' + weatherIcon + '.png')
}



function renderForcast(city){
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`).then(function(res){
        return res.json();
    }).then ((data)=>{
        console.log(data)
        for (let i = 7; i < data.list.length; i = i+8) {
            var daysFormat = dayjs.unix(data.list[i].dt).format('MMMM D, YYYY');
            var fiDayIcon = data.list[i].weather[0].icon;
            var fiveDayInfo = document.createElement("div");
            fiveDayInfo.setAttribute("class","card col m-2");
            fiveDayInfo.innerHTML = 
            `
                <p> ${daysFormat} </p>
                <img src="http://openweathermap.org/img/w/${fiDayIcon}.png" width="50" height "50"/>
                <p> Temp: ${data.list[i].main.temp}℉ </p>
                <p> Wind: ${data.list[i].wind.speed} MPH </p>
                <p> Humidity: ${data.list[i].main.humidity}% </p>
            `
            forecastData.append(fiveDayInfo);
        }
    })
}




searchForm.addEventListener("submit",function(e){
    e.preventDefault();
    var termToSearch = searchTerm.value;
    forecastData.innerHTML = "";
    searchWeatherApi(termToSearch);
    renderForcast(termToSearch)
    
    var localCity = []
    if(localStorage.getItem('localCity') == null){
        localCity.push(termToSearch)
        localStorage.setItem('localCity',JSON.stringify(localCity))
        
    }else{ 
        localCity = JSON.parse(localStorage.getItem('localCity')).slice()
        console.log(localCity)
        if(!localCity.includes(termToSearch)){
            localCity.push(termToSearch)
            savedCities(termToSearch)
        }
        localStorage.setItem("localCity",JSON.stringify(localCity))
    }
})

function onLoad(){
    if(localStorage.getItem('localCity') != null){
        var localCity = JSON.parse(localStorage.getItem('localCity')).slice()
        for (let i = 0; i < localCity.length; i++) {
            savedCities(localCity[i])
        }
    }
}

function savedCities(city){
    var citybtn = document.createElement("button")
    citybtn.addEventListener("click",function(e){
        e.preventDefault();
        forecastData.innerHTML = "";
        searchWeatherApi(city);
        renderForcast(city)
        
    })
    document.getElementById("history-list").prepend(citybtn);
    citybtn.textContent = city;
    citybtn.setAttribute("class","btn custom-btn")
} 

onLoad();