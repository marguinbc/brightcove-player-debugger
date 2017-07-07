/**
 * @file button-bar.js
 */
 import videojs from 'video.js';

// Required children

<<<<<<< HEAD
 import SliderToggle from './slider-toggle.js';
 import DebugLogToggle from './log-toggle.js';
 import ClassListToggle from './classList-toggle.js';
 import PlayerSettingsToggle from './playerSettings-toggle.js';
 import AdSettingsToggle from './adSettings-toggle.js';
 import {IDs} from '../../js/componentIDs.js';
=======
import SliderToggle from './slider-toggle.js';
import DebugLogToggle from './log-toggle.js';
import ClassListToggle from './classList-toggle.js';
import PlayerSettingsToggle from './playerSettings-toggle.js';
import AdSettingsToggle from './adSettings-toggle.js';
import {IDs} from '../../js/componentIDs.js';
>>>>>>> upstream/master

/**
 * Container for main controls
 *
 * @param {Player|Object} player
 * @param {Object=} options
 * @extends Component
 * @class ButtonBar
 */
<<<<<<< HEAD
 class ButtonBar extends videojs.getComponent('ClickableComponent') {

   createEl() {
     return super.createEl('div', {
       id: this.options_.id,
       dir: 'ltr'
     }, {
       'role': 'group'
     });
   }
=======
class ButtonBar extends videojs.getComponent('ClickableComponent') {

    createEl() {
      return super.createEl("div", {
        id : this.options_.id,
        dir : 'ltr'
      }, {
        'role': 'group'
      });
  }
>>>>>>> upstream/master
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

<<<<<<< HEAD
 videojs.registerComponent('ButtonBar', ButtonBar);
 export default ButtonBar;
=======
videojs.registerComponent('ButtonBar', ButtonBar);
export default ButtonBar;
>>>>>>> upstream/master
