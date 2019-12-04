var realBtn = document.getElementById("realBtn");
var customBtn = document.getElementById("customBtn");

var inputFile;
var song;
var amp;
var audio = null;

var src;
//var mic;

//var amp;

// customBtn.addEventListener("click", function(){
//   realBtn.click();
// })

function readFile(files) {
    var fileReader = new FileReader();
      fileReader.readAsArrayBuffer(files[0]);
      fileReader.onload = function(e) {
        playAudioFile(e.target.result);
        console.log(("Filename: '" + files[0].name + "'"), ( "(" + ((Math.floor(files[0].size/1024/1024*100))/100) + " MB)" ));
      }
    }

function playAudioFile(file) {
    var context = new window.AudioContext();
      context.decodeAudioData(file, function(buffer) {
        var source = context.createBufferSource();
          source.buffer = buffer;
          source.loop = false;
          source.connect(context.destination);
          source.start(0); 
      });
    }

function selectedAudio(self) {
  var sketch = function(p) {
    var file = self.files[0];
    console.log(file)
    var reader = new FileReader();

    reader.onload = function(e) {
      src = e.target.result;
      audio = document.getElementById("audio");
      var source = document.getElementById("source");

      source.setAttribute("src", src);
      audio.load();
      // audio.pause();

      console.log("loaded 2")

      

      /*
        - select/upload audio file
        - load() audio file 
        - add src to preload function for p5
        - once file is loaded, begin p5 instance


      */

      var sound;

      p.preload = function(){
        sound = loadSound("'" + src + "'");
      }


      p.setup = function() {
      
      var cnv = createCanvas(windowWidth, windowHeight);
      cnv.id('mycanvas');
      cnv.style('position', 'absolute');
      cnv.style('transform', 'translate(-50%, -50%)');
      cnv.style('top', '50%');
      cnv.style('left', '50%');
      cnv.style('z-index', '-1');
      // amp = new p.Amplitude();
      amp.setInput(audio);
      audio.play();
      }



     p.draw = function() {
      //background(0);
      // console.log("amp:", amp)
      amp = new p.Amplitude();
      var level = amp.getLevel();
      ellipse(width/2, height/2, level*200, level*200);
      console.log("level" + level);
      }
    
    //}
    reader.readAsDataURL(file);
  }
  var myp5 = new p5(sketch);
}

var loadP5 = function(){

  console.log("loading p5")

  function preload() {

    // create sound
  }


  function setup() {
      var cnv = createCanvas(windowWidth, windowHeight);
      cnv.id('mycanvas');
      cnv.style('position', 'absolute');
      cnv.style('transform', 'translate(-50%, -50%)');
      cnv.style('top', '50%');
      cnv.style('left', '50%');
      cnv.style('z-index', '-1');

      //inputFile = createFileInput(handleFile);
      //inputFile.position(width/2, height/2);

      // amp = new p5.Amplitude();
      noLoop();
     //  if (context === null) {
     //   context = '';
     // }
  }

  function draw() {
    background(0);

    if (audio !== null) {
        audio.play();

        // console.log("test", audio.volume)
        // var level = amp.getLevel();
        ellipse(width/2, height/2, level*200, level*200);
        console.log(level);
    }
    //console.log(vol);

    // if(song) {
    //   song.play();
    // }
  }

}

function handleFile(file) {
  print(file);
  print(file.type);
  if (file.type === "audio") {
    song = loadSound(file.data);
    song.play();
    console.log("play!")

  } else {
    song = null;
  }
}



