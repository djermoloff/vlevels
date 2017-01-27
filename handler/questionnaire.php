<? 
require_once "../php/functions.php";
require_once "../php/load.php";

if (isset($_POST['q1-submit']) && $myrow_auth['q1'] == false)
	{
	$family_ = mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST['family'])))); 
	$birthday_ = date("Y-m-d",strtotime($_POST['birthday']));
	$country_ = mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST['country'])))); 
	$exp_forex_ = mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST['exp_forex'])))); 
	$date = $myrow_auth['active_date'] + 86400*7;
		
	$query = "UPDATE users SET  surname = '".$family_."',
															birthday = '".$birthday_."',
															country = '".$country_."',
															exp_forex = '".$exp_forex_."',
															active_date='".$date."',
															q1=true WHERE id = '".$myrow_auth['id']."'";
												
	mysql_query($query);
	header("Location:../../lk");
	exit();
	}
	
if (isset($_POST['send_kod']) && isset($_POST['phone']) && $myrow_auth['phone'] == "" && $myrow_auth['active_tariff'] == 0)
	{
	$r_kod = mysql_query("SELECT * FROM phone_kod WHERE _id_user='".$myrow_auth['id']."' ORDER BY _date DESC");
	if (mysql_num_rows($r_kod) >= 10) { $response["succeed"]="error"; $response["msg"]="Вы больше не можете отправлять SMS."; echo json_encode($response); exit; }
	if (mysql_num_rows($r_kod) > 0)
		{
		$m_kod = mysql_fetch_array($r_kod);
		if ($m_kod['_date'] + 300 > time()) { $response["succeed"]="error"; $response["msg"]="Повторно SMS можно отправить только после ".date("H:i",$m_kod['_date'] + 300); echo json_encode($response); exit; }
		if ($m_kod['_ok'] == true) { $response["succeed"]="error"; $response["msg"]="Телефон уже подтвержден"; echo json_encode($response); exit; }
		if ($m_kod['_error'] >= 5) { $response["succeed"]="error"; $response["msg"]="Вы 5 раз ввели ошибочный код подтверждения. Следующая отправка возможна после ".date("H:i",$m_kod['_date']); echo json_encode($response); exit; }
		}
	if (!preg_match("/^[0-9+]+$/", $_POST['phone'])) { $response["succeed"]="error"; $response["msg"]="Неверный формат номера телефона."; echo json_encode($response); exit; }
	if (substr($_POST['phone'],0,1) != "+") $phone = "+".$_POST['phone']; else $phone = $_POST['phone'];
	$phone = mysql_real_escape_string(stripslashes(htmlspecialchars(trim($phone))));
	
	$r_user = mysql_query("SELECT id FROM users WHERE phone='$phone'");
	if (mysql_num_rows($r_user) > 0) { $response["succeed"]="error"; $response["msg"]="Телефон ".$phone." уже подтвержден на другом аккаунте."; echo json_encode($response); exit; }
	
	$kod = rand(1000,9999);
	$text = $kod." - Ваш код подтверждения";
	$send_url = "http://smsc.ru/sys/send.php?login=dj_ermoloff&psw=120731&charset=utf-8&sender=VLevels&phones=".$phone."&mes=".$text."&fmt=3";
	$res = @file_get_contents($send_url);
	$jres = json_decode($res, true);
	
	if (isset($jres['error_code']))
		{
		mysql_query("INSERT INTO log_error (_date,_query,_error) VALUES ('".date("Y-m-d H:i:s",time())."','Отправка сообщения на номер ".$phone."','".$jres['error']."')");
		$response["succeed"]="error-servise"; 
		$response["msg"]="Сервис отправки сообщений не доступен. Попробуйте позднее."; 
		echo json_encode($response); 
		exit;
		}
	
	if ($jres['cnt'] >= 1)
		{
		mysql_query("INSERT INTO phone_kod (_id_user,_phone,_kod,_date,_ip)VALUES('".$myrow_auth['id']."','$phone','$kod','".time()."','".$_SERVER['REMOTE_ADDR']."')");
		$response["succeed"]="ok";
		$response["phone"]=$phone;
		$response["date"]=time();
		$response["msg"]="Код подтверждения отправлен на номер: ".$phone; 
		$response["htm"] = "<input type='text' id='kod'  placeholder='1234' pattern='\d [0-9]' maxlength='4' class='input input-data input-long' style='width:60px;text-align:center;' /> <span class='resend-kod' onClick='resend()'>Отправить повторно</span>";
		echo json_encode($response);
		exit;
		}
	}
	
