import p5 from "p5"
import { Chain } from "./chain"

let chain

const sketch = (p) => {
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight)
    p.background(0)
    chain = new Chain(
      p,
      200,
      200,
      20,
      160,
      [40, 45, 47, 46, 45, 41, 37, 33, 30, 28, 25, 20, 15]
    )
    p.noFill()
    // fill(222, 68, 38)
    p.stroke(255)
    // noStroke()
  }

  p.draw = () => {
    p.background(0)
    chain.update(p)
    chain.drawSkin(p)
  }
}

new p5(sketch)
