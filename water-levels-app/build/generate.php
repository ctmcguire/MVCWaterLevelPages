<html>
	<head>
		<title>MVC Water Levels</title>
		<link rel="stylesheet" type="text/css" href="ataglance.css"><!--Temporary; will be given its own stylesheet eventually-->
	</head>
	<body>
		<center>
			<table bgcolor="#FFFFFF" border=0 cellpadding="0" cellspacing="0" width=1050>
				<tr>
					<th>
						<img src="../images/header2.jpg"/>
					</th>
				</tr>
				<tr></tr>
				<tr class="title" style="padding-top: 20px; padding-bottom: 20px;">
					<th>
						- Daily Result Lake Gauge Line Graph Option -
					</th>
				</tr>
				<tr></tr>
				<tr>
					<td>
						<!--center>
							<img src="../images/header2.jpg"/>
						</center-->
						<!--center>
							<font face="arial" size="4" color="000099">
								<b>
									- Daily Result Lake Gauge Line Graph Option -
								</b>
							</font>
						</center-->
						<center>
							<table border=1 cellpadding=10 cellspacing=0>
								<tr valign="top">
									<td>
										<center>
											<font face="arial" size="3">
												<b>
													Select Lake Gauge
												</b>
											</font>
										</center>
										<br>
										<font face="arial" size=2>
											<form id="form1" name="form1" method="post" action="data.php" onsubmit="return validateForm()">
												<center>
													<select name="gauge">
														<option selected disabled>
															Select...
														</option>
														<optgroup label="Stream Gauges">
															<option value="Myers Cave flow">
																Myers Cave
															</option>
															<option value="Buckshot Creek flow">
																Buckshot Creek
															</option>
															<option value="Ferguson Falls flow">
																Ferguson Falls
															</option>
															<option value="Appleton flow">
																Appleton
															</option>
															<option value="Gordon Rapids flow">
																Gordon Rapids
															</option>
															<option value="Lanark Stream flow">
																Lanark
															</option>
															<option value="Mill of Kintail flow">
																Mill of Kintail
															</option>
															<option value="Kinburn flow">
																Kinburn
															</option>
															<option value="Bennett Lake outflow">
																Bennett Lake outflow
															</option>
															<option value="Dalhousie Lk outflow">
																Dalhousie Lake outflow
															</option>
															<option value="High Falls Flow">
																High Falls Flow
															</option>
														</optgroup>
														<optgroup label="Daily Lake Gauges">
															<option value="Shabomeka Lake">
																Shabomeka Lake
															</option>
															<option value="Mazinaw Lake">
																Mazinaw Lake
															</option>
															<option value="Kashwakamak Lake">
																Kashwakamak Lake
															</option>
															<option value="Farm Lake">
																Farm Lake
															</option>
															<option value="Mississagagon Lake">
																Mississagagon Lake
															</option>
															<option value="Big Gull Lake">
																Big Gull Lake
															</option>
															<option value="Crotch Lake">
																Crotch Lake
															</option>
															<option value="Palmerston Lake">
																Palmerston Lake
															</option>
															<option value="Canonto Lake">
																Canonto Lake
															</option>
															<option value="Sharbot Lake">
																Sharbot Lake
															</option>
															<option value="Bennett Lake">
																Bennett Lake
															</option>
															<option value="Dalhousie Lake">
																Dalhousie Lake
															</option>
															<option value="Lanark">
																Lanark
															</option>
															<option value="Mississippi Lake">
																Mississippi Lake
															</option>
															<option value="C.P. Dam">
																C.P. Dam
															</option>
															<option value="Carp River at Maple Grove">
																Carp River at Maple Grove
															</option>
															<option value="High Falls">
																High Falls
															</option>
														</optgroup>
														<optgroup label="Weekly Lake Gauges">
															<option value="Shabomeka Lake (weekly)">
																Shabomeka Lake
															</option>
															<option value="Mazinaw Lake (weekly)">
																Mazinaw Lake
															</option>
															<option value="Little Marble Lake (weekly)">
																Little Marble Lake
															</option>
															<option value="Mississagagon Lake (weekly)">
																Mississagagon Lake
															</option>
															<option value="Kashwakamak Lake (weekly)">
																Kashwakamak Lake
															</option>
															<option value="Farm Lake (weekly)">
																Farm Lake
															</option>
															<option value="Ardoch Bridge (weekly)">
																Ardoch Bridge
															</option>
															<option value="Buckshot Lake (weekly)">
																Buckshot Lake
															</option>
															<option value="Malcolm Lake (weekly)">
																Malcolm Lake
															</option>
															<option value="Pine Lake (weekly)">
																Pine Lake Lake
															</option>
															<option value="Big Gull Lake (weekly)">
																Big Gull Lake
															</option>
															<option value="Crotch Lake (weekly)">
																Crotch Lake
															</option>
															<option value="High Falls G.S. (weekly)">
																High Falls G.S.
															</option>
															<option value="Mosque Lake (weekly)">
																Mosque Lake
															</option>
															<option value="Palmerston Lake (weekly)">
																Palmerston Lake
															</option>
															<option value="Canonto Lake (weekly)">
																Canonto Lake
															</option>
															<option value="Bennett Lake">
																Bennett Lake
															</option>
															<option value="Dalhousie Lake">
																Dalhousie Lake
															</option>
															<option value="Silver Lake (weekly)">
																Silver Lake
															</option>
															<option value="Widow Lake (weekly)">
																Widow Lake
															</option>
															<option value="Lanark Dam (weekly)">
																Lanark Dam
															</option>
															<option value="C.P. Dam">
																C.P Dam
															</option>
															<option value="Almonte Bridge (weekly)">
																Almonte Bridge
															</option>
															<option value="Clayton Lake (weekly)">
																Clayton Lake (Ended Dec. 2016)
															</option>
													</optgroup>
												</select>
												</center>
											</form>
										</font>
										<br>
										<font face="arial" size=2 style="text-align: left">
											<br>
											<b>
												Start Date:
											</b>
											<input type="date" name="startdate" size="25" style="vertical-align: center" value='<?php echo date("Y-m-d",strtotime('-2 week'));?>'/>
										</font>
										<font face="arial" size=2>
											<br>
											<b>
												End  Date:
											</b>
											<input type="date" id="enddate" name="enddate" size="25" style="vertical-align: center"/>
										</font>
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
										</script>
										<br>
										<input type="radio" name="type" value="table" checked> Table
										<br>
										<input type="radio" name="type" value="graph"> Graph
										<br>
										<br>
										<br>
										<br>
										<br>
										<br>
										<br>
										<center>
											<input type="submit" name="submit">
										</center>
										</br>
										<center>
											<form>
												<input type="button" value="Back" onClick="history.go(-1);return true;">
											</form>
										</center>
									</td>
									<td>
										<img src="../images/gauge-map.jpg"/>
									</td>
								</tr>
							</table>
						</center>
					</td>
				</tr>
			</table>
		</center>
	</body>
</html>