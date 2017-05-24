<HTML>
<HEAD>
 <TITLE>MVC Watershed - At a Glance</TITLE>
</HEAD>
<BODY>
<?

 mysql_connect("localhost","mvconc55_levels1","4z9!yA");
 mysql_select_db("mvconc55_mvclevels");



 echo '<BR><BR><table ALIGN="center" BORDER=1 CELLPADDING=8> 
      <TR><TD COLSPAN=5><CENTER><IMG SRC="http://mvc.on.ca/water-levels-app/images/header2.jpg"></CENTER></TD></TR>
            <!--<TR><TD COLSPAN=5><a href="javascript:history.back();"><font face="Arial" color="#000080"><img border="0" src="back.jpg" width="66" height="28" ALT="Back" TITLE="Back"></font></a></TD></TR>-->
      <TR><TD COLSPAN=5 ALIGN="center"><FONT FACE="arial" SIZE="4" COLOR="000099"><B>STREAM GAUGES</B></FONT></TD></TR>
      <TR><TD><FONT FACE="arial" SIZE="2"><B>GAUGE LOCATION</B></FONT></TD><TD><FONT FACE="arial" SIZE="2"><B>DATE</B></FONT></TD><TD><FONT FACE="arial" SIZE="2"><B>FLOW (cms)</B></FONT></TD><TD><FONT FACE="arial" SIZE="2"><B>HISTORICAL AVG. (cms)</B></FONT></TD><TD><FONT FACE="arial" SIZE="2"><B>PRECIPITATION (mm)</B></FONT></TD></TR>
            ';

// Myers Cave
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='Myers Cave flow' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

 while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

 echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['precipitation'] .'</FONT></TD></TR>';
 }

} else {

echo 'query didnt work';
}

     mysql_free_result($result);
// End gauge


//Buckshot

$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='Buckshot Creek flow' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

 while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

 echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['precipitation'] .'</FONT></TD></TR>';
 }

 } else {

echo 'query didnt work';
}

     mysql_free_result($result);
// End gauge


// Ferguson Falls
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='Ferguson Falls flow' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

 while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

 echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['precipitation'] .'</FONT></TD></TR>';
 }

 } else {

echo 'query didnt work';
}

     mysql_free_result($result);
// End gauge



// Appleton
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='Appleton flow' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

 while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

 echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['precipitation'] .'</FONT></TD></TR>';
 }

 } else {

echo 'query didnt work';
}

     mysql_free_result($result);
// End gauge





// Gordon Rapids
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='Gordon Rapids flow' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

 while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

 echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['precipitation'] .'</FONT></TD></TR>';
 }

 } else {

echo 'query didnt work';
}

     mysql_free_result($result);
// End gauge




// Lanark stream
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='Lanark Stream flow' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

 while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

 echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['precipitation'] .'</FONT></TD></TR>';
 }

 } else {

echo 'query didnt work';
}

     mysql_free_result($result);
// End gauge




// Mill of Kintail
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='Mill of Kintail flow' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

 while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

 echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['precipitation'] .'</FONT></TD></TR>';
 }

 } else {

echo 'query didnt work';
}

     mysql_free_result($result);
// End gauge



// Kinburn
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='Kinburn flow' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

 while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

 echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['precipitation'] .'</FONT></TD></TR>';
 }

 } else {

echo 'query didnt work';
}

     mysql_free_result($result);
// End gauge





// Bennett Lake outflow
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='Bennett Lake outflow' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

 while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

 echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['precipitation'] .'</FONT></TD></TR>';
 }

 } else {

echo 'query didnt work';
}

     mysql_free_result($result);
// End gauge





// Dalhousie Lk outflow
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='Dalhousie Lk outflow' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

 while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

 echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['precipitation'] .'</FONT></TD></TR>';
 }

 } else {

echo 'query didnt work';
}

     mysql_free_result($result);
// End gauge





