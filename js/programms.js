// событие готовности ДОМ-дерева
$(document).ready(function() {

    var currentPageSupport = Number(),
        pagesCountSupport = Number(),
        currentPageHistory = Number(),
        pagesCountHistory = Number();

    // --- --------------------- --- //
    // --- ОПИСАНИЕ ИНДИКАТОРОВ --- //
    // --- ------------------- --- //
    // триггер по сайдбару "Описание"
	var GETArr = parseGetParams(); 
	if (!GETArr['tab']) setTimeout(function(){ $('#description').trigger('click'); }, 10);
		else {
		var n = "#"+GETArr['tab'];
		if ($(n).length > 0) setTimeout(function(){ $(n).trigger('click'); }, 10); else setTimeout(function(){ $('#description').trigger('click'); }, 10);
		} 

    // обрабатываем клик по сайдбару "Описание"
    $('#description').on('click', function() {
        var page_id = $(this).attr('id');
        $('.sidebar-item').removeClass('sidebar-item-active');
        $(this).addClass('sidebar-item-active');
        $.ajax({
            url: "php/programm.php",
            type: "post",
            dataType: "json",
            data: {
                'indicator_descr' : page_id
            },
            beforeSend: function() {
                // $('.content__body').append(preloading);
                // $('#preloading').addClass('loading');
            },
            success: function(response) {
                $('.content__header').empty().append('<h1>Описание индикаторов</h1>');
                var html =  '<div class="tabs" style="margin:0;"></div>' +
                            '<div class="block block-desc">' +
                                '<div id="desc_content"></div>' +
                            '</div>';
                $('.content__body').empty().append(html);
                $.each(response, function(key, tab) {
                    var tab_html = '<div id="'+tab['_id']+'" class="tab-desc">'+tab['_name']+'</div>';
                    $('.tabs').append(tab_html);
                    if (tab['_desc']) {
                        $('.tab-desc').addClass('tab-active');
                        $('#desc_content').append(tab['_desc']);
                    } else {
                        $('#desc_content').append('Описание индикатора отсутствует!');
                    }
                });
            },
            error: function(response) {
                var reg = /user_not_found/i,
                    text = response.responseText;
                if(text.search(reg) != 1) {
                    RedirectAuth();
                }
            },
            complete: function() {
                // $('#preloading').removeClass('loading');
            }
        });
        return false;
    });
    // обрабатываем клик по табу с индикатором в "Описании"
    $('body').on('click', '.tab-desc', function() {
        var tab_id = $(this).attr('id');
        $.ajax({
            url: "php/programm.php",
            type: "post",
            dataType: "json",
            data: {
                'descr_tab_id' : tab_id
            },
            beforeSend: function() {
                // $('.content__body').append(preloading);
                // $('#preloading').addClass('loading');
            },
            success: function(response) {
                $('.tab-desc').removeClass('tab-active');
                $('.tab-desc#'+tab_id).addClass('tab-active');
                $('#desc_content').empty().append(response);

            },
            error: function(response) {
                var reg = /user_not_found/i,
                    text = response.responseText;
                if(text.search(reg) != 1) {
                    RedirectAuth();
                }
            },
            complete: function() {
                // $('#preloading').removeClass('loading');
            }
        });
        return false;
    });
    // --- --------------------- --- //
    // --- ОПИСАНИЕ ИНДИКАТОРОВ --- //
    // --- ------------------- --- //


    // --- ------------------------ --- //
    // --- ИНСТРУКЦИЯ ПО УСТАНОВКЕ --- //
    // --- ---------------------- --- //
    // обрабатываем клик по сайдбару "Инструкция по установке"
    $('body').on('click', '#indicator_install', function() {
        $('.sidebar-item').removeClass('sidebar-item-active');
        $(this).addClass('sidebar-item-active');
        $('.content__header').empty().append('<h1>Инструкция по установке индикаторов</h1>');
        var file_desc = $(".content__body").empty().load("install/install.html");
    });
    // --- ------------------------ --- //
    // --- ИНСТРУКЦИЯ ПО УСТАНОВКЕ --- //
    // --- ---------------------- --- //


    // --- ------------------- --- //
    // --- СКАЧАТЬ ИНДИКАТОРЫ --- //
    // --- ----------------- --- //
    // обрабатываем клик по сайдбару "Скачать индикаторы"
    $('#download').on('click', function() {
        var page_id = $(this).attr('id');
        $('.sidebar-item').removeClass('sidebar-item-active');
        $(this).addClass('sidebar-item-active');
        $.ajax({
            url: "php/programm.php",
            type: "post",
            dataType: "json",
            data: {
                'indicator_download' : page_id
            },
            beforeSend: function() {
                // $('.content__body').append(preloading);
                // $('#preloading').addClass('loading');
            },
            success: function(response) {
                createIndicatorDownloads(response);
            },
            error: function(response) {
                var reg = /user_not_found/i,
                    text = response.responseText;
                if(text.search(reg) != 1) {
                    RedirectAuth();
                }
            },
            complete: function() {
                // $('#preloading').removeClass('loading');
            }
        });
        return false;
    });
    // --- ------------------- --- //
    // --- СКАЧАТЬ ИНДИКАТОРЫ --- //
    // --- ----------------- --- //


    // --- --------------- --- //
    // --- ИСТОРИЯ ВЕРСИЙ --- //
    // --- ------------- --- //
	// обрабатываем клик по сайдбару "История версий"
    $('#history').on('click', function() {
        var page_id = $(this).attr('id');
        $('.sidebar-item').removeClass('sidebar-item-active');
        $(this).addClass('sidebar-item-active');
        $.ajax({
            url: "php/programm.php",
            type: "post",
            dataType: "json",
            data: {
                'history' : page_id
            },
            beforeSend: function() {
                // $('.content__body').append(preloading);
                // $('#preloading').addClass('loading');
            },
            success: function(response) {
                // вырезаем табы из общего массива
                var tabs = response.shift();
                createHistoryVersion(tabs);
                // первый объект второго массива является кол-вом страниц, заносим его в переменную currentPageHistory и pagesCountHistory
                var pages_count = response[0].shift();
                pagesCountHistory = Number(pages_count['_pages_count']);
                currentPageHistory = 1;
                // дублируем элементы "Истории версий"
                var items = Array();
                $.each(response, function(key, obj) {
                    items = obj.shift();
                });
                createHistoryItems(items,pagesCountHistory,currentPageHistory);
            },
            error: function(response) {
                var reg = /user_not_found/i,
                    text = response.responseText;
                if(text.search(reg) != 1) {
                    RedirectAuth();
                }
            },
            complete: function() {
                // $('#preloading').removeClass('loading');
            }
        });
        return false;
    });
    // обрабатываем клик по пагинации в "Истории версий"
    $('body').on('click', '.pagination-history .page-link', function() {
        var page_index = $(this).text();
        var tab = $('.tab-active').attr('id');
        if (page_index == 'Следующая')
            page_index = currentPageHistory+1;
        if (page_index == 'Предыдущая')
            page_index = currentPageHistory-1;
        if (page_index) {
            $.ajax({
                url: "php/programm.php",
                type: "post",
                dataType: "json",
                data: {
                    'page_indicator' : page_index,
                    'tab_indicator' : tab
                },
                beforeSend: function()
                {
                    //$('.content__body').append(preloading);
                    //$('#preloading').addClass('loading');
                },
                success: function(response) {
                    currentPageHistory = Number(page_index);
                    createHistoryItems(response,pagesCountHistory,currentPageHistory)
                    $('html, body').animate({scrollTop: 0},500);
                },
                error: function(response) {
                    console.log(response);
                    var reg = /user_not_found/i,
                        text = response.responseText;
                    if(text.search(reg) != 1) {
                        //RedirectAuth();
                    }
                },
                complete: function() {
                    //$('#preloading').removeClass('loading');
                }
            });
            return false;
        }
    });
    // клик по табам в "Истории версий"
    $('body').on('click', '.tab-history', function() {
        var tab_id = $(this).attr('id');
        $('.tab-history').removeClass('tab-active');
        $(this).addClass('tab-active');
        $.ajax({
            url: "php/programm.php",
            type: "post",
            dataType: "json",
            data: {
                'tab_id' : tab_id
            },
            beforeSend: function()
            {
                // $('.content__body').append(preloading);
                // $('#preloading').addClass('loading');
            },
            success: function(response) {
                // если первый объект является кол-вом страниц, заносим его в переменную currentPageHistory
                if (response[0]['_pages_count']) {
                    var pages_count = response.shift();
                    pagesCountHistory = Number(pages_count['_pages_count']);
                    currentPageHistory = Number(pages_count['_pages_count']);
                }
                // вырезаем элементы "Истории версий"
                var items = Array();
                $.each(response, function(key, obj) {
                    items = obj;
                });
                createHistoryItems(items,pagesCountHistory,currentPageHistory);
            },
            error: function(response) {
                var reg = /user_not_found/i,
                    text = response.responseText;
                if(text.search(reg) != 1) {
                    RedirectAuth();
                }
            },
            complete: function() {
                // $('#preloading').removeClass('loading');
            }
        });
        return false;
    });
    // --- --------------- --- //
    // --- ИСТОРИЯ ВЕРСИЙ --- //
    // --- ------------- --- //


    // --- -------------- --- //
    // --- ТЕХ ПОДДЕРЖКА --- //
    // --- ------------ --- //
	// обрабатываем клик по сайдбару "Тех поддержка"
	$('#support').on('click', function() {
		var page_id = $(this).attr('id');
		$('.sidebar-item').removeClass('sidebar-item-active');
		$(this).addClass('sidebar-item-active');
		$.ajax({
            url: "php/programm.php",
            type: "post",
            dataType: "json",
            data: {
                'support' : page_id
            },
            beforeSend: function()
            {
                // $('.content__body').append(preloading);
                // $('#preloading').addClass('loading');
            },
            success: function(response) {
            	// если первый объект является кол-вом страниц, заносим его в переменную currentPageSupport
				if (response[0]['_pages_count']) {
					var pages_count = response.shift();
					pagesCountSupport = Number(pages_count['_pages_count']);
					currentPageSupport = Number(pages_count['_pages_count']);
				}
            	createSupportPage(response,pagesCountSupport,currentPageSupport);
            },
            error: function(response) {
                var reg = /user_not_found/i,
                    text = response.responseText;
                if(text.search(reg) != 1) {
                    RedirectAuth();
                }
            },
            complete: function() {
                // $('#preloading').removeClass('loading');
            }
        });
        return false;
	});
    // обрабатываем клик по иконке "Создать заявку"
    $('body').on('click', '#btn_support', function(e) {
        e.preventDefault();
        var alert = $('#alert-message').empty();
        var html = '<div class="popup popup-support">' +
                        '<i class="fa fa-times btn-close"></i>' +
                        '<div class="popup-title"></div>' +
                        '<form class="popup-form">' +
                        '<div class="popup-row">' +
                            '<label for="type_support">Тип обращения: </label>' +
                            '<select id="type_support"><option value="admin">Администратор</option><option value="support" selected >Поддержка</option><option value="billing">Билинг</option></select>' +
                        '</div>' +
                        '<div class="popup-row">' +
                            '<label for="type_support">Тема сообщения: </label>' +
                            '<input type="text" id="title_support" />' +
                        '</div>' +
                        '<div class="popup-row" style="align-items:flex-start;">' +
                            '<label for="type_support">Текст сообщения: </label>' +
                            '<textarea id="text_support"></textarea>' +
                        '</div>' +
                        '<div class="popup-row" style="justify-content:flex-end;">' +
                            '<input type="submit" id="call_support" class="filter-btn" />' +
                        '</div>' +
                        '</form>' +
                    '</div>';
        alert.append(html).removeClass('hidden');
    });

    // обрабатываем клик по "Отправить заявку"
    $('body').on('click', '#call_support', function(e) {
        e.preventDefault();
        var type = $('#type_support').val();
        var title = $('#title_support').val();
        var text = $('#text_support').val();
        if (type && title && text) {
            $.ajax({
                url: "php/programm.php",
                type: "post",
                dataType: "json",
                data: {
                    'type_support' : type,
                    'title_support' : title,
                    'text_support' : text
                },
                beforeSend: function()
                {
                    // $('#preloading').addClass('loading');
                },
                success: function(response) {
                    $('.popup-form').addClass('hidden');
                    $('.btn-close').addClass('hidden');
                    $('.popup-title').empty().text('Заявка успешно создана!').removeClass('red');
                    setTimeout(function(){
                        $('#alert-message').addClass('hidden');
                    }, 3000);
                    // если первый объект является кол-вом страниц, заносим его в переменную currentPageSupport
                    if (response[0]['_pages_count']) {
                        var pages_count = response.shift();
                        pagesCountSupport = Number(pages_count['_pages_count']);
                        currentPageSupport = Number(pages_count['_pages_count']);
                    }
                    createSupportPage(response,pagesCountSupport,currentPageSupport);
                },
                error: function(response) {
                    var reg = /user_not_found/i,
                        text = response.responseText;
                    if(text.search(reg) != 1) {
                        RedirectAuth();
                    }
                },
                complete: function() {
                    // $('#preloading').removeClass('loading');
                }
            });
            return false;
        } else {
            $('.popup-title').empty().text('Заполните все поля!').addClass('red');
        }
    });
	// обрабатываем клик по конкретной заявке
	$('body').on('click', '.table-support-row', function() {
		var id_problem = $(this).attr('id');
        if (id_problem!==undefined) {
            $.ajax({
                url: "php/programm.php",
                type: "post",
                dataType: "json",
                data: {
                    'id_problem' : id_problem
                },
                beforeSend: function()
                {
                    // $('#preloading').addClass('loading');
                },
                success: function(response) {
                    createChat(response);
                },
                error: function(response) {
                    var reg = /user_not_found/i,
                        text = response.responseText;
                    if(text.search(reg) != 1) {
                        RedirectAuth();
                    }
                },
                complete: function() {
                    // $('#preloading').removeClass('loading');
                }
            });
            return false;
        }
	});

	// обрабатываем клик по пагинации в "Тех поддержке"
	$('body').on('click', '.pagination-support .page-link', function() {
		var page_index = $(this).text();
		if (page_index == 'Следующая')
			page_index = currentPageSupport+1;
		if (page_index == 'Предыдущая')
			page_index = currentPageSupport-1;
		$.ajax({
            url: "php/programm.php",
            type: "post",
            dataType: "json",
            data: {
                'page_index' : page_index
            },
            beforeSend: function()
            {
                //$('.content__body').append(preloading);
                //$('#preloading').addClass('loading');
            },
            success: function(response) {
            	currentPageSupport = Number(page_index);
            	createSupportPage(response,pagesCountSupport,currentPageSupport);

            	$('html, body').animate({scrollTop: 0},500);
            },
            error: function(response) {
                var reg = /user_not_found/i,
                    text = response.responseText;
                if(text.search(reg) != 1) {
                    RedirectAuth();
                }
            },
            complete: function() {
                //$('#preloading').removeClass('loading');
            }
        });
        return false;
	});
	// обрабатываем клик по "Вернуться к заявкам"
	$('body').on('click', '#back_support', function() {
		var page_index = $('#pagination_support_top .active .current').text();
        if (page_index) {
            $.ajax({
                url: "php/programm.php",
                type: "post",
                dataType: "json",
                data: {
                    'page_index' : page_index
                },
                beforeSend: function()
                {
                    //$('.content__body').append(preloading);
                    //$('#preloading').addClass('loading');
                },
                success: function(response) {
                    $('.chat-container').empty();
                    $('.content__body').removeClass('hidden');
                console.log(response);
                    currentPageSupport = Number(page_index);
                    createSupportPage(response,pagesCountSupport,currentPageSupport);

                    $('html, body').animate({scrollTop: 0},500);
                },
                error: function(response) {
                    var reg = /user_not_found/i,
                        text = response.responseText;
                    if(text.search(reg) != 1) {
                        RedirectAuth();
                    }
                },
                complete: function() {
                    //$('#preloading').removeClass('loading');
                }
            });
            return false;
        }
	});

	// обрабатываем клик по "Отправить" в окне чата
	$('body').on('click', '#send_chat_message', function() {
        if ($('#chat_message').val().length > 0) {
            var problem_id = $('#problem_id').text();
            var problem_message = $('#chat_message').val();
            var user_name = $('.user-info__name').text();
            $.ajax({
                url: "php/programm.php",
                type: "post",
                dataType: "json",
                data: {
                    'problem_id' : problem_id,
                    'problem_message' : problem_message
                },
                beforeSend: function()
                {
                    //$('.support-container').append(preloading);
                    //$('#preloading').addClass('loading');
                },
                success: function(response) {
                    $('#send_chat_message').addClass('disabled').prop('disabled',true);
                    if (response['problem_status'] == 'close') {
                        $('#chat_message').addClass('hidden');
                        $('#close_support').addClass('hidden');
                        $('#send_chat_message').addClass('hidden');
                        $('#open_support').removeClass('hidden');
                        response['_status'] = response['problem_status'];
                        var icon = supportStatus(response);
                        $('h3.table-chat-title').empty().append(icon);
                        $('.chat-row').append(response["problem_closed"]);
                    }
                    if (response['problem_status'] == 'wait_operator') {
                        var html = '<div class="chat-message color-chat-user">' +
                                        '<div class="chat-user-name"><i class="fa fa-user"></i> '+user_name+'</div>' +
                                        '<div class="chat-text">'+problem_message+'</div>' +
                                    '</div>';
                        $('.chat-wrapper').append(html);
                        $('#chat_message').prop('value', '');
                        response['_status'] = response['problem_status'];
                        var icon = supportStatus(response);
                        $('h3.table-chat-title').empty().append(icon);
                    }
                },
                error: function(response) {
                    var reg = /user_not_found/i,
                        text = response.responseText;
                    if(text.search(reg) != 1) {
                        RedirectAuth();
                    }
                },
                complete: function() {
                    //$('#preloading').removeClass('loading');
                }
            });
            return false;
        }		
	});
	// обрабатываем клик по "Закрыть заявку"
	$('body').on('click', '#close_support', function() {
		var close_problem_id = $('#problem_id').text();
		$.ajax({
            url: "php/programm.php",
            type: "post",
            dataType: "json",
            data: {
                'close_problem_id' : close_problem_id
            },
            beforeSend: function()
            {
                //$('.support-container').append(preloading);
                //$('#preloading').addClass('loading');
            },
            success: function(response) {
            console.log(response);
            	if ( response['problem_status']=='close' ) {
            		response['_status'] = response['problem_status'];
            		var icon = supportStatus(response);
            		$('h3.table-chat-title').empty().append(icon);
            		$('#chat_message').addClass('hidden');
            		$('#close_support').addClass('hidden');
            		$('#send_chat_message').addClass('hidden');
                    $('#open_support').removeClass('hidden');
            	}
            },
            error: function(response) {
                var reg = /user_not_found/i,
                    text = response.responseText;
                if(text.search(reg) != 1) {
                    RedirectAuth();
                }
            },
            complete: function() {
                //$('#preloading').removeClass('loading');
            }
        });
        return false;
	});
    // обрабатываем клик по "Открыть заявку"
    $('body').on('click', '#open_support', function() {
        var open_problem_id = $('#problem_id').text();
        $.ajax({
            url: "php/programm.php",
            type: "post",
            dataType: "json",
            data: {
                'open_problem_id' : open_problem_id
            },
            beforeSend: function()
            {
                //$('.support-container').append(preloading);
                //$('#preloading').addClass('loading');
            },
            success: function(response) {
                if (response['problem_status'] == 'wait_operator') {
                    response['_status'] = response['problem_status'];
                    var icon = supportStatus(response);
                    $('h3.table-chat-title').empty().append(icon);
                    $('#chat_message').removeClass('hidden');
                    $('#close_support').removeClass('hidden');
                    $('#send_chat_message').removeClass('hidden');
                    $('#open_support').addClass('hidden');
                }
            },
            error: function(response) {
                var reg = /user_not_found/i,
                    text = response.responseText;
                if(text.search(reg) != 1) {
                    RedirectAuth();
                }
            },
            complete: function() {
                //$('#preloading').removeClass('loading');
            }
        });
        return false;
    });
	// обрабатываем изменение поля сообщения в чате
    $('body').on('input', '#chat_message', function() {
        var chat_message = $(this).val(),
            btn = $('#send_chat_message');
        (chat_message.length==0) ? btn.addClass('disabled').prop('disabled',true) : btn.removeClass('disabled').prop('disabled',false);
    });
    // --- -------------- --- //
    // --- ТЕХ ПОДДЕРЖКА --- //
    // --- ------------ --- //


}); // end DOM ready



