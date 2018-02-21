function createVideo(videoId) {
  $j(document).ready(function (e) {
    $j('table').find('td').css('padding', '0');
  });
  var videoplayereighty = false;
  var debug = false;
  var countryCode = (MasterTmsUdo['CJ']['COUNTRY'] !== "undefined") ? MasterTmsUdo['CJ']['COUNTRY'].toLowerCase() : "us";
  var languageCode = (MasterTmsUdo['CJ']['LANG'] !== "undefined") ? MasterTmsUdo['CJ']['LANG'].toLowerCase() : "en";
  var segmentCode = (MasterTmsUdo['CJ']['SEG'] !== "undefined") ? MasterTmsUdo['CJ']['SEG'].toLowerCase() : "dhs";
  var customerCode = (MasterTmsUdo['CJ']['CSEG'] !== "undefined") ? MasterTmsUdo['CJ']['CSEG'].toLowerCase() : "19";
  if (languageCode == "zh") {
    if (countryCode == "cn" || countryCode == "my" || countryCode == "sg") {
      fullLocale = "zh-hans";
    } else {
      fullLocale = "zh-hant";
    }
  } else {
    fullLocale = languageCode + "-" + countryCode;
  }
  var playerParam = {
    "pcode": "RvYmY6hur13N6wMKKnX_HgCa0VEU",
    "playerBrandingId": "NzI5Mjk2NjM2MGZlN2E4NmUwNTRiNDNm",
    "autoplay": false,
    "loop": false,
    "debug": false,
    "playlistsPlugin": {
      "data": [""]
    },
    "useFirstVideoFromPlaylist": false,
    "initialBitrate": {
      "level": 1,
      "duration": 15
    },
    "skin": {
      "config": "//player.ooyala.com/static/v4/production/latest/skin-plugin/skin.json",
      "inline": {
        "startScreen": {
          "showDescription": false,
          "showTitle": false
        },
        "pauseScreen": {
          "showDescription": false,
          "showTitle": false
        }
      }
    },
    onCreate: onCreate
  };
  OO.ready(function () {
    window.pp = OO.Player.create("container", videoId, playerParam);
  });

  function onCreate(player) {
    player.mb.subscribe(OO.EVENTS.PLAYBACK_READY, "player", function (eventName) {
      window.pp.setClosedCaptionsLanguage("none");
    });
    player.mb.subscribe(OO.EVENTS.INITIAL_PLAY, "player", function (eventName, x) {
      trackVideoStart(player.getEmbedCode())
      findClosedCaptions();
    });
    player.mb.subscribe("playheadTimeChanged", "player", function (eventName, currentTime, totalTime, seekTime) {
      var percentageTime = currentTime / totalTime;
      if (videoplayereighty === false && percentageTime > 0.8) {
        videoplayereighty = true;
        trackVideoEighty(player.getEmbedCode());
      }
    });
    player.mb.subscribe("endScreenShown", "player", function (eventName) {
      trackVideoComplete(player.getEmbedCode());
    });
  }

  function findClosedCaptions() {
    var objAvailableLanguages = window.pp.getCurrentItemClosedCaptionsLanguages();
    var arrAvailableLanguages = objAvailableLanguages.languages;
    for (var x = 0; x < arrAvailableLanguages.length; x++) {
      if (fullLocale.toLowerCase() == arrAvailableLanguages[x].toLowerCase()) {
        window.pp.setClosedCaptionsLanguage(arrAvailableLanguages[x]);
        return;
      }
    }
    for (var y = 0; y < arrAvailableLanguages.length; y++) {
      if (languageCode.toLowerCase() == arrAvailableLanguages[y].toLowerCase()) {
        window.pp.setClosedCaptionsLanguage(arrAvailableLanguages[y]);
        return;
      }
    }
    window.pp.setClosedCaptionsLanguage("none");
  }
  function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }
  function trackVideoStart(videoid) {
    console.log(videoid + " : start");
    if (typeof (s_dell) != 'undefined') {
      s_dell.pageName = s_dell.prop13 = "";
      $j('meta[name=METRICSPATH]').attr('content', parent.document.querySelector('meta[name="METRICSPATH"]').content);
      s_dell.linkTrackVars = 'prop2,prop13,prop49,eVar24';
      s_dell.linkTrackEvents = 'event16';
      s_dell.events = s_dell.apl(s_dell.events, 'event16', ',', 2);
      s_dell.eVar24 = videoid;
      s_dell.tl(true, 'o', videoid);
    }
  }
  function trackVideoEighty(videoid) {
    console.log(videoid + " : 80%");
    if (typeof (s_dell) != 'undefined') {
      s_dell.pageName = s_dell.prop13 = "";
      $j('meta[name=METRICSPATH]').attr('content', parent.document.querySelector('meta[name="METRICSPATH"]').content);
      s_dell.linkTrackVars = 'prop2,prop13,prop49,eVar24';
      s_dell.linkTrackEvents = 'event33';
      s_dell.events = s_dell.apl(s_dell.events, 'event33', ',', 2);
      s_dell.eVar24 = videoid;
      s_dell.tl(true, 'o', videoid);
    }
  }
  function trackVideoComplete(videoid) {
    console.log(videoid + " : complete");
    if (typeof (s_dell) != 'undefined') {
      s_dell.pageName = s_dell.prop13 = "";
      $j('meta[name=METRICSPATH]').attr('content', parent.document.querySelector('meta[name="METRICSPATH"]').content);
      s_dell.linkTrackVars = 'prop2,prop13,prop49,eVar24';
      s_dell.linkTrackEvents = 'event34';
      s_dell.events = s_dell.apl(s_dell.events, 'event34', ',', 2);
      s_dell.eVar24 = videoid;
      s_dell.tl(true, 'o', videoid);
    }
  }
}