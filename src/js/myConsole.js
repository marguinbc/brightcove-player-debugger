 function myConsole() {
    
    var console = window.console;
    if (!console) return;

    function intercept(method) {
      var original = console[method];

      console[method] = function ()  {

        var logHTML;
        var timestr = timeString();

        // capture console messages to log div on page
        if (original.apply) {

          // if the message is an object, concatenate
          if (typeof arguments == 'object') {
            var message = Array.prototype.slice.apply(arguments).join(' ');
            var messagestr = "";
            for (var q = 0; q < arguments.length; q++) {
              if (typeof arguments[q] == 'string') {
                messagestr += arguments[q] + ' ';
              }
            }
            currentEvent = messagestr;
          } else {
            // else just log out the string to the div            
            messagestr = arguments;
          }
          myAddMessage('debug', timestr, 'console', messagestr, '', '');
          // log object to console.log as intended
          original.apply(console, arguments);
        } else  {
          // needed for IE since apply does not work there
          var message = Array.prototype.slice.apply(arguments).join(' ');
          original(message);
          myAddMessage('debug', timestr, 'console', message, '', '');
        }
      }
    }
    var methods = ['log', 'warn', 'error'];
    for (var i = 0; i < methods.length; i++) {
      intercept(methods[i]);
    }
  }; 
