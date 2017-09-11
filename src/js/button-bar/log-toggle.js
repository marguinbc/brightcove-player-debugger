/**
 * @file log-toggle.js
 */
import videojs from 'video.js';
import { IDs } from '../componentIDs.js';
import ButtonBarButton from './buttonBar-button.js';

/**
 * Button to toggle the debugger's ad settings pane open / closed
 *
 * @param {Player|Object} player
 * @param {Object=} options
 * @extends Button
 * @class DebugLogToggle
 */
class DebugLogToggle extends ButtonBarButton {

  constructor(player, options) {

    super(player, options);
  }
/**
   * Handle click to toggle between open and closed
   *
   * @method handleClick
   */
  handleClick() {

    const logPane = document.getElementById('myBlackbird');

    this.el_.classList.toggle('active');
    logPane.classList.toggle('activePane');

  }

}
videojs.registerComponent('DebugLogToggle', DebugLogToggle);
export default DebugLogToggle;
