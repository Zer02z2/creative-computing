var video

var vScale = 5

var pixelList = []

//var vScale = 5;

function setup() {
  //frameRate(20);
  pixelDensity(1)
  createCanvas(640, 480)
  video = createCapture(VIDEO)
  video.size(width / vScale, height / vScale)
  for (var y = 1; y < video.height; y++) {
    for (var x = 1; x < video.width; x++) {
      var newPixel = new pixel(x, y)
      pixelList.push(newPixel)
    }
  }
  noCursor()
  video.hide()
}

function draw() {
  background(0)
  video.loadPixels()

  for (const i of pixelList) {
    i.update()
  }
}

class pixel {
  constructor(ogX, ogY) {
    this.ogX = ogX
    this.ogY = ogY
    this.index = (video.width - ogX + 1 + ogY * video.width) * 4
    this.speed = 5 / vScale
    this.xMovement = random(0.1, this.speed) * random([-1, 1])
    this.yMovement =
      Math.sqrt(this.speed ** 2 - this.xMovement ** 2) * random([-1, 1])
    this.x = ogX * vScale
    this.y = ogY * vScale
  }

  update() {
    var r = video.pixels[this.index + 0]
    var g = video.pixels[this.index + 1]
    var b = video.pixels[this.index + 2]

    //var bright = (r + g + b) / 3;
    //var w = map(bright, 0, 255, 0, vScale);

    noStroke()
    fill(r, g, b)
    rectMode(CENTER)
    //ellipseMode(CENTER);
    rect(this.x, this.y, vScale, vScale)
    //circle(this.x, this.y,10);

    if (dist(this.ogX * vScale, this.ogY * vScale, mouseX, mouseY) < 100) {
      // let [x, y] = [map(this.ogX*vScale - this.x, width, 0, 220, 5),
      //              map(this.ogY*vScale - this.y, height, 0, 220, 5)]
      this.x = this.ogX * vScale
      this.y = this.ogY * vScale
      // this.x += x;
      // this.y += y;
    }

    if (this.x < 0 || this.x > width) {
      this.xMovement *= -1
    }
    if (this.y < 0 || this.y > height) {
      this.yMovement *= -1
    }

    this.x += this.xMovement
    this.y += this.yMovement
  }
}
