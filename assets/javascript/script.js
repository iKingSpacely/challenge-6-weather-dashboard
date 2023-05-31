var searchForm = document.querySelector('#search-form')
var searchInput = document.querySelector('#search-input')
var todayWeather = document.querySelector('#today') 
const apiKey = "0c6fffe0f25abe24ecc6f2cbd320965e"
   

function renderData(name, data) {
    var currentDay = dayjs().format('M/DD/YYYY');
    var cityName = data.name;
    var icon = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    var conditions = data.weather[0].description;
    var temp = parseInt(1.8*(data.main.temp-273) + 32);
    var humidity = data.main.humidity;
    var windSpeed =  data.wind.speed;
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
    windSpeedD.textContent = `Wind Speed: ${windSpeed}`
    humidityD.textContent = `Humidity: ${humidity}`

    header.append(image);
    cardBody.append(header, tempD, windSpeedD, humidityD);
    todayWeather.innerHTML = '';
    todayWeather.append(cardBody);

};

function currentWeather(data) {
    var lat = data.lat;
    var lon = data.lon;
    var name = data.name;

    var apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(apiURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            renderData(name, data)
            
        })
}


function getLatLon(event) {
    event.preventDefault();

    var limit = 5;
    var search = searchInput.value.trim();
    var apiURL = `http://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=${limit}&appid=${apiKey}`

    fetch(apiURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data[0]);
            currentWeather(data[0]);
            
        })
};






searchForm.addEventListener('submit', getLatLon);

