// событие готовности ДОМ-дерева
$(document).ready(function() {

/***************************/
/*** page analytics.php ***/
/*************************/
    // при выборе валютной пары, формируем GET запрос и переходим на страницу валюты
    $('.analytics-row').on('click', function() {
        // id валютной пары
        var valut_id = $(this).attr('id');
        // отсчетный месяц для валютной пары
        var option_month = $('input[name=data_months').val();
        // дата последнего отчёта
        var date_value = $('#date_value_' + valut_id).html().substr(0,10);
        // перенаправляем на страницу выбранной валютной пары
        // передаем параметры: valut_id, date_value, option_month
        window.location = 'analytics-item.php?valut_id='+valut_id;
    });
/********************************/
/*** page analytics-item.php ***/
/******************************/
    // при загрузке страницы иммитируем клик по кнопке "Фильтровать"
    setTimeout( function() { $('#filter').trigger('click') }, 300);
    // при клике по валютной паре, загружаем отчётные месяцы
    $('.sidebar-item').on('click', function() {
        // выбранная валютная пара
        var self = $(this);
        // id выбранной валютной пары
        var id = self.attr('id');
        // ищим отчётные месяцы, для выбранной валютной пары 
        var item_months = self.next('ul#item-months');
        // если у выбранной валютной пары есть отчётные месяца
        if (item_months.length > 0) {
            // мы их удаляем
            item_months.remove();
        } else {
            // иначе удаляем отчётные месяца у всех остальных валютных пар
            $('ul#item-months').remove();
            // и получаем отчётные месяца для выбранной влютной пары
            $.ajax({
                url: "php/Anal.php",
                type: "post",
                dataType: "json",
                data: {
                    "valut_id" : id
                },
                success: function(response) {alert(response);
                    // вставляем отчётные месяца после выбранной валютной пары
                    self.after(response);
                },
                error: function(response) {
                    var reg = /user_not_found/i;
                    var text = response.responseText;
                    if (text.search(reg) != 1) {
                        RedirectAuth();
                    }
                }
            });
            return false;
        }
    });
    // при выборе отчётного месяца загружаем данные
    $('body').on('click', '.item-month', function() {
        // выбранный отчётный месяц
        var self = $(this);
        // id выбранного отчётного месяца
        var id = self.attr('id');
		var option_month = self.html().substr(0,5);
		var symbol = $('#symbol').html();
        // дата экспирации
        var date_exp = $('#date_exp').html();
        
		document.getElementById('select-opt-month').style.display = 'none';
		//$("#select-opt-month").animate({scrollTop: 0}, 100);
		
        // делаем аякс запрос, отправляем id выбранного отчётного месяца
        $.ajax({
            url: "php/Anal.php",
            type: "post",
            dataType: "json",
            data: {
                "pr" : id, "symbol" : symbol
            },
            success: function(response) {
				if (response.success == "ok")
					{
					// очищаем контейнеры для вывода таблиц CALL и PUT 
					$('.volume-container').empty();
					// очищаем контейнеры для вывода графиков OI для CALL и PUT
					$('.graph-container').empty();
					// удаляем класс актив у всех отчётных месяцев
					$('.item-month').removeClass('item-active');
					// добавляем класс актив к выбранному отчётному месяцу
					self.addClass('item-active');
					// изменяем название валютной пары в "хлебных крошках"
					$('.breadcrumbs__item--active a').empty().append(getValutTitle(response['valut_id']));
					// изменяем название валютной пары в теге h1
					$('.content__header h1>span').empty().append(getValutTitle(response['valut_id']));
					// изменяем значение в "Дата отсчета"
					$('#data_date').val(response['data_date']);
					// изменяем значение в "Дата экспирации"
					$('#date_exp').empty().append(response['date_exp']);
					// данные в "Значение открытого интереса: - Общее"
					$('#_total_oi_call_put').empty().append(Number(response['_total_oi_call'])+Number(response['_total_oi_put']));
					// данные в "Значение открытого интереса - Изменение"
					$('#_change_oi_call_put').empty().append(Number(response['_change_oi_call'])+Number(response['_change_oi_put']));
					// данные в "Значение открытого интереса CALL: - Общее"
					$('#_total_oi_call').empty().append(response['_total_oi_call']);
					// данные в "Значение открытого интереса CALL: - Изменение"
					$('#_change_oi_call').empty().append(response['_change_oi_call']);
					// данные в "Значение открытого интереса PUT: - Общее"
					$('#_total_oi_put').empty().append(response['_total_oi_put']);
					// данные в "Значение открытого интереса PUT: - Изменение"
					$('#_change_oi_put').empty().append(response['_change_oi_put']);
					// данные в "Объём торгов"
					$('#_total_volume_call_put').empty().append(Number(response['_total_volume_call'])+Number(response['_total_volume_put']));
					// данные в "Объём торгов CALL"
					$('#_total_volume_call').empty().append(response['_total_volume_call']);
					// данные в "Объём торгов PUT"
					$('#_total_volume_put').empty().append(response['_total_volume_put']);
					$('#currency_option').empty().append(option_month);
					// строим график "Расстановка интересов игроков"
					interests_players(Number(response['_total_oi_call']),Number(response['_total_oi_put']));
					// иммитируем клик по кнопке "Фильтровать"
					setTimeout( function() { $('#filter').trigger('click') }, 100);
					}
				if (response.success == "limits-of-tariff")
					{
					$('#info-next-tarif').empty().append(response.message);
					$('#wpay-h4').empty().append(response.title);
					document.getElementById('select-tariff').options[response.select-1].selected = 'true'
					open_window('pay-money');
					}
            },
            error: function(response) {
                var reg = /user_not_found/i;
                var text = response.responseText;
                if (text.search(reg) != 1) {
                    RedirectAuth();
                }
            }
        });
        return false;
    });

	$('#currency_option').on('click', function () 
		{ 
		document.getElementById('select-opt-month').style.display = 'block';
		var p = $( "li.item-active" );
		var position = p.position();
		var scroll = $("#select-opt-month").scrollTop();
		t = scroll+position.top-80;
		$("#select-opt-month").animate({scrollTop: t}, 100);
		});
	
	// при выборе отчётного месяца загружаем данные
    $('body').on('click', '.sidebar-item-month', function() {
        // выбранный отчётный месяц
        var self = $(this);
        // id выбранного отчётного месяца
        var id = self.attr('id');
        // дата экспирации
        var date_exp = $('#date_exp').html();
        // очищаем контейнеры для вывода таблиц CALL и PUT
        $('.volume-container').empty();
        // очищаем контейнеры для вывода графиков OI для CALL и PUT
        $('.graph-container').empty();
        // удаляем класс актив у всех отчётных месяцев
        $('.sidebar-item-month').removeClass('sitebar-item-active');
        // добавляем класс актив к выбранному отчётному месяцу
        self.addClass('sitebar-item-active');
        // делаем аякс запрос, отправляем id выбранного отчётного месяца
        $.ajax({
            url: "php/Anal.php",
            type: "post",
            dataType: "json",
            data: {
                "symbol" : id
            },
            success: function(response) {
				if (response.success == "ok")
					{
					$("#select-opt-month").empty().append(response.months);
					// изменяем название валютной пары в "хлебных крошках"
					$('.breadcrumbs__item--active a').empty().append(getValutTitle(response['valut_id']));
					// изменяем название валютной пары в теге h1
					$('.content__header h1>span').empty().append(getValutTitle(response['valut_id']));
					// изменяем значение в "Дата отсчета"
					$('#data_date').val(response['data_date']);
					// изменяем значение в "Дата экспирации"
					$('#date_exp').empty().append(response['date_exp']);
					// данные в "Значение открытого интереса: - Общее"
					$('#_total_oi_call_put').empty().append(Number(response['_total_oi_call'])+Number(response['_total_oi_put']));
					// данные в "Значение открытого интереса - Изменение"
					$('#_change_oi_call_put').empty().append(Number(response['_change_oi_call'])+Number(response['_change_oi_put']));
					// данные в "Значение открытого интереса CALL: - Общее"
					$('#_total_oi_call').empty().append(response['_total_oi_call']);
					// данные в "Значение открытого интереса CALL: - Изменение"
					$('#_change_oi_call').empty().append(response['_change_oi_call']);
					// данные в "Значение открытого интереса PUT: - Общее"
					$('#_total_oi_put').empty().append(response['_total_oi_put']);
					// данные в "Значение открытого интереса PUT: - Изменение"
					$('#_change_oi_put').empty().append(response['_change_oi_put']);
					// данные в "Объём торгов"
					$('#_total_volume_call_put').empty().append(Number(response['_total_volume_call'])+Number(response['_total_volume_put']));
					// данные в "Объём торгов CALL"
					$('#_total_volume_call').empty().append(response['_total_volume_call']);
					// данные в "Объём торгов PUT"
					$('#_total_volume_put').empty().append(response['_total_volume_put']);
					$('#currency_option').empty().append(response['prefix']);
					// удаляем класс актив у всех отчётных месяцев
					$('.item-month').removeClass('item-active');
					// добавляем класс актив к выбранному отчётному месяцу
					e = "#" + response['prefix'];
					$(e).addClass('item-active');
					// строим график "Расстановка интересов игроков"
					interests_players(Number(response['_total_oi_call']),Number(response['_total_oi_put']));
					$('#symbol').empty().append(id);
					// иммитируем клик по кнопке "Фильтровать"
					setTimeout( function() { $('#filter').trigger('click') }, 100);
					}
					else
					{
					$('#info-next-tarif').empty().append(response.message);
					$('#wpay-h4').empty().append(response.title);
					document.getElementById('select-tariff').options[response.select].selected = 'true'
					open_window('pay-money');
					}
            },
            error: function(response) {
                var reg = /user_not_found/i;
                var text = response.responseText;
                if (text.search(reg) != 1) {
                    RedirectAuth();
                }
            }
        });
        return false;
    });

    // инициализация датапикера
    $("#data_date").datepicker({
        // событие выбора нового значения даты в датапикере
        onSelect: function(dateText, inst) {  // аяксом отправляем новую дату на сервер
            // очищаем контейнеры для вывода таблиц CALL и PUT
            $('.volume-container').empty();
            // очищаем контейнеры для вывода графиков OI для CALL и PUT
            $('.graph-container').empty();
            // делаем аякс запрос, отправляем новое значение, выбранное в календаре "Дата отсчёта"
            $.ajax({
                url: "php/Anal.php",
                type: "post",
                dataType: "json",
                data: {
                    "date" : dateText
                },
                success: function(response) {
console.log(response);
                    // если "Отчет за выбранную дату не найден"
                    if (response['not_found']) {
                        $('.message').empty().append('<i class="fa fa-ban"></i>'+response.not_found).addClass('error').removeClass('hidden');
                        $('html, body').animate({scrollTop: 0},100);
                        setTimeout( function() { $('.message').empty().removeClass('error').addClass('hidden') }, 3000);
                    }

                    $('#_total_oi_call_put').empty().append(Number(response['_total_oi_call'])+Number(response['_total_oi_put']));
                	$('#_change_oi_call_put').empty().append(Number(response['_change_oi_call'])+Number(response['_change_oi_put']));
                	$('#_total_oi_call').empty().append(response['_total_oi_call']);
                	$('#_change_oi_call').empty().append(response['_change_oi_call']);
                	$('#_total_oi_put').empty().append(response['_total_oi_put']);
                	$('#_change_oi_put').empty().append(response['_change_oi_put']);
               	 	$('#_total_volume_call_put').empty().append(Number(response['_total_volume_call'])+Number(response['_total_volume_put']));
                	$('#_total_volume_call').empty().append(response['_total_volume_call']);
                	$('#_total_volume_put').empty().append(response['_total_volume_put']);

                    // строим график "Расстановка интересов игроков" по текущим значениям total_oi_call и total_oi_put
                    interests_players(Number(response['_total_oi_call']),Number(response['_total_oi_put']));
                    // иммитируем клик по кнопке "Фильтровать"
                    setTimeout( function() { $('#filter').trigger('click') }, 100);
                },
                error: function(response) {
                    var reg = /user_not_found/i;
                    var text = response.responseText;
                    if (text.search(reg) != 1) {
                        RedirectAuth();
                    }
                }
            });
            return false;
        }
    });

    // инициализируем виджет выпадающего списка, принимаем изменения значений
    // 0 - РАССТАНОВКА ИНТЕРЕСОВ ИГРОКОВ
    // 1 - ДИНАМИКА ИЗМЕНЕНИЯ OI
    // 2 - АКТИВНОСТЬ ПОКУПАТЕЛЕЙ И ПРОДАВЦОВ
    // 3 - ОБЪЕМ ТОРГОВ
    // 4 - ОБЩИЙ ОБЪЕМ ТОРГОВ
    $('#change_report').selectmenu({
        width: 220,
        position: { my: "right top", at: "right bottom"},
        // при изменении значения в выпадающем списке, строим соответствующий график
        change: function( event, ui ) {
            // получаем значение в "Дата отсчета"
            var date = $('#data_date').val();
            // выбранное значение в выпадающем списке
            var index = ui.item.value;
console.log(index);
            // если выбран график "РАССТАНОВКА ИНТЕРЕСОВ ИГРОКОВ" - значение "0"
            if (index==0) {
                // получаем текущее значение открытого интереса CALL
                var total_oi_call = $('#_total_oi_call').text();
                // получаем текущее значение открытого интереса PUT
                var total_oi_put = $('#_total_oi_put').text();
                // строим график "Расстановка интересов игроков" по текущим значениям total_oi_call и total_oi_put
                interests_players(Number(total_oi_call),Number(total_oi_put)); 
            } else {
                // если вырано любое значение отличное от "0"
                $.ajax({
                    url: "php/Anal.php",
                    type: "post",
                    dataType: "json",
                    data: {
                        "type_report" : index
                    },
                    success: function(response) {
console.log(response);
                        // если "Сессия не найдена"
                        if (response['session_error']) {
                            $('.message').empty().append('<i class="fa fa-ban"></i>Сессия не найдена!').addClass('error').removeClass('hidden');
                            $('html, body').animate({scrollTop: 0},100);
                            setTimeout( function() { $('.message').empty().removeClass('error').addClass('hidden') }, 3000);
                        }
                        // если "Графика не существует"
                        if (response['report_error']) {
                            $('.message').empty().append('<i class="fa fa-ban"></i>Графика не существует!').addClass('error').removeClass('hidden');
                            $('html, body').animate({scrollTop: 0},100);
                            setTimeout( function() { $('.message').empty().removeClass('error').addClass('hidden') }, 3000);
                        }

                        // массив дат
                        var arr_date = Array();
                        // массив значений открытого интереса CALL
                        var total_oi_call = Array();
                        // массив значений открытого интереса PUT
                        var total_oi_put = Array();
                        // массив значений изменений открытого интереса CALL
                        var change_oi_call = Array();
                        // массив значений изменений открытого интереса PUT
                        var change_oi_put = Array();
                        // массив значений объема открытого интереса CALL
                        var total_volume_call = Array();
                        // массив значений объема открытого интереса PUT
                        var total_volume_put = Array();
                        // массив значений общего объема торгов
                        var volume_sum = Array();

                        $.each(response, function(obj_parent) {
                            $(this).each(function(obj) {
                                $(this).each(function(index, value) {
                                    arr_date.push(value['_dat']);
                                    total_oi_call.push(Number(value['_total_oi_call']));
                                    total_oi_put.push(Number(value['_total_oi_put']));
                                    change_oi_call.push(Number(value['_change_oi_call']));
                                    change_oi_put.push(Number(value['_change_oi_put']));
                                    total_volume_call.push(Number(value['_total_volume_call']));
                                    total_volume_put.push(Number(value['_total_volume_put']));
                                    volume_sum.push(Number(value['_total_volume_call_put']));
                                });
                            });
                        });

                        console.log(arr_date);
                        console.log(total_oi_call);
                        console.log(total_oi_put);
                        console.log(change_oi_call);
                        console.log(change_oi_put);
                        console.log(total_volume_call);
                        console.log(total_volume_put);
                        console.log(volume_sum);

                        // если значение выпадающего списка:
                        switch (index)
                        {
                        	case "1":
                                // 1 - строим график ДИНАМИКА ИЗМЕНЕНИЯ OI
                                total_oi(arr_date,total_oi_call,total_oi_put);
                                break;
                            case "2":
                                // 2 - строим график АКТИВНОСТЬ ПОКУПАТЕЛЕЙ И ПРОДАВЦОВ
                                change_oi(arr_date,change_oi_call,change_oi_put);
                                break;
                            case "3":
                                // 3 - строим график ОБЪЕМ ТОРГОВ
                                total_volume(arr_date,total_volume_call,total_volume_put);
                                break;
                            case "4":
                                // 4 - строим график ОБЩИЙ ОБЪЕМ ТОРГОВ
                                total_volume_sum(arr_date,volume_sum);
                                break;
                        }
                    },
                    error: function(response) {
                        var reg = /user_not_found/i;
                        var text = response.responseText;
                        if (text.search(reg) != 1) {
                            RedirectAuth();
                        }
                    }
                });
                return false;
            }
            
        }
    });
    
    // значения "Больше"/"Меньше" в фильтре
    $('#up_or_down').selectmenu({
        width: 90,
        position: { my: "right top", at: "right bottom"}
    });

    // для данных, полученных после фильтрации
    var data_object = Array();

    // клик по кнопке "Фильтровать"
    $('#filter').on('click', function(e) {
        // отменяем событие по умолчанию
        e.preventDefault();
        var filter_type = $('input[name=filter_type]:checked').val();
        var oi_val = $('input[name=oi_val]').val();
        var volume_val = $('input[name=volume_val]').val();
        var coi_val = $('input[name=coi_val]').val();

        // значение чекбокса strike
        var strike = $('input[name=strike]').prop('checked');
        // значение чекбокса volume
        var volume = $('input[name=volume]').prop('checked');
        // значение чекбокса reciprocal
        var reciprocal = $('input[name=reciprocal]').prop('checked');
        // значение чекбокса delta
        var delta = $('input[name=delta]').prop('checked');
        // значение чекбокса oi
        var oi = $('input[name=oi]').prop('checked');
        // значение чекбокса coi
        var coi = $('input[name=coi]').prop('checked');
        // значение чекбокса price
        var price = $('input[name=price]').prop('checked');
        // массив значений всех чекбоксов
        var arr_checkbox = {
            'strike': strike,
            'volume': volume,
            'reciprocal': reciprocal,
            'delta': delta,
            'oi': oi,
            'coi': coi,
            'price': price
        };

        var preloading = '<div id="preloading"></div>';

        // вывод названий колонок
        $('.volume-row-head .volume-strike').text('Strike');
        $('.volume-row-head .volume-volume').text('Volume');
        $('.volume-row-head .volume-reciprocal').text('Премия');
        $('.volume-row-head .volume-delta').text('Delta');
        $('.volume-row-head .volume-oi').text('OI');
        $('.volume-row-head .volume-coi').text('Change');
        $('.volume-row-head .volume-price').text('Цена');

        $('#call').empty();
        $('#put').empty();
        $('.volume-table').removeClass('hidden');
        $('.volume-container').empty();
        $('.graph-container').empty();

        if (strike || volume || reciprocal || delta || oi || coi || price)
        {
            $.ajax({
                url: "php/Anal.php",
                type: "post",
                dataType: "json",
                data: {
                    'filter_type' : filter_type,
                    'strike' : strike,
                    'volume' : volume,
                    'reciprocal' : reciprocal,
                    'delta' : delta,
                    'oi' : oi,
                    'coi' : coi,
                    'oi_val' : oi_val,
                    'volume_val' : volume_val,
                    'coi_val' : coi_val
                },
                beforeSend: function(data)
                {
                    $('.volume-container').append(preloading);
                    $('#preloading').addClass('loading');
                },
                success: function(response) {

                    // если "Сессия не найдена"
                    if (response['session_error']) {
                        $('.message').empty().append('<i class="fa fa-ban"></i>Сессия не найдена!').addClass('error').removeClass('hidden');
                        $('html, body').animate({scrollTop: 0},100);
                        setTimeout( function() { $('.message').empty().removeClass('error').addClass('hidden') }, 3000);
                    }
                    // если "Нет данных"
                    if (response['data_not_exist']) {
                        $('.message').empty().append('<i class="fa fa-ban"></i>'+response['data_not_exist']).addClass('error').removeClass('hidden');
                        $('html, body').animate({scrollTop: 0},100);
                        setTimeout( function() { $('.message').empty().removeClass('error').addClass('hidden') }, 3000);
                    }


                    // массивы для объектов CALL и PUT
                    var arr_call = Array();
                    var arr_put = Array();

                    // сохраняем данные для дальнейшего использования
                    data_object = response;
                    // значение инпута Price: price_value==number
                    var price_value = Number($('input[name=price_val]').val());
                    // значение "Больше"\"Меньше"
                    var up_or_down = $('select[name=up_or_down] option:selected').val();
                    
                    // если чекбокс прайс не установлен
                    if (!price)
                    {
                        // если значение поля прайс пустое
                        if (price_value == 0)
                        {
                            // max_oi, max_volume и price для CALL из массива response
                            var max_oi_call = obj_max_level(response,'_oi',0);
                            var max_volume_call = obj_max_level(response,'_volume',0);
                            (max_oi_call==-1) ? data_not_found('call') : data_output(response,max_oi_call,max_volume_call,'call');

                            // max_oi, max_volume и price для PUT из массива response
                            var max_oi_put = obj_max_level(response,'_oi',1);
                            var max_volume_put = obj_max_level(response,'_volume',1);
                            (max_oi_put==-1) ? data_not_found('put') : data_output(response,max_oi_put,max_volume_put,'put');

                            // формируем массивы значений для CALL и PUT
                            $.each(response, function(key,value) {
                                (value['_type'] == 0) ? arr_call.push(value) : arr_put.push(value);
                            });

                            // если массивы не пустые создаем таблицу, иначе очищаем таблицу
                            (arr_call.length != 0) ? create_table_level(arr_call,'call') : $('#call').empty().append('Данные не найдены!');
                            (arr_put.length != 0) ? create_table_level(arr_put,'put') : $('#put').empty().append('Данные не найдены!');
                        } else
                        {
                            // формируем массивы с отсортированными значениями для CALL и PUT
                            $.each(response, function(key,value) {
                                price = get_price(value);  // цена для каждого объекта
                                if (up_or_down == 1)  // если выбрано значение "Больше"
                                {
                                    if (price > price_value)
                                    {
                                        (value['_type'] == 0) ? arr_call.push(value) : arr_put.push(value);
                                    }
                                } else  // если выбрано значение "Меньше"
                                {
                                    if (price < price_value)
                                    {
                                        (value['_type'] == 0) ? arr_call.push(value) : arr_put.push(value);
                                    }
                                }
                            });
                            // max_oi, max_volume и price для CALL из массива arr_call
                            var max_oi_call = obj_max_level(arr_call,'_oi',0);
                            var max_volume_call = obj_max_level(arr_call,'_volume',0);
                            (max_oi_call==-1) ? data_not_found('call') : data_output(arr_call,max_oi_call,max_volume_call,'call');

                            // max_oi, max_volume и price для PUT из массива arr_put
                            var max_oi_put = obj_max_level(arr_put,'_oi',1);
                            var max_volume_put = obj_max_level(arr_put,'_volume',1);
                            (max_oi_put==-1) ? data_not_found('put') : data_output(arr_put,max_oi_put,max_volume_put,'put');

                            // если массивы не пустые создаем таблицу, иначе очищаем таблицу
                            (arr_call.length != 0) ? create_table_level(arr_call,'call') : $('#call').empty().append('Данные не найдены!');
                            (arr_put.length != 0) ? create_table_level(arr_put,'put') : $('#put').empty().append('Данные не найдены!');
                        }
                    } else
                    {
                        if (price_value == 0)
                        {
                            // массивы для цен
                            var arr_call_price = Array(),
                                arr_put_price  =Array();
                            // max_oi, max_volume и price для CALL из массива response
                            var max_oi_call = obj_max_level(response,'_oi',0);
                            var max_volume_call = obj_max_level(response,'_volume',0);
                            (max_oi_call==-1) ? data_not_found('call') : data_output(response,max_oi_call,max_volume_call,'call');

                            // max_oi, max_volume и price для PUT из массива response
                            var max_oi_put = obj_max_level(response,'_oi',1);
                            var max_volume_put = obj_max_level(response,'_volume',1);
                            (max_oi_put==-1) ? data_not_found('put') : data_output(response,max_oi_put,max_volume_put,'put');

                            // формируем массивы значений для CALL и PUT
                            $.each(response, function(key,value) {
                                price = get_price(value);  // цена для каждого объекта
                                value['_price'] = price;  // добавляем свойство _price в объект value
                                (value['_type'] == 0) ? arr_call.push(value) : arr_put.push(value);
                            });

                            // если массивы не пустые создаем таблицу, иначе очищаем таблицу
                            (arr_call.length != 0) ? create_table_level(arr_call,'call') : $('#call').empty().append('Данные не найдены!');
                            (arr_put.length != 0) ? create_table_level(arr_put,'put') : $('#put').empty().append('Данные не найдены!');
                        } else
                        {
                            // формируем массивы с отсортированными значениями для CALL и PUT
                            $.each(response, function(key,value) {
                                price = get_price(value);  // цена для каждого объекта

                                if (up_or_down == 1)  // если выбрано значение "Больше"
                                {
                                    if (price > price_value)
                                    {
                                        value['_price'] = price;  // добавляем свойство _price в объект value
                                        (value['_type'] == 0) ? arr_call.push(value) : arr_put.push(value);
                                    }
                                } else  // если выбрано значение "Меньше"
                                {
                                    if (price < price_value)
                                    {
                                        value['_price'] = price;  // добавляем свойство _price в объект value
                                        (value['_type'] == 0) ? arr_call.push(value) : arr_put.push(value);
                                    }
                                }
                            });

                            // max_oi, max_volume и price для CALL из массива arr_call
                            var max_oi_call = obj_max_level(arr_call,'_oi',0);
                            var max_volume_call = obj_max_level(arr_call,'_volume',0);
                            (max_oi_call==-1) ? data_not_found('call') : data_output(arr_call,max_oi_call,max_volume_call,'call');

                            // max_oi, max_volume и price для PUT из массива arr_put
                            var max_oi_put = obj_max_level(arr_put,'_oi',1);
                            var max_volume_put = obj_max_level(arr_put,'_volume',1);
                            (max_oi_put==-1) ? data_not_found('put') : data_output(arr_put,max_oi_put,max_volume_put,'put');

                            // если массивы не пустые создаем таблицу, иначе очищаем таблицу
                            (arr_call.length != 0) ? create_table_level(arr_call,'call') : $('#call').empty().append('Данные не найдены!');
                            (arr_put.length != 0) ? create_table_level(arr_put,'put') : $('#put').empty().append('Данные не найдены!');
                        }
                    }
                    // если чекбокс checked, отображаем его колонку
                    checkbox_checked(arr_checkbox);

                    // строим график для Strike(oi_call/oi_put)
                    // массивы для объектов CALL и PUT
                    graph(arr_call,arr_put);
                },
                error: function(response) {
                    var reg = /user_not_found/i;
					var text = response.responseText;
                    if (text.search(reg) != 1) {
                        RedirectAuth();
                    }
                },
                complete: function() {
                    $('#preloading').removeClass('loading');
                }
            });
            return false;
        } else
        {
            return false;
        }

    });

    var current_obj = Array(); 
    // обрабатываем клик по чекбоксу индикатора и открываем всплывашку индикатора
    $('body').on('click', '.volume-level', function(e) {
        e.preventDefault();
        var row_id = $(this).parents('.volume-row').attr('id');          // id строки, по которой кликаем

        $.each(data_object, function(key,value) {                        // перебираем в цикле данные, пришедшие после фильтрации
            if (value['_id']==row_id) {                          
                current_obj=value;                                       // отбираем объект соответствующий выбранной строке
            }
        });
        popup_level(current_obj);
    });

    var line_color;
    var line_type;
    var line_weight;
    var level_checkbox_day;
    var comment_text;
    var comment_checkbox_day;

    // обрабатываем клик по "Отправить" в индикаторе уровней
    $('body').on('click', '#send_level', function(e) {
        e.preventDefault();
        var form = $(this).parents('.form-level');
        var id = form.attr('id').slice(11);
        var type = $('#indicator_type').text();
        var strike = form.find('#indicator_strike').text();
        var color = $('.select-color').css('background-color');
        var line_type = $('select[name=line_type]').val();
        var line_weight = $('select[name=line_weight]').val();
        var checkbox = $('#only_this_day').prop('checked');
        var state = $('#'+type+'_checkbox_'+id).prop('checked');
    	var popup_title = $('.popup-title');
     
        (type=='CALL') ? type = 0 : type = 1;
        (form.find('input[name=only_this_day]').prop('checked')) ? checked = 1 : checked = 0;

        $.ajax({
            url: "php/Anal.php",
            type: "post",
            dataType: "json",
            data: {
                'id_save_lvl' : id,
                'type' : type,
                'strike' : strike,
                'color' : color,
                'line_type' : line_type,
                'line_weight' : line_weight,
                'checked' : checked
            },
            beforeSend: function()
            {
                // $('#preloading').addClass('loading');
            },
            success: function(response) {
				
                // если "Сессия не найдена"
                if (response['session_error']) {
                    $('.message').empty().append('<i class="fa fa-ban"></i>Сессия не найдена!').addClass('error').removeClass('hidden');
                    $('html, body').animate({scrollTop: 0},100);
                    setTimeout( function() { $('.message').empty().removeClass('error').addClass('hidden') }, 3000);
                }
                // если "Нет данных"
                if (response['data_not_exist']) {
                    $('.message').empty().append('<i class="fa fa-ban"></i>Нет данных!').addClass('error').removeClass('hidden');
                    $('html, body').animate({scrollTop: 0},100);
                    setTimeout( function() { $('.message').empty().removeClass('error').addClass('hidden') }, 3000);
                }
				
				if (response.success == "limits-of-tariff")
					{
					$('#info-next-tarif').empty().append(response.message);
					$('#wpay-h4').empty().append(response.title);
					document.getElementById('select-tariff').options[response.select-1].selected = 'true'
					open_window('pay-money');
					$('#alert-message').addClass('hidden');
					}
					
                if (response.success == "ok") {	
                	var type = $('#indicator_type').text();

                    current_obj['_line_color'] = color;
                    current_obj['_line_type'] = line_type;
                    current_obj['_line_weight'] = line_weight;
                    (checkbox) ? current_obj['_cur_day_checkbox'] = 1 : current_obj['_cur_day_checkbox'] = 0;

                    $('#'+type.toLowerCase()+'_checkbox_'+id).prop('checked',true);
                	$('.form-level').addClass('hidden');
                	$('.btn-close').addClass('hidden');
                	(state) ? popup_title.text('Уровень успешно изменём!') : popup_title.text('Уровень успешно сохранён!');
                    setTimeout( function() { $('#alert-message').addClass('hidden') }, 1000);
                }
            },
            error: function(response) {
                var reg = /user_not_found/i;
                var text = response.responseText;
                if (text.search(reg) != 1) {
                    RedirectAuth();
                }
            },
            complete: function() {
                // $('#preloading').removeClass('loading');
            }
        });
        return false;
    });

    // обрабатываем клик по "Удалить" в индикаторе уровней
    $('body').on('click', '#delete_level', function(e) {
        e.preventDefault();
        var form = $(this).parents('.form-level');
        var id = form.attr('id').slice(11);
        var strike = form.find('#indicator_strike').text();
        var type = $('#indicator_type').text();
        var color = $('.select-color').css('background-color');
        var line_type = $('select[name=line_type]').val();
        var line_weight = $('select[name=line_weight]').val();

        (form.find('input[name=only_this_day]').prop('checked')) ? checked = 1 : checked = 0;
        (type=='CALL') ? type = 0 : type = 1;

        $.ajax({
            url: "php/Anal.php",
            type: "post",
            dataType: "json",
            data: {
                'id_delete_lvl' : id,
                'type' : type,
                'strike' : strike,
                'checked' : checked
            },
            beforeSend: function()
            {
                // $('#preloading').addClass('loading');
            },
            success: function(response) {

                // если "Сессия не найдена"
                if (response['session_error']) {
                    $('.message').empty().append('<i class="fa fa-ban"></i>Сессия не найдена!').addClass('error').removeClass('hidden');
                    $('html, body').animate({scrollTop: 0},100);
                    setTimeout( function() { $('.message').empty().removeClass('error').addClass('hidden') }, 3000);
                }
                // если "Нет данных"
                if (response['data_not_exist']) {
                    $('.message').empty().append('<i class="fa fa-ban"></i>Нет данных!').addClass('error').removeClass('hidden');
                    $('html, body').animate({scrollTop: 0},100);
                    setTimeout( function() { $('.message').empty().removeClass('error').addClass('hidden') }, 3000);
                }

                if (response['success']) {
                    current_obj['_line_color'] = '#ffffff';
                    current_obj['_line_type'] = 'solid';
                    current_obj['_line_weight'] = 0;
                    $('#only_this_day').prop('checked',false);

                    var type = $('#indicator_type').text();
                    $('#'+type.toLowerCase()+'_checkbox_'+id).prop('checked',false);
                    $('.form-level').addClass('hidden');
                    $('.btn-close').addClass('hidden');
                    $('.popup-title').empty().text('Уровень успешно удалён!');
                    setTimeout( function() { $('#alert-message').addClass('hidden') }, 1000);
                }
            },
            error: function(response) {
                var reg = /user_not_found/i;
                var text = response.responseText;
                if (text.search(reg) != 1) {
                    RedirectAuth();
                }
            },
            complete: function() {
                // $('#preloading').removeClass('loading');
            }
        });
        return false;
    });


    // обрабатываем клик по флагу индикатора
    $('body').on('click', '.volume-flag', function() {
        var row_id = $(this).parents('.volume-row').attr('id');

        $.each(data_object, function(key,value) {
            if (value['_id']==row_id) {
                current_obj=value;
            }
        });
        popup_comment(current_obj);
    });

    // обрабатываем изменение значения в поле комментария
    $('body').on('input', '#indicator_comment', function() {
        var comment = $(this).val();
        var btn = $('#save_indicator_comment');
        (comment.length==0) ? btn.addClass('disabled').prop('disabled',true) : btn.removeClass('disabled').prop('disabled',false);
    });

    // обрабатываем клик по "Сохранить" в индикаторе комментарий
    $('body').on('click', '#save_indicator_comment', function(e) {
        e.preventDefault();
        var form = $(this).parents('.form-level');
        var id = form.attr('id').slice(11);
        var type = $('#indicator_type').text();
        var strike = form.find('#indicator_strike').text();
        var comment = form.find('#indicator_comment').val();
        var checkbox = $('#save_only_this_day').prop('checked');

        (type=='CALL') ? type = 0 : type = 1;
        (form.find('input[name=save_only_this_day]').prop('checked')) ? checked = 1 : checked = 0;
		
        $.ajax({
            url: "php/Anal.php",
            type: "post",
            dataType: "json",
            data: {
                'id_save_comment' : id,
                'type' : type,
                'strike' : strike,
                'comment' : comment,
                'checked' : checked
            },
            beforeSend: function()
            {
                // $('#preloading').addClass('loading');
            },
            success: function(response) {

                // если "Сессия не найдена"
                if (response['session_error']) {
                    $('.message').empty().append('<i class="fa fa-ban"></i>Сессия не найдена!').addClass('error').removeClass('hidden');
                    $('html, body').animate({scrollTop: 0},100);
                    setTimeout( function() { $('.message').empty().removeClass('error').addClass('hidden') }, 3000);
                }
                // если "Нет данных"
                if (response['data_not_exist']) {
                    $('.message').empty().append('<i class="fa fa-ban"></i>Нет данных!').addClass('error').removeClass('hidden');
                    $('html, body').animate({scrollTop: 0},100);
                    setTimeout( function() { $('.message').empty().removeClass('error').addClass('hidden') }, 3000);
                }
				if (response.success == "limits-of-tariff")
					{
					$('#info-next-tarif').empty().append(response.message);
					$('#wpay-h4').empty().append(response.title);
					document.getElementById('select-tariff').options[response.select-1].selected = 'true'
					open_window('pay-money');
					$('#alert-message').addClass('hidden');
					}

                if (response.success == "ok") {
                    current_obj['_comment'] = comment;
                    (checkbox) ? current_obj['_cur_day_flag'] = 1 : current_obj['_cur_day_flag'] = 0;

                    var type = $('#indicator_type').text();
                    $('#'+type.toLowerCase()+'_flag_'+id).addClass('red');
                    $('.form-level').addClass('hidden');
                    $('.btn-close').addClass('hidden');
                    $('.popup-title').empty().text('Комментарий успешно сохранён!');
                    setTimeout( function() { $('#alert-message').addClass('hidden') }, 1000);
                }
            },
            error: function(response) {
                var reg = /user_not_found/i;
                var text = response.responseText;
                if (text.search(reg) != 1) {
                    RedirectAuth();
                }
            },
            complete: function() {
                // $('#preloading').removeClass('loading');
            }
        });
        return false;
    });

    // обрабатываем клик по "Удалить" в индикаторе комментариев
    $('body').on('click', '#delete_indicator_comment', function(e) {
        e.preventDefault();
        var form = $(this).parents('.form-level');
        var id = form.attr('id').slice(11);
        var strike = form.find('#indicator_strike').text();
        var type = $('#indicator_type').text();

        (form.find('input[name=save_only_this_day]').prop('checked')) ? checked = 1 : checked = 0;
        (type=='CALL') ? type = 0 : type = 1;

        $.ajax({
            url: "php/Anal.php",
            type: "post",
            dataType: "json",
            data: {
                'id_delete_comment' : id,
                'type' : type,
                'strike' : strike,
                'checked' : checked
            },
            beforeSend: function()
            {
                // $('#preloading').addClass('loading');
            },
            success: function(response) {

                // если "Сессия не найдена"
                if (response['session_error']) {
                    $('.message').empty().append('<i class="fa fa-ban"></i>Сессия не найдена!').addClass('error').removeClass('hidden');
                    $('html, body').animate({scrollTop: 0},100);
                    setTimeout( function() { $('.message').empty().removeClass('error').addClass('hidden') }, 3000);
                }
                // если "Нет данных"
                if (response['data_not_exist']) {
                    $('.message').empty().append('<i class="fa fa-ban"></i>Нет данных!').addClass('error').removeClass('hidden');
                    $('html, body').animate({scrollTop: 0},100);
                    setTimeout( function() { $('.message').empty().removeClass('error').addClass('hidden') }, 3000);
                }

                if (response['success']) {
                    current_obj['_comment'] = '';
                    $('#save_only_this_day').attr('checked',false);

                    var type = $('#indicator_type').text();
                    $('#'+type.toLowerCase()+'_flag_'+id).removeClass('red');
                    $('.form-level').addClass('hidden');
                    $('.btn-close').addClass('hidden');
                    $('.popup-title').empty().text('Комментарий успешно удалён!');
                    setTimeout( function() { $('#alert-message').addClass('hidden') }, 1000);
                }
            },
            error: function(response) {
                var reg = /user_not_found/i;
                var text = response.responseText;
                if (text.search(reg) != 1) {
                    RedirectAuth();
                }
            },
            complete: function() {
                // $('#preloading').removeClass('loading');
            }
        });
        return false;
    });

    // обрабатываем клик по иконке графика
    $('body').on('click', '.volume-chart', function(e) {
        e.preventDefault();

        var row_id = $(this).find('i').parents('.volume-row').attr('id');
        var type = $(this).parents('.volume-type').attr('id');
        (type=='CALL' || type=='call') ? type = 0 : type = 1;

        $.each(data_object, function(key,value) {
            if (value['_id']==row_id) {
                current_obj=value;
            }
        });

        $.ajax({
            url: "php/Anal.php",
            type: "post",
            dataType: "json",
            data: {
                'row_id' : row_id
            },
            beforeSend: function()
            {
                // $('#preloading').addClass('loading');
            },
            success: function(response) {
				if (response.success == "limits-of-tariff")
					{
					$('#info-next-tarif').empty().append(response.message);
					$('#wpay-h4').empty().append(response.title);
					document.getElementById('select-tariff').options[response.select-1].selected = 'true'
					open_window('pay-money');
					}
					
				if (response.data_not_exist)
					{
					$('.message').empty().append('<i class="fa fa-ban"></i>'+response.data_not_exist).addClass('error').removeClass('hidden');
                    $('html, body').animate({scrollTop: 0},100);
                    setTimeout( function() { $('.message').empty().removeClass('error').addClass('hidden') }, 3000);
					}
                if (response.success == "ok") popup_graph(current_obj,response,type)
            },
            error: function(response) {
                var reg = /user_not_found/i;
                var text = response.responseText;
                if (text.search(reg) != 1) {
                    RedirectAuth();
                }
            },
            complete: function() {
                // $('#preloading').removeClass('loading');
            }
        });
        return false;
    });


}); // end DOM ready





