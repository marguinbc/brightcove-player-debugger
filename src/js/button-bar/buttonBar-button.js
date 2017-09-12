/**
 * @file buttonBar-button.js
 */

import videojs from 'video.js';
const Button = videojs.getComponent('Button');

/**
 * Root button class for Debugger ButtonBar buttons
 *
 * @param {Player|Object} player
 * @param {Object=} options
 * @extends Component
 * @class ButtonBarButton
 */
class ButtonBarButton extends Button {

  constructor(player, options) {
    super(player, options);
    this.el_.id = this.options_.id;
    this.el_.className = this.options_.className;
    this.el_.innerHTML = this.options_.content;

    // this.on(['tap','click'], this.handleClick);

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
  handleClick(event) {}

}
videojs.registerComponent('ButtonBarButton', ButtonBarButton);
export default ButtonBarButton;
