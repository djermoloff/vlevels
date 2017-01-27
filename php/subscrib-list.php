<?
$subList = array("first_step"=>6939322,
				 "registered"=>6939722,
				 "active"=>6939730,
				 "no_install"=>6939754,
				 "finish_demo"=>6939766);

function add_subscrib($user_email,$user_name,$sublist,$user_ip)
	{
	// Ваш ключ доступа к API (из Личного Кабинета)
	$api_key = "5rbfhue1ftadzit8tm33gupfsa1sdf7fsop4813e";
	
	// Данные о новом подписчике
	$user_name = $user_name;
	$user_lists = $sublist;

	// Создаём POST-запрос
	$POST = array (
	  'api_key' => $api_key,
	  'list_ids' => $user_lists,
	  'fields[email]' => $user_email,
	  'fields[Name]' => $user_name,
	  'double_optin' => 1,
	  'request_ip' => $user_ip,
	  'request_time' => gmdate("Y-m-d H:i:s"),
	  'confirm_ip' => $user_ip,
	  'confirm_time' => gmdate("Y-m-d H:i:s")
	);

	// Устанавливаем соединение
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $POST);
	curl_setopt($ch, CURLOPT_TIMEOUT, 10);
	curl_setopt($ch, CURLOPT_URL, 
				'http://api.unisender.com/ru/api/subscribe?format=json');
	$result = curl_exec($ch);

	if ($result) 
		{
		// Раскодируем ответ API-сервера
		$jsonObj = json_decode($result);

		if(null===$jsonObj) { return (0); }
			elseif(!empty($jsonObj->error))
			{
			// Ошибка добавления пользователя
			$file = fopen ("errorSubscrib.txt","a");
			$str = "\nAn error add_subscrib: " . $jsonObj->error . "(code: " . $jsonObj->code . ")";
			if ($file) fputs ( $file, $str);
			fclose ($file);
			} else return ($jsonObj->result->person_id);
		} else {
		// Ошибка соединения с API-сервером
		echo "API access error";
		$file = fopen ("errorSubscrib.txt","a");
		$str = "\nAPI access error";
		if ($file) fputs ( $file, $str);
		fclose ($file);
		}
		
	return(0);
	}
	
function exclude($user_email,$sublist)
	{
	// Ваш ключ доступа к API (из Личного Кабинета)
	$api_key = "5rbfhue1ftadzit8tm33gupfsa1sdf7fsop4813e";

	// Данные о новом подписчике
	$user_name = $user_name;
	$user_lists = $sublist;

	// Создаём POST-запрос
	$POST = array (
	  'api_key' => $api_key,
	  'list_ids' => $user_lists,
	  'contact_type' => "email",
	  'contact' => $user_email
	);

	// Устанавливаем соединение
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $POST);
	curl_setopt($ch, CURLOPT_TIMEOUT, 10);
	curl_setopt($ch, CURLOPT_URL, 
				'http://api.unisender.com/ru/api/exclude?format=json');
	$result = curl_exec($ch);

	if ($result) 
		{
		// Раскодируем ответ API-сервера
		$jsonObj = json_decode($result);

		if(null===$jsonObj) { return (0); }
			elseif(!empty($jsonObj->error))
			{
			// Ошибка добавления пользователя
			$file = fopen ("errorSubscrib.txt","a");
			$str = "\nAn error exclude: " . $jsonObj->error . "(code: " . $jsonObj->code . ")";
			if ($file) fputs ( $file, $str);
			fclose ($file);
			} else return ($jsonObj->result->person_id);
		} else {
		// Ошибка соединения с API-сервером
		echo "API access error";
		$file = fopen ("errorSubscrib.txt","a");
		$str = "\nAPI access error";
		if ($file) fputs ( $file, $str);
		fclose ($file);
		}
		
	return(0);
	}
?>