// High Falls Flow
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='High Falls Flow' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

 while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

 echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['precipitation'] .'</FONT></TD></TR>';
 }

 } else {

echo 'query didnt work';
}

     mysql_free_result($result);
// End gauge






echo '  <TR><TD COLSPAN=5 ALIGN="center"><B><BR></B></TD></TR>
<TR><TD COLSPAN=5 ALIGN="center"><FONT FACE="arial" SIZE="4" COLOR="000099"><B>DAILY LAKE GAUGES</B></FONT></B></FONT><BR>

      <TR><TD><FONT FACE="arial" SIZE="2"><B>GAUGE LOCATION</B></FONT></TD><TD><FONT FACE="arial" SIZE="2"><B>DATE</B></FONT></TD><TD><FONT FACE="arial" SIZE="2"><B>LEVEL (MASL)</B></FONT></TD><TD><FONT FACE="arial" SIZE="2"><B>HISTORICAL AVG. (MASL)</B></FONT></TD><TD><FONT FACE="arial" SIZE="2"><B>PRECIPITATION (mm)</B></FONT></TD></TR>
            ';





// Shabomeka Lake
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='Shabomeka Lake' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

 while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

 echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['precipitation'] .'</FONT></TD></TR>';
 }

 } else {

echo 'query didnt work';
}

     mysql_free_result($result);
// End gauge




// Mazinaw Lake
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='Mazinaw Lake' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

 while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

 echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['precipitation'] .'</FONT></TD></TR>';
 }

 } else {

echo 'query didnt work';
}

     mysql_free_result($result);
// End gauge




// Kashwakamak Lake
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='Kashwakamak Lake' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

 while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

 echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['precipitation'] .'</FONT></TD></TR>';
 }

 } else {

echo 'query didnt work';
}

     mysql_free_result($result);
// End gauge




// Farm Lake
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='Farm Lake' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

 while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

 echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['precipitation'] .'</FONT></TD></TR>';
 }

 } else {

echo 'query didnt work';
}

     mysql_free_result($result);
// End gauge





// Mississagagon Lake
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='Mississagagon Lake' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

 while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

 echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['precipitation'] .'</FONT></TD></TR>';
 }

 } else {

echo 'query didnt work';
}

     mysql_free_result($result);
// End gauge





// Big Gull Lake
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='Big Gull Lake' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

 while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

 echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['precipitation'] .'</FONT></TD></TR>';
 }

 } else {

echo 'query didnt work';
}

     mysql_free_result($result);
// End gauge





 // Crotch Lake
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='Crotch Lake' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

 while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

 echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['precipitation'] .'</FONT></TD></TR>';
 }

 } else {

echo 'query didnt work';
}

     mysql_free_result($result);
// End gauge






 // Palmerston Lake
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='Palmerston Lake' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

 while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

 echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['precipitation'] .'</FONT></TD></TR>';
 }

 } else {

echo 'query didnt work';
}

     mysql_free_result($result);
// End gauge


 // Canonto Lake
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='Canonto Lake' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

 while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

 echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['precipitation'] .'</FONT></TD></TR>';
 }

 } else {

echo 'query didnt work';
}

     mysql_free_result($result);
// End gauge




 // Sharbot Lake
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='Sharbot Lake' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

 while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

 echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['precipitation'] .'</FONT></TD></TR>';
 }

 } else {

echo 'query didnt work';
}

     mysql_free_result($result);
// End gauge






 // Bennett Lake
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='Bennett Lake' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

 while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

 echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['precipitation'] .'</FONT></TD></TR>';
 }

 } else {

echo 'query didnt work';
}

     mysql_free_result($result);
// End gauge






 // Dalhousie Lake
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='Dalhousie Lake' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

 while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

 echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['precipitation'] .'</FONT></TD></TR>';
 }

 } else {

echo 'query didnt work';
}

     mysql_free_result($result);