function get_price(obj)
{
    var price = Number();
    // console.log(obj);
    // console.log(obj['_type']);

    if (Number(obj['_type']) == 1)
        price = (Number(obj['_strike'])+Number(obj['_reciprocal']))/1000;
    else
        price = (Number(obj['_strike'])-Number(obj['_reciprocal']))/1000;
    if (String(obj['_symbol']).substr(0,3) == 'USD') {
        price = 1/price;
    }
    if (obj['type'] == undefined) {
        //console.log('start');
    }
    return obj['_price'];
}


function obj_max_level(obj_value,field,type)
{
    var max = 0;
    var index = -1;
    $.each(obj_value, function(key,value) {
        if (Number(value[field]) > max && value['_type'] == type)
        {
            max = value[field];
            index = key;
        }
    });
    return index;
}


function data_not_found(type)
{
    var html = '<div id="'+type+'_table" class="volume-table">' +
                    '<div class="volume-name">'+type+'</div>' +
                    '<div class="volume-content">' +
                        '<div class="volume-content-head">' +
                            '<div class="volume-row" style="justify-content:center;">' +
                                '<p>Данные не найдены!</p>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>';
    $('.volume-container').append(html);
}


function data_output (obj,max_oi,max_volume,type) {

    var price_oi = get_price(obj[max_oi]);
	if (max_volume >= 0)
		{
		var price_volume = get_price(obj[max_volume]);
		var volume_volume = obj[max_volume]['_volume'];
		var strike_volume = obj[max_volume]['_strike'];
		}
		else
		{
		var price_volume = "-";
		var volume_volume = "-";
		var strike_volume = "-";
		}

    var html = '<div id="'+type+'_table" class="volume-table">' +
                    '<div class="volume-name">'+type+'</div>' +
                    '<div class="volume-content">' +
                        '<div class="volume-content-head">' +
                            '<div class="volume-row">' +
                                '<p>Максимальный OI:</p>' +
                                '<p><span id="'+type+'_max_oi">'+obj[max_oi]["_oi"]+' </span><span>('+obj[max_oi]["_strike"]+')</span></p>' +
                            '</div>' +
                            '<div class="volume-row">' +
                                '<p>Цена максимального уровня:</p>' +
                                '<p id="'+type+'_price_max_level">'+price_oi+'</p>' +
                            '</div>' +
                            '<div class="volume-row">' +
                                '<p>Максимальный Volume:</p>' +
                                '<p><span id="'+type+'_max_volume">'+volume_volume+' </span><span>('+strike_volume+')</span></p>' +
                            '</div>' +
                            '<div class="volume-row">' +
                                '<p>Цена максимального объёма:</p>' +
                                '<p id="'+type+'_price_max_volume">'+price_volume+'</p>' +
                            '</div>' +
                        '</div>' +
                        '<div class="volume-content-body">' +
                            '<div class="volume-row volume-row-head">' +
                                '<div class="cell-mini volume-level"></div>' +
                                '<div class="cell-mini volume-flag"></div>' +
                                '<div class="cell volume-strike">Strike</div>' +
                                '<div class="cell volume-volume">Volume</div>' +
                                '<div class="cell volume-reciprocal">Премия</div>' +
                                '<div class="cell volume-delta">Delta</div>' +
                                '<div class="cell volume-oi">OI</div>' +
                                '<div class="cell volume-coi">Change</div>' +
                                '<div class="cell volume-price">Цена</div>' +
                                '<div class="cell-mini volume-chart"></div>' +
                            '</div>' +
                            '<div id="'+type+'" class="volume-type"></div>' +
                        '</div>' +
                    '</div>' +
                '</div>';
    $('.volume-container').append(html);
}


