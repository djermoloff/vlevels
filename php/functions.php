<?php
  define("DB_HOST","localhost");
  define("DB_USER","vps_user");
  define("DB_PASS","OzC1Jf");
  define("DB_NAME","vlevels");
  define("DB_NAME_CME","cme");

function DBConnect($db_host,$db_user,$db_pass,$db_name)
	{
	global $db_con;
	$db_con=@mysql_connect($db_host,$db_user,$db_pass);
	if ($db_con)
		{
		if (!@mysql_select_db($db_name,$db_con)) return false;
		}
	
	mysql_query ("set character_set_client='utf8'");
	mysql_query("SET NAMES utf8");
	mysql_query ("set character_set_results='utf8'"); 
	mysql_query ("set collation_connection='utf8_general_ci'");
    return $db_con;
  }
  
function SendMail($to,$key,$subject,$message)
  {
	require_once "SendMailSmtpClass.php";
	$m_mail = mysql_fetch_array(mysql_query("SELECT * FROM admin_mail WHERE _key='".$key."'"));
	$password = get_uncode($m_mail['_pass']);
	$mailSMTP = new SendMailSmtpClass($m_mail['_mail'], $password, 'ssl://smtp.yandex.ru', $m_mail['_name'], 465);
	$headers= "MIME-Version: 1.0\r\n";
	$headers .= "Content-type: text/html; charset=windows-1251\r\n";
	$headers .= "From: ".$m_mail['_name']." <".$m_mail['_mail'].">\r\n";
	$i = 0;
	foreach ($to as $key => $value) 
		{
		$name_to = $to[$key]['name'];
		$message_send = iconv ('utf-8', 'windows-1251', str_replace("#name#",$to[$key]['name'] ,$message));
		$header_send = iconv ('utf-8', 'windows-1251', $headers."To: ".$name_to." <".$to[$key]['email'].">\r\n");
		$result =  $mailSMTP->send($to[$key]['email'], $subject, $message_send, $header_send); 	
		if($result) $i++;
		}
	return $i;
  }

  function getRealIpAddr()
  {
  return mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_SERVER['REMOTE_ADDR']))));
  
  }

function CheckAuth()
	{
    $db_con=DBConnect(DB_HOST,DB_USER,DB_PASS,DB_NAME);
    $email='';
    $key='';
    $ip='';
	session_start();
	global $myrow_auth;
	if (isset($_SESSION['authorized_id']) && preg_match("/^[0-9]+$/", $_SESSION['authorized_id']))
		{
		if ($myrow_auth = mysql_fetch_array(mysql_query("SELECT * FROM `users` WHERE `id`='".$_SESSION['authorized_id']."'")))
			{
			$settings = mysql_fetch_array(mysql_query("SELECT _cabinet FROM `settings` WHERE `_id`=1"));
			if ($myrow_auth['blocked'] == 1 || time()<$myrow_auth['ban_time'] || !$settings['_cabinet']) { session_unset(); return -1; }
			if ($_SESSION['key'] == md5($myrow_auth['id'].$myrow_auth['password']."sdrljty454") && $_SESSION['ip'] == $_SERVER['REMOTE_ADDR']) 
				{
				if (!preg_match("/^([1-9][0-9]{0,2}).(\d{1,3}).(\d{1,3}).(\d{1,3})$­/",$_SERVER['REMOTE_ADDR'])) { session_unset(); return -1; }
				$ip=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_SERVER['REMOTE_ADDR']))));
				$result = mysql_query("update `users` set `last_visit`='".time()."',`ip`='$ip' where `id`='".$myrow_auth['id']."'");
				return 0;
				}
				else return -1;
	  		}
	  		else return -1;
		}
  		else return -1;
	return -1;
	}

  function is_robot()
  {
	 if ( strpos( $_SERVER['HTTP_USER_AGENT'], 'WordPress' ) !== false ) return(true);
	 if ( strpos( $_SERVER['HTTP_USER_AGENT'], 'Googlebot' ) !== false ) return(true);
	 if ( strpos( $_SERVER['HTTP_USER_AGENT'], 'Mediapartners-Google' ) !== false ) return(true);
	 if ( strpos( $_SERVER['HTTP_USER_AGENT'], 'MSNBot' ) !== false ) return(true);
	 if ( strpos( $_SERVER['HTTP_USER_AGENT'], 'Slurp' ) !== false ) return(true);
	 if ( strpos( $_SERVER['HTTP_USER_AGENT'], 'WebCrawler' ) !== false ) return(true);
	 if ( strpos( $_SERVER['HTTP_USER_AGENT'], 'ZyBorg' ) !== false ) return(true);
	 if ( strpos( $_SERVER['HTTP_USER_AGENT'], 'StackRambler' ) !== false ) return(true);
	 if ( strpos( $_SERVER['HTTP_USER_AGENT'], 'Aport' ) !== false ) return(true);
	 if ( strpos( $_SERVER['HTTP_USER_AGENT'], 'Mail.Ru' ) !== false ) return(true);
	 if ( strpos( $_SERVER['HTTP_USER_AGENT'], 'lycos' ) !== false ) return(true);
	 if ( strpos( $_SERVER['HTTP_USER_AGENT'], 'WebAlta' ) !== false ) return(true);
	 if ( strpos( $_SERVER['HTTP_USER_AGENT'], 'Teoma' ) !== false ) return(true);
	 if ( strpos( $_SERVER['HTTP_USER_AGENT'], 'ia_archiver' ) !== false ) return(true);
	 if ( strpos( $_SERVER['HTTP_USER_AGENT'], 'Yandex' ) !== false ) return(true);
	 if ( strpos( $_SERVER['HTTP_USER_AGENT'], 'Rambler' ) !== false ) return(true);
	 if ( strpos( $_SERVER['HTTP_USER_AGENT'], 'Yandex' ) !== false ) return(true);
	 if ( strpos( $_SERVER['HTTP_USER_AGENT'], 'yahoo' ) !== false ) return(true);
	 if ( strpos( $_SERVER['HTTP_USER_AGENT'], 'Yahoo! Slurp' ) !== false ) return(true);
	 if ( strpos( $_SERVER['HTTP_USER_AGENT'], 'msnbot' ) !== false ) return(true);
	 if ( strpos( $_SERVER['HTTP_USER_AGENT'], 'www.alexa.com' ) !== false ) return(true);
	 if ( strpos( $_SERVER['HTTP_USER_AGENT'], 'bingbot' ) !== false ) return(true);
	 if ( strpos( $_SERVER['HTTP_USER_AGENT'], 'MSIE' ) !== false ) return(true);
	 if ( strpos( $_SERVER['HTTP_USER_AGENT'], 'bot' ) !== false ) return(true);
	 if ( strpos( $_SERVER['HTTP_USER_AGENT'], 'Baiduspider' ) !== false ) return(true);
	 return(false);
  }
  
