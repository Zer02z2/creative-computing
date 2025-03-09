import { rect } from "./functions"

export class Square {
  x: number
  y: number
  velocity: number
  vX: number
  vY: number
  w: number
  h: number
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
    const speedLimit = 10
    this.velocity = Math.random() * speedLimit
    this.vX = Math.random() * this.velocity * (Math.random() > 0.5 ? 1 : -1)
    this.vY =
      Math.sqrt(this.velocity ** 2 - this.vX ** 2) *
      (Math.random() > 0.5 ? 1 : -1)
    this.w = window.innerWidth * 0.01
    this.h = this.w
  }
  update(xBound: number, yBound: number) {
    this.x += this.vX
    this.y += this.vY
    if (this.x + this.w / 2 >= xBound || this.x - this.w / 2 <= 0) this.vX *= -1
    if (this.y + this.h / 2 >= yBound || this.y - this.h / 2 <= 0) this.vY *= -1
  }
  drawRig(ctx: CanvasRenderingContext2D) {
    rect(ctx, this.x - this.w / 2, this.y - this.h / 2, this.w, this.h)
  }
  getPosition() {
    return { x: this.x, y: this.y }
  }
}
