$(document).ready(function() {
     var searchHistory = [];   
    // set current date in jumbotron
    var today = moment().format("dddd, MMMM Do");
    $("#currentDate").prepend(today);
    console.log(today);

    // Date for the 5 day forecast

    for (var i = 1; i <6; i++) {
        $(`#${i}Date`).text(moment().add(i, "d").format("dddd,MMMM Do"));

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
    });

    // click event search history
$(".searchHistoryEl").on("click", function (event) {
    event.preventDefault();
    let btnCityName = $(this).text();
    // call data from API
    call(btnCityName);

});