// End gauge






 // Lanark
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='Lanark' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

 while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

 echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['precipitation'] .'</FONT></TD></TR>';
 }

 } else {

echo 'query didnt work';
}

     mysql_free_result($result);
// End gauge






 // Mississippi Lake
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='Mississippi Lake' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

 while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

 echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['precipitation'] .'</FONT></TD></TR>';
 }

 } else {

echo 'query didnt work';
}

     mysql_free_result($result);
// End gauge







 // C.P. Dam
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='C.P. Dam' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

 while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

 echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['precipitation'] .'</FONT></TD></TR>';
 }

 } else {

echo 'query didnt work';
}

     mysql_free_result($result);
// End gauge








 // High Falls
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='High Falls' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

 while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

 echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['precipitation'] .'</FONT></TD></TR>';
 }

 } else {

echo 'query didnt work';
}

     mysql_free_result($result);
// End gauge






echo '  <BR><BR><table ALIGN="center" BORDER=1 CELLPADDING=8>  <col width="300"><col width="200"><col width="200"><col width="200">
<TR><TD COLSPAN=4 ALIGN="center"><B><BR></B></TD></TR>
<TR><TD COLSPAN=4 ALIGN="center"><FONT FACE="arial" SIZE="4" COLOR="000099"><B>WEEKLY LAKE GAUGES</B></FONT></TD></TR>
      <TR><TD><FONT FACE="arial" SIZE="2"><B>GAUGE LOCATION</B></FONT></TD><TD><FONT FACE="arial" SIZE="2"><B>DATE</B></FONT></TD><TD><FONT FACE="arial" SIZE="2"><B>LEVEL (MASL)</B></FONT></TD><TD><FONT FACE="arial" SIZE="2"><B>HISTORICAL AVG. (MASL)</B></FONT></TD></TR>
            ';










// Shabomeka Lake (weekly)
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='Shabomeka Lake (weekly)' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

 while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

 echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD></TR>';
 }

 } else {

echo 'query didnt work';
}

     mysql_free_result($result);
// End gauge











// Mazinaw Lake (weekly)
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='Mazinaw Lake (weekly)' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

 while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

 echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD></TR>';
 }

 } else {

echo 'query didnt work';
}

     mysql_free_result($result);
// End gauge










// Little Marble Lake (weekly)
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='Little Marble Lake (weekly)' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

 while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

 echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD></TR>';
 }

 } else {

echo 'query didnt work';
}

     mysql_free_result($result);
// End gauge











 // Mississagagon Lake (weekly)
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='Mississagagon Lake (weekly)' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

 while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

 echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD></TR>';
 }

 } else {

echo 'query didnt work';
}

     mysql_free_result($result);
// End gauge










// Kashwakamak Lake (weekly)
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='Kashwakamak Lake (weekly)' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

 echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD></TR>';
}

} else {

echo 'query didnt work';
}

    mysql_free_result($result);
// End gauge









 // Farm Lake (weekly)
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='Farm Lake (weekly)' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

 while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

 echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD></TR>';
 }

 } else {

echo 'query didnt work';
}

     mysql_free_result($result);
// End gauge











 // Ardoch Bridge (weekly)
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='Ardoch Bridge (weekly)' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

 while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

  echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD></TR>';
 }

 } else {

echo 'query didnt work';
}

     mysql_free_result($result);
// End gauge










 // Malcolm Lake (weekly)
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='Malcolm Lake (weekly)' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

 while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

 echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD></TR>';
 }

 } else {

echo 'query didnt work';
}

     mysql_free_result($result);
// End gauge










 // Pine Lake (weekly)
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='Pine Lake (weekly)' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

 while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

 echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD></TR>';
 }

 } else {

echo 'query didnt work';
}

     mysql_free_result($result);
// End gauge










// Big Gull Lake (weekly)
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='Big Gull Lake (weekly)' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD></TR>';
}

} else {

echo 'query didnt work';
}

    mysql_free_result($result);
