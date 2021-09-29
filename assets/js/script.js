// set current date in jumbotron
var today = moment().format("dddd, MMMM Do");
$("#currentDate").prepend(today);
console.log(today);

// Date for the 5 day forecast

for (var i = 1; i <6; i++) {
    $(`#${i}Date`).text(moment().add(i, "d").format("dddd,MMMM Do"));
}