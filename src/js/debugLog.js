import {IDs} from './componentIDs.js';
import DebuggerPane from './debugger-pane.js';
import window from 'global/window';
import document from 'global/document';

let _options;
const logEvents = [];
const cache = [];
const emailArray = [];
let log;
let logContainer;
let frogger;
let outputList;
const messageTypes = {
    // order of these properties imply render order of filter controls
  player: true,
  loading: true,
  ads: true,
  console: true,
  other: true
};
let _player;

const timeString = () => {
  const d = new Date();
  const timestamp = (d.getMonth() + 1) + '/' + (d.getDate()) + '/' + (d.getFullYear()) + ' ' + (d.getHours()) + ':' + (d.getMinutes()) + ':' + (d.getSeconds()) + (_options.logMilliseconds ? ':' + (d.getMilliseconds()) : '');

  return timestamp;
};

export const clickSendEmail = (evt) => {
  if (!evt) {
    evt = window.event;
  }
  window.open('mailto:email@example.com?subject=Brightcove Player Debugger Log&body=' + encodeURIComponent(emailArray.join('\n')));
};
export const clickCopyLog = (e) => {
  // find target element
  const a = document.createElement('input');

  a.value = document.getElementsByClassName('main')[0].innerHTML;
  a.value += document.getElementsByClassName('main')[1].innerHTML;
  a.value += document.getElementsByClassName('main')[2].innerHTML;
  if (document.getElementsByClassName('main')[3]) {
    a.value += document.getElementsByClassName('main')[3].innerHTML;

  }

  // is element selectable?
  if (a) {
    // select text
    const logPane = document.getElementById('myBlackbird');

    logPane.appendChild(a);
    a.select();
    try {
      // copy text
      document.execCommand('copy');
      // inp.blur();
    } catch (err) {
      window.alert('please press Ctrl/Cmd+C to copy');
    }
    a.remove();

  }
};

const hide = () => {
  // frogger.style.display = 'none';
  const logPane = document.getElementById('myBlackbird');
  const btnToggleLog = document.getElementById(IDs.btnToggleLog);

  btnToggleLog.classList.toggle('active');
  logPane.classList.toggle('activePane');
};

const scrollToBottom = () => {
  // scroll list output to the bottom
  outputList.scrollTop = outputList.scrollHeight;
};

export const clickFilter = (evt) => {
  // show/hide a specific message type
  let entry;
  let type;
  let filters;
  let active;
  let oneActiveFilter;
  let i;
  let spanType;
  let disabledTypes;

  if (!evt) {
    evt = window.event;
  }
  const span = (evt.target) ? evt.target : evt.srcElement;

  if (span && span.tagName === 'SPAN') {

    type = span.getAttributeNode('type').nodeValue;

    if (evt.altKey) {
      filters = document.getElementById(IDs.filters).getElementsByTagName('SPAN');

      active = 0;
      for (entry in messageTypes) {
        if (messageTypes[entry]) {
          active++;
        }
      }
      oneActiveFilter = (active === 1 && messageTypes[type]);

      for (i = 0; filters[i]; i++) {
        spanType = filters[i].getAttributeNode('type').nodeValue;

        filters[i].className = 'fa ' + spanType + ((oneActiveFilter || (spanType === type)) ? '' : ' disabled');
        messageTypes[spanType] = oneActiveFilter || (spanType === type);
      }
    } else {
      messageTypes[type] = !messageTypes[type];
      span.className = 'fa ' + type + ((messageTypes[type]) ? '' : ' disabled');
    }

    // build outputList's class from messageTypes object
    disabledTypes = [];
    for (type in messageTypes) {
      if (!messageTypes[type]) {
        disabledTypes.push(type);
      }
    }
    disabledTypes.push('');
    outputList.className = disabledTypes.join('Hidden ');

    scrollToBottom();
  }
};

