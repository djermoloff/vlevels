<? 
require_once "../php/functions.php";
require_once "../php/load.php";

$r_key=mysql_query("SELECT _key FROM tools_key WHERE _id_user='".$myrow_auth['id']."' ORDER BY _date DESC LIMIT 1");
if ($m_key = mysql_fetch_array($r_key))
	{
	$settings = mysql_fetch_array(mysql_query("SELECT _mail_footer FROM settings"));
	$subject = "Ключ для программ сервиса Volume Levels";
	$message="<p>Здравствуйте, #name#!</p>
			  <p>Все программы аналитического сервиса Volume Levels используют один ключ авторизации.
			  <p>Ключ для программ: <strong>".$m_key['_key']."</strong></p>
			  <p>ВАЖНО! Не забывайте вводить свой адрес электронной почты в параметр \"Mail\" программ.</p>
			  <p>Ключ может использоваться только только на таком количестве счетов и компьютеров,<br>
			     которое указано в описании выбранного Вами арифного плана. При обнаружении нарушений<br>
				 в использовании программного обеспечения сервиса, ключ блокируется. Перевыпуск ключа<br>
				 возможен только при разрешении администратора сервиса.
			  <p>Спасибо за использование нашего сервиса.</p>".$settings['_mail_footer'];
		
	$to = array();
	array_push($to, array("email"=>$myrow_auth['email'], "name" => $myrow_auth['name']));
	if (SendMail($to,'info',$subject,$message) == 1) $return = array("success"=>"sended");
	}
	else $return = array("success"=>"no-have-key");
	
echo json_encode($return);
?>