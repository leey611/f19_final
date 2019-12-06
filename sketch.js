var rBtn = document.getElementById('myBtn');
var modeBtn = document.getElementById('modeBtn');
var dayNightBtn = document.getElementById('dayNightBtn');
var mybuttons = document.querySelectorAll(".btn");


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

var myStrokeWeight = 1;
var canvasColor;
var strokeColor;
//var userVoice;
//function touchStarted() { getAudioContext().resume(); } 

rBtn.addEventListener("click", changeState);
modeBtn.addEventListener("click", changeVisual);
dayNightBtn.addEventListener("click", changeDayNight);

function setup(){
  var cnv = createCanvas(windowWidth, windowHeight);
    cnv.id('mycanvas');
    cnv.style('position', 'absolute');
    cnv.style('transform', 'translate(-50%, -50%)');
    cnv.style('top', '50%');
    cnv.style('left', '50%');
    cnv.style('z-index', '-1');
  // recordButton = createButton('record');
  //   recordButton.id('recordButton');
  angleMode(DEGREES);
  
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
  if (noiseHistory === null) {
     noiseHistory = '';
   }

   noiseHistoryCircle = getItem('userVoiceCirle');
   if (noiseHistoryCircle === null) {
    noiseHistoryCircle = '';
   }

   historyBlub = getItem('userVoiceBlub');
   console.log(historyBlub);
   if (historyBlub === "") {
    historyBlub = [];
   }

   noiseHistoryDot = getItem('userVoiceDot');
   if (noiseHistoryDot === '') {
    noiseHistoryDot = [];
   }
   mic.start();
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
  }
  
  //drawBlub();
  //drawCircle2();

  
  storeItem('userVoice', noiseHistory);
  storeItem('userVoiceCirle', noiseHistoryCircle);
  storeItem('userVoiceBlub', historyBlub);
  storeItem('dayNightState', dayNightState);
  storeItem('userVoiceDot', noiseHistoryDot);
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
  if(visualMode > 4){
    visualMode = 0;
  }
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
  myStrokeWeight2 = map(myStrokeWeight, 0, mouseY, 1, 15);
  strokeWeight(myStrokeWeight2);
  var vol = mic.getLevel();
  noiseHistory.push(vol);
  beginShape();
    for (var i = 0; i < noiseHistory.length; i++){
      stroke(strokeColor);
      noFill();
      var y = map(noiseHistory[i], 0, 1, height/2, 0);
      i++;
      vertex(i, y);
      
      if (noiseHistory.length > width) {
        noiseHistory.splice(0, 1);
      }
  }
  endShape();
}

function drawCircle() {
  background(canvasColor);
  fill(strokeColor);
  var vol = mic.getLevel();
  ellipse(width/2, height/2, vol*height*10, vol*height*10);
  //console.log(vol);
}


function drawCircle2() {
  background(canvasColor);
  myStrokeWeight2 = map(myStrokeWeight, 0, mouseY, 1, 15);
  strokeWeight(myStrokeWeight2);
  var vol = mic.getLevel();
  noiseHistoryCircle.push(vol);
  beginShape();
    for (var i = 0; i < width/25; i++){
      stroke(strokeColor);
      noFill();
      var y = map(noiseHistoryCircle[i], 0, 1, height/2, 0);
      i++;
      //vertex(i, y);
      ellipse(width/2, y, i*25, i*25);
    
      if (noiseHistoryCircle.length > width/25) {
        noiseHistoryCircle.splice(0, 1);
      }
  }
  endShape();
}

function drawBlub() {
  background(canvasColor);
  myStrokeWeight2 = map(myStrokeWeight, 0, mouseY, 1, 15);
  strokeWeight(myStrokeWeight2);
  translate(width/2, height/2);
  var vol = mic.getLevel();
  console.log(historyBlub);
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
      
      if (historyBlub.length > 360) {
        historyBlub.splice(0, 1);
      }
  }
  endShape();
  
}

function drawDot() {
  background(canvasColor);
  myStrokeWeight2 = map(myStrokeWeight, 0, mouseY, 1, 15);
  strokeWeight(1);
  var vol = mic.getLevel();
  noiseHistoryDot.push(vol);
  beginShape();
    for (var i = 0; i < noiseHistoryDot.length; i++){
      stroke(strokeColor);
      noFill();
      var y = map(noiseHistoryDot[i], 0, 1, height/2, 0);
      i++;
      point(i, y);
      
      if (noiseHistoryDot.length > width/2) {
        noiseHistoryDot.splice(0, 1);
      }
  }
  endShape();
}


// console.log(state);
// function toggleRecord(){
//   mic.start();
// }

// function windowResized() {
//   resizeCanvas(windowWidth, windowHeight);
// }

//function keyPressed(){
  // storeItem('userVoice', noiseHistory);
//}