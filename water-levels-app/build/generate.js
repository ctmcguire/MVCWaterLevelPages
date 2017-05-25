var mydate=new Date()
var theyear=mydate.getYear()
if (theyear < 1000)
	theyear+=1900
var theday=mydate.getDay()
var themonth=mydate.getMonth()+1
if (themonth<10)
	themonth="0"+themonth
var theday=mydate.getDate()
if (theday<10)
	theday="0"+theday

//////EDIT below three variable to customize the format of the date/////

var displayfirst=theyear
var displaysecond=themonth
var displaythird=theday

////////////////////////////////////

//document.form1.enddate.value=displayfirst+"-"+displaysecond+"-"+displaythird
document.getElementById('enddate').value = displayfirst+"-"+displaysecond+"-"+displaythird;
function validateForm() {
	var form1 = document.forms["form1"];

	if(form1["gauge"].value == "Select...") {
		alert("Please select a gauge");
		return false;
	}
	if(form1["startdate"].value > form1["enddate"].value
	  || form1["startdate"].value==null
	  || form1["enddate"].value==null
	){
		alert("Please select valid dates");
		return false;
	}
	if(form1["gauge"].value =="Clayton Lake (weekly)") {
		form1["enddate"].value==date_create("2016-12-31 23:59:59",timezone_open("America/Toronto"));
		return false;
	}
}