import * as imaAdSettings from './js/imaAdSettings.js';
import * as fwAdSettings from './js/fwAdSettings.js';
import * as classesList from './js/classesList.js';
import * as playerSettings from './js/playerSettings.js';
import * as playbackInfo from './js/playbackInfo.js';
//import * as debuggerSettings from './js/debuggerSettings.js';
import * as db from './js/debugLog.js';
import ButtonBarButton from './js/button-bar/buttonBar-button.js';
import SliderToggle from './js/button-bar/slider-toggle.js';
import ClassListToggle from './js/button-bar/classList-toggle.js';
import PlayerSettingsToggle from './js/button-bar/playerSettings-toggle.js';
import PlaybackInfoToggle from './js/button-bar/playbackInfo-toggle.js';
import AdSettingsToggle from './js/button-bar/adSettings-toggle.js';
import DebugLogToggle from './js/button-bar/log-toggle.js';


import {IDs} from './js/componentIDs.js';


// Default options for the plugin.
const defaults = {};

  // Version 0.9 updated 25 October 2016 
  // my debugger lets
  let _options,
      player,
      adSettings,
      logPane,
      vPclasses,
      playerTech="",
      adPlugin="",
      lastEvent="",
      currentEvent ="",
      vPosterStyles="",
      vBPBStyles="",
      slider,
      buttonBar, 
      btnToggleSlider,
      btnToggleLog, 
      btnToggleClassList,
      btnToggleAdSettings,
      btnTogglePlayerSettings,
      btnTogglePlaybackInfo,
      //btnToggleDebuggerSettings,
      logHeader,
      logList,
      logListItem,
      logJSON,
      allPlayerEventsJSON,
      allPlayerEvents = [],
      currentClasses="",
      lastClasses = "",
      firstpass = true,
      initialDuration=0, 
      previousDuration=0,
      initialSource="", 
      previousSource="",
      initialMedia="", 
      previousMedia="",
      currentDuration, 
      currentSource, 
      currentMedia,
      allClassesList,
      classesListPane,
      playerSettingsPane,
      playbackInfoPane,
      mediaSettings,
      adSettingsPane,
      //debuggerSettingsPane,
      playerSettingsHeader,
      playerSettingsFooter,
      logTypes = {
        array: 'array',
        table: 'table',
        list: 'list',
        json: 'json'
      };

  // Blackbird lets

      /* jshint -W040 */
