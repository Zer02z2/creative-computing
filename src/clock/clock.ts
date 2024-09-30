import { drawCirlce } from "../myLibrary"

export class ClockHand {
  x: number
  y: number
  radius: { inner: number; outer: number }
  timeSlot: { top: [number, number]; bottom: [number, number] }

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
  }

  drawBody(ctx: CanvasRenderingContext2D) {
    drawCirlce(ctx, this.x, this.y, this.radius.inner)
  }
}