export const myAddMessage = (level, timeStr, type, eventType, content, playerclasses) => {
  // adds a message to the output list
  const fragment = document.createDocumentFragment();

  // push new event array onto log array
  logEvents.push([level, timeStr, type, content]);

  content = (content.constructor === Array) ? content.join('') : content;

  switch (_options.logType) {
  case 'table':
    const row = document.createElement('tr');

    row.setAttribute('class', type);
    fragment.appendChild(row);

    const col1 = document.createElement('td');

      /* col1.setAttribute('class', 'fa ' +  level);*/
    col1.setAttribute('title', level);
    col1.innerText = level;
    row.appendChild(col1);

    const col2 = document.createElement('td');

    col2.setAttribute('class', 'timestamp');
    col2.innerText = timeStr;
    row.appendChild(col2);

    const col3 = document.createElement('td');

    col3.setAttribute('class', 'messageType');
    col3.innerText = type;
    row.appendChild(col3);

    const col4 = document.createElement('td');

    col4.setAttribute('class', 'eventType');
    col4.innerText = eventType;
    row.appendChild(col4);

    const col5 = document.createElement('td');

    col5.setAttribute('class', 'message');
    col5.innerHTML = content;
    row.appendChild(col5);

    if (_options.logClasses) {
      const col6 = document.createElement('td');

      col6.setAttribute('class', 'playerclasses');
      col6.innerText = playerclasses;
      row.appendChild(col6);
    }
    break;
  case 'list':
    const listItem = document.createElement('li');
    let innerContent;

    listItem.setAttribute('class', type);
    fragment.appendChild(listItem);

    const span = document.createElement('span');

    span.setAttribute('class', 'fa ' + type);
    span.setAttribute('title', level);
    listItem.appendChild(span);

    innerContent = '[' + level + '] ' + timeStr + ' ' + type + ' ' + eventType;
    if (content) {
      innerContent += '<br>' + content;
    }

    if ((type === 'player') && (_options.logClasses) && (playerclasses !== '')) {
      innerContent += '<br>[CLASSES] ' + playerclasses;
    }
    listItem.innerHTML += innerContent;
    break;
  }

  const allContent = fragment.innerHTML;

  if (outputList) {
    outputList.appendChild(fragment);
    scrollToBottom();
  } else {
    cache.push(allContent);
  }
  emailArray.push([timeStr, ' ', type, ': ', content].join(''));
};

export const myConsole = () => {

  const console = window.console;
  let messagestr = '';

  if (!console) {
    return;
  }

  function intercept(method) {
    const original = window.console[method];

    window.console[method] = function() {

      const timestr = timeString();

      // capture console messages to log div on page
      if (original.apply) {

        // if the message is an object, concatenate
        if (typeof arguments === 'object') {
          messagestr = '';
          for (let q = 0; q < arguments.length; q++) {
            if (typeof arguments[q] === 'string') {
              messagestr += arguments[q] + ' ';
            }
          }
        } else {
          // else just log out the string to the div
          messagestr = Array.prototype.slice.apply(arguments).join(' ');
        }
        myAddMessage('debug', timestr, 'console', messagestr, '', '');
        // log object to console.log as intended
        original.apply(console, arguments);
      } else {
        // needed for IE since apply does not work there
        const message = Array.prototype.slice.apply(arguments).join(' ');

        original(message);
        myAddMessage('debug', timestr, 'console', message, '', '');
      }
    };
  }
  const methods = ['log', 'warn', 'error', 'VIDEOJS:'];

  for (let i = 0; i < methods.length; i++) {
    intercept(methods[i]);
  }
};

