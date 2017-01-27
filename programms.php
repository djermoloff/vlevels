<?php
require_once "php/functions.php";
require_once "php/load.php";
require_once "header.php";
?>
  <div class="main-row">

    <div id="sidebar" class="sidebar">
      <div id="accordion">
        <div class="sidebar-item" id="description">Описание</div>
        <div class="sidebar-item" id="indicator_install">Инструкция по установке</div>
        <div class="sidebar-item" id="download">Скачать программы</div>
        <div class="sidebar-item" id="history">История версий</div>
        <div class="sidebar-item" id="support">Техническая поддержка</div>
      </div>
    </div>

    <main class="main-block">

      <ul class="breadcrumbs">
        <li class="breadcrumbs__item"><a href="index.php"><i class="fa fa-home"></i></a><i class="fa fa-angle-right"></i></li>
        <li class="breadcrumbs__item breadcrumbs__item--active"><a href="programms.php">Программы</a></li>
      </ul>

      <div class="content__header"></div>

      <div id="data_error"></div>

      <div class="content__body"></div>

      <div class="chat-container"></div>

    </main>
  </div><!-- main-row -->


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
  <script src="libs/colorpicker/colorpicker.js"></script>
  <script src="libs/simple-pagination/jquery.simplePagination.js"></script>
  <script src="js/main.js<? echo "?v=".date ("dmY ",filemtime("js/main.js")); ?>"></script>
  <script src="js/programms.js<? echo "?v=".date ("dmY ",filemtime("js/programms.js")); ?>"></script>
</body>
</html>