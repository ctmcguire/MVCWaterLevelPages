<html>
	<head>
		<title>MVC Watershed - At a Glance</title>
		<link rel="stylesheet" type="text/css" href="ataglance.css">
	</head>
	<body>
		<?php include 'ataglance_php.php'; ?>
		<table class="water-levels" border=1 cellpadding=8>
			<tr>
				<th colspan=5>
					<img src="http://mvc.on.ca/water-levels-app/images/header2.jpg">
				</th>
			</tr>
			<tr class="title">
				<th colspan=5>
					STREAM GAUGES
				</th>
			</tr>
			<tr>
				<th>
					GAUGE LOCATION
				</th>
				<th>
					DATE
				</th>
				<th>
					FLOW (<p class="tooltip" title="Cubic Meters per Second">cms</p>)
				</th>
				<th>
					HISTORICAL AVG. (<p class="tooltip" title="Cubic Meters per Second">cms</p>)
				</th>
				<th>
					PRECIPITATION (mm)
				</th>
			</tr>
			<?php $table->getFlowData(); ?>
			<tr>
				<th colspan=5>
					<br>
				</th>
			</tr>
			<tr class="title">
				<th colspan=5>
					DAILY LAKE GAUGES
				</th>
			</tr>
			<tr>
				<th>
					GAUGE LOCATION
				</th>
				<th>
					DATE
				</th>
				<th>
					LEVEL (<p class="tooltip" title="Meters Above Sea Level">MASL</p>)
				</th>
				<th>
					HISTORICAL AVG. (<p class="tooltip" title="Meters Above Sea Level">MASL</p>)
				</th>
				<th>
					PRECIPITATION (mm)
				</th>
			</tr>
			<?php $table->getDailyLakeData(); ?>
		</table>
		<table class="water-levels" border=1 cellpadding=8>
			<colgroup>
				<col id="name-col">
				<col id="date-col">
				<col id="data-col">
				<col id="hist-col">
			</colgroup>
			<tr class="title">
				<th colspan=4>
					WEEKLY LAKE GAUGES
				</th>
			</tr>
			<tr>
				<th>
					GAUGE LOCATION
				</th>
				<th>
					DATE
				</th>
				<th>
					LEVEL (<p class="tooltip" title="Meters Above Sea Level">MASL</p>)
				</th>
				<th>
					HISTORICAL AVG. (<p class="tooltip" title="Meters Above Sea Level">MASL</p>)
				</th>
			</tr>
			<?php $table->getWeeklyLakeData(); ?>
		</table>
	</body>
</html>