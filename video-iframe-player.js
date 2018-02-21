function createVideo( videoid, language, country, segment, playlistid, pcode )
{
	var autoPlay = false;
	var parent = window.parent;
	var hostname = parent.location.hostname;
	var hostURL= parent.location.href;					
	var isSnP = ( hostname.indexOf( "access" ) > -1 ) ? true : false;
	var videoplayereighty = false;
	var playerId;	
	var playlistId = "";
	
	if( ( playlistid !== false ) &&  ( playlistid !== undefined ) )
	{
		playlistId = playlistid;
	}
	if( pcode == false || pcode == undefined )
	{
		pcode = "RvYmY6hur13N6wMKKnX_HgCa0VEU";
	}
	$(document).ready(function(e) {
    killPadding();
  });
	
	function killPadding()
	{ 
		$('table').find('td').css('padding', '0'); 
	}
		
	if( $("#DivBodyOnly") && !isSnP )
	{
		autoPlay = true;
	}
		
	var playerParam = {
		"pcode":pcode,
		"playerBrandingId":"NzI5Mjk2NjM2MGZlN2E4NmUwNTRiNDNm",
		'autoplay':autoPlay,
		'loop':false,
		"debug": true,
		"platform": "html5",
		playlistsPlugin: {"data":[playlistId]},
		useFirstVideoFromPlaylist: true,
		'skin': {
			"initialBitrate" : {"level": 1, "duration": 15},
			"config": "//player.ooyala.com/static/v4/stable/4.10.6/skin-plugin/skin.json",
			"inline": {
				"controlBar": {
					"logo": {
						"imageResource": {
							"url": "http://i.dell.com/images/global/general/spacer.gif",
							"clickUrl": "http://www.dell.com",
							"width": 1,
							"height": 1
						}
					}
				},
				"startScreen": {
					"showDescription": false,
					"showTitle": false
				},
				"pauseScreen": {
					"showDescription": false,
					"showTitle": false
				},
				"localization": {
					"defaultLanguage": 	language
				},
				"closedCaptionOptions": {
					"language": language
				}
			}
		},
		onCreate:onCreate 
	};
	OO.ready(function() {window.pp = OO.Player.create( 'container', videoid, playerParam );}); 
	
	// ==================================================================
	// onCreate
	// ==================================================================
	function onCreate( player )
	{
		// initPlay
		player.mb.subscribe( "initialPlay", "page", function( eventName ) 
		{
			trackVideoStart( player.getEmbedCode() );
		});
	
		// playheadTimeChanged
		player.mb.subscribe( "playheadTimeChanged", "page", function( eventName, currentTime, totalTime, seekTime ) 
		{
			var percentageTime = currentTime/totalTime;
			// check for 80%
			if( videoplayereighty === false && percentageTime > 0.8 )
			{
				// set the flag so we do not run this code again
				videoplayereighty = true;
				// call the 80% function for SiteCatalyst
				trackVideoEighty( player.getEmbedCode() );
			}
		});
	
		// complete
		player.mb.subscribe( "endScreenShown", "page", function( eventName ) 
		{
			trackVideoComplete( player.getEmbedCode() );
		});
	
	}
	
	// ==================================================================
	// Omniture
	// ==================================================================
	// TRACK PLAY (event 16)
	function trackVideoStart( videoid )
	{
		console.log( videoid + " : start" );
		console.log( typeof (s_dell) );
		if (typeof (s_dell) != 'undefined') 
		{
			s_dell.pageName=s_dell.prop13="";
			$('meta[name=METRICSPATH]').attr('content', parent.document.querySelector('meta[name="METRICSPATH"]').content);
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
		if(typeof(s_dell)!= 'undefined')
		{
			s_dell.pageName=s_dell.prop13="";
			$('meta[name=METRICSPATH]').attr('content', parent.document.querySelector('meta[name="METRICSPATH"]').content);
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
		if(typeof(s_dell)!= 'undefined')
		{
			s_dell.pageName=s_dell.prop13="";
			$('meta[name=METRICSPATH]').attr('content', parent.document.querySelector('meta[name="METRICSPATH"]').content);
			s_dell.linkTrackVars='prop2,prop13,prop49,eVar24';
			s_dell.linkTrackEvents='event34';
			s_dell.events = s_dell.apl( s_dell.events,'event34',',',2 );
			s_dell.eVar24 = videoid;
			s_dell.tl( true, 'o', videoid ); 
		}
	}	
}