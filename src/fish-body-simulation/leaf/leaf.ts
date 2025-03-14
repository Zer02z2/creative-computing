import { findPosition, line, Point, random } from "../functions"

export class Leaf {
  radius: number
  x: number
  y: number
  points: { length: number; radian: number }[]

  constructor(x: number, y: number, radius: number, segments: number) {
    this.x = x
    this.y = y
    this.radius = radius
    const firstPointRadian = random(0, 2 * Math.PI)
    const segmentRadian = (2 * Math.PI) / segments

    //@ts-ignore
    this.points = Array.from({ length: segments }).map((num, index) => {
      const length =
        index === 0
          ? random(radius * 0.1, radius * 0.2)
          : random(radius * 0.95, radius * 1.05)
      const radian = firstPointRadian + segmentRadian * index
      return { length: length, radian: radian }
    })
  }

  drawLeaf(ctx: CanvasRenderingContext2D) {
    const points: Point[] = this.points.map((point) => {
      const { length, radian } = point
      return findPosition({ x: this.x, y: this.y }, radian, length)
    })
    const lastPoint = points[points.length - 1]
    ctx.beginPath()
    ctx.moveTo(lastPoint.x, lastPoint.y)
    for (let i = 0; i < points.length - 1; i++) {
      const x2 = (points[i].x + points[i + 1].x) / 2
      const y2 = (points[i].y + points[i + 1].y) / 2
      ctx.quadraticCurveTo(points[i].x, points[i].y, x2, y2)
    }
    ctx.stroke()
    ctx.fill()
  }
}
