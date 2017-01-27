
<?php

	
	require_once "functions.php";	
	// DataTables PHP library
	include( "../libs/datatables/extensions/Editor/php/DataTables.php" );

	// Alias Editor classes so they are easy to use
	use
	    DataTables\Editor,
	    DataTables\Editor\Field,
	    DataTables\Editor\Format,
	    DataTables\Editor\Join,
	    DataTables\Editor\Upload,
	    DataTables\Editor\Validate;

	
 	if (CheckAuth()!=1)
 	{
 		$response["user_not_found"] = '<p>Пользователь не найден!</p>';
 		logout();
 		echo json_encode($response);
    }
    else
    {
		$editor = Editor::inst( $db, 'users' )
		    ->fields(
		        	Field::inst( 'name' ),
			        Field::inst( 'surname' ),
			        Field::inst( 'birthday' ),
			        Field::inst( 'email' ),
			        Field::inst( 'phone' ),
			        Field::inst( 'password' ),
			        Field::inst( 'city' ),
			        Field::inst( 'country' ),
			        Field::inst( 'exp_forex' ),
					Field::inst( 'reg_date' ),
					Field::inst( 'active_date' ),
					Field::inst( 'active' ),
					Field::inst( 'blocked' ),
					Field::inst( 'last_visit' ),
					Field::inst( 'ip' ),
					Field::inst( 'ban_time' ),
					Field::inst( 'fail_count' ),
					Field::inst( 'fail_time' ),
					Field::inst( 'role' ),
					Field::inst( 'refer' ),
					Field::inst( 'get_issues' ),
					Field::inst( 'get_news' ),
					Field::inst( 'get_refresh' ),
					Field::inst( 'use_partner_program' ),
					Field::inst( 'utm_campaign' ),
					Field::inst( 'utm_medium' ),
					Field::inst( 'utm_source' ),
					Field::inst( 'utm_term' )
		    )
		    ->process( $_POST )
		    ->json();


	}

?>