function create_table_level(arr_type,type)
{
    $.each(arr_type, function(key,value) {
		if (value['_checkbox'] == 0) $id_check = value['_id']; else $id_check = value['_checkbox_id_bill'];
		if (value['_flag'] == 0) $id_flag = value['_id']; else $id_flag = value['_comment_id_bill'];
        var html = '<div id="'+value['_id']+'" class="volume-row">' +
                        '<div class="cell-mini volume-level" id="'+$id_check+'">' +
                            '<input type="checkbox" id="'+type+'_checkbox_'+$id_check+'" name="'+type+'_checkbox_'+$id_check+'" />' +
                            '<label for="'+type+'_checkbox_'+$id_check+'"></label>' +
                        '</div>' +
                        '<div class="cell-mini volume-flag"><i id="'+type+'_flag_'+$id_flag+'" class="fa fa-flag"></i></div>' +
                        '<div class="cell volume-strike">'+value['_strike']+'</div>' +
                        '<div class="cell volume-volume">'+value['_volume']+'</div>' +
                        '<div class="cell volume-reciprocal">'+value['_reciprocal']+'</div>' +
                        '<div class="cell volume-delta">'+value['_delta']+'</div>' +
                        '<div class="cell volume-oi">'+value['_oi']+'</div>' +
                        '<div class="cell volume-coi">'+value['_coi']+'</div>' +
                        '<div class="cell volume-price">'+value['_price']+'</div>' +
                        '<div class="cell-mini volume-chart"><i class="fa fa-bar-chart"></i></div>' +
                    '</div>';
        $('#'+type).append(html);

        // активируем значения чекбоксов
        if (value['_checkbox'] == 1) {
            $('input[name='+type+'_checkbox_'+$id_check+']').prop('checked',true);
        }
        // активируем значения флажков
        if (value['_flag'] == 1) {
            $('#'+type+'_flag_'+$id_flag).addClass('red');
        }
        // выделяем серым цветом максимальный объем
        var max_volume = $('#'+type+'_max_volume').text();
        if (Number(value['_volume']) == Number(max_volume)) {
            $('#'+value['_id']).addClass('bg-max-volume');
        }
        // применяем градиент
        if (value['_print']) {
            switch (value['_print'])
            {
                case "1":
                    (type=='CALL') ? $('#'+value['_id']).addClass('bg-call-print-1') : $('#'+value['_id']).addClass('bg-put-print-1');
                    break;
                case "2":
                    (type=='CALL') ? $('#'+value['_id']).addClass('bg-call-print-2') : $('#'+value['_id']).addClass('bg-put-print-2');
                    break;
                case "3":
                    (type=='CALL') ? $('#'+value['_id']).addClass('bg-call-print-3') : $('#'+value['_id']).addClass('bg-put-print-3');
                    break;
                case "4":
                    (type=='CALL') ? $('#'+value['_id']).addClass('bg-call-print-4') : $('#'+value['_id']).addClass('bg-put-print-4');
                    break;
                case "5":
                    (type=='CALL') ? $('#'+value['_id']).addClass('bg-call-print-5') : $('#'+value['_id']).addClass('bg-put-print-5');
                    break;
            }
        }
    });
}


