<?php
  session_start();
  if (isset($_SESSION["email_rec"]) && isset($_SESSION["hash_rec"]) && ($_SESSION["hash_rec"]==md5($_SESSION["email_rec"]."fab663")))
  {
  	  require_once "functions.php";
	  $db_con=DBConnect(DB_HOST,DB_USER,DB_PASS,DB_NAME);
	  
	  $email_safe=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_SESSION["email_rec"]))));
	  
	  $result=mysql_query("select * from `users` where `email`='$email_safe'");
	  if (mysql_num_rows($result))
	  {
			  if (preg_match('~[a-zA-Z0-9_]{6,50}~',trim($_POST["newPass"])))
			  {
			  	if (trim($_POST["newRePass"])==trim($_POST["newPass"]))
			  	{
			            unset($_SESSION["email_rec"]);
			            unset($_SESSION["hash_rec"]);
			            $data=mysql_fetch_array($result);
			            $pass_safe=md5($_POST["newPass"]."kGgy3");
			            $last_visit=time();
			            $ip=getRealIpAddr();
			            mysql_query("update `users` set `password`='$pass_safe' where `email`='$email_safe'");
			            $response["success"]="<p>Пароль успешно изменен!</p>";
			            echo json_encode($response);
			   			if ($data['blocked'] == '0')
			   			{
				            if (time()>$data['ban_time'])
				            {
							$_SESSION['authorized_id'] = $data['id']; 
							//$_SESSION['key'] = md5($data['id'].$pass_safe."sdrljty454");
							$_SESSION['ip'] = $_SERVER['REMOTE_ADDR'];
					        mysql_query("update `users` set `last_visit`='$last_visit',`ip`='$ip',`fail_count`='0' where `email`='$email_safe'");
					        header("Location: index.php"); //////////////////////////////////////////////////////////////////////////
							}
							else
							{
								$response["ban"]=1; //Выдать ошибку - Вы ввели неверные данные 5 раз, поэтому ваш аккаунт был забанен на 15 минут
								echo json_encode($response);
							}
						}
						else
						{
							$response["blocked"]=1; //Выдать ошибку - Пользователь заблокирован администратором
		  					echo json_encode($response);
						}
						//mysql_close($db_con);
			  	}
			  	else
			  	{
			  		$response["newPass"]=0; //Ошибка. Сообщение: пароли не совпадают
			  		echo json_encode($response);
			  	}
			  }
			  else
			  {
			  	$response["newPass"]=-1; //Ошибка. Сообщение о недопустимом новом пароле
			  	echo json_encode($response);
			  }
      }
      else
      {
        $response["user"]=0; //Ошибка. Сообщение: пользователь не найден
        echo json_encode($response);
      }
  }
  else
  {
  	$response["session"]=0; //Ошибка. Сообщение: сессия не найдена
    echo json_encode($response);
  }
?>