const getHeaderStr = (player) => {
  let type;
  const spans = [];

  for (type in messageTypes) {
    spans.push([
      '<span class="fa ',
      type,
      '" type="',
      type,
      '" title="Hide ',
      type,
      ' messages"></span>'
    ].join(''));
  }

  const headerStr = [
    '<div class="left">',
    '<div id="',
    IDs.filters,
    '" class="filters">',
    spans.join(''),
    '</div>',
    '</div>',
    '<h2>Brightcove Player Debug Log</h2>',
    '<div class="right">',
    '<div id="',
    IDs.controls,
    '" class="controls">',
    '<span class="fa fa-clipboard" id="',
    IDs.copyLog,
    '" title="Copy log to Clipboard" op="copy"></span>',
    '<span class="fa email" id="',
    IDs.sendEmail,
    '" title="Send log via email" op="email"></span>',
    '<span id="',
    IDs.size,
    '" title="contract" op="resize"></span>',
    '<span class="fa clear" title="Clear Log Messages" op="clear"></span>',
    '<span class="fa close" title="Hide Log" op="close"></span>',
    '</div>',
    '</div>'
  ].join('');

  return headerStr;
};

const myGenerateMarkup = (obj) => {

  // build markup
  let strInnerHTML = '';

  switch (obj) {
  case 'table':
    let col = '';

    logContainer = 'tbody';
    if (_options.logClasses) {
      col = '<th>Player Classes</th>';
    }
    strInnerHTML = [
      '<table id="',
      IDs.logTable,
      '">',
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
    strInnerHTML = ['<ol id="', IDs.logList, '">', cache.join(''), '</ol>'].join('');
    break;
  case 'json':
    logContainer = 'json';
    strInnerHTML = ['<ol>', cache.join(''), '</ol>'].join('');
    break;
  }
  strInnerHTML += '</div>';

  return strInnerHTML;
};

const getClassesStr = (obj) => {
  if (typeof obj === 'object') {
    const logClassesStr = Array.prototype.slice.apply(obj).join(' ');

    return logClassesStr;
  }
};

export const logDebug = (logLevel, logClass, logEvent, logStr) => {
  let logHTML = '';
  const timestr = timeString();
  let entryType;

  switch (logClass) {
  case 'playerMsg':
    entryType = 'player';
    break;
  case 'adMsg':
    entryType = 'ads';
    break;
  case 'techFlash':
  case 'techHTML':
  case 'techOther':
    entryType = 'loading';
    break;
  case 'sysMsg':
    entryType = 'console';
    break;
  default:
    entryType = 'other';
  }

  // const logJSONObj = '{' +
  //   'level:' + logLevel + ', timestamp:' + timestr + ', type:' + entryType + ', message:' + logStr + '}';

  if (logStr) {
    logHTML += logStr;
  }

  if ((!_options.logClasses) || (entryType === 'console')) {
    myAddMessage(logLevel, timestr, entryType, logEvent, logStr, '');
  } else {
    const logClassesStr = getClassesStr(_player.el_.classList);

    myAddMessage(logLevel, timestr, entryType, logEvent, logStr, logClassesStr);
  }

  //  if (options.showPlayerClasses) {
  //    showPlayerClasses(player.el_.classList);
  //  }
  // showBigPlayButtonStyles();
};

const clear = () => {
  // clear list output
  // outputList.innerHTML = '';
  // let strContent = myGenerateMarkup(options.logType);

  document.getElementById(IDs.logList).innerHTML = '';
};

export const clickControl = (evt) => {
  if (!evt) {
    evt = window.event;
  }
  const el = (evt.target) ? evt.target : evt.srcElement;

  if (el.tagName === 'SPAN') {
    switch (el.getAttributeNode('op').nodeValue) {
    case 'clear':
      clear();
      break;
    case 'close':
      hide();
      break;
    }
  }
};

export const updateLogPane = (player) => {
  const strContent = myGenerateMarkup(_options.logType);

  log.content(strContent);
};

export const buildLogPane = (player, opt) => {

  _player = player;
  _options = opt;

  const paneOptions = {
    id: IDs.log
  };

  log = new DebuggerPane(player, paneOptions);

  log.el_.className = 'activePane';
  // let innerHTML = log.content();

  log.headerEl_.innerHTML = getHeaderStr(player);

  const strContent = myGenerateMarkup(_options.logType);

  log.content(strContent);

  frogger = log.el_;
  outputList = frogger.getElementsByTagName(logContainer)[0];

  return log;
};
