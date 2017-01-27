<?php
if (preg_match('~[a-zA-Z0-9_]{6,50}~',trim($_POST["pass"])))
  {
    if (trim($_POST["rePass"])==trim($_POST["pass"]))
    {
    session_start();
    if (isset($_SESSION["user_name_reg"])&&isset($_SESSION["email_reg"]) && isset($_SESSION["reg_code"]) && ($_SESSION["reg_code"]==substr(md5($_SESSION["email_reg"].$_SESSION["user_name_reg"]."fab663"),0,6)))
    {
      require_once "functions.php";
      $db_con=DBConnect(DB_HOST,DB_USER,DB_PASS,DB_NAME);
      if (!is_robot())
      {
        $email=mysql_real_escape_string(stripslashes(htmlspecialchars(trim(strtolower($_SESSION["email_reg"])))));
        
        $result=mysql_query("select * from `users` where `email`='$email'");
        if (!mysql_num_rows($result))
        {
          $active=0;
          $active_date=time();
          if (isset($_SESSION["promo_code"]))
          {
            $promo_code_safe=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_SESSION["promo_code"]))));
            $result=mysql_query("select * from `promo_code` where `code`='$promo_code_safe'");
            if (mysql_num_rows($result))
            {
              $data=mysql_fetch_array($result);
              $active=1;
              $active_date+=(int)($data['act_period'])*30*24*60*60-86400;
            }
            unset($_SESSION["promo_code"]);
          }

          $refer=0;
          if (isset($_COOKIE["refer"]))
          {
            $refer_safe=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_COOKIE["refer"]))));
            $result=mysql_query("select * from `users` where `id`='$refer_safe'");
            if (mysql_num_rows($result))
            {
              $refer=$refer_safe;
            }
          }

          $pass_safe=$_POST["pass"]."kGgy3";
          $user_name=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_SESSION["user_name_reg"]))));
          unset($_SESSION["user_name_reg"]);
          unset($_SESSION["email_reg"]);
          unset($_SESSION["reg_code"]);
          $_SESSION["email"]=$email;
          $password=md5($pass_safe);
          $key=md5($email.$password."fab663");
          $_SESSION["key"]=$key;
          $reg_date=time();
          $ip=getRealIpAddr();
          $_SESSION["ip"]=md5($ip);
          $utm_source='';
          if (isset($_COOKIE["utm_source"]))
          {
            $utm_source=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_COOKIE["utm_source"]))));
          }
          $utm_medium='';
          if (isset($_COOKIE["utm_medium"]))
          {
            $utm_medium=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_COOKIE["utm_medium"]))));
          }
          $utm_term='';
          if (isset($_COOKIE["utm_term"]))
          {
            $utm_term=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_COOKIE["utm_term"]))));
          }
          $utm_campaign='';
          if (isset($_COOKIE["utm_campaign"]))
          {
            $utm_campaign=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_COOKIE["utm_campaign"]))));
          }
		  
		  $id_visitor=0;
		  if (isset($_COOKIE["_ym_visitor"]) && $_COOKIE["_ym_visitor"] != "") $id_visitor = mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_COOKIE["_ym_visitor"]))));
		  $id_http = 0;
          if (isset($_COOKIE["http_refer"]) && $_COOKIE["http_refer"] != "")
			{
			$url=parse_url($_COOKIE["http_refer"]);
			if (isset($url['scheme']) && isset($url['host'])) 
				{
				$http_refer=$url['scheme']."://".$url['host'];
				$r_http = mysql_query("SELECT _id FROM partner_program WHERE _site='".$http_refer."' AND _checked='1'");
				if ($m_http = mysql_fetch_array($r_http)) $id_http = $m_http['_id'];
				}
			}

		  $query = "insert into `users` (`name`,`email`,`password`,`refer`,`http`,`reg_date`,`last_visit`,`role`,`ip`,`active`,`active_date`,`blocked`,`utm_source`,`utm_medium`,`utm_term`,`utm_campaing`) 
								values ('$user_name','$email','$password','$refer','$id_http','$reg_date','$reg_date','0','$ip','$active','$active_date','0','$utm_source','$utm_medium','$utm_term','$utm_campaign')";
          mysql_query($query);
          $id_user=mysql_insert_id($db_con);
		  $_SESSION['authorized_id'] = $id_user; 
		  $_SESSION['key'] = md5($id_user.$password."sdrljty454");
		  $_SESSION['ip'] = $_SERVER['REMOTE_ADDR'];
		  
		  $key = substr(md5($email.time()),0,10);
		  mysql_query("INSERT INTO tools_key (_id_user,_key,_active) VALUES ('$id_user','$key','1')");
		  
	  	  $subject="Успешная регистрация";
	  	  $message="<p>Здравствуйте, ".$user_name."!</p>
								  <p>Вы успешно зарегистрировались в Volume Levels - системе анализа отчетов товарной биржи CME Group.</p>
								  <p>Для ознакомления с возможностями сайта <a href='http://vlevels.ru'>VLevels.ru</a> и программами для торгового терминала, на одну неделю Вам предоставляетя бесплатный демонстрационный доступ.</p>
								  <p>Что бы воспользоваться программами, введите свой адрес электронный почты и ключ в соответствующие поля индикатора.</p>
								  <p>Ключ для программ сервиса: <b>".$key."</b></p>
								  <p>Благодарим Вас за регистрацию, и надеемся что VLevels.ru будет полезен и удобен в использовании.</p>
								  <p>__________________________________</p>
								  <p>С уважением, Сервис Volume Levels<br>Веб сайт: <a href='http://vlevels.ru'>VLevels.ru</a><br>Администратор: <a href='mailto:admin@vlevels.ru'>admin@vlevels.ru</a></p>";
	  	  
		  $to = array();
		  array_push($to, array("email"=>$email, "name" => $user_name));
		  SendMail($to,"info",$subject,$message);
		  
		  require_once "subscrib-list.php";
		  exclude($email,$subList["first_step"]);
		  
          if ($id_visitor != 0) mysql_query("insert into `users_visitors` (`id_user`,`id_visitor`) values ('$id_user','$id_visitor')");
          mysql_close($db_con);

          $response["success"]=1;
          echo json_encode($response);
        }
        else
        {
          $response["email"]=0; //Ошибка. Сообщение: пользователь с таким email уже существует
          echo json_encode($response);
        }
      }
      }
      else
      {
        $response["session"]=0; //Ошибка. Сообщение: сессия не найдена
        echo json_encode($response);
      }
    }
    else
    {
      $response["pass"]=0; //Ошибка. Сообщение: пароли не совпадают
      echo json_encode($response);
    }
  }
  else
  {
    $response["pass"]=-1; //Ошибка. Сообщение о недопустимом пароле
    echo json_encode($response);
  }
?>