var searchForm = document.querySelector('#search-form');
var searchInput = document.querySelector('#search-input');
var todayWeather = document.querySelector('#today');
var dailyForecast = document.querySelector('#fiver');
var searchContainer = document.querySelector("#search-history");

var searchHistory = [];

const apiKey = "0c6fffe0f25abe24ecc6f2cbd320965e"
   

function renderData(name, data) {
    var currentDay = dayjs().format('M/DD/YYYY');
    var cityName = data.name;
    var icon = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    var conditions = data.weather[0].description;
    var temp = parseInt(1.8*(data.main.temp-273) + 32);
    var humidity = data.main.humidity;
    var windSpeed =  data.wind.speed;
    // var timeZone = data.city.timezone;
    var image = document.createElement('img');
    var cardBody = document.createElement('div');
    var header = document.createElement('h3');
    var p = document.createElement('p');
    var card = document.createElement('div');
    var tempD = document.createElement('p');
    var humidityD = document.createElement('p');
    var windSpeedD = document.createElement('p');

    cardBody.setAttribute("class", "card-body");
    header.setAttribute("class", "header");
    p.setAttribute("class", "card-text");
    card.setAttribute("class", "card" );
    image.setAttribute("class", "icon");
    image.setAttribute("src", icon);
    image.setAttribute("alt", conditions);
    tempD.setAttribute("class", "card-text");
    humidityD.setAttribute("class", "card-text");
    windSpeedD.setAttribute("class", "card-text");
    
    header.textContent = `${cityName} ${currentDay}`
    tempD.textContent = `F: ${temp}`
    windSpeedD.textContent = `Wind Speed: ${windSpeed}mph`
    humidityD.textContent = `Humidity: ${humidity}%`

    header.append(image);
    cardBody.append(header, tempD, windSpeedD, humidityD);
    todayWeather.innerHTML = '';
    todayWeather.append(cardBody);

};

function filterFiveDay(list) {

dailyForecast.innerHTML = '';

    var dayOne = dayjs().add(1, 'day').startOf('day').unix();
    var dayFive = dayjs().add(6, 'day').startOf('day').unix();
    // console.table([{"dayOne" : dayOne}, {"dayFive": dayFive}]);



    for (let index = 0; index < list.length; index++) {
        var test = list[index].dt


        if (list[index].dt >= dayOne && list[index].dt <= dayFive) {

            if (list[index].dt_txt.slice(11,13) == "06"){
                // console.log(test);
                console.log(list[index]);
                renderFiveDay(list[index]);
            }; 
      
        };
        
    };

};

function currentWeather(data) {
    var lat = data.lat;
    var lon = data.lon;
    var name = data.name;

    var apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

    fetch(apiURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // console.log(data);
            renderData(name, data)
            
        });
};

function forecast(data) {
    var lat = data.lat;
    var lon = data.lon;

    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

    fetch(apiURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // console.log(data);
            filterFiveDay(data.list)
            
        });
};

function getLatLon(search) {

    var limit = 5;
    
    var apiURL = `http://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=${limit}&appid=${apiKey}`


    fetch(apiURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            setSearchHistory(search);
            // console.log(data[0]);
            currentWeather(data[0]);
            forecast(data[0]);
            
        })
};

function renderFiveDay(list) {
    var temp = list.main.temp;
    // console.log(temp);
    var humidity = list.main.humidity;
    var windSpeed = list.wind.speed;
    var description = list.weather[0].description;
    var icon = `https://openweathermap.org/img/w/${list.weather[0].icon}.png`;
    var date = list.dt_txt.slice(0, 10)
    // console.log(date);

    var image = document.createElement('img');
    var column = document.createElement('div')
    var cardContainer = document.createElement('div');
    var cardBody = document.createElement('div');
    var header = document.createElement('h3');
    var card = document.createElement('div');
    var tempD = document.createElement('p');
    var humidityD = document.createElement('p');
    var windSpeedD = document.createElement('p');

    column.append(cardContainer)
    cardContainer.append(cardBody);
    cardBody.append(date, image, tempD, windSpeedD, humidityD);


    column.setAttribute("class", 'col-sm');
    cardContainer.setAttribute("class", "card p-6");
    cardBody.setAttribute("class", "card-body");
    header.setAttribute("class", "header");
    card.setAttribute("class", "card" );
    image.setAttribute("src", icon);
    image.setAttribute("alt", description);
    tempD.setAttribute("class", "card-text");
    humidityD.setAttribute("class", "card-text");
    windSpeedD.setAttribute("class", "card-text");
    
    header.textContent = dayjs(date).format('M/DD/YYYY');
    tempD.textContent = `F: ${temp}`
    windSpeedD.textContent = `Wind Speed: ${windSpeed}`
    humidityD.textContent = `Humidity: ${humidity}%`

    dailyForecast.append(column);
    
};

function handleSearchSubmit(event) {

    if (!searchInput) {
        alert('please input a value');
    };
        event.preventDefault();
        var search = searchInput.value.trim();
        getLatLon(search);
        searchInput.value = '';
};

function clickHistory(event) {
    var button = event.target;
    var search = button.getAttribute("data-search");

    getLatLon(search);
};


function getSearchHistory() {
    var getLocal = localStorage.getItem("city")

    if (getLocal) {
        searchHistory = JSON.parse(getLocal);
        
    };
    searchStorage();
};

function searchStorage() {

    searchContainer.innerHTML = '';

    for (let index = 0; index < searchHistory.length; index++) {
        var button = document.createElement('button')
        button.setAttribute("data-search", searchHistory[index]);
        button.setAttribute("type", "button");
        button.setAttribute('aria-controls', "forecast")
        button.textContent = searchHistory[index];
        searchContainer.append(button);
    };
};

function setSearchHistory(search) {


    // if (searchHistory.indexOf(search) == -1) {
    //     return;
    // };

    searchHistory.push(search);
    localStorage.setItem("city", JSON.stringify(searchHistory));
    searchStorage();
    // console.log(searchHistory);

};

getSearchHistory();

searchForm.addEventListener('submit', handleSearchSubmit);

searchContainer.addEventListener('click', clickHistory);

