<?
header("Content-type: text/html; charset=UTF-8");
global $db_con;
global $myrow_auth;
$check_auth = 100;
$check_auth=CheckAuth();
if ($check_auth!=0) header("Location: auth.php");
if ($myrow_auth['active_tariff'] > 0) $m_user_tariff = mysql_fetch_array(mysql_query("SELECT * FROM tariffs WHERE _id='".$myrow_auth['active_tariff']."'"));
?>