function checkbox_checked(arr_checkbox)
{
    $.each(arr_checkbox, function(checkbox,value) {
        if (!value) {
            $('.volume-'+checkbox).empty();
        }
    });
}

function graph(arr_call,arr_put)
{
    var arr_oi_call = Array();
    var arr_strike_call = Array();
    var arr_oi_put = Array();
    var arr_strike_put = Array();

    $.each(arr_call, function(key,value) {
        arr_oi_call.push(Number(value['_oi']));
        arr_strike_call.push(Number(value['_strike']));
    });

    $.each(arr_put, function(key,value) {
        arr_oi_put.push(Number(value['_oi']));
        arr_strike_put.push(Number(value['_strike']));
    });
    
    $('.graph-container').empty();

    $('#graph_call').highcharts({
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Значение открытого интереса CALL'
        },
        exporting: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        xAxis: {
            categories: arr_strike_call,
            title: {
                text: 'Strike CALL'
            }
        },
        yAxis: {
            reversed: true,
            min: 0,
            title: {
                text: null
            },
            labels: {
                overflow: 'justify'
            }
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        colors: ['#579A38'],
        series: [{
            name: 'CAll',
            data: arr_oi_call
        }]
    });

    $('#graph_put').highcharts({
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Значение открытого интереса PUT'
        },
        exporting: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        xAxis: {
            opposite: true,
            categories: arr_strike_put,
            title: {
                text: 'Strike PUT'
            },
            labels: {
                overflow: 'justify'
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: null
            }
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        colors: ['#A3443D'],
        series: [{
            name: 'PUT',
            data: arr_oi_put
        }]
    });
}