// формируем статусы заявок
function supportStatus(obj)
{
	var status = String();
	switch (obj['_status'])
    {
        case "new":
            status = '<i class="fa fa-file-o" style="color:Green;"></i> <span style="color:Green;">Новая заявка</span>';
            break;
        case "wait_operator":
            status = '<i class="fa fa-clock-o" style="color:Green;"></i> <span style="color:Green;">Ожидает ответа оператора</span>';
            break;
        case "wait_client":
           	status = '<i class="fa fa-envelope-o" style="color:Orange;"></i> <span style="color:Orange;">Ожидает Ваш ответ</span>';
            break;
        case "close":
            status = '<i class="fa fa-check-circle" style="color:red"></i> <span style="color:Red;">Заявка закрыта</span>';
            break;
    }
	return status;
}


// создаем скачивание индикаторов
function createIndicatorDownloads(response)
{
    $('.content__header').empty().append('<h1>Скачать программы</h1>');
	$('.content__body').empty().append('<div class="get-key"><span>Один ключ на все программы сервиса Volume Levels:</span><input type="button" id="" class="btn btn-start" value="Получить ключ"  onClick="open_window(\'get-key\');"/></div>');
    $.each(response, function(key, obj) {
        var html =  '<div class="block block-indicators-download">' +
                        '<h2>'+obj['_name']+'</h2>' +
                        '<div class="indicators-download-container">' +
                            '<div style="width:440px">' +
                                '<p>'+obj['_short_desc']+'</p>' +
                            '</div>' +
                            '<div style="width:390px">' +
                                '<div class="indicators-download-row">' +
                                    '<div class="indicators-download-image"><img src="img/sprite-version.png" alt="" title="" /></div>' +
                                    '<span>Версия: '+obj['_version']+'</span>' +
                                    '<a href=../../download.php?id='+obj['_id']+'><input type="button" id="" class="btn btn-start" value="Скачать" /></a>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>';
        $('.content__body').append(html);
    });
}


