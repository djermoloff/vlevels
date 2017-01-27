// триггер на ресайз при загрузке
$(window).on('load', function() {
    $(window).trigger('resize');
});
// прелоудер при загрузке
$(window).on('load', function(){
    $('.loader-inner').fadeOut();
    $('.loader').delay(200).fadeOut('slow');
});
// высота во весь экран при ресайзе
$(window).resize(function(){
    HeightDetect('.heightScreen');
});

// событие готовности ДОМ-дерева
$(document).ready(function() {

    HeightDetect('.heightScreen');

    // скрываем окно вывода сообщений
    $('#alert-message').addClass('hidden');
    $('#data_error').addClass('hidden');
    $('.message').addClass('hidden');

    // скрываем меню юзера
    $('.user-menu').addClass('hidden');
    // клик по меню юзера: показать/скрыть меню
    $('.user-info__name').on('click', function() {
        $('.user-menu').toggleClass('hidden');
    });
    // скрываем меню юзера при клике вне его
    // $('.menu-items, .main-row').on('click', function(e) {
    //     e.stopPropagation();
    //     $('.user-menu').addClass('hidden');
    // });


    // вешаем триггер к пунктам в сайдбаре
    $('.user-menu a').on('click', function() {
        var link_sidebar = $(this).attr('href');
        $(link_sidebar).trigger('click');
    });

    //roamingUserMenu();


// роуатинг при навигации в пользовательском меню
function roamingUserMenu()
{
    var url = window.location.href.slice(window.location.href.indexOf('?')).split(/[&?]{1}[\w\d]+=/);
    console.log(url);
}

    // в breadcrumbs, при наведении на ссылку, подсвечить иконку справа
    $('.breadcrumbs__item a').mouseenter(function() {
        $(this).next().css({
            'color' : 'rgb(0,0,0)'
        });
    }).mouseleave(function() {
        $(this).next().css({
            'color' : 'rgb(160,160,160)'
        });
    });

    // при наведении на имя пользователя или стрелочку, подсвечить иконку
    $('.user-info__name').mouseenter(function() {
        $(this).find('i').css({
            'color' : 'rgb(0,0,0)'
        });
    }).mouseleave(function() {
        $(this).find('i').css({
            'color' : 'rgb(160,160,160)'
        });
    });

    // при клике по календарю открываем датапикер
    $('body').on('click', '.fa-calendar', function() {
        $(this).toggleClass('iconHover');
        $(this).parent().find('input').datepicker('show');
    });


    // при клике по "Продлить" в шапке
    $('#extend_account').on('click', function(e) {
        e.preventDefault();

        $('#alert-message').empty().append('Продлить лицензию').removeClass('hidden');
    });


    // настройка датапикера
    $.datepicker.regional['ru'] = {
        closeText: 'Завершить',
        prevText: 'Предыдущий месяц',
        nextText: 'Следующий месяц',
        currentText: 'Сегодня',
        monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        monthNamesShort: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        dayNames: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
        dayNamesShort: ['вск', 'пнд', 'втр', 'срд', 'чтв', 'птн', 'сбт'],
        dayNamesMin: ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб', ],
        weekHeader: 'Нед',
        dateFormat: 'dd.mm.yy',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ''
    };

    // установка дефолтных значений датапикера
    $.datepicker.setDefaults($.datepicker.regional['ru']);

    // валидация имени пользователя
    jQuery.validator.addMethod("user_name", function(value, element) {
        return this.optional( element ) || /[a-zA-Zа-яА-Я0-9._-]+/.test( value );
    }, 'Введите корректное имя!');

    // валидация электронной почты пользователя
    jQuery.validator.addMethod("email", function(value, element) {
        return this.optional( element ) || /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test( value );
    }, 'Введите корректный email адрес!');

    // валидация пароля пользователя
    jQuery.validator.addMethod("password", function(value, element) {
        return this.optional( element ) || /[a-zA-Z0-9_]{6,50}/.test( value );
    }, 'Введите корректный пароль от 6 до 50 символов!');

    // валидация формы регистрации
    $('#registr_form_first').validate({
        rules: {
            'user_name': {
                required: true
            },
            'email': {
                required: true,
                email: true
            },
            'password': {
                required: true
            }
       },
       messages: {
            'user_name': {
                required: "Введите имя!"
            },
            'email': {
                required: "Введите email!"
            },
            'password': {
                required: "Введите пароль!",
            }
        },
        errorClass: "invalid",
        errorElement: "p",
        submitHandler: function() {
            RegistrationFirstStep();  // отправляем имя и почту
        }
    });

    // обработка второго шага регистрации
    $('body').on('click', '#regSecondStep', function(e) {
        e.preventDefault();
        RegistrationSecondStep();  // отправляем регистрационный код
    });

    // обработка третьего шага регистрации
    $('body').on('click', '#regLastStep', function(e) {
        e.preventDefault();
        RegistrationLastStep();  // отправляем пароль и подтверждение пароля
    });

    // валидация формы авторизации
    $("#auth_form").validate({
       rules: {
            email: {
                required: true,
                email: true
            },
            password: {
                required: true
            }
       },
       messages: {
            email: {
                required: "Введите email!"
            },
            password: {
                required: "Введите пароль!",
            }
        },
        errorClass: "invalid",
        errorElement: "p",
        submitHandler: function() {
            Auth();  // отправляем запрос на авторизацию
        }
    });

    // обрабатываем клик по крестику
    $('body').on('click', '.btn-close', function() {
        $('#alert-message').addClass('hidden');
        $(this).parents('.popup-form').empty();
    });

    // разрешаем вводить только цифры
    $('input.input-number').bind("change keyup input click", function() {
        if (this.value.match(/[^0-9.]/g)) {
            this.value = this.value.replace(/[^0-9.]/g, '');
        }
    });
    // $('.input-promo-code').bind('change keyup input click', function() {
    //     if (this.value.match(/[^0-9]/g)) {
    //         this.value = this.value.replace(/[^0-9]/g, '');
    //     }
    // });

    
    // выход из под учетной записи
    $('#logout').on('click',function() {
        var logout = $(this).attr('id');
        $.ajax({
            url: "php/Information.php",
            type: "post",
            dataType: "json",
            data: {
                'logout' : logout
            },
            beforeSend: function()
            {
                // $('.support-container').append(preloading);
                // $('#preloading').addClass('loading');
            },
            success: function(response) {
                if (response['success'] || response['user_not_found']) {
                    window.location = "http://vlevels.ru";
                }
            },
            error: function(response) {
                console.log(response);
                var reg = /user_not_found/i,
                    text = response.responseText;
                if(text.search(reg) != 1) {
                    window.location = "http://vlevels.ru";
                }
            },
            complete: function() {
                // $('#preloading').removeClass('loading');
            }
        });
        return false;
    });

    // валидация электронной почты пользователя
    jQuery.validator.addMethod("email_recovery", function(value, element) {
        return this.optional( element ) || /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test( value );
    }, 'Введите корректный email адрес!');

    // валидация формы восстановления пароля - первый шаг
    $("#recovery_form").validate({
       rules: {
            email_recovery: {
                required: true,
                email: true
            }
       },
       messages: {
            email_recovery: {
                required: "Введите email!"
            }
        },
        errorClass: "invalid",
        errorElement: "p",
        submitHandler: function() {
            RecoveryFirstStep();  // отправляем запрос на восстановление пароля
        }
    });

    // валидация пароля пользователя
    jQuery.validator.addMethod("newPass", function(value, element) {
        return this.optional( element ) || /[a-zA-Z0-9_]{6,50}/.test( value );
    }, 'Введите корректный пароль от 6 до 50 символов!');

    // валидация пароля пользователя
    jQuery.validator.addMethod("newRePass", function(value, element) {
        return this.optional( element ) || /[a-zA-Z0-9_]{6,50}/.test( value );
    }, 'Введите корректный пароль от 6 до 50 символов!');
    
    // валидация формы восстановления пароля - второй шаг
    $("#recovery2_form").validate({
       rules: {
            newPass: {
                required: true
            },
            newRePass: {
                required: true
            }
       },
       messages: {
            newPass: {
                required: "Введите пароль!"
            },
            newRePass: {
                required: "Повторите пароль!"
            }
        },
        errorClass: "invalid",
        errorElement: "p",
        submitHandler: function() {
            RecoverySecondStep();  // отправляем запрос на восстановление пароля
        }
    });

    // повторная отправка регистрационного кода
    $('body').on('click', '#linkSendMessage', function(e) {
        e.preventDefault();

        var message = $('#message_repeat');
        var error_message = $('#error_message');
		
		message.empty();
        message.append('<strong style="color:Orange;">отправляется</strong>');
		
        error_message.empty().hide();

        $.ajax({
            url: "php/RepeatSendMessage.php",
            type: "get",
			dataType: "json",
            success: function(response) {
                if (response['success'] == 1) {
                    message.empty();
                    message.append('<strong style="color:Green;">успешно отправлен</strong>');
                }
                if (response['error'] == 0) {
                    error_message.removeClass('hidden');
                    error_message.append('Ошибка при отправке регистрационного кода!');
                }
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

}); // end DOM ready


/*
    ИСМЕНЕНИЕ ФОРМАТА ДАТЫ
*/
Date.prototype.toLocaleFormat = function(format) {
    var f = {y : this.getYear() + 1900,m : this.getMonth() + 1,d : this.getDate(),H : this.getHours(),M : this.getMinutes(),S : this.getSeconds()}
    for(k in f)
        format = format.replace('%' + k, f[k] < 10 ? "0" + f[k] : f[k]);
    return format;
};


/*
    ГЕНЕРИРУЕМ РАНДОМНОЕ ЧИСЛО
*/
function getRandom(min, max)
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


/*
    СКРЫВАЕМ СООБЩЕНИЯ ОБ ОШИБКАХ
*/
function HideError() {
    $('#error_name').empty().addClass('hidden');
    $('#error_email').empty().addClass('hidden');
    $('#error_reg_code').empty().addClass('hidden');
    $('#error_rePass').empty().addClass('hidden');
    $('#message').empty().addClass('hidden');
    $('#error_message').empty().addClass('hidden');
    $('#alert_message').empty().addClass('hidden');
}

/*
    ПЕРВЫЙ ШАГ РЕГИСТРАЦИИ
*/
function RegistrationFirstStep() {
    var name = $('#user_name').val();
    var email = $('#email').val();
    var privacy_policy = $('#privacy_policy').is(':checked');
    var promo_code = $('#promo_code').val();
		
    var error_name = $('#error_name');
    var error_email = $('#error_email');
    var error_message = $('#error_message');

    $.ajax({
        url: "php/RegFirstStep.php",
        type: "post",
       dataType: "json",
        data: {
            "name" : name,
            "email" : email,
            "privacy_policy" : privacy_policy,
            "promo_code" : promo_code
        },
        beforeSend: function() {
            HideError();
            $('#registr_form_first').addClass('hidden');
            $('#preloading').addClass('loading');
        },
        success: function(response) {
            // ошибка name
            if (response["privacy_policy"] == 1) {
                $('#registr_form_first').removeClass('hidden');
                error_message.empty().removeClass('hidden').append('Ознакомьтесь с пользовательским соглашением!');
            }
			if (response["name"] == -1) {
                $('#registr_form_first').removeClass('hidden');
                error_message.empty().removeClass('hidden').append('Недопустимое имя!');
            }
            // ошибка e-mail
            if (response["email"] == -1) {
                $('#registr_form_first').removeClass('hidden');
                error_message.empty().removeClass('hidden').append('Недопустимый E-mail!');
            } else if (response["email"] == 0) {
                $('#registr_form_first').removeClass('hidden');
                error_message.empty().removeClass('hidden').append('E-mail уже существует!');
            }
            // ошибка promo code
            if (response["promo_code"] == -1) {
                $('#registr_form_first').removeClass('hidden');
                error_message.empty().removeClass('hidden').append('Недопустимый промо код!');
            } else if (response["promo_code"] == 0) {
                $('#registr_form_first').removeClass('hidden');
                error_message.empty().removeClass('hidden').append('Промо код не найден!');
            } else if (response["promo_code"] == -2) {
                $('#registr_form_first').removeClass('hidden');
                error_message.empty().removeClass('hidden').append('Промо код просрочен!');
            } else if (response["promo_code"] == -3) {
                $('#registr_form_first').removeClass('hidden');
                error_message.empty().removeClass('hidden').append('У промо кода 0 активаций!');
            }
            // успешный запрос
            if (response["success"]) {
                $('.progress-bar__step:nth-child(1)').removeClass('progress-bar__step--active');
                $('.progress-bar__step:nth-child(2)').addClass('progress-bar__step--active');
                $('#registr_form_first').remove();
                $('.form__body').append(response["success"]);
            }
        },
        error: function(response) {alert("Error. Inform the administrator.");
            var reg = /user_not_found/i,
                text = response.responseText;
            if(text.search(reg) != 1) {
                RedirectAuth();
            }
        },
        complete: function() {
            $('#preloading').removeClass('loading');
        }
    });
    return false;
}

/*
    ВТОРОЙ ШАГ РЕГИСТРАЦИИ
*/
function RegistrationSecondStep() {
    var reg_code = $('#reg_code').val();
    var error_message = $('#error_message');

    $.ajax({
        url: "php/RegSecondStep.php",
        type: "post",
        dataType: "json",
        data: {
            "reg_code" : reg_code
        },
        beforeSend: function() {
            HideError();
            $('#registr_form_second').addClass('hidden');
            $('#preloading').addClass('loading');
        },
        success: function(response) {
            // ошибка check code
            if (response["check_code"] == -1) {
                $('#registr_form_second').removeClass('hidden');
                error_message.empty().removeClass('hidden').append('Неверный регистрационный код!');
            }
            // успешный запрос
            if (response["success"]) {
                $('.progress-bar__step:nth-child(2)').removeClass('progress-bar__step--active');
                $('.progress-bar__step:nth-child(3)').addClass('progress-bar__step--active');
                $('#registr_form_second').remove();
                $('.form__body').append(response["success"]);
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
            $('#preloading').removeClass('loading');
        }
    });
    return false;
}

/*
    ТРЕТИЙ ШАГ РЕГИСТРАЦИИ
*/
function RegistrationLastStep() {
    var pass = $('#pass').val(),
        rePass = $('#rePass').val(),
        message = $('#message'),
        error_message = $('#error_message');

    var error_pass = $('#error_pass'),
        error_rePass = $('#error_rePass');

    $.ajax({
        url: "php/RegLastStep.php",
        type: "post",
        dataType: "json",
        data: {
            "pass" : pass,
            "rePass": rePass
        },
        beforeSend: function() {
            HideError();
            $('#registr_form_last').addClass('hidden');
            $('#preloading').addClass('loading');
        },
        success: function(response) {
            // ошибка email
            if (response['email'] == 0) {
                $('#registr_form_last').removeClass('hidden');
                error_message.empty().removeClass('hidden').append('E-mail не найден!');
            }
            // ошибка password
            if (response['pass'] == -1) {
                $('#registr_form_last').removeClass('hidden');
                error_pass.empty().removeClass('hidden').append('Пароль содержит недопустимые символы!');
            } else if (response['pass'] == 0) {
                $('#registr_form_last').removeClass('hidden');
                error_rePass.empty().removeClass('hidden').append('Пароли не совпадают!');
            }
            // ошибка session
            if (response['session'] == 0) {
                $('#registr_form_last').removeClass('hidden');
                error_message.empty().removeClass('hidden').append('Сессия не найдена!');
            }
            // успешный запрос
            if (response['success'] == 1) {
                $('#registr_form_last').remove();
                message.append('<p class="center">Спасибо за регистрацию!</p>');
                message.append('<p class="center">Через несколько секунд Вы будете автоматически перенаправлены на страницу личного кабинета, если Вы не хотите ждать, <a onclick="RedirectLK();return false" class="form__link">нажмите по ссылке</a></p>');
                message.removeClass('hidden');
                setTimeout(function(){
                    window.location = "index.php";
                }, 8000);
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
            $('#preloading').removeClass('loading');
        }
    });
    return false;
}


/*
    РЕДИРЕКТ В ЛИЧНЫЙ КАБИНЕТ
*/
function RedirectLK() {
    window.location = "index.php";
}
/*
    РЕДИРЕКТ НА СТРАНИЦУ АВТОРИЗАЦИИ
*/
function RedirectAuth() {
    window.location = "auth.php";
}


/*
    АВТОРИЗАЦИЯ
*/
function Auth() {
    var email = $('#email').val(),
        pass = $('#password').val();
        message = $('#message'),
        error_message = $('#error_message');

    $.ajax({
        url: "php/Authorization.php",
        type: "post",
        dataType: "json",
        data: {
            "email" : email,
            "pass": pass
        },
        beforeSend: function() {
            HideError();
        },
        success: function(response) {
            // определяем админ или пользователь
            if (response['success'] == 0) {
                window.location = "index.php";
            } else if (response['success'] == 1) {
                window.location = "admin.php";
            }
            // пользователь заблокирован администратором
            if (response['blocked']==1) {
                error_message.removeClass('hidden').append('Пользователь заблокирован администратором!');
            }
            // неверное сочитание данных
            if (response['exist']==0) {
                error_message.removeClass('hidden').append('Такое сочетание e-mail и пароля не найдено!');
            }
            // бан за попытку брутфорса
            if (response['ban']==1) {
                error_message.removeClass('hidden').append('Вы ввели неверные данные 5 раз, поэтому Ваш аккаунт заблокирован на 15 минут!');
            }
        },
        error: function(response) {
            var reg = /user_not_found/i,
                text = response.responseText;
            if(text.search(reg) != 1) {
                RedirectAuth();
            }
        },
    });
    return false;
}

/*
    ПЕРВЫЙ ШАГ ВОССТАНОВЛЕНИЯ ПАРОЛЯ
*/
function RecoveryFirstStep() {
    var email = $('input[name=email_recovery]').val();

    var error_email = $('#error_email'),
        message = $('#message'),
        error_message = $('#error_message');

    $.ajax({
        url: "php/RecoveryFirstStep.php",
        type: "post",
        dataType: "json",
        data: {
            "email" : email
        },
        beforeSend: function() {
            HideError();
            $('#recovery_form').addClass('hidden');
            $('#preloading').addClass('loading');
        },
        success: function(response) {
            if (response['exist']==0) {
                $('#recovery_form').removeClass('hidden');
                error_message.removeClass('hidden');
                error_message.append('E-mail не найден!');
            }

            if (response['success']) {
                $('#recovery_form').remove();
                message.removeClass('hidden');
                message.append(response['success']);
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
            $('#preloading').removeClass('loading');
        }
    });
    return false;
}

/*
    ВТОРОЙ ШАГ ВОССТАНОВЛЕНИЯ ПАРОЛЯ
*/
function RecoverySecondStep() {
    var newPass = $('input[name=newPass]').val(),
        newRePass = $('input[name=newRePass]').val();

    var message = $('#message'),
        error_message = $('#error_message');

    $.ajax({
        url: "php/RecoverySecondStep.php",
        type: "post",
        dataType: "json",
        data: {
            "newPass" : newPass,
            "newRePass" : newRePass
        },
        beforeSend: function() {
            HideError();
            $('#recovery2_form').addClass('hidden');
            $('#preloading').addClass('loading');
        },
        success: function(response) {
            if (response['ban']) {
                $('#recovery2_form').removeClass('hidden');
                error_message.removeClass('hidden');
                error_message.append('Вы ввели неверные данные 5 раз, поэтому ваш аккаунт забанен на 15 минут!');
            }

            if (response['newPass'] == 0) {
                $('#recovery2_form').removeClass('hidden');
                error_message.removeClass('hidden');
                error_message.append('Пароли не совпадают!');
            } else if (response['newPass'] == -1) {
                $('#recovery2_form').removeClass('hidden');
                error_message.removeClass('hidden');
                error_message.append('Недопустимый новый пароль!');
            }

            if (response['oldPass']) {
                $('#recovery2_form').removeClass('hidden');
                error_message.removeClass('hidden');
                error_message.append('Неверный старый пароль!');
            }

            if (response['user']) {
                $('#recovery2_form').removeClass('hidden');
                error_message.removeClass('hidden');
                error_message.append('Пользователь не найден!');
            }

            if (response['session']) {
                $('#recovery2_form').removeClass('hidden');
                error_message.removeClass('hidden');
                error_message.append('Сессия не найдена!');
            }

            if (response['success']) {
                $('#recovery2_form').remove();
                message.append(response['success']);
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
            $('#preloading').removeClass('loading');
        }
    });
    return false;
}


/*
    БЛОК В ВЫСОТУ ЭКРАНА
*/
function HeightDetect(arg) {
    $(arg).css('height', $(window).height());
}

/*
	Получаем параметры GET из строки запроса
*/

function parseGetParams() { 
   var $_GET = {}; 
   var __GET = window.location.search.substring(1).split("&"); 
   for(var i=0; i<__GET.length; i++) { 
      var getVar = __GET[i].split("="); 
      $_GET[getVar[0]] = typeof(getVar[1])=="undefined" ? "" : getVar[1]; 
   } 
   return $_GET; 
} 

/*
	Открываем вкладку $_GET['tab']
*/


/*
    ПОВТОРНАЯ ОТПРАВКА РЕГИСТРАЦИОННОГО КОДА
*/
// function LinkSendMessage() {
//     var message = $('#message');
//     var error_message = $('#error_message');

//     message.empty().hide();
//     error_message.empty().hide();

//     $.ajax({
//         url: "php/RepeatSendMessage.php",
//         type: "get",
//         success: function(response) {
//             if (response['success'] = 1) {
//                 message.show();
//                 message.append('Регистрационный код успешно отправлен!');
//             }
//             if (response['error'] = 0) {
//                 error_message.show();
//                 error_message.append('Ошибка при отправке регистрационного кода!');
//             }
//         },
//         error: function(response) {
//             error_message.show();
//             error_message.append(response);
//         }
//     });
//     return false;
// }


// Мои скрипты
	function open_select ()
		{
		var select = document.getElementById('payments');
		if (select.style.height == "0px" || select.style.height == "") 
			{
			$("#payments").animate({height:"120px"},150);
			select.style.display = "inline";
			}
			else 
			{
			$("#payments").animate({height:"0px"},150, function () {select.style.display = "none";});
			}
		}
					
	function selected (a)
		{
		var type = document.getElementById('type');
		var name = "#p-"+a;
		var htmlStr = $(name).html()+"<img class='dd-selected-pointer' src='img/select-pointer.png'>";
		$("#index-payment").empty();
		$("#index-payment").append(htmlStr);
		type.value = a;
					
		var select = document.getElementById('payments');
		select.style.display = "none";
		select.style.height = "0px";
		}
	
	function close_window(n)
		{
		var w = document.getElementById(n);
		w.style.display = "none";
		}
		
	function open_window(n)
		{
		var w = document.getElementById(n);
		w.style.display = "block";
		}
		
	function orderWithdraw($max)
		{
		var type = document.getElementById('w-type');
		var payee = document.getElementById('w-payee');
		var amount = document.getElementById('w-amount');
		var info = $('#w-info');
		var button = $('#w-button');

		if (amount.value == '' || amount.value <= 0) { info.empty().append("Введите сумму перевода."); return(0); }
		if (amount.value > $max) { info.empty().append("Неверная сумма!"); return(0); }
		if (payee.value == '') { info.empty().append("Введите кошелек получателя перевода."); return(0); }
		
		info.empty().append("<span style='color:Orange;'>Отправка запроса...</span>");
		button.prop("disabled", true);
		
		$.ajax({
	            url: "handler/withdraw.php",
	            type: "post",
	            dataType: "json",
	            data: { 'type' : type.value, 'payee' : payee.value, 'amount' : amount.value },
	            success: function(html) {
					$('#myBalance').empty().append(html.new_balance);	
					pay = '<div class="block-transaction-row"><p>'+html.date+'</p><p>'+html.type+'</p><p style="color:red;">-'+html.amount+' $</p></div>';
					$('.block-transaction').append(pay);
					info.empty().append("<span style='color:#32C34C;'>Заявка отправлена. Дождитесь обработки перевода.</span>");
					setTimeout( function() { close_window('withdraw-money') }, 3000);
				}
	        });
		}

