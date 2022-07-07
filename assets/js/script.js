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
    // if city is not null
    if (city) {
        getWeather(city);
        cities.unshift({city});
        cityInputEl.value = "";
    } else {
        alert("Please enter a city!");
    }
    saveSearchHistory();
    createHistoryButtons(city);
});

prevSearchEl.addEventListener("click", function(event) {
    var city = event.target.getAttribute("history-city");
    if(city){
        getWeather(city);
    }
});