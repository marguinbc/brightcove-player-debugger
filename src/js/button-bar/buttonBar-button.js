/** 
 * @file buttonBar-button.js
 */

import videojs from 'video.js';
import { IDs } from '../componentIDs.js';


/**
 * Root button class for Debugger ButtonBar buttons
 *
 * @param {Player|Object} player
 * @param {Object=} options
 * @extends Component
 * @class ButtonBarButton
 */
class ButtonBarButton extends videojs.Component {

  constructor(player, options) {

    super(player, options);
    this.el_ = videojs.createEl("button", 
      {
        "id" : this.options_.id,
        "className": this.options_.className
      }
    );
    this.el_.innerHTML = this.options_.content;

    this.on('click', this.handleClick);
  }

  content(value) {
    if (typeof value !== 'undefined') {
      this.contentEl_.innerHTML = value;
    }
    return this.contentEl_.innerHTML;
  }

/**
   * Handle click to toggle between open and closed
   *
   * @method handleClick
   */
  handleClick() {}

}
videojs.Component.registerComponent('ButtonBarButton', ButtonBarButton);
export default ButtonBarButton;
