# brightcove-player-debugger

brightcove-player-debugger is a plugin for the Brightcove Player that will log, capture and display various information about the player, media and advertising in use. With this plugin, you can observe:

## Example:
http://solutions.brightcove.com/marguin/debugger/index.html

## Features:

 - Attaches itself to a Brightcove Player by using the video element’s ID attribute
 - Can be minimized to reduce impact when testing players in the wild
 - Listens for player events using player.on() and logs them to the Log div.
 - Captures the browser’s debug console log entries and adds them to itself.
 - Records media info for the current video loaded in the player
 - Records IMA3 ad settings when IMA plugin is used
 - Records Freewheel ad settings when FW plugin is used
 - Records the current Ad information when an ad is playing (pause the player to make sure you can view the info in the Ad Settings Tab)
 - Captures and displays the current ‘player state’ using the CSS classes that are attached to the player
 - Can toggle player state by clicking on the class name and adding/removing classes from the player
 - Can toggle the display of the Log, Classes, Player Settings, Ad Settings 

### Conveniently Show/Hide the debugger
The debugger will attach itself below the first player on the page. Using the Show/Hide debugger button it can be colapsed to take up just enough space for the Show Debugger button.  

You can also toggle the visibility for any of the four debugger panes: Player Classes, Ad Setting, Player Settings and the Log.

[Configuring Player Options](#options)

## Tabs
 - [Log](#log)
 - [Player Settings](#player_settings)
 - [Playback Info](#playback_info)
 - [Classes](#player_classes)
 - [Ad Settings](#ad_settings)
 -- [IMA3](#ima3_ad_settings)
 -- [Freewheel](#freewheel_ad_settings)

### <a name="options"></a>Debugger Options
 - verbose (default=false): log detailed player and ad event messages
 - useLineNums (default=false): include line numbers in log output
 - logClasses (default=false): log player classes with each event; useful for tracking player state
 - logType (default=list): choose the type of log; choices: table, list
 - showProgress (default=false): log progess events
 - showMediaInfo (default=true): include the mediainfo in the Player Settings Pane
 - debugAds (default=true): log ad events and debugging information
 - showPosterStyles (default=false): log and record poster classes and styles
 - captureConsole (default=true): include messages output to JS console in log
 - startMinimized (default=false): start in minimized (button) state

## Player Tabs
### <a name="log"></a>Log
The Log pane displays all of the player events that the plugin has captured. If an event exposes additional information, that information can also be displayed. For example, on loadedmetadata, the account id, video id, duration and short description are also displayed.

You can set the option verbose to false to only log the events without the event details.

The log includes filters to show/hide the following types of events:
 - Player events - events associated with the player’s activity
 - Loading events - 
 - Ad events - ima3, contrib-ads and other ad-related events
 - Console log events - events written to the console by the player, plugins or browser
 - Other events (not categorized)

### <a name="player_settings"></a>Player Settings
Displays the media info for the current video loaded in the player including renditions, sources, master files, etc.
  - Player ID
  - Account ID
  - Player Tech
  - Standalone player url
  - Config file URL

#### Mediainfo
  - Video ID
  - Title
  - Duration
  - Description
  - Long Description
  - Poster URL
  - Thumbnail URL
  - Sources array
  - Current Source URL

### <a name="playback_info"></a>Playback Info (hls only)
  - TechName
  - Current Source
  - Master (hls)
  - Current Segment (best guess)
  - Previous Segment (best guess)
  - Duration (Infinity for Live)
  - currentTime
  - buffered: timeRanges for buffered content
  - bufferedEnd: end time content is buffered until
  - seekable: seekable range for video (though can't really seek in live without DVR)
  - playbackRate
  - videoBitRate (from manifest)
  - highestVideoBitrate
  - lowestVideoBitrate
  - measuredBitRate (calculated)
  - highestMeasuredBitrate 
  - lowestMeasuredBitrate
  - Total segments in master
  - Current Segments: lists the filenames and end times for the segments currently loaded



### <a name="ad_settings"></a>Ad Events and States
The debugger captures and records ad events and the state of the player at the time the event occured, creating a breadcrumb trail which makes it easier to see the progression of events during ad playback.

### <a name="ima3_ad_settings"></a>Ad Settings - IMA3
Displays the current IMA3 configuration and current Ad information
  - IMA3 Plugin version
  - IMA3 SDK URL
  - IMA3 AdSwf URL
  - Ad techOrder
  - loadingSpinner
  - debug
  - prerollTimeout
  - timeout
  - requestMode
  - serverURL
 
### Current Ad Information
  - Ad System
  - Media URL
  - Title
  - Description
  - Content Type
  - Duration
  - ID
  - Includes Ad Pod Information when available

### <a name="freewheel_ad_settings"></a>Ad Settings - Freewheel
Displays the current Freewheel configuration and current Ad information
  - Freewheel Plugin version
  - Freewheel SDK URL
  - Freewheel AdSwf URL
  - Ad techOrder
  - debug
  - prerollTimeout
  - timeout
  - requestMode
  - networkId
  - siteSectionCustomId
  - serverURL
  - keyValues
  - temporalSlots
  - videoAssetCustomId
  - videoAssetDuration
 
### Current Ad Information
  - Ad Id
  - Current Rendition Id
  - Media Url
  - Ad Name
  - Content type
  - Slot Custom Id
  - Duration
  - Ad Height
  - Ad Width
  - Coming soon ( slot / pod information)
 
### <a name="player_classes"></a>Player CLasses
The debugger also includes a panel to view CSS classes attached to the player. Active classes show up in green/bold text, inactive in white/normal text. You can click on a class to apply it to the player to test various player states.
 
| Classes | |
| ---- | --- |
| ima3-loading-spinner   | vjs-live                   |
| vjs-ad-controls        | vjs-mouse                  |
| vjs-ad-loading         | vjs-no-flex                |
| vjs-ad-playing         | vjs-paused                 |
| vjs-audio              | vjs-ad-playing             |
| vjs-controls-disabled  | vjs-plugins-ready          |
| vjs-controls-enabled   | vjs-scrubbing              |
| vjs-ended              | vjs-seeking                |
| vjs-error              | vjs-touch-enabled          |
| vjs-fluid              | vjs-user-active            |
| vjs-fullscreen         | vjs-user-inactive          |
| vjs-has-started        | vjs-using-native-controls  |
| vjs-ima3-flash         | vjs-waiting                |
| vjs-ima3-html5         | not-hover                  |
 
 
### What's Next?
 - Converting modules to Classes
 - Converting to use Brightcove's Plugin Framework
 - Additional Functionality
 - Installation Instructions
 - More Documentation
 - ????

### Version
0.5.0

### Tech

videojs-player-debugger uses a number of open source projects to work properly:

* ECMAScript6
* babel / babel-cli / babel-core / bable-loader / babel-preset-es2015
* npm

### Installation
```sh 
npm install
```

### Build steps

Build the plugin
```sh 
npm run build 
```

Run the http-server to view the sample player implementation
```sh
npm start
```

Load the test page: http://localhost:9999
