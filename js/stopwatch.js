// Define a class like this
function Stopwatch(config){
  // Config
  this.config = config;

  // Elemenet Bindings
  this.elements = config.elements;
  delete config.elements;

  // State
  this.activeSeconds    = false;
  this.alarmId          = null;
  this.currentMilliSecs = 0;
  this.pauzed           = false;
  this.timer            = null;
}

Stopwatch.prototype.bind = function (){
  var self = this;
  self.elements['counter'].onclick = function () {
    if (!self.activeSeconds) {
      return;
    }

    if (self.pauzed) {
      self.doPauze(false);
    } else {
      self.doPauze(true);
    }
  };

  [].forEach.call(self.elements['intervals'], function(el) {
    el.addEventListener('click', function () {
      if (self.activeSeconds && !self.pauzed) {
        return;
      }

      self.initCounter(el.dataset.seconds);
    });
  }, false);

  self.updateText(self.formatter(0, false));
};

Stopwatch.prototype.styleBusy = function (busy) {
  var opacityP = busy ? 1 : this.config.fadeFactor;
  var opacityB = busy ? this.config.fadeFactor : 1;

  this.elements['counter'].style.opacity = opacityP;

  [].forEach.call(this.elements['intervals'], function(el) {
    el.style.opacity = opacityB;
  }, false);
};

Stopwatch.prototype.padDigits = function(number, digits) {
  return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}

Stopwatch.prototype.doPauze = function (want_pauze) {
  this.pauzed = want_pauze;
  if (this.pauzed) {
    this.styleBusy(false);
    // this.cancelAlarm();
  } else {
    this.styleBusy(true);
    // this.cancelAlarm();
    // this.setAlarm(this.currentMilliSecs);
  }

  this.vibrate(200);
};

Stopwatch.prototype.initCounter = function (secs) {
  console.log('Stopwatch.prototype.initCounter');
  this.currentMilliSecs = secs * 1000;
  this.activeSeconds    = secs;
  this.doPauze(false);
  clearTimeout(this.timer);

  this.doCount(secs);
};

Stopwatch.prototype.vibrate = function (ms) {
  var self = this;
  if (!('vibrate' in navigator)) {
    return;
  }

  // self.elements['body'].className = '';
  // setTimeout(function () {
  //   self.elements['body'].className = 'skin-dark';
  // }, ms);
  navigator.vibrate(ms);
};

Stopwatch.prototype.completeCounter = function () {
  clearTimeout(this.timer);
  this.doPauze(true);

  this.vibrate(2000);
  // alert(this.formatter(this.activeSeconds * 1000, false) + ' this.Timer Complete');

  this.activeSeconds = false;
};

Stopwatch.prototype.formatter = function (millisecs, with_ms) {
  var secs        = Math.floor(millisecs / 1000);
  var remainMsecs = millisecs - (secs * 1000);
  var minutes     = Math.floor(secs / 60);
  var remainSecs  = secs - (minutes * 60);
  var text        = minutes + ':' + this.padDigits(remainSecs, 2);

  if (with_ms) {
    text += ':' + this.padDigits(remainMsecs, 3);
  }

  return text;
};

Stopwatch.prototype.updateText = function(text) {
  while(this.elements['counter'].firstChild) {
    this.elements['counter'].removeChild(this.elements['counter'].firstChild);
  }
  this.elements['counter'].appendChild(document.createTextNode(text));
};

Stopwatch.prototype.doCount = function(secs) {
  var self = this;
  if (!self.pauzed) {
    self.currentMilliSecs = self.currentMilliSecs - self.config.milliStep;
    if (self.currentMilliSecs <= 0) {
      self.currentMilliSecs = 0;
    }

    self.updateText(self.formatter(self.currentMilliSecs + 1000, false));

    if (self.currentMilliSecs === 0) {
      self.updateText(self.formatter(0, false));
      self.completeCounter();
    }
  }

  self.timer = setTimeout(function () {
    self.doCount(secs);
  }, self.config.milliStep);
};

Stopwatch.prototype.setAlarm = function (ms_in_future) {
  if (!('mozAlarms' in navigator)) {
    return;
  }
  if (!('mozSetMessageHandler' in navigator)) {
    return;
  }

  // var alarmDate = new Date(new Date() + this.currentMilliSecs);
  alarmDate = new Date(+new Date() + ms_in_future);

  // Set an alarm and store it's id
  var request = navigator.mozAlarms.add(alarmDate, 'ignoreTimezone', {
    message: 'Timer ' + this.formatter(this.activeSeconds * 1000, false) + ' Complete'
  });

  request.onsuccess = function () {
    console.log('A new alarm has been set:' + this.result);
    this.alarmId = this.result.id;
  }

  navigator.mozSetMessageHandler('alarm', function(mozAlarm) {
    navigator.vibrate(2000);

    var notification = navigator.mozNotification.createNotification('There you go', mozAlarm.data.label);
    notification.show();
  });
};

Stopwatch.prototype.cancelAlarm = function() {
  if (!('mozAlarms' in navigator)) {
    return;
  }

  if (this.alarmId) {
    navigator.mozAlarms.remove(this.alarmId);
  }
};

Stopwatch.prototype.loadConfig = function (cb) {
  var self    = this;
  var oReq    = new XMLHttpRequest();
  oReq.onload = function () {
    cb(null, JSON.parse(this.responseText));
  };
  oReq.open('GET', '/config.json', true);
  oReq.send();
}

Stopwatch.prototype.loadMarkdown = function (url) {
  var self    = this;
  var oReq    = new XMLHttpRequest();
  oReq.onload = function () {
    marked.setOptions({
      renderer   : new marked.Renderer(),
      gfm        : true,
      tables     : true,
      breaks     : true,
      pedantic   : false,
      sanitize   : true,
      smartLists : true,
      smartypants: false
    });

    self.elements['lesson'].innerHTML = marked(this.responseText);
  };
  oReq.open('GET', url, true);
  oReq.send();
};
