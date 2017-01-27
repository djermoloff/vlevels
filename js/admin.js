// событие готовности ДОМ-дерева
$(document).ready(function() {

    //statisticsOnLoad();
	console.log('ds');

});


function RenderStatistics(data)
{
    // преобразуем из json строку в массив
    var data = JSON.parse(data);
    // юзеры
    var users = data.shift();
    // платежи
    var payments = data.shift();
    // юзеров онлайн
    var users_online = data.shift();
    // оплачено
    var users_donat = data.shift();
    // активировано
    var users_active = data.shift();
    // платежи на текущий месяц
    var payment_month = data.shift();
    // всего зарегистрировано пользователей
    var count_user = 0;
    $.each(users, function( key, user ) {
        count_user++;
    });
    $('#all_reg_users').text(count_user);
    // всего проплаченных пользователей
    $('#all_payment_users').text(users_donat['_count_payment_users']);
    // всего пользователей с активной лицензией
    $('#all_license_users').text(users_active['_count_active_users']);
    // всего платежей в текущем месяце
    $('#all_payment_month').text(payment_month['_count_payment_month']);
    // convert Date from unixtime
    $.each(payments, function( key, payment ) {
        payment['_date'] = convertFromUNIX(payment['_date']);
    });
    // таблица - Последние зарегистрированные пользователи
    var table_last_users = $('#last_registration').DataTable({
        data: users,
        columns: [
            { 'data' : 'id' },
            { 'data' : 'name' },
            { 'data' : 'email' },
            { 'data' : 'phone' }
        ],
        "language": {
            "lengthMenu": "Выводим _MENU_ записей на странице",
            "zeroRecords": "Данных нет",
            "info": "Просмотр страницы _PAGE_ из _PAGES_",
            "infoEmpty": "Пусто",
            "infoFiltered": "(фильтрация по _MAX_ элементам)"
        }
    });
    // таблица - Последние платежи
    var table_last_pay = $('#last_payment').DataTable({
        data: payments,
        columns: [
            { 'data' : '_id' },
            { 'data' : '_date' },
            { 'data' : '_payment_type' },
            { 'data' : '_amount' }
        ],
        "order": [[ 1, "desc" ]],
        "language": {
            "lengthMenu": "Выводим _MENU_ записей на странице",
            "zeroRecords": "Данных нет",
            "info": "Просмотр страницы _PAGE_ из _PAGES_",
            "infoEmpty": "Пусто",
            "infoFiltered": "(фильтрация по _MAX_ элементам)"
        }
    });
    // таблица - Пользователи онлайн
    var table_online_users = $('#users_online').DataTable({
        data: users_online,
        columns: [
            { 'data' : 'id' },
            { 'data' : 'name' },
            { 'data' : 'email' },
            { 'data' : 'phone' }
        ],
        "language": {
            "lengthMenu": "Выводим _MENU_ записей на странице",
            "zeroRecords": "Данных нет",
            "info": "Просмотр страницы _PAGE_ из _PAGES_",
            "infoEmpty": "Пусто",
            "infoFiltered": "(фильтрация по _MAX_ элементам)"
        }
    });

}  // end RenderStatistics


// convert Date from unixtime
function convertFromUNIX(value)
{
    var date = new Date(value*1000);
    return value = date.toLocaleFormat('%y-%m-%d');
}


