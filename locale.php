 <?PHP
	error_reporting(E_ALL);
	
	include "OoyalaApi.php";
 	
	// toggle for player platform // html5-priority or html5-fallback
	$playerPlatform = "html5-priority";
	
	if( isset( $_GET[ "platform" ] ) )
	{
		$playerPlatform = "html5-fallback";
	}
	
	include "Translation.php";
	
	// COUNTRY
	// validate
	if( isset( $_GET["c"] ) )
	{
		$country = validateCountry( $_GET["c"] );
	}
	elseif( isset( $_POST["c"] ) )
	{
		$country = validateCountry( $_POST["c"] );
	}
	else
	{
		$country = "us";
	}
	//echo $country;
	// LANGUAGE
	if( isset( $_GET["l"] ) )
	{
		$language = validateLanguage( $_GET["l"] );
	}
	elseif( isset( $_POST["l"] ) )
	{
		$language = validateLanguage( $_POST["l"] );
	}
	else
	{
		$language = "en";
	}
	// SEGMENT
	if( isset( $_GET["s"] ) )
	{
		$segment = validateSegment( $_GET["s"] );
	}
	elseif( isset( $_POST["s"] ) )
	{
		$segment = validateSegment( $_POST["s"] );
	}
	else
	{
		$segment = "master";
	}
	// CUSTOMER SET
	if( isset( $_GET["cs"] ) )
	{
		$customerSet = validateCustomerSet( $_GET["cs"] );
	}
	elseif( isset( $_POST["cs"] ) )
	{
		$customerSet = validateCustomerSet( $_POST["cs"] );
	}
	else
	{
		$customerSet = "19";
	}
	// PLATFORM
	if( isset( $_GET["p"] ) )
	{
		$platform = $_GET["p"];
	}
	elseif( isset( $_POST["p"] ) )
	{
		$platform = $_POST["p"];
	}
	else
	{
		$platform = "learn";
	}
	// CATEGORY ID
	if( isset( $_GET["category"] ) )
	{
		$category_id = $_GET["category"];
	}
	elseif( isset( $_POST["category"] ) )
	{
		$category_id = $_POST["category"];
	}
	else
	{
		$category_id = "";
	}
	// SEARCH TERM
	if( isset( $_GET["search"] ) )
	{
		$search_term = $_GET["search"];
	}
	elseif( isset( $_POST["search"] ) )
	{
		$search_term = $_POST["search"];
	}
	else
	{
		$search_term = "";
	}
	
	// brand filter
	if( isset( $_GET[ "brand" ] ) )
	{
		$brand =  $_GET[ "brand" ];
	}
	else if( isset( $_PUT[ "brand" ] ) )
	{
		$brand =  $_PUT[ "brand" ];
	}
	else
	{
		$brand = "";
	}
	
	if( isset( $_GET[ "account" ] ) )
	{
		$account = $_GET[ "account" ];
	}
	else if( isset( $_PUT[ "account" ] ) )
	{
		$account = $_PUT[ "account" ];
	}
	else
	{
		$account = "";
	}
	
	
	$category_title = "";
	$category_keyword = "";
	
	$debug = isset( $_GET["debug"] ) ? $_GET["debug"] : ""; // looking for 'true'
	//segment:bsd, platform:support, category:all
	
	$layout = isset( $_GET["layout"] ) ? $_GET["layout"] : ""; // "" or "chromeless"
	
	$labelSegment = "";
	$locale = $language . "_" . $country;
	$locale_all = $language . "_all";
	$ooyala_account = "consumer";
	//$ooyala_playerid = "NzMyN2E4MzA4Y2ZiMzYwNjhiYzgzYzQ4"; // jt opf test
	$ooyala_playerid = "NzI5Mjk2NjM2MGZlN2E4NmUwNTRiNDNm"; // default
	//$ooyala_playerid = "e431ec171eb84f998004fd1920418f4f"; No Share
	
	// segments
	switch( $segment )
	{
		case "dhs":
			$labelSegment = "Home %26 Home Office";
			$ooyala_account = "consumer";
			$ooyala_playerid = "NzI5Mjk2NjM2MGZlN2E4NmUwNTRiNDNm";
			$customerSet = "19";
			break;
		case "soho":
			$labelSegment = "Small Business (1-9 employees)";
			$ooyala_account = "commercial";
			$ooyala_playerid = "NzMyN2E4MzA4Y2ZiMzYwNjhiYzgzYzQ4";
			$customerSet = "04";
			break;
		case "bsd":
			if( $platform == "support" )
			{
				$labelSegment = "Small and Medium Business";
			}
			else
			{
				$labelSegment = "Small And Medium Business";
			}
			$ooyala_account = "commercial";
			$ooyala_playerid = "NzMyN2E4MzA4Y2ZiMzYwNjhiYzgzYzQ4";
			$customerSet = "04";
			break;
		case "k12":
			$labelSegment = "K-12 Education";
			$ooyala_account = "commercial";
			$ooyala_playerid = "NzMyN2E4MzA4Y2ZiMzYwNjhiYzgzYzQ4";
			$customerSet = "04";
			break;
		case "hied":
			$labelSegment = "Higher Education Institutions";
			$ooyala_account = "commercial";
			$ooyala_playerid = "NzMyN2E4MzA4Y2ZiMzYwNjhiYzgzYzQ4";
			break;
		case "slg":
			$labelSegment = "State & Local Government";
			$ooyala_account = "commercial";
			$ooyala_playerid = "NzMyN2E4MzA4Y2ZiMzYwNjhiYzgzYzQ4";
			$customerSet = "04";
			break;
		case "fed":
			$labelSegment = "Federal Government";
			$ooyala_account = "commercial";
			$ooyala_playerid = "NzMyN2E4MzA4Y2ZiMzYwNjhiYzgzYzQ4";
			break;
		case "hea":
			$labelSegment = "Healthcare";
			$ooyala_account = "commercial";
			$ooyala_playerid = "NzMyN2E4MzA4Y2ZiMzYwNjhiYzgzYzQ4";
			break;
		case "epp":
			$labelSegment = "Americas Transaction Group";
			$ooyala_account = "commercial";
			$ooyala_playerid = "NzMyN2E4MzA4Y2ZiMzYwNjhiYzgzYzQ4";
			break;
		case "biz":
			$labelSegment = "Large Business";
			$ooyala_account = "commercial";
			$ooyala_playerid = "NzMyN2E4MzA4Y2ZiMzYwNjhiYzgzYzQ4";
			break;
		case "dev":
			$labelSegment = "Internal";
			$ooyala_account = "dev";
			$ooyala_playerid = "NzMyN2E4MzA4Y2ZiMzYwNjhiYzgzYzQ4";
			break;
		case "master":
			$labelSegment = "Master";
			$ooyala_account = "master";
			$ooyala_playerid = "ZGJiMzI3NjIwMDUxN2I5YjVkMGUzMDAx";
			break;	
	}
	
	// ====================================================
	// Choose platform
	// ====================================================
	switch( $platform )
	{
		case "support":
			$ooyala_account = "esupport";
			$ooyala_playerid = "NzMyN2E4MzA4Y2ZiMzYwNjhiYzgzYzQ4";
			break;
		case "software":
			$ooyala_account = "software";
			$ooyala_playerid = "9eba220ad98c47cda9fdf6ba82ce607a";
			break;
	}
	
	// ====================================================
	// Choose acct
	// ====================================================
	if( $account != "" )
	{
		$ooyala_account = $account;
	}
	switch( $ooyala_account )
	{
		case "consumer":
			/*$key = "poc2U6fYb4O9fkMrOrsuaoxDiL7M.tjv52";		
			$secret = "KtfCq7UhO1kl7age_XqlxQRefLOwq94k3R-Ny-mm";*/
			$key = "poc2U6fYb4O9fkMrOrsuaoxDiL7M.Po3ys";		
			$secret = "AmD7EjgfUIYDVmYLN4QvqFLHFuIEqIgMWDru6ECJ";
			break;
		case "commercial":
			$key = "hkbWU6HO4gNeeBDjmW_B7GEsmwzB.RdMfP";
			$secret = "mTtHQ0oJpwjzfN1Duy_pkyvTQqwyCVuor48nOKc1";
			break;
		case "esupport":
			/*$key = "5nc2U6qKXZq9PbE57MANJWXPj_QQ.l9aV1";
			$secret = "wsbKiFp3px1h3FqP8QwQF6G4mUBQjiximG8wGLxb";*/
			$key = "5nc2U6qKXZq9PbE57MANJWXPj_QQ.fvySB";
			$secret = "2cUh7bHYWgKH-c8Xaf_XUeSi2rmQiJ8ZkhVamEoY";
			break;
		case "software":
			$key = "Vwd3MxOtnYiE9LQt4HXsOOybvqgE.-wk0A";
			$secret = "GOzOq6a29qpiWi64JcbSTUjg4HNS7dUX-EiHn28L";
			break;
		case "master":
			$key = "RvYmY6hur13N6wMKKnX_HgCa0VEU.5T4Iy";
			$secret = "DKuXgba6hjGxyXhQ-daLlvHx4NQLIHhUuDsFmg2Q";
			break;	
		case "dev":
			$key = "Jqc2U6PraM7Pay6Gu09lnoaX5_e3.vCrPk";
			$secret = "K0sTGV5I2n-LrHIPM4Dq0GCivUGw0OoJNyfEBwJw";
			break; 									
	}
	
	// ====================================================
	// Do some translations
	// We'll make this better later
	// ====================================================
	
	// load the translation file
	try
	{
		$translationObject = new Translation( $language, $country );
		$currentTranslation = $translationObject->getCurrentTranslations();
	}
	catch( Exception $e )
	{
		throw new Exception( "translation error" );
	}
	
	define( "VIDEO_GALLERY", $currentTranslation["video_gallery"] );
	define( "FILTER_BY", $currentTranslation["filter_by"] );
	define( "FOR_HOME", $currentTranslation["for_home"] );
	define( "FOR_WORK", $currentTranslation["for_work"] );
	define( "FOR_SUPPORT", $currentTranslation["for_support"] );
	define( "TRENDING_INTRO", $currentTranslation["trending_intro"] );
	define( "SEARCH_TERM", $currentTranslation["search_term"] );
	define( "SUPPORT", $currentTranslation["support"] );
	define( "PRIVACY", $currentTranslation["privacy"] );
	define( "TERMS", $currentTranslation["terms"] );
	define( "LAPTOPS", $currentTranslation["laptops"] );
	define( "ULTRABOOKS", $currentTranslation["ultrabooks"] );
	define( "ALIENWARE", $currentTranslation["alienware"] );
	define( "DESKTOPS", $currentTranslation["desktops"] );
	define( "ALL_IN_ONES", $currentTranslation["all-in-ones"] );
	define( "SERVERS", $currentTranslation["servers"] );
	define( "NETWORKING", $currentTranslation["networking"] );
	define( "STORAGE", $currentTranslation["storage"] );
	define( "SOLUTIONS", $currentTranslation["solutions"] );
	define( "SERVICES", $currentTranslation["services"] );	
	
	switch( $category_id )
	{
		case "laptop":
			$category_title = LAPTOPS;
			$category_keyword = "Dell Laptops \\ Notebooks";
			break;	
		case "notebook":
			$category_title = LAPTOPS;
			$category_keyword = "Dell Laptops \\ Notebooks";
			break;
		case "ultrabook":
			$category_title = ULTRABOOKS;
			$category_keyword = "Dell Laptops \\ Notebooks";
			$search_term = $category_id;
			break;
		case "desktop":
		case "aio":
		case "all-in-one":
			$category_title = DESKTOPS . " \ ". ALL_IN_ONES;
			$category_keyword = "Dell Desktops \\ All-In-Ones";			
			break;
		case "server":
			$category_title = SERVERS;
			$category_keyword = "Dell Servers";
			break;
		case "storage":
			$category_title = STORAGE;
			$category_keyword = "dell-storage-resources";
			break;	
		case "solution":
			$category_title = SOLUTIONS;
			$category_keyword = "";
			$search_term = $category_id;
			break;	
		case "network":
			$category_title = NETWORKING;
			$category_keyword = "Networking";
			break;
		case "alienware":
			$category_title = ALIENWARE;
			$category_keyword = "Alienware";
			break;	
		default:
			break;		
	}
	
	if( $debug == "true" )
	{
		echo "categroy title: " . $category_title . "<br/>";
		echo "categroy title: " . $category_keyword . "<br/>";
		echo "search term: " . $search_term . "<br/>";
	}
	
	switch( $brand )
	{
		case "inspiron":
			break;
		case "xps":
			break;
		case "latitude":	
			break;
		case "vostro":
			break;		
		default:
			break;
	}
	$api = new OoyalaApi( $key, $secret );	
	
	// validate country
	function validateCountry( $val )
	{
		// trim to two characters
		$_val = trim( $val );
		//echo $_val . "<br/>";
		$_val = html_entity_decode( $val );
		//echo $_val . "<br/>";
		$_val = substr( $val, 0, 2 );
		// validate letters or script chars
		
		if( preg_match( '[\d]', $_val ) || preg_match( '/[\*\?<>]/', $_val ) )
		{
			return "us";
		}
		else
		{
			return $_val;
		}
	}
	
	// validate language
	function validateLanguage( $val )
	{
		// trim to two characters
		$val = substr( $val, 0, 2 );
		if( preg_match( '[\d]', $val ) || preg_match( '/[\*\?<>]/', $val ) )
		{
			return "en";
		}
		else
		{
			return $val;
		}
	}
	
	// validate segemnt
	function validateSegment( $val )
	{
		// trim to two characters
		//$val = substr( $val, 0, 3 );
		if( preg_match( '[\d]', $val ) || preg_match( '/[\*\?<>]/', $val ) )
		{
			return "dhs";
		}
		else
		{
			return $val;
		}
	}
	
	// validate customer set
	function validateCustomerSet( $val )
	{
		// trim to two characters
		if( preg_match( '[\d]', $val ) || preg_match( '/[\*\?<>]/', $val ) )
		{
			return "dhs";
		}
		else
		{
			return $val;
		}
	}
?>