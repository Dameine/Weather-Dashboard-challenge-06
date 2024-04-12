const cityEL = document.getElementById('enterCity');
const searchElBtn = document.getElementById('searchBtn');
const cityNameEl = document.getElementById('city-name');
const currentImgEl = document.getElementById('currentImg');
const tempertureEl = document.getElementById('temperature');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('windSpeed');
const uvIndexEl = document.getElementById('uvIndex');
const fiveDayEl = document.getElementById('fiveDay');
const clearBtn = document.getElementById('clearBtn');

//API key 
const apiKey = "04ae9c4cbc72a2242c64da4e9fbf1705";

function getWeather(cityName) {

    //current day weather url
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apiKey}`;

    //fetching current weather data
    fetch(url)
    .then(function(response){
        return response.json();
    })
    .then(function(data){

        //current date
        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();

        //insert into html
        cityNameEl.textContent = `${data.name} ${month}/${day}/${year}`;
        currentImgEl.setAttribute("src", `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`);
        tempertureEl.textContent = `Temperture: ${data.main.temp} °F`;
        humidityEl.textContent = `Humidity: ${data.main.humidity}%`;
        windSpeedEl.textContent = `Wind Speed: ${data.wind.speed} MPH`;
        console.log(data);

        //lat and lon coodrinates
        const lat = data.coord.lat
        const lon = data.coord.lon

        getFiveDay(lat, lon);
    })

}

function getFiveDay(lat, lon) {
    //clear pervious 5 day cards
    $("#fiveDay").empty();

    //5 day weather url
    const fiveDayUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    //fetching 5 day weather data
    fetch(fiveDayUrl)
    .then(function(response5){
        return response5.json();
    })
    .then(function(data5){
        console.log(data5);

        for (let i = 1; i < 41; i+=8) {
            const fiveDayArray = {
                date: data5.list[i].dt,
                pic: data5.list[i].weather[0].icon,
                temp: data5.list[i].main.temp,
                humidity: data5.list[i].main.humidity
            }
            console.log(fiveDayArray.date);
            

            //format date
            const unixTimestamp = fiveDayArray.date;
            const formattedDate = new Date(unixTimestamp * 1000);
            // console.log(formattedDate);
            const mm = String(formattedDate.getMonth() + 1).padStart(2, '0');
            const dd = String(formattedDate.getDate()).padStart(2, '0');
            const yyyy = formattedDate.getFullYear();
            const formattedDates = `${mm}/${dd}/${yyyy}`;
            console.log(dd);

            //weather picture
            const picUrl = `<img src = "http://openweathermap.org/img/wn/${fiveDayArray.pic}.png">`;

            const fiveDayCard = 
            $(`<div class="card" style="width: 15rem;">
                 <div class="card-body">
                    <h5>${formattedDates}</h5>
                    <p>${picUrl}</p>
                    <p>Temperature: ${fiveDayArray.temp}°F </p>
                    <p>Humidity: ${fiveDayArray.humidity}% </p>
                </div>
            </div>`);

            $("#fiveDay").append(fiveDayCard);
        }

    })

}

//add to local storage functon
function addToLocalStorage (cityName) {
    if (typeof(Storage) !== "undefined") {
        let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
        searchHistory.push(cityName);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    }
}

function displaySearchHistory() {
    // Retrieve search history array from local storage
    const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

    // Get the search-history list element
    const searchHistoryLi = document.getElementById('search-history');

    //Clear searchHistoryLi
    searchHistoryLi.innerHTML = '';

    //display search history
    for (let i = 0; i < searchHistory.length; i++) {
        const searchItem = document.createElement("input");
        searchItem.setAttribute("type", "text");
        searchItem.setAttribute("type", "text");
        searchItem.setAttribute("readonly", true);
        searchItem.setAttribute("class", "form-control d-block bg-white");
        searchItem.setAttribute("value", searchHistory[i]);
        searchItem.addEventListener("click", function () {
          getWeather(searchItem.value);
        })
        searchHistoryLi.append(searchItem);
    }

}


//search button
searchElBtn.addEventListener("click",function(){
    const cityValue = cityEL.value.trim();
    if (cityValue){
        addToLocalStorage(cityValue);
        getWeather(cityValue);
        displaySearchHistory();
    } else{
        alert('Enter in a city name.');
    }

})

clearBtn.addEventListener("click", function(){
    localStorage.clear();
    displaySearchHistory();
})