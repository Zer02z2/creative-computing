import { map } from "../myLibrary"
import {
  circle,
  dist,
  findAngleBetween,
  findTangent,
  isOnLeft,
  lerp,
  line,
  Point,
} from "./functions"

export class Circle {
  x: number
  y: number
  d: number

  constructor(x: number, y: number, d: number) {
    this.x = x
    this.y = y
    this.d = d
  }

  followMouse(
    ctx: CanvasRenderingContext2D,
    mouseX: number,
    mouseY: number,
    width: number,
    height: number
  ) {
    const x = lerp(this.x, mouseX, 0.1)
    const y = lerp(this.y, mouseY, 0.1)
    const radian =
      findTangent({ x: this.x, y: this.y }, { x: x, y: y }) + 0.5 * Math.PI

    const factor = map(
      dist(this.x, this.y, mouseX, mouseY),
      0,
      Math.sqrt(width ** 2 + height ** 2),
      0,
      1
    )
    const displaceX = Math.cos(radian) * factor
    const displaceY = Math.sin(radian) * factor

    this.x = x + displaceX
    this.y = y + displaceY

    const acc = Math.sqrt(displaceX ** 2 + displaceY ** 2)

    circle(ctx, this.x, this.y, this.d)
    return acc
  }

  followBody(
    ctx: CanvasRenderingContext2D,
    target: Circle,
    targetOfTarget: Circle | undefined,
    gap: number,
    smallestAngle: number,
    oscillateRadian: number
  ) {
    this.applyPullingForce(target, gap, oscillateRadian)
    if (targetOfTarget) {
      this.applyAngleConstrain(target, targetOfTarget, gap, smallestAngle)
    }

    circle(ctx, this.x, this.y, this.d)
    line(ctx, this.x, this.y, target.x, target.y)
  }

  applyPullingForce(target: Circle, gap: number, oscillateRadian: number) {
    let radian = findTangent(target, this)
    radian += oscillateRadian

    const displaceX = gap * Math.cos(radian)
    const displaceY = gap * Math.sin(radian)

    this.x = target.x + displaceX
    this.y = target.y + displaceY
  }

  applyAngleConstrain(
    center: Point,
    theOtherPoint: Point,
    gap: number,
    smallestAngle: number
  ) {
    // find the angle between
    const radianDelta = findAngleBetween(center, this, theOtherPoint)

    // if smaller than the constrain
    if (radianDelta < smallestAngle) {
      const theOtherPointRadian = findTangent(center, theOtherPoint)

      let radian
      if (isOnLeft(center, theOtherPoint, this)) {
        radian = theOtherPointRadian + smallestAngle
      } else {
        radian = theOtherPointRadian - smallestAngle
      }
      this.x = center.x + gap * Math.cos(radian)
      this.y = center.y + gap * Math.sin(radian)
    }
  }
}
