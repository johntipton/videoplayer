var l = "de";
var c = "de";
var locale = (l + "-" + c).toLowerCase();
var consoleEvents = "";

$(document).ready(function () {
  
  consoleEvents += "Document ready: " + performance.now() + "ms<br>";
  try
  {
    $( "#events" ).html( consoleEvents );
  }
  catch(e){}
  
  $("video").each(function ( idx, elem ) {
    var playerId = this.id;
    
    // video player ready
    videojs( playerId ).ready(function () {
      
      consoleEvents += playerId + " | Player ready: " + performance.now() + "ms<br>";
      try
      {
        $( "#events" ).html( consoleEvents );
      }
      catch(e){}
      
      var myPlayer = this;
      //var titleAndDescriptions = myPlayer.mediaInfo.customFields;
            
      myPlayer.on('loadstart',function(){
        console.log('mediainfo', myPlayer.mediainfo);
      })
        
      myPlayer.on( "loadeddata", function ( evt ) {
        
        //console.log( myPlayer.id_ + " loaded data" );
        consoleEvents += playerId + " | loadeddata: " + performance.now() + "ms<br>";
        try
        {
          $( "#events" ).html( consoleEvents );
        }
        catch(e){}
        
        //console.log( "TEXT TRACKS:");
        var textTracks = this.textTracks();
        for (var x = 0; x < textTracks.length; x++) {
          if (textTracks[x].kind == "captions") {
            var ccLanguage = (textTracks[x].language).toLowerCase();
            //console.dir( "language: " + textTracks[x].language );    
            if (locale === ccLanguage) 
            {
              textTracks[x].mode = "showing"; // showing or hidden
              consoleEvents += playerId +  " | show CC: " + performance.now() + "ms<br>";
              try
              {
                $( "#events" ).html( consoleEvents );
              }
              catch(e){}

              return;
            }
          }

        }
        for (var x = 0; x < textTracks.length; x++) {
          if (textTracks[x].kind == "captions") 
          {
            var ccLanguage = (textTracks[x].language).toLowerCase();
            //console.dir( "language: " + textTracks[x].language );    
            if (l === ccLanguage) 
            {
              textTracks[x].mode = "showing"; // showing or hidden
              consoleEvents += playerId +  " | show CC: " + performance.now() + "ms<br>";
              try
              {
                $( "#events" ).html( consoleEvents );
              }
              catch(e){}
              return;
            }
          }
        }
      });
      myPlayer.on("loadedmetadata", function ( evt ) {
        consoleEvents += playerId +  " | loadedmetadata: " + performance.now() + "ms<br>";
        try
        {
          $( "#events" ).html( consoleEvents );
        }
        catch(e){}
      });
      myPlayer.on("timeupdate", timeupdateHandler);
      myPlayer.on("firstplay", function (x) {
        //var videoId = x.target.dataset.videoId;
        
        //console.log(videoId + " played");
        //consoleEvents += videoId + " played: " + performance.now() + "ms<br>";
        //$( "#events" ).html( consoleEvents );
        //trackVideoStart(videoId);
      });
      myPlayer.on("ended", videoCompleteHandler );
    });
  });
});
// timeupdateHandler
function timeupdateHandler( evt ) 
{
  var currentTime = evt.target.player.currentTime();
  var duration = evt.target.player.duration();
  var percPlayed = currentTime / duration * 100;
  var videoId = evt.target.dataset.videoId;
  if (percPlayed > 79) {
    trackVideoEighty( videoId );
    evt.target.player.off( "timeupdate", timeupdateHandler );
  }
}
function videoCompleteHandler( evt )
{
  var videoId = evt.target.dataset.videoId;
  trackVideoComplete( videoId );
  evt.target.player.off( "ended", videoCompleteHandler );
  evt.target.player.currentTime( 0 );
}
// OMNITURE START
function trackVideoStart( videoid ) 
{
  console.log(videoid + " : start");
  consoleEvents += videoId + " started<br>";
  $( "#events" ).html( consoleEvents );

  if (typeof (s_dell) != 'undefined') {
    s_dell.pageName = s_dell.prop13 = "";
    $('meta[name=METRICSPATH]').attr('content', parent.document.querySelector('meta[name="METRICSPATH"]').content);
    s_dell.linkTrackVars = 'prop2,prop13,prop49,eVar24';
    s_dell.linkTrackEvents = 'event16';
    s_dell.events = s_dell.apl(s_dell.events, 'event16', ',', 2);
    s_dell.eVar24 = videoid;
    s_dell.tl(true, 'o', videoid);
  }
}
// OMNITURE 80%
function trackVideoEighty(videoid) 
{
  console.log(videoid + " : 80%");
  consoleEvents += videoId + " 80%<br>";
  $( "#events" ).html( consoleEvents );

  if (typeof (s_dell) != 'undefined') {
    s_dell.pageName = s_dell.prop13 = "";
    $('meta[name=METRICSPATH]').attr('content', parent.document.querySelector('meta[name="METRICSPATH"]').content);
    s_dell.linkTrackVars = 'prop2,prop13,prop49,eVar24';
    s_dell.linkTrackEvents = 'event33';
    s_dell.events = s_dell.apl(s_dell.events, 'event33', ',', 2);
    s_dell.eVar24 = videoid;
    s_dell.tl(true, 'o', videoid);
  }

}
// OMNITURE 100%
function trackVideoComplete(videoid) {
  console.log(videoid + " : complete");
  consoleEvents += videoId + " ended<br>";
  $( "#events" ).html( consoleEvents );

  if (typeof (s_dell) != 'undefined') {
    s_dell.pageName = s_dell.prop13 = "";
    $('meta[name=METRICSPATH]').attr('content', parent.document.querySelector('meta[name="METRICSPATH"]').content);
    s_dell.linkTrackVars = 'prop2,prop13,prop49,eVar24';
    s_dell.linkTrackEvents = 'event34';
    s_dell.events = s_dell.apl(s_dell.events, 'event34', ',', 2);
    s_dell.eVar24 = videoid;
    s_dell.tl(true, 'o', videoid);
  }
}