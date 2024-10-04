import p5 from "p5"
import soundUrl from "./heart_01.wav"

//---------------------------sound variables-----------------------
var heartbeat
//-------------------------------mouse variables-------------------------
var interval = 0
var firstpress = 0
var outerDiam = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
var presscheck = [
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
]
var pressinitial = false
var pressturn = 0
//-------------------------------heart variables----------------------
var heartcount = []
var redheart = false
var whiteheart = false
var blueheart = false
var blackheart = false
var orangeheart = false
var greenheart = false
var transitionning = 0
let initialcolor
var whiteP, redP, orangeP, greenP, blueP, blackP
let redmode, whitemode, orangemode, greenmode, bluemode, blackmode
var strokecolor

//------------------------------------------------------------------------------------

const sketch = (p) => {
  p.preload = () => {
    //p.soundFormats("wav")
    heartbeat = new Audio(soundUrl)
    heartbeat.volume = 1
  }
  p.setup = () => {
    initialcolor = p.color(10)
    redmode = p.color(150, 0, 0)
    whitemode = p.color(225)
    bluemode = p.color(40, 69, 168)
    orangemode = p.color(249, 166, 0)
    greenmode = p.color(5, 154, 50)
    strokecolor = p.color(225)
    const cnv = p.createCanvas(800, 800)
    cnv.mousePressed(() => {
      press(p)
    })
    whiteP = 0
    redP = 0
    blueP = 0
    blackP = 0
    orangeP = 0
    greenP = 0
  }
  p.draw = () => {
    p.background(initialcolor)

    hearttest(p)
    p.noStroke()
    //whiteheart
    if (whiteheart == true) {
      whiteheartmode(p)
      p.fill(10)
      p.text("White", 400, 500)
    }
    //redheart
    if (redheart == true) {
      redheartmode(p)
      p.text("Red", 400, 500)
    }
    //blueheart
    if (blueheart == true) {
      blueheartmode(p)
      p.text("Blue", 400, 500)
    }
    //blackheart
    if (blackheart == true) {
      p.text("Black", 400, 500)
    }
    //orangeheart
    if (orangeheart == true) {
      orangeheartmode(p)
      p.fill(10)
      p.text("Orange", 400, 500)
    }
    //greenheart
    if (greenheart == true) {
      greenheartmode(p)
      p.text("Green", 400, 500)
    }

    if (pressinitial == true) {
      playripple(p)
    }

    p.noStroke()
    p.fill(225)
    p.textAlign(p.CENTER, p.CENTER)
    p.text(interval, 400, 400)
  }
}

const press = (p) => {
  pressinitial = true
  presscheck[pressturn] = true
  outerDiam[pressturn] = 0
  pressturn += 1

  if (pressturn == 20) {
    pressturn = 0
  }

  heartbeat.play()

  if (p.millis() - firstpress < 201) {
    interval = 201
  } else {
    interval = p.millis() - firstpress
  }
  firstpress = p.millis()

  heartcount.push(interval)
}

function playripple(p) {
  for (var k = 0; k < 20; k++) {
    if (presscheck[k] == true) {
      for (var i = 0; i < 2; i++) {
        var diam = outerDiam[k] - 50 * i

        if (diam > 0) {
          var fade = p.map(diam, 0, p.width, 225, 0)
          strokecolor.setAlpha(fade)
          p.stroke(strokecolor)
          p.strokeWeight(3)
          p.noFill()
          p.ellipse(400, 400, diam)
        }
      }
      outerDiam[k] = outerDiam[k] + 5
    }
  }
}

//------------------------------------------heart test--------------------------------
function hearttest(p) {
  if (heartcount.length > 15) {
    //redheart
    for (let i = 0; i < 7; i++) {
      if ((heartcount.slice(-7)[i] < 600) & (heartcount.slice(-10)[i] > 400)) {
        redheart = true
        //currentmode = redmode
      } else {
        redreset(p)
        break
      }
    }
    //whiteheart
    for (let i = 0; i < 10; i++) {
      if ((heartcount.slice(-10)[i] < 400) & (heartcount.slice(-10)[i] > 200)) {
        whiteheart = true
      } else {
        whitereset(p)
        break
      }
    }
    //orangeheart
    for (let i = 0; i < 7; i++) {
      if ((heartcount.slice(-7)[i] < 800) & (heartcount.slice(-10)[i] > 600)) {
        orangeheart = true
        //currentmode = orangemode
      } else {
        orangereset(p)
        break
      }
    }
    //greenheart
    for (let i = 0; i < 7; i++) {
      if ((heartcount.slice(-7)[i] < 1000) & (heartcount.slice(-10)[i] > 800)) {
        greenheart = true
        //currentmode = greenmode
      } else {
        greenreset(p)
        break
      }
    }
    //blueheart
    for (let i = 0; i < 7; i++) {
      if ((heartcount.slice(-7)[i] < 1200) & (heartcount.slice(-7)[i] > 1000)) {
        blueheart = true
      } else {
        bluereset(p)
        break
      }
    }
    //blackheart
    for (let i = 0; i < 7; i++) {
      if (heartcount.slice(-7)[i] > 1200) {
        blackheart = true
      } else {
        blackheart = false
        break
      }
    }
  }
  if (whiteheart == true) {
    if (p.millis() - firstpress > 400) {
      whitereset(p)
    }
  }
  if (redheart == true) {
    if (p.millis() - firstpress > 600) {
      redreset(p)
    }
  }
  if (orangeheart == true) {
    if (p.millis() - firstpress > 800) {
      orangereset(p)
    }
  }
  if (greenheart == true) {
    if (p.millis() - firstpress > 1000) {
      greenreset(p)
    }
  }
  if (blueheart == true) {
    if (p.millis() - firstpress > 1200) {
      bluereset(p)
    }
  }
}

//-------------------------------------------colormode-------------------------------
function whiteheartmode(p) {
  strokecolor = p.color(10)
  var inter = p.lerpColor(initialcolor, whitemode, whiteP)
  if (transitionning <= 1) {
    whiteP += 0.01
  }
  p.background(inter)
}

function redheartmode(p) {
  if (transitionning <= 1) {
    redP += 0.01
  }
  var inter = p.lerpColor(initialcolor, redmode, redP)
  p.background(inter)
}

function blueheartmode(p) {
  if (transitionning <= 1) {
    blueP += 0.01
  }
  var inter = p.lerpColor(initialcolor, bluemode, blueP)
  p.background(inter)
}

function orangeheartmode(p) {
  strokecolor = p.color(10)
  if (transitionning <= 1) {
    orangeP += 0.01
  }
  var inter = p.lerpColor(initialcolor, orangemode, orangeP)
  p.background(inter)
}

function greenheartmode(p) {
  if (transitionning <= 1) {
    greenP += 0.01
  }
  var inter = p.lerpColor(initialcolor, greenmode, greenP)
  p.background(inter)
}

//------------------------------------reset--------------------------------------
function whitereset(p) {
  whiteheart = false
  whiteP = 0
  strokecolor = p.color(225)
}

function redreset(p) {
  redheart = false
  redP = 0
  strokecolor = p.color(225)
}

function bluereset(p) {
  blueheart = false
  blueP = 0
  strokecolor = p.color(225)
}

function orangereset(p) {
  orangeheart = false
  orangeP = 0
  strokecolor = p.color(225)
}

function greenreset(p) {
  greenheart = false
  greenP = 0
  strokecolor = p.color(225)
}

new p5(sketch)
