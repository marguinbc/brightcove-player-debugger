/**
 * @file slider-toggle.js
 */

import videojs from 'video.js';
import { IDs } from '../componentIDs.js';
import ButtonBarButton from './buttonBar-button.js';

/**
 * Button to toggle slider open / closed
 *
 * @param {Player|Object} player
 * @param {Object=} options
 * @extends Button
 * @class SliderToggle
 */
class SliderToggle extends ButtonBarButton {

  constructor(player, options) {
    super(player, options);
  }

/**
   * Handle click to toggle between open and closed
   *
   * @method handleClick
   */
  handleClick() {

    this.el_.classList.toggle('active');
    slider.classList.toggle('closed');
    // toggle closed on debugger window
    if (slider.classList.contains('closed')) {
      this.handleOpen();
    } else {
      this.handleClose();
    }
   // show/hide siblings
    const btnToggleLog = document.getElementById(IDs.btnToggleLog);
    const btnToggleClassList = document.getElementById(IDs.btnToggleClassList);
    const btnToggleAdSettings = document.getElementById(IDs.btnToggleAdSettings);
    const btnTogglePlayerSettings = document.getElementById(IDs.btnTogglePlayerSettings);
    const btnTogglePlayerInfo = document.getElementById(IDs.btnTogglePlaybackInfo);

    btnToggleLog.classList.toggle('hide');
    btnTogglePlaybackInfo.classList.toggle('hide');
    btnToggleClassList.classList.toggle('hide');
    if (btnToggleAdSettings) {
      btnToggleAdSettings.classList.toggle('hide');

    }
    btnTogglePlayerSettings.classList.toggle('hide');
  }

  handleOpen() {
    this.el_.innerHTML = 'Show Debugger';
  }

  handleClose() {
    this.el_.innerHTML = 'Hide Debugger';
  }

}
videojs.registerComponent('SliderToggle', SliderToggle);
export default SliderToggle;
