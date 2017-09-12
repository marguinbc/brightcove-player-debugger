/**
 * @file debugger-pane.js
 */
 import videojs from 'video.js';
 const dom = videojs.dom || videojs;

/**
 * Base class to add Panes to the Debugger Window
 *
 * @param {Player|Object} player
 * @param {Object=} options
 * @extends Component
 * @class DebuggerPane
 */
 class DebuggerPane extends videojs.getComponent('Component') {

   constructor(player, options) {

     super(player, options);

    // this.content(this.options_.content);

     this.el_ = dom.createEl('div',
       {
         id: this.options_.id
       }

    );

     this.headerEl_ = dom.createEl('div',
      {className: 'header'}
    );
     this.headerEl_.innerHTML = '<h2>' + this.options_.name + '</h2>';
     this.el_.appendChild(this.headerEl_);

     this.contentEl_ = dom.createEl('div', {className: 'main'});
     this.contentEl_.innerHTML = this.options_.content;
     this.el_.appendChild(this.contentEl_);

     this.footerEl_ = dom.createEl('div', {className: 'footer'});
     this.el_.appendChild(this.footerEl_);
     return this;
   }

   content(value) {
     if (typeof value !== 'undefined') {
       this.contentEl_.innerHTML = value;
     }
     return this.contentEl_.innerHTML;
   }

}

 videojs.registerComponent('DebuggerPane', DebuggerPane);
 export default DebuggerPane;
