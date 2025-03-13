import { random, rect } from "./functions"

export class Cube {
  x: number
  y: number
  vX: number
  vY: number
  directionX: 1 | -1
  directionY: 1 | -1
  vMax: number
  vMin: number
  vDash: number
  w: number
  h: number
  pBoost: number
  pDirectionChange: number
  constructor(x: number, y: number, vMax: number) {
    this.x = x
    this.y = y
    this.vMax = vMax
    this.vMin = vMax * 0
    this.vDash = vMax * 3
    this.vX = random(0, this.vMax)
    this.vY = random(0, this.vMax)
    this.w = window.innerWidth * 0.01
    this.h = this.w
    this.directionX = Math.random() < 0.5 ? 1 : -1
    this.directionY = Math.random() < 0.5 ? 1 : -1
    this.pBoost = 0.004
    this.pDirectionChange = 0.001
  }
  update(xBound: number, yBound: number) {
    if (Math.random() < this.pBoost || this.vX - this.vMin <= 0.002) {
      this.vX = this.boostVelocity()
      this.vY = random(0, this.vX)
      this.directionX *= Math.random() < 0.2 ? -1 : 1
    }
    if (Math.random() < this.pBoost || this.vY - this.vMin <= 0.002) {
      this.vY = this.boostVelocity()
      this.vX = random(0, this.vY)
      this.directionY *= Math.random() < 0.2 ? -1 : 1
    }

    if (this.vX > this.vMin)
      this.vX -= (this.vX - this.vMin) * random(0.01, 0.02)
    if (this.vY > this.vMin)
      this.vY -= (this.vY - this.vMin) * random(0.01, 0.02)

    if (Math.random() < this.pDirectionChange) this.directionX *= -1
    if (Math.random() < this.pDirectionChange) this.directionY *= -1

    this.x += this.vX * this.directionX
    this.y += this.vY * this.directionY

    this.preventOverBoarder(xBound, yBound)
  }
  boostVelocity() {
    return random(this.vMax / 2, this.vMax)
  }
  preventOverBoarder(xBound: number, yBound: number) {
    if (this.x + this.w / 2 >= xBound) {
      this.x = xBound - this.w / 2
      this.directionX *= -1
    } else if (this.x - this.w / 2 <= 0) {
      this.x = this.w / 2
      this.directionX *= -1
    } else if (this.y + this.h / 2 >= yBound) {
      this.y = yBound - this.h / 2
      this.directionY *= -1
    } else if (this.y - this.h / 2 <= 0) {
      this.y = this.h / 2
      this.directionY *= -1
    }
  }
  dash(radian: number) {
    const vX = this.vDash * Math.cos(radian)
    const vY = this.vDash * Math.sin(radian)
    this.vX = Math.abs(vX)
    this.vY = Math.abs(vY)
    this.directionX = vX >= 0 ? 1 : -1
    this.directionY = vY >= 0 ? 1 : -1
  }
  drawRig(ctx: CanvasRenderingContext2D) {
    rect(ctx, this.x - this.w / 2, this.y - this.h / 2, this.w, this.h)
  }
  getPosition() {
    return { x: this.x, y: this.y }
  }
}
