$(document).ready(function() {
     var searchHistory = [];  

    // set current date in jumbotron
    const today = moment().format("dddd, MMMM Do");
    $(".currentDate").prepend(today);
    
    console.log(today);


    // Date for the 5 day forecast

    for (var i = 1; i <6; i++) {
        $(`#${i}Date`).text(moment().add(i, "d").format("dddd,MMMM Do"));
    }    
    // event listeners

    // Submit event on secrch form
    $("form").on("submit", function(event){
        event.preventDefault();
        let city = $("input").val();
        if (city === "") {
            return;
        }
        // Call data from API 
        call();

        $('form')[0].reset();
    });
    
    // Click event for search history buttons
    $('.prevSearchEl').on('click', '.historyBtn', function (event) {
        event.preventDefault();
        let btnCityName = $(this).text();
        call(btnCityName);
    });

//     // click event search history
//     $(".prevSearchEl").on("click"), function (event) {
//         event.preventDefault();
//         let btnCityName = $(this).text();
//         // call data from API
//         call(btnCityName);

// });


    // Clear button for history
    $('#clearBtn').on('click', function (event) {
        event.preventDefault();
        window.localStorage.clear();
        $('.prevSearchEl').empty();
        prevSerch = [];
        renderButtons();
        $('form')[0].reset();
    });

// Create buttons for cities that have been searched.
const renderButtons = () => {
    $(".prevSearchEl").html("");
    for (var j = 0; j < searchHistory.length; j++) {
        let cityName1 = searchHistory[j];
        let historyBtn = $('<button type="button" class="btn btn-primary bt-lg btn-block historyBtn">').text(cityName1);
        $('.prevSearchEL').prepend(historyBtn);
    }
};

// Gets loacal storage for search history array
const init = () => {
    let savedCities = JSON.parse(localStorage.getItem("searchHistory"));
    if (savedCities !== null) {
        searchHistory = savedCities;
    }

    // render buttons
    renderButtons();
};

init();

// Add searched city to local storage
const storeCities = () =>
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

// --------------
// API calls for weather data
// --------------

// API call for UV index and color coding
const uvCall = (lon, lat) => {
    let uvQueryURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&units=metric&appid=fc4d1d2def1bebc7c47b15a5044ff21e`;
    $.ajax({
        url: uvQueryURL,
        method: "GET",
    }).then(function (uvResponse) {
        $('#uvData').html(`${uvResponse.value}`);
        if (uvResponse.value <= 2) {
            $('.uvRow').css('background-color', 'green');
        } else if (uvResponse.value >2 && uvResponse.value <=5) {
            $('.uvRow').css('background-color', 'yellow');
        } else if (uvResponse.value >5 && uvResponse.value <=7) {
            $('.uvRow').css('background-color', 'orange');
        } else if (uvResponse.value >7 && uvResponse.value <=10) {
            $('.uvRow').css('background-color', 'red');
        } else {
            $('.uvRow').css('background-color', 'violet')
        }
    });
};

// Call for 5 day forecast
const fiveDay = (lon, lat) => {
    let fiveQueryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&units=metric&appid=fc4d1d2def1bebc7c47b15a5044ff21e`;

    $.ajax({
        url: fiveQueryURL,
        method: 'GET',
    }).then(function (fiveResponse) {
        for (var k = 1; k < 6; k++) {
            $(`#${k}img`).attr(
                'src',
                `http://openweathermap.org/img/wn/${fiveResponse.daily[k].weather[0].icon}@2x.png`
            );
            $(`#${k}temp`).html(
                `Temp: ${fiveResponse.daily[k].temp.day} &#8457;`
            );
            $(`#${k}humid`).html(
                `Humidity: ${fiveResponse.daily[k].humidity}%`
            );
        }
    });
};

// API call for current day stats from search bar or history button
const call = (btnCityName) => {
    let cityName = btnCityName || $('input').val();
    let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=fc4d1d2def1bebc7c47b15a5044ff21e`;
    $.ajax({
        url: queryURL,
        method: "GET",
    })
    .then(function(response) {
        if (!btnCityName) {
            searchHistory.unshift(cityName);
            storeCities();
            renderButtons();
        }
        var lon = response.coord.lon;
        var lat = response.coord.lat;
        $('#cityName').text(response.name);
        $('#currentImg').attr(
            'scr',
            `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`
        );
        $('#tempData').html(`${response.main.temp} &#8457`);
        $('#humidityData').html(`${response.main.humidity}%`);
        $('#windData').html(`${response.wind.speed}kph`);
        $('#windArrow').css({
            transform: `rotate(${response.wind.deg}deg)`,
        });
        uvCall(lon, lat);
        fiveDay(lon, lat);
    })
        .catch(function (error) {
            alert("Enter a valid city");
        });
    };

    call(searchHistory[0]);

});