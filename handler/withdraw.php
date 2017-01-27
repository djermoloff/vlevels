<? 
require_once "../php/functions.php";
require_once "../php/load.php";
$_POST['amount'] = str_replace(',','.',$_POST['amount']);

if (isset($_POST['type']) && isset($_POST['amount']) && isset($_POST['payee'])/* && preg_match("/^[0-9\.]+$/", $_POST['amount'])*/)
	{
	if ($_POST['amount'] > $myrow_auth['balance']) { $result = array("succees"=>"error-amount"); echo json_encode($result); exit(); }
	$payee_=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_POST['payee']))));
	if ($_POST['type'] == "wm") 
		{
		$fee = $_POST['amount'] * 0.8 / 100; 
		$type_ = "WebMoney";
		}
		else 
		{
		$fee = $_POST['amount'] * 0.5 / 100; 
		$type_ = "Яндекс.Деньги";
		}
	$new_balance = $myrow_auth['balance']-$_POST['amount'];
	mysql_query("INSERT INTO payment (_request,_date,_id_user,_payment_type,_payee,_amount,_fee,_comment) VALUES ('withdraw','".time()."','".$myrow_auth['id']."','$type_','$payee_','".$_POST['amount']."','$fee','".$_SERVER['REMOTE_ADDR']."')");
	mysql_query("UPDATE users SET balance='$new_balance' WHERE id='".$myrow_auth['id']."'");
	
	$result = array("succees"=>"ok","date"=>date("d.m.Y"),"type"=>$type_,"amount"=>number_format($_POST['amount'],2),"new_balance"=>$new_balance);
	} else $result = array("succees"=>"error-amount"); 
	
echo json_encode($result);
?>