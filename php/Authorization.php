<?php
	if (preg_match('~.+?@.+?\..+?~i',trim($_POST["email"]))&&strlen(trim($_POST["email"]))<=50)
  	{
	require_once "functions.php";
	$db_con=DBConnect(DB_HOST,DB_USER,DB_PASS,DB_NAME);
	$email_safe=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["email"]))));
	
	$result=mysql_query("select * from `users` where `email`='$email_safe'");
	if (mysql_num_rows($result))
		{
		$data=mysql_fetch_array($result);
		if ($data['blocked'] == '0')
 			{
  			if (time()>$data['ban_time'])
	  			{
				$pass_safe=md5(mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["pass"]."kGgy3")))));
	  			if ($pass_safe==$data['password'])
					{
				    session_start();
					$_SESSION['authorized_id'] = $data['id']; 
					$_SESSION['key'] = md5($data['id'].$data['password']."sdrljty454");
					$_SESSION['ip'] = $_SERVER['REMOTE_ADDR'];
					if ($data['reg_date'] == 0) $reg = ", reg_date='".time()."', active_date='".time()."'"; else $reg = "";
					mysql_query("update `users` set `last_visit`='".time()."',`ip`='".$ip."',`fail_count`='0'$reg where `email`='".$data['email']."'");
					$response["success"]=0;
			  		echo json_encode($response);
					exit;
		  			}
		  			else
		  			{
		            if (time()-$data['fail_time']>15*60)
		            	{
	            		mysql_query("update `users` set `fail_count`='1',`fail_time`=".time()." where `email`='".$data['email']."'");
		       			}
		       			else
		       			{
	    				if ($data['fail_count']+1>=5)
		    				{
                           	mysql_query("update `users` set `fail_count`='".($data['fail_count']+1)."',`fail_time`=".time().",`ban_time`=".(time()+15*60)." where `email`='".$data['email']."'");
		  					}
		  					else
		  					{
                           	mysql_query("update `users` set `fail_count`='".($data['fail_count']+1)."',`fail_time`=".time()." where `email`='".$data['email']."'");
		 					}
		    			}
		            	$response["exist"]=0; //Выдать ошибку - такое сочетание email и пароля не найдено
		  				echo json_encode($response);
		  			}
				}
				else
				{
				$response["ban"]=1; //Выдать ошибку - Вы ввели неверные данные 5 раз, поэтому ваш аккаунт забанен на 15 минут
  				echo json_encode($response);
				}
			}
			else
			{
            $response["blocked"]=1; //Выдать ошибку - Пользователь заблокирован администратором
		  	echo json_encode($response);
			}
	  	}
	  	else
	  	{
	  	$response["exist"]=0; //Выдать ошибку - такое сочетание email и пароля не найдено
	  	echo json_encode($response);
	 	}
  	mysql_close($db_con);
  	}
  	else
  	{
  		$response["exist"]=0; //Выдать ошибку - такое сочетание email и пароля не найдено
  		echo json_encode($response);
  	}
?>