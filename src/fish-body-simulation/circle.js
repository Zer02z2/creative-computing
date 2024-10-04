import { findAngleBetween, findTangent, isOnLeft } from "./functions"

export class Circle {
  constructor(x, y, d) {
    this.x = x
    this.y = y
    this.d = d
  }

  followMouse(p) {
    let x = p.lerp(this.x, p.mouseX, 0.1)
    let y = p.lerp(this.y, p.mouseY, 0.1)
    let radian =
      findTangent({ x: this.x, y: this.y }, { x: x, y: y }) + 0.5 * p.PI

    let factor = p.map(
      p.dist(this.x, this.y, p.mouseX, p.mouseY),
      0,
      Math.sqrt(p.width ** 2 + p.height ** 2),
      0,
      1
    )

    let displaceX = p.sin(p.frameCount * 0.2) * 30 * p.cos(radian) * factor
    let displaceY = p.sin(p.frameCount * 0.2) * 30 * p.sin(radian) * factor

    this.x = x + displaceX
    this.y = y + displaceY

    p.circle(this.x, this.y, this.d)
  }

  followBody(p, target, targetOfTarget, gap, smallestAngle) {
    this.applyPullingForce(p, target, gap)
    if (targetOfTarget) {
      this.applyAngleConstrain(p, target, targetOfTarget, gap, smallestAngle)
    }
    p.circle(this.x, this.y, this.d)
    p.line(this.x, this.y, target.x, target.y)
  }

  applyPullingForce(p, target, gap) {
    let radian = findTangent(target, this)

    let displaceX = gap * p.cos(radian)
    let displaceY = gap * p.sin(radian)

    this.x = target.x + displaceX
    this.y = target.y + displaceY
  }

  applyAngleConstrain(p, center, theOtherPoint, gap, smallestAngle) {
    // find the angle between
    let radianDelta = findAngleBetween(p, center, this, theOtherPoint)

    // if smaller than the constrain
    if (radianDelta < smallestAngle) {
      let theOtherPointRadian = findTangent(center, theOtherPoint)

      let radian
      if (isOnLeft(center, theOtherPoint, this)) {
        radian = theOtherPointRadian + smallestAngle
      } else {
        radian = theOtherPointRadian - smallestAngle
      }
      this.x = center.x + gap * p.cos(radian)
      this.y = center.y + gap * p.sin(radian)
    }
  }
}
