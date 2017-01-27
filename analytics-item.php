<?php
require_once "php/functions.php";
require_once "php/load.php";

if ($myrow_auth['active_date'] < time()) { header("Location: analytics.php"); exit();}

if(isset($_GET["valut_id"]))
{
  switch ($_GET["valut_id"])
  {
    case "eur":
        $valut_id="EURUSD";
        $valut_title="EUR (PG39)";
        break;
    case "gbp":
        $valut_id="GBPUSD";
        $valut_title="GBP (PG29/PG30)";
        break;
      case "chf":
        $valut_id="USDCHF";
        $valut_title="CHF (PG33/PG34)";
        break;
      case "jpy":
        $valut_id="USDJPY";
        $valut_title="JPY (PG31/PG32)";
        break;
      case "cad":
        $valut_id="USDCAD";
        $valut_title="CAD (PG29/PG30)";
        break;
      case "aud":
        $valut_id="AUDUSD";
        $valut_title="AUD (PG38)";
        break;
      case "gold":
        $valut_id="XAUUSD";
        $valut_title="GOLD (PG64)";
        break;
	  case "xau":
        $valut_id="XAUUSD";
        $valut_title="XAU (GOLD) (PG64)";
        break;
      default:
          $valut_id="";
          $valut_title="";
  }
  
  mysql_select_db(DB_NAME_CME,$db_con);
  $option_month=mysql_real_escape_string(stripslashes(htmlspecialchars(trim($_GET["option_month"]))));
  $result=mysql_query("select `_id`,`_e_time`,`_option_month`,FROM_UNIXTIME(`_expiration`,'%d.%m.%Y') as `_exp` from `cme_options` where `_symbol`='$valut_id' AND `_e_time`>0 AND _expiration>'".time()."' ORDER BY _expiration LIMIT 1");
  if (mysql_num_rows($result))
  {
    $an=mysql_fetch_array($result);
	$date_value=date("d.m.Y",$an['_e_time']+4*3600);
    $res=mysql_query("select * from `cme_bill_".strtolower($valut_id)."_total` where `_option`='".$an['_id']."' and FROM_UNIXTIME(`_date`,'%d.%m.%Y')='".$date_value."'");
    if (mysql_num_rows($res))
    {
    	$date_exp=$an['_exp']; //ДАТА ЭКСПИРАЦИИ - НА ВЫВОД!!!
		$option_month = $an['_option_month'];
    	$_SESSION["option"]=$an['_id'];
  		$_SESSION["date_value"]=$date_value;
    	$an=mysql_fetch_object($res); //$an - НЕОБХОДИМЫЕ ДАННЫЕ ДЛЯ ВЫВОДА В ТАБЛИЦУ!
    }
    else
    {
      header("Location: analytics.php");
    }
  }
  else
  {
    header("Location: analytics.php");
  }
}
else
{
	header("Location: analytics.php");
}
mysql_select_db(DB_NAME,$db_con);
require_once "header.php";
mysql_select_db(DB_NAME_CME,$db_con);
?>
  <div class="main-row">

    <div id="sidebar" class="sidebar">
      <div class="sidebar-item__header"><i class="fa fa-cogs"></i>Инструменты</div>
      <div id="accordion">
        <div class="sidebar-item-month<? if ($_GET['valut_id'] == "eur") echo " sitebar-item-active"; ?>" id="EURUSD">EUR (PG39)</div>
        <div class="sidebar-item-month<? if ($_GET['valut_id'] == "gbp") echo " sitebar-item-active"; ?>" id="GBPUSD">GBP (PG27/PG28)</div>
        <div class="sidebar-item-month<? if ($_GET['valut_id'] == "chf") echo " sitebar-item-active"; ?>" id="USDCHF">CHF (PG35/PG36)</div>
        <div class="sidebar-item-month<? if ($_GET['valut_id'] == "jpy") echo " sitebar-item-active"; ?>" id="USDJPY">JPY (PG33/PG34)</div>
        <div class="sidebar-item-month<? if ($_GET['valut_id'] == "cad") echo " sitebar-item-active"; ?>" id="USDCAD">CAD (PG29/PG30)</div>
        <div class="sidebar-item-month<? if ($_GET['valut_id'] == "aud") echo " sitebar-item-active"; ?>" id="AUDUSD">AUD (PG38)</div>
		<div class="sidebar-item-month<? if ($_GET['valut_id'] == "xau") echo " sitebar-item-active"; ?>" id="XAUUSD">XAU (GOLD) (PG38)</div>
      </div>
    </div>

    <main class="main-block">

      <ul class="breadcrumbs">
        <li class="breadcrumbs__item"><a href="index.php"><i class="fa fa-home"></i></a><i class="fa fa-angle-right"></i></li>
        <li class="breadcrumbs__item"><a href="analytics.php">Аналитика</a><i class="fa fa-angle-right"></i></li>
        <li class="breadcrumbs__item breadcrumbs__item--active"><a href="analytics-item.php"><?php echo $valut_title ?></a></li>
      </ul>

      <div class="content__header">
        <h1>Анализ <span><?php echo $valut_title ?></span></h1>
        <div class="content__date-starting"><p>Валютная пара: <strong id="symbol"><?php echo $valut_id ?></strong></p></div>
		<div class="content__date-starting"><p>Опционный месяц: <span id="currency_option" class="currency_option"><? echo $option_month; ?></span>
			<ul class="select-opt-month" id="select-opt-month"><? 
				$r_opt = mysql_query("SELECT _symbol,_option_month,_expiration FROM cme_options WHERE _symbol='$valut_id' AND _e_time>0 ORDER BY _expiration");
				while ($m_opt = mysql_fetch_array($r_opt))
					{
					if ($option_month == $m_opt['_option_month']) $active = " item-active"; else $active = "";
					echo "<li class='item-month$active' id='".$m_opt['_option_month']."'>".$m_opt['_option_month']." <span>".date("m/d",$m_opt['_expiration'])."</span></li>";
					}
				?>
			</ul></p></div>  
		<div class="content__date-starting">
          <p>Дата отсчета: <i class="fa fa-calendar"></i><input type="text" id="data_date" value="<?php echo $date_value ?>" readonly="true" /></p>
        </div>
        <div class="content__date-expiration">
          <p>Дата экспирации: </p>
          <span id="date_exp"><?php echo $date_exp ?></span>
        </div>
      </div><!-- content__header -->

      <div class="message"></div>

      <div class="content__body">

        <div class="row">

          <div class="block block__data-final">

            <h2>Итоговые данные:</h2>
            <div class="data-final-row">
              <div class="data-final-title">
                <b>Значение открытого интереса:</b>
              </div>
              <div class="data-final-content">
                <p>Общее</p>
                <p id="_total_oi_call_put"><?php echo $an->_total_oi_call+$an->_total_oi_put ?></p>
              </div>
              <div class="data-final-content">
                <p>Изменение</p>
                <p id="_change_oi_call_put"><?php echo $an->_change_oi_call+$an->_change_oi_put ?></p>
              </div>
            </div>

            <div class="data-final-row">
              <div class="data-final-title">
                <b>Значение открытого интереса CALL:</b>
              </div>
              <div class="data-final-content">
                <p>Общее</p>
                <p id="_total_oi_call"><?php echo $an->_total_oi_call ?></p>
              </div>
              <div class="data-final-content">
                <p>Изменение</p>
                <p id="_change_oi_call"><?php echo $an->_change_oi_call ?></p>
              </div>
            </div>

            <div class="data-final-row">
              <div class="data-final-title">
                <b>Значение открытого интереса PUT:</b>
              </div>
              <div class="data-final-content">
                <p>Общее</p>
                <p id="_total_oi_put"><?php echo $an->_total_oi_put ?></p>
              </div>
              <div class="data-final-content">
                <p>Изменение</p>
                <p id="_change_oi_put"><?php echo $an->_change_oi_put ?></p>
              </div>
            </div>

            <div class="data-final-row">
              <div class="data-final-title">
                <b>Объём торгов:</b>
                <b id="_total_volume_call_put"><?php echo $an->_total_volume_call+$an->_total_volume_put ?></b>
              </div>
              <div class="data-final-title">
                <b>CALL</b>
                <b id="_total_volume_call"><?php echo $an->_total_volume_call ?></b>
              </div>
              <div class="data-final-title">
                <b>PUT</b>
                <b id="_total_volume_put"><?php echo $an->_total_volume_put ?></b>
              </div>
            </div>

          </div><!-- block__final-data -->


          <div class="block block__interests-players">

            <div class="type-report-container">
              <h2 id="type_report_title">Расстановка интересов игроков:</h2>
              <select name="" id="change_report" class="change-report">
                <option disabled="disabled">Тип отчета:</option>
                <option value="0" selected="selected">Расстановка интересов игроков</option>
                <option value="1">Динамика изменения OI</option>
                <option value="2">Активность покупателей и продавцов</option>
                <option value="3">Объём торгов</option>
                <option value="4">Общий объём торгов</option>
              </select>
            </div>

            <div class="data-final-row">
              <div id="container" style="width: 100%; height: 290px"></div>
            </div>

          </div><!-- block__players-interests -->

        </div><!-- row -->

        <div class="block block__interests-volume">

          <h2>Расстановка интересов игроков по уровням:</h2>
          <form id="form_filter" class="filter-container<? if($data['active_tariff'] > 0 && $m_user_tariff['_cp_filtr'] == false) echo " non-view";?>">

            <div class="filter-row">
              <p>Фильтры:</p>
                <div class="filter-radio">
                  <input type="radio" id="filter_type_call" name="filter_type" value="1" />
                  <label for="filter_type_call">CALL</label>
                  <input type="radio" id="filter_type_put" name="filter_type" value="2" />
                  <label for="filter_type_put">PUT</label>
                  <input type="radio" id="filter_type_all" name="filter_type" value="0" checked="checked" />
                  <label for="filter_type_all">Все</label>
                </div>
            </div>

            <div class="filter-row">
              <div class="filter-checkbox">
                <input type="checkbox" id="strike" name="strike" value="1" checked="checked" />
                <label for="strike">Strike</label>
              </div>
              <div class="filter-checkbox">
                <input type="checkbox" id="volume" name="volume" value="1" checked="checked" />
                <label for="volume">Volume</label>
              </div>
              <div class="filter-checkbox">
                <input type="checkbox" id="reciprocal" name="reciprocal" value="1" />
                <label for="reciprocal">Премия</label>
              </div>
              <div class="filter-checkbox">
                <input type="checkbox" id="delta" name="delta" value="1" />
                <label for="delta">Delta</label>
              </div>
              <div class="filter-checkbox">
                <input type="checkbox" id="oi" name="oi" value="1" checked="checked" />
                <label for="oi">OI</label>
              </div>
              <div class="filter-checkbox">
                <input type="checkbox" id="coi" name="coi" value="1" checked="checked" />
                <label for="coi">Изменение OI</label>
              </div>
              <div class="filter-checkbox">
                <input type="checkbox" id="price" name="price" value="1" />
                <label for="price">Цена</label>
              </div>
            </div>

            <div class="filter-row" style="justify-content:space-between;">
              <div class="filter-input">
                <label for="oi_more">OI больше:</label>
                <input type="text" name="oi_val" class="input-number"/>
              </div>
              <div class="filter-input">
                <label for="volume_more">Volume больше:</label>
                <input type="text" name="volume_val" class="input-number"/>
              </div>
              <div class="filter-input">
                <label for="coi_more">COI больше:</label>
                <input type="text" name="coi_val" class="input-number"/>
              </div>
              <div class="filter-input">
                <label for="price">Price :</label>
                <input type="text" name="price_val" class="input-number"/>
                <select name="up_or_down" id="up_or_down">
                  <option value="0">Меньше</option>
                  <option value="1" selected="selected">Больше</option>
                </select>
              </div>
            </div>

            <div class="filter-row">
              <button id="filter" class="filter-btn">Фильтровать</button>
            </div>

          </form><!-- filter-container -->

          <!-- СЮДА ВЫВОДИМ ТАБЛИЦЫ CALL и PUT -->
          <div class="volume-container"></div>

          <!-- СЮДА ВЫВОДИМ ГРАФИК OI ДЛЯ CALL и PUT -->
          <div id="graph_call" class="graph-container"></div>
          <div id="graph_put" class="graph-container"></div>

        </div><!-- block__interests-volume -->

      </div><!-- content__body -->
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
  <script src="js/main.js<? echo "?v=".date ("dmY ",filemtime("js/main.js")); ?>"></script>
  <script src="js/analytics.js<? echo "?v=".date ("dmY ",filemtime("js/analytics.js")); ?>"></script>
<script src="https://code.highcharts.com/highcharts.js"></script>
<script src="https://code.highcharts.com/modules/exporting.js"></script>
<script>
$(function () {
    $('#container').highcharts({
      chart: {
          type: 'bar'
      },
      title: {
          text: ''
      },
      exporting: {
          enabled: false
      },
      credits: {
          enabled: false
      },
      xAxis: {
          categories: [ '' ],
          title: {
              text: '<?php echo $date_value ?>'
          }
      },
      yAxis: {
          title: {
              text: ' '
          }
      },
      tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
      },
      colors: ['#0C7AC6','#A3443D'],
      series: [{
          name: 'CALL',
          data: [ <?php echo $an->_total_oi_call ?> ]
      }, {
          name: 'PUT',
          data: [ <?php echo $an->_total_oi_put ?> ]
      }]
    });
});
</script>

</body>
</html>