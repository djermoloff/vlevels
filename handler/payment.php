<?
require_once "../php/functions.php";
require_once "../php/load.php";

if (isset($_POST['payment_type']) && isset($_POST['tariff']) && preg_match("/^[0-9]+$/", $_POST['tariff'])) $tariff_ = $_POST['tariff']; else header("Location:../index.php");
$r_tariff = mysql_query("SELECT * FROM tariffs WHERE _id='".$tariff_."'");
if ($m_tariff = mysql_fetch_array($r_tariff)) 
	{ 
	$payment_no = 100;
	if ($settings = mysql_fetch_array(mysql_query("SELECT * FROM settings WHERE _id='1'"))) { $payment_no = $settings['_payment_no']; mysql_query("UPDATE settings SET _payment_no=_payment_no+1"); }
	if ($_POST['payment_type'] == "wm") 
		{ ?>
		<form action='https://merchant.webmoney.ru/lmi/payment.asp' id="pay" method='post' enctype="application/x-www-form-urlencoded" accept-charset="windows-1251">
			<input name='email' type='hidden' value='<? echo $myrow_auth['email']; ?>' />
			<input name='LMI_PAYMENT_NO' type='hidden' value='<?php echo $payment_no; ?>' />
			<input name='LMI_PAYMENT_AMOUNT' type='hidden' value='<?php echo $m_tariff['_price']; ?>' />
			<input id='LMI_PAYMENT_DESC' name='LMI_PAYMENT_DESC' type='hidden' value='Оплата тарифа <?php echo $m_tariff['_name']; ?> / Volume Levels' />
			<input name='LMI_PAYEE_PURSE' type='hidden' value='<?php echo $settings['_wmz']; ?>' />
			<input name='tariff' type='hidden' value='<?php echo $m_tariff['_id'] ?>' />
		</form>
		<script>function paypm(){document.getElementById('pay').submit();}setTimeout(paypm, 0);</script>
		<? }
	if ($_POST['payment_type'] == "ya")
		{
		$amount = ceil(($m_tariff['_price']*$settings['_usdrur'] - $m_tariff['_price']*$settings['_usdrur'] * (0.005 / (1 + 0.005)))*100)/100;
		?>
		<form method="POST" action="https://money.yandex.ru/quickpay/confirm.xml" id="pay" method='post' enctype="application/x-www-form-urlencoded" accept-charset="windows-1251">
		 <input type="hidden" name="receiver" value="<?php echo $settings['_yad']; ?>">
		 <input type="hidden" name="formcomment" value="Оплата тарифа <?php echo $m_tariff['_name']; ?> / Volume Levels">
		 <input type="hidden" name="label" value="<?php echo $myrow_auth['email'].":".$m_tariff['_id'].":".$settings['_payment_no']; ?>">
		 <input type="hidden" name="quickpay-form" value="shop">
		 <input type="hidden" name="targets" value="Volume Levels">
		 <input type="hidden" name="sum" value='<?php echo $amount; ?>' data-type="number" >
		 <input type="hidden" name="need-fio" value="false">
		 <input type="hidden" name="need-email" value="false" >
		 <input type="hidden" name="need-phone" value="false"> 
		 <input type="hidden" name="need-address" value="false">
		 <input type="hidden" name="test_notification" value="true">
		 <!--<input type="hidden" name="paymentType" value="PC" >-->
		 <input type="hidden" name="successURL" value="<? echo $http.$_SERVER['SERVER_NAME'];?>" >
		</form>
		<script>function paypm(){document.getElementById('pay').submit();}setTimeout(paypm, 0);</script>
		<? }
	if ($_POST['payment_type'] == "card")
		{ 
		$amount = ceil(($m_tariff['_price']*$settings['_usdrur'] * (1 + 0.02))*100)/100;
		?>
		<form method="POST" action="https://money.yandex.ru/quickpay/confirm.xml" id="pay" method='post' enctype="application/x-www-form-urlencoded" accept-charset="windows-1251">
		 <input type="hidden" name="receiver" value="<?php echo $settings['_yad']; ?>">
		 <input type="hidden" name="formcomment" value="Volume Levels">
		 <input type="hidden" name="label" value="<?php echo $myrow_auth['email'].":".$m_tariff['_id'].":".$settings['_payment_no']; ?>">
		 <input type="hidden" name="quickpay-form" value="shop">
		 <input type="hidden" name="targets" value="Оплата тарифа <?php echo $m_tariff['_name']; ?>">
		 <input type="hidden" name="sum" value='<?php echo $amount; ?>' data-type="number" >
		 <input type="hidden" name="need-fio" value="false">
		 <input type="hidden" name="need-email" value="false" >
		 <input type="hidden" name="need-phone" value="false">
		 <input type="hidden" name="need-address" value="false">
		 <input type="hidden" name="paymentType" value="AC" >
		 <input type="hidden" name="successURL" value="<? echo $http.$_SERVER['SERVER_NAME'];?>" >
		</form>
		<script>function paypm(){document.getElementById('pay').submit();}setTimeout(paypm, 0);</script>
		<? }
	exit();
	}	else header("Location:../index.php");
	
exit();
?>