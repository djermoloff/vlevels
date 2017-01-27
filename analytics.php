<?php
require_once "php/functions.php";
require_once "php/load.php";
require_once "header.php";
?>

  <div class="main-row">

    <main class="main-block">

      <ul class="breadcrumbs">
        <li class="breadcrumbs__item"><a href="index.php"><i class="fa fa-home"></i></a><i class="fa fa-angle-right"></i></li>
        <li class="breadcrumbs__item breadcrumbs__item--active"><a href="analytics.php">Аналитика</a></li>
      </ul>

      <div class="content__header">
        <h1>Инструменты</h1>
      </div><!-- content__header -->

      <div class="content__body">

        <div id="" class="table-data">
          <div class="table-data-head">
                <div></div>
                <div>Наименование</div>
                <div>Последний отсчет</div>
                <div>Открытый интерес</div>
                <div>Дата. экспирация</div>
                <div>Инструменты</div>
          </div>
          <div class="table-data-body">
            <?php
              $arr_valut_id=array("EURUSD","GBPUSD","USDJPY","USDCHF","USDCAD","AUDUSD","XAUUSD");
              $arr_valut_name=array("eur","gbp","jpy","chf","cad","aud","xau");
              $arr_valut_pg=array("EUR (PG39)","GBP (PG27/PG28)","JPY (PG33/PG34)","CHF (PG35/PG36)","CAD (PG29/PG30)","AUD (PG38)","XAU (GOLD) (PG64)");
              $j=1;
			  
              for ($i=0; $i<7; $i++)
				{
				mysql_select_db(DB_NAME_CME,$db_con);
                $months=mysql_query("select `_id`,`_option_month`,`_expiration` from `cme_options` where `_symbol`='".$arr_valut_id[$i]."'
                						and `_expiration` >= '".time()."' order by `_expiration` asc");
                if (mysql_num_rows($months))
					{
					$data_months = mysql_fetch_array($months);
					$result=mysql_query("select FROM_UNIXTIME(`_date`,'%d.%m.%Y') as `_dat`,`_total_oi_call`+`_total_oi_put` as `_total_oi_call_put`,`_total_volume_call`,`_total_volume_put` from
                             `cme_bill_".strtolower($arr_valut_id[$i])."_total` where `_option`='".$data_months['_id']."' and
                              FROM_UNIXTIME(`_date`,'%d.%m.%Y') <> '".date("d.m.Y",$data_months['_expiration'])."' order by `_date` desc");
					if (mysql_num_rows($result))
						{
						$flag_color = "";
						$res = mysql_query("select `_comment` from `indicator_comment` where `_id_user`='".$myrow_auth['id']."' and `_option`='".$data_months['_id']."'");
						if (mysql_num_rows($res)>0) $flag_color = " red"; else $flag_color = "";
						$data=mysql_fetch_array($result);
						echo '<div id="'.$arr_valut_name[$i].'" class="table-data-row analytics-row">
                                  <div>'.$j.'.</div>
                                  <div>'.$arr_valut_pg[$i].'</div>
                                  <div id="date_value_'.$arr_valut_name[$i].'">'.$data['_dat'].'</div>
                                  <div id="open_intrst">'.$data['_total_oi_call_put'].'</div>
                                  <div id="date_exp">'.date("d.m.Y",$data_months['_expiration']).'</div>
                                  <div><i class="fa fa-flag'.$flag_color.'"></i></div>
                          </div>';
                        $j++;

                        $date_values = array();
                        $volume_call = array();
                        $volume_put = array();
                        while ($rows=mysql_fetch_array($result))
							{
							array_push($date_values, substr($rows['_dat'],0,10));
							array_push($volume_call, $rows['_total_volume_call']);
							array_push($volume_put, $rows['_total_volume_put']);
							}
                        $date_values = array_reverse($date_values);
                        $volume_call = array_reverse($volume_call);
                        $volume_put = array_reverse($volume_put);
                    }
                }
              }
              mysql_close($db_con);
            ?>
            <input type="hidden" name="data_months" value="<?php echo $data_months['_option_month'] ?>" />
          </div>
        </div><!-- table-data -->

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

</body>
</html>