//---------------------------sound variables-----------------------
var heartbeat;
function preload(){
  soundFormats('wav');
  heartbeat = loadSound('heart_01');
  heartbeat.setVolume(1);
}
//-------------------------------mouse variables-------------------------
var interval = 0;
var firstpress = 0;
var outerDiam = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var presscheck = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
var pressinitial = false;
var pressturn = 0;
//-------------------------------heart variables----------------------
var heartcount = [];
var redheart = false;
var whiteheart = false;
var blueheart = false;
var blackheart = false;
var orangeheart = false;
var greenheart = false;
var transitionning = 0;
let initialcolor;
var whiteP, redP, orangeP, greenP, blueP, blackP;
let redmode, whitemode, orangemode, greenmode, bluemode, blackmode;
var strokecolor;
//---------------------------------AI variables----------------------
var speech;
var greeting = [];
var slowdown = [];
var speedup = [];
var keep = [];
var wantwhite = [];
var wantred = [];
var wantorange = [];
var wantgreen = [];
var wantblue = [];
var hatewhite = [];
var hatered = [];
var hateorange = [];
var hategreen = [];
var hateblue = [];
var staywhite = [];
var stayred = [];
var stayorange = [];
var staygreen = [];
var stayblue = [];

//-------------------------------------set up------------------------------------------
function setup() {
  initialcolor = color(10);
  redmode = color(150, 0, 0)
  whitemode = color(225);
  bluemode = color(40, 69, 168);
  orangemode = color(249, 166, 0);
  greenmode = color(5, 154, 50);
  strokecolor = color(225);
  cnv = createCanvas(800, 800);
  cnv.mousePressed(press);
  whiteP = 0;
  redP = 0;
  blueP = 0;
  blackP = 0;
  orangeP = 0;
  greenP = 0;
  
}

//--------------------------------------draw-------------------------------------------
function draw() {
  background(initialcolor);
  
  hearttest();
  noStroke();
  //whiteheart
  if (whiteheart == true){
    whiteheartmode();
    fill(10);
    text("White", 400, 500);
  }
  //redheart
  if (redheart == true){
    redheartmode();
    text("Red", 400, 500);
  }
  //blueheart
  if (blueheart == true){
    blueheartmode();
    text("Blue", 400, 500);
  }
  //blackheart
  if (blackheart == true){
    text("Black", 400, 500);
  }
  //orangeheart
  if (orangeheart == true){
    orangeheartmode();
    fill(10);
    text("Orange", 400, 500)
  }
  //greenheart
  if (greenheart == true){
    greenheartmode();
    text("Green", 400, 500)
  }
  
  if (pressinitial == true){
    playripple();
  }
  
  noStroke();
  fill(225);
  textAlign(CENTER, CENTER);
  text(interval, 400, 400);
  
}

//-----------------------------------------functions---------------------------------
  
function press(){
  pressinitial = true;
  presscheck[pressturn] = true;
  outerDiam[pressturn] = 0;
  pressturn += 1;
  
  if (pressturn == 20){
    pressturn = 0;
  }
  
  heartbeat.play();
  
  if (millis() - firstpress < 201){
    interval = 201;
  }
  else{
    interval = millis() - firstpress;
  }
  firstpress = millis();
  
  heartcount.push(interval);

}

function playripple(){
  for (var k = 0; k < 20; k++){
    if (presscheck[k] == true){
      for (var i = 0; i < 2; i++){
          var diam = outerDiam[k] - 50 * i;    

            if (diam > 0){
              var fade = map(diam, 0, width, 225, 0);
              strokecolor.setAlpha(fade);
              stroke(strokecolor);
              strokeWeight(3);
              noFill();
              ellipse(400, 400, diam);
            }
        }
        outerDiam[k] = outerDiam[k] + 5;
    }
  }
}

function selecttext(){
  if (pressinitial == false){
    speech = random(greeting);
  }
}

