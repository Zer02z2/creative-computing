import { drawCirlce, map } from "../myLibrary"

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
  }
  drawLeft() {
    this.radian = 0
    console.log(this.radian)
  }

  drawRight() {
    this.radian = Math.PI
    console.log(this.radian)
  }
  drawAngle(time: { hour: number; minute: number }) {
    if (time.hour >= this.timeSlot.top[0] && time.hour < this.timeSlot.top[1]) {
      const minutes = (time.hour - this.timeSlot.top[0]) * 60 + time.minute
      this.radian = map(minutes, 0, 120, 0, Math.PI)
    } else if (
      time.hour >= this.timeSlot.bottom[0] &&
      time.hour < this.timeSlot.bottom[1]
    ) {
      const minutes = (time.hour - this.timeSlot.bottom[0]) * 60 + time.minute
      this.radian = map(minutes, 0, 120, 0, Math.PI) + Math.PI
    }
    console.log(this.radian)
  }
}
