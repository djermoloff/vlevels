<?php
require_once "php/functions.php";
header("Content-type: text/html; charset=UTF-8");
$check_auth=CheckAuth();
if ($check_auth!=0) 
	{
	if (!isset($_GET['email']) || !preg_match("/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/", $_GET['email'])) { header("Location: auth.php"); exit; }
	$email=mysql_real_escape_string(stripslashes(htmlspecialchars(trim(strtolower($_GET["email"])))));
	$r_auth = mysql_query("SELECT * FROM users WHERE email='".$email."'");
	if (mysql_num_rows($r_auth) == 0) { header("Location: auth.php"); exit; }
	$myrow_auth = mysql_fetch_array($r_auth);
	$m_key = mysql_fetch_array(mysql_query("SELECT _last_date,_key FROM tools_key WHERE _id_user='".$myrow_auth['id']."'"));
	
	if ($m_key['_last_date']+86400*7 < time())
		{
		$subject="[Ключ для индикатора] Спасибо что заинтересовались нашим продуктом!";
		$message="<p>Спасибо что скачали индикатор!</p>
								  <p>Чтобы воспользоваться индикатором, введите свой адрес электронный почты и ключ в соответствующие поля индикатора:</br>
								  Напоминаем Ваш ключ для программ сервиса: <b>".$m_key['_key']."</b></p>
								  <p>С другими позможностями сервиса <a href='http://vlevels.ru'>Volume Levels</a> и программами для торгового терминала, вы можете ознакомиться на сайте <a href='http://vlevels.ru'>vlevels.ru</a> и в личном кабинете по адресу <a href='http://cabinet.vlevels.ru'>cabinet.vlevels.ru</a>.</p>
								  <p>__________________________________</p>
								  <p>С уважением, команда Volume Levels<br>Веб сайт: <a href='http://vlevels.ru'>VLevels.ru</a><br>Администратор: <a href='mailto:admin@vlevels.ru'>admin@vlevels.ru</a></p>";
			  
		$to = array();
		array_push($to, array("email"=>$email, "name" => $myrow_auth['name']));
		SendMail($to,"info",$subject,$message);
		}
	}
	
if (isset($_GET['id']) && preg_match("/^[0-9]+$/", $_GET['id'])) $id_ =  $_GET['id']; else exit();
$result_file = mysql_query ("SELECT _link,_name_file FROM indicators WHERE _id = '$id_'");
 
$r_query = mysql_query("SELECT _id FROM downloads WHERE _id_user='".$myrow_auth['id']."' AND _id_indicator='$id_'");
if (mysql_num_rows($r_query) == 0) mysql_query("INSERT INTO downloads (_id_user,_id_indicator,_date,_total) VALUES ('".$myrow_auth['id']."','$id_','".date("Y-m-d H:i:s",time())."','1')");
	else mysql_query("UPDATE downloads SET _date='".date("Y-m-d H:i:s",time())."',_total=_total+1 WHERE _id_user='".$myrow_auth['id']."' AND _id_indicator='$id_'");
		
if ($myrow = mysql_fetch_array($result_file)) downloadFile($myrow['_link'],$myrow['_name_file']); else exit();

//Файл на выдачу
function downloadFile($filename, $name ,$mimetype='application/octet-stream') {
	if (!file_exists($filename)) 
		{
		header("Location:index.php?err=not_file");
		exit();
		}
	//echo $name; exit();
	$from=$to=0; $cr=NULL;

	if (isset($_SERVER['HTTP_RANGE'])) {
		$range=substr($_SERVER['HTTP_RANGE'], strpos($_SERVER['HTTP_RANGE'], '=')+1);
		$from=strtok($range, '-');
		$to=strtok('/'); if ($to>0) $to++;
		if ($to) $to-=$from;
		header('HTTP/1.1 206 Partial Content');
		$cr='Content-Range: bytes ' . $from . '-' . (($to)?($to . '/' . $to+1):filesize($filename));
	} else	header('HTTP/1.1 200 Ok');

	$etag=md5($filename);
	$etag=substr($etag, 0, 8) . '-' . substr($etag, 8, 7) . '-' . substr($etag, 15, 8);
	header('ETag: "' . $etag . '"');

	header('Accept-Ranges: bytes');
	header('Content-Length: ' . (filesize($filename)-$to+$from));
	if ($cr) header($cr);

	header('Connection: close');
	header('Content-Type: ' . $mimetype);
	header('Last-Modified: ' . gmdate('r', filemtime($filename)));
	$f=fopen($filename, 'r');
	header('Content-Disposition: attachment; filename="' . $name . '";');
	if ($from) fseek($f, $from, SEEK_SET);
	if (!isset($to) or empty($to)) {
		$size=filesize($filename)-$from;
	} else {
		$size=$to;
	}
	$downloaded=0;
	while(!feof($f) and !connection_status() and ($downloaded<$size)) {
		echo fread($f, 512000);
		$downloaded+=512000;
		flush();
	}
	fclose($f);
}
?>