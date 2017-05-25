<?php
	class TableLoader
	{
		private $flowGauges;//FLOW GAUGES
		private $lakeGauges;//DAILY LAKE GAUGES
		private $weekGauges;//WEEKLY LAKE GAUGES

		function TableLoader() {
			$this->flowGauges = array(
				'Myers Cave flow',// Myers Cave
				'Buckshot Creek flow',//Buckshot
				'Ferguson Falls flow',// Ferguson Falls
				'Appleton flow',// Appleton
				'Gordon Rapids flow',// Gordon Rapids
				'Lanark Stream flow',// Lanark stream
				'Mill of Kintail flow',// Mill of Kintail
				'Kinburn flow',// Kinburn
				'Bennett Lake outflow',// Bennett Lake outflow
				'Dalhousie Lk outflow',// Dalhousie Lk outflow
				'High Falls Flow'// High Falls Flow
			);
			$this->lakeGauges = array(
				'Shabomeka Lake',// Shabomeka Lake
				'Mazinaw Lake',// Mazinaw Lake
				'Kashwakamak Lake',// Kashwakamak Lake
				'Farm Lake',// Farm Lake
				'Mississagagon Lake',// Mississagagon Lake
				'Big Gull Lake',// Big Gull Lake
				'Crotch Lake',//Crotch Lake
				'Palmerston Lake',// Palmerston Lake
				'Canonto Lake',// Canonto Lake
				'Sharbot Lake',// Sharbot Lake
				'Bennett Lake',// Bennett Lake
				'Dalhousie Lake',// Dalhousie Lake
				'Lanark',// Lanark
				'Mississippi Lake',// Mississippi Lake
				'C.P. Dam',// C.P. Dam
				'High Falls'// High Falls
			);
			$this->weekGauges = array(
				'Shabomeka Lake (weekly)',// Shabomeka Lake (weekly)
				'Mazinaw Lake (weekly)',// Mazinaw Lake (weekly)
				'Little Marble Lake (weekly)',// Little Marble Lake (weekly)
				'Mississagagon Lake (weekly)',// Mississagagon Lake (weekly)
				'Kashwakamak Lake (weekly)',// Kashwakamak Lake (weekly)
				'Farm Lake (weekly)',// Farm Lake (weekly)
				'Ardoch Bridge (weekly)',// Ardoch Bridge (weekly)
				'Malcolm Lake (weekly)',// Malcolm Lake (weekly)
				'Pine Lake (weekly)',// Pine Lake (weekly)
				'Big Gull Lake (weekly)',// Big Gull Lake (weekly)
				'Buckshot Lake (weekly)',// Buckshot Lake (weekly)
				'Crotch Lake (weekly)',// Crotch Lake (weekly)
				'High Falls G.S. (weekly)',//High Falls G.S. (weekly)
				'Mosque Lake (weekly)',//Mosque Lake (weekly)
				'Palmerston Lake (weekly)',//Palmerston Lake (weekly)
				'Canonto Lake (weekly)',// Canonto Lake (weekly)
				'Bennett Lake (weekly)',// Bennett Lake (weekly)
				'Silver Lake (weekly)',// Silver Lake (weekly)
				'Sharbot Lake (weekly)',// Sharbot Lake (weekly)
				'Widow Lake (weekly)',// Widow Lake (weekly)
				'Lanark Bridge (weekly)',// Lanark Bridge (weekly)
				'Lanark Dam (weekly)',// Lanark Dam (weekly)
				'Almonte Bridge (weekly)',// Almonte Bridge (weekly)
				'C.P. Dam (weekly)'//C.P. Dam (weekly)
			);
		}

		public function getFlowData()
		{
			$this->getData($this->flowGauges);
		}
		public function getDailyLakeData()
		{
			$this->getData($this->lakeGauges);
		}
		public function getWeeklyLakeData()
		{
			$this->getData($this->weekGauges, false);
		}

		private function getData($gauges=array(), $hasRain=true)
		{
			for($i = 0; $i < count($gauges); $i++)
				$this->populateRow($gauges[$i], $hasRain);
		}

		private function populateRow($gaugeName, $hasPrecipitation = true)
		{
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
						' . $row['gauge'] . '
					</td>
					<td>
						' . $row['date'] . '
					</td>
					<td>
						' . $row['datainfo'] . '
					</td>
					<td>
						' . $row['historicalaverage'] . '
					</td>';

					/*If the data in question has a precipitation column, add its column to the table*/
					if($hasPrecipitation) {
						echo '<td>
							' . $row['precipitation'] . '
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

	}

	function loadTableData($dataName="flow")
	{
		//echo 'This function is being replaced with a php object; use that instead';//Uncomment if you want an error message for incorrect usage
	}

	mysql_connect("localhost","mvconc55_levels1","4z9!yA");
	mysql_select_db("mvconc55_mvclevels");

	$table = new TableLoader();//Create an instance of a TableLoader object, to be used by the ataglance.php file
?>