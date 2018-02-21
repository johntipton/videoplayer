<?php
/*
	getclosedcaptions
	@summary 		Grabs closed captions for a particular video
	@required 	embedcode
	@return			JSON-encoded array
*/
include "locale.php";

$embedcode = !empty( $_POST[ "embedcode" ] ) ? $_POST[ "embedcode" ] : $_GET[ "embedcode" ];	
$method = "/v2/assets/" . $embedcode;
$json = $api->sendRequest( "GET", $method );
$obj = array();
$obj[ "closed_captions_url" ] = $json->closed_captions_url;  
echo json_encode( $obj );
?>