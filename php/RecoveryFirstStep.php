<?php
  if (preg_match('~.+?@.+?\..+?~i',trim($_POST["email"]))&&strlen(trim($_POST["email"]))<=50)
  {
  	require_once "functions.php";
  	$db_con=DBConnect(DB_HOST,DB_USER,DB_PASS,DB_NAME);
  	$email_safe=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["email"]))));
  	$result=mysql_query("select * from `users` where `email`='$email_safe'");
  	if (mysql_num_rows($result))
  	{
  		session_start();
  		$_SESSION["email_rec"]=$email_safe;
		$myrow = mysql_fetch_array($result);
  		$hash_code=md5($email_safe."fab663");
  		$_SESSION["hash_rec"]=$hash_code;
	  	$subject="Восстановление пароля";
	  	$ref="http://".$_SERVER['HTTP_HOST']."/recovery2.php?hash=".$hash_code; ///////////////////////////////////////////////////////////////
	  	$message="<p>Здравствуйте, ".$myrow['name']."!</p>
								<p>Вы запросили изменение пароля на сайте <a href='http://vlevels.ru'>VLevels.ru</a>.<br>Пройдите по следующей ссылке, чтобы начать восстановление:</p>
								<p><a href='".$ref."'>".$ref."</a></p>
								<p>Если Вы не запрашивали восстановление пароля, то просто игнорируйте данное письмо.</p>
								<p>__________________________________</p>
								<p>С уважением, Сервис Volume Levels<br>Веб сайт: <a href='http://vlevels.ru'>VLevels.ru</a><br>Администратор: <a href='mailto:admin@vlevels.ru'>admin@vlevels.ru</a></p>";
	  	$to = array();
		array_push($to, array("email"=>$email_safe, "name" => $myrow['name']));
		SendMail($to,"info",$subject,$message);
  		$response["success"]="<p>На Вашу почту <i style='color:Blue;'>".$email_safe."</i> было отправлено письмо со ссылкой на следующий этап восстановления пароля.</p>"; ///////////////////////////////////////////////////////////
  	    echo json_encode($response);
  	}
  	else
  	{
  		$response["exist"]=0; //Выдать ошибку - такой email не найден
  		echo json_encode($response);
  	}
  }
  else
  {
  	$response["exist"]=0; //Выдать ошибку - такой email не найден
  	echo json_encode($response);
  }
?>