//Zongze Chen
//Music - Robot Walking by Zhang Zhen Yue
//Instruction:
//Left clik == add shape;
//1 == change shape of cursor;
//2 == save current sketch and clear canvas;
//3 == save current sketch and switch to a saved sketch randomly (need at least 3 sketches);
//4 == save current sketch and auto-switch between saved sketches (need at least 3 sketches);

var mysound, mic, fft
var beatCount = 0
var beatDetect = false
var beatMouse = 100
var started = false
var autoMode = false
var mouseShape
var fullList = [[]]
var currentNum = 0
var maxNum = 0
var styles = ["bass", "lowMid", "mid", "highMid"]
var colorList = [
  "rgb(74, 207, 85)",
  "rgb(181, 36, 36)",
  "rgb(255, 164, 54)",
  "rgb(54, 155, 255)",
  "rgb(21, 86, 191)",
  "rgb(245, 228, 232)",
]

function preload() {
  soundFormats("mp3")
  mysound = loadSound("1.mp3")
}

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight)

  fft = new p5.FFT()
  peakDetect = new p5.PeakDetect(20, 20000, 0.18, 20)

  cnv.mousePressed(addShape)

  mouseShape = randomShape()
}

function draw() {
  background(0)
  fft.analyze()
  peakDetect.update(fft)
  if (autoMode == true) {
    if (peakDetect.isDetected) {
      if (beatDetect == false) {
        beatCount += 1
        beatDetect = true
      }
      if (beatCount > 1) {
        let k = currentNum
        while (currentNum == k) {
          currentNum = floor(random(0, maxNum))
        }
        beatCount = 0
      }
    } else {
      beatDetect = false
    }
  }
  if (started == false) {
    noStroke()
    fill(255)
    triangle(
      width / 2 - 50,
      height / 2 - 50,
      width / 2 - 50,
      height / 2 + 50,
      width / 2 + 50,
      height / 2
    )
  } else {
    strokeWeight(0.5)

    beginShape()
    for (const i of fullList[currentNum]) {
      stroke(255)
      noFill()
      vertex(i.getX, i.getY)
    }
    vertex(mouseShape.getX, mouseShape.getY)
    endShape()

    for (const i of fullList[currentNum]) {
      strokeWeight(0.5)
      i.update()
    }

    mouseShape.x = mouseShape.getX = mouseX
    mouseShape.y = mouseShape.getY = mouseY
    mouseShape.update()
  }
}

function addShape() {
  if (started == false) {
    started = true
    mysound.play()
    noCursor()
  } else {
    let newShape
    if (mouseShape.class == "circle") {
      newShape = Object.create(circles.prototype)
      Object.assign(newShape, mouseShape)
    }
    if (mouseShape.class == "rectangle") {
      newShape = Object.create(rectangles.prototype)
      Object.assign(newShape, mouseShape)
    }
    if (mouseShape.class == "triangle") {
      newShape = Object.create(triangles.prototype)
      Object.assign(newShape, mouseShape)
    }
    newShape.col = 0
    //newShape.col = random(colorList);
    fullList[currentNum].push(newShape)
    mouseShape = randomShape()
  }
}

function keyPressed() {
  if (key == 1) {
    mouseShape = randomShape()
  }
  if (key == 2) {
    fullList.push([])
    maxNum += 1
    currentNum = maxNum
  }
  if (key == 3) {
    if (fullList.length > 2) {
      let k = currentNum
      while (currentNum == k) {
        currentNum = floor(random(0, maxNum))
      }
      print(currentNum)
    }
  }
  if (key == 4) {
    if (fullList.length > 2) {
      if (autoMode == false) {
        autoMode = true
      } else {
        autoMode = false
      }
    }
  }
}

class circles {
  constructor(x, y, frequency, type, col) {
    this.x = x
    this.y = y
    this.minDiameter = random(40, 60)
    this.maxDiameter = random(80, 200)
    this.frequency = frequency
    this.type = type
    this.lerped = 0
    this.col = col
    if (this.type == 2 || 3) {
      this.diameter = (this.minDiameter + this.maxDiameter) / 2
      this.maxDisplace = random(70, 400)
      this.direction = random([-1, 1])
    }
    this.getX = x
    this.getY = y
  }

  get class() {
    return "circle"
  }

  update() {
    ellipseMode(CENTER)
    //noStroke();
    fill(this.col)
    stroke(255)
    //fill(0);
    this.lerped = lerp(this.lerped, fft.getEnergy(this.frequency), 0.4)

    if (this.type == 1) {
      let diameter = map(
        this.lerped,
        0,
        255,
        this.minDiameter,
        this.maxDiameter
      )
      circle(this.x, this.y, diameter)
    } else if (this.type == 2) {
      let displacement = map(
        this.lerped,
        0,
        255,
        -this.maxDisplace,
        this.maxDisplace
      )
      circle(this.x + this.direction * displacement, this.y, this.diameter)
      this.getX = this.x + this.direction * displacement
    } else if (this.type == 3) {
      let displacement = map(
        this.lerped,
        0,
        255,
        -this.maxDisplace,
        this.maxDisplace
      )
      circle(this.x, this.y - displacement, this.diameter)
      this.getY = this.y - displacement
    }
  }
}

