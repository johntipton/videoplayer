<?PHP
error_reporting( E_ERROR );

class Translation
{
	private $currentTranslation;
	private $currentLanguage;
	private $currentCountry;
	private $isLoaded = false;
	
	function __construct( $language, $country ) 
	{
		$this->currentLanguage = $language;
		$this->currentCountry = $country;
		
		// load the inital strings now
		$_result = $this->loadTranslation( $language, $country );
		if( !$_result )
		{
			throw new ErrorException( "The language file did not load." );
		}
		else
		{
			$this->isLoaded = true;
		}
	}
	
	/*
		Load the contents of a language or language_country combination
	*/
	public function loadTranslation( $language, $country )
	{
		$currentLanguage = $language;
		$currentCountry = $country;
		
		$_langCountry = $language . "_" . $country;
		$_file = file_get_contents( $_langCountry . ".json" );
		if( $_file === false )
		{
			$_file = file_get_contents( $language . ".json" );
			if( $_file === false )
			{
				$_file = file_get_contents( "en.json" );
				if( $_file === false )
				{
					return false;
					$this->currentTranslation = "ERROR";
				}
				else
				{
					$_arr = json_decode( $_file, true );
					$this->currentTranslation = $_arr;
					return true;
				}
			}
			else
			{
				$_arr = json_decode( $_file, true );
				//print_r( $_arr );
				$this->currentTranslation = $_arr;
				return true;
			}
		}
		else
		{
			$_arr = json_decode( $_file, true );
			$this->currentTranslation = $_arr;
			return true;
		}
		
	}
	
	public function isLoaded()
	{
		return $this->isLoaded;
	}
	
	public function getCurrentTranslations()
	{
		return $this->currentTranslation;
	}
	
	public function getTranslation( $str )
	{
		return	$currentTranslation;
	}
}
?>