function popup_level(obj)   // очищаем контейнер всплывашки
{	
    var id = obj['_id'];                        // id текущего obj
	if (obj['_checkbox'] == 0)
		{
		id_check = obj['_id']; 
		d = obj['_date'];
		}
		else 
		{
		id_check = obj['_checkbox_id_bill'];
		d = obj['_checkbox_date'];
		}
		
    var state_level = null;                     // состояние всплывашки
    var alert = $('#alert-message').empty(); 

    // устанавливаем состояние всплывашки: true - Уровень активен, false - Уровень неактивен
    (obj['_line_weight']==undefined || obj['_line_weight']==0) ? state_level=false : state_level=true;

    // устанавливаем тип объекта
    (obj['_type']==0) ? type = 'CALL' : type = 'PUT';

    var html = '<div class="popup">' +
                    '<i class="fa fa-times btn-close"></i>' +
                    '<div class="popup-title"></div>' +
                        '<form id="form_level_'+id_check+'" class="form-level">' +
                            '<div class="popup-row">' +
                                '<p>Опцион: <span id="indicator_type">'+type+'</span></p>' +
                                '<p>Дата сохранения: <span id="indicator_date">'+d+'</span></p>' +
                                '<p>Strike: <span id="indicator_strike">'+obj['_strike']+'</span></p>' +
                            '</div>' +
                            '<div class="popup-column">' +
                                '<p>Отображение линии:</p>' +
                                '<div>' +
                                    '<p>Цвет: <span class="select-color" data-color="'+obj['_line_color']+'"></span></p>' +
                                    '<p>Тип: <select id="line_type" name="line_type">' +
                                        '<option value="solid">______</option>' +
                                        '<option value="dash">&mdash; &mdash; &mdash;</option>' +
                                        '<option value="dot">&#150; &#150; &#150; &#150; &#150;</option>' +
										'<option value="dashdot">&mdash; &#150; &mdash; &#150;</option>' +
										'<option value="dashdotdot">&mdash; &#150; &#150; &mdash;</option>' +
                                    '</select></p>' +
                                    '<p>Толщина: <select id="line_weight" name="line_weight">' +
                                        '<option value="1">1px</option>' +
                                        '<option value="2">2px</option>' +
                                        '<option value="3">3px</option>' +
                                        '<option value="4">4px</option>' +
                                        '<option value="5">5px</option>' +
                                    '</select></p>' +
                                '</div>' +
                            '</div>' +
                    '<div class="popup-row">' +
                        '<div>' +
                            '<input type="checkbox" id="only_this_day" name="only_this_day" />' +
                            '<label for="only_this_day">Только на текущий отчётный день</label>' +
                        '</div>' +
                    '</div>' +
                    '<div class="popup-row">' +
                        '<div>' +
                            '<button class="popup-btn popup-btn-send" id="send_level">Отправить</button>' +
                            '<button class="popup-btn popup-btn-delete" id="delete_level">Удалить</button>' +
                        '</div>' +
                    '</div>' +
                    '</form>' +
                '</div>';

    alert.append(html).removeClass('hidden');

    // устанавливаем значение чекбокса "Только на текущий отчётный день"
    (obj['_cur_day_checkbox'] == 1) ? $('#only_this_day').prop('checked',true) : $('#only_this_day').prop('checked',false);

    (obj['_line_color']) ? line_color = obj['_line_color'] : line_color = '#FFFFFF';    // из obj получаем цвет линии
    $('.select-color').css({'background-color':line_color});                            // устанавливаем цвет

    // инилиализируем плагин colorpicker'a
    $('.select-color').ColorPicker({
        color: line_color,
        onShow: function (colpkr) {
            $(colpkr).fadeIn(500);
            return false;
        },
        onHide: function (colpkr) {
            $(colpkr).fadeOut(500);
            return false;
        },
        onChange: function (hsb, hex, rgb) {
            $('.select-color').css('backgroundColor', '#' + hex);
        }
    });

    // устанавливаем тип линии
    (obj['_line_type']) ? line_type = obj['_line_type'] : line_type = 'solid';
    $('select[name=line_type]').selectmenu({
        width: 60,
        height: 25,
        position: { my: "right top", at: "right bottom"}
    });
    $('select[name=line_type] option[value='+line_type+']').prop('selected', true);
    $('#line_type').selectmenu('refresh');

    // устанавливаем толщину линии
    (obj['_line_weight']) ? line_weight = obj['_line_weight'] : line_weight = '1';
    $('select[name=line_weight]').selectmenu({
        width: 40,
        height: 25,
        position: { my: "right top", at: "right bottom"}
    });
    $('select[name=line_weight] option[value='+line_weight+']').prop('selected', true);
    $('#line_weight').selectmenu('refresh');


    if (state_level) {                                              // если уровень активен   //
        $('.popup-title').text('Изменить уровень в индикаторе');      // изменяем заголовок всплывашки
        $('#delete_level').removeClass('hidden');                     // отображаем кнопку "Удалить"
    } else {                                                        // если уровень неактивен //
        $('.popup-title').text('Отправить уровень в индикатор');      // изменяем заголовок всплывашки
        $('#delete_level').addClass('hidden');                        // скрываем кнопку "Удалить"
        $('#only_this_day').attr('checked',false);                    // делаем чекбокс неактивным
    }
}


