import {IDs} from './componentIDs.js';
import DebuggerPane from './debugger-pane.js';

let   _options,
      logEvents = [],
      cache = [],
      emailArray = [],
      currentEvent,
      lineNum=0,
      log,
      logContainer,
      frogger,
      outputList,
      messageTypes = { 
      //order of these properties imply render order of filter controls
        player: true,
        loading: true,
        ads: true,
        console: true,
        other: true
      },
      _player,
      logTypes = {
        array: 'array',
        table: 'table',
        list: 'list',
        json: 'json'
      };

let timeString = () => {
    let d = new Date();
    let timestamp = (d.getMonth() + 1) + '/' + (d.getDate()) + '/' + (d.getFullYear()) + ' ' +
                    (d.getHours()) + ':' + (d.getMinutes()) + ':' + (d.getSeconds()) +
                    (_options.logMilliseconds ? ':' + (d.getMilliseconds()) : '');
    return timestamp;
  };

 export let clickSendEmail = (evt) => {
      let el;
      if (!evt) {
        evt = window.event;
      }
      el = (evt.target) ? evt.target : evt.srcElement;
      window.open('mailto:email@example.com?subject=Brightcove Player Debugger Log&body=' + encodeURIComponent(emailArray.join('\n')));
  };

  let hide = () => {
    //frogger.style.display = 'none';
    var logPane = document.getElementById('myBlackbird');
    var btnToggleLog = document.getElementById(IDs.btnToggleLog);

    btnToggleLog.classList.toggle('active');
    logPane.classList.toggle('activePane');
  };

  let scrollToBottom = () => { 
    //scroll list output to the bottom
    outputList.scrollTop = outputList.scrollHeight;
  };

  export let clickFilter = (evt) => { 
  //show/hide a specific message type
    let entry, span, type, filters, active, oneActiveFilter, i, spanType, disabledTypes;

    if (!evt) {
      evt = window.event;
    }
    span = (evt.target) ? evt.target : evt.srcElement;

    if (span && span.tagName == 'SPAN') {

      type = span.getAttributeNode('type').nodeValue;

      if (evt.altKey) {
        filters = document.getElementById(IDs.filters).getElementsByTagName('SPAN');

        active = 0;
        for (entry in messageTypes) {
          if (messageTypes[entry]) active++;
        }
        oneActiveFilter = (active == 1 && messageTypes[type]);

        for (i = 0; filters[i]; i++) {
          spanType = filters[i].getAttributeNode('type').nodeValue;

          filters[i].className = 'fa ' + spanType + ((oneActiveFilter || (spanType == type)) ? '' : ' disabled');
          messageTypes[spanType] = oneActiveFilter || (spanType == type);
        }
      }
      else {
        messageTypes[type] = ! messageTypes[type];
        span.className = 'fa ' + type + ((messageTypes[type]) ? '' : ' disabled');
      }

      //build outputList's class from messageTypes object
      disabledTypes = [];
      for (type in messageTypes) {
        if (! messageTypes[type]) {
          disabledTypes.push(type);
        }
      }
      disabledTypes.push('');
      outputList.className = disabledTypes.join('Hidden ');

      scrollToBottom();
    }
  };



export let myConsole = () => {
    
    let console = window.console;
    let messagestr = '';

    if (!console) return;

    function intercept(method) {
      let original = console[method];

      console[method] = function ()  {

        let logHTML;
        let timestr = timeString();

        // capture console messages to log div on page
        if (original.apply) {

          // if the message is an object, concatenate
          if (typeof arguments == 'object') {
            let message = Array.prototype.slice.apply(arguments).join(' ');
            messagestr = "";
            for (let q = 0; q < arguments.length; q++) {
              if (typeof arguments[q] == 'string') {
                messagestr += arguments[q] + ' ';
              }
            }
            currentEvent = messagestr;
          } else {
            // else just log out the string to the div            
            messagestr = message;
          }
          myAddMessage('debug', timestr, 'console', messagestr, '', '');
          // log object to console.log as intended
          original.apply(console, arguments);
        } else  {
          // needed for IE since apply does not work there
          let message = Array.prototype.slice.apply(arguments).join(' ');
          original(message);
          myAddMessage('debug', timestr, 'console', message, '', '');
        }
      }
    }
    let methods = ['log', 'warn', 'error'];
    for (let i = 0; i < methods.length; i++) {
      intercept(methods[i]);
    }
  }; 

