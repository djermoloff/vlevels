<?php
require_once "functions.php";

if (isset($_POST['privacy_policy']) && $_POST['privacy_policy'] == 'false')
	{
   	$response["privacy_policy"]=1; //Выдать ошибку - пользовательское соглашение
   	echo json_encode($response);
	exit();
	}
	
  if (preg_match('~[а-яА-Яa-zA-Z0-9_]{1,50}~',trim($_POST["name"])))
  {
  	if (preg_match('~.+?@.+?\..+?~i',trim($_POST["email"]))&&strlen(trim($_POST["email"]))<=50)
  	{
    	$db_con=DBConnect(DB_HOST,DB_USER,DB_PASS,DB_NAME);
    	$email_safe=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["email"]))));
    	$result=mysql_query("select `email` from `users` where `email`='$email_safe'");
    	if (mysql_num_rows($result))
    	{
        	$response["email"]=0; //Выдать ошибку - пользователь с таким email уже существует
        	echo json_encode($response);
    	}
    	else
    	{
			session_start();
			$check_promo_code=1;
			
	        if (trim($_POST["promo_code"])!='')
	        {
		    	if (strlen(trim($_POST["promo_code"]))==6)
		    	{
		    		$code_safe=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["promo_code"]))));
		    		$result=mysql_query("select * from `promo_code` where `code`='$code_safe'");
		    		if (mysql_num_rows($result))
		    		{
		    			$data=mysql_fetch_array($result);
		    			if (date("Y-m-d")<=$data['act_date'])
		    			{
		    				if ($data['act_count']>0)
		    				{
		    					$_SESSION["promo_code"]=$code_safe;
		    					mysql_query("update `promo_code` set `act_count`='".($data['act_count']-1)."' where `code`='$code_safe'");
		    				}
		    				else
		    				{
		    					$check_promo_code=0;
		    					$response["promo_code"]=-3; //У промо кода 0 активаций
	  							echo json_encode($response);
		    				}
		    			}
		    			else
		    			{
		    				$check_promo_code=0;
		    				$response["promo_code"]=-2; //Промо код просрочен
	  						echo json_encode($response);
		    			}
		   			}
		   			else
		   			{
		   				$check_promo_code=0;
		   				$response["promo_code"]=0; //Промо код не найден
	  					echo json_encode($response);
		   			}
		  		}
		  		else
		  		{
		  		 	$check_promo_code=0;
		  		 	$response["promo_code"]=-1; //Недопустимый промо код
	  			 	echo json_encode($response);
		  		}
			}
			if ($check_promo_code==1)
			{
				$name_safe=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["name"]))));
				$_SESSION["user_name_reg"]=$name_safe;
		        $_SESSION["email_reg"]=$email_safe;
	            $check_code=substr(md5($email_safe.$name_safe."fab663"),0,6);
	            //Отправка письма о подтверждении регистрации

	  			$subject="Приветствуем Вас на сервисе Volume Levels";
	  			$message="<p>Здравствуйте, #name#!</p>
								  <p>Вы указали этот адрес электронной почты при<br>регистрации на сайте сервиса <a href='http://vlevels.ru'>VLevels.ru</a></p>
								  <p>Для продолжения регистрации введите проверочный код<br>в соответствующее поле: <b>".$check_code."</b></p>
								  <p>Если Вы не оставляли свои контактные данные<br>на указанном сайте, просто проигнорируйте это сообщение.</p>
								  <p>__________________________________</p>
								  <p>С уважением, Сервис Volume Levels<br>Веб сайт: <a href='http://vlevels.ru'>VLevels.ru</a><br>Администратор: <a href='mailto:admin@vlevels.ru'>admin@vlevels.ru</a></p>";
				
				$to = array();
				array_push($to, array("email"=>$email_safe, "name" => $name_safe));
	  			SendMail($to,"info",$subject,$message);
				
				require_once "subscrib-list.php";
				$sub_list = $subList['first_step'].",".$subList['registered'].",".$subList['no_install'];
				$id_unisender = 0;
				if (!isset($_SESSION["id_unisender"])) $id_unisender = add_subscrib($email_safe,$name_safe,$sub_list,$_SERVER['REMOTE_ADDR'],time());
				if ($id_unisender > 0) $_SESSION["id_unisender"] = $id_unisender;
				
	  			$response["success"]=	'<form id="registr_form_second">
											<p>Здравствуйте, '.$name_safe.'.</p>
	            							<p>На указанный Вами адрес электронной почты был отправлен код для проверки подлинности электронной почты.</p>
	            							<p>Проверьте, пожалуйста, свой E-mail: <a href="mailto:'.$email_safe.'" class="form__link">'.$email_safe.'</a> и введите 6-значный код из присланного нами письма.</p>
						                	<div class="form__input-wrapper form__input-wrapper--reg_code">
												<label class="form__label form__label--reg_code" for="reg_code">Регистрационный код:</label>
												<input class="form__input form__input--promo-code" type="text" id="reg_code" required minlength="6" maxlength="6" />
											</div>
											<p class="">Если Вы не получили регистрационный код: <span id="message_repeat"><a href="#" id="linkSendMessage" class="form__link">отправить еще раз</a></span></p>
											
											<div class="form__btn-wrapper">
												<input type="submit" class="form__btn" id="regSecondStep" value="Продолжить"  onMouseDown="yaCounter36585425.reachGoal(\'reg_2\');"/>
											</div>
										</form>';

		    	echo json_encode($response);
	        }
    	}
    	mysql_close($db_con);
  	}
  	else
  	{
  		$response["email"]=-1; //Выдать ошибку - недопустимый email
  		echo json_encode($response);
  	}
  }
  else
  {
    $response["name"]=-1; //Выдать ошибку - недопустимое имя
    echo json_encode($response);
  }
?>