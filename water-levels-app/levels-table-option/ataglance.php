<html>
	<head>
		<title>MVC Watershed - At a Glance</title>
	</head>
	<body>
		<?php
			function populateRow($gaugeName, $hasPrecipitation = true) {
				$query = "SELECT gauge, date, datainfo, historicalaverage, precipitation FROM data WHERE gauge='" . $gaugeName . "' ORDER BY date DESC limit 1";
				$result = mysql_query($query);

				if ($result) {
					while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {
						if($row['historicalaverage'] == NULL)
							$row['historicalaverage'] = 'Data Not Available';
						if($row['precipitation'] == NULL)
							$row['precipitation'] = 'Data Not Available';

						echo '<tr>';//Start of the current row
						echo '<td>
							<font face="arial" size="2">
								' . $row['gauge'] . '
							</font>
						</td>
						<td>
							<font face="arial" size="2">
								' . $row['date'] . '
							</font>
						</td>
						<td>
							<font face="arial" size="2">
								' . $row['datainfo'] . '
							</font>
						</td>
						<td>
							<font face="arial" size="2">
								' . $row['historicalaverage'] . '
							</font>
						</td>';

						/*If the data in question has a precipitation column, add its column to the table*/
						if($hasPrecipitation) {
							echo '<td>
								<font face="arial" size="2">
									' . $row['precipitation'] . '
								</font>
							</td>';
						}
						echo '</tr>';//End of the current row
					}
				}
				else {

			echo 'query didnt work';
			}

				 mysql_free_result($result);
			}

			mysql_connect("localhost","mvconc55_levels1","4z9!yA");
			mysql_select_db("mvconc55_mvclevels");
		?>
		<br/>
		<br/>
		<table align="center" border=1 cellpadding=8> 
			<tr>
				<td colspan=5>
					<center>
						<img src="http://mvc.on.ca/water-levels-app/images/header2.jpg">
					</center>
				</td>
			</tr>
			<!--tr>
				<td colspan=5>
					<a href="javascript:history.back();">
						<font face="Arial" color="#000080">
							<img border="0" src="back.jpg" width="66" height="28" alt="Back" title="Back">
						</font>
					</a>
				</td>
			</tr-->
			<tr>
				<td colspan=5 align="center">
					<font face="arial" size="4" color="000099">
						<b>
							STREAM GAUGES
						</b>
					</font>
				</td>
			</tr>
			<tr>
				<td>
					<font face="arial" size="2">
						<b>
							GAUGE LOCATION
						</b>
					</font>
				</td>
				<td>
					<font face="arial" size="2">
						<b>
							DATE
						</b>
					</font>
				</td>
				<td>
					<font face="arial" size="2">
						<b>
							FLOW (cms)
						</b>
					</font>
				</td>
				<td>
					<font face="arial" size="2">
						<b>
							HISTORICAL AVG. (cms)
						</b>
					</font>
				</td>
				<td>
					<font face="arial" size="2">
						<b>
							PRECIPITATION (mm)
						</b>
					</font>
				</td>
			</tr>
			<?
				populateRow('Myers Cave flow');// Myers Cave
				populateRow('Buckshot Creek flow');//Buckshot
				populateRow('Ferguson Falls flow');// Ferguson Falls
				populateRow('Appleton flow');// Appleton
				populateRow('Gordon Rapids flow');// Gordon Rapids
				populateRow('Lanark Stream flow');// Lanark stream
				populateRow('Mill of Kintail flow');// Mill of Kintail
				populateRow('Kinburn flow');// Kinburn
				populateRow('Bennett Lake outflow');// Bennett Lake outflow
				populateRow('Dalhousie Lk outflow');// Dalhousie Lk outflow
				populateRow('High Falls Flow');// High Falls Flow
			?>
			<tr>
				<td colspan=5 align="center">
					<b>
						<br/>
					</b>
				</td>
			</tr>
			<tr>
				<td colspan=5 align="center">
					<font face="arial" size="4" color="000099">
						<b>
							DAILY LAKE GAUGES
						</b>
					</font>
				</td>
			</tr>
			<tr>
				<td>
					<font face="arial" size="2">
						<b>
							GAUGE LOCATION
						</b>
					</font>
				</td>
				<td>
					<font face="arial" size="2">
						<b>
							DATE
						</b>
					</font>
				</td>
				<td>
					<font face="arial" size="2">
						<b>
							LEVEL (MASL)
						</b>
					</font>
				</td>
				<td>
					<font face="arial" size="2">
						<b>
							HISTORICAL AVG. (MASL)
						</b>
					</font>
				</td>
				<td>
					<font face="arial" size="2">
						<b>
							PRECIPITATION (mm)
						</b>
					</font>
				</td>
			</tr>
			<?
				/* 
				 * DAILY LAKE GAUGES
				 */
				populateRow('Shabomeka Lake');// Shabomeka Lake
				populateRow('Mazinaw Lake');// Mazinaw Lake
				populateRow('Kashwakamak Lake');// Kashwakamak Lake
				populateRow('Farm Lake');// Farm Lake
				populateRow('Mississagagon Lake');// Mississagagon Lake
				populateRow('Big Gull Lake');// Big Gull Lake
				populateRow('Crotch Lake');//Crotch Lake
				populateRow('Palmerston Lake');// Palmerston Lake
				populateRow('Canonto Lake');// Canonto Lake
				populateRow('Sharbot Lake');// Sharbot Lake
				populateRow('Bennett Lake');// Bennett Lake
				populateRow('Dalhousie Lake');// Dalhousie Lake
				populateRow('Lanark');// Lanark
				populateRow('Mississippi Lake');// Mississippi Lake
				populateRow('C.P. Dam');// C.P. Dam
				populateRow('High Falls');// High Falls
			?>
		</table>
		<br/>
		<br/>
		<table align="center" border=1 cellpadding=8>
			<colgroup>
				<col width="300">
				<col width="200">
				<col width="200">
				<col width="200">
			</colgroup>
			<tr>
				<td colspan=4 align="center">
					<b>
						<br/>
					</b>
				</td>
			</tr>
			<tr>
				<td colspan=4 align="center">
					<font face="arial" size="4" color="000099">
						<b>
							WEEKLY LAKE GAUGES
						</b>
					</font>
				</td>
			</tr>
			<tr>
				<td>
					<font face="arial" size="2">
						<b>
							GAUGE LOCATION
						</b>
					</font>
				</td>
				<td>
					<font face="arial" size="2">
						<b>
							DATE
						</b>
					</font>
				</td>
				<td>
					<font face="arial" size="2">
						<b>
							LEVEL (MASL)
						</b>
					</font>
				</td>
				<td>
					<font face="arial" size="2">
						<b>
							HISTORICAL AVG. (MASL)
						</b>
					</font>
				</td>
			</tr>

		<?
			/* 
			 * WEEKLY LAKE GAUGES
			 */
			populateRow('Shabomeka Lake (weekly)', false);// Shabomeka Lake (weekly)
			populateRow('Mazinaw Lake (weekly)', false);// Mazinaw Lake (weekly)
			populateRow('Little Marble Lake (weekly)', false);// Little Marble Lake (weekly)
			populateRow('Mississagagon Lake (weekly)', false);// Mississagagon Lake (weekly)
			populateRow('Kashwakamak Lake (weekly)', false);// Kashwakamak Lake (weekly)
			populateRow('Farm Lake (weekly)', false);// Farm Lake (weekly)
			populateRow('Ardoch Bridge (weekly)', false);// Ardoch Bridge (weekly)
			populateRow('Malcolm Lake (weekly)', false);// Malcolm Lake (weekly)
			populateRow('Pine Lake (weekly)', false);// Pine Lake (weekly)
			populateRow('Big Gull Lake (weekly)', false);// Big Gull Lake (weekly)
			populateRow('Buckshot Lake (weekly)', false);// Buckshot Lake (weekly)
			populateRow('Crotch Lake (weekly)', false);// Crotch Lake (weekly)
			populateRow('High Falls G.S. (weekly)', false);//High Falls G.S. (weekly)
			populateRow('Mosque Lake (weekly)', false);//Mosque Lake (weekly)
			populateRow('Palmerston Lake (weekly)', false);//Palmerston Lake (weekly)
			populateRow('Canonto Lake (weekly)', false);// Canonto Lake (weekly)
			populateRow('Bennett Lake (weekly)', false);// Bennett Lake (weekly)
			populateRow('Silver Lake (weekly)', false);// Silver Lake (weekly)
			populateRow('Sharbot Lake (weekly)', false);// Sharbot Lake (weekly)
			populateRow('Widow Lake (weekly)', false);// Widow Lake (weekly)
			populateRow('Lanark Bridge (weekly)', false);// Lanark Bridge (weekly)
			populateRow('Lanark Dam (weekly)', false);// Lanark Dam (weekly)
			populateRow('Almonte Bridge (weekly)', false);// Almonte Bridge (weekly)
			populateRow('C.P. Dam (weekly)', false);//C.P. Dam (weekly)
		?>
		</table>
	</body>
</html>
