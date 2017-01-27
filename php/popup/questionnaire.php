<? if (false && $myrow_auth['q1'] == false && $myrow_auth['active_tariff'] > 0 && $myrow_auth['active_date'] - 86400 < time()) { ?>
<div id="q1" class="d-modal" style="display:block;">
	<div class="ww-all"></div>
	<div class="p-window" style="height:450px;">
		<img src="img/close.png" class="img-close" onClick="close_window('q1');" /> 
		<h4>Активируйте 7 дней бесплатного доступа</h4>
		<form action='handler/questionnaire.php' method='post' enctype="application/x-www-form-urlencoded" onSubmit="return submit_q1()">
		<table align="center">
		  <tr><td colspan=2 class="col-md-9">Заполните все поля формы, и пользуйтесь всеми услугами и программами сервиса бесплатно в течении 7 дней.</td></tr>
		  <tr>
			<td class="col-md-4">Фамилия:</td>
			<td class="col-md-8"><input type="text" name="family" id="family" class="input input-data input-long" /></td>
		  </tr>
		  <tr>
			<td class="col-md-4">Дата рождения:</td>
			<td class="col-md-8"><input type="text" id="birthday" name="birthday" class="input input-data input-mini" readonly="true" onMouseDown="bdload();" style='float:left;margin-right:5px;' /><i class="fa fa-calendar"></i></td>
		  </tr>
		  <tr>
			<td class="col-md-4">Страна:</td>
			<td class="col-md-8">
				<?
				$array_country = file("country.dat");
				$count_array = count($array_country);
				print "<select size='1' name='country'>";
				for ($i=0; $i<$count_array; $i++)
					{
                    $country = str_replace("\r\n", "", $array_country[$i]);
                    $country = str_replace(" ", "", $country);
					if ($country == "Россия") print "<option value=\"{$country}\" selected>{$country}</option>\n"; else print "<option value=\"{$country}\">{$country}</option>\n";
                    }
           print "</select>\n"; ?>
		 </td>
		  </tr>
		  <tr>
			<td class="col-md-4">Опыт на Форекс:</td>
			<td class="col-md-8"><select size="1" name="exp_forex"><option value="1">1 год</option><option value="2">2 года</option><option value="3">3 года</option><option value="4">4 года</option><option value="5">более 5</option><option value="10">более 10</option></select></td>
		  </tr>
		  <tr>
			<td colspan="2"><input type="submit" name="q1-submit" value="Сохранить" class="payment-button" /></td>
		  </tr>
		</table>
		</form>
	</div>
</div>
<script>
function bdload() {
	// инициализация датапикера
    $("#birthday").datepicker({
    	changeMonth: true,
        changeYear: true,
    	dateFormat : 'dd.mm.yy',
        defaultDate: "01.01.1990"
    });
	}

function submit_q1()
	{
	var err = 0;
	var family = document.getElementById('family');
	family.className = "input input-data input-long";
	if (family.value.length < 2) { family.className = "input input-data input-long red-border"; err = 1; }
	
	var birthday = document.getElementById('birthday');
	birthday.className = "input input-data input-mini";
	if (birthday.value == "") { birthday.className = "input input-data input-mini red-border"; err = 1; }
	
	if (err == 1) return(false);
	}
</script>
<? } 
if ($myrow_auth['phone'] == "" && $myrow_auth['active_tariff'] == 0) { ?>
<div id="q2" class="d-modal" style="display:block;">
	<div class="ww-all"></div>
	<div class="p-window" style="height:300px;">
		<img src="img/close.png" class="img-close" onClick="close_window('q2');" />
		<h4>Активируйте 7 дней бесплатного доступа</h4>
		<form action='handler/questionnaire.php' method='post' enctype="application/x-www-form-urlencoded" onSubmit="return submit_q2()">
		<? 
		$r_kod = mysql_query("SELECT * FROM phone_kod WHERE _id_user='".$myrow_auth['id']."' ORDER BY _date DESC");
		$msg = "";
		$phone = "";
		$date = 0;
		$title = "Телефон";
		$html = '<input type="text" name="phone" id="phone" placeholder="+79876543210" class="input input-data input-long" />';
		if (mysql_num_rows($r_kod) >= 10) { $msg="Вы больше не можете отправлять SMS сообщения."; $d="disabled";} 
			else
			{
			if (mysql_num_rows($r_kod) > 0)
				{
				$m_kod = mysql_fetch_array($r_kod);
				if ($m_kod['_date'] + 300 > time()) 
					{
					$phone = $m_kod['_phone'];
					$date = $m_kod['_date'];
					$title = "Код подтверждения";
					$msg="<span style='color:Blue'>Введите код подтверждения отправленный в SMS сообщении</span>";
					$html = "<input type='text' id='kod'  placeholder='1234' pattern='\d [0-9]' maxlength='4' class='input input-data input-long' style='width:60px;text-align:center;' /> <span class='resend-kod' onClick='resend()'>Отправить повторно</span>";
					$button = '<input type="button" id="q2sendkod" name="q2-send" value="Подтвердить" class="payment-button" onClick="send_kod()"/>';
					}
				if ($m_kod['_error'] >= 5) 
					{
					$msg="Вы 5 раз ввели ошибочный код подтверждения. Следующая отправка возможна после ".date("H:i",$m_kod['_date']);
					$title = "Код подтверждения";
					$html = "<input type='text' id='kod'  placeholder='1234' pattern='\d [0-9]' maxlength='4' class='input input-data input-long' style='width:60px;text-align:center;' /> <span class='resend-kod' onClick='resend()'>Отправить повторно</span>";
					$button = '<input type="button" id="q2sendkod" name="q2-send" value="Подтвердить" class="payment-button" />';
					}
				}
			}
		if ($button == "") $button = '<input type="button" id="q2send" name="q2-send" value="Отправить SMS" class="payment-button" onClick="send_sms()" '.$d.' /><input type="button" id="q2sendkod" name="q2-send" value="Подтвердить" class="payment-button" onClick="send_kod()" style="display:none;"/>';
		?>
		<table align="center">
		  <tr><td colspan=2 class="col-md-9">Подтвердите телефонный номер и пользуйтесь услугами сервиса бесплатно в течении 7 дней.<br>Номер телефона вводится в международном формате.<div class="tip" id="q2-tip"><? echo $msg; ?></div></td></tr>
		  <tr>
			<td class="col-md-4" id="kod_title"><? echo $title; ?>:</td>
			<td class="col-md-8" id="kod_htm"><? echo $html; ?></td>
		  </tr>
		  <tr>
			<td colspan=2 ><? echo $button; ?></td>
		  </tr>
		</table>
		</form>
	</div>
</div>
<script>
var gl_date = <? echo $date; ?>;
var gl_phone = "<? echo $phone; ?>";
var d = "<? echo $d; ?>";
var no_send = false;
function send_sms()
	{
	if (d == "disabled") { $("#q2-tip").empty().append("Вы больше не можете отправлять SMS сообщения"); $("#q2send").prop("disabled", true); return; }
	var err = 0;
	var phone = document.getElementById('phone');
	phone.className = "input input-data input-long";
	$("#q2-tip").empty();
	if (phone.value.length < 11) { phone.className = "input input-data input-long red-border"; $("#q2-tip").append("Телефон должен состоять не менее чем из 11 цифр."); err = 1; }
	
	var a = /^[0-9+]+$/;
	if (err == 0 && phone.value.search(a) == -1) { phone.className = "input input-data input-long red-border"; $("#q2-tip").append("Неверный формат ввода номера. Пример: +79876543210"); err = 1; }
	
	if (err == 1) return;
	$("#q2-tip").append("<span style='color:Orange'>Отправка SMS сообщения...</span>");
	$("#q2send").prop("disabled", true);
	$.ajax({
        url: "handler/questionnaire.php",
        type: "post",
        dataType: "json",
        data: { "send_kod" : "1", "phone" : phone.value },
        success: function(html) {
            if (html.succeed == "error")
				{
				$("#q2-tip").empty().append(html.msg);
				$("#q2send").prop("disabled", false);
				}
			if (html.succeed == "error-servise")
				{
				$("#q2-tip").empty().append(html.msg);
				no_send = true;
				}
			if (html.succeed == "ok")
				{
				gl_phone = html.phone;
				gl_date = html.date;
				ms = "<span style='color:blue'>"+html.msg+"</span>";
				$("#q2-tip").empty().append(ms);
				$("#q2send").prop("disabled", false);
				$("#q2send").css("display", "none");
				$("#q2sendkod").css("display", "inline");
				$("#kod_htm").empty().append(html.htm);
				$("#kod_title").empty().append("Код подтверждения");
				document.getElementById("kod").focus();
				}
            },
        error: function(response) {
			$("#q2-tip").empty().append("Нет соединения.");
			$("#q2send").prop("disabled", false);
            }
        });
	}
	
function resend()
	{
	if (no_send == true) return;
	if (gl_phone == "" || gl_date == 0) { location.reload(); }
	$("#q2sendkod").prop("disabled", true);
	$("#q2-tip").empty().append("<span style='color:Orange'>Отправка запроса...</span>");
	$.ajax({
        url: "handler/questionnaire.php",
        type: "post",
        dataType: "json",
        data: { "resend_kod" : "1" },
        success: function(html) {
            if (html.succeed == "error")
				{
				$("#q2-tip").empty().append(html.msg);
				$("#q2sendkod").prop("disabled", false);
				}
			if (html.succeed == "error-servise")
				{
				$("#q2-tip").empty().append(html.msg);
				no_send = true;
				}	
			if (html.succeed == "ok")
				{
				ms = "<span style='color:blue'>"+html.msg+"</span>";
				$("#q2-tip").empty().append(ms);
				$("#q2sendkod").prop("disabled", false);
				}
            },
        error: function(response) {
			$("#q2-tip").empty().append("Нет соединения.");
			$("#q2sendkod").prop("disabled", false);
            }
        });
	}
	
function send_kod()
	{
	var err = 0;
	var kod = document.getElementById('kod');
	kod.className = "input input-data input-long";
	$("#q2-tip").empty();
	if (kod.value.length < 4) { phone.className = "input input-data input-long red-border"; $("#q2-tip").append("Код должен состоять из 4 цифр."); err = 1; }
	
	var a = /^[0-9]+$/;
	if (err == 0 && kod.value.search(a) == -1) { phone.className = "input input-data input-long red-border"; $("#q2-tip").append("Неверный формат ввода кода."); err = 1; }
	
	if (err == 1) return;
	$("#q2sendkod").prop("disabled", true);
	$.ajax({
        url: "handler/questionnaire.php",
        type: "post",
        dataType: "json",
        data: { "confirm_phone" : "1", "kod" : kod.value },
        success: function(html) {
            if (html.succeed == "error")
				{
				kod.value = "";
				$("#q2-tip").empty().append(html.msg);
				$("#q2sendkod").prop("disabled", false);
				}
				
			if (html.succeed == "ok")
				{
				ms = "<span style='color:blue'>"+html.msg+"</span>";
				$("#q2-tip").empty().append(ms);
				setTimeout('location.reload()',3000);
				}
            },
        error: function(response) {
			$("#q2-tip").empty().append("Нет соединения.");
			$("#q2sendkod").prop("disabled", false);
            }
        });
	}
</script>
<? } ?>