function popup_comment(obj)
{
    var id = obj['_id'];                        // id текущего obj
    var state_level = null;                     // состояние всплывашки
    var comment = String();                     // комментарий
    var title = String();                       // текст заголовка
    var alert = $('#alert-message').empty();    // очищаем контейнер всплывашки
	
	if (obj['_flag'] == 0)
		{
		id_check = obj['_id']; 
		d = obj['_date'];
		}
		else 
		{
		id_check = obj['_comment_id_bill'];
		d = obj['_comment_date'];
		}

    // устанавливаем состояние всплывашки: true - Уровень активен, false - Уровень неактивен
    (obj['_comment']==undefined || obj['_comment']=='') ? state_level=false : state_level=true;

    // устанавливаем заголовок всплывашки и кнопки
    (state_level) ? title = 'изменить' : title = 'сохранить';

    // устанавливаем значение комментария
    (obj['_comment']) ? comment = obj['_comment'] : comment = '';

    // устанавливаем тип объекта
    (obj['_type']==0) ? type = 'CALL' : type = 'PUT';

    var html = '<div class="popup">' +
                    '<i class="fa fa-times btn-close"></i>' +
                    '<div class="popup-title">Пометить и '+title+' уровень</div>' +
                    '<form id="form_level_'+id_check+'" class="popup-form form-level">' +
                        '<div class="popup-row">' +
                            '<p>Опцион: <span id="indicator_type">'+type+'</span></p>' +
                            '<p>Дата: <span id="indicator_date">'+d+'</span></p>' +
                            '<p>Strike: <span id="indicator_strike">'+obj['_strike']+'</span></p>' +
                        '</div>' +
                        '<div class="popup-column">' +
                            '<p>Комментарий:</p>' +
                            '<textarea id="indicator_comment">'+comment+'</textarea>' +
                        '</div>' +
                        '<div class="popup-row">' +
                            '<div>' +
                                '<input type="checkbox" id="save_only_this_day" name="save_only_this_day" />' +
                                '<label for="save_only_this_day">Сохранить только на текущий отчётный день</label>' +
                            '</div>' +
                        '</div>' +
                        '<div class="popup-row">' +
                            '<input type="submit" class="popup-btn popup-btn-send" id="save_indicator_comment" value="'+title+'" />' +
                            '<button class="popup-btn popup-btn-delete" id="delete_indicator_comment">Удалить</button>' +
                        '</div>' +
                    '</form>' +
                '</div>';

    alert.append(html).removeClass('hidden');

    // устанавливаем значение чекбокса "Только на текущий отчётный день"
    (obj['_cur_day_flag'] == 1) ? $('#save_only_this_day').prop('checked',true) : $('#save_only_this_day').prop('checked',false);

    // устанавливаем доступность кнопки "Сохранить" и "Удалить"
    if (state_level) {
        $('#save_indicator_comment').removeClass('disabled').prop('disabled',false);
        $('#delete_indicator_comment').removeClass('hidden');
    } else {
        $('#save_indicator_comment').addClass('disabled').prop('disabled',true);
        $('#delete_indicator_comment').addClass('hidden');
        $('#save_only_this_day').attr('checked',false);
    }
}