//------------------------------------------heart test--------------------------------
function hearttest(){
  
  if (heartcount.length > 15){
    //redheart
    for (let i = 0; i < 7; i++){
      if (heartcount.slice(-7)[i] < 600 & heartcount.slice(-10)[i] > 400){
        redheart = true;
        currentmode = redmode;
      }
      else{
        redreset();
        break;
      }
    }
    //whiteheart
    for (let i = 0; i < 10; i++){
      if (heartcount.slice(-10)[i] < 400 & heartcount.slice(-10)[i] > 200){
        whiteheart = true;
      }
      else{
        whitereset();
        break;
      }
    }
    //orangeheart
    for (let i = 0; i < 7; i++){
      if (heartcount.slice(-7)[i] < 800 & heartcount.slice(-10)[i] > 600){
        orangeheart = true;
        currentmode = orangemode;
      }
      else{
        orangereset();
        break;
      }
    }
    //greenheart
    for (let i = 0; i < 7; i++){
      if (heartcount.slice(-7)[i] < 1000 & heartcount.slice(-10)[i] > 800){
        greenheart = true;
        currentmode = greenmode;
      }
      else{
        greenreset();
        break;
      }
    }
    //blueheart
    for (let i = 0; i < 7; i++){
      if (heartcount.slice(-7)[i] < 1200 & heartcount.slice(-7)[i] > 1000){
        blueheart = true;
      }
      else{
        bluereset();
        break;
      }
    }
    //blackheart
    for (let i = 0; i < 7; i++){
      if (heartcount.slice(-7)[i] > 1200){
        blackheart = true;
      }
      else{
        blackheart = false;
        break;
      }
    }

  }
  if (whiteheart == true){
    if (millis() - firstpress > 400){
      whitereset();
    }
  }
  if (redheart == true){
    if (millis() - firstpress > 600){
      redreset();
    }
  }
  if (orangeheart == true){
    if (millis() - firstpress > 800){
      orangereset();
    }
  }
  if (greenheart == true){
    if (millis() - firstpress > 1000){
      greenreset();
    }
  }
  if (blueheart == true){
    if (millis() - firstpress > 1200){
      bluereset();
    }
  }
  
}

//-------------------------------------------colormode-------------------------------
function whiteheartmode(){
  strokecolor = color(10);
  var inter = lerpColor(initialcolor, whitemode, whiteP)
  if (transitionning <= 1){
    whiteP += 0.01
  }
  background(inter);
}

function redheartmode(){
  if (transitionning <= 1){
    redP += 0.01
  }
  var inter = lerpColor(initialcolor, redmode, redP)
  background(inter);
}


function blueheartmode(){
  if (transitionning <= 1){
    blueP += 0.01
  }
  var inter = lerpColor(initialcolor, bluemode, blueP)
  background(inter);
}

function orangeheartmode(){
  strokecolor = color(10);
  if (transitionning <= 1){
    orangeP += 0.01
  }
  var inter = lerpColor(initialcolor, orangemode, orangeP)
  background(inter);
}

function greenheartmode(){
  if (transitionning <= 1){
    greenP += 0.01
  }
  var inter = lerpColor(initialcolor, greenmode, greenP)
  background(inter);
}

//------------------------------------reset--------------------------------------
function whitereset(){
  whiteheart = false;
  whiteP = 0;
  strokecolor = color(225);
}

function redreset(){
  redheart = false;
  redP = 0;
  strokecolor = color(225);
}
  
function bluereset(){
  blueheart = false;
  blueP = 0;
  strokecolor = color(225);
}

function orangereset(){
  orangeheart = false;
  orangeP = 0;
  strokecolor = color(225);
}

function greenreset(){
  greenheart = false;
  greenP = 0;
  strokecolor = color(225);
}
//---------------------------AI speech collection---------------------- 
greeting = ["Hey, you","Yes, you there","Come here","Touch me","Come on","Don't be shy"];
slowdown = ["Slow down","No no no too fast","Too fast","You're too fast"];
speedup = ["Speed up","Too slow","You're too slow","Just go faster"];
keep = ["Keep going","Good, keep this","That's right, keep this","Nice","Focus, don't be distracted","Yes, you're doing good","I like this, now keep going", "Soon we'll be there"];
wantwhite = ["I want something more...extreme","Something crazy","Speed all the way up, please"];
wantred = ["Do you know what love feels like?","Or passion?","I haven't felt that for a long time","Maybe you can bring me there?"];
wantorange = ["Now I just want to be happy","Do you know what it's like?",""]
