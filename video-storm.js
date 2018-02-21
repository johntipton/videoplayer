function createVideo( embedCode, pageLocale, playlistID )
{
	var playerlocale = pageLocale.language + "_" + pageLocale.country;
	var omnitureQuerystring = "c=" + pageLocale.country + "&l=" + pageLocale.language + "&s=" + pageLocale.segment ;
	var playerCSSURL = "css/video.css";
	var autoPlay = false;
	var initialTime = 0;
	var playerLoop = false;
	var useFirstVideoPlayList = true;
	var playlistid = playlistID ? playlistID : "";
	var hasValidPlaylist = false;
	var playlistIds = [];
  Player1.ready(function() { 
		var playerConfiguration = {
			playlistsPlugin: {"data":[ playlistid ]},
			width: "100%",
			height: "100%",
			wmode: 'transparent',
			autoplay: autoPlay,
			enableChannels: true,
			initialTime: initialTime,
			locale: playerlocale,
			loop: playerLoop,
			flashParams: {
				"thruParam_omniture-dell-other[prop49]": omnitureQuerystring
			},
			prebuffering: false,
			useFirstVideoPlaylist: useFirstVideoPlayList,
			css: playerCSSURL,
			onCreate: function( player )
			{
				player.mb.subscribe( Player1.EVENTS.SIZE_CHANGED, "page", function( eventName ){ 
					resizeVideo( player ); 
				});
				player.mb.subscribe( Player1.EVENTS.EMBED_CODE_CHANGED, "page", function ( eventName, videoId, playerConfigurationObject ) {
					embedCode = videoId;
					if( typeof( playerConfigurationObject ) === "undefined" || !playerConfigurationObject.hasOwnProperty( "playlistsPlugin" ))
					{
						player.play();
					}
				});
				player.mb.subscribe( Player1.EVENTS.PLAYBACK_READY, "page", function ( eventName, playerObject ) {
					var playlistWrapper = $j( "#oo-playlists-" + "ooyalaplayer1" );
					if( playlistWrapper )
					{
						hasValidPlaylist = true;
						var playlistItems = $j( playlistWrapper ).find( ".slide-" + "ooyalaplayer1" + " .oo-thumbnail" );
						for( var x=0; x < playlistItems.length; x++ )
						{
							playlistIds.push( $j( playlistItems[x] ).attr( "id" ) );
						}
					}
					player.mb.publish( Player1.EVENTS.SIZE_CHANGED );
				});
				player.mb.subscribe( "endScreenShown", 'page', function ( eventName ) {
					if( playlistIds.length > 0 )
					{
						for( var y=0; y < playlistIds.length; y++ )
						{
							if( embedCode === playlistIds[y] )
							{
								var nextVideo = ( ( y+1 ) <  playlistIds.length ) ? y + 1 : 0;
								player.setEmbedCode( playlistIds[nextVideo] );
							}
						}
					}
				});
			}
		}
		Player1.Player.create( 'ooyalaplayer1', embedCode, playerConfiguration );
	});
	var plugOb = {};
	try
	{
		plugOb = new dellModule();
		plugOb.setLWP( pageLocale );
		plugOb.init( ["Player1"] );
	}
	catch( e )
	{
		console.log( "Dell video module could not be instantiated." )
	}
		
	if( Object.keys( plugOb ).length > 0 )
	{
		try
		{
			plugOb.loadOmnitureModule();
		}
		catch(e)
		{
			console.log( "Video Omniture module did not load." );		
		}
		try
		{
			plugOb.loadCCModule();
		}
		catch(e)
		{
			console.log( "Video Closed Caption module did not load." );		
		}
		try
		{
			plugOb.loadCTAModule();
		}
		catch( e )
		{
			console.log( "CTA module did not load." );		
		}
	}
	function resizeVideo( obj ) 
	{
		var div = $j( "#" + obj.elementId );
		var _oWidth = $j( div ).width();
		var _hasPlaylist = ( div ).find( ".oo-playlists-thumbnails" );
		if( _hasPlaylist.length > 0 )
		{
			var _newHeight = ( _oWidth * 9 / 16 ) + 83;
		}
		else
		{
			var _newHeight = _oWidth * 9 / 16;
		}
		$j( div ).height( _newHeight );
		$j('table').find('td').css('padding', '0');
	}
	
}

