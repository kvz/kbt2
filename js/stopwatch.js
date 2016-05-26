// Define a class like this
function Stopwatch(config){
  // Config
  this.config = config;

  // Element Bindings
  this.elements = config.elements;
  delete config.elements;

  // State
  this.activeSeconds     = false;
  this.lastActiveSeconds = 0;
  this.alarmId           = null;
  this.currentMilliSecs  = 0;
  this.pauzed            = false;
  this.timer             = null;
  this.completed         = 0;

  var self = this;

  self.updateCompleted();
  self.updateClock();

  // Time of day Clock
  setInterval(function() {
    self.updateClock();
  }, 1000);
}

Stopwatch.prototype.bind = function (){
  var self = this;

  // Bind the countdown with pauze
  self.elements.counter.onclick = function () {
    if (!self.activeSeconds) {
      return;
    }

    if (self.pauzed) {
      self.doPauze(false);
    } else {
      self.doPauze(true);
    }
  };

  // Bind the interval buttons
  [].forEach.call(self.elements.intervals, function(el) {
    el.addEventListener('click', function () {
      if (self.activeSeconds && !self.pauzed) {
        return;
      }

      self.initCounter(parseInt(el.dataset.seconds, 10));
    });
  }, false);

  self.updateText(self.formatter(0, false));
};

Stopwatch.prototype.styleBusy = function (busy) {
  var opacityP = busy ? 1 : this.config.fadeFactor;
  var opacityB = busy ? this.config.fadeFactor : 1;

  this.elements.counter.style.opacity = opacityP;

  [].forEach.call(this.elements.intervals, function(el) {
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
  } else {
    this.styleBusy(true);
  }

  this.vibrate(200);
};

Stopwatch.prototype.initCounter = function (intSecs) {
  console.log('Stopwatch.prototype.initCounter ' + intSecs);
  if (intSecs !== this.lastActiveSeconds) {
    this.completed = 0;
    this.updateCompleted();
  }

  this.currentMilliSecs  = intSecs * 1000;
  this.activeSeconds     = intSecs;
  this.lastActiveSeconds = intSecs;
  this.updateCompleted();
  this.doPauze(false);
  clearTimeout(this.timer);

  this.doCount(intSecs);
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

  this.completed++;
  this.updateCompleted();


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

Stopwatch.prototype.updateCompleted = function() {
  if (!this.lastActiveSeconds) {
    this.elements.completed.innerHTML = '';
    return
  }

  this.elements.completed.innerHTML =  this.completed + ' x ' + this.formatter(this.lastActiveSeconds * 1000);
};

Stopwatch.prototype.updateClock = function() {
  var d = new Date();
  var t = [
    d.getHours(),
    d.getMinutes()
  ];
  var fourDigits = t.join('')
  var s = t.map(function(z) {
    return ('00' + z).slice(-2);
  }).join(':');

  var clock = this.elements.clock;
  clock.innerHTML = s;

  this.grayOutHistory(fourDigits)
};

Stopwatch.prototype.grayOutHistory = function(fourDigits) {
  // This is a bit wieldy in an attempt to save
  // the phone's battery, otherwise going over the DOM every second

  if (!this.lis || !this.lis.length) {
    this.lis = this.elements.lesson.querySelectorAll('li')
    if (this.lis) {
      this.timeMap = {}
      for (var i in this.lis) {
        var li = this.lis[i]
        if (!li.innerText) {
          continue
        }
        var matches = li.innerText.match(/^(\d{2}):(\d{2})\)/)
        if (!matches) {
          continue
        }
        liFourDigits = (matches[1] + '' + matches[2])
        this.timeMap[liFourDigits] = li
      }
    }
  }
  if (this.timeMap) {
    for (var liFourDigits in this.timeMap) {
      var li = this.timeMap[liFourDigits]
      var diff = (fourDigits * 1) - (liFourDigits * 1)
      if (diff >= 4) {
        li.className = 'history'
      }
      if (diff >= 25) {
        li.remove()
      }
    }
  }
}

Stopwatch.prototype.updateText = function(text) {
  while(this.elements.counter.firstChild) {
    this.elements.counter.removeChild(this.elements.counter.firstChild);
  }
  this.elements.counter.appendChild(document.createTextNode(text));
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

Stopwatch.prototype.loadConfig = function (cb) {
  var self    = this;
  var oReq    = new XMLHttpRequest();
  oReq.onload = function () {
    cb(null, JSON.parse(this.responseText));
  };
  oReq.open('GET', '/package.json', true);
  oReq.send();
}

Stopwatch.prototype.loadMarkdown = function (url, cb) {
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

    self.elements.lesson.innerHTML = marked(this.responseText);
    if (typeof cb === 'function') {
      cb();
    }
  };
  oReq.open('GET', url, true);
  oReq.send();
};
