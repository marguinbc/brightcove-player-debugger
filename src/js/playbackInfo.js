import * as db from './debugLog.js';
import * as classesList from './classesList.js';
import DebuggerPane from './debugger-pane.js';
import { IDs } from './componentIDs.js';

let playbackInfoPane;
let player_;
let highestMeasuredBitrate = 0;
let lowestMeasuredBitrate = 0;
let highestVideoBitrate = 0;
let lowestVideoBitrate = 0;
let currentSegment = null;
let currentSegmentEnd = null;
let currentSegmentDuration = null;
let previousSegment = null;
let previousSegmentEnd = null;
let previousSegmentDuration = null;

let timeRangesToString = function timeRangesToString(tr) {
  var arr = [];
  for (let i = 0; i < tr.length; i++) {
    arr.push('[' + tr.start(i).toFixed(2) + ', ' + tr.end(i).toFixed(2) + ']');
  }
  return arr;
};

let calcVideoBitrate = function calcVideoBitrate(pl) {
  var vbr = 0;
  if (pl && pl.attributes && pl.attributes.BANDWIDTH) {
    vbr = (pl.attributes.BANDWIDTH / 1024).toFixed(3);
    if (parseFloat(vbr) >= highestVideoBitrate || highestVideoBitrate === 0) {
      highestVideoBitrate = vbr;
    }
    if (parseFloat(vbr) <= lowestVideoBitrate || lowestVideoBitrate === 0) {
      lowestVideoBitrate = vbr;
    }
    return vbr + ' kbps';
  }
};

let calcMeasuredBitrate = function calcMeasuredBitrate(hls) {
  var mbr;
  if (hls.bandwidth) {
    mbr = (hls.bandwidth / 1024).toFixed(3);
    if (parseFloat(mbr) >= highestMeasuredBitrate || highestMeasuredBitrate === 0) {
      highestMeasuredBitrate = mbr;
    }
    if (parseFloat(mbr) <= lowestMeasuredBitrate || lowestMeasuredBitrate === 0) {
      lowestMeasuredBitrate = mbr;
    }
    return mbr + ' kbps';
  }
};

let getCurrentSegmentInfo = function getCurrentSegmentInfo(pl) {
  var currentSegmentStr;
  if (pl.segments.length > 0) {
    var currTime = player_.currentTime();
    var segments = pl.segments;
    var lower;
    var upper;
    for (var i = 0; i < segments.length - 1; i++) {
      if (segments[i].end !== undefined) {
        lower = segments[i].end - segments[i].duration;
      } else {
        lower = 0;
      }
      upper = segments[i].end;
      if (upper === undefined) {
        upper = segments[i].duration;
      }
      if ((currTime >= lower) && (currTime <= upper)) {
        // currTime between segment start/end so we are playing this segment
        currentSegmentStr = segments[i].uri;
        if (currentSegment !== currentSegmentStr) {
          previousSegment = currentSegment;
          previousSegmentDuration = currentSegmentDuration;
          previousSegmentEnd = currentSegmentEnd;

          currentSegment = currentSegmentStr;
          currentSegmentEnd = segments[i].end;
          currentSegmentDuration = segments[i].duration;

          var debugMsg = 'Previous segment: ' + previousSegment +
            '<br>Previous segment start: ' + (previousSegmentEnd - previousSegmentDuration) +
            ' Previous segment end: ' + previousSegmentEnd +
            ' Previous segment duration: ' + previousSegmentDuration;

          debugMsg += '<br>Current segment: ' + currentSegment +
            '<br>Current segment start: ' + (currentSegmentEnd - currentSegmentDuration) +
            ' Current segment end: ' + currentSegmentEnd +
            ' Current segment duration: ' + currentSegmentDuration;

          db.logDebug('debug', 'playerMsg', 'SEGMENT-CHANGE-RECORDED', debugMsg);
        }

        // how to determine when to update previous
        // null until it is set, can it simply be i-1?
        // if (previousSegment !== null && currentSegment !== previousSegment) {
        //  previousSegment = currentSegment;
        //  previousSegmentDuration = currentSegmentDuration;
        //  previousSegmentEnd = currentSegmentEnd;
       // }
        return currentSegmentStr;
      }
    }
  }
};

let loadedSegments = function loadedSegments(m_) {
  var segArr = [];
  if (m_.segments.length > 0) {
    for (var i = 0; i < m_.segments.length; i++) {
      segArr.push('[' + i + '] ' + m_.segments[i].uri + ' end: ' + m_.segments[i].end + '<br>');
    }
    return segArr;
  }
};

