import * as db from './debugLog.js';
import * as classesList from './classesList.js';
import DebuggerPane from './debugger-pane.js';
import {IDs} from './componentIDs.js';

const priorAdEvents = [];
let readyForPrerollTime;
let adRequestTime;
let adStartTime;
let adSettingsPane;
let _options;

const ssaiAdEvents = [
  'onceux-linearad-start',
  'onceux-linearad-impression',
  'onceux-linearad-firstQuartile',
  'onceux-linearad-midpoint',
  'onceux-linearad-thirdQuartile',
  'onceux-linearad-complete',
  'onceux-adroll-start',
  'onceux-adroll-complete',
  'onceux-ads-complete',
  'onceux-linearad-skipped',
  'onceux-linearad-mute',
  'onceux-linearad-unmute',
  'onceux-linearad-pause',
  'onceux-linearad-resume',
  'onceux-companionad-creativeView'
];

const adEvents = [
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

const ppJSON = (json) => {
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
    let cls = 'number';

    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'key';
      } else {
        cls = 'string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'boolean';
    } else if (/null/.test(match)) {
      cls = 'null';
    }
    return '<span class="' + cls + '">' + match + '</span>';
  });
};

const getElapsedTime = (startTime, endTime) => {
  const startMsec = startTime.getTime();
  const endMsec = endTime.getTime();
  const elapsedTime = (endMsec - startMsec) / 1000;

  return {startTime, endTime, elapsedTime};
};

const getAdSettingsStr = (player) => {

  let previousStateStr = '';
  let adStr;
  let contentStr = '';

  if (player.onceux.timeline) {
    adStr = [
      '<h3>Once UX Settings</h3>', '<span>Timeline</span>', '<span class="adMsg">contenturi:</span> ' + player.onceux.timeline.contenturi,
      '<span class="adMsg">absoluteDuration:</span> ' + player.onceux.timeline.absoluteDuration,
      '<span class="adMsg">contentDuration:</span> ' + player.onceux.timeline.contentDuration
    ].join('<br>');
  }
  contentStr = '<span class="adMsg">Ad state:</span> <span id="adstate">' + player.ads.state + '</span><br>';
  contentStr += '<span class="adMsg">Previous Ad state(s): ';
  for (let i = 0; i < priorAdEvents.length; i++) {
    previousStateStr += priorAdEvents[i] + ' -&gt; ';
  }
  contentStr += previousStateStr + '</span><br>';
  contentStr += adStr;
  return contentStr;
};

const getCurrentAdStr = (player) => {
  let currentAdStr;
  let path;

  if (player.onceux.currentTime() !== undefined && player.onceux.timeline) {
    path = player.onceux.timeline.pathAtAbsoluteTime(player.onceux.currentTime());
  } if (path) {
    currentAdStr = '<h3>Current TimeLine Snapshot (path):</h3>';
    currentAdStr += [
      '<br/><span class="adMsg">absoluteTime:</span>' + path.absoluteTime,
      '<span class="adMsg">contentTime:</span>' + path.contentTime
    ].join('<br>');
    if (path.adRoll) {
      currentAdStr += [

        '<br/><h3 class="adMsg">adRoll:</h3>',
        '<span class="adMsg">adRolls:</span> ' + ppJSON(JSON.stringify(player.onceux.timeline.adRolls, undefined, 4)),
        '<span class="adMsg">adRoll.absoluteBeginTime:</span>' + path.adRoll.absoluteBeginTime,
        '<span class="adMsg">adRoll.absoluteEndTime:</span>' + path.adRoll.absoluteEndTime,
        '<span class="adMsg">adRoll.index:</span>' + path.adRoll.index,
        '<span class="adMsg">adRoll.linearAdCount:</span>' + path.adRoll.linearAdCount,
        '<span class="adMsg">adRoll.playCount:</span>' + path.adRoll.playCount
      ].join('<br>');
    }
    if (path.linearAd) {
      currentAdStr += [

        '<br/><h3 class="adMsg">linearAd:</h3>', '<span class="adMsg">linearAd.AdSource:</span>' + ppJSON(JSON.stringify(path.linearAd.AdSource, undefined, 4)),
        '<span class="adMsg">linearAd.absoluteBeginTime:</span>' + path.linearAd.absoluteBeginTime,
        '<span class="adMsg">linearAd.absoluteEndTime:</span>' + path.linearAd.absoluteEndTime,
        '<span class="adMsg">linearAd.breakId:</span>' + path.linearAd.breakId,
        '<span class="adMsg">linearAd.breakType:</span>' + path.linearAd.breakType,
        '<span class="adMsg">linearAd.index:</span>' + path.linearAd.index,
        '<span class="adMsg">linearAd.playCount:</span>' + path.linearAd.playCount,
        '<span class="adMsg">linearAd.skipoffset:</span>' + path.linearAd.skipoffset,
        '<span class="adMsg">linearAd.timeOffset:</span>' + path.linearAd.timeOffset,
        '<h3 class="adMsg">linearAd.companionAd:</h3>' + ppJSON(JSON.stringify(path.linearAd.companionAd, undefined, 4))

      ].join('<br>');
    }

  }
  return currentAdStr;
};

