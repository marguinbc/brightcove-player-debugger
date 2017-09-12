import * as db from './debugLog.js';
import * as classesList from './classesList.js';
import DebuggerPane from './debugger-pane.js';
import { IDs } from './componentIDs.js';

let debuggerSettings;
let player_;

export let buildDebuggerSettingsPane = (player) => {

  player_ = player;

   // Get information about the player to use in main content
//   let playbackInfoStr = getPlaybackInfo(player);

  let options = {
    'id': IDs.debuggerSettings,
    'name': 'Debugger Settings',
    'content': 'form goes here'
  };

  debuggerSettings = new DebuggerPane(player, options);

  return debuggerSettings;
};
