import { Chain } from "./chain"
import { Cube } from "./cube"
import { drawCircle, findTangent } from "./functions"

const bodyPoints = [
  0.426, 0.851, 0.957, 1.0, 0.979, 0.957, 0.872, 0.787, 0.702, 0.638, 0.596,
  0.532, 0.426, 0.319,
]
const finPoints = [0.426, 0.517, 0.376, 0.224, 0.115, 0.05]
const tailPoints = [0.326, 0.401, 0.328, 0.341, 0.283, 0.216, 0.155, 0.09]

export class Fish {
  gap: number
  body: Chain
  fins: { fin: Chain; radian: number; position: number }[]
  tails: { tail: Chain; radian: number; position: number }[]
  bounds: { left: number; right: number; top: number; bottom: number }
  clickBox: HTMLAnchorElement
  cube: Cube

  constructor(x: number, y: number, length: number, width: number) {
    this.gap = length / bodyPoints.length
    const smallestAngle = 160
    const sizes = bodyPoints.map((d) => d * width)
    this.body = new Chain(x, y, this.gap, smallestAngle, sizes)

    const finPositions = [3, 3, 8, 8]
    const finRadian = Math.PI / 1.8
    this.fins = finPositions.map((position, index) => {
      const finFactor = bodyPoints[position] * 0.8
      const finSizes = finPoints.map((d) => d * width * finFactor)
      const newFin = new Chain(x, y, this.gap * 0.5, 160, finSizes)
      const radian = finRadian * (index % 2 == 0 ? 1 : -1) * finFactor
      return { fin: newFin, position: position, radian: radian }
    })
    const tailRadian = Math.PI / 5
    const tailPositions = [12, 12]
    this.tails = tailPositions.map((position, index) => {
      const tailSizes = tailPoints.map((d) => width * d)
      const newTail = new Chain(x, y, this.gap * 0.5, 160, tailSizes)
      const radian = tailRadian * (index % 2 == 0 ? 1 : -1)
      return { tail: newTail, radian: radian, position: position }
    })
    ;(this.cube = new Cube(x, y, width * 0.3)),
      (this.bounds = { left: x, right: x, top: y, bottom: y })
    const clickBox = document.createElement("a")
    clickBox.className = "fish-click-box"
    clickBox.style.position = "fixed"
    clickBox.style.zIndex = "900"
    clickBox.style.width = "0px"
    clickBox.style.height = "0px"
    clickBox.style.left = "0px"
    clickBox.style.right = "0px"
    clickBox.style.border = "1px solid red"
    clickBox.style.opacity = "0"
    document.body.appendChild(clickBox)
    this.clickBox = clickBox
  }

  move(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const width = canvas.width
    const height = canvas.height

    this.cube.update(width, height)
    const { x, y } = this.cube.getPosition()

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
      tail.tail.constrainMove(
        tailStartPoint.x,
        tailStartPoint.y,
        tailRadian,
        0.3
      )
      tail.tail.drawOutline(ctx)
    })
    this.body.drawOutline(ctx)
    this.drawEyes(ctx)
    this.updateBounds()
  }

  drawRig(ctx: CanvasRenderingContext2D) {
    this.body.drawRig(ctx)
    this.fins.forEach((fin) => fin.fin.drawRig(ctx))
    this.tails.forEach((tail) => tail.tail.drawRig(ctx))
    this.cube.drawRig(ctx)
    this.clickBox.style.opacity = "1"
  }

  drawEyes(ctx: CanvasRenderingContext2D) {
    const firstPoint = this.body.circles[0].getPostion()
    const secondPoint = this.body.circles[1].getPostion()
    const radian = findTangent(firstPoint, secondPoint)
    const leftRadian = radian + Math.PI / 4
    const rightRadian = radian - Math.PI / 4
    const drawEye = (eyeRadian: number) => {
      const eyeDistance = 1
      const eyeSize = 0.15
      const displaceX = this.gap * eyeDistance * Math.cos(eyeRadian)
      const displaceY = this.gap * eyeDistance * Math.sin(eyeRadian)
      const x = this.body.circles[0].getPostion().x + displaceX
      const y = this.body.circles[0].getPostion().y + displaceY
      drawCircle(ctx, x, y, this.gap * eyeSize)
    }
    ctx.save()
    ctx.fillStyle = "rgba(0, 0, 0, 1)"
    drawEye(leftRadian)
    drawEye(rightRadian)
    ctx.restore()
  }

  updateBounds() {
    this.bounds = {
      left:
        Math.min(...this.body.circles.map((circle) => circle.getPostion().x)) -
        this.gap,
      right:
        Math.max(...this.body.circles.map((circle) => circle.getPostion().x)) +
        this.gap,
      top:
        Math.min(...this.body.circles.map((circle) => circle.getPostion().y)) -
        this.gap,
      bottom:
        Math.max(...this.body.circles.map((circle) => circle.getPostion().y)) +
        this.gap,
    }
    this.clickBox.style.left = `${this.bounds.left}px`
    this.clickBox.style.top = `${this.bounds.top}px`
    this.clickBox.style.width = `${this.bounds.right - this.bounds.left}px`
    this.clickBox.style.height = `${this.bounds.bottom - this.bounds.top}px`
    this.clickBox.style.opacity = "0"
  }
}
