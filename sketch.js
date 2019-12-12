var rBtn = document.getElementById('myBtn');
var shotBtn = document.getElementById('shotBtn');
var modeBtn = document.getElementById('modeBtn');
var dayNightBtn = document.getElementById('dayNightBtn');
var mybuttons = document.querySelectorAll(".btn");
var myBtnRow = document.querySelector('.btnRow');

var voiceLevelRow = document.querySelector('.voiceLevelRow');
var voiceLevel = document.querySelector(".voiceLevel");
var voiceLevelBar = document.querySelector('.voiceLevelBar');

var cnv;

var state = 0;
var visualMode;
var dayNightState ;
var mic;
var recorder;
var recordButton;
var amp;

var noiseHistory = [];
var noiseHistoryCircle = [];
var historyBlub = [];
var noiseHistoryDot = [];
var stringHistory = [];
var noiseHistoryBar = [];

var myStrokeWeight = 1;
var canvasColor;
var strokeColor;

var zoom = 1.00;
var zMin = 0.05;
var zMax = 9.00;
var sensativity = 0.005;

var speechRec;


//var userVoice;
//function touchStarted() { getAudioContext().resume(); } 

rBtn.addEventListener("click", changeState);
shotBtn.addEventListener("click", screenshotCanvas);
modeBtn.addEventListener("click", changeVisual);
dayNightBtn.addEventListener("click", changeDayNight);


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup(){
  cnv = createCanvas(windowWidth, windowHeight);
    cnv.id('mycanvas');
    cnv.style('position', 'absolute');
    cnv.style('transform', 'translate(-50%, -50%)');
    cnv.style('top', '50%');
    cnv.style('left', '50%');
    cnv.style('z-index', '-1');
  // recordButton = createButton('record');
  //   recordButton.id('recordButton');
  angleMode(DEGREES);
  textAlign(CENTER);
  
  
  mic = new p5.AudioIn();
  recorder = new p5.SoundRecorder();
  recorder.setInput(mic);
  soundFile = new p5.SoundFile();
  amp = new p5.Amplitude();
  userStartAudio().then(function() {
    
  });
  

  visualMode = getItem('visualMode', visualMode);
  if (visualMode === null || visualMode === undefined) {
    visualMode = 0;
  }
  console.log("visualMode " + visualMode);

  dayNightState = getItem('dayNightState');
  console.log(dayNightState);
  if (dayNightState === null || dayNightState === undefined) {
    dayNightState = false;
  } else {
    if (dayNightState === "true" ) {
      dayNightState = true;
      canvasColor = 0;

    } else if (dayNightState === "false") {
      dayNightState = false;
      canvasColor = 255;
      
    }
  }


  if (dayNightState === false) {
    dayNightBtn.innerHTML = 'NIGHT';
     for(var i = 0; i < mybuttons.length; i++){
      mybuttons[i].classList.add('btnD');
      voiceLevel.classList.add('voiceLevelD');
      voiceLevelBar.classList.add('voiceLevelBarD')
    }
  }else{
    dayNightBtn.innerHTML = 'DAY';
  }

  canvasColor = getItem('canvasColor');
  if (canvasColor === null || canvasColor === undefined) {
    canvasColor = 0;
  }

  strokeColor = getItem('strokeColor');
  if (strokeColor === null || strokeColor === undefined) {
    strokeColor = 0;
  }

  noiseHistory = getItem('userVoice');
  if (noiseHistory === null || noiseHistory === '') {
     noiseHistory = [];
   }

  noiseHistoryCircle = getItem('userVoiceCirle');
  if (noiseHistoryCircle === null || noiseHistoryCircle === '') {
    noiseHistoryCircle = [];
  }

  historyBlub = getItem('userVoiceBlub');
  console.log(historyBlub);
  if (historyBlub === null || historyBlub === '') {
    historyBlub = [];
  }

  noiseHistoryDot = getItem('userVoiceDot');
  if (noiseHistoryDot === '' || noiseHistoryDot === null) {
    noiseHistoryDot = [];
  }

   // stringHistory = getItem('storeString');
   // if (stringHistory === null || stringHistory === '') {
   //  stringHistory === '';
   // }

  mic.start();

  var lang = navigator.language || 'en-US';
  var continuous = true;
  var interim = true;
  speechRec = new p5.SpeechRec(lang, gotSpeech);
  speechRec.start(continuous, interim);
}

function draw(){
  //background(canvasColor);
 
  if(visualMode === 0){
    drawLine();
  } else if (visualMode === 1) {
    drawCircle();
  } else if (visualMode === 2) {
    drawCircle2();
  } else if (visualMode === 3) {
    drawBlub();
  } else if (visualMode === 4) {
    drawDot();
  } else if (visualMode === 5) {
    gotSpeech();
  } 

  var emojiMoon = document.getElementById('emojiMoon');
  if (visualMode === 3 && historyBlub.length >= 360 && dayNightState === true) {
    emojiMoon.style.opacity = 1;
  } else {
    emojiMoon.style.opacity = 0;
  }

  var emojiSun = document.getElementById('emojiSun');
  if (visualMode === 3 && historyBlub.length >= 360 && dayNightState === false) {
    emojiSun.style.opacity = 1;
  } else {
    emojiSun.style.opacity = 0;
  }

   
  
  
  storeItem('userVoice', noiseHistory);
  storeItem('userVoiceCirle', noiseHistoryCircle);
  storeItem('userVoiceBlub', historyBlub);
  storeItem('dayNightState', dayNightState);
  storeItem('userVoiceDot', noiseHistoryDot);
  //storeItem('storeString', stringHistory);
  //console.log(vol);
  storeItem('visualMode', visualMode);

}

