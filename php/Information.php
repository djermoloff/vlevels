<?php
global $myrow_auth;
require_once "functions.php";
 if (CheckAuth()!=0)
 	{
 	$response["user_not_found"] = '<p>Пользователь не найден!</p>';
 	logout();
 	echo json_encode($response);
    }
    else
    {
	if (isset($_POST["old_pass"]) && isset($_POST["new_pass"]) && isset($_POST["repeat_pass"]))
		{
        if (md5(trim($_POST["old_pass"])."kGgy3") == $myrow_auth['password'])
	       	{
	    	if (strlen(trim($_POST["new_pass"]))>=6)
			  	{
	    		if (trim($_POST["repeat_pass"]) == trim($_POST["new_pass"]))
			  		{
		  			$pass=md5(trim($_POST["new_pass"])."kGgy3");
	    			$key=md5($myrow_auth['id'].$pass."sdrljty454");
	    			mysql_query("update `users` set `password`='$pass' where `id`='".$myrow_auth['id']."'");
	    			session_start();
	    			$_SESSION["key"]=$key;
	    			$response["success"]=1;
		 			echo json_encode($response);
					}
					else
					{
					$response["pass_not_same"]='<p>Пароли не совпадают!</p>';
		  			echo json_encode($response);
					}
				}
				else
				{
	           	$response["new_pass_incorrect"]='<p>Минимальная длинна пароля 6 символов!</p>';
		  		echo json_encode($response);
				}
	      	}
	       	else
	       	{
	    	$response["old_pass_incorrect"]='<p>Неверный старый пароль!</p>';
	    	echo json_encode($response);
	       	}
		}


	if (isset($_POST["my_info"]))
	   	{
	    $arr = array("name" => $myrow_auth['name'], "surname" => $myrow_auth['surname'], "email" => $myrow_auth['email'], "phone" => $myrow_auth['phone'], "birthday" => $myrow_auth['birthday'],
	        		 "country" => $myrow_auth['country'], "city" => $myrow_auth['city'], "exp_forex" => $myrow_auth['exp_forex'], "get_news" => $myrow_auth['get_news'], "get_refresh" => $myrow_auth['get_refresh'],
	        		 "get_issues" => $myrow_auth['get_issues']);
	    echo json_encode($arr);
	   	}

	if (isset($_POST["my_info_change"]))
	   	{
       	$name = (isset($_POST["name"]) && trim($_POST["name"]) != "") ? "`name`='".trim(mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["name"])))))."'" : "";
       	$surname = (isset($_POST["surname"]) && trim($_POST["surname"]) != "") ? "`surname`='".trim(mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["surname"])))))."'" : "";
       	$phone = (isset($_POST["phone"]) && trim($_POST["phone"]) != "") ? "`phone`='".trim(mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["phone"])))))."'" : "";
       	$birthday = (isset($_POST["birthday"]) && trim($_POST["birthday"]) != "") ? "`birthday`='".date("Y-m-d",strtotime(trim(mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["birthday"])))))))."'" : "";
       	$country = (isset($_POST["country"]) && trim($_POST["country"]) != "") ? "`country`='".trim(mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["country"])))))."'" : "";
       	$city = (isset($_POST["city"]) && trim($_POST["city"]) != "") ? "`city`='".trim(mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["city"])))))."'" : "";
       	$exp_forex = (isset($_POST["exp_forex"]) && trim($_POST["exp_forex"]) != "") ? "`exp_forex`='".trim(mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["exp_forex"])))))."'" : "";
       	$get_news = (isset($_POST["get_news"]) && trim($_POST["get_news"]) != "") ? "`get_news`='".mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["get_news"]))))."'" : "";
       	$get_refresh = (isset($_POST["get_refresh"]) && trim($_POST["get_refresh"]) != "") ? "`get_refresh`='".mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["get_refresh"]))))."'" : "";
       	$get_issues = (isset($_POST["get_issues"]) && trim($_POST["get_issues"]) != "") ? "`get_issues`='".mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["get_issues"]))))."'" : "";
       	$query = $name;
       	$query .= ($query != "" && $surname != "") ? ",".$surname : $surname;
       	$query .= ($query != "" && $phone != "") ? ",".$phone : $phone;
        $query .= ($query != "" && $birthday != "") ? ",".$birthday : $birthday;
        $query .= ($query != "" && $country != "") ? ",".$country : $country;
        $query .= ($query != "" && $city != "") ? ",".$city : $city;
        $query .= ($query != "" && $exp_forex != "") ? ",".$exp_forex : $exp_forex;
        $query .= ($query != "" && $get_news != "") ? ",".$get_news : $get_news;
        $query .= ($query != "" && $get_refresh != "") ? ",".$get_refresh : $get_refresh;
        $query .= ($query != "" && $get_issues != "") ? ",".$get_issues : $get_issues;

        mysql_query("update `users` set ".$query." where `id`='".$myrow_auth['id']."'");
        $response["success"]=1;
		echo json_encode($response);
	   	}

	if (isset($_POST["referal_program"]))
	   	{
		$result=mysql_query("select `use_partner_program` from `users` where `id`='".$myrow_auth['id']."' and `use_partner_program`='1'");
	    if (mysql_num_rows($result))
	        {
	        $arr= array();
	        $ref_link="http://".$_SERVER['HTTP_HOST']."/?refer=".$myrow_auth['id']; //реферальная ссылка пользователя
	        array_push($arr, $ref_link);

			$result=mysql_query("select count(*) from `visitors` where `refer`='".$myrow_auth['id']."'");
	        $data=mysql_fetch_array($result);
	    	$visits_refer=(int)$data[0]; //кол-во переходов по реферальной ссылке

	        $result=mysql_query("select count(*) from `users` where `refer`='".$myrow_auth['id']."'");
	        $data=mysql_fetch_array($result);
	        $regs_refer=(int)$data[0]; //кол-во регистраций по реферальной ссылке
	        array_push($arr, array("_visits_refer" => $visits_refer, "_regs_refer" => $regs_refer));

	        $result=mysql_query("select * from `partner_program` where `_id_user`='".$myrow_auth['id']."'");
	        while ($rows=mysql_fetch_array($result))
	            {
	            if ($rows['_checked'] == '1')
	              	{
					$sum = 0;
					$r_pay = mysql_query("SELECT _amount FROM partners_pay WHERE _get_http='".$rows['_id'] ."'");
					while ($m_pay = mysql_fetch_array($r_pay)) $sum += $m_pay['_amount'];
	            	$res_visits=mysql_query("select `id` from `visitors` where `http_refer` LIKE '%".$rows['_site']. "%'");
			        $visits_site=0;
			        $regs_site=0;
			    	while ($rows_visits=mysql_fetch_array($res_visits))
			    		{
			    		$visits_site++;  //кол-во переходов по ссылке с этого сайта
			    		$res_regs=mysql_query("select count(*) from `users_visitors` where `id_visitor`='".$rows_visits['id']."' and `id_user`<>'".$myrow_auth['id']."'");
	                    $data=mysql_fetch_array($res_regs);
			    		$regs_site += (int)$data[0]; //кол-во зарегистрированных посетителей с этого сайта
			    		}
			    	array_push($arr, array("_site" => $rows['_site'], "_status" => $rows['_checked'], "_visits_site" => $visits_site, "_regs_site" => $regs_site, "_sum" => $sum));
	               	}
	               	else
	               	{
	           		array_push($arr, array("_site" => $rows['_site'], "_status" => $rows['_checked']));
	               	}
	            }
            echo json_encode($arr);
	        }
	        else
	        {
	        $response["not_active"]=1;
	       	echo json_encode($response);
	        }
	   	}

	if (isset($_POST["use_partner_program"]))
	   	{
       	mysql_query("update `users` set `use_partner_program`='1' where `id`='".$myrow_auth['id']."'");
	    $arr= array();
       	$ref_link="http://".$_SERVER['HTTP_HOST']."/lk/registration.php?refer=".$myrow_auth['id']; //реферальная ссылка пользователя
       	array_push($arr, $ref_link);
	    array_push($arr, array("_visits_refer" => 0, "_regs_refer" => 0));
	    echo json_encode($arr);
	    }


	if (isset($_POST["add_site"]))
	   	{
   		$site=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["add_site"]))));
        $url_arr=parse_url($site);

        if (isset($url_arr['scheme']) && isset($url_arr['host']))
			{
		    $url=$url_arr['scheme']."://".$url_arr['host'];

		    $result=mysql_query("select `_id` from `partner_program` where `_site`='$url'");
		    if (!mysql_num_rows($result))
				{
				mysql_query("insert into `partner_program` (`_id_user`,`_site`,`_checked`) values ('".$myrow_auth['id']."','$url','0')");

			    $response["_site"]=$url;
				echo json_encode($response);
				}
				else
				{
				$response["site_is_exist"]='<p>Данный сайт уже используется!</p>';
				echo json_encode($response);
				}
			}
			else
			{
			$response["invalid_format"]='<p>Неверный формат адреса сайта!</p>';
			echo json_encode($response);
	       	}
	   	}

	if (isset($_POST["check_site"]) && isset($_POST["check_number"]))
	   	{
      	$site=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["check_site"]))));
       	$check_number=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["check_number"]))));

        $handle=@fopen($site."/".parse_url($site,PHP_URL_HOST).".txt", "r");

		if ($handle)
			{
		    $content = trim(fgets($handle));
		    if ($content == $check_number)
		    	{
		    	mysql_query("update `partner_program` set `_checked`='1' where `_id_user`='".$myrow_auth['id']."' and `_site`='$site'");

		        $result=mysql_query("select `id` from `visitors` where `http_refer`='$site'");
		        $visits_site=0;
		        $regs_site=0;
		    	while ($rows=mysql_fetch_array($result))
		    		{
		    		$visits_site++;  //кол-во переходов по ссылке с этого сайта
		    		$res=mysql_query("select count(*) from `users_visitors` where `id_visitor`='".$rows['id']."' and `id_user`<>'".$myrow_auth['id']."'");
		    		$data=mysql_fetch_array($res);
		    		$regs_site += (int)$data[0]; //кол-во зарегистрированных посетителей с этого сайта
		    		}

				$arr = array("_status" => '1', "_visits_site" => $visits_site, "_regs_site" => $regs_site);
                echo json_encode($arr);
	    		}
	    		else
	    		{
    			$response["status"] = 0;
    			echo json_encode($response);
				}
			}
		   	else
		   	{
		   	$response["status"] = 0;
		    echo json_encode($response);
		  	}
	    }


	if (isset($_POST["logout"]))
	   	{
		session_unset();
	   	$response['success']=1;
	   	echo json_encode($response);
	   	}

	if (isset($_POST["my_cash"]))
	   	{
        $arr=array(array("_active_date" => $myrow_auth['active_date']));
		array_push($arr, array("_balance" => $myrow_auth['balance']));
  		$result=mysql_query("select FROM_UNIXTIME(`_date`,'%d.%m.%Y') as `_dat`,`_payment_type`,`_amount`,`_request` from `payment` where `_id_user`='".$myrow_auth['id']."'");
  		while($rows=mysql_fetch_array($result))	array_push($arr, array("_date" => $rows['_dat'], "_payment_type" => $rows['_payment_type'], "_amount" => $rows['_amount'], "_request" => $rows['_request']));
  		echo json_encode($arr);
	   	}

	if (isset($_POST["promo_code"]))
		{
		$promo_code=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["promo_code"]))));
  		$result=mysql_query("select * from `promo_code` where `code`='$promo_code'");
  		if (mysql_num_rows($result))
			{
			$data=mysql_fetch_array($result);
  			if ($data['act_date'] >= date('Y-m-d'))
				{
  				if ((int)$data['act_count'] > 0)
					{
                 	mysql_query("update `promo_code` set `act_count`='".((int)($data['act_count']) - 1)."' where `id`='".$data['id']."'");
                 	$res=mysql_query("select `active_date` from `users` where `id`='".$myrow_auth['id']."'");
                 	$dat=mysql_fetch_array($res);
                 	if ((int)$dat['active_date'] > time())
	                 		$active_date = (int)$dat['active_date'] + (int)($data['act_period'])*30*24*60*60;
	                	else
	                		$active_date = time() + (int)($data['act_period'])*30*24*60*60;

                    mysql_query("update `users` set `active`='1',`active_date`='$active_date' where `id`='".$myrow_auth['id']."'");
                	$response['_active_date'] = $active_date;
  					echo json_encode($response);
	  				}
	  				else
	  				{
  					$response['count_expired'] = '<p>Промо код не имеет активаций!</p>';
  					echo json_encode($response);
	  				}
	  			}
	  			else
	  			{
	  			$response['date_expired'] = '<p>Срок действия промо кода истек!</p>';
	  			echo json_encode($response);
	  			}
	  		}
	  		else
	  		{
	  			$response['not_exist'] = '<p>Промо код не найден!</p>';
	  			echo json_encode($response);
	  		}
		}
	}
?>
