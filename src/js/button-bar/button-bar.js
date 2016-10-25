/** 
 * @file button-bar.js
 */
 import videojs from 'video.js';

// Required children

import SliderToggle from './slider-toggle.js'; 
import DebugLogToggle from './log-toggle.js'; 
import ClassListToggle from './classList-toggle.js'; 
import PlayerSettingsToggle from './playerSettings-toggle.js'; 
import AdSettingsToggle from './adSettings-toggle.js'; 
import {IDs} from '../../js/componentIDs.js';

/**
 * Container for main controls
 *
 * @param {Player|Object} player
 * @param {Object=} options
 * @extends Component
 * @class ButtonBar
 */
class ButtonBar extends videojs.Component {
  
    createEl() {
      return super.createEl("div", {
        id : this.options_.id,
        dir : 'ltr'
      }, {
        'role': 'group'
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

videojs.Component.registerComponent('ButtonBar', ButtonBar);
export default ButtonBar;
