<div id="pay-money" class="d-modal" <? $file = basename($_SERVER['SCRIPT_FILENAME']); if ($myrow_auth['active_date'] < time() && $file == "analytics.php")  echo "style='display:block;'"; ?>>
	<div class="ww-all"></div>
	<div class="p-window">
		<img src="img/close.png" class="img-close" onClick="close_window('pay-money'); $('#info-next-tarif').empty(); $('#wpay-h4').empty().append('Оплата услуг сервиса');" />
		<h4 id="wpay-h4"><? if ($myrow_auth['active_date'] < time() && $file == "analytics.php") echo "Истек срок активации аккаунта"; else echo "Оплата услуг сервиса"; ?></h4>
		<div id="info-next-tarif"><? if ($myrow_auth['active_date'] < time() && $file == "analytics.php") echo "<p>Для получения доступа необходимо оплатить выбранный Вами тарифный план.</p><p>Для открытия доступа к архиву бюллетеней Вам необходимо активировать тарифный план: <b>Lite</b> для возможности просматривать текущий опционный месяц, <b>Professional</b> для просмотра 6 последних месяцев истории или <b>VIP</b> для просмотра полного архива с 2008 года."; ?></div>
		<form action='handler/payment.php' method='post' enctype="application/x-www-form-urlencoded">
		<table align="center">
		  <tr>
			<td class="col-md-4">Тарифный план:</td>
			<td class="col-md-8">
				<select name="tariff" id="select-tariff">
					<? $r_tariff = mysql_query("SELECT * FROM tariffs WHERE _publick='1'");
					while ($m_tariff = mysql_fetch_array($r_tariff)) { echo "<option value='".$m_tariff['_id']."'>".$m_tariff['_name']." / ".$m_tariff['_day']." дней (".$m_tariff['_price']." USD)</option>"; } ?>
				</select>
			</td>
		  </tr>
		  <? $settings = mysql_fetch_array(mysql_query("SELECT _usdrur FROM settings WHERE _id='1'"))?>
		  <tr>
			<td class="col-md-4">Способ оплаты:</td>
			<td class="col-md-8">
				<input class="dd-selected-value" name="payment_type" id="type" type="hidden" value="wm">
				<div class="dd-select" id="index-payment" onClick="open_select()">
					<img class="dd-selected-image" src="img/wm.png">
					<img class="dd-selected-pointer" src="img/select-pointer.png">
					<div class="dd-selected-text">WebMoney Z</div>
					<span class="dd-selected-t">Комиссия платежной системы 0.8%.</span>
				</div>
				<div id="payments">
					<div class="li-type" id="p-wm" onMouseUp="selected('wm')">
						<img class="dd-selected-image" src="img/wm.png">
						<div class="dd-selected-text">WebMoney</div>
						<span class="dd-selected-t">Комиссия платежной системы 0.8%.</span>
					</div>
					<div class="li-type" id="p-ya" onMouseUp="selected('ya')">
						<img class="dd-selected-image" src="img/ym.png">
						<div class="dd-selected-text">Яндекс.Деньги</div>
						<span class="dd-selected-t">Комиссия платежной системы 0.5%. Курс: 1USD = <? echo $settings['_usdrur']; ?>RUR</span>
					</div>
					<div class="li-type" id="p-card" onMouseUp="selected('card')">
						<img class="dd-selected-image" src="img/visa.png">
						<div class="dd-selected-text">VISA / Master Card</div>
						<span class="dd-selected-t">Комиссия платежной системы 2%. Курс: 1USD = <? echo $settings['_usdrur']; ?>RUR</span>
					</div>
				</div>
			</td>
		  </tr>
		  <tr>
			<td colspan="2"><input type="submit" name="payment" value="Перейти к оплате" class="payment-button" /></td>
		  </tr>
		</table>
		</form>
	</div>
</div>