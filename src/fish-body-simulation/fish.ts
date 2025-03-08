import { Chain } from "./chain"
import { findTangent } from "./functions"

const bodyPoints = [
  0.426, 0.851, 0.957, 1.0, 0.979, 0.957, 0.872, 0.787, 0.702, 0.638, 0.596,
  0.532, 0.426, 0.319,
]
const finPoints = [0.426, 0.517, 0.376, 0.224, 0.115, 0.05]

export class Fish {
  body: Chain
  fin: Chain
  constructor(x: number, y: number, length: number, width: number) {
    const gap = length / bodyPoints.length
    const smallestAngle = 160
    const sizes = bodyPoints.map((d) => d * width)
    const finSizes = finPoints.map((d) => d * width)
    this.body = new Chain(x, y, gap, smallestAngle, sizes)
    this.fin = new Chain(x, y, gap * 0.5, 160, finSizes)
  }

  move(canvas: HTMLCanvasElement, x: number, y: number) {
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const width = canvas.width
    const height = canvas.height

    this.body.freeMove(x, y, width, height)

    const finStartPoint = this.body.circles[3].getPostion()
    const nextBodyPoint = this.body.circles[4].getPostion()
    const finRadian = findTangent(finStartPoint, nextBodyPoint) + Math.PI / 2.3
    this.fin.constrainMove(finStartPoint.x, finStartPoint.y, finRadian)

    this.fin.drawOutline(ctx)
    this.body.drawOutline(ctx)
  }
  drawRig(ctx: CanvasRenderingContext2D) {
    this.body.drawRig(ctx)
    this.fin.drawRig(ctx)
  }
}
