import { Chain } from "./chain"
import { findTangent } from "./functions"

const bodyPoints = [
  0.426, 0.851, 0.957, 1.0, 0.979, 0.957, 0.872, 0.787, 0.702, 0.638, 0.596,
  0.532, 0.426, 0.319,
]
const finPoints = [0.426, 0.517, 0.376, 0.224, 0.115, 0.05]
const tailPoints = [0.326, 0.301, 0.328, 0.341, 0.283, 0.216, 0.155, 0.09]

export class Fish {
  body: Chain
  fins: { fin: Chain; radian: number; position: number }[]
  tails: { tail: Chain; radian: number; position: number }[]
  constructor(x: number, y: number, length: number, width: number) {
    const gap = length / bodyPoints.length
    const smallestAngle = 160
    const sizes = bodyPoints.map((d) => d * width)
    this.body = new Chain(x, y, gap, smallestAngle, sizes)

    const finPositions = [3, 3, 8, 8]
    const finRadian = Math.PI / 2.2
    this.fins = finPositions.map((position, index) => {
      const finFactor = bodyPoints[position]
      const finSizes = finPoints.map((d) => d * width * finFactor)
      const newFin = new Chain(x, y, gap * 0.5, 160, finSizes)
      const radian = finRadian * (index % 2 == 0 ? 1 : -1) * finFactor
      return { fin: newFin, position: position, radian: radian }
    })
    const tailRadian = Math.PI / 12
    const tailPositions = [12, 12]
    this.tails = tailPositions.map((position, index) => {
      const tailSizes = tailPoints.map((d) => width * d)
      const newTail = new Chain(x, y, gap * 0.5, 160, tailSizes)
      const radian = tailRadian * (index % 2 == 0 ? 1 : -1)
      return { tail: newTail, radian: radian, position: position }
    })
  }

  move(canvas: HTMLCanvasElement, x: number, y: number) {
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const width = canvas.width
    const height = canvas.height

    this.body.freeMove(x, y, width, height)

    this.fins.forEach((fin) => {
      const finStartPoint = this.body.circles[fin.position].getPostion()
      const nextBodyPoint = this.body.circles[fin.position + 1].getPostion()
      const finRadian = findTangent(finStartPoint, nextBodyPoint) + fin.radian
      fin.fin.constrainMove(finStartPoint.x, finStartPoint.y, finRadian)
      fin.fin.drawOutline(ctx)
    })
    this.tails.forEach((tail) => {
      const tailStartPoint = this.body.circles[tail.position].getPostion()
      const nextTailPoint = this.body.circles[tail.position + 1].getPostion()
      const tailRadian =
        findTangent(tailStartPoint, nextTailPoint) + tail.radian
      tail.tail.constrainMove(tailStartPoint.x, tailStartPoint.y, tailRadian)
      tail.tail.drawOutline(ctx)
    })
    this.body.drawOutline(ctx)
  }
  drawRig(ctx: CanvasRenderingContext2D) {
    this.body.drawRig(ctx)
    this.fins.forEach((fin) => fin.fin.drawRig(ctx))
  }
}
