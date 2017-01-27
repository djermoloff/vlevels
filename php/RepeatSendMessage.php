<?php 
require_once "functions.php";
session_start();
if (isset($_SESSION["email_reg"])&&isset($_SESSION["user_name_reg"]))
{
	$db_con=DBConnect(DB_HOST,DB_USER,DB_PASS,DB_NAME);
	$name_safe=$_SESSION["user_name_reg"];
  	$subject="Приветствуем Вас на сервисе Volume Levels";
  	$check_code=substr(md5($_SESSION["email_reg"].$_SESSION["user_name_reg"]."fab663"),0,6);
	$message="<p>Здравствуйте, ".$name_safe."!</p>
								  <p>Вы указали этот адрес электронной почты при<br>регистрации на сайте сервиса <a href='http://vlevels.ru'>VLevels.ru</a></p>
								  <p>Для продолжения регистрации введите проверочный код<br>в соответствующее поле: <b>".$check_code."</b></p>
								  <p>Если Вы не оставляли свои контактные данные<br>на указанном сайте, просто проигнорируйте это сообщение.</p>
								  <p>__________________________________</p>
								  <p>С уважением, Сервис Volume Levels<br>Веб сайт: <a href='http://vlevels.ru'>VLevels.ru</a><br>Администратор: <a href='mailto:admin@vlevels.ru'>admin@vlevels.ru</a></p>";
	
	$to = array();
	array_push($to, array("email"=>$_SESSION["email_reg"], "name" => $_SESSION["user_name_reg"]));
  	SendMail($to,"info",$subject,$message);
  	$response['success'] = 1;
  	echo json_encode($response);
}
else
{
	$response['error'] = 0;
  	echo json_encode($response);
}
?>