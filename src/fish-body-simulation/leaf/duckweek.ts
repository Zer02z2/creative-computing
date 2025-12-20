import { findPosition, normalizeVector, Point, random } from "../functions"

export class DuckWeed {
  radius: number
  x: { current: number; target: number }
  y: { current: number; target: number }
  points: { length: number; radian: number }[]
  moveVector: { x: number; y: number }
  vectorMax: number
  longestRadius: number = 0

  constructor(x: number, y: number, radius: number, segments: number) {
    this.x = { current: x, target: x }
    this.y = { current: y, target: y }
    this.radius = radius
    const firstPointRadian = random(0, 2 * Math.PI)
    const segmentRadian = (2 * Math.PI) / segments

    //@ts-ignore
    this.points = Array.from({ length: segments }).map((num, index) => {
      const length = random(radius * 0.98, radius * 1.02)
      if (length > this.longestRadius) this.longestRadius = length
      const radian = firstPointRadian + segmentRadian * index
      return { length: length, radian: radian }
    })
    this.moveVector = { x: 0, y: 0 }
    this.vectorMax = radius * 0.1
  }
  update(canvas: HTMLCanvasElement) {
    const { x, y } = this.moveVector
    this.x.target += x
    this.y.target += y

    this.moveVector.x *= 0.99
    this.moveVector.y *= 0.99

    if (
      this.x.current + this.longestRadius < 0 ||
      this.x.current - this.longestRadius > canvas.width ||
      this.y.current + this.longestRadius < 0 ||
      this.y.current - this.longestRadius > canvas.height
    ) {
      this.x.current = random(0, canvas.width)
      this.x.target = this.x.current
      this.y.current = random(0, canvas.height)
      this.y.target = this.y.current
    }
  }
  applyVector(x: number, y: number, strength: number) {
    const newVector = normalizeVector(
      { x: this.x.current - x, y: this.y.current - y },
      strength
    )
    let resultVector = {
      x: newVector.x + this.moveVector.x,
      y: newVector.y + this.moveVector.y,
    }
    const magnitude = Math.sqrt(resultVector.x ** 2 + resultVector.y ** 2)
    if (magnitude > this.vectorMax) {
      resultVector = normalizeVector(resultVector, this.vectorMax)
    }
    this.moveVector = resultVector
  }

  drawWeed(ctx: CanvasRenderingContext2D) {
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
