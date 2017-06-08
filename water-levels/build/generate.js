var mydate=new Date();

//var day=mydate.getDay();
var day=mydate.getDate();
var month=mydate.getMonth() + 1;//getMonth returns 0-11, and we want 1-12; therefore, we add 1 to the returned value
var year=mydate.getYear();

if (year < 1000)
	year += 1900;
if (month < 10)
	month = "0" + month;
if (day<10)
	day = "0" + day;

//////EDIT below three variable to customize the format of the date/////

var displayfirst=year;
var displaysecond=month;
var displaythird=day;

////////////////////////////////////

//document.form1.enddate.value=displayfirst+"-"+displaysecond+"-"+displaythird
document.getElementById('enddate').value = year + "-" + month + "-" + day;//Regardless of the format it displays, date inputs always store their value as yyyy-mm-dd

function validateForm() {
	var form1 = document.forms["form1"];//Get the form with the name "form1" and store it in a variable to prevent stupid long lines of code

	if(form1["gauge"].value == "Select...") {
		alert("Please select a gauge");
		return false;
	}
	if(form1["startdate"].value > form1["enddate"].value || form1["startdate"].value==null || form1["enddate"].value==null) {
		alert("Please select valid dates");
		return false;
	}
	if(form1["gauge"].value =="Clayton Lake (weekly)") {
		form1["enddate"].value==date_create("2016-12-31 23:59:59",timezone_open("America/Toronto"));
		return false;
	}

	return true;//If we get here, everything is a-ok!  Although there are probably better ways to prevent invalid inputs
}