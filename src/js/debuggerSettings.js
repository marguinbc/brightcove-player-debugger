import DebuggerPane from './debugger-pane.js';
import { IDs } from './componentIDs.js';

let debuggerSettings;

export const buildDebuggerSettingsPane = (player) => {

   // Get information about the player to use in main content
//   let playbackInfoStr = getPlaybackInfo(player);

  const options = {
    id: IDs.debuggerSettings,
    name: 'Debugger Settings',
    content: 'form goes here'
  };

  debuggerSettings = new DebuggerPane(player, options);

  return debuggerSettings;
};
