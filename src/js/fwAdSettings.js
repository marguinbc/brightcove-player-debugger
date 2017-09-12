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

let fwHtml5AdEvents = [
  'fw-ads-manager-loaded',
  'fw-before-ad-request',
  'fw_slotCurrentTime',
  'quartile',
  'first-quartile',
  'ads-midpoint',
  'thirdQuartile',
  'complete',
  '_pause',
  '_play',
  '_mute',
  '_un-mute',
  '_collapse',
  '_expand',
  '_resume',
  '_rewind',
  '_close',
  '_minimize',
  'adEvent',
  'IMPRESSION',
  'contentVideoPauseRequest',
  'contentVideoResumeRequest'
];
let fwFlashAdEvents = [
  'fw-ads-manager-loaded',
  'fw-before-ad-request',
  'fw_slotCurrentTime',
  'quartile',
  'first-quartile',
  'ads-midpoint',
  'thirdQuartile',
  'complete',
  '_pause',
  '_play',
  '_mute',
  '_un-mute',
  '_collapse',
  '_expand',
  '_resume',
  '_rewind',
  '_close',
  '_minimize',
  'adEvent'
];

let adEvents = [
  'readyforpreroll',
  'adcanplay',
  'addurationchange',
  'adplay',
  'adpause',
  'admuted',
  'adstart',
  'adend',
  'adtimeout',
  'advolumechange',
  'adserror',
  'adscanceled',
  'adsready',
  'ads-ready',
  'preroll?',
  'ad-playback',
  'nopreroll',
  'nopostroll',
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
  let elapsedTime = (endMsec - startMsec) / 1000;
  return { startTime, endTime, elapsedTime };
};

let getAdSettingsStr = (player) => {

  let previousStateStr = '',
    contentStr = '',
    adStr = [
      '<h3>Freewheel Settings</h3>',
      '<span class="adMsg">Freewheel Plugin Version:</span> ' + player.FreeWheelPlugin.getVersion(),
      '<span class="adMsg">sdkurl:</span> ' + player.FreeWheelPlugin.settings.Flash.sdkurl,
      '<span class="adMsg">adSwf:</span> ' + player.FreeWheelPlugin.settings.Flash.swfurl,
      '<span class="adMsg">adTechOrder:</span> ' + player.FreeWheelPlugin.settings.adTechOrder.toString().split(' ')[0],
      '<span class="adMsg">debug:</span> ' + player.FreeWheelPlugin.settings.debug,
      '<span class="adMsg">prerollTimeout:</span> ' + player.FreeWheelPlugin.settings.prerollTimeout,
      '<span class="adMsg">timeout:</span> ' + player.FreeWheelPlugin.settings.timeout,
      '<span class="adMsg">requestMode:</span> ' + player.FreeWheelPlugin.settings.requestAdsMode,
      '<span class="adMsg">serverUrl:</span> ' + player.FreeWheelPlugin.settings.Html5.serverUrl,
      '<span class="adMsg">networkId:</span> ' + player.FreeWheelPlugin.settings.Html5.networkId,
      '<span class="adMsg">siteSectionCustomId:</span> ' + player.FreeWheelPlugin.settings.Html5.siteSectionCustomId,
      '<span class="adMsg">serverUrl:</span> ' + player.FreeWheelPlugin.settings.Html5.serverUrl,
      // '<span class="adMsg">capabilities:</span> ' + player.FreeWheelPlugin.settings.Html5.capabilities.toString().split(' ')[0],
      '<span class="adMsg">keyValues:</span> ' + JSON.stringify(player.FreeWheelPlugin.settings.Html5.keyValues, null, 2),
      '<span class="adMsg">temporalSlots:</span> ' + JSON.stringify(player.FreeWheelPlugin.settings.Html5.temporalSlots, null, 2),
      '<span class="adMsg">videoAssetCustomId:</span> ' + player.FreeWheelPlugin.settings.Html5.videoAssetCustomId,
      '<span class="adMsg">videoAssetDuration:</span> ' + player.FreeWheelPlugin.settings.Html5.videoAssetDuration
    ].join('<br>');

  contentStr = '<span class="adMsg">Ad state:</span> <span id="adstate">' + player.ads.state + '</span><br>';
  contentStr += '<span class="adMsg">Previous Ad state(s): ';
  for (let i = 0; i < priorAdEvents.length; i++) {
    previousStateStr += priorAdEvents[i] + ' -&gt; ';
  }
  contentStr += previousStateStr + '</span><br>';
  contentStr += adStr;
  return contentStr;
};

