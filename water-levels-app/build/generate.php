<html>
	<head>
		<title>MVC Water Levels</title>
		<link rel="stylesheet" type="text/css" href="generate.css">
	</head>
	<body>
		<div class="header">
			<img src="../images/header2.jpg"/>
		</div>
		<div class="header">
			<h3>
				- Daily Result Lake Gauge Line Graph Option -
			</h3>
		</div>
		<table class="water-levels" border=1 cellpadding=10 cellspacing=0>
			<tr>
				<td>
					<form id="form1" name="form1" method="post" action="data.php" onsubmit="return validateForm()">
						<h4>
							Select Lake Gauge
						</h4>
						<br>
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
						<div class="labelled-inputs">
							<p>
								Start Date: <input type="date" name="startdate" size="25" value='<?php echo date("Y-m-d",strtotime('-2 week'));?>'/>
							</p>
							<p>
								End Date: <input type="date" id="enddate" name="enddate" size="25"/>
							</p>
							<br>
							<input type="radio" name="type" value="table" checked> Table
							<br>
							<input type="radio" name="type" value="graph"> Graph
						</div>
						<input type="submit" class="center" name="submit">
					</form>
					<form>
						<input type="button" class="center" value="Back" onClick="history.go(-1);return true;">
					</form>
				</td>
				<td>
					<img src="../images/gauge-map.jpg"/>
				</td>
			</tr>
		</table>
		<script src="generate.js"></script>
	</body>
</html>