let getPlaybackInfo = (player) => {
  let playbackInfoStr;
  let playlist;
  let plyrID = player.el_.getAttribute('data-player');
  let acct = player.el_.getAttribute('data-account');

  if (player.tech_.hls) {
    playlist = player.tech_.hls.playlists.media_;
  }
  playbackInfoStr = '<h3>Video Playback Information:</h3>';
  playbackInfoStr += '<span class="playerMsg">TechName: </span> ' + player.techName_;
  playbackInfoStr += '<br><span class="playerMsg">Current Source: </span> ' + player.currentSrc();
  if (player.tech_.hls) {
    if (player.tech_.hls.playlists.media_) {
      playbackInfoStr += '<br><span class="playerMsg">Master: </span>' + player.tech_.hls.playlists.media_.resolvedUri;
      playbackInfoStr += '<br><span class="playerMsg">Current Segment: </span> ' + getCurrentSegmentInfo(playlist);
      playbackInfoStr += '<br><span class="playerMsg">Previous Segment: </span> ' + previousSegment;
    }
  }
  playbackInfoStr += '<br><span class="playerMsg">duration: </span>' + player.duration();
  playbackInfoStr += '<br><span class="playerMsg">currentTime: </span>' + player.currentTime().toFixed(2);
  var bufferedRange = player.buffered();
  if (bufferedRange.length > 0) {
    var bufferedStr = timeRangesToString(bufferedRange);
    playbackInfoStr += '<br><span class="playerMsg">buffered: </span>' + bufferedStr;
  }
  playbackInfoStr += '<br><span class="playerMsg">bufferedEnd: </span>' + player.bufferedEnd();
  var seekableRange = player.seekable();
  if (seekableRange.length > 0) {
    var seekableStr = timeRangesToString(seekableRange);
    playbackInfoStr += '<br><span class="playerMsg">seekable: </span>' + seekableStr;
  }
  playbackInfoStr += '<br><span class="playerMsg">playbackRate: </span>' + player.playbackRate();
  if (playlist !== undefined) {
    playbackInfoStr += '<br><span class="playerMsg">current videoBitrate: </span>' +
    calcVideoBitrate(playlist) +
    '<span class="playerMsg"> highest: </span>' + highestVideoBitrate + ' kbps' +
    '<span class="playerMsg"> lowest: </span>' + lowestVideoBitrate + 'kbps';
  }
  if (player.tech_.hls) {
    playbackInfoStr += '<br><span class="playerMsg">current measuredBitrate: </span>' +
    calcMeasuredBitrate(player.tech_.hls) +
    '<span class="playerMsg"> highest: </span>' + highestMeasuredBitrate +
    '<span class="playerMsg"> lowest: </span>' + lowestMeasuredBitrate;
  }
  if (player.tech_.hls && player.tech_.hls.playlists.media_) {
    playbackInfoStr += '<br><span class="playerMsg">Total Segments:</span>' + player.tech_.hls.playlists.media_.segments.length;
    playbackInfoStr += '<br><span class="playerMsg">Current Segments:</span><br>' + loadedSegments(playlist).join('');
  }
  return playbackInfoStr;
};

/* let getMediaInfoStr = (player, mInfo) => {
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
          '<span class="playerMsg">Poster:</span> ' +  mInfo.poster,
          '<span class="playerMsg">Thumbnail:</span> ' + mInfo.thumbnail
        ].join('<br>');
    if (mInfo.sources) {
          let sourcesStr = getSourcesStr(mInfo.sources);
          mStr += '<br><span class="playerMsg">Current Source:</span> ' + player.currentSrc();
          mStr += '<br><span class="playerMsg">Master:</span>' + player.tech_.hls.source_.src;
          mStr += '<br><span class="playerMsg">Sources:</span> <br>' + sourcesStr;
        } else {
          mStr = '<span class="playerMsg">Current Source:</span> ' + player.src() + '<br>';
        }
  }
  return mStr;
}
*/

/* let getSourcesStr = (mSrcArray) => {
  let sourcesStr="";
        for (let i=0; i < mSrcArray.length; i++ ) {
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
}
*/

export let buildPlaybackInfoPane = (player) => {

  // let mediaInfo='', mediaStr='';
  player_ = player;

   // Get information about the player to use in main content
  let playbackInfoStr = getPlaybackInfo(player);

  // mediaInfo = player.mediainfo;
  // mediaStr = getMediaInfoStr(player, mediaInfo);

  let options = {
    'id': IDs.playbackInfo,
    'name': 'Playback Information',
    'content': playbackInfoStr
  };

  playbackInfoPane = new DebuggerPane(player, options);

  return playbackInfoPane;
};

export let showPlaybackInfo = (player) => {
  let mediaInfo, mediaStr, adStr, srcArray, contentStr;

      // Get information about the player to use in main content
  let playbackInfoStr = getPlaybackInfo(player);

     // contentStr = playerStr;

      // mediaInfo = player.mediainfo;
      // mediaStr = getMediaInfoStr(player, mediaInfo);

      // contentStr += mediaStr;

  playbackInfoPane.content(playbackInfoStr);
};