function popup_graph(current_obj,obj,type)
{
    var type_title = String(),
        arr_date = Array(),
        arr_oi = Array(),
        arr_coi = Array(),
        arr_volume = Array(),
        arr_date_call = Array(),
        arr_oi_call = Array(),
        arr_coi_call = Array(),
        arr_volume_call = Array(),
        arr_date_put = Array(),
        arr_oi_put = Array(),
        arr_coi_put = Array(),
        arr_volume_put = Array(),
        arr_volume_sum = Array(),
        alert = $('#alert-message').empty();

    $.each(obj, function(key,value) {
        if (value['_type']==type) {
            arr_date.push(value['_date']);
            arr_oi.push(Number(value['_oi']));
            arr_coi.push(Number(value['_coi']));
            arr_volume.push(Number(value['_volume']));
        }
    });
    $.each(obj, function(key,value) {
        if (value['_type'] == 0) {
            arr_date_call.push(value['_date']);
            arr_oi_call.push(Number(value['_oi']));
            arr_coi_call.push(Number(value['_coi']));
            arr_volume_call.push(Number(value['_volume']));
        } else {
            arr_date_put.push(value['_date']);
            arr_oi_put.push(Number(value['_oi']));
            arr_coi_put.push(Number(value['_coi']));
            arr_volume_put.push(Number(value['_volume']));
        }
    });
    for (var i=0; i<arr_volume_call.length; i++) {
        arr_volume_sum.push(arr_volume_call[i]+arr_volume_put[i]);
    }

    (Number(type)==0) ? type_title='CALL' : type_title='PUT';

    var html = '<div class="popup-graph">' +
                    '<i class="fa fa-times btn-close"></i>' +
                    '<div class="popup-title">Выберите тип графика</div>' +
                    '<div class="flex-center">' +
                        '<div class="popup-row">' +
                            '<p>Опцион: <span id="indicator_type">'+type_title+'</span></p>' + 
                            '<p>Дата: <span id="indicator_date">'+current_obj['_date']+'</span></p>' +
                            '<p>Strike: <span id="indicator_strike">'+current_obj['_strike']+'</span></p>' +
                        '</div>' +
                        '<select id="change_graph">' +
                            '<option value="0" selected>Динамика OI</option>' +
                            '<option value="1">Активность игроков</option>' +
                            '<option value="2">Объем торгов</option>' +
                            '<option value="3">Динамика OI CALL/PUT</option>' +
                            '<option value="4">Активность CALL/PUT</option>' +
                            '<option value="5">Объем CALL/PUT</option>' +
                        '</select>' +
                        '<div id="popup_container" style="width: 100%; height: 290px"></div>' +
                    '</div>' +
                '</div>';
    alert.append(html).removeClass('hidden');

    dynemic_oi(arr_date,arr_oi,arr_coi,type);

    $('#change_graph').selectmenu({
        width: 150,
        position: { my: "right top", at: "right bottom"},
        change: function( event, ui ) {
            var index = ui.item.value;
            switch (index)
            {
                case "0":
                    dynemic_oi(arr_date,arr_oi,arr_coi,type);
                    break;
                case "1":
                    dynemic_volume(arr_date,arr_coi,arr_volume,type);
                    break;
                case "2":
                    trading_volume(arr_date,arr_volume,type);
                    break;
                case "3":
                    dynemic_oi_all(arr_date,arr_oi_call,arr_oi_put);
                    break;
                case "4":
                    dynemic_coi_all(arr_date,arr_coi_call,arr_coi_put);
                    break;
                case "5":
                    dynemic_volume_all(arr_date,arr_volume_call,arr_volume_put,arr_volume_sum);
                    break;
            }
        }
    });
}

