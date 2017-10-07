var pClock = {
  session: true, // session or break countdown?
  running: false, // clock running?
  sMin: 25, // default session time
  sSec: 0,
  bMin: 5, // default break time
  bSec: 0,
  currMin: 0, // track countdown time
  currSec: 0,
  progMax: 0,
  progValue: 0,
  progBar: document.getElementById("progBar"),
  countdown: function() {
    var label = document.getElementById("label");
    var soundSession = document.getElementById("soundSession");
    var soundBreak = document.getElementById("soundBreak");
    if (this.session) { // if this.session is true
      this.currMin = this.sMin; // set current mins and secs to session time
      this.currSec = this.sSec;  
    } else {
      this.currMin = this.bMin; // set current mins and secs to break time
      this.currSec = this.bSec;
    }
    this.progMax = this.currMin * 60; // set progress bar max
    this.progValue = this.currMin * 60; // set progress bar value
    this.progBar.setAttribute("max", this.progMax);
    this.progBar.classList.remove("hidden");
    
    var counter = setInterval(function() { // set up interval timer
      if (pClock.running === false) {
        pClock.progBar.classList.add("hidden"); // hide progress bar
        clearInterval(counter);
        view.initialize();
      } else if (pClock.currMin === 0 && pClock.currSec === 0) { // if countdown is finished 0 0
        pClock.session = !pClock.session; // done with session count
        clearInterval(counter); // stop the interval timer
        if (pClock.session) {
          soundSession.play();
          document.body.classList.remove("break");
          document.body.classList.add("session");
          label.innerText = "Session";
        } else {
          soundBreak.play();
          document.body.classList.remove("session");
          document.body.classList.add("break");
          label.innerText = "Break";
        }
        pClock.countdown(); // start break count
      } else if (pClock.currMin > 0 && pClock.currSec === 0) { // else if still counting down and seconds get to zero
        pClock.currMin--; // decrement minutes
        pClock.currSec = 59; // start seconds at 59
        pClock.progValue--; // decrement progress bar value
      } else {
        pClock.progValue--; // decrement progress bar value
        pClock.currSec--; // decrement seconds
      }
      pClock.progBar.value = pClock.progValue;
      view.displayTime();
    }, 1000); // repeat every second
  },
  // Set Session Mins
  setSessionMinutes: function(operator) {
    var sessMinutes = document.getElementById("sessMinutes");
    var time = document.getElementById("time");
    if (pClock.running === false) {
      if (operator === "-" && this.sMin > 1) {
        this.sMin--;
      } else if (operator === "+" && this.sMin < 60) {
        this.sMin++;
      }
      sessMinutes.innerHTML = view.leadingZero(this.sMin);
      time.innerHTML = view.leadingZero(this.sMin) + ":" + view.leadingZero(this.sSec);
    }
  },
  // Set Break Mins
  setBreakMinutes: function(operator) {
    var breakMinutes = document.getElementById("breakMinutes");
    if (pClock.running === false) {
      if (operator === "-" && this.bMin > 1) {
        this.bMin--;
      } else if (operator === "+" && this.bMin < 30) {
        this.bMin++;
      }
      breakMinutes.innerHTML = view.leadingZero(this.bMin);
    }
  }
};

var handlers = {
  startStop: document.getElementById("start"),
  soundSession: document.getElementById("soundSession"),
  label: document.getElementById("label"),
  setEventListeners: function() {
    this.startStop.addEventListener("click", function(e) {
      e.stopImmediatePropagation();
      if (pClock.running === false) {
        handlers.soundSession.play();
        pClock.running = !pClock.running;
        document.body.classList.add("session");
        handlers.label.innerText = "Session";
        handlers.startStop.innerText = "STOP";
        pClock.countdown();
      } else {
        pClock.running = !pClock.running;
        document.body.classList.remove("session");
        document.body.classList.remove("break");
        handlers.label.innerText = "";
        handlers.startStop.innerText = "START";
        pClock.countdown();
      }
    });
  }
};

// Create a viewer (with leadingZero function)
var view = {
  time: document.getElementById("time"),
  initialize: function() {
    handlers.setEventListeners();
    this.time.innerHTML = this.leadingZero(pClock.sMin) + ":" + this.leadingZero(pClock.sSec);
  },
  displayTime: function() {
    this.time.innerHTML = this.leadingZero(pClock.currMin) + ":" + this.leadingZero(pClock.currSec);
  },
  leadingZero: function(time) {
    return (time < 10) ? "0" + time : time;
  }
};

view.initialize();