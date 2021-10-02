$(document).ready(function() {
     var searchHistory = [];  

    // set current date in jumbotron
    const today = moment().format("dddd, MMMM Do");
    $("#currentDate").prepend(today);
    console.log(today);


    // Date for the 5 day forecast

    for (var i = 1; i <6; i++) {
        $(`#${i}Date`).text(moment().add(i, "d").format("dddd,MMMM Do"));
    }    
    // event listeners

    // Submit event on secrch form
    $("form").on("submit"), function(event){
        event.preventDefault();
        let city = $("input").val();
        if (city === "") {
            return;
        }
        // Call data from API 
        call();
        // 
    }

    // click event search history
$(".searchHistoryEl").on("click"), function (event) {
    event.preventDefault();
    let btnCityName = $(this).text();
    // call data from API
    call(btnCityName);

}});

// Create buttons for cities that have been searched.
const renderButton = () => {
    $(".searchHistoryEL").html("");
    for (var j = 0; j < searchHistory.length; j++) {
        let cityName1 = searchHistory[j];
        let historyBtn = $('<button type="button" class="btn btn-primary bt-lg btn-block historyBtn">').text(btnCityName);
        $('.searchHistoryEL').prepend(historyBtn);
    }
};

// Gets loacal storage for search history array
constinit = () => {
    let savedCities = JSON.parse(localStorage.getITEM("searchHistory"));
    if (savedCities !==null) {
        searchHistory = savedCities;
    }

    // render buttons
    renderButton()
};

// Add searched city to local storage
const storeCities = () =>
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

// --------------
// API calls for weather data
// --------------

// API call for UV index and color coding
const uvCall = (lon, lat) => {
    $.ajax({
        url: uvQueryURL,
        method: "GET",
    }).then(function(uvResponse) {
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
