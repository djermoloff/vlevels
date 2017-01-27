<?php

if (substr($_SERVER['HTTP_REFERER'],0,44) != "http://cabinet.vlevels.ru/analytics-item.php" && 
	substr($_SERVER['HTTP_REFERER'],0,39) != "http://cabinet.vlevels.ru/analytics.php" && 
	substr($_SERVER['HTTP_REFERER'],0,34) != "http://cabinet.vlevels.ru/post.php" &&
	substr($_SERVER['HTTP_REFERER'],0,50) != "http://cabinet.volume-levels.ru/analytics-item.php" && 
	substr($_SERVER['HTTP_REFERER'],0,45) != "http://cabinet.volume-levels.ru/analytics.php" && 
	substr($_SERVER['HTTP_REFERER'],0,40) != "http://cabinet.volume-levels.ru/post.php") exit();
	
require_once "functions.php";
global $myrow_auth;
global $db_con;

if (CheckAuth()!=0)
 	{
 	$response["user_not_found"] = '<p>Не авторизирован!</p>';
	session_unset();
 	echo json_encode($response);
    }
    else
    {
	if ($myrow_auth['active_tariff'] > 0) $m_tariff = mysql_fetch_array(mysql_query("SELECT * FROM tariffs WHERE _id='".$myrow_auth['active_tariff']."'"));
	mysql_select_db(DB_NAME_CME,$db_con);
	if (isset($_POST["valut_id"]))
		{
		switch ($_POST["valut_id"])
			{
	    	case "eur":	{ $valut_id="EURUSD"; break;}
	    	case "gbp":	{ $valut_id="GBPUSD"; break;}
	        case "jpy":	{ $valut_id="USDJPY"; break;}
	        case "chf":	{ $valut_id="USDCHF"; break;}
	        case "gold": { $valut_id="XAUUSD"; break;}
	        case "xau": { $valut_id="XAUUSD"; break;}
	        case "cad":	{ $valut_id="USDCAD"; break;}
	        case "aud":	{ $valut_id="AUDUSD"; break;}
	        default: $valut_id="";
			}

		$result=mysql_query("select `_option_month` from `cme_options` where `_symbol`='$valut_id' AND _e_time>0");
		$response["months"]='<ul id="item-months" class="item_open">';
		while ($rows=mysql_fetch_object($result))
			{
			$response["months"]=$response["months"].'<li class="item-month" id="'.$valut_id.'_'.$rows->_option_month.'">'.$rows->_option_month.'</li>';
			}
		$response["months"]=$response["months"].'</ul>';
		echo json_encode($response['months']);
		mysql_close($db_con);
		}
	
	if (isset($_POST["symbol"]))
		{			
		if ($myrow_auth['active_date'] < time())
			{
			$msg = "<p>Для получения доступа к архиву необходимо оплатить выбранный Вами тарифный план.</p>
					<p>Для открытия доступа к архиву бюллетеней Вам необходимо активировать тарифный план: <b>Lite</b> для возможности просматривать текущий опционный месяц, <b>Professional</b> для просмотра 6 последних месяцев истории или <b>VIP</b> для просмотра полного архива с 2008 года.";
			$select_plan = 1;
			if ($myrow_auth['active_tariff'] == 0) $title = "Пробный период закончен"; else $title = "Истек срок активации аккаунта";
			$response = array("success"=>"limits-of-tariff","title"=>$title,"message"=>$msg,"select"=>$select_plan);
			echo json_encode($response);
			exit(); 
			}
				
		$list_element=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["symbol"]))));
		if (isset($_POST['pr'])) 
			{
			if ($myrow_auth['active_tariff'] == 0 || $myrow_auth['active_tariff'] == 1) 
				{
				$msg = "<p>Возможности демонстрационного доступа ограничены! Вы не можете просматривать историю бюллетеней.</p>";
				if ($myrow_auth['active_tariff'] == 1) $msg = "<p>Возможности тарифа Lite ограничены! Вы не можете просматривать историю бюллетеней.</p>";
				$msg .= "<p>Для открытия доступа к истории Вам необходимо активировать тарифный план: <b>Professional</b> для просмотра 6-ти последних месяцев истории или <b>VIP</b> для просмотра полного архива с 2008 года.";
				$select_plan = 3;
				$title = "Ограничения тарифа";
				$response = array("success"=>"limits-of-tariff","title"=>$title,"message"=>$msg,"select"=>$select_plan);
				echo json_encode($response);
				exit(); 
				}
		
			$r = "`_option_month`='".mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["pr"]))))."'";
			}
			else $r = "`_expiration`>'".time()."' order by _expiration asc limit 1";
			
		$result=mysql_query("select `_id`,FROM_UNIXTIME(`_expiration`,'%d.%m.%Y'),`_option_month`,`_e_time` from `cme_options` where `_symbol`='$list_element' and ".$r);
		$data=mysql_fetch_array($result);
		
		$response['valut_id']=$list_element;
		$response['date_exp']=$data[1];
			
		$y = date("Y")-1;
		$ty = time() - 86400*365;
		if ($myrow_auth['active_tariff'] == 2 && strtotime($data[1]) < $ty) 
			{
			$msg = "<p>Возможности тарифа Professional ограничены! В рамках данного тарифа Вам доступен архив за последние 12 месяцев.</p>";
			$msg .= "<p>Для открытия доступа к полному архиву данных Вам необходимо активировать тарифный план: <b>VIP</b> для просмотра полного архива с 2008 года.";
			$select_plan = 3;
			$title = "Ограничения тарифа";
			$response = array("success"=>"limits-of-tariff","title"=>$title,"message"=>$msg,"select"=>$select_plan);
			echo json_encode($response);
			exit(); 
			}
			
		$response['prefix']=$data[2];
		$_SESSION["option"]=$data[0];
		
		$result=mysql_query("select FROM_UNIXTIME(`_date`,'%d.%m.%Y'),`_total_oi_call`,`_total_oi_put`,`_total_volume_call`,`_total_volume_put`,`_change_oi_call`,`_change_oi_put`
							 from `cme_bill_".strtolower($list_element)."_total` where `_option`='$data[0]' and `_date`='".$data['_e_time']."' order by `_date` desc");
		$data=mysql_fetch_array($result);
		$response['data_date']=$data[0];
		

		$_SESSION["date_value"]=$data[0];
		$response['_total_oi_call']=$data[1];
		$response['_total_oi_put']=$data[2];
		$response['_total_volume_call']=$data[3];
		$response['_total_volume_put']=$data[4]; 
		$response['_change_oi_call']=$data[5];
		$response['_change_oi_put']=$data[6];
		$response['success'] = "ok";
		
		$result=mysql_query("select `_option_month`,`_expiration` from `cme_options` where `_symbol`='$list_element' AND _e_time>0");
		$months='';
		while ($rows=mysql_fetch_array($result))
			{
			$months.="<li class='item-month' id='".$rows['_option_month']."'>".$rows['_option_month']." <span>".date("m/d",$rows['_expiration'])."</span></li>";
			}
		$response['months']=$months;
		echo json_encode($response);
		mysql_close($db_con);
		}
		
	if (isset($_POST["date"]))
		{
    	$date_value=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["date"]))));
	    $_SESSION["date_value"]=$date_value;
	    if (isset($_SESSION["option"]))
	    	{
		   	$option=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_SESSION["option"]))));

		    $result=mysql_query("select `_symbol` from `cme_options` where `_id`='$option'");
		    if (mysql_num_rows($result))
			    {
	           	$data=mysql_fetch_array($result);
	           	$result=mysql_query("select * from `cme_bill_".strtolower($data["_symbol"])."_total` where `_option`='$option' and FROM_UNIXTIME(`_date`,'%d.%m.%Y')='$date_value'");
	           	if (mysql_num_rows($result))
	            	{
	           		$data=mysql_fetch_array($result);
	           		$response['_total_oi_call']=$data['_total_oi_call'];
					$response['_total_oi_put']=$data['_total_oi_put'];
					$response['_total_volume_call']=$data['_total_volume_call'];
					$response['_total_volume_put']=$data['_total_volume_put'];
					$response['_change_oi_call']=$data['_change_oi_call'];
					$response['_change_oi_put']=$data['_change_oi_put'];
					echo json_encode($response);
	            	}
	            	else
	            	{
	            	$response["not_found"]='<p>Нет отчета за указанную дату!</p>';
					echo json_encode($response);
	            	}
				}
				else
				{
				$response["not_found"]='<p>Опционный месяц не найден!</p>';
				echo json_encode($response);
				}
			mysql_close($db_con);
			}
			else
			{
			$response["not_found"]='<p>Сессия не найдена!</p>';
			echo json_encode($response);
			}
		}
	if (isset($_POST["type_report"]))
		{
		if (isset($_SESSION["option"]))
			{
			$option=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_SESSION["option"]))));
			$result=mysql_query("select `_symbol` from `cme_options` where `_id`='$option'");
	        if (mysql_num_rows($result))
		        {
				$data=mysql_fetch_array($result);
				switch ($_POST["type_report"])
					{
			    	case "1":
			       		$select="select FROM_UNIXTIME(`_date`,'%d.%m.%Y') as `_dat`,`_total_oi_call`,`_total_oi_put`
			       			from `cme_bill_".strtolower($data["_symbol"])."_total` where `_option`='$option' order by `_date` asc";
			       		break;
			    	case "2":
			       		$select="select FROM_UNIXTIME(`_date`,'%d.%m.%Y') as `_dat`,`_change_oi_call`,`_change_oi_put`
			       			from `cme_bill_".strtolower($data["_symbol"])."_total` where `_option`='$option' order by `_date` asc";
			       		break;
			       	case "3":
			       		$select="select FROM_UNIXTIME(`_date`,'%d.%m.%Y') as `_dat`,`_total_volume_call`,`_total_volume_put`
			       			from `cme_bill_".strtolower($data["_symbol"])."_total` where `_option`='$option' order by `_date` asc";
			       		break;
			    	case "4":
			       		$select="select FROM_UNIXTIME(`_date`,'%d.%m.%Y') as `_dat`,`_total_volume_call`+`_total_volume_put` as `_total_volume_call_put`
			       			from `cme_bill_".strtolower($data["_symbol"])."_total` where `_option`='$option' order by `_date` asc";
			       		break;
			        default:
			           	$select="";
					}
	            if ($select!="")
		            {
	           		$arr=array();
	           		$result=mysql_query($select);
	           		while ($rows=mysql_fetch_array($result)) array_push($arr,$rows);
                    echo json_encode($arr);
		            }
		            else
		            {
		            $response["report_error"]='<p>Р“СЂР°С„РёРє РЅРµ СЃСѓС‰РµСЃС‚РІСѓРµС‚!</p>';
					echo json_encode($response);
		            }
		        }
		        else
		        {
		        $response["session_error"]='<p>РЎРµСЃСЃРёСЏ РЅРµ РЅР°Р№РґРµРЅР°!</p>';
				echo json_encode($response);
		        }
			mysql_close($db_con);
			}
			else
			{
			$response["session_error"]='<p>РЎРµСЃСЃРёСЏ РЅРµ РЅР°Р№РґРµРЅР°!</p>';
			echo json_encode($response);
			}
		}
	if (isset($_POST["filter_type"]))
		{
		if (isset($_SESSION["option"]) && isset($_SESSION["date_value"]))
			{
			$option=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_SESSION["option"]))));
			$date_value=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_SESSION["date_value"]))));
			
			$result=mysql_query("select `_symbol`,`_option_month` from `cme_options` where `_id`='$option'");
			if (mysql_num_rows($result))
			    {
			   	$data=mysql_fetch_array($result);
			   	$symbol=$data['_symbol'];
			   	$option_month=$data['_option_month'];
			   	$result=mysql_query("select `_date` from `cme_bill_".strtolower($symbol)."_".strtolower($data['_option_month'])."` where FROM_UNIXTIME(`_date`,'%d.%m.%Y')='$date_value'");
				
			    if (mysql_num_rows($result))
			      	{
					switch ($_POST["filter_type"])
						{
					    case "1": $filter_type=" and `_type`='0'"; break;
					    case "2": $filter_type=" and `_type`='1'"; break;
					    default: $filter_type=" and (`_type`='0' or `_type`='1')";
						}

					$oi_val = (isset($_POST["oi_val"]) && trim($_POST["oi_val"]) != "") ? " and `_oi`>'".mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["oi_val"]))))."'" : "";
					$volume_val = (isset($_POST["volume_val"]) && trim($_POST["volume_val"]) != "") ? " and `_volume`>'".mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["volume_val"]))))."'" : "";
					$coi_val = (isset($_POST["coi_val"]) && trim($_POST["coi_val"]) != "") ? " and `_coi`>'".mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["coi_val"]))))."'" : "";

			        $result=mysql_query("select `_id`,`_type`,`_strike`,`_reciprocal`,`_volume`,`_oi`,`_coi`,`_delta`,`_print` from `cme_bill_".strtolower($symbol)."_".strtolower($data['_option_month'])."` where FROM_UNIXTIME(`_date`,'%d.%m.%Y')='$date_value'".$filter_type.$oi_val.$volume_val.$coi_val);
			        if (mysql_num_rows($result))
			      		{
						mysql_select_db(DB_NAME,$db_con);
	                   	$arr=array();
		                while ($rows=mysql_fetch_array($result))
		         			{
               				$res=mysql_query("select `_id`,`_id_bill`,`_date`,`_line_color`,`_line_type`,`_line_weight`,`_cur_day` from `indicator_level` where `_id_user`='".$myrow_auth['id']."' and `_option`='$option' and (`_id_bill`='".$rows['_id']."' OR (`_date`<'".date("Y-m-d",strtotime($date_value))."' AND `_strike`='".$rows['_strike']."' AND `_type`='".$rows['_type']."' AND `_cur_day`='0'))");
               				if (mysql_num_rows($res)>0)
                 				{
               					$data=mysql_fetch_array($res);
               					$arr_checkbox=array("_checkbox" => '1', "_checkbox_id_bill" => $data['_id_bill'], "_checkbox_date" => date("d.m.Y",strtotime($data['_date'])), "_line_color" => $data['_line_color'], "_line_type" => $data['_line_type'], "_line_weight" => $data['_line_weight'], "_cur_day_checkbox" => $data['_cur_day']);
		                 		}
		                 		else $arr_checkbox=array("_checkbox" => '0');

	                        $res=mysql_query("select `_id`,`_id_bill`,`_date`,`_comment`,`_cur_day` from `indicator_comment` where `_id_user`='".$myrow_auth['id']."' and `_option`='$option' and (`_id_bill`='".$rows['_id']."' OR (`_date`<'".date("Y-m-d",strtotime($date_value))."' AND `_strike`='".$rows['_strike']."' AND `_type`='".$rows['_type']."' AND `_cur_day`='0'))");
		           			if (mysql_num_rows($res))
		          				{
		       					$data=mysql_fetch_array($res);
		       					$arr_flag=array("_flag" => '1', "_comment_id_bill" => $data['_id_bill'], "_comment_date" => date("d.m.Y",strtotime($data['_date'])), "_comment" => $data['_comment'], "_cur_day_flag" => $data['_cur_day']);
		           				}
		           				else $arr_flag=array("_flag" => '0');
								
							array_push($arr,array("_id" => $rows['_id'],"_symbol" => $symbol,"_option" => $option,"_option_month" => $option_month,"_date" => $date_value,"_type" => $rows['_type'],
												  "_strike" => $rows['_strike'],"_reciprocal" => $rows['_reciprocal'],"_volume" => $rows['_volume'],"_oi" => $rows['_oi'],"_coi" => $rows['_coi'],
												  "_delta" => $rows['_delta'],"_price" => get_price($symbol,$rows['_strike'],$rows['_reciprocal'],$rows['_type']),"_print" => $rows['_print']) + $arr_checkbox + $arr_flag);
		                 	}
		                echo json_encode($arr);
		             	}
		             	else
		             	{
						$response["data_not_exist"]='<p>Нет данных за выбраный день!</p>';
						echo json_encode($response);
			           	}
			       	}
			       	else
			       	{
			       	$response["data_not_exist"]='<p>Нет данных за выбраный день!</p>';
					echo json_encode($response);
					}
		  		}
		  		else
		  		{
		  		$response["data_not_exist"]='<p>Опционный месяц не найден!</p>';
				echo json_encode($response);
		  		}
		  	mysql_close($db_con);
			}
			else
			{
			$response["session_error"]='<p>Нет сессии!</p>';
			echo json_encode($response);
			}
		}
		
	if (isset($_POST["row_id"]))
		{
		if (isset($_SESSION["option"]) && isset($_SESSION["date_value"]))
			{
			if ($myrow_auth['active_date'] < time()) exit;
				
			if ($myrow_auth['active_tariff'] != 0 && $m_tariff['_cp_level_grafics'] == false) 
				{
				$msg = "<p>Доступ к графическому анализу на уровнях ограничен на Вашем тарифном плане.</br>";
				$msg .= "Для открытия доступа к графикам Вам необходимо активировать тарифный план: <b>Professional</b> или <b>VIP</b>.";
				$select_plan = 2;
				$title = "Ограничения тарифа";
				$response = array("success"=>"limits-of-tariff","title"=>$title,"message"=>$msg,"select"=>$select_plan);
				echo json_encode($response);
				exit(); 
				}
					
			$option=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_SESSION["option"]))));
			$date_value=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_SESSION["date_value"]))));

			$result=mysql_query("select `_symbol`,`_option_month` from `cme_options` where `_id`='".$option."'");
			if (mysql_num_rows($result))
			    {
			   	$data=mysql_fetch_array($result);
			   	$symbol=$data['_symbol'];
				$month=$data['_option_month'];
		    	$row_id=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["row_id"]))));

		    	$result=mysql_query("select * from `cme_bill_".strtolower($symbol)."_".strtolower($data['_option_month'])."` where `_id`='".$row_id."'");
		    	if (mysql_num_rows($result))
			    	{
		    		$data=mysql_fetch_array($result);
		    		$result=mysql_query("select FROM_UNIXTIME(`_date`,'%d.%m.%Y') as `_dat`,`_type`,`_volume`,`_oi`,`_coi` from `cme_bill_".strtolower($symbol)."_".strtolower($month)."`
		    							 where `_date` <= '".strtotime($date_value)."' and `_strike`='".$data['_strike']."' order by `_date` asc");
			    	if (mysql_num_rows($result))
			    		{
						$arr=array("success"=>"ok");
						while ($rows=mysql_fetch_array($result)) array_push($arr,array("_date" => $rows['_dat'], "_type" => $rows['_type'], "_volume" => $rows['_volume'], "_oi" => $rows['_oi'], "_coi" => $rows['_coi']));
						echo json_encode($arr);
						}
						else
						{
						$response["data_not_exist"]="<p>Ошибка отчета!</p>";
						echo json_encode($response);
						}
					}
					else
					{
					$response["data_not_exist"]='<p>Нет данных на текущем страйке!</p>';
					echo json_encode($response);
					}
				}
				else
				{
				$response["data_not_exist"]='<p>Отчетный месяц не найден!</p>';
				echo json_encode($response);
				}
			}
			else
			{
			$response["session_error"]='<p>Сессия не найдена!</p>';
			echo json_encode($response);
			}
		}

	if (isset($_POST['id_save_lvl']) || (isset($_POST['id_delete_lvl'])))
		{
		if (isset($_SESSION["option"]) && isset($_SESSION["date_value"]))
			{
			if ($myrow_auth['active_date'] < time()) exit;
				
			if ($myrow_auth['active_tariff'] > 0 && $m_tariff['_cp_send_level'] == false) 
				{
				$msg = "<p>Доступ к функционалу ограничен настройками Вашего тарифного плана.</br>";
				$msg .= "Для открытия доступа к отправке уровней в индикатор и использованию индикатора <b>CME VLevels</b> Вам необходимо активировать таривный план <b>VIP</b>.";
				$select_plan = 3;
				$title = "Ограничения тарифа";
				$response = array("success"=>"limits-of-tariff","title"=>$title,"message"=>$msg,"select"=>$select_plan);
				echo json_encode($response);
				exit(); 
				}
			$option=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_SESSION["option"]))));
			$date_value=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_SESSION["date_value"]))));

			$result=mysql_query("select `_symbol` from `cme_options` where `_id`='$option'");
		    if (mysql_num_rows($result))
		        {
				mysql_select_db(DB_NAME,$db_con);
		  		$data=mysql_fetch_array($result);
                $symbol=$data['_symbol'];

	       		if (isset($_POST['id_save_lvl']))
		       		{
					$id_bill=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["id_save_lvl"]))));
		       		$type=(isset($_POST["type"])) ? mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["type"])))) : "";
		       		$strike=(isset($_POST["strike"])) ? mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["strike"])))) : "";
		       		$color=(isset($_POST["color"])) ? mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["color"])))) : "";
		       		$line_type=(isset($_POST["line_type"])) ? mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["line_type"])))) : "";
		       		$line_weight=(isset($_POST["line_weight"])) ? mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["line_weight"])))) : "";
		       		$checkbox=(isset($_POST["checked"])) ? mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["checked"])))) : "";
			       	if ($type != "" && $strike != "" && $color != "" && $line_type != "" && $line_weight != "" && $checkbox != "")
				       	{
			       		$result=mysql_query("select * from `indicator_level` where `_id_user`='".$myrow_auth['id']."' and `_option`='$option' and `_id_bill`='$id_bill'");
			       		if (mysql_num_rows($result))
				       		{
                       		mysql_query("update `indicator_level` set `_line_color`='$color',`_line_type`='$line_type',`_line_weight`='$line_weight', `_cur_day`='$checkbox'
                           					 where `_id_user`='".$myrow_auth['id']."' and `_option`='$option' and `_id_bill`='$id_bill'");
                       		$response["success"]="ok";
       						echo json_encode($response);
				       		}
				       		else
				       		{
                           	mysql_query("insert into `indicator_level` (`_id_user`,`_id_bill`,`_type`,`_option`,`_date`,`_strike`,`_line_color`,`_line_type`,`_line_weight`,`_cur_day`)
                           				 values ('".$myrow_auth['id']."','$id_bill','$type','$option','".date("Y-m-d",strtotime($date_value))."','$strike','$color','$line_type','$line_weight','$checkbox')");
							echo mysql_error();
                           	$response["success"]="ok";
       						echo json_encode($response);
				       		}
						}
						else
						{
						$response["data_not_exist"]='<p>РќРµС‚ РґР°РЅРЅС‹С…!</p>';
						echo json_encode($response);
						}
					}
					else
					{
	                $id_bill=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["id_delete_lvl"]))));
	                $type=(isset($_POST["type"])) ? mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["type"])))) : "";
	                $strike=(isset($_POST["strike"])) ? mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["strike"])))) : "";
	                $checkbox=(isset($_POST["checked"])) ? mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["checked"])))) : "";
	                if ($type != "" && $strike != "" && $checkbox != "")
					   	{
                       	mysql_query("delete from `indicator_level` where `_id_user`='".$myrow_auth['id']."' and `_option`='$option' and `_id_bill`='$id_bill'");
                       	if (mysql_affected_rows())
                       		$response["success"]=1;
                          	else
                       		$response["data_not_exist"]='<p>РќРµС‚ РґР°РЅРЅС‹С…!</p>';
         				echo json_encode($response);
						}
						else
						{
	                   	$response["data_not_exist"]='<p>РќРµС‚ РґР°РЅРЅС‹С…!</p>';
						echo json_encode($response);
						}
	                }
				}
				else
				{
				$response["session_error"]='<p>РЎРµСЃСЃРёСЏ РЅРµ РЅР°Р№РґРµРЅР°!</p>';
				echo json_encode($response);
				}
			}
			else
			{
			$response["session_error"]='<p>РЎРµСЃСЃРёСЏ РЅРµ РЅР°Р№РґРµРЅР°!</p>';
			echo json_encode($response);
			}
		}

 	if (isset($_POST['id_save_comment']) || (isset($_POST['id_delete_comment'])))
		{
		if (isset($_SESSION["option"]) && isset($_SESSION["date_value"]))
			{
			if ($myrow_auth['active_date'] < time()) exit;
				
			if ($myrow_auth['active_tariff'] > 0 && $m_tariff['_cp_comment'] == false)
				{
				$msg = "<p>Доступ к функционалу ограничен настройками Вашего тарифного плана.</br>";
				$msg .= "Для открытия доступа к сохранению пользовательских комментариев Вам необходимо активировать таривный план <b>VIP</b>.";
				$select_plan = 3;
				$title = "Ограничения тарифа";
				$response = array("success"=>"limits-of-tariff","title"=>$title,"message"=>$msg,"select"=>$select_plan);
				echo json_encode($response);
				exit(); 
				}
			$option=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_SESSION["option"]))));
			$date_value=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_SESSION["date_value"]))));

			$result=mysql_query("select `_symbol` from `cme_options` where `_id`='$option'");
	        if (mysql_num_rows($result))
		        {
				mysql_select_db(DB_NAME,$db_con);
		  		$data=mysql_fetch_array($result);
                $symbol=$data['_symbol'];
	       		if (isset($_POST['id_save_comment']))
		       		{
		       		$id_bill=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["id_save_comment"]))));
		       		$type=(isset($_POST["type"])) ? mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["type"])))) : "";
		       		$strike=(isset($_POST["strike"])) ? mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["strike"])))) : "";
		       		$comment=(isset($_POST["comment"])) ? mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["comment"])))) : "";
		       		$checkbox=(isset($_POST["checked"])) ? mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["checked"])))) : "";
			       	if ($type != "" && $strike != "" && $comment != "" && $checkbox != "")
				       	{
			       		$result=mysql_query("select * from `indicator_comment` where `_id_user`='".$myrow_auth['id']."' and `_option`='$option' and `_id_bill`='$id_bill'");
			       		if (mysql_num_rows($result))
							{
                           	mysql_query("update `indicator_comment` set `_comment`='$comment', `_cur_day`='$checkbox' where `_id_user`='".$myrow_auth['id']."' and `_option`='$option' and `_id_bill`='$id_bill'");
                           	$response["success"]="ok";
          					echo json_encode($response);
					       	}
					       	else
					       	{
							mysql_query("insert into `indicator_comment` (`_id_user`,`_id_bill`,`_type`,`_option`,`_date`,`_strike`,`_comment`,`_cur_day`)
		                        			 values ('".$myrow_auth['id']."','$id_bill','$type','$option','".date("Y-m-d",strtotime($date_value))."','$strike','$comment','$checkbox')");
		                    $response["success"]="ok";
		          			echo json_encode($response);
					       	}
						}
						else
						{
						$response["data_not_exist"]='<p>РќРµС‚ РґР°РЅРЅС‹С…!</p>';
						echo json_encode($response);
						}
					}
					else
					{
	                $id_bill=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["id_delete_comment"]))));
	                $type=(isset($_POST["type"])) ? mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["type"])))) : "";
	                $strike=(isset($_POST["strike"])) ? mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["strike"])))) : "";
	                $checkbox=(isset($_POST["checked"])) ? mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["checked"])))) : "";
	                if ($type != "" && $strike != "" && $checkbox != "")
					   	{
	                    mysql_query("delete from `indicator_comment` where `_id_user`='".$myrow_auth['id']."' and `_option`='$option' and `_id_bill`='$id_bill'");
	                    if (mysql_affected_rows())
	                       	$response["success"]="ok";
	                       	else
	                      	$response["data_not_exist"]='<p>РќРµС‚ РґР°РЅРЅС‹С…!</p>';
		         		echo json_encode($response);
						}
						else
						{
	                   	$response["data_not_exist"]='<p>РќРµС‚ РґР°РЅРЅС‹С…!</p>';
						echo json_encode($response);
						}
					}
				}
				else
				{
				$response["session_error"]='<p>РЎРµСЃСЃРёСЏ РЅРµ РЅР°Р№РґРµРЅР°!</p>';
				echo json_encode($response);
				}
			}
			else
			{
			$response["session_error"]='<p>РЎРµСЃСЃРёСЏ РЅРµ РЅР°Р№РґРµРЅР°!</p>';
			echo json_encode($response);
			}
		}
	}
?>