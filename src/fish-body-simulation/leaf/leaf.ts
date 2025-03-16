import { findPosition, normalizeVector, Point, random } from "../functions"

export class Leaf {
  radius: number
  x: { original: number; current: number; target: number }
  y: { original: number; current: number; target: number }
  points: { length: number; radian: number }[]
  frameCount: number
  oscillateVector: { x: number; y: number }
  oscillateMax: number

  constructor(x: number, y: number, radius: number, segments: number) {
    this.x = { original: x, current: x, target: x }
    this.y = { original: y, current: y, target: y }
    this.radius = radius
    const firstPointRadian = random(0, 2 * Math.PI)
    const segmentRadian = (2 * Math.PI) / segments

    //@ts-ignore
    this.points = Array.from({ length: segments }).map((num, index) => {
      const length =
        index === 0
          ? random(radius * 0.1, radius * 0.2)
          : random(radius * 0.98, radius * 1.02)
      const radian = firstPointRadian + segmentRadian * index
      return { length: length, radian: radian }
    })
    this.frameCount = 0
    this.oscillateVector = { x: 0, y: 0 }
    this.oscillateMax = radius * 0.4
  }
  update() {
    const { x, y } = this.oscillateVector
    const acceleration = Math.sqrt(x ** 2 + y ** 2)
    this.frameCount += 0.1 * Math.log(0.01 * acceleration + 1)
    const xOffset = Math.sin(this.frameCount) * x
    const yOffset = Math.sin(this.frameCount) * y
    this.x.target = this.x.original + xOffset
    this.y.target = this.y.original + yOffset

    this.oscillateVector.x *= 0.99
    this.oscillateVector.y *= 0.99
  }
  applyOscillation(x: number, y: number, strength: number) {
    const newVector = normalizeVector(
      { x: this.x.current - x, y: this.y.current - y },
      strength
    )
    let resultVector = {
      x: newVector.x + this.oscillateVector.x,
      y: newVector.y + this.oscillateVector.y,
    }
    const magnitude = Math.sqrt(resultVector.x ** 2 + resultVector.y ** 2)
    if (magnitude > this.oscillateMax) {
      resultVector = normalizeVector(resultVector, this.oscillateMax)
    }
    this.oscillateVector = resultVector
  }

  drawLeaf(ctx: CanvasRenderingContext2D) {
    this.x.current += (this.x.target - this.x.current) * 0.1
    this.y.current += (this.y.target - this.y.current) * 0.1
    const points: Point[] = this.points.map((point) => {
      const { length, radian } = point
      return findPosition(
        { x: this.x.current, y: this.y.current },
        radian,
        length
      )
    })
    const lastPoint = points[points.length - 1]
    ctx.beginPath()
    //ctx.moveTo(lastPoint.x, lastPoint.y)
    ctx.moveTo(
      (points[0].x + points[points.length - 1].x) / 2,
      (points[0].y + points[points.length - 1].y) / 2
    )
    for (let i = 0; i < points.length - 2; i++) {
      const x2 = (points[i].x + points[i + 1].x) / 2
      const y2 = (points[i].y + points[i + 1].y) / 2
      ctx.quadraticCurveTo(points[i].x, points[i].y, x2, y2)
    }
    ctx.quadraticCurveTo(
      lastPoint.x,
      lastPoint.y,
      (lastPoint.x + points[0].x) / 2,
      (lastPoint.y + points[0].y) / 2
    )

    ctx.stroke()
    ctx.fill()
  }
  getPosition() {
    return { x: this.x.current, y: this.y.current }
  }
}
