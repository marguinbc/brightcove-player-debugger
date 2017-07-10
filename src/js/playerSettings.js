import * as db from './debugLog.js';
import * as classesList from './classesList.js';
import DebuggerPane from './debugger-pane.js';
import { IDs } from './componentIDs.js';

let playerSettingsPane;

let getPlayerInfo = (player) => {
  let playerStr, configUrl, plyrUrl;
  let plyrID = player.el_.getAttribute('data-player');
  let acct = player.el_.getAttribute('data-account');
  playerStr = '<h3>Player Information:</h3>';
  if (plyrID !== null) {
    playerStr += '<span class="playerMsg">Player ID:</span> ' + plyrID + '<br>';
  }
  if (acct !== null) {
    playerStr += '<span class="playerMsg">Account ID:</span> ' + acct + '<br>';
    configUrl = 'http://players.brightcove.net/' + acct + '/' + plyrID + '_default/config.json';
  }
  playerStr += '<span class="playerMsg">Player Tech:</span> ' + player.techName_ + '<br>';
  playerStr += '<span class="playerMsg">Playback Rate:</span>' + player.playbackRate() + '<br>';
  playerStr += '<span class="playerMsg">preload: </span>' + player.preload() + '<br>';
  playerStr += '<span class="playerMsg">autoplay: </span>' + player.autoplay() + '<br>';
  playerStr += '<span class="playerMsg">loop: </span>' + player.loop() + '<br>';
  playerStr += '<span class="playerMsg">paused: </span>' + player.paused() + '<br>';
  playerStr += '<span class="playerMsg">volume: </span>' + player.volume() + '<br>';
  playerStr += '<span class="playerMsg">muted: </span>' + player.muted() + '<br>';
  playerStr += '<span class="playerMsg">height: </span>' + player.height() + '<br>';
  playerStr += '<span class="playerMsg">width: </span>' + player.width() + '<br>';
  playerStr += '<span class="playerMsg">videoHeight: </span>' + player.videoHeight() + '<br>';
  playerStr += '<span class="playerMsg">videoWidth: </span>' + player.videoWidth() + '<br>';
  if (plyrID !== null || acct !== null) {
    plyrUrl = 'http://players.brightcove.net/' + acct + '/' + plyrID + '_default/index.html';
    playerStr += '<span class="playerMsg">Standalone player:</span> <a style="color: white;" href="' + plyrUrl + '" target="_blank">' + plyrUrl + '</a><br>';
    playerStr += '<span class="playerMsg">Player config.json:</span> <a style="color: white;" href="' + configUrl + '" target="_blank">' + configUrl + '</a><br>';

  }
    return {playerStr, configUrl, plyrUrl};
};

let getMediaInfoStr = (player, mInfo) => {
  let mStr = '';
  if (mInfo != undefined) {
    mStr = '<h3>Mediainfo</h3>';
    mStr += [
      '<span class="playerMsg">Account ID:</span> ' + mInfo.account_id,
      '<span class="playerMsg">Video ID:</span> ' + mInfo.id,
      '<span class="playerMsg">Title:</span> ' + mInfo.name,
      '<span class="playerMsg">Duration:</span> ' + mInfo.duration,
      '<span class="playerMsg">Description:</span> ' + mInfo.description,
      '<span class="playerMsg">Long Description:</span> ' + mInfo.long_description,
      '<span class="playerMsg">Poster:</span> ' + mInfo.poster,
      '<span class="playerMsg">Thumbnail:</span> ' + mInfo.thumbnail
    ].join('<br>');
    if (mInfo.sources) {
      let sourcesStr = getSourcesStr(mInfo.sources);
      mStr += '<br><span class="playerMsg">Current Source:</span> ' + player.currentSrc();
      if (player.tech_.hls) {
        mStr += '<br><span class="playerMsg">Master:</span>' + player.tech_.hls.source_.src;
      }
      mStr += '<br><span class="playerMsg">Sources:</span> <br>' + sourcesStr;
    } else {
      mStr = '<span class="playerMsg">Current Source:</span> ' + player.src() + '<br>';
    }
  }
  return mStr;
};

let getSourcesStr = (mSrcArray) => {
  let sourcesStr = '';
  for (let i = 0; i < mSrcArray.length; i++) {
    let httpSrc = mSrcArray[i].src;
    if (httpSrc != undefined) {
      sourcesStr += '[' + i + '] ' + httpSrc + '<br>';
    } else {
      let rtmpSrc = mSrcArray[i].app_name + mSrcArray[i].stream_name;
      if (rtmpSrc != undefined) {
        sourcesStr += '[' + i + '] ' + rtmpSrc + '<br>';
      }
    }
  }
  return sourcesStr;
};

export let buildPlayerSettingsPane = (player) => {

  let mediaInfo = '', mediaStr = '';

   // Get information about the player to use in main content
  let {playerStr} = getPlayerInfo(player);

  mediaInfo = player.mediainfo;
  mediaStr = getMediaInfoStr(player, mediaInfo);

  let _options = {
    'id': IDs.playerSettings,
    'name': 'Brightcove Player Settings',
    'content': playerStr + mediaStr || ''
  };

  playerSettingsPane = new DebuggerPane(player, _options);

  return playerSettingsPane;
};

export let showPlayerSettings = (player) => {
  let mediaInfo, mediaStr, adStr, srcArray, contentStr;

      // Get information about the player to use in main content
  let {playerStr} = getPlayerInfo(player);

  contentStr = playerStr;

  mediaInfo = player.mediainfo;
  mediaStr = getMediaInfoStr(player, mediaInfo);

  contentStr += mediaStr;

  playerSettingsPane.content(contentStr);
};
