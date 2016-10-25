import * as db from './debugLog.js';
import * as classesList from './classesList.js';
import DebuggerPane from './debugger-pane.js';
import { IDs } from './componentIDs.js';

  let priorAdEvents = [],
      adTimer = new Date(),
      adReadyTime,
      readyForPrerollTime,
      adRequestTime,
      adStartTime,
      adSettingsPane,
      _options;

   let ima3Html5AdEvents = [
      'ima3-ready',  // not standard IMA AdEvent
      'ima3-ad-break-ready',
      'ima3-ad-error', // not standard IMA HTML5 AdEvent - is adError
      'ima3-ad-metadata',
      'ima3-ads-manager-loaded', // not standard IMA HMTL5 AdEvent
      'ima3-all-ads-completed',
      'ima3-click',
      'ima3-complete',
      'ima3-completed',  // not standard IMA HTML5 AdEvent
      'ima3-content-pause-requested',
      'ima3-content-resume-requested',
      'ima3-error',  // not standard IMA HTML5 AdEvent
      'ima3-first-quartile',
      'ima3-impression',
      'ima3-linearChanged',
      'ima3-loaded',
      'ima3-log',
      'ima3-midpoint',
      'ima3-paused',
      'ima3-resumed',      
      'ima3-skippable-state-changed',
      'ima3-skipped',
      'ima3-started',      
      'ima3-third-quartile',
      'ima3-user-close',
      'ima3-volume-changed',
      'ima3-volume-muted',
      'ima3-start' // not standard IMA3 HTML5 AdEvent
    ];
    let ima3FlashAdEvents = [
      'ima3-adbreakready',
      'ima3-adMetadata',
      'ima3-allAdsCompleted',
      'ima3-clicked',
      'ima3-completed',
      'ima3-contentPauseRequested',
      'ima3-contentResumeRequested',
      'ima3-durationChanged',
      'ima3-adError',   // not IMA Standard Flash AdEvent
      'ima3-exitFullscreen',
      'ima3-expandedChanged',
      'ima3-firstQuartile',
      'ima3-fullScreen',
      'ima3-impression',
      'ima3-interaction',
      'ima3-linearChanged',
      'ima3-loaded',
      'ima3-log',
      'ima3-midpoint',
      'ima3-paused',
      'ima3-resumed',
      'ima3-sizeChanged',
      'ima3-skippableStateChanged',
      'ima3-skipped',
      'ima3-started',
      'ima3-stopped',
      'ima3-thirdQuartile',
      'ima3-userAcceptedInvitation',
      'ima3-userClosed',
      'ima3-userMinimized',
      'ima3-volumeChanged',
      'ima3-volumeMuted'
    ];

    let adEvents = [
      'readyforpreroll',
      'adcanplay',
      'addurationchange',
      'adplay',
      'adstart',
      'adend',
      'adtimeout',
      'adserror',
      'adscanceled',
      'adsready',
      'ads-ready',
      'preroll?',
      'ad-playback',
      'content-playback',
      'content-resuming',
      'ads-adstart',
      'ads-ad-started',
      'ads-adplay',
      'ads-adend',
      'ads-ad-ended',
      'ads-click',
      'ads-first-quartile',
      'ads-midpoint',
      'ads-third-quartile',
      'ads-complete',
      'ads-volume-change',
      'ads-pause',
      'ads-play',
      'ads-allpods-completed',
      'ads-request',
      'ads-load',
      'ads-pod-ended',
      'ads-pod-started'
    ];

  let getElapsedTime = (startTime, endTime) => {
    let startMsec = startTime.getTime();
    let endMsec = endTime.getTime();
    let elapsedTime = (endMsec- startMsec) / 1000;
    return { startTime, endTime, elapsedTime };
  };

  let getAdSettingsStr = (player) => {
    let previousStateStr = "",
        contentStr = '', 
        adStr = [
        '<h3>IMA3 Settings</h3>',
        '<span class="adMsg">IMA3 Plugin Version:</span> ' + player.ima3.version,
        '<span class="adMsg">sdkurl:</span> ' + player.ima3.settings.sdkurl,
        '<span class="adMsg">adSwf:</span> ' + player.ima3.settings.adSwf,
        '<span class="adMsg">adTechOrder:</span> ' + player.ima3.settings.adTechOrder.toString().split(' '),
        '<span class="adMsg">debug:</span> ' + player.ima3.settings.debug,
        '<span class="adMsg">loadingSpinner:</span> ' + player.ima3.settings.loadingSpinner,
        '<span class="adMsg">prerollTimeout:</span> ' + player.ima3.settings.prerollTimeout,
        '<span class="adMsg">timeout:</span> ' + player.ima3.settings.timeout,
        '<span class="adMsg">requestMode:</span> ' + player.ima3.settings.requestMode,
        '<span class="adMsg">serverUrl:</span> ' + player.ima3.settings.serverUrl
      ].join('<br>');
      contentStr = '<span class="adMsg">Ad state:</span> <span id="adstate">' + player.ads.state + '</span><br>';
      contentStr +='<span class="adMsg">Previous Ad state(s): ';
      for (let i = 0; i < priorAdEvents.length; i++) {
        previousStateStr += priorAdEvents[i] + ' -&gt; ';  
      };
      contentStr += previousStateStr + '</span><br>';
      contentStr += adStr;
      return contentStr;
  }

  let getCurrentAdStr = (player) => {
      let currentAdStr, 
        currentAdPodInfo,
        adTech;

        if (player.hasClass('vjs-ima3-flash')) {
          adTech = 'Flash';
        } else {
          if (player.hasClass('vjs-ima3-html5')) {
            adTech = 'Html5';
          } else {
            adTech = undefined;
          }
        }
        
      if ((adTech === 'Hls') || (adTech === 'Flash')) {

            currentAdStr = '<h3>Current Ad:</h3>';
            currentAdStr += [
            '<span class="adMsg">Ad System:</span> ' + player.ima3.currentAd.adSystem, 
            '<span class="adMsg">Media Url:</span> ' + player.ima3.currentAd.mediaUrl,
            '<span class="adMsg">Ad Title:</span> ' + player.ima3.currentAd.title,
            '<span class="adMsg">Description:</span> ' + player.ima3.currentAd.description,
            '<span class="adMsg">Content type:</span> ' + player.ima3.currentAd.contentType,
            '<span class="adMsg">Duration:</span> ' + player.ima3.currentAd.duration,
            '<span class="adMsg">Ad ID:</span> ' + player.ima3.currentAd.id
             ].join('<br');
          currentAdPodInfo = player.ima3.currentAd.adPodInfo;
          if (currentAdPodInfo != undefined) {
            currentAdStr += '<h3>Ad Pod Information:</h3>';
            currentAdStr += [
            '<span class="adMsg">Position:</span>' + currentAdPodInfo.adPosition,
            '<span class="adMsg">Max Duration:</span>' + currentAdPodInfo.getMaxDuration,
            '<span class="adMsg">Pod Index:</span>' + currentAdPodInfo.podIndex,
            '<span class="adMsg">Time offset:</span>' + currentAdPodInfo.timeOffset,
            '<span class="adMsg">Total Ads:</span>' + currentAdPodInfo.totalAds
           ].join('<br>');
          };
      } else {
        if (adTech === 'Html5') {
          currentAdStr = '<h3>Current Ad:</h3>';
          currentAdStr += [
            '<span class="adMsg">Ad System:</span> ' + player.ima3.currentAd.getAdSystem(), 
            //'<span class="adMsg">Media Url:</span> ' + player.ima3.currentAd.getMediaUrl(),
            '<span class="adMsg">Ad Title:</span> ' + player.ima3.currentAd.getTitle(),
            '<span class="adMsg">Description:</span> ' + player.ima3.currentAd.getDescription(),
            '<span class="adMsg">Content type:</span> ' + player.ima3.currentAd.getContentType(),
            '<span class="adMsg">Duration:</span> ' + player.ima3.currentAd.getDuration(),
            '<span class="adMsg">Ad ID:</span> ' + player.ima3.currentAd.getAdId()
            ].join('<br>');
          currentAdPodInfo = player.ima3.currentAd.getAdPodInfo();
          if (currentAdPodInfo != undefined) {
            currentAdStr += '<h3>Ad Pod Information:</h3>';
            currentAdStr += [
            '<span class="adMsg">Position:</span>' + currentAdPodInfo.getAdPosition(),
            '<span class="adMsg">Max Duration:</span>' + currentAdPodInfo.getMaxDuration(),
            '<span class="adMsg">Pod Index:</span>' + currentAdPodInfo.getPodIndex(),
            '<span class="adMsg">Time offset:</span>' + currentAdPodInfo.getTimeOffset(),
            '<span class="adMsg">Total Ads:</span>' + currentAdPodInfo.getTotalAds()
           ].join('<br>');
          }         
        }
      };
      return currentAdStr;
  }

  export let showAdInfo = (player) => {
    let adSettingsStr="", currentAdStr="", contentStr;
    if (player.ima3.settings) {
      adSettingsStr = getAdSettingsStr(player);
    };
    if (player.ima3.currentAd !== undefined) {
      currentAdStr = getCurrentAdStr(player);
    };
    contentStr = adSettingsStr + currentAdStr;
    adSettingsPane.content(contentStr);
  };


  export let listenForAdEvents = (player) => {
    console.log('player.techName_:' + player.techName_);
    if(player.techName_ === "Html5") {
      let msgStr = '', levelStr;
      for ( let i = 0; i < ima3Html5AdEvents.length; i++ ) {
        player.on(ima3Html5AdEvents[i], function (e) {
          switch(e.type) {
            case 'ima3-ready': {
              adReadyTime = new Date();
              let {elapsedTime} = getElapsedTime(adTimer, adReadyTime);           
              msgStr = [
                'IMA3 Plugin Version: ' + this.ima3.version,
                'sdkurl: ' + this.ima3.settings.sdkurl,
                'adSwf: ' + this.ima3.settings.adSwf,
                'adTechOrder: ' + this.ima3.settings.adTechOrder.toString().split(' '),
                'debug: ' + this.ima3.settings.debug,
                'loadingSpinner: ' + this.ima3.settings.loadingSpinner,
                'prerollTimeout: ' + this.ima3.settings.prerollTimeout,
                'timeout: ' + this.ima3.settings.timeout,
                'requestMode ' + this.ima3.settings.requestMode,
                'serverUrl: ' + this.ima3.settings.serverUrl,
                'Time to ready: ' + elapsedTime
              ].join('<br>');
            }
            break;
            case 'ads-request': {
              adRequestTime = new Date();
            }
            break;
            case 'ima3-loaded': {
              let {elapsedTime} = getElapsedTime(adRequestTime, new Date());     
              msgStr = 'Time to ima3-loaded: ' + elapsedTime;
            }
            break;
            case 'ima3-content-pause-requested':
            break;
            case 'ima3-impression':
            break;
            case 'ima3-started':
            break;
            case 'ima3-first-quartile':
            break;
            case 'ima3-midpoint':
            break;
            case 'ima3-third-quartile':
            break;
            case 'ima3-completed':
            case 'ima3-complete':
            break;
            case 'ima3-all-ads-completed':
            break;
            case 'ima3-content-resume-requested':
            break;
            default:
              msgStr=e.type;
              levelStr = 'debug';
          }
          classesList.refreshPlayerClasses(player);
          if (_options.verbose) {
            db.logDebug('debug', 'adMsg', e.type, 'IMA3_HTML5_AD_EVENT:' + msgStr);
          } else {
            db.logDebug('debug', 'adMsg', e.type, '');
          }
          priorAdEvents.push('event:' + e.type);
          priorAdEvents.push('state:' + player.ads.state);
          showAdInfo(player);
          if (e.type == 'IMA3-AD-ERROR') { 
            db.logDebug('error', 'adMsg', e.type, e); 
          }
        });
      };
    } else if(player.techName_ == "Hls" || player.techName_ == 'Flash' ) {
      for (let i=0; i < ima3FlashAdEvents.length; i++) {
        player.on(ima3FlashAdEvents[i], function (e) {
          switch(e.type) {
            case 'ima3-ready':            
               msgStr = [
                'IMA3 Plugin Version: ' + this.ima.version,
                'sdkurl: ' + this.ima3.settings.sdkurl,
                'adSwf: ' + this.ima3.settings.adSwf,
                'adTechOrder: ' + this.ima3.settings.adTechOrder.toString().split(' '),
                'debug: ' + this.ima3.settings.debug,
                'loadingSpinner: ' + this.ima3.settings.loadingSpinner,
                'prerollTimeout: ' + this.ima3.settings.prerollTimeout,
                'timeout: ' + this.ima3.settings.timeout,
                'requestMode: ' + this.ima3.settings.requestMode,
                'serverUrl: ' + this.ima3.settings.serverUrl
              ].join('<br>');
            break;
            case 'ads-request': {
              adRequestTime = new Date();
            }
            break;
            default:
              msgStr='';
              levelStr = 'debug';
          }
          if (_options.verbose) {
            db.logDebug('debug', 'adMsg', e.type, 'IMA3_FLASH_AD_EVENT:' + msgStr);
          } else {
            db.logDebug('error', 'adMsg', e.type, e); 
          }
          priorAdEvents.push('event:' + e.type);
          priorAdEvents.push('state:' + player.ads.state);
          classesList.refreshPlayerClasses(player);
          showAdInfo(player);
        });
      };
    }; 



    for ( let i = 0; i < adEvents.length; i++ ) {
      let msgStr ='';
      player.on(adEvents[i], function (e) {
        switch(e.type) {
          case 'readyforpreroll':{
            readyForPrerollTime = new Date(); 
            if (adRequestTime === undefined) { adRequestTime = new Date();}
            let {elapsedTime} = getElapsedTime(adRequestTime, readyForPrerollTime);          
            msgStr = 'Time to readyforpreroll: ' + elapsedTime;
          }
          break;
          case 'ads-request': {
            adRequestTime = new Date();
          }
          break;
          case 'adstart': {
          adStartTime = new Date();
            showAdInfo(player);
            let {elapsedTime} = getElapsedTime(adRequestTime, adStartTime);
            msgStr = 'Time to ad start: ' + elapsedTime;
          }
          classesList.refreshPlayerClasses(player);
          break;

        }
        if (_options.verbose) {
          db.logDebug('debug', 'adMsg', e.type , msgStr);
        } else {
          db.logDebug('debug', 'adMsg', e.type , '');
        }
        priorAdEvents.push('event:' + e.type);
        priorAdEvents.push('state:' + player.ads.state);
        showAdInfo(player);
        classesList.refreshPlayerClasses(player);
        //db.updateLogPane(player);
      });
    }
  };


  export let buildAdSettingsPane = (player, opt) => {

    let options = { 
                   'id' : IDs.adSettings, 
                   'name' : 'Ad Settings'
                  };

    _options = opt;

   adSettingsPane = new DebuggerPane(player, options);
 
   return adSettingsPane;
  }
