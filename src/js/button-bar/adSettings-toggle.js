/**
 * @file adSettings-toggle.js
 */

import videojs from 'video.js';
import ButtonBarButton from './buttonBar-button.js';
import document from 'global/document';

/**
 * Button to toggle the debugger's ad settings pane open / closed
 *
 * @param {Player|Object} player
 * @param {Object=} options
 * @extends Button
 * @class AdSettingsToggle
 */
class AdSettingsToggle extends ButtonBarButton {

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
    const adSettingsPane = document.getElementById('adSettings');

    this.el_.classList.toggle('active');
    adSettingsPane.classList.toggle('activePane');
    logPane.classList.toggle('adSettingsVisible');

  }

}
videojs.registerComponent('AdSettingsToggle', AdSettingsToggle);
export default AdSettingsToggle;
