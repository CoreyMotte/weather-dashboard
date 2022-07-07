var cities = [];

var searchFormEl = document.getElementById('search-form');
var cityInputEl = document.getElementById('city');
var currentResultEl = document.getElementById('current-search-container');

var prevSearchEl = document.getElementById('previous-search-elements');
var currentSearchEl = document.getElementById('current-search');

var apiKey = "335c0c4e60cb6c9ae9deab5a5c9ce481";

var saveSearchHistory = function () {

};

var getWeather = function (city) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    fetch(apiUrl)
        .then(function (response) {
            response.json().then(function(data){
                displayWeather(city, data);
            });
        });

};

var displayWeather = function (search, weather) {
    console.log(search, weather);
};

var getUvIndex = function () {

};

searchFormEl.addEventListener("submit", function(event) {
    event.preventDefault();
    var city = cityInputEl.value.trim();
    if (city) {
        getWeather(city);
    } else {
        alert("Please enter a city!");
    }
});