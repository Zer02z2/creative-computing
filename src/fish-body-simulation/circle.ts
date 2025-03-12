import {
  dist,
  findAngleBetween,
  findTangent,
  isOnLeft,
  lerp,
  map2,
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

  followMouse(mouseX: number, mouseY: number, width: number, height: number) {
    const x = lerp(this.x, mouseX, 0.1)
    const y = lerp(this.y, mouseY, 0.1)
    const radian =
      findTangent({ x: this.x, y: this.y }, { x: x, y: y }) + 0.5 * Math.PI

    const factor = map2(
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
    return acc
  }

  followBody(
    target: Circle,
    targetOfTarget: Circle | undefined,
    gap: number,
    smallestAngle: number,
    oscillateRadian?: number
  ) {
    this.applyPullingForce(target, gap, oscillateRadian)
    if (targetOfTarget) {
      this.applyAngleConstrain(target, targetOfTarget, gap, smallestAngle)
    }
  }

  teleport(x: number, y: number) {
    this.x = x
    this.y = y
  }

  applyPullingForce(target: Circle, gap: number, oscillateRadian?: number) {
    let radian = findTangent(target, this)
    if (oscillateRadian) radian += oscillateRadian

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
    } // if not straight, try to get straight
    if (radianDelta !== Math.PI) {
      const idealRadian = findTangent(theOtherPoint, center) + Math.PI
      const currentRadian = findTangent(center, this)
      const radianDifference = Math.abs(idealRadian - currentRadian)
      let radian
      if (isOnLeft(center, theOtherPoint, this)) {
        radian = currentRadian + radianDifference * 0.001
      } else {
        radian = currentRadian - radianDifference * 0.001
      }
      this.x = center.x + gap * Math.cos(radian)
      this.y = center.y + gap * Math.sin(radian)
    }
  }

  getPosition() {
    return { x: this.x, y: this.y }
  }
}
