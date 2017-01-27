<?php
$u = "http://".$_SERVER['SERVER_NAME'].$_SERVER['REQUEST_URI'];
$n = strpos($u,"php/");
if ($n > 0) { $u=substr($u,0,$n+3).substr($u,$n+4); header("Location: ".$u); exit; }

require_once "php/functions.php";
header("Content-type: text/html; charset=UTF-8");
session_start();
CheckVisitor();
$check_auth=CheckAuth();
if ($check_auth==0) header("Location: index.php");
?>
<!DOCTYPE html>
<html lang="ru">
<head>
	<meta charset="utf-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />

	<title>Регистрация</title>

	<link rel="icon" href="/img/favicon.ico" type="image/x-icon" />
	<link rel="shortcut icon" href="/img/favicon.ico" type="image/x-icon" />
	
	<link rel="stylesheet" href="libs/jquery-ui/jquery-ui.css" />
	<link rel="stylesheet" href="libs/font-awesome/css/font-awesome.min.css" />
	<link rel="stylesheet" href="libs/owl.carousel/owl.carousel.css" />
	<link rel="stylesheet" href="libs/lightbox2/lightbox.css">
	<link rel="stylesheet" type="text/css" href="css/base.css" />
	<link rel="stylesheet" type="text/css" href="css/fonts.css" />
	<link rel="stylesheet" type="text/css" href="css/main.css" />
	<link rel="stylesheet" type="text/css" href="css/service.css" />
	<link rel="stylesheet" type="text/css" href="css/media.css" />
	
	<!-- Yandex.Metrika counter --> <script type="text/javascript"> (function (d, w, c) { (w[c] = w[c] || []).push(function() { try { w.yaCounter36585425 = new Ya.Metrika({ id:36585425, clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true }); } catch(e) { } }); var n = d.getElementsByTagName("script")[0], s = d.createElement("script"), f = function () { n.parentNode.insertBefore(s, n); }; s.type = "text/javascript"; s.async = true; s.src = "https://mc.yandex.ru/metrika/watch.js"; if (w.opera == "[object Opera]") { d.addEventListener("DOMContentLoaded", f, false); } else { f(); } })(document, window, "yandex_metrika_callbacks"); </script> <noscript><div><img src="https://mc.yandex.ru/watch/36585425" style="position:absolute; left:-9999px;" alt="" /></div></noscript> <!-- /Yandex.Metrika counter -->
	
</head>
<body id="page_registration">

<div class="loader">
	<div class="loader-inner"></div>
</div>
<a href="http://vlevels.ru" ><img src="img/logo.png" class="logo-reg" /></a>
<div id="main-wrapper">
	
	<div class="heightScreen">
		
		<div class="form__wrapper form__wrapper--reg">
			
			<div class="progress-bar">
				<div class="progress-bar__step progress-bar__step--active"><p>1</p>Ввод данных</div>
				<div class="progress-bar__step"><p>2</p>Подтверждение</div>
				<div class="progress-bar__step"><p>3</p>Придумайте пароль</div>
			</div>

			<div class="form__header">
				<h4>Регистрация:</h4>
			</div>

			<div class="form__body">
				<div id="preloading"></div>
				<div id="message" class="form_message hidden"></div>
				<div id="error_message" class="hidden form_message form_error"></div>
				
				<form id="registr_form_first">

					<div class="form__input-wrapper">
						<i class="fa fa-user"></i>
						<input type="text" class="form__input form__input-icon" name="user_name" id="user_name" autocomplete="off" placeholder="Введите своё имя" />

					</div>

					<div class="form__input-wrapper">
						<i class="fa fa-envelope"></i>
						<input type="text" class="form__input form__input-icon" name="email" id="email" autocomplete="off" placeholder="Введите действующий E-mail" />

					</div>

				    <div class="form__input-wrapper">
				    	<div class="checkbox">
							<input id="privacy_policy" type="checkbox" name="privacy_policy" value="1" class="privacy_policy-checkbox">
							<label for="privacy_policy" class="privacy_policy-label"><i class="fa"></i><a href="http://vlevels.ru/terms-of-use/" target="_blank">Пользовательское соглашение</a></label>
						</div>
				    </div>

					<div class="form__input-wrapper flex-row">
						<label for="promo_code" class="form__label form__label--reg_code">Промо код:</label>
						<input class="form__input form__input--promo-code" type="text" id="promo_code" minlength="6" maxlength="6" />
						<a href="auth.php" class="form__link form__link--reg" id="logIn">Войти</a>
						<input type="submit" class="form__btn" id="regFirstStep" value="Зарегистрироваться" onMouseDown="yaCounter36585425.reachGoal('reg_1');"/>
						<p id="error_promo-code" class="hidden error__text-input"></p>
					</div>
				</form>
			</div>

		</div>

	</div><!-- end heightScreen -->


</div><!-- main-wrapper -->


<!--[if lt IE 9]>
	<script src="libs/html5shiv/es5-shim.min.js"></script>
	<script src="libs/html5shiv/html5shiv.min.js"></script>
	<script src="libs/html5shiv/html5shiv-printshiv.min.js"></script>
	<script src="libs/respond/respond.min.js"></script>
<![endif]-->

	<script src="libs/jquery/jquery-2.1.4.min.js"></script>
	<script src="libs/jquery-ui/jquery-ui.js"></script>
	<script src="libs/owl.carousel/owl.carousel.min.js"></script>
	<script src="libs/lightbox2/lightbox.min.js"></script>
	<script src="libs/parallax/parallax.min.js"></script>
	<script src="libs/jquery-validation/jquery.validate.min.js"></script>
	<script type="text/javascript" src="js/main.js"></script>

</body>
</html>