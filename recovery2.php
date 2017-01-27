<?php
	session_start();
	if (!(isset($_SESSION["email_rec"])&&(trim($_GET["hash"])==md5($_SESSION["email_rec"]."fab663"))))
	{
		header("Location: recovery1.php");
	}
?>
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title> Восстановление пароля </title>

<!-- <link rel="icon" href="/favicon.ico" type="image/x-icon" />
  <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" /> -->

  <link rel="stylesheet" href="libs/jquery-ui/jquery-ui.css" />
  <link rel="stylesheet" href="libs/font-awesome/css/font-awesome.min.css" />
  <link rel="stylesheet" href="libs/owl.carousel/owl.carousel.css" />
  <link rel="stylesheet" href="libs/lightbox2/lightbox.css">
  <link rel="stylesheet" type="text/css" href="css/base.css" />
  <link rel="stylesheet" type="text/css" href="css/fonts.css" />
  <link rel="stylesheet" type="text/css" href="css/main.css" />
  <link rel="stylesheet" type="text/css" href="css/service.css" />
  <link rel="stylesheet" type="text/css" href="css/media.css" />

 </head>

<body id="page_recovery">

<div class="loader">
  <div class="loader-inner"></div>
</div>

<div id="main-wrapper">

  <div class="heightScreen">
    
    <div class="form__wrapper form__wrapper--auth">

      <div class="form__header">
        <h4>Восстановление пароля</h4>
      </div>

      <div class="form__body">
        <div id="message" class="form_message"></div>
        <div id="error_message" class="form_message form_error hidden"></div>
        
        <form id="recovery2_form" action="/lk/php/RecoverySecondStep.php" method="post" autocomplete="off">

          <div class="form__input-wrapper" style="text-align:center;">
            <label for="newPass" class="form__label form__label--auth">Введите новый пароль:</label>
            <input type="password" class="form__input form__input-recovery" name="newPass" style="width:100%;" />
          </div>

          <div class="form__input-wrapper" style="text-align:center;">>
            <label for="newRePass" class="form__label form__label--auth">Повторите новый пароль:</label>
            <input type="password" class="form__input form__input-recovery" name="newRePass" style="width:100%;" />
          </div>
          
          <div class="form__input-wrapper">
            <input type="submit" class="form__btn" name="submit" value="Восстановить" />
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