var cities = [];

var searchFormEl = document.getElementById('search-form');
var cityInputEl = document.getElementById('city');
var currentResultEl = document.getElementById('current-search-container');

var prevSearchEl = document.getElementById('previous-search-elements');
var currentSearchEl = document.getElementById('current-search');

var fiveDayContainerEl = document.getElementById('five-day-container');
var fiveDayForecastEl = document.getElementById('forecast');

var apiKey = "335c0c4e60cb6c9ae9deab5a5c9ce481";

var saveSearchHistory = function () {
    localStorage.setItem("search-history", JSON.stringify(cities));
};

var createHistoryButtons = function (previousSearch) {
    var lastSearchEl = document.createElement("button");
    lastSearchEl.textContent = previousSearch;
    lastSearchEl.classList = "w-100 btn-light border pb-2";
    lastSearchEl.setAttribute("history-city", previousSearch);
    lastSearchEl.setAttribute("type", "submit");

    prevSearchEl.prepend(lastSearchEl);
}

var getWeather = function (city) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    fetch(apiUrl)
        .then(function (response) {
            response.json().then(function (data) {
                displayWeather(city, data);
            });
        });

};

var displayWeather = function (search, weather) {

    // clear current displayed results
    currentSearchEl.textContent = "";
    currentSearchEl.textContent = capitalizeLetter(search);

    console.log(weather);

    // generate elements for current search
    var todaysDate = document.createElement("span")
    todaysDate.textContent = " on " + moment(weather.dt.value).format("MMM D, YYYY");
    currentSearchEl.appendChild(todaysDate);

    var weatherIcon = document.createElement("img");
    weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
    currentSearchEl.appendChild(weatherIcon);

    var tempEl = document.createElement("span");
    var humidityEl = document.createElement("span");
    var windEl = document.createElement("span");

    tempEl.textContent = "Temp: " + weather.main.temp + " °F";
    tempEl.classList = "list-group-item";
    currentResultEl.appendChild(tempEl);

    humidityEl.textContent = "Humidity: " + weather.main.humidity + "%";
    humidityEl.classList = "list-group-item";
    currentResultEl.appendChild(humidityEl);

    windEl.textContent = "Wind Speed: " + weather.wind.speed + "MPH";
    windEl.classList = "list-group-item";
    currentResultEl.appendChild(windEl);

    var lat = weather.coord.lat;
    var lon = weather.coord.lon;

    getUvIndex(lat, lon);


};

var getUvIndex = function (lat, lon) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`;
    fetch(apiUrl)
        .then(function (response) {
            response.json().then(function (data) {
                displayUv(data);
            });
        });
};

var displayUv = function (uvIndex) {
    var indexEl = document.createElement("div");
    indexEl.textContent = "UV Index: ";
    indexEl.classList = "list-group-item";

    var indexVal = document.createElement("span");
    indexVal.textContent = uvIndex.value;

    indexEl.appendChild(indexVal);
    currentResultEl.appendChild(indexEl);
}

function capitalizeLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

var getFiveDayForecast = function (city) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;
    fetch(apiUrl)
        .then(function (response) {
            response.json().then(function (data) {
                displayFiveDayForecast(data);
            });
        });
}

var displayFiveDayForecast = function (weather) {
    // clear previous results
    fiveDayContainerEl.textContent = "";
    fiveDayForecastEl.textContent = "Five Day Forecast:";

    // display results in console to help decipher which properties to take
    console.log(weather);

    var forecast = weather.list;
    for (var i = 5; i < forecast.length; i = i + 8) {
        
        var dailyForecast = forecast[i];

        var cardEl = document.createElement("div");
        cardEl.classList = "card bg-dark text-light m-2";
        
        var forecastDay = document.createElement("h4");
        var weatherIcon = document.createElement("img");
        var forecastTemp = document.createElement("span");
        var forecastHumidity = document.createElement("span");

        forecastDay.textContent = moment.unix(dailyForecast.dt).format("MMM D, YYYY");
        forecastDay.classList = "card-header text-center";
        cardEl.appendChild(forecastDay);

        weatherIcon.classList = "card-body text-center";
        weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);
        cardEl.appendChild(weatherIcon);

        forecastTemp.classList = "card-body text-center";
        forecastTemp.textContent = dailyForecast.main.temp + " °F";
        cardEl.appendChild(forecastTemp);

        forecastHumidity.classList = "card-body text-center";
        forecastHumidity.textContent = dailyForecast.main.humidity + "%";
        cardEl.appendChild(forecastHumidity);

        fiveDayContainerEl.appendChild(cardEl);

        // console.log('firing once');
 
    }

}

searchFormEl.addEventListener("submit", function (event) {
    event.preventDefault();
    var city = cityInputEl.value.trim();
    // if city is not null
    if (city) {
        getWeather(city);
        getFiveDayForecast(city);
        cities.unshift({ city });
        cityInputEl.value = "";
    } else {
        alert("Please enter a city!");
    }
    saveSearchHistory();
    createHistoryButtons(city);
});

prevSearchEl.addEventListener("click", function (event) {
    var city = event.target.getAttribute("history-city");
    if (city) {
        getWeather(city);
        getFiveDayForecast(city);
    }
});