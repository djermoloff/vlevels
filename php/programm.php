<?php
    require_once "functions.php";
 	if (CheckAuth()!=0)
 	{
 		$response["user_not_found"] = '<p>Пользователь не найден!</p>';
 		logout();
 		echo json_encode($response);
    }
    else
    {
    function GetPage($page_index,$rows_in_page)
	    {
		global $myrow_auth;
		$arr = array();
	    $result = mysql_query("select * from `support_problems` where `_id_user`='".$myrow_auth['id']."' order by `_id` asc limit ".(($page_index - 1) * $rows_in_page).",$rows_in_page");
		while ($rows=mysql_fetch_array($result))
			{
	       	if (($rows['_status'] != 'close') && ((time() - strtotime($rows['_date_open']))/(60*60*24) > 5))
	    		{
				mysql_query("update `support_problems` set `_status`='close' where `_id`='".$rows['_id']."'");
				$rows['_status'] = 'close';
	    		}
           	array_push($arr,array("_id" => $rows['_id'], "_id_user" => $rows['_id_user'], "_type" => $rows['_type'], "_title" => $rows['_title'], "_text" => substr($rows['_text'],0,230).'...', "_status" => $rows['_status'], "_date" => $rows['_date']));
			}
       	return $arr;
	    }

	if (isset($_POST["support"]))
		{
	    $result = mysql_query("select count(*) from `support_problems` where `_id_user`='".$myrow_auth['id']."'");
	    $data = mysql_fetch_array($result);
	    $pages_count = ceil($data[0] / 10);
	    $arr = array();
	    if ($pages_count > 0) $arr = GetPage($pages_count,10);
	    array_unshift($arr,array("_pages_count" => $pages_count));
	    echo json_encode($arr);
		}

	if (isset($_POST["page_index"]))
		{
		$page_index=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["page_index"]))));
		echo json_encode(GetPage($page_index,10));
		}

	if (isset($_POST["type_support"]) && isset($_POST["title_support"]) && isset($_POST["text_support"]))
		{
		$type_support=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["type_support"]))));
		$title_support=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["title_support"]))));
		$text_support=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["text_support"]))));
   		mysql_query("insert into `support_problems` (`_id_user`,`_type`,`_title`,`_text`,`_status`,`_date`,`_date_open`)
		                            		 values ('".$myrow_auth['id']."','$type_support','$title_support','$text_support','new','".date("Y-m-d H:i:s")."','".date("Y-m-d H:i:s")."')");

		$result = mysql_query("select count(*) from `support_problems` where `_id_user`='".$myrow_auth['id']."'");
	    $data = mysql_fetch_array($result);
	    $pages_count = ceil($data[0] / 10);
	    $arr = GetPage($pages_count,10);
	    array_unshift($arr,array("_pages_count" => $pages_count));
	    echo json_encode($arr);
		}

	if (isset($_POST["id_problem"]))
		{
   		$id_problem=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["id_problem"]))));
  		$email=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_COOKIE["email"]))));

   		$result = mysql_query("select * from `support_problems` where `_id`='$id_problem'");
   		$data = mysql_fetch_array($result);

	    if (($data['_status'] != 'close') && ((time() - strtotime($data['_date_open']))/(60*60*24) > 5))
			{
	       	mysql_query("update `support_problems` set `_status`='close' where `_id`='$id_problem'");
	       	$data['_status'] = 'close';
	       	}

		$arr = array();
   		array_push($arr,array("_id" => $data['_id'], "_id_user" => $data['_id_user'], "_type" => $data['_type'], "_title" => $data['_title'], "_text" => $data['_text'], "_status" => $data['_status'], "_date" => $data['_date']));
   		$result = mysql_query("select * from `support_chat` where `_id_problem`='$id_problem' order by `_id` asc");
   		while($rows=mysql_fetch_array($result))
			{
			$name = $m_user['name'];
			$role = 0;
			if ($rows['_type'] != "user")
				{
				$admin = mysql_fetch_array(mysql_query("SELECT _name,_type FROM admin WHERE _id='".$rows['_id_user']."'"));
				$name = $admin['_name']." (".$admin['_type'].")";
				$role = 1;
				}
           	array_push($arr,array("_id" => $rows['_id'], "_id_problem" => $rows['_id_problem'], "_id_user" => $rows["_id_user"], "_user_role" => $role, "_user_name" => $name, "_text" => get_html($rows['_text']), "_date" => $rows['_date']));
			}
   		echo json_encode($arr);
		}

	if (isset($_POST["problem_id"]) && isset($_POST["problem_message"]))
		{
		$problem_id=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["problem_id"]))));
		$problem_message=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["problem_message"]))));
  		$email=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_COOKIE["email"]))));

	    $result = mysql_query("select `_status`,`_date_open` from `support_problems` where `_id`='$problem_id'");
	    $data = mysql_fetch_array($result);
	    if ($data['_status'] == 'close')
	    	{
	    	$response["problem_status"]='close';
	    	$response["problem_closed"]='<p>Заявка уже закрыта!</p>';
	    	echo json_encode($response);
	    	}
	    	else
	    	{
	       	if ((time() - strtotime($data['_date_open']))/(60*60*24) > 5)
	           	{
	       		mysql_query("update `support_problems` set `_status`='close' where `_id`='$problem_id'");
	            $response["problem_status"]='close';
				$response["problem_closed"]='<p>Заявка уже закрыта!</p>';
	       		echo json_encode($response);
	            }
	            else
	            {
	            mysql_query("insert into `support_chat` (`_id_problem`,`_id_user`,`_text`,`_date`) values ('$problem_id','".$myrow_auth['id']."','$problem_message','".date("Y-m-d H:i:s")."')");
	            mysql_query("update `support_problems` set `_status`='wait_operator',`_date`='".date("Y-m-d H:i:s")."' where `_id`='$problem_id'");
	            $response["problem_status"]='wait_operator';
	       		echo json_encode($response);
		        }
	       	}
	    }

	if (isset($_POST["close_problem_id"]))
		{
		mysql_query("update `support_problems` set `_status`='close' where `_id`='$close_problem_id'");
	    $response["problem_status"]='close';
	    echo json_encode($response);
	    }


	if (isset($_POST["open_problem_id"]))
		{
		mysql_query("update `support_problems` set `_status`='wait_operator',`_date`='".date("Y-m-d H:i:s")."' where `_id`='$open_problem_id'");
        $response["problem_status"]='wait_operator';
        echo json_encode($response);
        }

	if (isset($_POST["indicator_download"]))
		{
  		$arr=array();
  		$result=mysql_query("select * from `indicators` where _publick=1  order by `_id` asc");
  		while($rows=mysql_fetch_array($result)) array_push($arr, array("_id" => $rows['_id'], "_name" => $rows['_name'], "_short_desc" => $rows['_short_desc'], "_version" => $rows['_version'], "_date" => $rows['_date'], "_link" => $rows['_link']));
  		echo json_encode($arr);
		}

	function GetPageHistory($page_index,$rows_in_page,$id)
	    {
       	$arr=array();
		if ($id == 0) $query = " ";
	    	else $query = " where `_id_indicator`='".$id."' ";

	    $result = mysql_query("select * from `indicators_upgrade`".$query."order by `_date` desc limit ".(($page_index - 1) * $rows_in_page).",$rows_in_page");
		while ($rows=mysql_fetch_array($result))
			{
			$str = str_replace("\n", "\n- ", $rows['_changes'], $count);
			if ($count > 0) $ch = "- ".$str; else $ch = $rows['_changes'];
	        array_push($arr,array("_id" => $rows['_id'], "_id_indicator" => $rows['_id_indicator'], "_version" => $rows['_version'], "_changes" => get_html($ch), "_date" => $rows['_date']));
			}
	       	return $arr;
	    }

	if (isset($_POST["history"]))
		{
  		$arr_tabs = array();
  		$result = mysql_query("select `_id`,`_name` from `indicators` where _publick=1 order by `_id` asc");
        while ($rows=mysql_fetch_array($result)) array_push($arr_tabs, array("_id" => $rows['_id'], "_name" => $rows['_name']));
  		$arr = array();
  		$result = mysql_query("select count(*) from `indicators_upgrade`");
       	$data = mysql_fetch_array($result);
       	$pages_count = ceil($data[0] / 10);
       	array_push($arr, array("_pages_count" => $pages_count));
       	if ($pages_count > 0) array_push($arr, GetPageHistory(1,10,0));
	    echo json_encode(array($arr_tabs, $arr));
		}

	if (isset($_POST["tab_id"]))
		{
		$tab_id = mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["tab_id"]))));

  		if ((int)$tab_id == 0) $query = "";
	    	else $query = " where `_id_indicator`='".$tab_id."'";

	  	$arr = array();
	  	$result = mysql_query("select count(*) from `indicators_upgrade`".$query);
	    $data = mysql_fetch_array($result);
	    $pages_count = ceil($data[0] / 10);
	    array_push($arr, array("_pages_count" => $pages_count));
	    if ($pages_count > 0) array_push($arr, GetPageHistory($pages_count,10,(int)$tab_id));
	    echo json_encode($arr);
		}

	if (isset($_POST["page_indicator"]) && isset($_POST["tab_indicator"]))
		{
		$page = mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["page_indicator"]))));
		$tab = mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["tab_indicator"]))));
       	$arr = GetPageHistory((int)$page,10,(int)$tab);
       	echo json_encode($arr);
		}

	if (isset($_POST["indicator_descr"]))
		{
		$desc = mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["indicator_descr"]))));

        $arr_tabs = array();
  		$result = mysql_query("select `_id`,`_name`,`_publick`  from `indicators` order by `_id` asc");
  		$i=0;
        while ($rows=mysql_fetch_array($result))
			{
			if ($rows['_publick'] == 0) continue;
           	if ($i == 0)
	           	{
	           	$res = mysql_query("select `_desc` from `indicators` where `_id`='".$rows['_id']."'");
	           	$data = mysql_fetch_array($res);
	           	array_push($arr_tabs, array("_id" => $rows['_id'], "_name" => $rows['_name'], "_desc" => $data['_desc']));
	           	$i++;
	           	}
	           	else array_push($arr_tabs, array("_id" => $rows['_id'], "_name" => $rows['_name']));
			}

		echo json_encode($arr_tabs);
		}

	if (isset($_POST["descr_tab_id"]))
		{
		$tab_id = mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST["descr_tab_id"]))));

        $arr_tabs = array();
  		$result = mysql_query("select `_desc` from `indicators` where `_id`='$tab_id' order by _date");
  		$data = mysql_fetch_array($result);
  		echo json_encode($data['_desc']);
		}
	}
?>