function dellModule() {
	/*========================================
		PRIVATE MEMBERS
	========================================*/
	var _args = {};
	var lwp = {};
	
	// player object
	var playerObject = {};
	
	// flag for closed captions
	var showCaptions = true;
	// array of closed captions
	var allClosedCaptions = [];
	// list of CC languages
	var videoplayerLanguageList = [];
	// current closed caption language
	var currentClosedCaptionLocale;
	// current set of captions
	var currentCaption = [];
	// last caption
	var lastCaption;
	// player container DIV
	var playerContainer;
	// captionsContainer DIV
	var captionsContainer;
	// captions DIV
	var captionDIV;
	// videoLanguagePopup DIV
	var videoLanguagePopup;
	
	// current id
	var currentVideoID;
	// playlist CTA object
	var playlistCTAObject;
	
	// ctaContainer div
	var ctaContainer;
	// ctaContainer width
	var ctaContainerWidth = 0;
	// ctaContainer height
	var ctaContainerHeight = 0;
	// ctaButton div
	var ctaButton;
	/*========================================
		PUBLIC MEMBERS
	========================================*/
	this.setLWP = setLWP;
	this.init = init;
	
	/*========================================
		PUBLIC METHODS
	========================================*/
	// cc module
	this.loadCCModule = loadCCModule;
	// Omniture module
	this.loadOmnitureModule = loadOmnitureModule;
	// CTA module
	this.loadCTAModule = loadCTAModule;
	
	// module init
	function init( Args ) 
	{
		_args = Args; 
	}
	// set the lwp
	function setLWP( Args )
	{
		lwp = Args;
	}
	/*=======================================================================================
		loadCCModule
		@param	_showCaptions	BOOLEAN	Override for displaying closed captions (default = true )
	=========================================================================================*/
	function loadCCModule( _showCaptions ) 
	{
		// default CC
		var pageLocale = { "language": "en", "country": "us", "segment": "dhs" };
		
		OO = window[ _args[0] ];
		
		// set the locale 		
		pageLocale.language	= lwp.language;
		pageLocale.country	= lwp.country;
		pageLocale.segment	= lwp.segment;
		
		currentClosedCaptionLocale = pageLocale.language + "_" + pageLocale.country;
		
		// check for showCaptions
		if( _showCaptions === false )
		{
			showCaptions = false;
		}
		else
		{
			showCaptions = true;
		}
		
		OO.plugin( "DellUIModule", function(OO, _, $, W) {
			var Plugin = {};
			Plugin.DellUIModule = function(mb, id) {
				this.mb = mb;
				this.id = id;
				this.init();
			};
			Plugin.DellUIModule.prototype = {
				init: function() {
					this.mb.subscribe( OO.EVENTS.PLAYER_CREATED, 'closedCaptionUI', _.bind( this.onPlayerCreate, this ));
					this.mb.subscribe( OO.EVENTS.CONTENT_TREE_FETCHED, 'closedCaptionUI', _.bind(this.onContentTreeFetched, this));
					this.mb.subscribe( OO.EVENTS.PLAYHEAD_TIME_CHANGED, "closedCaptionUI", _.bind( this.checkCurrentCaption, this ));
					this.mb.subscribe( OO.EVENTS.SIZE_CHANGED, "closedCaptionUI", _.bind( this.resizeCaptions, this ));
					this.mb.subscribe( "resizeCaptions", "closedCaptionUI", _.bind( this.resizeCaptions, this ));
					this.mb.subscribe( "initClosedCaptions", "closedCaptionUI", _.bind( this.loadClosedCaptions, this ));
					this.mb.subscribe( "showClosedCaptions", "closedCaptionUI", _.bind( this.showClosedCaptions, this, this.mb ));
					this.mb.subscribe( "hideClosedCaptions", "closedCaptionUI", _.bind( this.hideClosedCaptions, this, this.mb ));
					this.mb.subscribe( "showLanguagePopup", "closedCaptionUI", _.bind( this.showLanguagePopup, this, this.mb ));
					this.mb.subscribe( "hideLanguagePopup", "closedCaptionUI", _.bind( this.hideLanguagePopup, this, this.mb ));
					this.mb.subscribe( OO.EVENTS.CONTROLS_HIDDEN, "closedCaptionUI", _.bind( this.hideControls, this, this.mb ));
				},
				onPlayerCreate: function( event, elementId, params ) {
					// find the DIV
					this.playerRoot = $j("#" + elementId);
					// find the "controls" DIV and pre-prend some HTML to hold the captions
					this.playerRoot.find('.oo_controls').prepend('<div class="captionsContainer"><div class="caption"></div></div>');
					// set the main player container DIV 
					playerContainer = this.playerRoot;
					// set the main caption container DIV 
					captionsContainer = playerContainer.find( ".captionsContainer");
					// set the caption DIV
					captionDIV = captionsContainer.find( ".caption" );
					// adjust the top of the captions container
					$j( captionsContainer ).css( "top", (- captionDIV.height() - 100) + "px" );
					// hide the container
					$j( captionsContainer ).css( "opacity", "0" );
				},
				onContentTreeFetched: function(event, content) {
					//alert( "woo hoo" );
					var isHTML5 = this.playerRoot.find( "video" );
					// if not HTML5, then unsubscribe 
					if( isHTML5.length !== 0 )
					{
						$j( captionDIV )[0].innerHTML = "";
						// grab the closed caption URL, if it exists
						var ccURL = content.closed_captions[0].url;
						// try to change the CC
						this.mb.publish( "initClosedCaptions", ccURL, captionDIV );
					}
					else
					{
						this.mb.unsubscribe( OO.EVENTS.PLAYHEAD_TIME_CHANGED, "closedCaptionUI" ); 
						this.mb.publish( "hideClosedCaptions", "closedCaptionUI" ); 
					}
				},
				resizeCaptions: function( event, width, height ) {
					var _captionHeight = captionDIV.height();
					$j( captionsContainer ).css( "top", (- _captionHeight - 5) + "px" );		
				},
				checkCurrentCaption: function( event, currentTime, duration, seekTime ) {	
					var _currentCaption;
					if( showCaptions )
					{
						for ( var caption in currentCaption ) 
						{
							var caption = currentCaption[caption];
							if ( currentTime > caption["begin"] ) 
							{
								if ( currentTime <= caption["end"] ) 
								{
									_currentCaption = caption;
								}
								else
								{
									_currentCaption = "";
								}
							} 
							else if ( _currentCaption ) 
							{
								break;
							}
						};
						if ( _currentCaption && ( _currentCaption != "" ) ) 
						{
							// add the text
							$j( captionDIV )[0].innerHTML = _currentCaption[ "text" ];
							// resize the captions
							this.mb.publish( "resizeCaptions" );
						} 
						else 
						{
							// hide the caption container
							$j( captionDIV )[0].innerHTML = "";
						}
						if ( lastCaption !== _currentCaption ) 
						{
							$j( captionsContainer ).css( "width", "100%" );
							if ( _currentCaption !== "" ) 
							{
								this.mb.publish( "resizeCaptions" );
							}
						}
						lastCaption = _currentCaption;
					}
					else
					{
						// hide the caption container
						$j( captionsContainer ).css( "opacity", "0" );
					}
				},
				onClosedCaptionsLoad: function ( event, result ) {},
				loadClosedCaptions: function ( event, _ccURL, _captionDiv ) {
					getClosedCaptions( _ccURL, _captionDiv, this );
					this.mb.publish( "hideLanguagePopup", "closedCaptionUI" ); 
				},
				showClosedCaptions: function ( event, a, b, c, d ) {
					$j( captionsContainer ).css( "opacity", "1" );
				},
				hideClosedCaptions: function ( event, a, b, c, d ) {
					$j( captionsContainer ).css( "opacity", "0" );
				},
				showLanguagePopup: function( event, a, b, c, d ) {
					showVideoLanguagePopup();
				},
				hideLanguagePopup: function( event, a, b, c, d ) {
					hideVideoLanguagePopup();
				},
				hideControls: function( event, a, b, c, d ) {
					hideVideoLanguagePopup();
				},
				__end_marker: true
			};
			return Plugin.DellUIModule;
		});
	}
	/*==================================================================
		CLOSED CAPTIONS
		PRIVATE FUNCTIONS
	===================================================================*/
	
	// get closed cations via AJAX call to Ooyala
	// @param	_ccURL			STRING			URL of DXFP file (XML)
	// @param	_captionDiv	DOM ELEMENT	DIV that will display the captions
	// @param	playerObj		OBJECT 			Player object (contains message bus reference)
	function getClosedCaptions( _ccURL, _captionDiv, playerObj )
	{
		playerObject = playerObj;
		
		var xhr = new XMLHttpRequest();
		xhr.open('GET', _ccURL);
		xhr.onreadystatechange = function () {
		  if (this.status === 200 && this.readyState === 4) {
				console.log('XHR worked');
				//console.log( this.response );
				var _captionsXml = $j( this.response );
				var _currentCaption = [];
				// create an array of all languages contained in the XML
				allClosedCaptions = createCaptionsCollection( _captionsXml.find("div") );
				console.dir( allClosedCaptions );
				// assign the current set of captions to the global currentCaption variable
				//currentCaption = findCurrentCC( pageLocale.language, pageLocale.country );
				currentCaption = findCurrentCC( currentClosedCaptionLocale );
				
				// check the showCaptions global var - if true, and there are captions, publish the "showClosedCaptions" event
				if( currentCaption.length > 0 || showCaptions )
				{
					playerObject.mb.publish( "showClosedCaptions" );
				}
				else
				{
					playerObject.mb.publish( "hideClosedCaptions" );
				}
		  }
		};
		xhr.send();
	}
	// add Closed Caption button 
	function addCCButton()
	{
		// debug
		console.log( "Add CC button" );
		
		var _html = "<div id=\"cc_icon\" class=\"oo_button oo_toolbar_item oo_cc\"></div>";
	
		// add the CC button
		$j( this ).find( ".vod" ).append( _html );
		
		var _cc_icon = $j( this ).find( "#cc_icon" );
		
		// bind the click handler to the CC button
		$j( _cc_icon ).bind( "click", "", ccButtonHandler );
	}
	
	// add Closed Caption popup
	function addCCPopup()
	{
		// debug
		console.log( "Add CC popup" );
		
		// html for popup
		//var _html = '<div id="videoLanguagePopup" class="videoLanguagePopup"><div id="ccLanguageModal"><p style="margin-bottom:5px;"><a id="on-caption" href="javascript:void(0);" class="ooyala-caption">|</a><a id="off-caption" href="javascript:void(0);" class="disabled ooyala-caption">O</a></p><div id="listLanguages"></div></div></div>';
		var _html = '<div id="videoLanguagePopup" class="videoLanguagePopup"><div id="ccLanguageModal"><div id="caption-toggle" href="javascript:void(0);" class="onoff-button on"></div><div id="listLanguages"></div></div></div>';
		// add the html to the control bar
		$j( this ).find( ".vod" ).append( _html );	
		// find the caption toggle
		var _captionToggle = $j( this ).find( "#caption-toggle" );
		
		$j( _captionToggle ).bind( "click", "", toggleCaptions );
		// find the on button
		var _onCaptionButton = $j( this ).find( "#on-caption" );
		// bind the on button to the click
		$j( _onCaptionButton ).bind( "click", "", onCaptions );
		// find the off button
		var _offCaptionButton = $j( this ).find( "#off-caption" );
		// bind the on button to the click
		$j( _offCaptionButton ).bind( "click", "", offCaptions );
		// set the videoLanguagePopup div
		videoLanguagePopup = $j( this ).find( ".vod" ).find( ".videoLanguagePopup" );
		// hide the language popup
		$j( videoLanguagePopup ).hide();
		
		return $j( this ).find( ".vod" );
	}
	
	// closed caption button handler
	function ccButtonHandler( event )
	{
		console.log( "Clicked the language selector" );
		toggleVideoLanguagePopup();
	}
	
	// toggle the videoLanguagePopup
	function toggleVideoLanguagePopup()
	{
		videoLanguagePopup.toggle( "slow" );
	}
	
	// hide the language popup
	function hideVideoLanguagePopup()
	{
		videoLanguagePopup.fadeOut( "slow" );
	}
	
	// hide the language popup
	function showVideoLanguagePopup()
	{
		videoLanguagePopup.fadeIn( "slow" );
	}

	// langage selector button handler
	function languageButtonHandler( event )
	{
		//var _newLanguage;
		
		// debug
		console.log( "language changed from " + currentClosedCaptionLocale + " to " + this.attributes.data.value );
		
		// get the new language code
		//_newLanguage = this.attributes.data.value;
		// use global caption locale 
		currentClosedCaptionLocale = this.attributes.data.value;
		
		// change the caption language
		currentCaption = findCurrentCC( currentClosedCaptionLocale );
		// enable CC, if they aren't already
		showCaptions = true;
		playerObject.mb.publish( "showClosedCaptions" );
		// turn on the button
		var captionToggle = $j(playerContainer).find("#caption-toggle");
		var isOff = captionToggle.hasClass("off");
		if( isOff )
		{
			$j(captionToggle).toggleClass( "on" );
			$j(captionToggle).toggleClass( "off" );
		}
		// close the language popup
		playerObject.mb.publish( "hideLanguagePopup" );
		
	}
	
	function toggleCaptions()
	{
		if( showCaptions )
		{
			console.log( "Hide captions" );
			showCaptions = false;
			playerObject.mb.publish( "hideClosedCaptions" );
		}
		else
		{
			console.log( "Show captions" );
			showCaptions = true;
			playerObject.mb.publish( "showClosedCaptions" );
		}
		$j(this).toggleClass( "on" );
		$j(this).toggleClass( "off" );
		toggleVideoLanguagePopup();
	}
	
	// make closed captions viewable
	function onCaptions()
	{
		// publish to the showClosedCaptions
		playerObject.mb.publish( "showClosedCaptions" );
		toggleVideoLanguagePopup();
	}
	
	// make closed captions hidden
	function offCaptions()
	{
		// publish to the hideClosedCaptions
		playerObject.mb.publish( "hideClosedCaptions" );
		toggleVideoLanguagePopup();
	}
	
	// process the XML into an array of objects
	function createCaptionsCollection( d )
	{
		var _numCCLanguages = d.length;
		var _allCaptions = [];
		var _lastLanguage = "xx";
		var _currentLanguage = "";
		var _ccPopupParentDiv = {};
		var _ccPopupLanguageDiv;

		// if there are any elements in the array, we have closed captions
		// Now we need to create the UI for the button and the language picker
		var _cc_icon = playerContainer.find( "#cc_icon" );
		if ( _numCCLanguages > 0) 
		{
			// add closed caption icon to bar, if not already attached
			if( _cc_icon.length === 0 )
			{
				addCCButton.call( playerContainer );
				_ccPopupParentDiv = addCCPopup.call( playerContainer );
				_ccPopupLanguageDiv = $j( _ccPopupParentDiv ).find( "#listLanguages" );
			}
		}
		else
		{
			// hide closed captions if no languages
			$j( _cc_icon ).hide();
		}
		
		// reset the listLanguages children, just in case
		var __ccPopupLanguageDiv = playerContainer.find( "#listLanguages" );
		if( __ccPopupLanguageDiv.length >  0 )
		{
			__ccPopupLanguageDiv.empty();
			_ccPopupLanguageDiv = __ccPopupLanguageDiv;
		}
		// create a quick array of language codes (assumes that these are in the same order)
		// reset the videoplayerLanguageList 
		videoplayerLanguageList = [];
		for (var _z = 0; _z < _numCCLanguages; _z++) 
		{
			var _divElement = $j(d[_z]);
			//languages
			var _langCode = _divElement.attr( "xml:lang" );
			// special case for Chinese
			switch ( _langCode )
			{
				case "zh-cn":
					_langCode = "zh-hans";
					break;
				case "zh-tw":
				case "zh-hk":
					_langCode = "zh-hant";
					break;
			}
			var _langName = mapLanguageCodes( _langCode );
			
			// Need to add the list to each individual video's CC list - this example assumes one per page
			videoplayerLanguageList.push( _langCode );
			// populate the language list modal
			_ccPopupLanguageDiv.append( "<div class=\"ccLanguage\" data=\"" + _langCode + "\" title=\"" + _langName + "\" >" + _langName + "</div>" );
			
			//process the captions
			var _caption = [];
			// grab the <p> element
			var _el = _divElement.find( "p" );
			// spin through the <p>
			for ( var _y = 0; _y < _el.length; _y++ ) 
			{
				// get parent language
				_currentLanguage = _langCode;
				if ( _currentLanguage !== _lastLanguage ) 
				{
					_caption.push({ "begin": getTime($j(_el[_y]).attr("begin")), "end": getTime($j(_el[_y]).attr("end")), "text": $j(_el[_y]).text() });
				}
			}
			_lastLanguage = _currentLanguage;
			_allCaptions.push( _caption );
		}
		// add click handler for language selector
		_ccPopupLanguageDiv.find( ".ccLanguage" ).bind( "click", this , languageButtonHandler );
		
		return _allCaptions;
	}
	// Find the correct current CC
	function findCurrentCC( _locLanguage, _locCountry )
	{
		var _locale;
		var _localeTest;
		var _result;
		
		// see if _locLanguage is actually a full locale
		_localeTest = explodeLocale( _locLanguage );
		if( _localeTest.language !== "undefined" && _localeTest.country !== "undefined" )
		{
			_locLanguage = _localeTest.language;
			_locCountry = _localeTest.country;
		}
		
		// There should always be a language-country input from the LWP, however, there
		//	may be some use case where that's not true, so we need to test
		if( _locCountry !== "" && _locCountry !== undefined )
		{
			// first try the full locale
			_locale =  _locLanguage + "-" + _locCountry;
			// search
			_result = searchLanguageList( _locale, allClosedCaptions, videoplayerLanguageList );
			if( _result.length > 0 )
			{
				return _result;
			}
			else
			{
				// use the language only
				_locale =  _locLanguage;
				// search
				_result = searchLanguageList( _locale, allClosedCaptions, videoplayerLanguageList );
				if( _result.length > 0 )
				{
					return _result;
				}
				else
				{
					return [];
				}
			}
		}
		else if( _locLanguage !== "" && _locLanguage !== undefined )
		{
			_locale =  _locLanguage;
			// search
			_result = searchLanguageList( _locale, allClosedCaptions, videoplayerLanguageList );
			if( _result.length > 0 )
			{
				return _result;
			}
			else
			{
				return [];
			}
		}
	}
	/**
	* searchLanguageList
 	* Search function comparing the array of captions vs. the language list
 	* @param {string} _locale - The language-country or language code (ex. "en-us" or "de")
 	* @param {array} _captionList - multi-dimensional array of all closed captions
	* @param {array} _languageList - simple array of language-country or language codes
	* @returns {array} _captionList[_a] (array of objects)  or empty array
 	*/
	function searchLanguageList( _locale, _captionList, _languageList )
	{
		var __locale = _locale.toLowerCase();
		for( var _a=0; _a < _languageList.length; _a++ )
		{
			var _listLang = _languageList[_a].toLowerCase();
			
			// check for special cases
			if( __locale === "zh-cn" )
			{
				__locale = "zh-hans";
			}
			else if( __locale === "zh-tw" || __locale === "zh-hk" )
			{
				__locale = "zh-hant";
			}
			
			if( _listLang === __locale )
			{
				return _captionList[_a];
			}
		}
		return [];
	}
	
	// Get the localized language name for each locale code - these values would be used in the UI to select a new language
	//  e.g. "en-US" = "English (US)"
	/**
	* mapLanguageCodes
 	* Map the language code to the translated name
 	* @param {string} _locale - The language-country or language code (ex. "en-us" or "de")
 	*  @param {array} _captionList - multi-dimensional array of all closed captions
	* @param {array} _languageList - simple array of language-country or language codes
	* @returns {array} _captionList[_a] (array of objects)  or empty array
 	*/	
	function mapLanguageCodes( localeCode ) 
	{
		//var _languageObject = { languageName: "English", languageCode: "en", onButtonText: "On", offButtonText: "Off", ccButtonText: "Closed Captions" };
		
		switch ( localeCode.toLowerCase() ) 
		{
			case "da": 
			case "da-da":
				return "Dansk";
			case "de":
			case "de-de": 
				return "Deutsch";
			case "en": 
				return "English";
			case "en-us": 
				return "English (US)";
			case "en-uk": 
				return "English (UK)";
			case "es": 
			case "es-la":
				return "Español";
			case "fr": 
				return "Français";  
			case "fr-ca":
				return "Français (Canada)";	
			case "hi": 
				return "हिन्दी";
			case "it": 
				return "Italiano";
			case "ja":
				return "日本語"               ;
			case "ko":
				return "한국어";            
			case "nl": 
				return "Nederlands";
			case "pt":
			case "pt-pt": 
				return "Português";
			case "pt-br": 
				return "Português (Brasil)";
			case "zh-hans": 
			case "zh-cn":
				return "简体中文";                                                                                  
			case "zh-hant":
			case "zh-tw":
			case "zh-hk":
				return "繁體中文";                                                   
			case "ar":
				return "العربية";
			case "cs":
				return " Čeština ";
			case "el":
				return " Ελληνικά ";
			case "fi":
				return "Suomi";
			case "he":
				return "עברית";
			case "hu":
				return "Magyar";
			case "no":
				return "Norsk";
			case "pl":
				return "Polski";
			case "ro":
				return "Română";
			case "ru":
				return " Русский";
			case "sv":
				return "Svenska";
			case "tr":
				return "Türkçe";                                                 
		}
	}
	
	// break apart locale back into language and country
	// return pagelocale object
	function explodeLocale( locale )
	{
		var _arrLocale = [];
		var _pageLocale = { language: locale, country: undefined };
		
		// search for 
		_arrLocale = locale.split( "-" );
		if( _arrLocale.length > 1 )
		{
			_pageLocale.language = _arrLocale[0];
			_pageLocale.country = _arrLocale[1];
			
			return _pageLocale;
		}
		else
		{
			// try the underscore
			_arrLocale = locale.split( "_" );
			_pageLocale.language = _arrLocale[0];
			_pageLocale.country = _arrLocale[1];
			
			return _pageLocale;
		}
		_pageLocale.language = locale;
		_pageLocale.country = undefined;
		return _pageLocale;
	}
	
	/*===========================================================
		loadOmnitureModule
	============================================================*/
	function loadOmnitureModule() 
	{
		// LWP object ( language, country, segment )
		this.lwp = lwp;
		
		var videoplayerstart = false;
		var videoplayereighty = false;
		var videoplayercomplete = false;
		
		OO = window[_args[0]];
		
		OO.plugin( "DellUIModule", function(OO, _, $, W) {
			var Plugin = {};
			Plugin.DellUIModule = function(mb, id) {
				this.mb = mb;
				this.id = id;
				this.init();
			};
			Plugin.DellUIModule.prototype = {
				embedCode: "",
				init: function() {
					this.mb.subscribe( OO.EVENTS.PLAYER_CREATED, "omnitureUI", _.bind( this.onPlayerCreate, this ) );
					this.mb.subscribe( OO.EVENTS.CONTENT_TREE_FETCHED, "omnitureUI", _.bind( this.onContentTreeFetched, this ) );
					this.mb.subscribe( OO.EVENTS.PLAYHEAD_TIME_CHANGED, "omnitureUI", _.bind( this.onPlayheadChanged, this ) );
					this.mb.subscribe( OO.EVENTS.EMBED_CODE_CHANGED, "omnitureUI", _.bind( this.onEmbedCodeChanged, this ) );
					this.mb.subscribe( "endScreenShown", 'omnitureUI', _.bind( this.onEndScreenShown, this ));
				},
				all: function( event ) {
					console.log( event );
				},
				onEmbedCodeChanged: function( eventName, embedCode, playerConfigurationObject ) {
					this.embedcode = embedCode;
					if( typeof( playerConfigurationObject ) === "undefined" )
					{
						videoplayerstart = false;
						videoplayereighty = false;
					}
				},
				onPlayerCreate: function( event, elementId, params ) {	
					var isHTML5 = playerContainer.find( "video" );
					if( isHTML5.length === 0 )
					{
						this.mb.unsubscribe( OO.EVENTS.PLAYHEAD_TIME_CHANGED, "omnitureUI" );
					}	
				},
				onPlayed: function( event, elementId, params ) {
					// Omniture event16 - start
					trackVideoStart( this.embedCode );	
					//this.mb.unsubscribe( OO.EVENTS.INITIAL_PLAY, "omnitureUI" );
				},
				onPlayheadChanged: function ( eventName, currentTime, totalTime, seekTime ) {
					// grab the decimal fraction of time / duration of video
					var percentageTime = currentTime/totalTime;
					// check for > 0
					if( !videoplayerstart )
					{
						trackVideoStart( this.embedCode );
						videoplayerstart = true;
					}
					// check for 80%
					if( videoplayereighty === false && percentageTime > 0.8 )
					{
						// set the flag so we do not run this code again
						videoplayereighty = true;
						// call the 80% function for SiteCatalyst
						trackVideoEighty( this.embedCode );
					}
					/*else if( videoplayercomplete === false && percentageTime == 1 )
					{
						// set the flag so we do not run this code again
						videoplayercomplete = true;
						// call the complete function for SiteCatalyst
						trackVideoComplete( this.embedCode );
					}*/
				},
				onContentTreeFetched: function(event, content) {
					this.embedCode = content.embed_code;	
				},
				onEndScreenShown: function( event ) {
					// set the flag so we do not run this code again
					videoplayercomplete = true;
					// call the complete function for SiteCatalyst
					trackVideoComplete( this.embedCode );
				},
				__end_marker: true
			};
			return Plugin.DellUIModule;
		});
	}
	
	/*==================================================================
		CLOSED CAPTIONS
		PRIVATE FUNCTIONS
	===================================================================*/

	// TRACK PLAY (event 16)
	function trackVideoStart( videoid )
	{
		console.log( videoid + " : start" );
		if (typeof (s_dell) != 'undefined') 
		{
			s_dell.linkTrackVars = 'prop2,prop13,prop49,eVar24';
			s_dell.linkTrackEvents = 'event16';
			s_dell.events = s_dell.apl( s_dell.events, 'event16', ',', 2 );
			s_dell.eVar24 = videoid;
			s_dell.tl( true, 'o', videoid );
		}
	}
	
	// TRACK 80% (event33)
	function trackVideoEighty( videoid )
	{
		console.log( videoid + " : 80%" );
		if(typeof(s_dell)!= 'undefined'){
			s_dell.linkTrackVars='prop2,prop13,prop49,eVar24';
			s_dell.linkTrackEvents='event33';
			s_dell.events = s_dell.apl( s_dell.events,'event33',',',2 );
			s_dell.eVar24 = videoid;
			s_dell.tl( true, 'o', videoid ); 
		}
	}
	
	// TRACK COMPLETE (event34)
	function trackVideoComplete( videoid )
	{
		console.log( videoid + " : complete" );
		if(typeof(s_dell)!= 'undefined'){
			s_dell.linkTrackVars='prop2,prop13,prop49,eVar24';
			s_dell.linkTrackEvents='event34';
			s_dell.events = s_dell.apl( s_dell.events,'event34',',',2 );
			s_dell.eVar24 = videoid;
			s_dell.tl( true, 'o', videoid ); 
		}
	}	

	/*===========================================================
		Load CTA Module
		
	============================================================*/
	function loadCTAModule( _buttonText, _linkURL, _target , _timeStart, _timeEnd, _topOffset, _rightOffset, _classname, _playlistCTAObject ) 
	{
		var ctabuttonText = ( _buttonText !== undefined ) ? _buttonText : "";
		var ctalinkURL = ( _linkURL !== undefined ) ? _linkURL : "";
		var ctatimeStart = ( _timeStart !== undefined ) ? _timeStart: 0;
		var ctatimeEnd = ( _timeEnd !== undefined ) ? _timeEnd : -1;
		var ctatarget = ( _target !== undefined ) ? _target : "_self";
		var ctatopoffset = ( _topOffset !== undefined ) ? _topOffset : 0;
		var ctarightoffset = ( _rightOffset !== undefined ) ? _rightOffset : 0;
		var ctaclassname = ( _classname !== undefined ) ? _classname : "primary";
		var playlistCTAObject = ( _playlistCTAObject !== undefined ) ? _playlistCTAObject : {};
		var isVisible = false;
		var ctaMetadataArray = [];

		// set the Player object
		OO = window[_args[0]];
		// instantiate the plugin
		OO.plugin( "DellUIModule", function( OO, _, $, W ) {
			var Plugin = {};
			
			Plugin.DellUIModule = function(mb, id) {
				this.mb = mb;
				this.id = id;
				this.init();
			};
			Plugin.DellUIModule.prototype = 
			{
				init: function() {
					this.mb.subscribe( OO.EVENTS.PLAYER_CREATED, 'ctaUI', _.bind( this.onPlayerCreate, this ));
					this.mb.subscribe( OO.EVENTS.CONTENT_TREE_FETCHED, 'ctaUI', _.bind( this.onContentTreeFetched, this ));
					this.mb.subscribe( OO.EVENTS.PLAYHEAD_TIME_CHANGED, 'ctaUI', _.bind( this.onPlayheadChanged, this ));
					this.mb.subscribe( "endScreenShown", 'ctaUI', _.bind( this.onEndScreenShown, this ));
					this.mb.subscribe( OO.EVENTS.EMBED_CODE_CHANGED, 'ctaUI', _.bind( this.onEmbedCodeChanged, this ));
					this.mb.subscribe( OO.EVENTS.METADATA_FETCHED, 'ctaUI', _.bind( this.onMetadataFetched, this ));
					this.mb.subscribe( "ctaButtonClick", "ctaUI", _.bind( this.onCTAbuttonClick, this, this.mb ));
				},
				onPlayerCreate: function(event, elementId, params) {
					playerObject = this;
					playerContainer = $j( "#" + elementId );
					console.log( "create" );
				},
				onPlayheadChanged: function( event, currentTime, duration, seekTime ) {	
					if( ctaContainer )
					{
						var _isVisible = $j( ctaContainer ).css( "visibility" );
						if( currentTime >= ctatimeStart && currentTime < ctatimeEnd )
						{
							/*if( !isVisible ) 
							{
								$j( ctaContainer ).css( "visibility", "visible" );
								//$j( ctaContainer ).animate( { "visibility" : "visible" }, 1000 );
							}
							isVisible = true;*/
							if( _isVisible !== "visible" )
							{
								$j( ctaContainer ).css( "visibility", "visible" );
							}
						}
						else
						{
							/*if( isVisible ) 
							{
								$j( ctaContainer ).css( "visibility", "hidden" );
							}
							isVisible = false;*/
							if( _isVisible === "visible" )
							{
								$j( ctaContainer ).css( "visibility", "hidden" );
							}
						}
					}
					else
					{
						//isVisible = false;
					}
				},
				onContentTreeFetched: function(event, content) {
					console.log( "content tree" );	
					var _duration = content.duration/1000;
					if( ctatimeEnd === - 1 ) 
					{
						ctatimeEnd = Math.ceil( _duration );
					}
				},
				onMetadataFetched: function(event) {
					var hasBeenSet = false;
					var isFullKey = false;
					isVisible = false;
					// reset the array
					ctaMetadataArray = [];
					// grab the Custom Metadata
					var _metadata = arguments[1].base;
					// look for the "cta_" prefix
					if( _metadata !== undefined && _metadata !== "" )
					{
						for( var _items in _metadata )
						{
							var _ctaPrefix = "cta_";
							var _position = _items.search( _ctaPrefix );
							if( _position > -1 )
							{
								var _keyLocale = _items.substring( _ctaPrefix.length, _items.length );
								var _object = { "key": _keyLocale, "value": _metadata[ _items ] };
								// add to array
								ctaMetadataArray.push( _object );
							}
						}
						
						// check if any cta key/value pairs are available to search through	
						if( ctaMetadataArray.length > 0 )
						{
							// spin through the metadata array to grab the locales and compare to the current locale
							for( var _x=0; _x<ctaMetadataArray.length; _x++ )
							{
								// get the locale/lwp from the key
								var _key = ctaMetadataArray[ _x ].key;
								var _lwpArray = _key.split( "-" );
								var _language = _lwpArray[ 0 ];
								var _country = _lwpArray[ 1 ];		
								var _segment = _lwpArray[ 2 ];
								
								// compare to lwp object
								// First, let's see if there's an exact match
								var _lwpString = "";
								if( _segment === undefined )
								{
									_lwpString = lwp.language + "-" + lwp.country;	
									isFullKey = false;
								}
								else
								{
									_lwpString = lwp.language + "-" + lwp.country + "-" + lwp.segment;
									isFullKey = true;
								}
								
								if( _lwpString === _key )
								{
									// create an array
									var _paramArray = ctaMetadataArray[ _x ].value.split( "," );
									// set the global cta parameters
									if( !hasBeenSet || ( hasBeenSet && isFullKey ) )
									{
										if( _paramArray[0] !== undefined )
										{
											ctabuttonText = _paramArray[0];
										}
										if( _paramArray[1] !== undefined )
										{
											ctalinkURL = _paramArray[1];
										}
										if( _paramArray[2] !== undefined )
										{
											ctatimeStart = _paramArray[2];
										}
										if( _paramArray[3] !== undefined )
										{
											ctatimeEnd = _paramArray[3];
										}
										if( _paramArray[4] !== undefined )
										{
											ctatarget = _paramArray[4];
										}
										if( _paramArray[5] !== undefined )
										{
											ctatopoffset = _paramArray[5];
										}
										if( _paramArray[6] !== undefined )
										{
											ctarightoffset = _paramArray[6];
										}
										if( _paramArray[7] !== undefined )
										{
											ctaclassname = _paramArray[7];
										}	
										hasBeenSet = true;
									}
									console.log( _paramArray );
								}
							}
							if( hasBeenSet )
							{
								var _endscreen = playerContainer.find('.oo_end_screen');
								_endscreen.after("<div class=\"oo_cta_container\"></div>");
								ctaContainer = playerContainer.find('.oo_cta_container');
								// add button
								//ctaButton = addCTAButton.call( ctaContainer, ctabuttonText );
								var _html = "<div class=\"oo_cta_button primary\"><a href=\"#\">" + ctabuttonText + "</a></div>";
								// add the CC button
								$j( ctaContainer ).append( _html );
								var _ctaButton = $j( ctaContainer ).find( ".oo_cta_button" );
								// bind the click handler to the CC button
								$j( _ctaButton ).bind( "click", "", function(){ playerObject.mb.publish( "ctaButtonClick", "ctaUI" ); } );
								ctaContainerWidth = ctaContainer.width();
								ctaContainerHeight = ctaContainer.height();
							}
						}
						
						console.log( "end" );
					}
				},
				onEndScreenShown: function( eventName ) {
					var _containerWidth = $j( ctaContainer ).width();
					var _containerHeight = $j( ctaContainer ).height();
					var _buttonWidth = $j( ctaButton ).width();
					var _buttonHeight = $j( ctaButton ).height();
					var _newContainerLeft = ( playerContainer.width() - _buttonWidth )/2;
					var _newContainerTop = ( playerContainer.height() - _buttonHeight )/2;
					var _time = 1000;
					$j( ctaContainer ).delay( _time ).css( "visibility", "visible" );
				},
				onEmbedCodeChanged: function( eventName, embedCode, playerConfigurationObject ) {
					isVisible = false;
					// destroy the cta container
					if( ctaContainer !== undefined )
					{
						ctaContainer.remove();
					}
				},
				onCTAbuttonClick: function( x,y,z ) {
					if( ctalinkURL !== "" &&  ctalinkURL !== "undefined" )
					{
						top.location.href = ctalinkURL;
					}
				},
				__end_marker: true
			};
			return Plugin.DellUIModule;
		});
	}
	
	/*==================================================================
			CTA
			PRIVATE FUNCTIONS
	===================================================================*/
	// set the parameters
	function setParameters( arr )
	{
		if( arr[0] !== undefined )
		{
			ctabuttonText = arr[0];
		}
		if( arr[1] !== undefined )
		{
			ctalinkURL = arr[1];
		}
		if( arr[2] !== undefined )
		{
			ctatimeStart = arr[2];
		}
		if( arr[3] !== undefined )
		{
			ctatimeEnd = arr[3];
		}
		if( arr[4] !== undefined )
		{
			ctatarget = arr[4];
		}
		if( arr[5] !== undefined )
		{
			ctatopoffset = arr[5];
		}
		if( arr[6] !== undefined )
		{
			ctarightoffset = arr[6];
		}
		if( arr[7] !== undefined )
		{
			ctaclassname = arr[7];
		}	
		hasBeenSet = true;
		return hasBeenSet;
	}
	
	// validate the position variable
	function positionValidated( pos )
	{
		var POSITION_OPTIONS = { 
			TOPRIGHT: "tr", 
			TOPLEFT: "tl",
			TOPCENTER: "tc"	
		};
		var _pos = ( pos !== undefined ) ? pos.toLowerCase() : "";
		for( var state in POSITION_OPTIONS )
		{
			if( _pos === POSITION_OPTIONS[state] )
			{
				return _pos;
			}
		}
		return POSITION_OPTIONS.TOPRIGHT;
	}
	
	// add Closed Caption button 
	function addCTAButton( buttonText )
	{
		// debug
		console.log( "Add CTA button: " + buttonText );
		var _html = "<div class=\"oo_cta_button primary\"><a href=\"#\">" + buttonText + "</a></div>";
	
		// add the CC button
		$j( this ).append( _html );
		
		var _ctaButton = $j( this ).find( ".oo_cta_button" );
		
		// bind the click handler to the CC button
		$j( _ctaButton ).bind( "click", "", ctaButtonHandler );
		return _ctaButton;	
	}
	
	// closed caption button handler
	function ctaButtonHandler( event )
	{
		console.log( "Clicked the CTA" );
		if( ctalinkURL !== "" &&  ctalinkURL !== "undefined" )
		{
			top.location.href = ctalinkURL;
		}
		//toggleVideoLanguagePopup();
	}

}

// =================================================================================================
// generic video functions
// =================================================================================================

// parse runtime for display
function parseRuntime( secs ) 
{
	var sec_numb = parseInt(secs);
	var hours = Math.floor(sec_numb / 3600);
	var minutes = Math.floor((sec_numb - (hours * 3600)) / 60);
	var seconds = sec_numb - (hours * 3600) - (minutes * 60);

	if (hours < 10) {
			hours = "0" + hours;
	}
	if (minutes < 10) {
			minutes = "0" + minutes;
	}
	if (seconds < 10) {
			seconds = "0" + seconds;
	}
	var time = hours + ':' + minutes + ':' + seconds;
	return time;
}

// get the time from text
function getTime( time ) 
{
	var time = time.split(":");
	var hours = parseInt(time[0], 10);
	var minutes = parseInt(time[1], 10);
	var seconds = parseInt(time[2], 10);
	return ((hours * 3600) + (minutes * 60) + seconds);
} 