let getCurrentAdStr = (player) => {
  let currentAdStr,
    currentAdPodInfo,
    adTech;

  if (player.hasClass('vjs-fw-flash')) {
    adTech = 'Flash';
  } else {
    if (player.hasClass('vjs-fw-html5')) {
      adTech = 'Html5';
    } else {
      adTech = undefined;
    }
  }

  /*    if ((adTech === 'Hls') || (adTech === 'Flash')) {

        currentAdStr = '<h3>Current Ad:</h3>';
        currentAdStr += [
        '<span class="adMsg">Media Url:</span> ' + player.ima3.currentAd.mediaUrl,
        '<span class="adMsg">Ad Title:</span> ' + player.ima3.currentAd.title,
        '<span class="adMsg">Description:</span> ' + player.ima3.currentAd.description,
        '<span class="adMsg">Content type:</span> ' + player.ima3.currentAd.contentType,
        '<span class="adMsg">Duration:</span> ' + player.ima3.currentAd.duration,
        '<span class="adMsg">Ad ID:</span> ' + player.ima3.currentAd.id
         ].join('<br');
  */
        /* currentAdPodInfo = player.ima3.currentAd.adPodInfo;
        if (currentAdPodInfo != undefined) {
          currentAdStr += '<h3>Ad Pod Information:</h3>';
          currentAdStr += [
          '<span class="adMsg">Position:</span>' + currentAdPodInfo.adPosition,
          '<span class="adMsg">Max Duration:</span>' + currentAdPodInfo.getMaxDuration,
          '<span class="adMsg">Pod Index:</span>' + currentAdPodInfo.podIndex,
          '<span class="adMsg">Time offset:</span>' + currentAdPodInfo.timeOffset,
          '<span class="adMsg">Total Ads:</span>' + currentAdPodInfo.totalAds
          ].join('<br>');
        };*/
  //    } else {
  if (adTech === 'Html5') {

    var asCurrentAdInstance = player.FreeWheelPlugin.Html5._currentSlot.getCurrentAdInstance();
    var asAdId = asCurrentAdInstance._adId;
    var asCurrentRenditionId = asCurrentAdInstance._creativeId;
    var asRenditions = asCurrentAdInstance._creativeRenditions;
    var asSlotCustomId = asCurrentAdInstance._slotCustomId;
    var asPrimaryCreativeRendition = asCurrentAdInstance._primaryCreativeRendition;
    var asPrimaryCreativeRenditionAsset = asPrimaryCreativeRendition.getPrimaryCreativeRenditionAsset();
    var currentRendition;
    var asAdDuration = asPrimaryCreativeRendition.getDuration();
    var asAdWidth = asPrimaryCreativeRendition.getWidth();
    var asAdHeight = asPrimaryCreativeRendition.getHeight();

    currentAdStr = '<h3>Current Ad:</h3>';
    currentAdStr += [
      '<span class="adMsg">Ad ID:</span> ' + asAdId,
      '<span class="adMsg">Current Rendition Id:</span> ' + asCurrentRenditionId,
      '<span class="adMsg">Media Url:</span> ' + asPrimaryCreativeRenditionAsset.getUrl(),
      '<span class="adMsg">Ad Name:</span> ' + asPrimaryCreativeRenditionAsset.getName(),
      '<span class="adMsg">Content type:</span> ' + asPrimaryCreativeRenditionAsset.getContentType(),
      '<span class="adMsg">Slot Custom Id:</span> ' + asSlotCustomId,
      '<span class="adMsg">Duration:</span> ' + asAdDuration,
      '<span class="adMsg">Height:</span> ' + asAdHeight,
      '<span class="adMsg">Width:</span> ' + asAdWidth
    ].join('<br>');
          /* currentAdPodInfo = player.ima3.currentAd.getAdPodInfo();
          if (currentAdPodInfo != undefined) {
            currentAdStr += '<h3>Ad Pod Information:</h3>';
            currentAdStr += [
            '<span class="adMsg">Position:</span>' + currentAdPodInfo.getAdPosition(),
            '<span class="adMsg">Max Duration:</span>' + currentAdPodInfo.getMaxDuration(),
            '<span class="adMsg">Pod Index:</span>' + currentAdPodInfo.getPodIndex(),
            '<span class="adMsg">Time offset:</span>' + currentAdPodInfo.getTimeOffset(),
            '<span class="adMsg">Total Ads:</span>' + currentAdPodInfo.getTotalAds()
           ].join('<br>');

          }           */

  }
      // };
  return currentAdStr;
};

export let showAdInfo = (player) => {
  let adSettingsStr = '', currentAdStr = '', contentStr = '';
  if (player.FreeWheelPlugin.settings) {
    adSettingsStr = getAdSettingsStr(player);
  }
  if ((player.FreeWheelPlugin.Html5 !== undefined) &&
        (player.FreeWheelPlugin.Html5._currentSlot) &&
        (player.FreeWheelPlugin.Html5._currentSlot.getCurrentAdInstance())) {
    currentAdStr = getCurrentAdStr(player);
  }
  contentStr = adSettingsStr + currentAdStr;
  adSettingsPane.content(contentStr);
};