function get_code($text)
	{
	$key = md5("hKJtehFteuye98e6s", true);
	$user_crypt = urlencode(base64_encode(mcrypt_encrypt(MCRYPT_RIJNDAEL_256, $key, $text, MCRYPT_MODE_ECB)));
	return($user_crypt);
	}
	
function get_uncode($text)
	{
	$key = md5("hKJtehFteuye98e6s", true);
	$user_crypt= mcrypt_decrypt(MCRYPT_RIJNDAEL_256, $key, base64_decode(urldecode($text)), MCRYPT_MODE_ECB);
	return($user_crypt);
	}

  function CheckVisitor()
  {
  if (is_robot()) return;
  if ( strpos( $_SERVER['HTTP_REFERER'], 'http://vlevels.ru' ) !== false ) return;

  $db_con=DBConnect(DB_HOST,DB_USER,DB_PASS,DB_NAME);
	  $refer='';
	  if (isset($_GET["refer"]))
	  {
	  	$refer=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_GET["refer"]))));
		setcookie("refer",$refer,time()+60*60*24*90,"/","vlevels.ru");
	  }
	  $utm_source='';
	  if (isset($_GET["utm_source"]))
	  {
	  	$utm_source=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_GET["utm_source"]))));
	  }
	  $utm_medium='';
	  if (isset($_GET["utm_medium"]))
	  {
	  	$utm_medium=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_GET["utm_medium"]))));
	  }
	  $utm_term='';
	  if (isset($_GET["utm_term"]))
	  {
	  	$utm_term=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_GET["utm_term"]))));
	  }
	  $utm_campaign='';
	  if (isset($_GET["utm_campaign"]))
	  {
	  	$utm_campaign=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_GET["utm_campaign"]))));
	  }
	  
	  if (isset($_COOKIE["key_visitor"]))
	  {
	  	$key_visitor=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_COOKIE["key_visitor"]))));
	  	$result=mysql_query("select * from `visitors` where `key`='$key_visitor'");
	  	if (mysql_num_rows($result))
	  	{
	    	$data=mysql_fetch_array($result);
	    	$dif=time()-$data['date_last'];
	    	if ($dif<=30*60)
	    	{
	    		$exist=1;
	        }
	        else
	        {
	        	$exist=0;
	        }
	  	}
	  	else
	  	{
	    	$exist=0;
	  	}
	  }
	  else
	  {
	  	$exist=0;
	  }
	  if ($exist)
	  {
		  $av_time=($data['sum']+$dif/60)/$data['visits'];
	      mysql_query("update `visitors` set `date_last`=".time().",`sum`='".($data['sum']+$dif/60)."',`visits`='".($data['visits']+1)."',`av_time`='".$av_time."',`ip`='".getRealIpAddr()."',
		    	       where `key`='$key_visitor'");

	  }
	  else
	  {
		  $user_agent='';
	  	  if (isset($_SERVER["HTTP_USER_AGENT"]))
	  	  {
	  	  	$user_agent=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_SERVER["HTTP_USER_AGENT"]))));
	  	  }
		  $http_refer='';
		  if (isset($_SERVER["HTTP_REFERER"]))
		  {
		  	//$url=parse_url(mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_SERVER["HTTP_REFERER"])))));
			$url=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_SERVER["HTTP_REFERER"]))));
		  	/*$http_refer="";
		  	if (isset($url['scheme']) && isset($url['host']))
		  	{
		  		$http_refer=$url['scheme']."://".$url['host'];
			}*/
		  }
		  $result=mysql_query("SELECT MAX(`id`) FROM `visitors`");
		  $data=mysql_fetch_array($result);
		  $id=$data[0]+1;
		  $key=md5($id.time()."fab663");
		  mysql_query("insert into `visitors` (`id`,`key`,`date_first`,`date_last`,`sum`,`visits`,`av_time`,`ip`,`refer`,`utm_source`,`utm_medium`,`utm_term`,`utm_campaign`,`user_agent`,
		    		   `http_refer`) values ('$id','$key',".time().",".time().",'0','1','0','".getRealIpAddr()."','$refer','$utm_source','$utm_medium','$utm_term','$utm_campaign',
		    		   '$user_agent','$url')");
	      setcookie("key_visitor",$key,time()+60*60*24*90,"/","vlevels.ru");
	  }
	  if ($utm_source!='')
	  {
	    setcookie("utm_source",$utm_source,time()+60*60*24*90,"/","vlevels.ru");
	  }
	  else
	  {
	  	if (isset($_COOKIE["utm_source"]))
	    {
	    	setcookie("utm_source","",time()-60*60*24*90,"/","vlevels.ru");
	    }
	  }
	  if ($utm_medium!='')
	  {
	  	setcookie("utm_medium",$utm_medium,time()+60*60*24*90,"/","vlevels.ru");
	  }
	  else
	  {
	  	if (isset($_COOKIE["utm_medium"]))
	    {
	    	setcookie("utm_medium","",time()-60*60*24*90,"/","vlevels.ru");
	    }
	  }
	  if ($utm_term!='')
	  {
	  	setcookie("utm_term",$utm_term,time()+60*60*24*90,"/","vlevels.ru");
	  }
	  else
	  {
	  	if (isset($_COOKIE["utm_term"]))
	    {
	    	setcookie("utm_term","",time()-60*60*24*90,"/","vlevels.ru");
	    }
	  }
	  if ($utm_campaign!='')
	  {
	  	setcookie("utm_campaign",$utm_campaign,time()+60*60*24*90,"/","vlevels.ru");
	  }
	  else
	  {
	  	if (isset($_COOKIE["utm_campaign"]))
	    {
	    	setcookie("utm_campaign","",time()-60*60*24*90,"/","vlevels.ru");
	    }
	  }
	  mysql_close($db_con);
	}

