import { Chain } from "./chain"

const bodyPoints = [
  0.426, 0.851, 0.957, 1.0, 0.979, 0.957, 0.872, 0.787, 0.702, 0.638, 0.596,
  0.532, 0.426, 0.319,
]

export class Fish {
  body: Chain
  constructor(x: number, y: number, length: number, width: number) {
    const gap = length / bodyPoints.length
    const smallestAngle = 160
    const sizes = bodyPoints.map((d) => d * width)
    this.body = new Chain(x, y, gap, smallestAngle, sizes)
  }

  update(canvas: HTMLCanvasElement, x: number, y: number) {
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const width = canvas.width
    const height = canvas.height

    this.body.update(ctx, x, y, width, height)
    this.body.drawSkin(ctx)
  }
  drawRig(ctx: CanvasRenderingContext2D) {
    this.body.drawRig(ctx)
  }
}
