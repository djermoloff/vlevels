<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title><?php switch(basename($_SERVER['SCRIPT_FILENAME'])) { case "analytics.php" : { echo "VLevels - Аналитика"; break; } case "analytics-item.php" : { echo "VLevels - Аналитика"; break; } case "programms.php" : { echo "VLevels - Программы"; break; } case "information.php" : { echo "VLevels - Мои данные"; break; } default: echo "Volume Levels"; } ?></title>

  <link rel="icon" href="/img/favicon.ico" type="image/x-icon" />
  <link rel="shortcut icon" href="/img/favicon.ico" type="image/x-icon" />

  <link rel="stylesheet" href="libs/jquery-ui/jquery-ui.css<?php echo "?v=".date ("dmY ",filemtime("libs/jquery-ui/jquery-ui.css")); ?>" />
  <link rel="stylesheet" href="libs/font-awesome/css/font-awesome.min.css<?php echo "?v=".date ("dmY ",filemtime("libs/font-awesome/css/font-awesome.min.css")); ?>" />
  <link rel="stylesheet" href="libs/owl.carousel/owl.carousel.css<?php echo "?v=".date ("dmY ",filemtime("libs/owl.carousel/owl.carousel.css")); ?>" />
  <link rel="stylesheet" href="libs/lightbox2/lightbox.css<?php echo "?v=".date ("dmY ",filemtime("libs/lightbox2/lightbox.css")); ?>" />
  <link rel="stylesheet" href="libs/colorpicker/colorpicker.css<?php echo "?v=".date ("dmY ",filemtime("libs/colorpicker/colorpicker.css")); ?>" />
  <link rel="stylesheet" href="libs/simple-pagination/simplePagination.css<?php echo "?v=".date ("dmY ",filemtime("libs/simple-pagination/simplePagination.css")); ?>" />
  <link rel="stylesheet" type="text/css" href="css/base.css<?php echo "?v=".date ("dmY ",filemtime("css/base.css")); ?>" />
  <link rel="stylesheet" type="text/css" href="css/fonts.css<?php echo "?v=".date ("dmY ",filemtime("css/fonts.css")); ?>" />
  <link rel="stylesheet" type="text/css" href="css/main.css<?php echo "?v=".date ("dmY ",filemtime("css/main.css")); ?>" />
  <link rel="stylesheet" type="text/css" href="css/service.css<?php echo "?v=".date ("dmY ",filemtime("css/service.css")); ?>" />
  <link rel="stylesheet" type="text/css" href="css/media.css<?php echo "?v=".date ("dmY ",filemtime("css/media.css")); ?>" />
</head>

<body id="page_analytics">

<? 
require_once "php/popup/preloader.php";
require_once "php/popup/questionnaire.php";
require_once "php/popup/payment.php"; 
if (basename($_SERVER['SCRIPT_FILENAME']) == "information.php") require_once "php/popup/withdraw.php"; 
if (basename($_SERVER['SCRIPT_FILENAME']) == "programms.php") require_once "php/popup/key.php"; 
?>
<div id="main-wrapper">
  <div id="alert-message"></div>
  <div class="top-row">
    <a href="index.php" class="logo-wrapper">
        <img class="logo-image" src="img/logo.png" alt="Volume Levels" title="Volume Levels" />
    </a>
    <nav class="nav-menu">
      <ul class="menu-items">
        <li class="menu-item<? if (basename($_SERVER['SCRIPT_FILENAME']) == "analytics.php" || basename($_SERVER['SCRIPT_FILENAME']) == "analytics-item.php") echo " menu-item-active"; ?>"><a href="analytics.php">Аналитика</a></li>
        <li class="menu-item<? if (basename($_SERVER['REQUEST_URI'], ".php") == "programms") echo " menu-item-active"; ?>"><a href="programms.php">Программы</a></li>
		<li class="menu-item"><a href="http://vlevels.ru/prices/" target="_blank">Тарифы</a></li>
      </ul>
      <div class="user-info">
        <div class="user-info__name"><i class="fa fa-user"></i><?php echo $myrow_auth['name']; ?><i class="fa fa-caret-down"></i></div>
        <div class="user-menu">
          <a href="information.php">Мои данные</a>
          <a href="information.php?tab=my_cash">Мои финансы</a>
          <a href="information.php?tab=referal_program">Партнерам</a>
          <span id="logout">Выход</span>
        </div>
        <div class="user-info__license">
          <div class="user-info__license-text">Лицензия до:</div>
          <div class="user-info__license-date"><?php echo date("d.m.Y",$myrow_auth['active_date']); ?></div>
        </div>
        <button class="user-info__btn" id="extend_account5" onClick="open_window('pay-money');">Продлить</button>
      </div>
    </nav>
  </div><!-- top-row -->