function RenderStatisticsUsers(data)
{
    // преобразуем из json строку в массив
    var users = JSON.parse(data).shift();
    // convert Date from unixtime
    $.each(users, function( key, user ){
        user['_date'] = convertFromUNIX(user['_date']);
        user['_last_date'] = convertFromUNIX(user['_last_date']);
        user['fail_time'] = convertFromUNIX(user['fail_time']);
        user['active_date'] = convertFromUNIX(user['active_date']);
        user['last_visit'] = convertFromUNIX(user['last_visit']);
        user['reg_date'] = convertFromUNIX(user['reg_date']);
    });
    // редактирование данных в таблице
    var editor = new $.fn.dataTable.Editor({
        ajax:
            {
            edit: {
                type: 'POST',
                url: 'php/Editor.php',
                success: function(data) {
                    location.reload();
                },
                error: function(response) {
                    var reg = /user_not_found/i,
                        text = response.responseText;
                    if(text.search(reg) != 1) {
                        RedirectAuth();
                    }
                }
            },
            remove: {
                type: 'POST',
                url: 'php/Editor.php',
                success: function(data) {
                    location.reload();
                },
                error: function(response) {
                    var reg = /user_not_found/i,
                        text = response.responseText;
                    if(text.search(reg) != 1) {
                        RedirectAuth();
                    }
                }
            }
        },
        table: '#all_users',
        idSrc:  'id',
        fields: [
            { label: 'name', name: 'name' },
            { label: 'surname',  name: 'surname' },
            { label: 'birthday',  name: 'birthday' },
            { label: 'email',  name: 'email' },
            { label: 'phone',  name: 'phone' },
            { label: 'password',  name: 'password' },
            { label: 'city',  name: 'city' },
            { label: 'country',  name: 'country' },
            { label: 'exp_forex',  name: 'exp_forex' },
            { label: 'reg_date',  name: 'reg_date' },
            { label: 'active_date',  name: 'active_date' },
            { label: 'active',  name: 'active' },
            { label: 'last_visit',  name: 'last_visit' },
            { label: 'ip',  name: 'ip' },
            { label: 'ban_time',  name: 'ban_time' },
            { label: 'fail_count',  name: 'fail_count' },
            { label: 'fail_time',  name: 'fail_time' },
            { label: 'role',  name: 'role' },
            { label: 'refer',  name: 'refer' },
            { label: 'get_issues',  name: 'get_issues' },
            { label: 'get_news',  name: 'get_news' },
            { label: 'get_refresh',  name: 'get_refresh' },
            { label: 'use_partner_program',  name: 'use_partner_program' },
            { label: 'utm_campaign',  name: 'utm_campaign' },
            { label: 'utm_medium',  name: 'utm_medium' },
            { label: 'utm_source',  name: 'utm_source' },
            { label: 'utm_term',  name: 'utm_term' },
            { label: 'blocked',  name: 'blocked' }
        ]
    });
    // таблица - Все пользователи
    var table_all_users = $('#all_users').DataTable({
        "scrollX": true,
        dom: "Bfrtip",
        data: users,
        columns: [
            {
                "className":      'details-control',
                "orderable":      false,
                "data":           null,
                "defaultContent": '<i class="fa fa-plus-square"></i>'
            },
            { 
                'className' : 'id-user',
                'data' : 'id' 
            },
            { 'data' : 'name' },
            { 'data' : 'surname' },
            { 'data' : 'birthday' },
            { 'data' : 'email' },
            { 'data' : 'phone' },
            { 'data' : 'password' },
            { 'data' : 'city' },
            { 'data' : 'country' },
            { 'data' : 'exp_forex' },
            { 'data' : 'reg_date' },
            { 'data' : 'active_date' },
            { 'data' : 'active' },
            { 'data' : 'last_visit' },
            { 'data' : 'ip' },
            { 'data' : 'ban_time' },
            { 'data' : 'fail_count' },
            { 'data' : 'fail_time' },
            { 'data' : 'role' },
            { 
                'className' : 'refer-user',
                'data' : 'refer'
            },
            { 'data' : 'get_issues' },
            { 'data' : 'get_news' },
            { 'data' : 'get_refresh' },
            { 'data' : 'use_partner_program' },
            { 'data' : 'utm_campaign' },
            { 'data' : 'utm_medium' },
            { 'data' : 'utm_source' },
            { 'data' : 'utm_term' },
            { 
                'data' : 'blocked',
                'className' : 'blocked'
            },
            {
                "className":      'blocked-user',
                "orderable":      false,
                "data":           null,
                "defaultContent": ''
            }
        ],
        select: true,
        buttons: [
            { extend: 'edit',   editor: editor },
            { extend: 'remove', editor: editor }
        ],
        "language": {
            "lengthMenu": "Выводим _MENU_ записей на странице",
            "zeroRecords": "Данных нет",
            "info": "Просмотр страницы _PAGE_ из _PAGES_",
            "infoEmpty": "Пусто",
            "infoFiltered": "(фильтрация по _MAX_ элементам)"
        }
    });
    // формируем иконки блокировки
    var blockeds = $('#all_users').find('td.blocked');
    $.each(blockeds, function() {
        ($(this).text() == 0) ? $(this).next().html('<i class="fa fa-unlock"></i>') : $(this).next().html('<i class="fa fa-lock"></i>');
    });
    // блокировка пользователя
    $('#all_users').on('click', '.blocked-user', function() {
        var self = $(this);
        var user_id = self.parents('tr').find('.details-control').next().text();
        var blocked_value = self.parents('tr').find('.blocked').text();
        var status = Number();
        (blocked_value == 1) ? status = 0 : status = 1;
        $.ajax({
            url: "php/Admin.php",
            type: "post",
            dataType: "json",
            data: {
                'user_id':user_id,
                'blocked':status
            },
            success: function(response) {
                if (response['success'] == 1) {
                    if (blocked_value == 1) {
                        self.parents('tr').find('.blocked').text('0');
                        self.parents('tr').find('.blocked-user').html('<i class="fa fa-unlock"></i>');
                        alert('Пользователь с id '+user_id+' успешно разблокирован!');
                    } else {
                        self.parents('tr').find('.blocked').text('1');
                        self.parents('tr').find('.blocked-user').html('<i class="fa fa-lock"></i>');
                        alert('Пользователь с id '+user_id+' успешно заблокирован!');
                    }
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
    // Add event listener for opening and closing details
    $('#all_users tbody').on('click', 'td.details-control', function() {
        var tr = $(this).closest('tr');
        var row = table_all_users.row( tr );
        if ( row.child.isShown() ) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            row.child( DTUsersformat(row.data()) ).show();
            tr.addClass('shown');
        }
    });
    // клик по реферу, подсвечиваем реферального юзера
    $('#all_users tbody').on('click', 'td.refer-user', function() {
        // получаем id рефера
        var refer_id = $(this).text();
        $.each($('#all_users tbody tr'), function(key, obj) {
            var user_id = $(this).find('td.id-user').text();
            if (user_id == refer_id) {
                $('#all_users tbody tr').removeClass('selected');
                $(this).addClass('selected');
            }
        });       
    });

} // end RenderStatisticsUsers


/* Formatting function for row details - modify as you need */
function DTUsersformat ( d ) {
    // `d` is the original data object for the row
    return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
                '<tr>'+
                    '<td>Ключ:</td>'+
                    '<td>'+d._key+'</td>'+
                '</tr>'+
                '<tr>'+
                    '<td>Дата:</td>'+
                    '<td>'+d._date+'</td>'+
                '</tr>'+
                '<tr>'+
                    '<td>Последняя дата:</td>'+
                    '<td>'+d._last_date+'</td>'+
                '</tr>'+
                '<tr>'+
                    '<td>IP:</td>'+
                    '<td>'+d._ip+'</td>'+
                '</tr>'+
            '</table>';
} // end DTUsersformat


function RenderStatisticsPayments( data )
{
    // преобразуем из json строку в массив
    var payments = JSON.parse(data);
    // convert Date from unixtime
    $.each(payments, function( key, payment ) {
        payment['_date'] = convertFromUNIX(payment['_date']);
    });
    // таблица - Все пользователи
    var table_all_payments = $('#all_payments').DataTable( {
        dom: "Bfrtip",
        data: payments,
        columns: [
            {
                "className":      'details-control',
                "orderable":      false,
                "data":           null,
                "defaultContent": '<i class="fa fa-plus-square"></i>'
            },
            { 'data' : '_id' },
            { 'data' : '_date' },
            { 'data' : 'email' },
            { 'data' : '_invoce' },
            { 'data' : '_amount' },
            { 'data' : '_executed' }
        ],
        "language": {
            "lengthMenu": "Выводим _MENU_ записей на странице",
            "zeroRecords": "Данных нет",
            "info": "Просмотр страницы _PAGE_ из _PAGES_",
            "infoEmpty": "Пусто",
            "infoFiltered": "(фильтрация по _MAX_ элементам)"
        }
    });

    // Add event listener for opening and closing details
    $('#all_payments tbody').on('click', 'td.details-control', function() {
        var tr = $(this).closest('tr');
        var row = table_all_payments.row( tr );
        if ( row.child.isShown() ) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            row.child( DTPaymentsformat(row.data()) ).show();
            tr.addClass('shown');
        }
    });

} // end RenderStatisticsPayments


/* Formatting function for row details - modify as you need */
function DTPaymentsformat ( d ) {
    // `d` is the original data object for the row
    return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
                '<tr>'+
                    '<td>ID:</td>'+
                    '<td>'+d._id+'</td>'+
                '</tr>'+
                '<tr>'+
                    '<td>ID пользователя:</td>'+
                    '<td>'+d._id_user+'</td>'+
                '</tr>'+
                '<tr>'+
                    '<td>E-mail:</td>'+
                    '<td>'+d.email+'</td>'+
                '</tr>'+
                '<tr>'+
                    '<td>Дата:</td>'+
                    '<td>'+d._date+'</td>'+
                '</tr>'+
                '<tr>'+
                    '<td>Комментарий:</td>'+
                    '<td>'+d._comment+'</td>'+
                '</tr>'+
                '<tr>'+
                    '<td>Invoce:</td>'+
                    '<td>'+d._invoce+'</td>'+
                '</tr>'+
                '<tr>'+
                    '<td>Amount:</td>'+
                    '<td>'+d._amount+'</td>'+
                '</tr>'+
                '<tr>'+
                    '<td>Тип платежа:</td>'+
                    '<td>'+d._payment_type+'</td>'+
                '</tr>'+
                '<tr>'+
                    '<td>Batch:</td>'+
                    '<td>'+d._batch+'</td>'+
                '</tr>'+
                '<tr>'+
                    '<td>Payee:</td>'+
                    '<td>'+d._payee+'</td>'+
                '</tr>'+
                '<tr>'+
                    '<td>Payer:</td>'+
                    '<td>'+d._payer+'</td>'+
                '</tr>'+
                '<tr>'+
                    '<td>Fee:</td>'+
                    '<td>'+d._fee+'</td>'+
                '</tr>'+
                '<tr>'+
                    '<td>Executed:</td>'+
                    '<td>'+d._executed+'</td>'+
                '</tr>'+
                '<tr>'+
                    '<td>Cancel:</td>'+
                    '<td>'+d._cancel+'</td>'+
                '</tr>'+
            '</table>';

} // end DTUsersformat


function RenderTariffs( data )
{
    // преобразуем из json строку в массив
    var tariffs = JSON.parse(data);
    // редактирование данных в таблице
    var editor = new $.fn.dataTable.Editor({
        ajax:
            {
            create: {
                type: 'POST',
                url: 'php/EditorTariffs.php',
                success: function(data) {
                    location.reload();
                },
                error: function(response) {
                    var reg = /user_not_found/i,
                        text = response.responseText;
                    if(text.search(reg) != 1) {
                        RedirectAuth();
                    }
                }
            },
            edit: {
                type: 'POST',
                url: 'php/EditorTariffs.php',
                success: function(data) {
                    location.reload();
                },
                error: function(response) {
                    var reg = /user_not_found/i,
                        text = response.responseText;
                    if(text.search(reg) != 1) {
                        RedirectAuth();
                    }
                }
            },
            remove: {
                type: 'POST',
                url: 'php/EditorTariffs.php',
                success: function(data) {
                    location.reload();
                },
                error: function(response) {
                    var reg = /user_not_found/i,
                        text = response.responseText;
                    if(text.search(reg) != 1) {
                        RedirectAuth();
                    }
                }
            }
        },
        table: '#all_tariffs',
        idSrc:  'id',
        fields: [
            { label: 'name', name: '_tariff_name' },
            { label: 'id_indicator', name: '_id_indicator' },
        ]
    });
    // таблица - Все тарифы
    var table_all_tariffs = $('#all_tariffs').DataTable({
        dom: "Bfrtip",
        data: tariffs,
        columns: [
            {
                "className":      'details-control',
                "orderable":      false,
                "data":           null,
                "defaultContent": '<i class="fa fa-plus-square"></i>'
            },
            { 'data' : 'id' },
            { 'data' : '_tariff_name' },
            { 'data' : '_name' }
        ],
        select: true,
        buttons: [
            { extend: 'create',   editor: editor },
            { extend: 'edit',   editor: editor },
            { extend: 'remove', editor: editor }
        ],
        "language": {
            "lengthMenu": "Выводим _MENU_ записей на странице",
            "zeroRecords": "Данных нет",
            "info": "Просмотр страницы _PAGE_ из _PAGES_",
            "infoEmpty": "Пусто",
            "infoFiltered": "(фильтрация по _MAX_ элементам)"
        }
    });
    // Add event listener for opening and closing details
    $('#all_tariffs tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = table_all_tariffs.row( tr );
 
        if ( row.child.isShown() ) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            row.child( DTTariffsformat(row.data()) ).show();
            tr.addClass('shown');
        }
    });

} // end RenderTariffs


function DTTariffsformat( d )
{
    // `d` is the original data object for the row
    return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
                '<tr>'+
                    '<td>ID индикатора:</td>'+
                    '<td>'+d._id_indicator+'</td>'+
                '</tr>'+
                '<tr>'+
                    '<td>Название индикатора:</td>'+
                    '<td>'+d._name+'</td>'+
                '</tr>'+
            '</table>';
}