if (isset($_POST['resend_kod']) && $myrow_auth['active_tariff'] == 0)
	{
	$r_kod = mysql_query("SELECT * FROM phone_kod WHERE _id_user='".$myrow_auth['id']."' ORDER BY _date DESC");
	if (mysql_num_rows($r_kod) > 0)
		{
		$m_kod = mysql_fetch_array($r_kod);
		if ($m_kod['_date'] + 300 > time()) { $response["succeed"]="error"; $response["msg"]="Повторно SMS можно отправить только после ".date("H:i",$m_kod['_date'] + 300); echo json_encode($response); exit; }
		if ($m_kod['_ok'] == true) { $response["succeed"]="error"; $response["msg"]="Телефон уже подтвержден"; echo json_encode($response); exit; }
		if ($m_kod['_error'] >= 5) { $response["succeed"]="error"; $response["msg"]="Вы 5 раз ввели ошибочный код подтверждения. Следующая отправка возможна после ".date("H:i",$m_kod['_date']); echo json_encode($response); exit; }

		$text = $m_kod['_kod']." - Ваш код подтверждения";
		$send_url = "http://smsc.ru/sys/send.php?login=dj_ermoloff&psw=120731&charset=utf-8&sender=VLevels&phones=".$m_kod['_phone']."&mes=".$text."&fmt=3";
		$res = @file_get_contents($send_url);
		$jres = json_decode($res, true);
		
		if (isset($jres['error_code']))
			{
			mysql_query("INSERT INTO log_error (_date,_query,_error) VALUES ('".date("Y-m-d H:i:s",time())."','Отправка сообщения на номер ".$m_kod['_phone']."','".$jres['error']."')");
			$response["succeed"]="error-servise"; 
			$response["msg"]="Сервис отправки сообщений не доступен. Попробуйте позднее."; 
			echo json_encode($response); 
			exit;
			}

		if ($jres['cnt'] >= 1)
			{
			mysql_query("UPDATE phone_kod SET _date='".time()."' WHERE _id='".$m_kod['_id']."'");
			$response["succeed"]="ok";
			$response["phone"]=$m_kod['_phone'];
			$response["date"]=time();
			$response["msg"]="Код подтверждения повторно отправлен на номер: ".$m_kod['_phone']; 
			echo json_encode($response);
			exit;
			}
		}
	}
	
if (isset($_POST['confirm_phone']) && isset($_POST['kod']) && preg_match("/^[0-9]+$/", $_POST['kod']) && $myrow_auth['active_tariff'] == 0)
	{
	$r_kod = mysql_query("SELECT * FROM phone_kod WHERE _id_user='".$myrow_auth['id']."' ORDER BY _date DESC");
	if (mysql_num_rows($r_kod) > 0)
		{
		$m_kod = mysql_fetch_array($r_kod);
		if ($m_kod['_error'] >= 5) { $response["succeed"]="error"; $response["msg"]="Вы 5 раз ввели ошибочный код подтверждения. Следующая отправка возможна после ".date("H:i",$m_kod['_date']); echo json_encode($response); exit; }
		if ($m_kod['_ok'] == true) { $response["succeed"]="error"; $response["msg"]="Телефон уже подтвержден"; echo json_encode($response); exit; }
		if ($m_kod['_date'] + 86400 > time()) 
			{
			if ($m_kod['_kod'] != $_POST['kod'])
				{
				mysql_query("UPDATE phone_kod SET _error=_error+1 WHERE _id='".$m_kod['_id']."'");
				$p = 5-$m_kod['_error']-1;
				if ($p == 1) $p .= " попытка."; else $p .= " попытки.";
				$response["succeed"]="error"; $response["msg"]="Код введен не верно. Осталось ".$p;
				echo json_encode($response);
				exit;
				}
				else
				{
				mysql_query("UPDATE phone_kod SET _ok=true WHERE _id='".$m_kod['_id']."'");
				$active_date = $myrow_auth['active_date']+86400*7;
				mysql_query("UPDATE users SET phone='".$m_kod['_phone']."',active_date='".$active_date."' WHERE id='".$myrow_auth['id']."'");
				$response["succeed"]="ok"; 
				$response["msg"]="Код подтверждения принят. Аккаунт активирован до: ".date("d.m.Y H:i",$active_date);
				echo json_encode($response);
				exit;
				}
			}
			else
			{
			$response["succeed"]="error"; $response["msg"]="Код действуйет в течении суток. Отправьте код повторно.";
			echo json_encode($response);
			exit;
			}
		}
	}
?>