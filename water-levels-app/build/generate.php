<HTML>
<HEAD>
 <TITLE>MVC Water Levels</TITLE>
 





</HEAD>
<BODY>


<CENTER>
<TABLE BGCOLOR="#FFFFFF" BORDER=0 CELLPADDING="0" CELLSPACING="0" WIDTH=1050>
<TR><TD>
<CENTER><IMG SRC="../images/header2.jpg"></CENTER><BR>


          <CENTER><FONT FACE="arial" SIZE="4" COLOR="000099"><B>- Daily Result Lake Gauge Line Graph Option -</B></FONT></CENTER>

<p>

<CENTER>
<TABLE BORDER=1 CELLPADDING=10 CELLSPACING=0>
<TR VALIGN="top"><TD><CENTER><FONT FACE="arial" SIZE="3"><B>Select Lake Gauge</B></FONT></CENTER><BR>

<font face="arial" SIZE=2>
<form name="form1" method="post" action="data.php" onsubmit="return validateForm()">

<Center><select name="gauge">
 <option selected disabled>Select...</option>
 <optgroup label="Stream Gauges">
	<option value="Myers Cave flow">Myers Cave </option>
	<option value="Buckshot Creek flow">Buckshot Creek </option>
	<option value="Ferguson Falls flow">Ferguson Falls </option>
	<option value="Appleton flow">Appleton </option>
	<option value="Gordon Rapids flow">Gordon Rapids </option>
	<option value="Lanark Stream flow">Lanark </option>
	<option value="Mill of Kintail flow">Mill of Kintail </option>
	<option value="Kinburn flow">Kinburn </option>
	<option value="Bennett Lake outflow">Bennett Lake outflow </option>
	<option value="Dalhousie Lk outflow">Dalhousie Lake outflow     </option>
	<option value="High Falls Flow">High Falls Flow </option>
</optgroup>
<optgroup label="Daily Lake Gauges">
	 <option value="Shabomeka Lake">Shabomeka Lake </option>
	 <option value="Mazinaw Lake">Mazinaw Lake </option>
	 <option value="Kashwakamak Lake">Kashwakamak Lake </option>
	 <option value="Farm Lake">Farm Lake </option>
	 <option value="Mississagagon Lake">Mississagagon Lake</option>
	 <option value="Big Gull Lake">Big Gull Lake </option>
	 <option value="Crotch Lake">Crotch Lake </option>
	 <option value="Palmerston Lake">Palmerston Lake </option>
	 <option value="Canonto Lake">Canonto Lake </option>	 
	 <option value="Sharbot Lake">Sharbot Lake </option>
	 <option value="Bennett Lake">Bennett Lake </option>
	 <option value="Dalhousie Lake">Dalhousie Lake</option>
	 <option value="Lanark">Lanark</option>
	 <option value="Mississippi Lake">Mississippi Lake </option>
	 <option value="C.P. Dam">C.P. Dam</option>
	 <option value="Carp River at Maple Grove">Carp River at Maple Grove</option>
	 <option value="High Falls">High Falls </option>
</optgroup>
<optgroup label="Weekly Lake Gauges">
	<option value="Shabomeka Lake (weekly)">Shabomeka Lake </option>
	<option value="Mazinaw Lake (weekly)">Mazinaw Lake </option>
	<option value="Little Marble Lake (weekly)">Little Marble Lake </option>
	<option value="Mississagagon Lake (weekly)">Mississagagon Lake </option>
	<option value="Kashwakamak Lake (weekly)">Kashwakamak Lake </option>
	<option value="Farm Lake (weekly)">Farm Lake </option>
	<option value="Ardoch Bridge (weekly)">Ardoch Bridge </option>
	<option value="Buckshot Lake (weekly)">Buckshot Lake </option>
	<option value="Malcolm Lake (weekly)">Malcolm Lake </option>
	<option value="Pine Lake (weekly)">Pine Lake Lake </option>
	<option value="Big Gull Lake (weekly)">Big Gull Lake </option>
	<option value="Crotch Lake (weekly)">Crotch Lake </option>
	<option value="High Falls G.S. (weekly)">High Falls G.S. </option>
	<option value="Mosque Lake (weekly)">Mosque Lake </option>
	<option value="Palmerston Lake (weekly)">Palmerston Lake </option>
	<option value="Canonto Lake (weekly)">Canonto Lake </option>
	<option value="Bennett Lake">Bennett Lake </option>
	<option value="Dalhousie Lake">Dalhousie Lake </option>
	<option value="Silver Lake (weekly)">Silver Lake </option>
	<option value="Widow Lake (weekly)">Widow Lake </option>
	<option value="Lanark Dam (weekly)">Lanark Dam </option>
	<option value="C.P. Dam">C.P Dam </option>
	<option value="Almonte Bridge (weekly)">Almonte Bridge </option>
	<option value="Clayton Lake (weekly)">Clayton Lake (Ended Dec. 2016) </option>
</select></Center>

<br>

<font face="arial" SIZE=2 style="text-align: left">
<br><b>Start Date: <b/><input type="date" name="startdate" size="25" style="vertical-align: center" value='<? echo date("Y-m-d",strtotime('-2 week'));?>'><br>


<br><font face="arial" SIZE=2>
<br><b>End  Date:  <b/><input type="date" name="enddate" size="25" style="vertical-align: center"><br></font>

<script>

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

document.form1.enddate.value=displayfirst+"-"+displaysecond+"-"+displaythird
</script>

<script>
function validateForm() {
    var x = document.forms["form1"]["gauge"].value;
    if (x == "Select...") {
        alert("Please select a gauge");
        return false;
    }else if(document.forms["form1"]["startdate"].value > document.forms["form1"]["enddate"].value || document.forms["form1"]["startdate"].value==null || document.forms["form1"]["enddate"].value==null){
		alert("Please select valid dates");
		return false;
	}else if(document.forms["form1"]["gauge"].value =="Clayton Lake (weekly)"){
		document.forms["form1"]["enddate"].value==date_create("2016-12-31 23:59:59",timezone_open("America/Toronto"));
		return false;
	}
}
</script>

<br>

<input type="radio" name="type" value="table" checked> Table<br>
<input type="radio" name="type" value="graph"> Graph<br>

<br><br><br><br><br><br><br><br><br><br><br><br><br>


<center><input type="submit" name="submit"></center></br>

<center><form><INPUT Type="button" VALUE="Back" onClick="history.go(-1);return true;"></form></center>

</TD><TD>

<IMG SRC="../images/gauge-map.jpg"><br><br>



</TD></TR></TABLE>


<br>
<br>

</p>
</form>
</TD></TR></TABLE>
</center>

</BODY>
</HTML>
