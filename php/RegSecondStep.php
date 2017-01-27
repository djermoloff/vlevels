<?php
session_start();
if (isset($_SESSION["email_reg"])&&isset($_SESSION["user_name_reg"])&&(trim($_POST["reg_code"])==substr(md5($_SESSION["email_reg"].$_SESSION["user_name_reg"]."fab663"),0,6)))
{
	$_SESSION["reg_code"]=trim($_POST["reg_code"]);
	$response["success"]=	'<form id="registr_form_last">
								<p class="center mb-text">Рекомендуем Вам использовать сложные пароли, состоящие из заглавных букв, цифр и знаков препинания.</p>
								<div class="form__input-wrapper right">
   				   					<label for="pass" class="form__label form__label--reg_code">Введите пароль:</label>
   				   					<input type="password" class="form__input form__input--pass" id="pass" required autocomplete="off" minlength="6" maxlength="50" />
   				   					<p id="error_pass" class="hidden invalid"></p>
   				   				</div>
				   				<div class="form__input-wrapper right">
   				   					<label for="rePass" class="form__label form__label--reg_code">Повторите пароль:</label>
   				   					<input type="password" class="form__input form__input--pass" id="rePass" required autocomplete="off" minlength="6" maxlength="50" />
   				   					<p id="error_rePass" class="hidden invalid"></p>
				   				</div>
				   				<div class="form__btn-wrapper">
				   					<input type="submit" class="form__btn" id="regLastStep" value="Сохранить" onMouseDown="yaCounter36585425.reachGoal(\'reg_3\');"/>
				   				</div>
				   			</form>';
	echo json_encode($response);
}
else
{
	$response["check_code"]=-1; //Выдать ошибку - неверный регистрационный код
	echo json_encode($response);
}
?>