export let myAddMessage = (level, timeStr, type, eventType, content, playerclasses) => { 
    //adds a message to the output list
    let innerContent,
        allContent,
        newMsg;
    let fragment = document.createDocumentFragment();

    // push new event array onto log array
    logEvents.push([level, timeStr, type, content]);

    content = (content.constructor == Array) ? content.join('') : content;

    switch (_options.logType) {
      case 'table':
        let row, col1, col2, col3, col4;
        row = document.createElement('tr');
        row.setAttribute('class', type);
        fragment.appendChild(row);

        col1 = document.createElement('td');
        /*col1.setAttribute('class', 'fa ' +  level);*/
        col1.setAttribute('title', level);
        col1.innerText =level;
        row.appendChild(col1);

        col2 = document.createElement('td');
        col2.setAttribute('class', 'timestamp');
        col2.innerText=timeStr;
        row.appendChild(col2);

        col3 = document.createElement('td');
        col3.setAttribute('class', 'messageType');
        col3.innerText=type;
        row.appendChild(col3);

        col4 = document.createElement('td');
        col4.setAttribute('class', 'eventType');
        col4.innerText=eventType;
        row.appendChild(col4);


        col5 = document.createElement('td');
        col5.setAttribute('class', 'message');
        col5.innerHTML=content;
        row.appendChild(col5);

        if (_options.logClasses) {
          col6 = document.createElement('td');
          col6.setAttribute('class', 'playerclasses');
          col6.innerText = playerclasses;
          row.appendChild(col6);
        }
      break;
      case 'list':
        let listItem = document.createElement('li'), innerContent, span ;
        listItem.setAttribute('class', type);
        fragment.appendChild(listItem);

        span = document.createElement('span');
        span.setAttribute('class', 'fa ' + type);
        span.setAttribute('title', level);
        listItem.appendChild(span);
        
        innerContent = '[' + level + '] ' + timeStr + ' ' + type + ' ' + eventType;
        if (content) { 
             innerContent += '<br>' + content;
        }

        if ((type==='player') && (_options.logClasses) && (playerclasses != '')) {
            innerContent += '<br>[CLASSES] ' +  playerclasses;
        } 
        listItem.innerHTML += innerContent;
      break;
    }

    allContent = fragment.innerHTML;

    if (outputList) {        
      outputList.appendChild(fragment);
      scrollToBottom();
    } else {
      cache.push(allContent);
    }
    emailArray.push([timeStr, ' ', type, ': ', content].join(''));
  };

  let getHeaderStr = (player) => {
    let type, spans = [], headerStr;

    for (type in messageTypes) {
      spans.push(['<span class="fa ', type, '" type="', type, '" title="Hide ', type, ' messages"></span>'].join(''));
    }

    headerStr = [
      '<div class="left">',
        '<div id="', IDs.filters, '" class="filters">', spans.join(''),
        '</div>',
      '</div>',
      '<h2>Brightcove Player Debug Log</h2>',
      '<div class="right">',
        '<div id="', IDs.controls, '" class="controls">',
          '<span class="fa email" id="', IDs.sendEmail, '" title="Send log via email" op="email"></span>',
          '<span id="', IDs.size ,'" title="contract" op="resize"></span>',
          '<span class="fa clear" title="Clear Log Messages" op="clear"></span>',
          '<span class="fa close" title="Hide Log" op="close"></span>',
        '</div>',
      '</div>'
    ].join('');

    return headerStr;
  }

  let myGenerateMarkup = (obj) => { 

    //build markup
    let type, rows = [], strInnerHTML=""; 

    switch (obj) {
      case 'table':
        let col='';
        logContainer = 'tbody';
        if (_options.logClasses) {
          col = '<th>Player Classes</th>';
        }
        strInnerHTML = [ 
          '<table id="', IDs.logTable, '">',
          '<caption>Brightcove Player Debug Log</caption>',
          '<thead><tr>',
          '<th class="hdrLevel">Level</th><th class="hdrTime">TimeStamp</th><th class="hdrType">Type</th><th class="hdrEvent">Event</th><th class="hdrMsg">Message</th>',
          col,
          '</tr></thead>',
          '<tbody>',
          cache.join(''),
          '</tbody>',
          '</table>'
        ].join('');
      break;
      case 'list':
        logContainer = 'ol';
        strInnerHTML = [
          '<ol id="', IDs.logList,'">', 
          cache.join(''), 
          '</ol>'
        ].join('');
      break;
      case 'json':
        logContainer = 'json';
        strInnerHTML = [
          '<ol>', cache.join(''), '</ol>'
        ].join('');
      break;
    }
    strInnerHTML += '</div>';
     
    return strInnerHTML;
  };

