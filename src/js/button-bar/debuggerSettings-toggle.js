/**
 * @file playerSettings-toggle.js
 */

import videojs from 'video.js';
import { IDs } from '../componentIDs.js';
import ButtonBarButton from './buttonBar-button.js';


/**
 * Button to toggle the debugger's player settings pane open / closed
 *
 * @param {Player|Object} player
 * @param {Object=} options
 * @extends Button
 * @class DebuggerSettingsToggle
 */
class DebuggerSettingsToggle extends ButtonBarButton {

  constructor(player, options) {

    super(player, options);

  }

/**
   * Handle click to toggle between open and closed
   *
   * @method handleClick
   */
  handleClick() {

    var logPane = document.getElementById('myBlackbird');
    var debuggerSettingsPane = document.getElementById('debuggerSettings');

    this.el_.classList.toggle('active');
    debuggerSettingsPane.classList.toggle('activePane');
    logPane.classList.toggle('debuggerSettingsVisible');

  }

}
videojs.registerComponent('DebuggerSettingsToggle', DebuggerSettingsToggle);
export default DebuggerSettingsToggle;
