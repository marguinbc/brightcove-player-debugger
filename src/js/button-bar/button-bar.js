/**
 * @file button-bar.js
 */
 import videojs from 'video.js';

/**
 * Container for main controls
 *
 * @param {Player|Object} player
 * @param {Object=} options
 * @extends Component
 * @class ButtonBar
 */
 class ButtonBar extends videojs.getComponent('ClickableComponent') {

   createEl() {
     return super.createEl('div', {
       id: this.options_.id,
       dir: 'ltr'
     }, {
       role: 'group'
     });
   }
}

 ButtonBar.prototype.options_ = {
   children: [
     'btnToggleSlider',
     'btnToggleLog',
     'btnToggleClassList',
     'btnTogglePlayerSettings',
     'btnToggleAdSettings'
   ]
 };

 videojs.registerComponent('ButtonBar', ButtonBar);
 export default ButtonBar;