let   bbird,
      outputList, 
      state = {
        pos: 1,
        size: 0
      },
      classes = [],
      profiler = {},
      currentTime,
      readKey,
      readGesture;

  // Array of events I came up with by watching debugger window and using documentation
  let playerEvents = [
    'ready',            // vidojs_component
    'durationchange',   // videojs_player, videojs_swf, videojs_contrib_hls
    'ended',            // videojs_contrib_ads, videojs_player, videojs_swf, videojs_qos
    'error',            // videojs_player
    'firstplay',        // videojs_player
    'fullscreenchange', // videojs_qos, videojs_player
    'loadedalldata',    
    'loadeddata',       // videojs_player, videojs_swf
    'loadedmetadata',   // videojs_qos, videojs_player, videojs_contrib_hls, videojs_swf
    'loadstart',        // videojs_qos, videojs_player, videojs_swf
    'pause',            // videojs_qos, videojs_player, videojs_swf
    'play',             // videojs_qos, videojs_player, videojs_swf
    'player_load',      // videojs_bc_analytics
    'contentupdate' ,   // videojs_contrib_ads
    'seeking',          // videojs_player, videojs_swf
    'seeked',           // videojs_player, videojs_swf
    'progress',         // videojs_contrib_hls, videojs_player (videojs_swf?)
    'catalog_request',  // videojs_catalog
    'catalog_response', // videojs_catalog
    'playing',          // videojs_qos, videojs_player, videojs_swf
    'waiting',          // videojs_player, videojs_swf
    'video_view',       // videojs_bc_analytics
    'video_impression', // videojs_bc_analytics
    'video_engagement', // videojs_bc_analytics
    'play_request',     // videojs_bc_analytics
    'canplay',          // videojs_player, videojs_swf
    'canplaythrough',    // videojs_player, videojs_swf
    'timeupdate'
  ];

  //let events;

  // Blackbird functions

  let reduce = (arr, callback, initial) => {
    let returnValue = initial,
        i = 0,
        l = arr.length;
    for (; i < l; i++) {
      returnValue = callback(returnValue, arr[i], i, arr);
    }
    return returnValue;
  };

  //event management (thanks John Resig)
  let addEvent = (obj1, type, fn) => {
    let obj = (obj1.constructor === String) ? document.getElementById(obj1) : obj1;
    if (obj.attachEvent) {
      obj['e' + type + fn] = fn;
      obj[type + fn] = function(){ obj['e' + type + fn](window.event); };
      obj.attachEvent('on' + type, obj[type + fn]);
    } else {
      obj.addEventListener(type, fn, false);
    }
  };

  let removeEvent = (obj1, type, fn) => {
    let obj = (obj1.constructor === String) ? document.getElementById(obj1) : obj1;
    if (obj.detachEvent) {
      obj.detachEvent('on' + type, obj[type + fn]);
      obj[type + fn] = null;
    } else {
      obj.removeEventListener(type, fn, false);
    }
  };

  let clear = () => {

  };

  let toggleSlider = () => {
    slider.classList.toggle('closed');
    btnToggleSlider.classList.toggle("active");

    btnToggleLog.classList.toggle('hide');
    btnTogglePlaybackInfo.classList.toggle('hide');
    btnToggleClassList.classList.toggle('hide');
    btnTogglePlayerSettings.classList.toggle('hide');
    if (_options.debugAds) {
      btnToggleAdSettings.classList.toggle('hide');
    }
    if (slider.classList.contains('closed')) {
      btnToggleSlider.innerHTML="Show Debugger";
    } else {
      btnToggleSlider.innerHTML="Hide Debugger";
    }
  };

  let getPlayerEvents = () => {
    allPlayerEventsJSON = videojs.getData(player.el_).handlers;


    for (prop in allPlayerEventsJSON) {
      allPlayerEvents.push(prop);
    }

    allPlayerEvents.sort();

    for(i=1; i < allPlayerEvents.length; i++) {
      console.log(allPlayerEvents[i]);
    }
  };


  let getClassesStr = (obj) => {
      if (typeof obj == 'object') {
        let logClassesStr = Array.prototype.slice.apply(obj).join(' ');
        return  { logClassesStr };    
      }
  };

  let showPosterStyles = (evt) => {
    if (_options.showPosterStyles) {
      let vPoster = document.getElementsByClassName("vjs-poster")[0];
      let posterOpacity = "";
      let cs = window.getComputedStyle(vPoster, null).opacity;
      let playerClasses="";
      let posterClasses="";

      if (firstpass) { 
        posterStyles.innerHTML = "<h2>BC Poster Opacity</h2>"; 
        firstpass=false; 
      }
      if (lastEvent != currentEvent) { 
        lastEvent = currentEvent; 
        vPosterStyles = "Opacity: " + cs + " lastEvent:" + lastEvent;
        posterStyles.innerHTML += '<span style="color:blue;">' + vPosterStyles + '</span><br/>';
        currentClasses= Array.prototype.slice.apply(player.el_.classList).join(' ');
        if (currentClasses != lastClasses) { 
          lastClasses = currentClasses;
          posterStyles.innerHTML += '<span style="color:green;">Player Classes: ' + currentClasses + '</span><br/>';
        }
        posterClasses = Array.prototype.slice.apply(vPoster.classList).join(' ');
        posterStyles.innerHTML += '<span style="color:orange;">Poster Classes: ' + posterClasses + '</span><br/>';

      }
    }
  };

  let showBigPlayButtonStyles = (evt) => {
    if (_options.showBigPlayButtonStyles) {
      let vBPB = document.getElementsByClassName("vjs-big-play-button")[0];
      let bpbOpacity = "";
      let bpbStyles =[];
      let cs = window.getComputedStyle(vBPB, null);
      let bpbClasses="";

      if (firstpass) { 
        bigPlayButtonStyles.innerHTML = "<h2>Big Play Button Styles</h2>"; 
        bigPlayButtonStyles.innerHTML += "User-Agent: " + navigator.userAgent + "<br>";
        firstpass=false; 
      }
      if (lastEvent != currentEvent) { 
        lastEvent = currentEvent; 
        if (cs.length!==0) {
          for (let i=0; i<cs.length; i++) {
            bpbStyles.push([cs.item(i) + ':', cs.getPropertyValue(cs.item(i))] + '<br>');
          }
          vBPBStyles = "CurrentStyles: " + bpbStyles + "<br>";
          bigPlayButtonStyles.innerHTML += '<span style="color:blue;">' + vBPBStyles + '</span><br/>';
        }
        currentClasses= Array.prototype.slice.apply(player.el_.classList).join(' ');
        if (currentClasses != lastClasses) { 
          lastClasses = currentClasses;
          bigPlayButtonStyles.innerHTML += '<span style="color:green;">Big Play Button Classes: ' + currentClasses + '</span><br/>';
        }
      }
    }
  };

  let listenForPlayerEvents = (player) => {
  
    player.one('durationchange', function(e){
      currentDuration = player.duration();
      let msgStr = 'currentDuration: ' + currentDuration + '<br>previousDuration: ' + previousDuration;
      db.logDebug('media', 'playerMsg', 'one: ' + e.type, msgStr );
    });

    let playCounter=0;
    let msgStr, currentTime, previousTime, levelStr='debug';
    for ( let i = 0; i < playerEvents.length; i++ ) {
      player.on(playerEvents[i], function (e) {
        switch(e.type) {
          case 'error':
            msgStr = [
                        player.error().type,
                        '-',
                        player.error().message,
                        console.trace()
                      ].join(' ');
          break;
          case 'firstplay':
            initialDuration = player.duration();
            currentDuration = initialDuration;
            initialSource = player.currentSrc();
            previousSource = initialSource;
            currentTime = player.currentTime();
            msgStr = [
              'Initial source:' + initialSource,
              'Current time: ' + currentTime
            ].join('<br>');
          break;
          case 'play':
            playCounter ++;
            msgStr = [
              'Plays: ' + playCounter,
              'Current source: ' + player.currentSrc(),
              'Playing from: ' + player.currentTime()
            ].join('<br>');
          break;
          case 'loadedmetadata':
            if (_options.showMediaInfo) {
              let mInfo='';
              mInfo = player.mediainfo;
              if (mInfo != undefined) {
                msgStr = [
                  'Account ID: ' + mInfo.account_id,
                  'Video ID: ' + mInfo.id,
                  'Title: ' + mInfo.name,
                  'Duration: ' + mInfo.duration
                ].join('<br>');
              }
              playerSettings.showPlayerSettings(player);
              playbackInfo.showPlaybackInfo(player);
            };
            levelStr='media';
          break;
          case 'pause':
            currentTime = player.currentTime();
            msgStr = 'Paused at: ' + currentTime;
          break;
          case 'progress':
              currentTime = player.currentTime();
              msgStr = [
                'currentTime:',
                currentTime
              ].join(' ');
              previousTime = currentTime;
              //playbackInfo.showPlaybackInfo(player);
          break;
          case 'contentupdate':
            msgStr = [
              'oldValue: ' + e.oldValue, 
              'newValue:' + e.newValue
            ].join('<br>');
            levelStr='media';
          break;
          case 'seeking':
            currentTime = player.currentTime();  
            msgStr = [
              'seeking from:' + previousTime,
              'to:' + currentTime
            ].join('<br>');
            previousTime = currentTime;
            playbackInfo.showPlaybackInfo(player);
          break;
          case 'canplaythrough':
            msgStr = 'currentTime: ' + player.currentTime();
          break;
          case 'timeupdate':
         //   msgStr = 'currentTime: ' + player.currentTime();
            playbackInfo.showPlaybackInfo(player);
            playerSettings.showPlayerSettings(player);
          break;
          case 'seeked':
            msgStr = 'currentTime: ' + player.currentTime();
          break;
          case 'catalog_response':
            msgStr = 'url: ' + e.url;
            levelStr = 'media';
          break;
          case 'durationchange': {
            let srcStr, mediaStr, assetid;
            currentDuration = player.duration();
            currentSource = player.currentSrc();

            if (currentDuration !== previousDuration) {
              msgStr = 'currentDuration: ' + currentDuration + ',<br>previousDuration: ' + previousDuration;
              previousDuration = currentDuration; 
            } else {
              msgStr = 'Duration remained the same - currentDuration: ' + currentDuration;
            }
            if(playerTech == 'Hls') {
              currentMedia = player.hls.playlists.media_.uri;
              assetid = currentMedia.substring(currentMedia.search("assetId=")+8,92);            
              if  (currentSource !== previousSource) {
                  srcStr = '<br>Source changed: currentSource: ' + currentSource + ', <br>previousSource: ' + previousSource;
                  previousSource = currentSource;
              } else {
                srcStr = '<br>Source remained same: ' + currentSource;
              }
              if (currentMedia !== previousMedia) {
                mediaStr = '<br>Media (Rendition) changed: currentMedia ' + currentMedia + ', previousMedia: ' + previousMedia;
                previousMedia = currentMedia;
              } else {
                mediaStr = '<br>Media (Rendition) remained same: currentMedia: ' + currentMedia;
              }
              mediaStr +='<br>Bandwidth: ' + player.hls.bandwidth + 'bps';
              mediaStr +='<br>Segment Download time: ' + player.hls.segmentXhrTime + 'ms';
              msgStr = [
                msgStr,
                srcStr,
                mediaStr
              ].join(' ');
              levelStr = 'media';
            }
          }
          break; 
          default:
            msgStr='';
            levelStr = 'debug';
        }
        if ((e.type!= 'progress' && !_options.showProgress) && e.type!= 'timeupdate')  {
          
        if (_options.verbose) {
          db.logDebug(levelStr, 'playerMsg', e.type, msgStr);
        } else {
          db.logDebug(levelStr, 'playerMsg', e.type, '');
        }
        msgStr='';

        }
        if (_options.debugAds) {
          adSettings.showAdInfo(player);
        }
        classesList.refreshPlayerClasses(player);
        //db.updateLogPane(player);
      });
    }
  };


  let buildButtonBar = (slider) => {

    buttonBar = videojs.createEl('div', 
      {'id': IDs.buttonBar}
    );

    slider.appendChild(buttonBar);

    let options = {
      "id": IDs.btnToggleSlider,
      "className" : "myButton active",
      "content" : "Hide Debugger" 
    };

    btnToggleSlider = new SliderToggle(player, options);
    
    options = {
      "id": IDs.btnToggleLog,
      "className" : "myButton active",
      "content" : "Log" 
    };

    btnToggleLog = new DebugLogToggle(player, options);

    options = {
      "id": IDs.btnTogglePlaybackInfo,
      "className" : "myButton",
      "content" : "Playback Info" 
    };

    btnTogglePlaybackInfo = new PlaybackInfoToggle(player, options);

    options = {
      "id": IDs.btnToggleClassList,
      "className" : "myButton",
      "content" : "Classes" 
    };

    btnToggleClassList = new ClassListToggle(player, options);

     options = {
      "id": IDs.btnTogglePlayerSettings,
      "className" : "myButton",
      "content" : "Player Settings" 
    };

    btnTogglePlayerSettings = new PlayerSettingsToggle(player, options);

    if (_options.debugAds) {
      options = {
        "id": IDs.btnToggleAdSettings,
        "className" : "myButton",
        "content" : "Ad Settings" 
      };

      btnToggleAdSettings = new AdSettingsToggle(player, options);
    }

    /*options = {
      "id": IDs.btnToggleDebuggerSettings,
      "className" : "myButton",
      "content" : "Debugger Settings" 
    };

    btnToggleDebuggerSettings = new DebuggerSettingsToggle(player, options);
*/

    buttonBar.appendChild(btnToggleSlider.el_);
    buttonBar.appendChild(btnToggleLog.el_);
    buttonBar.appendChild(btnTogglePlaybackInfo.el_);
    buttonBar.appendChild(btnToggleClassList.el_);
    buttonBar.appendChild(btnTogglePlayerSettings.el_);
    if (_options.debugAds) {
      buttonBar.appendChild(btnToggleAdSettings.el_);
    }
//    buttonBar.appendChild(btnToggleDebuggerSettings.el_);

    return buttonBar;
  };

  let buildDebugger = (player) => {
    slider = videojs.createEl('div', 
      {
        'id': IDs.slider
      }
    );
    document.body.appendChild(slider);

    buttonBar = buildButtonBar(slider);

    logPane = db.buildLogPane(player, _options);
    slider.appendChild(logPane.el_);

   // debuggerSettingsPane = debuggerSettings.buildDebuggerSettingsPane(player);
   // slider.insertBefore(debuggerSettingsPane.el_, logPane.el_);

  //  events = (events || player.debuggerWindow.events)(db.toggleVisibility);
  
    // TypeError cannot reade property 'constructor' of undefined in AdEvent... 
    addEvent(IDs.sendEmail, 'click', db.clickSendEmail);
    addEvent(IDs.filters, 'click', db.clickFilter);
    addEvent(IDs.controls, 'click', db.clickControl);

    classesListPane = classesList.buildClassesListPane(player);
    slider.insertBefore(classesListPane, logPane.el_ );
    playbackInfoPane = playbackInfo.buildPlaybackInfoPane(player);
    slider.insertBefore(playbackInfoPane.el_, logPane.el_ );
    playerSettingsPane = playerSettings.buildPlayerSettingsPane(player);
    slider.insertBefore(playerSettingsPane.el_, logPane.el_ );

    if(_options.debugAds) {
      if (player.ima3) {
        console.log('Using IMA3 Ad Plugin');
        adSettings = imaAdSettings; 
      } 
      else if (FW_plugin) {        
        console.log('Using Freewheel Ad Plugin');
        adSettings = fwAdSettings;
      }
      adSettingsPane = adSettings.buildAdSettingsPane(player, _options);
      slider.insertBefore(adSettingsPane.el_,playerSettingsPane.el_);
    }

  };

  let setOptions = (opt) => {
    // default using line numbers to true
    if (opt.verbose === undefined) { _options.verbose = false; }
    if (opt.useLineNums === undefined) { _options.useLineNums = true; }
    if (opt.logClasses === undefined) { _options.logClasses = false; }
    if (opt.logType === undefined) { _options.logType = logTypes.list; }
    if (opt.showProgress === undefined) { _options.showProgress = false; }
    if (opt.showMediaInfo === undefined ) { _options.showMediaInfo = true;}
    if (opt.debugAds === undefined) { _options.debugAds = false; }
    if (opt.showPosterStyles === undefined) { _options.showPosterStyles = false; }
    if (opt.showBigPlayButtonStyles === undefined) { _options.showBigPlayButtonStyles = false; }
    if (opt.captureConsole === undefined ) { _options.captureConsole = true; } 
    if (opt.startMinimized === undefined ) { _options.startMinimized = false; }   

    if (_options.captureConsole) {
      db.myConsole();
    }

     if (_options.showBigPlayButtonStyles===true) {
      let bigPlayButtonStyles = document.createElement("div");
      bigPlayButtonStyles.setAttribute("id", IDs.bigPlayButtonStyles);
      logPane.appendChild(bigPlayButtonStyles);
     }
    
    if (_options.showPosterStyles===true) {
      let posterStyles = document.createElement("div");
      posterStyles.setAttribute("id", IDs.posterStyles);
      logPane.appendChild(posterStyles);
     }
    
    if (_options.startMinimized) {
      toggleSlider();
    }

  };

