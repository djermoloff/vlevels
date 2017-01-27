<? 
if (!isset($_GET['key'])) exit;
define("DB_HOST","10.50.13.241");
  define("DB_USER","vlevels");
  define("DB_PASS","vrYM8FCGtYs4yjjq");
  define("DB_NAME","vlevels");
  define("DB_NAME_CME","cme");
  
/*define("DB_HOST","localhost");
define("DB_USER","root");
define("DB_PASS","");
define("DB_NAME","vlevels");
define("DB_NAME_CME","cme");*/

header("Content-Type: text/html; charset=utf-8");

$db_con=DBConnect(DB_HOST,DB_USER,DB_PASS,DB_NAME_CME);

if (!isset($_GET['date'])) exit;
echo date("H:i")."<br>";
$get_date = strtotime($_GET['date']);
$month = "";
if (isset($_GET['month'])) $month = " AND _option_month='".$_GET['month']."'";
$symbol = "";
if (isset($_GET['symbol'])) $symbol = " AND _symbol='".$_GET['symbol']."'";

if (isset($_GET['action']) && $_GET['action'] == "copy-gold") 
	{
	$start_date = strtotime($_GET['date']);
	$r_gold = mysql_query("SELECT _expiration,_option_month FROM cme_options WHERE _symbol='XAUUSD' AND _expiration>'$start_date'");
	while($m_gold = mysql_fetch_array($r_gold))
		{
		$query = "INSERT INTO cme_options (_symbol,_expiration,_option_month) VALUES ('HO','".($m_gold['_expiration']+86400*7)."','".$m_gold['_option_month']."')";
		mysql_query($query);
		echo $query." - ".date("d.m.Y H:i",$m_gold['_expiration'])."<br>";
		}
	}

if (isset($_GET['action']) && $_GET['action'] == "insert-es") 
	{
	$start_date = strtotime($_GET['date']);
	
	while($start_date < 1515168000)
		{
		if (date("d",$start_date) >= 15 && date("d",$start_date) <= 21)
			{
			if (date("w",$start_date) == 3) 
				{
				$e_date = $start_date + 3600*16;
				$query = "INSERT INTO cme_options (_symbol,_expiration,_option_month) VALUES ('SP500','$e_date','".strtoupper(date("My",$start_date+86400*30))."')";
				$r = mysql_num_rows(mysql_query("SELECT _id FROM cme_options WHERE _symbol='SP500' AND _option_month='".strtoupper(date("My",$start_date+86400*30))."'"));
				//mysql_query($query);
				if ($r == 0) echo $query." - ".date("d.m.Y H:i",$e_date)."<br>";
				}
			}
		$start_date += 86400;
		}
	exit;
	}
	
if (isset($_GET['action']) && $_GET['action'] == "insert-eom") 
	{
	$start_date = strtotime($_GET['date']);
	$em = date("m",$start_date);
	while($start_date < 1515068000)
		{
		if (date("m",$start_date) != $em)
			{
			$e_date = $start_date + 3600*16;
			$e_date -= 86400;
			if (date("w",$e_date) == 0) $e_date -= 86400*2;
			if (date("w",$e_date) == 6) $e_date -= 86400;

			$query = "INSERT INTO cme_options (_symbol,_expiration,_option_month) VALUES ('CL','$e_date','".strtoupper(date("My",$start_date))."')";
			//mysql_query($query);
			echo $query." - ".date("d.m.Y H:i",$e_date)." - ".date("w",$e_date)."<br>";
			$em = date("m",$start_date);
			}
		$start_date += 86400;
		}
	exit;
	}

if (isset($_GET['action']) && $_GET['action'] == "change-date-total") 
	{
	$e_date = 0;
	$r_total = mysql_query("SELECT _id,_date FROM cme_bill_".strtolower($_GET['symbol'])."_total WHERE _date > '$get_date'");
	while($m_total = mysql_fetch_array($r_total))
		{
		if ($e_date == $m_total['_date']) continue;
		if (date("H",$m_total['_date']) == 20) 
			{
			$d = $m_total['_date']+4*3600;
			$query = "UPDATE cme_bill_".strtolower($_GET['symbol'])."_total SET _date='$d' WHERE _date='".$m_total['_date']."'";
			if (mysql_query($query) === false) echo mysql_error()."<br>";
			echo date("d-m-Y H:i",$m_total['_date'])." ".$query."<br>";
			}
		$e_date = $m_total['_date'];
		}
	exit;
	}
	
