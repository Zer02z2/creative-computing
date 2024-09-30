import { drawCirlce, drawLine, map } from "../myLibrary"

export class ClockHand {
  x: number
  y: number
  radius: { inner: number; outer: number }
  timeSlot: { top: [number, number]; bottom: [number, number] }
  radian: number

  constructor(
    x: ClockHand["x"],
    y: ClockHand["y"],
    options: {
      radius: ClockHand["radius"]
      timeSlot: ClockHand["timeSlot"]
    }
  ) {
    this.x = x
    this.y = y
    this.radius = options.radius
    this.timeSlot = options.timeSlot
    this.radian = 0
  }

  drawBody(ctx: CanvasRenderingContext2D) {
    drawCirlce(ctx, this.x, this.y, this.radius.inner)
    ctx.stroke()
  }
  drawHand(ctx: CanvasRenderingContext2D) {
    const x = this.radius.outer * Math.cos(this.radian) + this.x
    const y = -this.radius.outer * Math.sin(this.radian) + this.y
    drawLine(ctx, this.x, this.y, x, y)
    ctx.stroke()
  }
  drawLeft(ctx: CanvasRenderingContext2D) {
    this.radian = Math.PI
    this.drawHand(ctx)
  }
  drawRight(ctx: CanvasRenderingContext2D) {
    this.radian = 0
    this.drawHand(ctx)
  }
  drawAngle(
    ctx: CanvasRenderingContext2D,
    time: { hour: number; minute: number }
  ) {
    let color = "orange"
    if (time.hour >= this.timeSlot.top[0] && time.hour < this.timeSlot.top[1]) {
      const minutes = (time.hour - this.timeSlot.top[0]) * 60 + time.minute
      this.radian = map(minutes, 0, 120, Math.PI, 0)
    } else if (
      time.hour >= this.timeSlot.bottom[0] &&
      time.hour < this.timeSlot.bottom[1]
    ) {
      color = "blue"
      const minutes = (time.hour - this.timeSlot.bottom[0]) * 60 + time.minute
      this.radian = map(minutes, 0, 120, 2 * Math.PI, Math.PI)
    }
    this.drawHand(ctx)
    this.drawSun(ctx, color)
  }
  drawSun(ctx: CanvasRenderingContext2D, color: string) {
    const x = this.radius.outer * Math.cos(this.radian) + this.x
    const y = -this.radius.outer * Math.sin(this.radian) + this.y
    drawCirlce(ctx, x, y, this.radius.inner)
    ctx.fillStyle = color
    ctx.fill()
  }
}
