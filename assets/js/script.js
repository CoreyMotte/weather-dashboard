var cities = [];

var searchFormEl = document.getElementById('search-form');
var cityInputEl = document.getElementById('city');
var currentResultEl = document.getElementById('current-search-container');

var prevSearchEl = document.getElementById('previous-search-elements');
var currentSearchEl = document.getElementById('current-search');

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
    tempEl.textContent = "Temp: " + weather.main.temp + " °F";
    tempEl.classList = "list-group-item";
    currentResultEl.appendChild(tempEl);

    var humidityEl = document.createElement("span");
    humidityEl.textContent = "Humidity: " + weather.main.humidity + "%";
    humidityEl.classList = "list-group-item";
    currentResultEl.appendChild(humidityEl);

    var windEl = document.createElement("span");
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
                console.log(data);
            });
        });
};

function capitalizeLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

searchFormEl.addEventListener("submit", function (event) {
    event.preventDefault();
    var city = cityInputEl.value.trim();
    // if city is not null
    if (city) {
        getWeather(city);
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
    }
});