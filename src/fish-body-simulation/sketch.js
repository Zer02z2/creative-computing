let chain

function setup() {
  createCanvas(windowWidth, windowHeight)
  background(0)
  chain = new Chain(
    200,
    200,
    20,
    160,
    [40, 45, 47, 46, 45, 41, 37, 33, 30, 28, 25, 20, 15]
  )
  noFill()
  // fill(222, 68, 38)
  stroke(255)
  // noStroke()
}

function draw() {
  background(0)
  chain.update()
  chain.drawSkin()
}
