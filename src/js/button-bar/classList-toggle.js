/**
 * @file classList-toggle.js
 */

import videojs from 'video.js';
import ButtonBarButton from './buttonBar-button.js';

/**
 * Button to toggle the debugger's classList pane open / closed
 *
 * @param {Player|Object} player
 * @param {Object=} options
 * @extends Button
 * @class ClassListToggle
 */
class ClassListToggle extends ButtonBarButton {

  constructor(player, options) {
    super(player, options);
  }

/**
   * Handle click to toggle between open and closed
   *
   * @method handleClick
   */
  handleClick(event) {

    const classesListPane = document.getElementById('classesList');
    const playerSettingsPane = document.getElementById('playerSettings');
    const adSettingsPane = document.getElementById('adSettings');
    const logPane = document.getElementById('myBlackbird');
    const playbackInfoPane = document.getElementById('playbackInfo');

    this.el_.classList.toggle('active');
    classesListPane.classList.toggle('activePane');
    playerSettingsPane.classList.toggle('classListVisible');
    playbackInfoPane.classList.toggle('classListVisible');
    if (adSettingsPane) {
      adSettingsPane.classList.toggle('classListVisible');
    }
    logPane.classList.toggle('classListVisible');

  }

}
videojs.registerComponent('ClassListToggle', ClassListToggle);
export default ClassListToggle;
