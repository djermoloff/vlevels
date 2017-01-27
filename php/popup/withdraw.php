<div id="withdraw-money" class="d-modal">
	<div class="ww-all"></div>
	<div class="p-window">
		<img src="img/close.png" class="img-close" onClick="close_window('withdraw-money');" />
		<h4 id="wpay-h4">Вывод средств</h4>
		<div id="w-info"></div>
		<table align="center">
		  <tr>
			<td class="col-md-4">Плат. система:</td>
			<td class="col-md-8"><select id="w-type"><option value="wm">WebMoney Z (комиссия 0.8%)</option><option value="wm">Яндекс.Деньги (комиссия 0.5%)</option></select></td>
		  </tr>
		  <tr>
			<td class="col-md-4">Номер кошелька:</td>
			<td class="col-md-8"><input type="text" id="w-payee" value="" class="dd-select" /></td>
		  </tr>
		  <tr>
			<td class="col-md-4">Сумма:</td>
			<td class="col-md-8"><input type="text" id="w-amount" value="" class="dd-select" /></td>
		  </tr>
		  <tr>
			<td colspan="2"><input type="submit" id="w-button" value="Вывести" class="payment-button" onClick="orderWithdraw(<? echo $myrow_auth['balance']; ?>);" /></td>
		  </tr>
		</table>
		</form>
	</div>
</div>