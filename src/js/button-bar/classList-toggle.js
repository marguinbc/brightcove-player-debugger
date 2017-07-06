/**
 * @file classList-toggle.js
 */

import videojs from 'video.js';
import { IDs } from '../componentIDs.js';
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

    var classesListPane = document.getElementById('classesList');
    var playerSettingsPane = document.getElementById('playerSettings');
    var adSettingsPane = document.getElementById('adSettings');
    var logPane = document.getElementById('myBlackbird');
    var playbackInfoPane = document.getElementById('playbackInfo');

    this.el_.classList.toggle('active');
    classesListPane.classList.toggle('activePane');
    playerSettingsPane.classList.toggle('classListVisible');
    playbackInfoPane.classList.toggle('classListVisible');
    if(adSettingsPane){
      adSettingsPane.classList.toggle('classListVisible');
    }
    logPane.classList.toggle('classListVisible');

  }

}
videojs.registerComponent('ClassListToggle', ClassListToggle);
export default ClassListToggle;