class rectangles {
  constructor(x, y, frequency, type, col) {
    this.x = x
    this.y = y
    this.frequency = frequency
    this.type = type
    this.lerped = 0
    this.maxDisplace = random(20, 300)
    this.col = col
    if (this.type == 1) {
      this.width = random(30, 80)
      this.height = random(60, 200)
    } else if (this.type == 2) {
      this.width = random(25, 40)
      this.height = this.width
      this.direction = random([-1, 1])
    } else if (this.type == 3) {
      this.width = random(60, 80)
      this.height = random(20, 30)
    }
    this.getX = x
    this.getY = y
    this.angle = (this.width + this.height) / 2 / 10
    this.angle = 0
  }

  get class() {
    return "rectangle"
  }

  update() {
    rectMode(CENTER)
    //noStroke();
    fill(this.col)
    stroke(255)
    //fill(0);
    this.lerped = lerp(this.lerped, fft.getEnergy(this.frequency), 0.4)

    if (this.type == 1) {
      //vertical longer
      let displacement = map(this.lerped, 0, 255, 0, this.maxDisplace)
      rect(
        this.x,
        this.y - displacement / 2,
        this.width,
        this.height + displacement,
        this.angle
      )
      this.getY = this.y - displacement / 2
    } else if (this.type == 2) {
      //horizontal move
      let displacement = map(
        this.lerped,
        0,
        255,
        -this.maxDisplace,
        this.maxDisplace
      )
      rect(
        this.x + this.direction * displacement,
        this.y,
        this.width,
        this.height,
        this.angle
      )
      this.getX = this.x + this.direction * displacement
    } else if (this.type == 3) {
      //horizontal wider
      let displacement = map(this.lerped, 0, 255, 0, this.maxDisplace)
      rect(this.x, this.y, this.width + displacement, this.height, this.angle)
    }
  }
}

class triangles {
  constructor(x, y, frequency, type, col) {
    this.x = x
    this.y = y
    this.horiSize = random(20, 60)
    this.verSize = sqrt(1 / 3) * this.horiSize
    this.frequency = frequency
    this.type = type
    this.lerped = 0
    this.col = col
    if (this.type == 1) {
      this.angle = 0
      this.rotateSpeed = 10
    }
    if (this.type == 2) {
      this.maxDisplace = random(this.horiSize / 2, this.verSize)
    }
    this.getX = x
    this.getY = y
  }

  get class() {
    return "triangle"
  }

  update() {
    push()
    translate(this.x, this.y)
    //noStroke();
    fill(this.col)
    stroke(255)
    //fill(0);
    this.lerped = lerp(this.lerped, fft.getEnergy(this.frequency), 0.4)

    if (this.type == 1) {
      let anglePlus = map(this.lerped, 0, 255, 0, this.rotateSpeed)
      if (anglePlus > this.rotateSpeed * 0.75) {
        this.angle += anglePlus
      } else {
        this.angle += anglePlus / 3
      }
      //this.angle += anglePlus;
      rotate(radians(this.angle))
      triangle(
        -this.horiSize,
        this.verSize,
        this.horiSize,
        this.verSize,
        0,
        -this.verSize * 2
      )
    } else if (this.type == 2) {
      let displacement = map(this.lerped, 0, 255, 0, this.maxDisplace)
      triangle(
        -this.horiSize + displacement / 2,
        this.verSize,
        this.horiSize - displacement / 2,
        this.verSize,
        0,
        -this.verSize - displacement
      )
      this.getY = this.y - displacement / 2
    }
    // else if (this.type == 3){
    //   let displacement = map(this.lerped, 0, 255, -this.maxDisplace, this.maxDisplace);
    //   circle(this.x, this.y - displacement, this.diameter);
    //   this.getY = this.y - displacement;
    // }
    pop()
  }
}

function randomShape() {
  let randomNum = random([1, 2, 3, 4, 5, 6, 7, 8])
  //print(randomNum);
  if (randomNum == 1 || randomNum == 2 || randomNum == 3) {
    mouseShape = new circles(
      mouseX,
      mouseY,
      random(styles),
      random([1, 2, 3]),
      50
    )
  } else if (randomNum == 4 || randomNum == 5 || randomNum == 6) {
    mouseShape = new rectangles(
      mouseX,
      mouseY,
      random(styles),
      random([1, 2, 3]),
      50
    )
  } else if (randomNum == 7 || randomNum == 8) {
    mouseShape = new triangles(
      mouseX,
      mouseY,
      random(styles),
      random([1, 2]),
      50
    )
  }
  return mouseShape
}
