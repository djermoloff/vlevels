<?
define("DB_HOST","10.50.13.241");
define("DB_USER","vlevels");
define("DB_PASS","vrYM8FCGtYs4yjjq");
define("DB_NAME","vlevels");
define("DB_NAME_CME","cme");

header("Content-Type: text/html; charset=utf-8");

$db_con=DBConnect(DB_HOST,DB_USER,DB_PASS,DB_NAME_CME);
  
if (isset($_GET['start_date'])) $start_date = strtotime($_GET['start_date']); else $start_date = strtotime(date("Y-m-d",time()-86400));
$month = "";
if (isset($_GET['month'])) $month = " AND _option_month='".$_GET['month']."'";
$symbol = "";
if (isset($_GET['symbol'])) $symbol = " AND _symbol='".$_GET['symbol']."'";


	$r_option = mysql_query("SELECT * FROM cme_options WHERE _expiration>'".$start_date."'".$month.$symbol);

	while($m_option = mysql_fetch_array($r_option))
		{/*
		$have_cvs = mysql_num_rows(mysql_query("show columns FROM `cme_bill_".strtolower($m_option['_symbol'])."_".strtolower($m_option['_option_month'])."` where `Field` = '_cvs'"));
			if ($have_cvs == 0)
				{
				mysql_query("ALTER TABLE `cme_bill_".strtolower($m_option['_symbol'])."_".strtolower($m_option['_option_month'])."` ADD COLUMN _cvs DOUBLE(4,1) NULL NULL AFTER _delta");
				mysql_query("ALTER TABLE `cme_bill_".strtolower($m_option['_symbol'])."_".strtolower($m_option['_option_month'])."` ADD COLUMN _cvs_balance BOOLEAN AFTER _cvs");
				echo $m_option['_symbol']." ".$m_option['_option_month']."<br>";
				} 
		continue;*/
		$date = strtotime(date("Y-m-d",$m_option['_expiration']-86400*40));
		echo $date; 
		while($date < time())
			{
			if ($date > $m_option['_expiration']) break;
			if (date("w",$date) == 0 || date("w",$date) == 6) { $date+=86400; continue; }
			echo $m_option['_symbol']." ".$m_option['_option_month']." ".date("Y-m-d",$date)."<br>";
			$min_strike = 0;
			$max_strike = 0;
			$t_call = 0;
			$t_put = 0;
			
			$r_strike = mysql_query("SELECT _strike,_oi FROM cme_bill_".strtolower($m_option['_symbol'])."_".strtolower($m_option['_option_month'])." WHERE _date='$date' AND _type=0 ORDER BY _strike");
			$i_strike = 0;
			if (mysql_num_rows($r_strike) == 0) { $date+=86400; echo "Нет данных.<br>"; continue; }

			while ($m_strike = mysql_fetch_array($r_strike))
				{
				$t_call += $m_strike['_oi'];
				$index = $m_strike['_strike'];
				if ($i_strike == 0) 
					{
					$i_strike = $index+5;
					$itm[$index]['total']['call'] = $m_strike['_oi'];
					//echo $index." - ".$itm[$index]['total']['call']."<br>";
					}
					else
					{
					while($i_strike < $m_strike['_strike'])
						{
						$back_index = $i_strike - 5;
						$itm[$i_strike]['total']['call'] = $itm[$back_index]['total']['call'];
						//echo $i_strike." - ".$itm[$i_strike]['total']['call']." No have strike<br>";
						$i_strike += 5;
						}

					$back_index = $i_strike - 5;
					$itm[$i_strike]['total']['call'] = $itm[$back_index]['total']['call'] + $m_strike['_oi'];
					//echo $i_strike." - ".$itm[$i_strike]['total']['call']." - ".$m_strike['_oi']."<br>";
					$i_strike += 5;	
					}
					
				$max_strike = $index;
				}
					
			$r_strike = mysql_query("SELECT _strike,_oi FROM cme_bill_".strtolower($m_option['_symbol'])."_".strtolower($m_option['_option_month'])." WHERE _date='$date' AND _type=1 ORDER BY _strike DESC");
			$i_strike = 0;
			while ($m_strike = mysql_fetch_array($r_strike))
				{
				$t_put += $m_strike['_oi'];
				$index = $m_strike['_strike'];
				if ($i_strike == 0) 
					{
					$i_strike = $index-5;
					$itm[$index]['total']['put'] = $m_strike['_oi'];
					//echo "PUT<br>".$index." - ".$itm[$index]['total']['put']."<br>";
					}
					else
					{
					while($i_strike > $m_strike['_strike'])
						{
						$back_index = $i_strike + 5;
						$itm[$i_strike]['total']['put'] = $itm[$back_index]['total']['put'];
						//echo $i_strike." - ".$itm[$i_strike]['total']['put']."<br>";
						$i_strike -= 5;
						}
						
					$back_index = $i_strike + 5;
					$itm[$i_strike]['total']['put'] = $itm[$back_index]['total']['put'] + $m_strike['_oi'];
					//echo $i_strike." - ".$itm[$i_strike]['total']['put']." - ".$m_strike['_oi']."<br>";
					$i_strike -= 5;
					}
					
				$min_strike = $index;
				}
				
			/*
			$have_cvs = mysql_num_rows(mysql_query("show columns FROM `cme_bill_".strtolower($m_option['_symbol'])."_".strtolower($m_option['_option_month'])."` where `Field` = '_cvs'"));
			if ($have_cvs == 0)
				{
				mysql_query("ALTER TABLE `cme_bill_".strtolower($m_option['_symbol'])."_".strtolower($m_option['_option_month'])."` ADD COLUMN _cvs DOUBLE(4,1) NULL NULL AFTER _delta");
				mysql_query("ALTER TABLE `cme_bill_".strtolower($m_option['_symbol'])."_".strtolower($m_option['_option_month'])."` ADD COLUMN _cvs_balance BOOLEAN AFTER _cvs");
				}
			echo mysql_error();*/
			
			$strike = $min_strike;
			$ca_call = 0;
			$ca_put = 0;
			$egm_call = 0;
			$egm_put = 0;
			$balance = 0;
			$b_strike = 0;
			
			while($strike <= $max_strike)
				{
				if ($t_call > 0) $call = $itm[$strike]['total']['call']/$t_call*100;
				if ($t_put > 0) $put = $itm[$strike]['total']['put']/$t_put*100;
				$query = "UPDATE `cme_bill_".strtolower($m_option['_symbol'])."_".strtolower($m_option['_option_month'])."` SET _cvs='$call' WHERE _strike='".$strike."' AND _date='$date' AND _type=0";
				mysql_query($query);
				$query = "UPDATE `cme_bill_".strtolower($m_option['_symbol'])."_".strtolower($m_option['_option_month'])."` SET _cvs='$put' WHERE _strike='".$strike."' AND _date='$date' AND _type=1";
				mysql_query($query);

				if (abs($call-$put) < $balance || $balance == 0) {$balance = abs($call-$put); $b_strike=$strike;}
				$strike += 5;
				}
			
			$query = "UPDATE `cme_bill_".strtolower($m_option['_symbol'])."_".strtolower($m_option['_option_month'])."` SET _cvs_balance=true WHERE _strike='".$b_strike."' AND _date='$date'";
			mysql_query($query);
			echo mysql_error();
				
			$date += 86400;
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