function dynemic_oi(arr_date,arr_oi,arr_coi,type)
{
    var type_title = String(),
        type_color = String();

    (type==0) ? (type_title = 'CALL', type_color = '#579A38') : (type_title = 'PUT', type_color = '#A3443D');

    $('#popup_container').highcharts({
        chart: {
            type: 'column'
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
            categories: arr_date
        },
        yAxis: {
            title: {
                text: ''
            }
        },
        colors: [type_color,'#E7D561'],
        series: [{
            name: 'OI',
            data: arr_oi
        }, {
            name: 'Изменение OI',
            data: arr_coi
        }]
    });
}
function dynemic_volume(arr_date,arr_coi,arr_volume,type)
{
    var type_title = String(),
        type_color = String();

    (type==0) ? (type_title = 'CALL', type_color = '#579A38') : (type_title = 'PUT', type_color = '#A3443D');
    $('#popup_container').highcharts({
        chart: {
            type: 'column'
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
            categories: arr_date
        },
        yAxis: {
            title: {
                text: ''
            }
        },
        colors: [type_color,'#0C7AC6'],
        series: [{
            name: 'Объем торгов',
            data: arr_volume
        }, {
            name: 'Изменение OI',
            data: arr_coi
        }]
    });
}
function trading_volume(arr_date,arr_volume,type)
{
    var type_title = String();
    (type==0) ? type_title = 'CALL' : type_title = 'PUT';

    $('#popup_container').highcharts({
        chart: {
            type: 'column'
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
            categories: arr_date
        },
        yAxis: {
            title: {
                text: ''
            }
        },
        colors: ['#0C7AC6'],
        series: [{
            name: 'Объем торгов',
            data: arr_volume
        }]
    });
}
function dynemic_oi_all(arr_date,arr_oi_call,arr_oi_put)
{
    $('#popup_container').highcharts({
        chart: {
            type: 'column'
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
            categories: arr_date
        },
        yAxis: {
            title: {
                text: ''
            }
        },
        colors: ['#579A38','#A3443D'],
        series: [{
            name: 'OI CALL',
            data: arr_oi_call
        }, {
            name: 'OI PUT',
            data: arr_oi_put
        }]
    });
}
function dynemic_coi_all(arr_date,arr_coi_call,arr_coi_put)
{
    $('#popup_container').highcharts({
        chart: {
            type: 'column'
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
            categories: arr_date
        },
        yAxis: {
            title: {
                text: ''
            }
        },
        colors: ['#579A38','#A3443D'],
        series: [{
            name: 'Изменение OI CALL',
            data: arr_coi_call
        }, {
            name: 'Изменение OI PUT',
            data: arr_coi_put
        }]
    });
}
function dynemic_volume_all(arr_date,arr_volume_call,arr_volume_put,arr_volume_sum)
{
    $('#popup_container').highcharts({
        chart: {
            type: 'column'
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
            categories: arr_date
        },
        yAxis: {
            title: {
                text: ''
            }
        },
        colors: ['#0C7AC6','#A3443D','#579A38'],
        series: [{
            name: 'CALL',
            data: arr_volume_call
        }, {
            name: 'PUT',
            data: arr_volume_put
        }, {
            name: 'CALL + PUT',
            data: arr_volume_sum
        }]
    });
}



/**
 * Функция возвращает название валютной пары
 *
 * @param {number} valut_id Идентификатор валютной пары.
 * @return {string} Название валютной пары.
 */
function getValutTitle(valut_id)
{
    var valut_title = String();
    switch (valut_id)
    {
        case "EURUSD":
            valut_title="EUR (PG39)";
            break;
        case "GBPUSD":
            valut_title="GBP (PG29/PG30)";
            break;
        case "USDCHF":
            valut_title="CHF (PG33/PG34)";
            break;
        case "USDJPY":
            valut_title="JPY (PG31/PG32)";
            break;
        case "USDCAD":
            valut_title="CAD (PG29/PG30)";
            break;
        case "AUDUSD":
            valut_title="AUD (PG38)";
            break;
        case "XAUUSD":
            valut_title="XAU (GOLD) (PG64)";
            break;
        default:
            valut_title="";
    }
    return valut_title;
}


/**
 * Построение графика "Расстановка интересов игроков"
 *
 * @param {number} total_oi_call Значение открытого интереса CALL.
 * @param {number} total_oi_put Значение открытого интереса PUT.
 * @return {void} График highcharts.
 */
function interests_players(total_oi_call,total_oi_put)
{
    // очищаем контейнер для графика
    var container = $('#container').empty();
    // получаем значение "Дата отсчета"
    var date = $('#data_date').val();
    // устанавливаем название графика
    $('#type_report_title').empty().text('Расстановка интересов игроков');
    // устанавливаем данный график выбранным в выпадающем списке графиков
    $("#change_report option[value='0']").prop('selected', true);
    // обновляем выпадающий список графиков
    //$('#change_report').selectmenu('refresh');
    // строим график с помощью библиотеки highcharts
    container.highcharts({
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
                text: date
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
            data: [ total_oi_call ]
        }, {
            name: 'PUT',
            data: [ total_oi_put ]
        }]
    });
}


/**
 * Построение графика "Динамика изменения OI"
 *
 * @param {array} arr_date Значение открытого интереса CALL.
 * @param {number} total_oi_call Значение открытого интереса CALL.
 * @param {number} total_oi_put Значение открытого интереса PUT.
 * @return {void} График highcharts.
 */
function total_oi(arr_date,total_oi_call,total_oi_put)
{
	var container = $('#container').empty();
	
	$('#type_report_title').empty().text('Динамика изменения OI');

	container.highcharts({
        chart: {
            type: 'line'
        },
        title: {
            text: ' '
        },
        exporting: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        xAxis: {
            categories: arr_date
        },
        yAxis: {
            title: {
                text: 'Открытый интерес (OI)'
            }
        },
        colors: ['#0C7AC6','#A3443D'],
        series: [{
            name: 'CALL',
            data: total_oi_call
        }, {
            name: 'PUT',
            data: total_oi_put
        }]
    });
}
function change_oi(arr_date,change_oi_call,change_oi_put)
{
	var container = $('#container').empty();
	
	$('#type_report_title').empty().text('Активность покупателей и продавцов');

	container.highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: ' '
        },
        exporting: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        xAxis: {
            categories: arr_date
        },
        yAxis: {
            title: {
                text: 'Change'
            }
        },
        colors: ['#0C7AC6','#A3443D'],
        series: [{
            name: 'CALL',
            data: change_oi_call
        }, {
            name: 'PUT',
            data: change_oi_put
        }]
    });
}
function total_volume(arr_date,total_volume_call,total_volume_put)
{
	var container = $('#container').empty();
	
	$('#type_report_title').empty().text('Объем торгов');

	container.highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: ' '
        },
        exporting: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        xAxis: {
            categories: arr_date
        },
        yAxis: {
            title: {
                text: 'Volume'
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
            data: total_volume_call

        }, {
            name: 'PUT',
            data: total_volume_put

        }]
    });
}
function total_volume_sum(arr_date,sum)
{
	var container = $('#container').empty();
	
	$('#type_report_title').empty().text('Общий объем торгов');

	container.highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: ' '
        },
        exporting: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        xAxis: {
            categories: arr_date
        },
        yAxis: {
            title: {
                text: 'Volume'
            }
        },
        colors: ['#0C7AC6'],
        series: [{
            name: 'CALL + PUT',
            data: sum
        }]
    });
}