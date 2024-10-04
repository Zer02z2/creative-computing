import p5 from "p5"

let video
let vScale = 5
let pixelList = []

const sketch = (p) => {
  p.setup = () => {
    p.pixelDensity(1)
    p.createCanvas(640, 480)
    video = p.createCapture(p.VIDEO)
    video.size(p.width / vScale, p.height / vScale)
    for (var y = 1; y < video.height; y++) {
      for (var x = 1; x < video.width; x++) {
        var newPixel = new pixel(p, x, y)
        pixelList.push(newPixel)
      }
    }
    p.noCursor()
    video.hide()
  }

  p.draw = () => {
    p.background(0)
    video.loadPixels()

    for (const i of pixelList) {
      i.update(p)
    }
  }
}

new p5(sketch)

class pixel {
  constructor(p, ogX, ogY) {
    this.ogX = ogX
    this.ogY = ogY
    this.index = (video.width - ogX + 1 + ogY * video.width) * 4
    this.speed = 5 / vScale
    this.xMovement = p.random(0.1, this.speed) * p.random([-1, 1])
    this.yMovement =
      Math.sqrt(this.speed ** 2 - this.xMovement ** 2) * p.random([-1, 1])
    this.x = ogX * vScale
    this.y = ogY * vScale
  }

  update(p) {
    var r = video.pixels[this.index + 0]
    var g = video.pixels[this.index + 1]
    var b = video.pixels[this.index + 2]

    p.noStroke()
    p.fill(r, g, b)
    p.rectMode(p.CENTER)
    p.rect(this.x, this.y, vScale, vScale)

    if (
      p.dist(this.ogX * vScale, this.ogY * vScale, p.mouseX, p.mouseY) < 100
    ) {
      this.x = this.ogX * vScale
      this.y = this.ogY * vScale
    }

    if (this.x < 0 || this.x > p.width) {
      this.xMovement *= -1
    }
    if (this.y < 0 || this.y > p.height) {
      this.yMovement *= -1
    }

    this.x += this.xMovement
    this.y += this.yMovement
  }
}