// End gauge










 // Buckshot Lake (weekly)
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='Buckshot Lake (weekly)' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

 while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

 echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD></TR>';
 }

 } else {

echo 'query didnt work';
}

     mysql_free_result($result);
// End gauge











 // Crotch Lake (weekly)
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='Crotch Lake (weekly)' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

 while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

 echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD></TR>';
 }

 } else {

echo 'query didnt work';
}

     mysql_free_result($result);
// End gauge








//High Falls G.S. (weekly)
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='High Falls G.S. (weekly)' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD></TR>';
}

} else {

echo 'query didnt work';
}

    mysql_free_result($result);
// End gauge









//Mosque Lake (weekly)
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='Mosque Lake (weekly)' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD></TR>';
}

} else {

echo 'query didnt work';
}

    mysql_free_result($result);
// End gauge










//Palmerston Lake (weekly)
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='Palmerston Lake (weekly)' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD></TR>';
}

} else {

echo 'query didnt work';
}

    mysql_free_result($result);
// End gauge












 // Canonto Lake (weekly)
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='Canonto Lake (weekly)' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

 while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

 echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD></TR>';
 }

 } else {

echo 'query didnt work';
}

     mysql_free_result($result);
// End gauge









// Bennett Lake (weekly)
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='Bennett Lake (weekly)' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD></TR>';
}

} else {

echo 'query didnt work';
}

    mysql_free_result($result);
// End gauge











 // Silver Lake (weekly)
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='Silver Lake (weekly)' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

 while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

 echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD></TR>';
 }

 } else {

echo 'query didnt work';
}

     mysql_free_result($result);
// End gauge









// Sharbot Lake (weekly)
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='Sharbot Lake (weekly)' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD></TR>';
}

} else {

echo 'query didnt work';
}

    mysql_free_result($result);
// End gauge










// Widow Lake (weekly)
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='Widow Lake (weekly)' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD></TR>';
}

} else {

echo 'query didnt work';
}

    mysql_free_result($result);
// End gauge










// Lanark Bridge (weekly)
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='Lanark Bridge (weekly)' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD></TR>';
}

} else {

echo 'query didnt work';
}

    mysql_free_result($result);
// End gauge









// Lanark Dam (weekly)
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='Lanark Dam (weekly)' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD></TR>';
}

} else {

echo 'query didnt work';
}

    mysql_free_result($result);
// End gauge











 // Almonte Bridge (weekly)
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='Almonte Bridge (weekly)' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

 while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

 echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD></TR>';
 }

 } else {

echo 'query didnt work';
}

     mysql_free_result($result);
// End gauge










/* Removed 01.03.17
 // Clayton Lake (weekly)
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='Clayton Lake (weekly)' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

 while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

 echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD></TR>';
 }

 } else {

echo 'query didnt work';
}

     mysql_free_result($result);
// End gauge

*/







//C.P. Dam (weekly)
$query = "SELECT gauge AS gauge, date as date, datainfo as datainfo, historicalaverage as historicalaverage, precipitation as precipitation FROM data WHERE gauge='C.P. Dam (weekly)' ORDER BY date DESC limit 1";
$result = mysql_query($query);

if ($result) {

while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {

IF($row['historicalaverage'] == NULL) { $row['historicalaverage'] = 'Data Not Available'; }
IF($row['precipitation'] == NULL) { $row['precipitation'] = 'Data Not Available'; }

echo '<TR><TD><FONT FACE="arial" SIZE="2">' . $row['gauge'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['date'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['datainfo'] .'</FONT></TD><TD><FONT FACE="arial" SIZE="2">'. $row['historicalaverage'] .'</FONT></TD></TR>';
}

} else {

echo 'query didnt work';
}

    mysql_free_result($result);
// End gauge






echo '</TABLE>';





?>
</BODY>
</HTML>
