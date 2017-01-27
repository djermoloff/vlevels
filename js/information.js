// событие готовности ДОМ-дерева
$(document).ready(function() {

	// для хранения данных формы
	var my_data = Object();


	// --- ----------- --- //
    // --- МОИ ДАННЫЕ --- //
    // --- --------- --- //
	// триггер по сайдбару "Мои данные"
	var GETArr = parseGetParams(); 
	if (!GETArr['tab']) setTimeout(function(){$('#my_info').trigger('click');}, 10);
		else {
		var n = "#"+GETArr['tab'];
		if ($(n).length > 0) setTimeout(function(){ $(n).trigger('click'); }, 10); else setTimeout(function(){$('#my_info').trigger('click');}, 10);
		} 
	
    // обрабатываем клик по сайдбару "Мои данные"
	$('#my_info').on('click', function() {
		var my_info = $(this).attr('id');
		$('.sidebar-item').removeClass('sidebar-item-active');
		$(this).addClass('sidebar-item-active');
		$.ajax({
            url: "php/Information.php",
            type: "post",
            dataType: "json",
            data: {
                'my_info' : my_info
            },
            success: function(response) {
            	my_data = response;
            	createMyInfo(my_data);
            },
            error: function(response) {
                var reg = /user_not_found/i,
                    text = response.responseText;
                if(text.search(reg) != 1) {
                    RedirectAuth();
                }
            }
        });
        return false;
	});
	// при клике по изменить в "Мои данные", если были изменения отправлем их
	$('body').on('click', '#data_change', function(e) {
		e.preventDefault();
		var name = null;
		var surname = null;
		var phone = null;
		var birthday = null;
		var country = null;
		var city = null;
		var exp_forex = null;
		var get_news = null;
		var get_refresh = null;
		var get_issues = null;
		var my_info_change = $(this).attr('id');
		if ($.trim($('#name').val()) != my_data['name'] && $.trim($('#name').val()).length != 0) name = $.trim($('#name').val());
		if ($.trim($('#surname').val()) != my_data['surname'] && $.trim($('#surname').val()).length != 0) surname = $.trim($('#surname').val());
		if ($.trim($('#phone').val()) != my_data['phone'] && $.trim($('#phone').val()).length != 0) phone = $.trim($('#phone').val());
		if ($.trim($('#birthday').val()) != my_data['birthday'] && $.trim($('#birthday').val()).length != 0) birthday = $.trim($('#birthday').val());
		if ($.trim($('#country').val()) != my_data['country'] && $.trim($('#country').val()).length != 0) country = $.trim($('#country').val());
		if ($.trim($('#city').val()) != my_data['city'] && $.trim($('#city').val()).length != 0) city = $.trim($('#city').val());
		if ($.trim($('#experience').val()) != my_data['exp_forex'] && $.trim($('#experience').val()).length != 0) exp_forex = $.trim($('#experience').val());
		($('#news').prop('checked')==true) ? get_news=1 : get_news=0;
		if (get_news == my_data['get_news']) get_news = null;
		($('#upgrade').prop('checked')==true) ? get_refresh=1 : get_refresh=0;
		if (get_refresh == my_data['get_refresh']) get_refresh = null;
		($('#article').prop('checked')==true) ? get_issues=1 : get_issues=0;
		if (get_issues == my_data['get_issues']) get_issues = null;
		if (name==null&&surname==null&&phone==null&&birthday==null&&country==null&&city==null&&exp_forex==null&&get_news==null&&get_refresh==null&&get_issues==null) {
		    $('.message').empty().append('<i class="fa fa-ban"></i>Нет изменений!').addClass('error').removeClass('hidden');
			$('html, body').animate({scrollTop: 0},100);
			setTimeout(function() {
		        $('.message').empty().removeClass('error').addClass('hidden');
		    }, 3000);
		}
		if (name!=null||surname!=null||phone!=null||birthday!=null||country!=null||city!=null||exp_forex!=null||get_news!=null||get_refresh!=null||get_issues!=null) {
			$.ajax({
	            url: "php/Information.php",
	            type: "post",
	            dataType: "json",
	            data: {
	            	'my_info_change' : my_info_change,
	            	'name' : name,
	            	'surname' : surname,
	            	'phone' : phone,
	            	'birthday' : birthday,
	            	'country' : country,
	            	'city' : city,
	            	'exp_forex' : exp_forex,
	            	'get_news' : get_news,
	            	'get_refresh' : get_refresh,
	            	'get_issues' : get_issues
	            },
	            beforeSend: function()
	            {
	                //$('.support-container').append(preloading);
	                //$('#preloading').addClass('loading');
	            },
	            success: function(response) {
	  				if (response['success']) {
	  					my_data['name'] = $('#name').val();
	  					my_data['surname'] = $('#surname').val();
	  					my_data['phone'] = $('#phone').val();
						my_data['birthday'] = $('#birthday').val();
						my_data['country'] = $('#country').val();
						my_data['city'] = $('#city').val();
						my_data['exp_forex'] = $('#experience').val();
						$('.user-info__name span').empty().append(my_data['name']);
						if (get_news!=null) my_data['get_news'] = get_news;
						if (get_refresh!=null) my_data['get_refresh'] = get_refresh;
						if (get_issues!=null) my_data['get_issues'] = get_issues;
						$('.message').empty().append('<i class="fa fa-check-circle-o"></i>Данные успешно изменены!').addClass('success').removeClass('hidden');
						$('html, body').animate({scrollTop: 0},100);
	  					setTimeout(function() {
					        $('.message').empty().removeClass('success').addClass('hidden');
					    }, 3000);
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
	// при клике по изменить в "Изменить пароль"
	$('body').on('click', '#change_pass', function(e) {
		e.preventDefault();
		var old_pass = $('#old_pass').val();
		var new_pass = $('#new_pass').val();
		var repeat_pass = $('#repeat_pass').val();
		if (!old_pass || !new_pass || !repeat_pass) {
		    $('.message').empty().append('<i class="fa fa-ban"></i>Заполните все поля!').addClass('error').removeClass('hidden');
			$('html, body').animate({scrollTop: 0},100);
			setTimeout(function() {
		        $('.message').empty().removeClass('error').addClass('hidden');
		    }, 3000);
		}
		if (old_pass && new_pass && repeat_pass) {
			$.ajax({
	            url: "php/Information.php",
	            type: "post",
	            dataType: "json",
	            data: {
	                'old_pass' : old_pass,
	                'new_pass' : new_pass,
	                'repeat_pass' : repeat_pass
	            },
	            beforeSend: function()
	            {
	                //$('.support-container').append(preloading);
	                //$('#preloading').addClass('loading');
	            },
	            success: function(response) {
	  				if (response['old_pass_incorrect']) {
					    $('.message').empty().append('<i class="fa fa-ban"></i>Неверный старый пароль!').addClass('error').removeClass('hidden');
						$('html, body').animate({scrollTop: 0},100);
						setTimeout(function() {
					        $('.message').empty().removeClass('error').addClass('hidden');
					    }, 3000);
	  				}
	  				if (response['new_pass_incorrect']) {
					    $('.message').empty().append('<i class="fa fa-ban"></i>'+response['new_pass_incorrect']).addClass('error').removeClass('hidden');
						$('html, body').animate({scrollTop: 0},100);
						setTimeout(function() {
					        $('.message').empty().removeClass('error').addClass('hidden');
					    }, 3000);
	  				}
	  				if (response['pass_not_same']) {
					    $('.message').empty().append('<i class="fa fa-ban"></i>Пароли не совпадают!').addClass('error').removeClass('hidden');
						$('html, body').animate({scrollTop: 0},100);
						setTimeout(function() {
					        $('.message').empty().removeClass('error').addClass('hidden');
					    }, 3000);
	  				}
	  				if (response['success']) {
					    $('.message').empty().append('<i class="fa fa-check-circle-o"></i>Пароль успешно изменён!').addClass('success').removeClass('hidden');
					    $('input[type=password]').val('');
						$('html, body').animate({scrollTop: 0},100);
	  					setTimeout(function() {
					        $('.message').empty().removeClass('success').addClass('hidden');
					    }, 3000);
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
	// --- ----------- --- //
    // --- МОИ ДАННЫЕ --- //
    // --- --------- --- //


    // --- ------------ --- //
    // --- МОИ ФИНАНСЫ --- //
    // --- ---------- --- //
    // обрабатываем клик по сайдбару "Мои финансы"
	$('#my_cash').on('click', function() {
		var my_cash = $(this).attr('id');
		$('.sidebar-item').removeClass('sidebar-item-active');
		$(this).addClass('sidebar-item-active');
		$.ajax({
            url: "php/Information.php",
            type: "post",
            dataType: "json",
            data: {
                'my_cash' : my_cash
            },
            beforeSend: function()
            {
                // $('.support-container').append(preloading);
                // $('#preloading').addClass('loading');
            },
            success: function(response) {
            	createMyCash(response);
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
	// обрабатываем клик по "Вывести средства"
	$('body').on('click', '#out_cash', function(e) {
		e.preventDefault();
		alert('Вывести средства');
	});
	// обрабатываем клик по "Пополнить баланс"
	$('body').on('click', '#deposit_cash', function(e) {
		e.preventDefault();
		$('#alert-message').empty().append('Пополнить баланс').removeClass('hidden');
	});
	// обрабатываем клик по "Продлить лицензию"
	$('body').on('click', '#exted_license', function(e) {
		e.preventDefault();
		$('#alert-message').empty().append('Продлить лицензию').removeClass('hidden');
	});
	// обрабатываем клик по "Активировать промо код"
	$('body').on('click', '#active_promo_code', function(e) {
		e.preventDefault();
		var promo_code = $('#input_promo_code').val();
		if (promo_code) {
			$.ajax({
	            url: "php/Information.php",
	            type: "post",
	            dataType: "json",
	            data: {
	                'promo_code' : promo_code
	            },
	            beforeSend: function()
	            {
	                // $('.support-container').append(preloading);
	                // $('#preloading').addClass('loading');
	            },
	            success: function(response) {
	            	// если Промо код не найден!
	            	if (response['not_exist']) {
	            		$('.message').empty().append('<i class="fa fa-ban"></i>Промо код не найден!').addClass('error').removeClass('hidden');
						$('html, body').animate({scrollTop: 0},100);
							setTimeout(function() {
					        $('.message').empty().removeClass('error').addClass('hidden');
					    }, 3000);
	            	}
	            	// если Срок действия промо кода истек!
	            	if (response['date_expired']) {
	            		$('.message').empty().append('<i class="fa fa-ban"></i>Срок действия промо кода истек!').addClass('error').removeClass('hidden');
						$('html, body').animate({scrollTop: 0},100);
							setTimeout(function() {
					        $('.message').empty().removeClass('error').addClass('hidden');
					    }, 3000);
					}
	            	// если Промо код не имеет активаций!
	            	if (response['count_expired']) {
	            		$('.message').empty().append('<i class="fa fa-ban"></i>Промо код не имеет активаций!').addClass('error').removeClass('hidden');
						$('html, body').animate({scrollTop: 0},100);
							setTimeout(function() {
					        $('.message').empty().removeClass('error').addClass('hidden');
					    }, 3000);
	            	}
	            	// если Промо код успешно активирован!
	            	if (response['_active_date']) {
	            		$('.message').empty().append('<i class="fa fa-check-circle-o"></i>Промо код успешно активирован!').addClass('success').removeClass('hidden');
						$('html, body').animate({scrollTop: 0},100);
	  					setTimeout(function() {
					        $('.message').empty().removeClass('success').addClass('hidden');
					    }, 3000);
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
	                // $('#preloading').removeClass('loading');
	            }
	        });
	        return false;
		} else {
			$('.message').empty().append('<i class="fa fa-ban"></i>Введите промо код!').addClass('error').removeClass('hidden');
			$('html, body').animate({scrollTop: 0},100);
				setTimeout(function() {
		        $('.message').empty().removeClass('error').addClass('hidden');
		    }, 3000);
		}
	});
	// --- ------------ --- //
    // --- МОИ ФИНАНСЫ --- //
    // --- ---------- --- //


    // --- ---------------------- --- //
    // --- ПАРТНЕРСКАЯ ПРОГРАММА --- //
    // --- -------------------- --- //
	// обрабатываем клик по сайдбару "Партнерская программа"
	$('#referal_program').on('click', function() {
		var referal_program = $(this).attr('id');
		$('.sidebar-item').removeClass('sidebar-item-active');
		$(this).addClass('sidebar-item-active');
		$.ajax({
            url: "php/Information.php",
            type: "post",
            dataType: "json",
            data: {
                'referal_program' : referal_program
            },
            beforeSend: function()
            {
                // $('.support-container').append(preloading);
                // $('#preloading').addClass('loading');
            },
            success: function(response) {
            	if (response['not_active']) {
            		var html = 	'<h1>Партнерская программа</h1>' +
							    '<p class="content__header-text">Зарабатывайте вместе с сервисом. Начните получать до 30% от всех платежей Ваших партнеров.</p>' +
							    '<input type="submit" id="referal_activation" class="content__header-btn" value="Активировать партнерскую программу" />';
					$('.content__header').empty().append(html);
					$('.content__body').empty();
            	} else {
            		createReferalProgram(response);
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
                // $('#preloading').removeClass('loading');
            }
        });
        return false;
	});
	// клик по "Активировать партнерскую программу"
	$('body').on('click', '#referal_activation', function() {
		var referal_activation = $(this).attr('id');
		$.ajax({
	            url: "php/Information.php",
	            type: "post",
	            dataType: "json",
	            data: {
	                'use_partner_program' : referal_activation
	            },
	            beforeSend: function()
	            {
	                //$('.support-container').append(preloading);
	                //$('#preloading').addClass('loading');
	            },
	            success: function(response) {
	  				createReferalProgram(response);
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
	// клик по "Добавить сайт"
	$('body').on('click', '#add_site', function() {
		var site = $('#site').val();
		if (site) {
			$.ajax({
	            url: "php/Information.php",
	            type: "post",
	            dataType: "json",
	            data: {
	                'add_site' : site
	            },
	            beforeSend: function()
	            {
	                //$('.support-container').append(preloading);
	                //$('#preloading').addClass('loading');
	            },
	            success: function(response) {
	  				if (response['site_is_exist']) {
	  					$('#site_message').empty().append('Данный сайт уже используется!').addClass('invalid');
						setTimeout(function() {
					        $('#site_message').empty();
					    }, 3000);
	  				}
	  				if (response['invalid_format']) {
	  					$('#site_message').empty().append('Неверный формат адреса сайта!').addClass('invalid');
						setTimeout(function() {
					        $('#site_message').empty();
					    }, 3000);
	  				}
	  				if (response['_site']) {
	  					$('#site_wrapper').after('<div class="block-row"><p>'+response['_site']+'</p><p id="'+response['_site']+'" class="link-color">Проверить</p></div>');
						$('#site').val('');
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
		} else {
			$('#site_message').empty().append('Укажите адрес Вашего сайта!').addClass('invalid');
			setTimeout(function() {
		        $('#site_message').empty();
		    }, 3000);
		}
	});
	// клик по "Проверить статус"
	$('body').on('click', '.link-color', function() {
		var self = $(this);
		var site = self.attr('id');
		var random_number = $('#random_number').text();
		$.ajax({
	            url: "php/Information.php",
	            type: "post",
	            dataType: "json",
	            data: {
	                'check_site' : site,
	                'check_number' : random_number
	            },
	            beforeSend: function()
	            {
	                //$('.support-container').append(preloading);
	                //$('#preloading').addClass('loading');
	            },
	            success: function(response) {
	  				if (response['status']==0) {
	  					$('#site_message').empty().append('Не выполнено условие верификации!').addClass('invalid');
						setTimeout(function() {
					        $('#site_message').empty();
					    }, 3000);
	  				}
	  				if(response['_status']==1) {
	  					var html = '<div class="data-final-title">' +
					                	'<b style="font-size:16px;padding-bottom:5px;">С сайта '+site+':</b>' +
					              	'</div>' +
					              	'<div class="data-final-content">' +
						                '<p>Переходов по ссылке:</p>' +
						                '<p id="">'+response['_visits_site']+'</p>' +
					              	'</div>' +
					              	'<div class="data-final-content">' +
						                '<p>Регистраций:</p>' +
						                '<p id="">'+response['_regs_site']+'</p>' +
					              	'</div>' +
					              	'<div class="data-final-content">' +
						                '<p>Оплат на сумму:</p>' +
						                '<p id="">-</p>' +
					              	'</div>';
						$('#my_site').append(html);
						var visits_all = Number($('#visits_all').text()) + Number(response['_visits_site']);
						var regs_all = Number($('#regs_all').text()) + Number(response['_regs_site']);
						$('#visits_all').text(visits_all);
						$('#regs_all').text(regs_all);
						$(self).text('Проверено').removeClass('link-color').addClass('valid');
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
	// --- ---------------------- --- //
    // --- ПАРТНЕРСКАЯ ПРОГРАММА --- //
    // --- -------------------- --- //


}); // end DOM ready



// создаем страницу "Мои данные"
function createMyInfo(response)
{
	var html = '<div class="row">' +
          			'<div class="block block-my-data">' +
            			'<h2 class="block-title">Мои данные:</h2>' +
			            '<form id="my_form_info">' +
			            	'<div id="data_message"></div>' +
			              	'<div class="block-row">' +
				                '<label for="name">Имя: </label>' +
				                '<input type="text" id="name" name="name" class="input input-data input-long" />' +
			              	'</div>' +
			              	'<div class="block-row">' +
			                	'<label for="surname">Фамилия: </label>' +
			                	'<input type="text" id="surname" name="surname" class="input input-data input-long" />' +
			             	'</div>' +
			              	'<div class="block-row">' +
			                	'<label for="email">E-mail: </label>' +
			                	'<input type="text" id="email" name="email" class="input input-data input-long" />' +
			              	'</div>' +
			              	'<div class="block-row">' +
			               		'<label for="phone">Телефон: </label>' +
			                	'<input type="text" id="phone" name="phone" class="input input-data input-long" />' +
			              	'</div>' +
			              	'<div class="block-row">' +
			                	'<label for="birthday">Дата рождения: </label>' +
			                	'<input type="text" id="birthday" name="qbirthday" class="input input-data input-mini" readonly="true" /><i class="fa fa-calendar"></i>' +
			              	'</div>' +
			              	'<div class="block-row">' +
			                	'<label for="country">Страна: </label>' +
			                	'<input type="text" id="country" name="country" class="input input-data input-middle" spellcheck />' +
			              	'</div>' +
			              	'<div class="block-row">' +
			                	'<label for="city">Город: </label>' +
			                	'<input type="text" id="city" name="city" class="input input-data input-middle" spellcheck />' +
			              	'</div>' +
			              	'<div class="block-row">' +
			                	'<label for="experience">Опыт на форекс (лет): </label>' +
			                	'<input type="text" id="experience" name="experience" class="input input-data input-mini" />' +
			              	'</div>' +
			              	'<div class="block-row block-row-btn">' +
			                	'<input type="submit" id="data_change" class="filter-btn" value="Изменить" />' +
			              	'</div>' +
			            '</form>' +
			        '</div><!-- block-my-data -->' +
			        '<div>' +
			            '<div class="block block-change-pass">' +
			              	'<h2 class="block-title">Изменить пароль:</h2>' +
			              	'<form>' +
			              		'<div id="pass_message"></div>' +
				                '<div class="block-row">' +
				                  	'<label for="">Старый пароль: </label>' +
				                  	'<input type="password" id="old_pass" class="input input-data input-middle" />' +
				                '</div>' +
				                '<div class="block-row">' +
				                  	'<label for="">Новый пароль: </label>' +
				                  	'<input type="password" id="new_pass" class="input input-data input-middle" />' +
				                '</div>' +
				                '<div class="block-row">' +
				                  	'<label for="">Поворить пароль: </label>' +
				                  	'<input type="password" id="repeat_pass" class="input input-data input-middle" />' +
				                '</div>' +
				                '<div class="block-row block-row-btn">' +
				                  	'<input type="submit" id="change_pass" class="filter-btn" value="Изменить" />' +
				                '</div>' +
			              	'</form>' +
			            '</div>' +
				        '<div class="block block-change-pass">' +
				            '<h2 class="block-title">Подписка:</h2>' +
				            '<form>' +
				                '<div class="block-row block-row-checkbox">' +
				                  	'<input type="checkbox" id="news" name="news" class="hidden" />' +
				                  	'<label for="news">Новости:</label>' +
				                '</div>' +
				                '<div class="block-row block-row-checkbox">' +
				                 	'<input type="checkbox" id="upgrade" name="upgrade" class="hidden" />' +
				                  	'<label for="upgrade">Обновления:</label>' +
				                '</div>' +
				                '<div class="block-row block-row-checkbox">' +
				                  	'<input type="checkbox" id="article" name="article" class="hidden" />' +
				                  	'<label for="article">Статьи:</label>' +
				                '</div>' +
				            '</form>' +
				        '</div>' +
			        '</div>' +
			    '</div><!-- row -->';
	$('.content__header').empty();
	$('.content__body').empty().append(html);
    $('input#phone').bind("change keyup input", function() {
        if (this.value.match(/[^0-9+-]/g)) {
            this.value = this.value.replace(/[^0-9+-]/g, '');
        }
    });
    if (response['birthday'] != '0000-00-00') {
    	var birthday = new Date(response['birthday']);
		response['birthday'] = birthday.toLocaleString().substr(0,10);
    } else {
    	response['birthday'] = '';
    }
	// инициализация датапикера
    $("#birthday").datepicker({
    	changeMonth: true,
        changeYear: true,
    	dateFormat : 'dd.mm.yyyy',
        defaultDate: response['birthday']
    });
	$('#name').val(response['name']);
	$('#surname').val(response['surname']);
	$('#email').val(response['email']).prop('disabled',true).addClass('input-disabled');
	$('#phone').val(response['phone']);
	$('#birthday').val(response['birthday']);
	$('#country').val(response['country']);
	$('#city').val(response['city']);
	$('#experience').val(response['exp_forex']);
	(response['get_issues']==1) ? $('#article').prop('checked',true) : $('#article').prop('checked',false); 
	(response['get_news']==1) ? $('#news').prop('checked',true) : $('#news').prop('checked',false); 
	(response['get_refresh']==1) ? $('#upgrade').prop('checked',true) : $('#upgrade').prop('checked',false);
}



// создаем страницу "Мои финансы"
function createMyCash(response)
{
	var active_date = response.shift();
	active_date = new Date(active_date['_active_date']*1000).toLocaleFormat('%d.%m.%y');
	var balance = response.shift();

	//$('.block-kesh-sum').append(active_date['_balance']+' USD');
	var html =  '<div class="row">' +
		          	'<div class="block block-kesh">' +
		            	'<h2 class="block-title">Мои финансы:</h2>' +
			            '<div class="block-kesh-row">' +
			              	'<div class="block-kesh-text">Баланс:</div>' +
			              	'<div>' +
				                '<div class="block-kesh-sum"><span id="myBalance">' + balance['_balance'] +'</span> USD</div>' +
				                '<div class="block-kesh-btn">' +
				                  	'<input type="submit" class="user-info__btn btn-grey" value="ВЫВЕСТИ"  onClick="open_window(\'withdraw-money\');" />' +
				                '</div>' +
			              	'</div>' +
			            '</div>' +
			            '<div class="block-kesh-row">' +
			              	'<div class="block-kesh-text">Лицензия до:</div>' +
				            '<div class="block-kesh-btn">' +
				                '<div class="block-kesh-text">'+active_date+' г.</div>' +
				                '<input type="submit" class="user-info__btn" value="ПРОДЛИТЬ"  onClick="open_window(\'pay-money\');" />' +
				            '</div>' +
			            '</div>' +
			            '<div class="block-kesh-row">' +
				            '<div class="block-kesh-text">Введите промо код:</div>' +
				            '<div class="block-kesh-btn">' +
				                '<input type="text" class="input input-promo-code" id="input_promo_code" minlength="6" maxlength="6" />' +
				                '<input type="submit" id="active_promo_code" class="user-info__btn" value="АКТИВИРОВАТЬ" />' +
				            '</div>' +
			            '</div>' +
		          	'</div>' +
			        '<div class="block block-transaction">' +
			            '<h2 class="block-title">Мои транзакции:</h2>' +
			            '<div class="block-transaction-head">' +
			              	'<p class="bold">Дата</p>' +
			              	'<p class="bold">Тип платежа</p>' +
			             	'<p class="bold">Сумма</p>' +
			            '</div>' +
			        '</div>' +
			    '</div>';
	$('.content__header').empty();
	$('.content__body').empty().append(html);
	var balance = Number();
	if (response.length == 0) {
		$('.block-transaction').append('<p class="no-transaction">Транзакций не найдено!</p>');
	} else {
		$.each(response, function(key, transaction) {
			if (transaction['_request'] == 'withdraw') c = " style='color:red;'>-"; else c = ">";
			var row_transaction =  '<div class="block-transaction-row">' +
						              	'<p class="">'+transaction['_date']+'</p>' +
						              	'<p class="">'+transaction['_payment_type']+'</p>' +
						              	'<p class=""'+c+transaction['_amount'];
			if (transaction['_payment_type'] == "Web Money") row_transaction = row_transaction + ' $</p></div>'; else row_transaction = row_transaction + ' р.</p></div>';
			$('.block-transaction').append(row_transaction);
		});
	}
	$('.input-promo-code').bind('change keyup input click', function() {
        if (this.value.match(/[^0-9]/g)) {
            this.value = this.value.replace(/[^0-9]/g, '');
        }
    });
}


// создаем страницу "Партнерская программа"
function createReferalProgram(response)
{	
	if (response.length!=0) {
		var link_refer = response.shift();               // реферальная ссылка
		var obj_refer = response.shift();
		var regs_refer = obj_refer['_regs_refer'];       // количество регистраций по реферальной ссылке
		var visits_refer = obj_refer['_visits_refer'];   // количество переходов по реферальной ссылке
	 	var randomNumber = getRandom(100,999);
		var html = '<div class="row">' +
			          	'<div style="width:470px;margin-right:20px;">' +
				            '<div class="block block-referal-program">' +
				              	'<h2>Партнерская программа:</h2>' +
					            '<div class="data-final-row">' +
					                '<p>На Ваш счет будет зачисляться 15% от всех платежей, зарегистрировавшихся по этой ссылке пользователей, начиная со второго.</p>' +
					                '<input type="text" id="referal_link" class="input" />' +
					            '</div>' +
				            '</div>' +
			            	'<div class="block block-my-site">' +
			              		'<h2>Мои сайты:</h2>' +
				              	'<div class="data-final-row">' +
					                '<p>Добавьте Ваш сайт, пройдите простую процедуру верификации и получайте 30% со всех платежей пользователей, пришедших с Вашего сайта.</p>' +
					                '<p><span class="bold" style="color:red">Важно!</span> Вы получаете вознаграждение только с платежей тех пользователей, которые перешли на volume-levels.ru с Вашего сайта впервые. Данные о пришедших пользователях хранятся в куках в течении 3-х месяцев.</p>' +
					                '<div id="site_message"></div>' +
					                '<div class="block-add-site">' +
					                  	'<div id="site_wrapper" class="block-row border-bottom">' +
						                    '<p class="bold">Домен сайта</p>' +
						                    '<p class="bold">Статус</p>' +
					                  	'</div>' +
					                    '<div class="block-row border-bottom">' +
						                    '<p>Адрес сайта:</p>' +
						                    '<input type="text" id="site" class="input" />' +
						                    '<input type="submit" id="add_site" class="user-info__btn" value="Добавить" />' +
					                  	'</div>' +
					                '</div>' +
					                '<p>URL адрес Вашего сайта должен быть указан латинскими буквами или цифрами (Например: http://yousite.ru).</p>' +
						            '<p>После добавления сайта создайте текстовый документ с именем домена Вашего сайта (Например: yousite.ru.txt). Содержимым файла должна быть цифра: <span id="random_number" class="bold">'+randomNumber+'</span></p>' +
						            '<p>Добавте файл на сервер в корневую папку Вашего сайта. Затем, нажмите на кнопку "Подтвердить", рядом с указанием домена проверяемого сайта.</p>' +
				              	'</div>' +
				           '</div>' +
				        '</div>' +
			          	'<div class="block block-change-pass">' +
			            	'<h2>Статистика:</h2>' +
				            '<div class="data-final-row">' +
				              	'<div class="data-final-title">' +
				                	'<b style="font-size:16px;padding-bottom:5px;">Общая статистика:</b>' +
				              	'</div>' +
				              	'<div class="data-final-content">' +
					                '<p>Переходов по ссылке:</p>' +
					                '<p id="visits_all"></p>' +
				              	'</div>' +
				              	'<div class="data-final-content">' +
					                '<p>Регистраций:</p>' +
					                '<p id="regs_all"></p>' +
				              	'</div>' +
					            '<div class="data-final-content">' +
					                '<p>Оплат на сумму:</p>' +
					                '<p id="sum_payment_all">-</p>' +
					            '</div>' +
				            '</div>' +
				            '<div class="data-final-row">' +
				              	'<div class="data-final-title">' +
				                	'<b style="font-size:16px;padding-bottom:5px;">Реферальная ссылка:</b>' +
				              	'</div>' +
				              	'<div class="data-final-content">' +
					                '<p>Переходов по ссылке:</p>' +
					                '<p id="visits_refer">'+visits_refer+'</p>' +
				              	'</div>' +
				              	'<div class="data-final-content">' +
					                '<p>Регистраций:</p>' +
					                '<p id="regs_refer">'+regs_refer+'</p>' +
				              	'</div>' +
				              	'<div class="data-final-content">' +
					                '<p>Оплат на сумму:</p>' +
					                '<p id="sum_payment_refer">-</p>' +
					            '</div>' +
				            '</div>' +
				            '<div id="my_site"></div>' +
			          	'</div>' +
			        '</div>';
		$('.content__header').empty();
		$('.content__body').empty().append(html);
		$('#referal_link').val(link_refer).prop('disabled',true).addClass('input-disabled');
		$('input#site').bind("change keyup input", function() {
	        if (this.value.match(/[^a-za-яё0-9.:\/\-]/g)) {
	            this.value = this.value.replace(/[^a-za-яё0-9.:\/\-]/g, '');
	        }
	    });
		var visits_all = 0;
		var regs_all = 0;
		visits_all += Number(visits_refer);
		regs_all += Number(regs_refer);
	    $.each(response, function(key, site) {
			if (site['_status']==1) {
				var html = 	'<div class="data-final-row">' +
								'<div class="data-final-title">' +
				                	'<b style="font-size:16px;padding-bottom:5px;">С сайта '+site['_site']+':</b>' +
				              	'</div>' +
				              	'<div class="data-final-content">' +
					                '<p>Переходов по ссылке:</p>' +
					                '<p id="">'+site['_visits_site']+'</p>' +
				              	'</div>' +
				              	'<div class="data-final-content">' +
					                '<p>Регистраций:</p>' +
					                '<p id="">'+site['_regs_site']+'</p>' +
				              	'</div>' +
				              	'<div class="data-final-content">' +
					                '<p>Оплат на сумму:</p>' +
					                '<p id="">'+site['_sum']+' USD</p>' +
				              	'</div>' +
				            'div';
				$('#my_site').append(html);
				visits_all += Number(site['_visits_site']);
				regs_all += Number(site['_regs_site']);
				var site_wrapper = '<div id="site_wrapper" class="block-row">' +
										'<p>'+site['_site']+'</p>' +
										'<p class="valid">Проверено</p>' +
									'</div>';
				$('#site_wrapper').after(site_wrapper);
			} else {
				var site_wrapper = '<div id="site_wrapper" class="block-row">' +
										'<p>'+site['_site']+'</p>' +
										'<p id="'+site['_site']+'" class="link-color">Проверить</p>' +
									'</div>';
				$('#site_wrapper').after(site_wrapper);
			}
		});
		$('#visits_all').text(visits_all);
		$('#regs_all').text(regs_all);
	}
}