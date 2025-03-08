import { map } from "../myLibrary"
import { Circle } from "./circle"
import { findAngleBetween, findTangent, isOnLeft, Point } from "./functions"

export class Chain {
  circles: Circle[]
  x: number
  y: number
  gap: number
  smallestAngle: number
  frameCount: number

  constructor(
    x: number,
    y: number,
    gap: number,
    angle: number,
    sizes: number[]
  ) {
    this.circles = []
    this.x = x
    this.y = y
    this.gap = gap
    this.smallestAngle = (angle * Math.PI) / 180
    this.frameCount = 0
    sizes.forEach((size) => {
      let newCircle = new Circle(this.x, this.y, size)
      this.circles.push(newCircle)
      this.x += gap
    })
  }

  update(
    ctx: CanvasRenderingContext2D,
    mouseX: number,
    mouseY: number,
    width: number,
    height: number
  ) {
    const acceleration = this.circles[0].followMouse(
      ctx,
      mouseX,
      mouseY,
      width,
      height
    )
    this.frameCount += 15 * Math.log(0.3 * acceleration + 1)

    const oscillateScale = (Math.PI / 4) * Math.log(2 * acceleration + 1)

    for (let i = 1; i < this.circles.length; i++) {
      const oscillateOffset = i * this.circles.length * Math.PI * 1.1368
      const oscillateRadian =
        Math.sin(this.frameCount + oscillateOffset) *
        oscillateScale *
        map(i, 0, this.circles.length, 0.5, 2)

      this.circles[i].followBody(
        ctx,
        this.circles[i - 1],
        // only detect contrain starting from the 3rd circle
        this.circles[i - 2] || undefined,
        this.gap,
        this.smallestAngle,
        oscillateRadian
      )
    }
  }

  drawSkin(ctx: CanvasRenderingContext2D) {
    const points: Point[] = []
    // connect the left side of chain
    for (let i = 0; i < this.circles.length; i++) {
      let radian = 0
      // if not the first or last circle
      if (i != 0 && i != this.circles.length - 1) {
        let radianDelta = findAngleBetween(
          this.circles[i],
          this.circles[i + 1],
          this.circles[i - 1]
        )
        let radianAlpha = findTangent(this.circles[i], this.circles[i - 1])

        if (
          isOnLeft(this.circles[i], this.circles[i + 1], this.circles[i - 1])
        ) {
          radian = radianAlpha - radianDelta / 2
        } else {
          radian = radianAlpha - (2 * Math.PI - radianDelta) / 2
        }
      } else if (i == 0) {
        radian =
          findTangent(this.circles[i], this.circles[i + 1]) + 0.5 * Math.PI
      } else if (i == this.circles.length - 1) {
        radian =
          findTangent(this.circles[i], this.circles[i - 1]) - 0.5 * Math.PI
      }
      const point = calculatePoint(this.circles[i], radian)

      if (i == 0) {
        const headRadian =
          findTangent(this.circles[i], this.circles[i + 1]) - 0.5 * Math.PI
        const headPoint = calculatePoint(this.circles[i], headRadian)
        points.push(headPoint)
      }
      points.push(point)
    }
    // connect the right side of chain
    for (let i = this.circles.length - 1; i >= 0; i--) {
      let radian = 0
      // if not the first or last circle
      if (i != 0 && i != this.circles.length - 1) {
        let radianDelta = findAngleBetween(
          this.circles[i],
          this.circles[i - 1],
          this.circles[i + 1]
        )
        let radianAlpha = findTangent(this.circles[i], this.circles[i + 1])

        if (
          isOnLeft(this.circles[i], this.circles[i - 1], this.circles[i + 1])
        ) {
          radian = radianAlpha - radianDelta / 2
        } else {
          radian = radianAlpha - (2 * Math.PI - radianDelta) / 2
        }

        if (i == 1) {
          const point = calculatePoint(this.circles[i], radian)
          points.unshift(point)
        }
      } else if (i == 0) {
        radian =
          findTangent(this.circles[i], this.circles[i + 1]) - 0.5 * Math.PI
      } else if (i == this.circles.length - 1) {
        radian =
          findTangent(this.circles[i], this.circles[i - 1]) + 0.5 * Math.PI
      }
      const point = calculatePoint(this.circles[i], radian)
      points.push(point)
    }

    const length = points.length
    ctx.beginPath()
    ctx.moveTo(
      (points[0].x + points[length - 1].x) / 2,
      (points[0].y + points[length - 1].y) / 2
    )
    //ctx.moveTo(points[0].x, points[0].y)

    for (let i = 1; i < length - 1; i++) {
      const x2 = (points[i].x + points[i + 1].x) / 2
      const y2 = (points[i].y + points[i + 1].y) / 2
      ctx.quadraticCurveTo(points[i].x, points[i].y, x2, y2)
    }
    ctx.closePath()
    ctx.stroke()
  }
}

const calculatePoint = (circle: Circle, radian: number): Point => {
  const displaceX = (circle.d / 2) * Math.cos(radian)
  const displaceY = (circle.d / 2) * Math.sin(radian)

  const x = circle.x + displaceX
  const y = circle.y + displaceY

  return { x: x, y: y }
}
