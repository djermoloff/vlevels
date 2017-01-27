<? if ($data['q1'] == false) { ?>
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
<? } ?>