export let listenForAdEvents = (player) => {
  console.log('player.techName_:' + player.techName_);
   // if(player.techName_ === "Html5") {
  let msgStr = '', levelStr;
  for (let i = 0; i < fwHtml5AdEvents.length; i++) {
    player.on(fwHtml5AdEvents[i], function(e) {
      switch (e.type) {
      case 'fw-ads-manager-loaded': {
        adReadyTime = new Date();
        let {elapsedTime} = getElapsedTime(adTimer, adReadyTime);
        msgStr = [
          'Freewheel Plugin Version: ' + this.FreeWheelPlugin.getVersion(),
          'sdkurl: ' + this.FreeWheelPlugin.settings.Flash.sdkurl,
          'adSwf: ' + this.FreeWheelPlugin.settings.Flash.swfurl,
          'adTechOrder: ' + this.FreeWheelPlugin.settings.adTechOrder.toString().split(' '),
          'debug: ' + this.FreeWheelPlugin.settings.debug,
          'prerollTimeout: ' + this.FreeWheelPlugin.settings.prerollTimeout,
          'timeout: ' + this.FreeWheelPlugin.settings.timeout,
          'requestMode ' + this.FreeWheelPlugin.settings.requestAdsMode,
          'serverUrl: ' + this.FreeWheelPlugin.settings.Html5.serverUrl,
          // 'capabilities: ' + this.FreeWheelPlugin.settings.Html5.capabilities.toString().split(' '),
          'keyValues: ' + JSON.stringify(this.FreeWheelPlugin.settings.Html5.keyValues, null, 2),
          'temporalSlots: ' + JSON.stringify(this.FreeWheelPlugin.settings.Html5.temporalSlots,null, 2),
          'videoAssetCustomId: ' + this.FreeWheelPlugin.settings.Html5.videoAssetCustomId,
          'videoAssetDuration: ' + this.FreeWheelPlugin.settings.Html5.videoAssetDuration,
          'Time to ready: ' + elapsedTime
        ].join('<br>');
      }
        break;
      case 'fw-before-ad-request': {
        adRequestTime = new Date();
      }
        break;
      case 'ima3-loaded': {
        let {elapsedTime} = getElapsedTime(adRequestTime, new Date());
        msgStr = 'Time to ima3-loaded: ' + elapsedTime;
      }
        break;
      case 'fw_slotCurrentTime':
        break;
      case 'quartile':
        break;
      case 'IMPRESSION':
        break;
      case 'first-quartile':
        break;
      case 'midPoint':
        break;
      case 'third-quartile':
        break;
      case 'completed':
      case 'complete':
        break;
      case 'contentVideoResumeRequest':
        break;
      case 'contentVideoPauseRequest':
        break;
      default:
        msgStr = e.type;
        levelStr = 'debug';
      }
      classesList.refreshPlayerClasses(player);
      if (_options.verbose) {
        db.logDebug('debug', 'adMsg', e.type, 'FW_HTML5_AD_EVENT:' + msgStr);
      } else {
        db.logDebug('debug', 'adMsg', e.type, '');
      }
      priorAdEvents.push('event:' + e.type);
      priorAdEvents.push('state:' + player.ads.state);
      showAdInfo(player);
      if (e.type == 'FW-AD-ERROR') {
        db.logDebug('error', 'adMsg', e.type, e);
      }
    });
  }
   /* } else if(player.techName_ == "Hls" || player.techName_ == 'Flash' ) {
      for (let i=0; i < fwFlashAdEvents.length; i++) {
        player.on(fwFlashAdEvents[i], function (e) {
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
*/

  for (let i = 0; i < adEvents.length; i++) {
    let msgStr = '';
    player.on(adEvents[i], function(e) {
      switch (e.type) {
      case 'readyforpreroll': {
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
        db.logDebug('debug', 'adMsg', e.type, msgStr);
      } else {
        db.logDebug('debug', 'adMsg', e.type, '');
      }
      priorAdEvents.push('event:' + e.type);
      priorAdEvents.push('state:' + player.ads.state);
      showAdInfo(player);
      classesList.refreshPlayerClasses(player);
        // db.updateLogPane(player);
    });
  }
};

export let buildAdSettingsPane = (player, opt) => {

  let paneOptions = {
    'id': IDs.adSettings,
    'name': 'Ad Settings'
  };

  _options = opt;

  adSettingsPane = new DebuggerPane(player, paneOptions);

  return adSettingsPane;
};