$result = mysql_query("SELECT * FROM cme_options WHERE _expiration > '$get_date'".$month.$symbol);
if (mysql_num_rows($result) == 0) { echo "Нет данных по опционному месяцу"; exit; }
while ($myrow = mysql_fetch_array($result))
	{
	if (isset($_GET['action']) && $_GET['action'] == "delete-dubles") 
		{
		$query = "DELETE FROM cme_options WHERE _expiration='".$myrow['_expiration']."' AND _symbol='".$myrow['_symbol']."' AND _id!='".$myrow['_id']."'";
		//mysql_query($query);
		echo $query."<br>";
		}
		
	if (isset($_GET['action']) && $_GET['action'] == "delete-next-date") 
		{
		$query = "UPDATE cme_options SET _e_time='".$get_date."' WHERE _id='".$myrow['_id']."' AND _e_time>'".$get_date."'";
		if (mysql_query($query) === false) echo mysql_error()."<br>";
		$query = "DELETE FROM cme_bill_".strtolower($myrow['_symbol'])."_".strtolower($myrow['_option_month'])." WHERE _date>'".$get_date."'";
		if (mysql_query($query) === false) echo mysql_error()."<br>";
		$query = "DELETE FROM cme_bill_".strtolower($myrow['_symbol'])."_total WHERE _date>'".$get_date."'";
		if (mysql_query($query) === false) echo mysql_error()."<br>";
		$query = "DELETE FROM cme_day_".strtolower($myrow['_symbol'])." WHERE _date>'".$get_date."'";
		if (mysql_query($query) === false) echo mysql_error()."<br>";
		echo $query."<br>";
		continue;
		}
		
	$r_opt = mysql_query("SELECT * FROM cme_bill_".strtolower($myrow['_symbol'])."_".strtolower($myrow['_option_month']));
	$e_date = 0;
	$total_oi_call = 0;
	$total_coi_call = 0;
	$total_volume_call = 0;
	$total_oi_put = 0;
	$total_coi_put = 0;
	$total_volume_put = 0;
	$oi_max = 0;
	$total = mysql_num_rows($r_opt);
	$i = 0;
	while($m_opt = mysql_fetch_array($r_opt))
		{
		$i++;
		if (isset($_GET['action']) && $_GET['action'] == "change-date") 
			{
			if ($e_date == $m_opt['_date']) continue;
			if (date("H",$m_opt['_date']) == 20) 
				{
				$d = $m_opt['_date']+4*3600;
				$query = "UPDATE `cme_bill_".strtolower($myrow['_symbol'])."_".strtolower($myrow['_option_month'])."` SET _date='$d' WHERE _date='".$m_opt['_date']."'";
				if (mysql_query($query) === false) echo mysql_error()."<br>";
				echo date("d-m-Y H:i",$m_opt['_date'])." ".$query."<br>";
				}
			$e_date = $m_opt['_date'];
			}
		
		if (isset($_GET['action']) && $_GET['action'] == "get-total") 
			{
			if ($e_date != 0 && $e_date != $m_opt['_date']) 
				{
				//echo date("Y-m-d H:i",$m_opt['_date'])." ".strtolower($myrow['_symbol'])."_".strtolower($myrow['_option_month'])." OI:".$total_oi." COI:".$total_coi." Volume:".$total_volume."<br>";
				$query = "INSERT INTO cme_bill_".strtolower($myrow['_symbol'])."_total (_date,_option,_total_oi_call,_total_oi_put,_change_oi_call,_change_oi_put,_total_volume_call,_total_volume_put) VALUES ('".$m_opt['_date']."','".$myrow['_id']."','$total_oi_call','$total_oi_put','$total_coi_call','$total_coi_put','$total_volume_call','$total_volume_put')";
				//if (mysql_query($query) === false) echo mysql_error();
				echo $query."<br>";
				if ($m_opt['_type'] == 0)
					{
					$total_oi_call = $m_opt['_oi'];
					$total_coi_call = $m_opt['_coi'];
					$total_volume_call = $m_opt['_volume'];
					}
					else
					{
					$total_oi_put = $m_opt['_oi'];
					$total_coi_put = $m_opt['_coi'];
					$total_volume_put = $m_opt['_volume'];
					}
				}
				
			if ($e_date == $m_opt['_date'] || $e_date == 0) 
				{
				if ($m_opt['_type'] == 0)
					{
					$total_oi_call += $m_opt['_oi'];
					$total_coi_call += $m_opt['_coi'];
					$total_volume_call += $m_opt['_volume'];
					}
					else
					{
					$total_oi_put += $m_opt['_oi'];
					$total_coi_put += $m_opt['_coi'];
					$total_volume_put += $m_opt['_volume'];
					}
				}
				
			if ($i == $total)
				{
				$query = "INSERT INTO cme_bill_".strtolower($myrow['_symbol'])."_total (_date,_option,_total_oi_call,_total_oi_put,_change_oi_call,_change_oi_put,_total_volume_call,_total_volume_put) VALUES ('".$m_opt['_date']."','".$myrow['_id']."','$total_oi_call','$total_oi_put','$total_coi_call','$total_coi_put','$total_volume_call','$total_volume_put')";
				//if (mysql_query($query) === false) echo mysql_error();
				}
				
			$e_date = $m_opt['_date'];
			}
		
		if (isset($_GET['action']) && $_GET['action'] == "get-print") 
			{
			if ($e_date != 0 && $e_date != $m_opt['_date']) 
				{
				$print = $oi_max * 0.5;
				$query = "UPDATE cme_bill_".strtolower($myrow['_symbol'])."_".strtolower($myrow['_option_month'])." SET _print='1' WHERE _date='".$e_date."' AND _oi>='".$print."'";
				if (mysql_query($query) === false) echo mysql_error();
				echo date("d-m-Y H:i ",$e_date).$query."<br>";
				$print = $oi_max * 0.6;
				$query = "UPDATE cme_bill_".strtolower($myrow['_symbol'])."_".strtolower($myrow['_option_month'])." SET _print='2' WHERE _date='".$e_date."' AND _oi>='".$print."'";
				if (mysql_query($query) === false) echo mysql_error();
				echo date("d-m-Y H:i ",$e_date).$query."<br>";
				$print = $oi_max * 0.7;
				$query = "UPDATE cme_bill_".strtolower($myrow['_symbol'])."_".strtolower($myrow['_option_month'])." SET _print='3' WHERE _date='".$e_date."' AND _oi>='".$print."'";
				if (mysql_query($query) === false) echo mysql_error();
				echo date("d-m-Y H:i ",$e_date).$query."<br>";
				$print = $oi_max * 0.8;
				if ($oi_max * 0.8 > $oi_next) $r = 5; else $r = 4;
				$query = "UPDATE cme_bill_".strtolower($myrow['_symbol'])."_".strtolower($myrow['_option_month'])." SET _print='".$r."' WHERE _date='".$e_date."' AND _oi>='".$print."'";
				if (mysql_query($query) === false) echo mysql_error();
				echo date("d-m-Y H:i ",$e_date).$query."<br>";

				$oi_max = $m_opt['_oi'];
				$oi_next = 0;
				}
				
			if ($e_date == $m_opt['_date'] || $e_date == 0) 
				{
				if ($oi_max < $m_opt['_oi']) { $oi_next = $oi_max; $oi_max = $m_opt['_oi'];}
				}
				
			if ($i == $total)
				{
				$print = $oi_max * 0.5;
				$query = "UPDATE cme_bill_".strtolower($myrow['_symbol'])."_".strtolower($myrow['_option_month'])." SET _print='1' WHERE _date='".$e_date."' AND _oi>='".$print."'";
				if (mysql_query($query) === false) echo mysql_error();
				echo date("d-m-Y H:i ",$e_date).$query."<br>";
				$print = $oi_max * 0.6;
				$query = "UPDATE cme_bill_".strtolower($myrow['_symbol'])."_".strtolower($myrow['_option_month'])." SET _print='2' WHERE _date='".$e_date."' AND _oi>='".$print."'";
				if (mysql_query($query) === false) echo mysql_error();
				echo date("d-m-Y H:i ",$e_date).$query."<br>";
				$print = $oi_max * 0.7;
				$query = "UPDATE cme_bill_".strtolower($myrow['_symbol'])."_".strtolower($myrow['_option_month'])." SET _print='3' WHERE _date='".$e_date."' AND _oi>='".$print."'";
				if (mysql_query($query) === false) echo mysql_error();
				echo date("d-m-Y H:i ",$e_date).$query."<br>";
				$print = $oi_max * 0.8;
				if ($oi_max * 0.8 > $oi_next) $r = 5; else $r = 4;
				$query = "UPDATE cme_bill_".strtolower($myrow['_symbol'])."_".strtolower($myrow['_option_month'])." SET _print='".$r."' WHERE _date='".$e_date."' AND _oi>='".$print."'";
				if (mysql_query($query) === false) echo mysql_error();
				echo date("d-m-Y H:i ",$e_date).$query."<br>";
				}
			
			$e_date = $m_opt['_date'];
			}
			
		$e_date = $m_opt['_date'];	
		}
		
	if (isset($_GET['action']) && $_GET['action'] == "edit-e-time") 
		{
		$query = "UPDATE cme_options SET _e_time='".$e_date."' WHERE _id='".$myrow['_id']."'";
		echo strtolower($myrow['_symbol'])."_".strtolower($myrow['_option_month'])." ".$query."<br>";
		if (mysql_query($query) === false) echo mysql_error();
		}
	}

function DBConnect($db_host,$db_user,$db_pass,$db_name)
	{
	global $db_con;
	$db_con=@mysql_connect($db_host,$db_user,$db_pass);
	echo mysql_error();
	if ($db_con)
		{
		if (!@mysql_select_db($db_name,$db_con)) return false;
		}
	
	mysql_query ("set character_set_client='utf8'");
	mysql_query("SET NAMES utf8");
	mysql_query ("set character_set_results='utf8'"); 
	mysql_query ("set collation_connection='utf8_general_ci'");
    return $db_con;
  }
?>