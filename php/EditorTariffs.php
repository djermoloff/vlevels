
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
		$editor = Editor::inst( $db, 'tariffs' )
		    ->fields(
			        Field::inst( '_tariff_name' ),
			        Field::inst( '_id_indicator' )
		    )
		    ->process( $_POST )
		    ->json();


	}

?>