// создаем историю версий
function createHistoryVersion(tabs)
{
    var wrapper = $('.content__body');
    var html = '<div class="tabs" style="margin:0;">'+
                    '<div id="0" class="tab-history tab-active">Все</div>' +
                '</div>' +
                '<div class="block block-history">' +
                    '<div id="pagination_history_top" class="pagination pagination-history"></div>' +
                    '<div id="history_content"></div>' +
                    '<div id="pagination_history_bottom" class="pagination pagination-history"></div>' +
                '</div>';

    $('.content__header').empty().append('<h1>История версий</h1>');
    wrapper.empty().append(html);
    $.each(tabs, function(key, tab) {
        var tab_html = '<div id="'+tab['_id']+'" class="tab-history">'+tab['_name']+'</div>';
        $('.tabs').append(tab_html);
    });
}


// создаем элементы "Истории версий"
function createHistoryItems(items,pagesCountHistory,currentPageHistory)
{
    var preloading = '<div id="preloading"></div>';
    var content = $('#history_content');
    content.empty().append(preloading);
    $('#preloading').addClass('loading');
    $('#pagination_history_top').pagination({
      pages: pagesCountHistory,
      currentPage: currentPageHistory,
      selectOnClick: false,
      prevText: 'Предыдущая',
      nextText: 'Следующая'
    });
    $.each(items, function(key, item) {
        if(item['_id_indicator']==1) {
            var title = $('.tab-history#'+item['_id_indicator']).text();
            var history_html =  '<div id="'+item['_id']+'" class="block-history-content">' +
                                    '<h2>'+title+'</h2>' +
                                    '<div class="block-history-inform"><span>Версия: '+item['_version']+'</span><span>Дата: '+item['_date']+'</span></div>' +
                                    '<p>'+item['_changes']+'</p>' +
                                '</div>';
        } else {
            var title = $('.tab-history#'+item['_id_indicator']).text();
            var history_html =  '<div id="'+item['_id']+'" class="block-history-content">' +
                                    '<h2>'+title+'</h2>' +
                                    '<div class="block-history-inform"><span>Версия: '+item['_version']+'</span><span>Дата: '+item['_date']+'</span></div>' +
                                    '<p>'+item['_changes']+'</p>' +
                                '</div>';
        }
        content.append(history_html);
    });
    $('#pagination_history_bottom').pagination({
      pages: pagesCountHistory,
      currentPage: currentPageHistory,
      selectOnClick: false,
      prevText: 'Предыдущая',
      nextText: 'Следующая'
    });
    $('#preloading').remove();
}