/**
 * Function to invoke when the player is ready.
 *
 * This is a great place for your plugin to initialize itself. When this
 * function is called, the player will have its DOM and child components
 * in place.
 *
 * @function onPlayerReady
 * @param    {Player} player
 * @param    {Object} [options={}]
 */
const onPlayerReady = (bcplayer, options) => {

  console.log('Brightcove Player Debugger loaded');
  
  //events = bcplayer.debuggerWindow.getEvents;

  //bcplayer.addClass('vjs-player-debugger');

  let fontawesome = document.createElement('link');
  fontawesome.rel = 'stylesheet';
  fontawesome.href = "//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css";
  document.body.appendChild(fontawesome);

  setOptions(options);

  buildDebugger(bcplayer);

  listenForPlayerEvents(bcplayer);

  if (_options.debugAds) {
    adSettings.listenForAdEvents (bcplayer);
  }

};

/**
 * A Brightcove video.js plugin.
 *
 * In the plugin function, the value of `this` is a video.js `Player`
 * instance. You cannot rely on the player being in a "ready" state here,
 * depending on how the plugin is invoked. This may or may not be important
 * to you; if not, remove the wait for "ready"!
 *
 * @function playerDebugger
 * @param    {Object} [options={}]
 *           An object of options left to the plugin author to define.
 */
const playerDebugger = function(options) {
  this.ready(() => {
    _options = options;
    onPlayerReady(this, videojs.mergeOptions(defaults, _options));
  });
};

// Register the plugin with video.js.
videojs.plugin('playerDebugger', playerDebugger);

// Include the version number.
playerDebugger.VERSION = '__VERSION__';

export default playerDebugger;