export const showAdInfo = (player) => {
  let adSettingsStr = '';
  let currentAdStr = '';

  if (player.onceux) {
    adSettingsStr = getAdSettingsStr(player);
    currentAdStr = getCurrentAdStr(player);

  }
  const contentStr = adSettingsStr + currentAdStr;

  adSettingsPane.content(contentStr);
};

export const listenForAdEvents = (player) => {
  // console.log('player.techName_:' + player.techName_);
  let msgStr = '';

  for (let i = 0; i < ssaiAdEvents.length; i++) {
    player.on(ssaiAdEvents[i], function(e) {
      switch (e.type) {
      case 'onceux-linearad-start':
        break;
      case 'onceux-linearad-impression':
        break;
      case 'onceux-linearad-firstQuartile':
        break;
      case 'onceux-linearad-midpoint':
        break;
      case 'onceux-linearad-thirdQuartile':
        break;
      case 'onceux-linearad-complete':
        break;
      case 'ima3-first-quartile':
        break;
      case 'ima3-midpoint':
        break;
      case 'ima3-third-quartile':
        break;
      case 'onceux-adroll-start':
        break;
      case 'onceux-adroll-complete':
        break;
      case 'onceux-ads-complete':
        break;
      case 'onceux-linearad-skipped':
        break;
      case 'onceux-linearad-mute':
        break;
      case 'onceux-linearad-unmute':
        break;
      case 'onceux-linearad-pause':
        break;
      case 'onceux-linearad-resume':
        break;
      case 'onceux-companionad-creativeView':
        break;
      default:
        msgStr = e.type;
      }
      classesList.refreshPlayerClasses(player);
      if (_options.verbose) {
        db.logDebug('debug', 'adMsg', e.type, 'OnceUX_AD_EVENT:' + msgStr);
      } else {
        db.logDebug('debug', 'adMsg', e.type, '');
      }
      priorAdEvents.push('event:' + e.type);
      priorAdEvents.push('state:' + player.ads.state);
      showAdInfo(player);

    });
  }
  for (let i = 0; i < adEvents.length; i++) {
    player.on(adEvents[i], function(e) {
      switch (e.type) {
      case 'readyforpreroll':
        {
          readyForPrerollTime = new Date();
          if (adRequestTime === undefined) {
            adRequestTime = new Date();
          }
          const {elapsedTime} = getElapsedTime(adRequestTime, readyForPrerollTime);

          msgStr = 'Time to readyforpreroll: ' + elapsedTime;
        }
        break;
      case 'ads-request':
        {
          adRequestTime = new Date();
        }
        break;
      case 'adstart':
        {
          adStartTime = new Date();
          showAdInfo(player);
          const {elapsedTime} = getElapsedTime(adRequestTime, adStartTime);

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

export const buildAdSettingsPane = (player, opt) => {

  const options = {
    id: IDs.adSettings,
    name: 'Ad Settings'
  };

  _options = opt;

  adSettingsPane = new DebuggerPane(player, options);

  return adSettingsPane;
};