// создаем заявки
function createSupportPage(response,pagesCountSupport,currentPageSupport)
{
	var support_items = Array();
	var preloading = '<div id="preloading"></div>';
	var wrapper = $('.content__body').empty();
	wrapper.append(preloading);
    $('#preloading').addClass('loading');
	var html = '<div id="pagination_support_top" class="pagination pagination-support"></div>' +
				'<div class="table-data">' +
		        	'<div class="table-support-head">' +
		                '<div class="table-support-cell">Номер</div>' +
		                '<div class="table-support-cell">Заявка</div>' +
		                '<div class="table-support-cell">Статус</div>' +
		          	'</div>' +
		          	'<div class="table-support-body">' +

		          	'</div>' +
		        '</div>' +
		        '<div id="pagination_support_bottom" class="pagination pagination-support"></div>';

    $('.content__header').empty().append('<h1>Техническая поддержка</h1><button id="btn_support" class="btn-popup-support"><i class="fa fa-file-o"></i><span class="pluse"></span>Новая заявка</button>');
	wrapper.append(html);
    if (response[0]['_pages_count']==0) {
        var html = '<div class="table-support-row invalid">Заявки отсутствуют!</div>';
        support_items.push(html);
        $('#pagination_support_top').remove();
        $('#pagination_support_bottom').remove();
    } else {
        $.each(response, function(key, value) {
            var html = '<div class="table-support-row" id="'+value['_id']+'">' +
                            '<div class="table-support-cell">'+value['_id']+'</div>' +
                            '<div class="table-support-cell">' +
                                '<h4 class="table-support-title">'+value['_title']+'</h4>' +
                                '<p class="table-support-text">'+value['_text']+'</p>' +
                            '</div>' +
                            '<div class="table-support-cell">'+supportStatus(value)+'</div>' +
                        '</div>';
            support_items.push(html);
        });
    }
	$('.table-support-body').append(support_items);
	$('#pagination_support_top').pagination({
        pages: pagesCountSupport,
        currentPage: currentPageSupport,
        selectOnClick: false,
        prevText: 'Предыдущая',
        nextText: 'Следующая'
    });
    $('#pagination_support_bottom').pagination({
        pages: pagesCountSupport,
        currentPage: currentPageSupport,
        selectOnClick: false,
        prevText: 'Предыдущая',
        nextText: 'Следующая'
    });
    $('#preloading').removeClass('loading').remove();
}