function get_price($symbol,$strike,$r,$type)
	{
	$digits = 4;
	$r = get_r($symbol,$r);
	if ($type == 0) $price = $strike+$r; else $price = $strike-$r;
	if (substr($symbol,0,3) == "XAU" || substr($symbol,0,4) == "GOLD") return(number_format($price,2,".",""));
	$price = $price / 1000;
	if (substr($symbol,0,3) == "USD") $price = 1/$price;
	if (substr($symbol,3,3) == "JPY") { $price = $price*100; $digits = 2; }
	return(number_format($price,$digits,".",""));
	}
	
function get_r ($s,$r)
	{
	if (strpos($s,"EURUSD") !== false) return($r);
	if (strpos($s,"GBPUSD") !== false) return($r*10);
	if (strpos($s,"USDCHF") !== false) return($r*10);
	if (strpos($s,"USDJPY") !== false) return($r*10);
	if (strpos($s,"USDCAD") !== false) return($r*10);
	if (strpos($s,"AUDUSD") !== false) return($r*10);
	if (strpos($s,"XAUUSD") !== false || strpos($s,"GOLD") !== false) return($r);
	return($r);
	}

function logout()
	{
	session_start();
	session_unset();
	header("Location: http://vlevels.ru");
	}

function get_html($text)
	{
	$text = str_replace("\n","<p>",$text);
	$text = str_replace("[h2]","<h2>",$text);
	$text = str_replace("[/h2]","</h2>",$text);
	$text = str_replace("[h3]","<h3>",$text);
	$text = str_replace("[/h3]","</h3>",$text);
	$text = str_replace("[b]","<strong>",$text);
	$text = str_replace("[/b]","</strong>",$text);
	$text = str_replace("[i]","<i>",$text);
	$text = str_replace("[/i]","</i>",$text);
	$text = str_replace("[ol]","<ol>",$text);
	$text = str_replace("[/ol]","</ol>",$text);
	$text = str_replace("[ul]","<ul>",$text);
	$text = str_replace("[/ul]","</ul>",$text);
	$text = str_replace("[li]","<li>",$text);
	$text = str_replace("[/li]","</li>",$text);
	return($text);
	}
?>