let getClassesStr = (obj) => {
    if (typeof obj == 'object') {
      let logClassesStr = Array.prototype.slice.apply(obj).join(' ');
      return  logClassesStr;    
    }
};

export let logDebug = (logLevel, logClass, logEvent, logStr) => {
    let logHTML='', logSpan, logJSONObj;
    let timestr = timeString();
    let entryType;

   
    switch (logClass) {
      case 'playerMsg' : 
        entryType = "player";
        break;
      case 'adMsg' :
        entryType = "ads";
        break;
      case 'techFlash' :
      case 'techHTML':
      case 'techOther':
        entryType = 'loading';
        break;
      case 'sysMsg' :
        entryType = 'console';
        break;
      default: 
        entryType = 'other';
    }   
    
    logJSONObj='{' + 'level:' + logLevel + ', timestamp:' + timestr + ', type:' + entryType + ', message:' + logStr + '}';

    if (logStr) { 
        logHTML +=  logStr; 
    }

    if ((!_options.logClasses) || (entryType === 'console')) {
      myAddMessage(logLevel, timestr, entryType, logEvent, logStr, '');
    } else  {
          let logClassesStr = getClassesStr(_player.el_.classList);
          myAddMessage(logLevel, timestr, entryType, logEvent, logStr, logClassesStr);
    }

  //  if (options.showPlayerClasses) {
  //    showPlayerClasses(player.el_.classList);
  //  }
    //showBigPlayButtonStyles();
  };

let clear = () => { 
  //clear list output
  //outputList.innerHTML = '';
  //let strContent = myGenerateMarkup(options.logType);

  document.getElementById(IDs.logList).innerHTML = '';
}

 export let clickControl = (evt) => {
    let el;

    if (!evt) {
      evt = window.event;
    }
    el = (evt.target) ? evt.target : evt.srcElement;

    if (el.tagName == 'SPAN') {
      switch (el.getAttributeNode('op').nodeValue) {
        case 'clear':  clear();  break;
        case 'close':  hide();   break;
      }
    }
  }

  export let updateLogPane = (player) => {
    let strContent = myGenerateMarkup(_options.logType);

    log.content(strContent);
  }

  export let buildLogPane = (player, opt) => {
 
    _player = player;
    _options = opt;


    let paneOptions = {
        'id': IDs.log
      };
    log = new DebuggerPane(player, paneOptions);

    log.el_.className = 'activePane';
    //let innerHTML = log.content();

    log.headerEl_.innerHTML = getHeaderStr(player);

    let strContent = myGenerateMarkup(_options.logType);

    log.content(strContent);
 
    frogger=log.el_;
    outputList = frogger.getElementsByTagName(logContainer)[0];

    return log;
  }