// создаем окно чата
function createChat(response)
{
	var wrapper = $('.chat-container');
	var item = response.shift();
	// скрываем все заявки
	$('.content__body').addClass('hidden');
	// удаляем предыдущие диалоги
	$('.table-data-chat').remove();
	var date = new Date(item['_date']);
	item['_date'] = date.toLocaleString().substr(0,10);
	// имя пользователя для чата
	var user_name = $('.user-info__name').text();
	var html = '<div class="back-support"><span id="back_support">Вернуться к заявкам</span></div>' +
				'<div class="table-data-chat">' +
		          	'<div class="table-data-head">' +
		                '<div class="table-chat-head">' +
		                	'<h4 class="table-chat-title"><i class="fa fa-file-o"></i> '+item['_title']+'</h4>' +
		                  	'<p class="table-chat-text">заявка № <span id="problem_id">'+item['_id']+'</span></p>' +
		                '</div>' +
		                '<div class="table-chat-head">' +
		                  	'<h3 class="table-chat-title">'+supportStatus(item)+'</h3>' +
		                  	'<p>Дата создания: <span>'+item['_date']+' г.</span></p>' +
		                '</div>' +
		          	'</div>' +
		          	'<div class="table-data-body">' +
			            '<div class="chat-wrapper"></div>' +
			        '</div>' +
		            '<textarea id="chat_message" class="textarea" cols="30" rows="10"></textarea>' +
		            '<div class="chat-row">' +
                        '<input type="submit" id="open_support" class="filter-btn" value="Открыть заявку" />' +
			            '<input type="submit" id="close_support" class="filter-btn" value="Закрыть заявку" />' +
			            '<input type="submit" id="send_chat_message" class="filter-btn disabled" />' +
		            '</div>' +
		        '</div>';
	wrapper.append(html);
	$('#open_support').addClass('hidden');
	if (item['_status']=='close') {
		$('#chat_message').addClass('hidden');
		$('#close_support').addClass('hidden');
		$('#send_chat_message').addClass('hidden');
        $('#open_support').removeClass('hidden');
	}
	var chat_wrapper = $('.chat-wrapper');
	var chat_operator = String();
	var chat_user = '<div class="chat-message color-chat-user">' +
		                '<div class="chat-user-name"><i class="fa fa-user"></i> '+user_name+'</div>' +
		                '<div class="chat-text">'+item['_text']+'</div>' +
		            '</div>';
	chat_wrapper.append(chat_user);
	$.each(response, function(key, obj) {
		if (obj['_user_role']==0) {
			chat_user = '<div class="chat-message color-chat-user">' +
			                '<div class="chat-user-name"><i class="fa fa-user"></i> '+obj['_user_name']+'</div>' +
			                '<div class="chat-text">'+obj['_text']+'</div>' +
			            '</div>';
			chat_wrapper.append(chat_user);
		} else {
			chat_operator = '<div class="chat-message color-chat-admin">' +
								'<div class="chat-user-name"><i class="fa fa-cogs" style="color:Blue;"></i> '+obj['_user_name']+'</div>' +
								'<div class="chat-text">'+obj['_text']+'</div>' +
							'</div>';
			chat_wrapper.append(chat_operator);
		}
	});
}

function send_key()
	{
	$.ajax({
        url: "handler/send-key.php",
        type: "post",
        dataType: "json",
        beforeSend: function()
			{
            $('#button-send-key').val("Отправляется...");
			document.getElementById('button-send-key').className = 'payment-button-disabled';
			$('#button-send-key').attr('disabled',true);
			},
        success: function(html) {
			if (html.success == "sended")
				{
				$('#button-send-key').val("Отправлен на почту!");
				document.getElementById('button-send-key').style.color = 'Green';
				document.getElementById('button-send-key').style.border = 'none';
				}
			},
        error: function(response) {
            var reg = /user_not_found/i,
                text = response.responseText;
            if(text.search(reg) != 1) RedirectAuth();
			}
		});
	button-send-key
	}