function changeState() {
  state++;

  if(state === 1 && mic.enabled) {
    recorder.record(soundFile);
    rBtn.innerHTML = 'STOP';
  } else if (state === 2) {
    recorder.stop();
    rBtn.innerHTML = 'DOWNLOAD';
  } else if (state === 3) {
    saveSound(soundFile, 'mySound.wav');
    rBtn.innerHTML = 'RECORD';
  }

  if(state > 3){
    state = 0;
  }
}

function changeVisual() {
  visualMode++;
  if(visualMode > 5){
    visualMode = 0;
  }

  zoom = 1;

}

function changeDayNight() {
  console.log("hi");
  dayNightState =!dayNightState;
  // var mybuttons = document.querySelectorAll(".btn");

  if(dayNightState) { //dayNightState === true = nightMode!
    console.log("hihi");
    canvasColor = 0;
    strokeColor = 255
    dayNightBtn.innerHTML = 'DAY';
    voiceLevel.classList.remove('voiceLevelD');
    voiceLevelBar.classList.remove('voiceLevelBarD');
    for(var i = 0; i < mybuttons.length; i++){
      /* night mode*/
      
      // mybuttons[i].setAttribute("style", "background-color: #000000;");
      // mybuttons[i].setAttribute("style", "color: #FFFFFF;");
      mybuttons[i].classList.remove('btnD');
      mybuttons[i].classList.add('btn');
    }
    
  } else { //dayNightState === false = dayMode!
    console.log("ya");
    canvasColor = 255;
    strokeColor = 0;
    dayNightBtn.innerHTML = 'NIGHT';
    voiceLevel.classList.add('voiceLevelD');
    voiceLevelBar.classList.add('voiceLevelBarD');
    for(var i = 0; i < mybuttons.length; i++){
      /* day mode */
      
      // mybuttons[i].setAttribute("style", "background-color: #FFFFFF;");
      // mybuttons[i].setAttribute("style", "color: #000000;");
      mybuttons[i].classList.add('btnD');
    }
  }
  storeItem('dayNightState', dayNightState);
  storeItem('canvasColor', canvasColor);
  storeItem('strokeColor', strokeColor);
}


function drawLine() {
  background(canvasColor);
  translate(0, -height/2);
  scale(zoom); 
  myStrokeWeight2 = map(myStrokeWeight, 0, mouseY, 1, 15);
  strokeWeight(myStrokeWeight);
  var vol = mic.getLevel();
  var vol2 = map(vol, 0, 1, 0, 100);
  voiceLevelBar.style.height = vol2 + "%";
  noiseHistory.push(vol);
  beginShape();
    for (var i = 0; i < noiseHistory.length; i++){
      stroke(strokeColor);
      noFill();
      var y = map(noiseHistory[i], 0, 1, height, 0);
      i++;
      vertex(i, y);

      voiceLevel.innerHTML = Math.round(vol * 100) / 100;
      
      if (noiseHistory.length > width) {
        noiseHistory.splice(0, 1);
      }
  }
  endShape();
}

function drawCircle() {
  background(canvasColor);
  translate(width/2, height/2)
  scale(zoom);
  fill(strokeColor);
  var vol = mic.getLevel();
  var vol2 = map(vol, 0, 1, 0, 100);
  ellipse(0, 0, vol*height, vol*height);

  voiceLevel.innerHTML = Math.round(vol * 100) / 100;
  voiceLevelBar.style.height = vol2 + "%";
  //console.log(vol);
}


function drawCircle2() {
  background(canvasColor);
  translate(width/2, 0);
  scale(zoom); 
  myStrokeWeight2 = map(myStrokeWeight, 0, mouseY, 1, 15);
  strokeWeight(myStrokeWeight);
  var vol = mic.getLevel();
  var vol2 = map(vol, 0, 1, 0, 100);
  voiceLevelBar.style.height = vol2 + "%";
  noiseHistoryCircle.push(vol);
  beginShape();
    for (var i = 0; i < width/25; i++){
      stroke(strokeColor);
      noFill();
      var y = map(noiseHistoryCircle[i], 0, 1, height/2, 0);
      i++;
      //vertex(i, y);
      ellipse(0, y, i*25, i*25);

      voiceLevel.innerHTML = Math.round(vol * 100) / 100;
    
      if (noiseHistoryCircle.length > width/25) {
        noiseHistoryCircle.splice(0, 1);
      }
  }
  endShape();
}

