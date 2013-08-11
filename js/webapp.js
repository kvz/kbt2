(function () {
  var timer            = null;
  var currentMilliSecs = 0;
  var activeSeconds    = false;
  var milliStep        = 10;
  var pauzed           = false;
  var buttonCounter    = document.querySelector('button.counter');
  var buttonsInterval  = document.querySelectorAll('button.interval');
  var lessonContainer  = document.querySelector('#lesson');
  var fadeFactor       = 0.6;
  var alarmId;

  if (buttonCounter) {
    buttonCounter.onclick = function () {
      if (!activeSeconds) {
        return;
      }

      if (pauzed) {
        doPauze(false);
      } else {
        doPauze(true);
      }
    };
  }

  if (buttonsInterval) {
    [].forEach.call(buttonsInterval, function(el) {
      el.addEventListener('click', function () {
        if (activeSeconds && !pauzed) {
          return;
        }

        initCounter(el.dataset.seconds);
      });
    }, false);
  }

  var styleBusy = function (busy) {
    var opacityP = busy ? 1 : fadeFactor;
    var opacityB = busy ? fadeFactor : 1;

    buttonCounter.style.opacity = opacityP;

    [].forEach.call(buttonsInterval, function(el) {
      el.style.opacity = opacityB;
    }, false);
  };

  var padDigits = function(number, digits) {
    return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
  }

  var doPauze = function (want_pauze) {

    // // ...

    // // Later on, removing the alarm if it exists
    // if (alarmId) {
    //   navigator.mozAlarms.remove(alarmId);
    // }  

    pauzed = want_pauze;
    if (pauzed) {
      styleBusy(false);
      cancelAlarm();
    } else {
      styleBusy(true);
      cancelAlarm();
      setAlarm(currentMilliSecs);
    }

    if ('vibrate' in navigator) {
      navigator.vibrate(200);
    }
  };

  var initCounter = function (secs) {
    currentMilliSecs = secs * 1000;
    activeSeconds    = secs;
    doPauze(false);
    clearTimeout(timer);

    doCount(secs);
  };

  var completeCounter = function () {
    clearTimeout(timer);
    doPauze(true);

    if ('vibrate' in navigator) {
      navigator.vibrate(2000);
    }

    // alert(formatter(activeSeconds * 1000, false) + ' Timer Complete');

    activeSeconds = false;
  };

  var formatter = function (millisecs, with_ms) {
    var secs        = Math.floor(millisecs / 1000);
    var remainMsecs = millisecs - (secs * 1000);
    var minutes     = Math.floor(secs / 60);
    var remainSecs  = secs - (minutes * 60);
    var text        = minutes + ':' + padDigits(remainSecs, 2);

    if (with_ms) {
      text += ':' + padDigits(remainMsecs, 3);
    }

    return text;
  };

  var updateText = function(text) {
    while(buttonCounter.firstChild) {
      buttonCounter.removeChild(buttonCounter.firstChild);
    }
    buttonCounter.appendChild(document.createTextNode(text));
  };

  var doCount = function(secs) {
    if (!pauzed) {
      currentMilliSecs = currentMilliSecs - milliStep;
      if (currentMilliSecs <= 0) {
        currentMilliSecs = 0;
      }

      updateText(formatter(currentMilliSecs + 1000, false));  

      if (currentMilliSecs === 0) {
        updateText(formatter(0, false));  
        completeCounter();
      }
    }

    timer = setTimeout(function () {
      doCount(secs);      
    }, milliStep);      
  };

  var setAlarm = function (ms_in_future) {
    if (!('mozAlarms' in navigator)) {
      return;
    }

    // var alarmDate = new Date(new Date() + currentMilliSecs);
    alarmDate = new Date(+new Date() + ms_in_future);

    // Set an alarm and store it's id
    var request = navigator.mozAlarms.add(alarmDate, 'ignoreTimezone', {
      message: 'Timer ' + formatter(activeSeconds * 1000, false) + ' Complete'
    });

    request.onsuccess = function () {
      // console.log('A new alarm has been set:' + this.result);      
      alarmId = this.result.id;
    }  
  };


  var cancelAlarm = function() {
    if (!('mozAlarms' in navigator)) {
      return;
    }
    if (alarmId) {
      navigator.mozAlarms.remove(alarmId);
    }
  };
  var loadLesson = function (lesson) {
    var xhReq = new XMLHttpRequest();
    xhReq.open('GET', '/lessons/' + lesson + '.md', false);
    xhReq.send(null);
    var serverResponse = xhReq.responseText;
    lessonContainer.innerHTML = markdown.toHTML(serverResponse);
  };

  // Main
  if ('mozLockOrientation' in screen) {
    var portraitLock = screen.mozLockOrientation('portrait');
    if (portraitLock) {
      console.log('Orientation locked to portrait');
    }
  }


  updateText(formatter(0, false));  
  loadLesson('les2');

})(); 
