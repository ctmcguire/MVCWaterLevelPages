<?php
	/**
	 * This class is used to load the table row data for ataglance.php
	**/
	class TableLoader
	{
		private $flowGauges;//FLOW GAUGES
		private $lakeGauges;//DAILY LAKE GAUGES
		private $weekGauges;//WEEKLY LAKE GAUGES

		/**
		 * The TableLoader constructor initializes the arrays that are used by TableLoader objects
		 * 
		 * @returns - constructors do not return
		 * 
		 * Example usage:
		 * 					$tableLoader = new TableLoader();
		 * The above example constructs a new TableLoader object and stores it in the $tableLoader variable 
		 * (this variable name will be reused in later examples).
		**/
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

		/**
		 * This function returns string containing a sequence of html rows; one row for each flow gauge.
		 * 
		 * @returns - html rows for each flow gauge
		 * 
		 * Example usage:
		 * 					$rows = $tableLoader->getFlowData();
		 * The above example gets the html rows for the flow gauges and stores them in the $rows variable.
		**/
		public function getFlowData()
		{
			return $this->getData($this->flowGauges);
		}
		/**
		 * This function returns string containing a sequence of html rows; one row for each daily lake gauge.
		 * 
		 * @returns - html rows for each daily lake gauge
		 * 
		 * Example usage:
		 * 					$rows = $tableLoader->getDailyLakeData();
		 * The above example gets the html rows for the daily lake gauges and stores them in the $rows 
		 * variable.
		**/
		public function getDailyLakeData()
		{
			return $this->getData($this->lakeGauges);
		}
		/**
		 * This function returns string containing a sequence of html rows; one row for each weekly lake gauge.
		 * 
		 * @returns - html rows for each weekly lake gauge
		 * 
		 * Example usage:
		 * 					$rows = $tableLoader->getWeeklyLakeData();
		 * The above example gets the html rows for the weekly lake gauges and stores them in the $rows 
		 * variable.
		**/
		public function getWeeklyLakeData()
		{
			return $this->getData($this->weekGauges, false);
		}

		/**
		 * This function takes an array of gauge names and a boolean value, and returns one html row for each
		 *  gauge in the array.
		 * 
		 * @param $gauges - array of gauge names; defaults to an empty array
		 * @param $hasRain - boolean value representing whether the gauges in the array measure 
		 *                precipitation; defaults to true
		 * 
		 * @returns - one html row for each gauge in the array (as a single string)
		 * 
		 * Example usage:
		 * 					Private functions cannot be used outside of this class
		**/
		private function getData($gauges=array(), $hasRain=true)
		{
			$outStr = '';
			for($i = 0; $i < count($gauges); $i++)
				$outStr = $outStr . $this->populateRow($gauges[$i], $hasRain);
			return $outStr;
		}

		/**
		 * This function takes a gauge name and a boolean value, and returns the gauge's most recent data as 
		 * a string containing an html row.
		 * 
		 * @param $gaugeName - Name of the gauge to get data for
		 * @param $hasRain - boolean value representing whether the gauge measures precipitation; defaults to
		 *                 true
		 * 
		 * @returns - html row for the gauge's most recent data (as a string)
		 * 
		 * Example usage:
		 * 					Private functions cannot be used outside of this class
		**/
		private function populateRow($gaugeName, $hasRain = true)
		{
			$query = "SELECT gauge, date, datainfo, historicalaverage, precipitation FROM data WHERE gauge='" . $gaugeName . "' ORDER BY date DESC limit 1";
			$result = mysql_query($query);
			$outStr = '';

			if ($result) {
				while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {
					if($row['historicalaverage'] == NULL)
						$row['historicalaverage'] = 'Data Not Available';
					if($row['precipitation'] == NULL)
						$row['precipitation'] = 'Data Not Available';

					$outStr = $outStr . '<tr>
					<td>
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
					if($hasRain) {
						$outStr = $outStr . '<td>
							' . $row['precipitation'] . '
						</td>';
					}
					$outStr = $outStr . '</tr>';//End of the current row
				}
			}
			else {
				$outStr = $outStr . 'query didnt work';
			}
			mysql_free_result($result);

			return $outStr;
		}
	}
?>