function drawBlub() {
  background(canvasColor);
  myStrokeWeight2 = map(myStrokeWeight, 0, mouseY, 1, 15);
  strokeWeight(myStrokeWeight);
  translate(width/2, height/2);
  scale(zoom); 
  var vol = mic.getLevel();
  var vol2 = map(vol, 0, 1, 0, 100);
  voiceLevelBar.style.height = vol2 + "%";
  //console.log(historyBlub);
  historyBlub.push(vol);
  // console.log(historyBlub);
  beginShape();
    for (var i = 0; i < 360; i++){
      stroke(strokeColor);
      noFill();
      var r = map(historyBlub[i], 0, 1, 100, width);
      var x = r * cos(i);
      var y = r * sin(i); 
      vertex(x, y);

      voiceLevel.innerHTML = Math.round(vol * 100) / 100;
      
      if (historyBlub.length > 360) {
        historyBlub.splice(0, 1);
      }

      // if (historyBlub.length >= 360) {
      //   aFace();
      // }
  }
  endShape();
  
}


function drawDot() {
  background(canvasColor);
  translate(0, -height/2);
  scale(zoom); 
  myStrokeWeight2 = map(myStrokeWeight, 0, mouseY, 1, 15);
  strokeWeight(myStrokeWeight);
  var vol = mic.getLevel();
  var vol2 = map(vol, 0, 1, 0, 100);
  voiceLevelBar.style.height = vol2 + "%";
  noiseHistoryDot.push(vol);
  beginShape();
    for (var i = 0; i < noiseHistoryDot.length; i++){
      stroke(strokeColor);
      noFill();
      var y = map(noiseHistoryDot[i], 0, 1, height, 0);
      i++;
      point(i, y);

      voiceLevel.innerHTML = Math.round(vol * 100) / 100;
      
      if (noiseHistoryDot.length > width - noiseHistoryDot.length/5) {
        noiseHistoryDot.splice(0, 1);
      }
  }
  endShape();
}

function gotSpeech() {
  background(canvasColor);
  textSize(24);
  text("Speak!", width/2, height/3);
  var vol = mic.getLevel();
  var vol2 = map(vol, 0, 1, 0, 100);
  voiceLevelBar.style.height = vol2 + "%";
  var volTextSize = map(vol, 0, 1, 24, 50);
  textSize(volTextSize);
  strokeWeight(1);
  fill(strokeColor);
  

  voiceLevel.innerHTML = Math.round(vol * 100) / 100;
  //console.log(speechRec.resultValue);
  //console.log(speechRec.resultString);

   if (speechRec.resultValue) {
  //   stringHistory.push(speechRec.resultString);
     console.log(speechRec.resultString);
     console.log("speech js");
     text(speechRec.resultString, width/2, height/2);
     // var myString = document.getElementById('myString');
     myString.innerHTML = speechRec.resultString;
   } else {
     console.log('hey');
   }

  //if (stringHistory.length > 10) {
    //stringHistory.splice(0, 1);
  //}
  //fill(strokeColor);
  //text(speechRec.resultString, width/2, height/2);
  //text(speechRec.resultString, width/2, height/2);
}

// function drawBar() {
//   background(canvasColor);
//   translate(0, height/2);
//   scale(zoom);
//   fill(255,0,0);
//   var vol = mic.getLevel();
//   noiseHistoryBar.push(vol);
//   for (var i = 0; i < width/15; i++) {
//     var y = map(noiseHistoryBar[i], 0, 1, 0, height);
//     rect(i * 15, 0, 10, y);
//     //i++;
//     if (noiseHistoryBar.length > width/15) {
//         noiseHistoryBar.splice(0, 1);
//       }
//   }
// }

function screenshotCanvas() {
  saveCanvas(cnv, 'myCanvas');
}


function mouseWheel(event) {
  // console.log(zoom);
  zoom += sensativity * event.delta;
  zoom = constrain(zoom, zMin, zMax);
  //uncomment to block page scrolling
  return false;
}

function keyPressed() {
  // console.log("myStrokeWeight", myStrokeWeight);
  //console.log(visualMode);
  if (keyCode === LEFT_ARROW) {
    visualMode--;
    zoom = 1;
    myStrokeWeight = 1;
  } else if (keyCode === RIGHT_ARROW) {
    visualMode++;
    zoom = 1;
    myStrokeWeight = 1;
  }

  if (visualMode > 5) {
    visualMode = 0;
  } else if (visualMode < 0) {
    visualMode = 5;
  }

  if (keyCode === UP_ARROW) {
    myStrokeWeight++;
  } else if (keyCode === DOWN_ARROW) {
    myStrokeWeight--;
  }

  myStrokeWeight = constrain(myStrokeWeight, 1, 5);
  
}

function hideSth() {
  myBtnRow.style.opacity = 0;
  voiceLevelRow.style.opacity = 0;
}

var x;
document.addEventListener("mousemove", function() {
  myBtnRow.style.opacity = 1;
  voiceLevelRow.style.opacity = .5;

  if (x) {
    clearTimeout(x);
  }
  x = setTimeout(hideSth, 5000);
})


