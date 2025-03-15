import { Chain } from "./chain"
import { Cube } from "./cube"
import { drawCircle, findTangent, map2, random } from "../functions"
import { Ripple } from "../ripple/ripple"

const bodyPoints = [
  0.326, 0.641, 0.817, 0.9, 0.97, 0.957, 0.872, 0.787, 0.702, 0.618, 0.516,
  0.414, 0.316, 0.219,
]
const finPoints = [0.226, 0.217, 0.334, 0.476, 0.424, 0.355, 0.11]
//const finPoints = [0.526, 0.517, 0.434, 0.576, 0.624, 0.665]
const tailPoints = [0.326, 0.321, 0.32, 0.294, 0.283, 0.216, 0.155, 0.09]
const backFinPoints = [0.5, 0.5, 0.5]

export class Fish {
  gap: number
  body: Chain
  fins: { fin: Chain; radian: number; position: number }[]
  tails: { tail: Chain; radian: number; position: number }[]
  backFins: { backFin: Chain; radian: number; position: number }[]
  // backFin:
  bounds: { left: number; right: number; top: number; bottom: number }
  clickBox: HTMLAnchorElement
  cube: Cube
  rippleCooldown: number
  lastRippleTime: number

  constructor(
    x: number,
    y: number,
    length: number,
    width: number,
    canvasDiv: HTMLElement
  ) {
    this.gap = length / bodyPoints.length
    const smallestAngle = 165
    const sizes = bodyPoints.map((d) => d * width)
    this.body = new Chain(x, y, this.gap, smallestAngle, sizes)
    this.cube = new Cube(x, y, width * 0.3)
    this.bounds = { left: x, right: x, top: y, bottom: y }

    const finPositions = [2, 2, 6, 6]
    const finRadian = Math.PI / 1.8
    this.fins = finPositions.map((position, index) => {
      const finFactor = bodyPoints[position] * 0.8
      const finSizes = finPoints.map(
        (d) => d * width * (index <= 1 ? 1.5 : 1) * finFactor
      )
      const newFin = new Chain(
        x,
        y,
        this.gap * 2.5 * (width / length),
        (index <= 1 ? 175 : 155) + 20 * (width / length),
        finSizes
      )
      const radian = finRadian * (index % 2 == 0 ? 1 : -1) * finFactor
      return { fin: newFin, position: position, radian: radian }
    })
    const tailRadian = Math.PI / 5
    const tailPositions = [12, 12]
    this.tails = tailPositions.map((position, index) => {
      const tailSizes = tailPoints.map((d) => width * d)
      const newTail = new Chain(
        x,
        y,
        this.gap * 0.5 * random(0.7, 0.9),
        120,
        tailSizes
      )
      const radian = random(0, tailRadian) * (index % 2 == 0 ? 1 : -1)
      return { tail: newTail, radian: radian, position: position }
    })
    const backFinPositions = [3]
    this.backFins = backFinPositions.map((position) => {
      const backFinSizes = backFinPoints.map((d) => 0 * d)
      const newBackFin = new Chain(x, y, this.gap * 1.5, 120, backFinSizes)
      return { backFin: newBackFin, radian: 0, position: position }
    })

    const clickBox = document.createElement("a")
    clickBox.className = "fish-click-box"
    clickBox.style.position = "fixed"
    clickBox.style.zIndex = "2000"
    clickBox.style.width = "0px"
    clickBox.style.height = "0px"
    clickBox.style.left = "0px"
    clickBox.style.right = "0px"
    clickBox.style.border = "1px solid red"
    clickBox.style.opacity = "0"
    clickBox.addEventListener("mouseover", (event) => {
      this.triggerDash(event.clientX, event.clientY)
    })
    clickBox.addEventListener("mousedown", (event) => {
      this.triggerDash(event.clientX, event.clientY)
    })
    canvasDiv.appendChild(clickBox)
    this.clickBox = clickBox
    this.rippleCooldown = generateRandomCooldown()
    this.lastRippleTime = new Date().getTime()
  }
  update(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const width = canvas.width
    const height = canvas.height
    this.cube.update(width, height)
  }

  move(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const width = canvas.width
    const height = canvas.height
    const { x, y } = this.cube.getPosition()

    this.body.freeMove(x, y, width, height)

    this.backFins.forEach((backFin) => {
      const startPoint = this.body.circles[backFin.position].getPosition()
      const nextPoint = this.body.circles[backFin.position + 1].getPosition()
      const radian = findTangent(startPoint, nextPoint) + backFin.radian
      backFin.backFin.constrainMove(startPoint.x, startPoint.y, radian, 1)
    })
    this.fins.forEach((fin, index) => {
      const finStartPoint = this.body.circles[fin.position].getPosition()
      const nextBodyPoint = this.body.circles[fin.position + 1].getPosition()
      const finRadian = findTangent(finStartPoint, nextBodyPoint) + fin.radian
      fin.fin.constrainMove(
        finStartPoint.x,
        finStartPoint.y,
        finRadian,
        index <= 1 ? 0.3 : 0.8
      )
    })
    this.tails.forEach((tail) => {
      const tailStartPoint = this.body.circles[tail.position].getPosition()
      const nextTailPoint = this.body.circles[tail.position + 1].getPosition()
      const tailRadian =
        findTangent(tailStartPoint, nextTailPoint) + tail.radian
      tail.tail.constrainMove(
        tailStartPoint.x,
        tailStartPoint.y,
        tailRadian,
        0.3
      )
    })
    this.updateBounds()
  }

  drawBody(ctx: CanvasRenderingContext2D) {
    this.body.drawOutline(ctx)
  }
  drawFins(ctx: CanvasRenderingContext2D) {
    this.fins.forEach((fin) => fin.fin.drawOutline(ctx))
  }
  drawTail(ctx: CanvasRenderingContext2D) {
    this.tails.forEach((tail) => tail.tail.drawOutline(ctx))
  }

  drawBackFin(ctx: CanvasRenderingContext2D) {
    this.backFins.forEach((backFin) => {
      const endPosition = backFin.position + backFinPoints.length + 1
      const finPoint = backFin.backFin.circles[backFinPoints.length - 1]
      const startPoint = this.body.circles[backFin.position + 1]
      const endPoint = this.body.circles[endPosition]
      ctx.beginPath()
      ctx.moveTo(startPoint.x, startPoint.y)
      ctx.quadraticCurveTo(finPoint.x, finPoint.y, endPoint.x, endPoint.y)
      const points = this.body.circles
      for (let i = endPosition; i >= backFin.position + 2; i--) {
        const x2 = (points[i].x + points[i - 1].x) / 2
        const y2 = (points[i].y + points[i - 1].y) / 2
        ctx.quadraticCurveTo(points[i].x, points[i].y, x2, y2)
      }
      ctx.quadraticCurveTo(
        points[backFin.position + 2].x,
        points[backFin.position + 2].y,
        startPoint.x,
        startPoint.y
      )

      ctx.fill()
      ctx.stroke()
    })
  }

  drawRig(ctx: CanvasRenderingContext2D, color: string) {
    this.body.drawRig(ctx)
    color
    this.fins.forEach((fin) => fin.fin.drawRig(ctx))
    this.tails.forEach((tail) => tail.tail.drawRig(ctx))
    this.cube.drawRig(ctx)
    this.clickBox.style.borderColor = color
    this.clickBox.style.opacity = "1"
  }

  drawEyes(ctx: CanvasRenderingContext2D) {
    const firstPoint = this.body.circles[0].getPosition()
    const secondPoint = this.body.circles[1].getPosition()
    const radian = findTangent(firstPoint, secondPoint)
    const leftRadian = radian + Math.PI / 4
    const rightRadian = radian - Math.PI / 4
    const drawEye = (eyeRadian: number) => {
      const eyeDistance = this.body.circles[2].d * 0.5
      const eyeSize = 0.4
      const displaceX = eyeDistance * Math.cos(eyeRadian)
      const displaceY = eyeDistance * Math.sin(eyeRadian)
      const x = this.body.circles[0].getPosition().x + displaceX
      const y = this.body.circles[0].getPosition().y + displaceY
      drawCircle(ctx, x, y, this.gap * eyeSize)
    }
    drawEye(leftRadian)
    drawEye(rightRadian)
  }

  updateBounds() {
    this.bounds = {
      left:
        Math.min(...this.body.circles.map((circle) => circle.getPosition().x)) -
        this.gap,
      right:
        Math.max(...this.body.circles.map((circle) => circle.getPosition().x)) +
        this.gap,
      top:
        Math.min(...this.body.circles.map((circle) => circle.getPosition().y)) -
        this.gap,
      bottom:
        Math.max(...this.body.circles.map((circle) => circle.getPosition().y)) +
        this.gap,
    }
    this.clickBox.style.left = `${this.bounds.left}px`
    this.clickBox.style.top = `${this.bounds.top}px`
    this.clickBox.style.width = `${this.bounds.right - this.bounds.left}px`
    this.clickBox.style.height = `${this.bounds.bottom - this.bounds.top}px`
    this.clickBox.style.opacity = "0"
  }

  triggerDash(x: number, y: number) {
    const centerPoint = {
      x: (this.bounds.right + this.bounds.left) / 2,
      y: (this.bounds.bottom + this.bounds.top) / 2,
    }
    const radian = findTangent(centerPoint, { x: x, y: y })
    this.cube.dash(radian + Math.PI)
  }
  getIsDashing() {
    const velocity = Math.sqrt(this.cube.vX ** 2 + this.cube.vY ** 2)
    return velocity > this.cube.vMax
  }
  createRipple() {
    const centerCircle =
      this.body.circles[Math.floor(this.body.circles.length / 2)]
    const x = centerCircle.x
    const y = centerCircle.y
    const velocity = Math.sqrt(this.cube.vX ** 2 + this.cube.vY ** 2)
    const intensity = map2(velocity, this.cube.vMax, this.cube.vDash, 0, 100)
    const ripple = new Ripple(x, y, intensity, 0)
    this.rippleCooldown = generateRandomCooldown()
    return ripple
  }
  getBounds() {
    const x = this.bounds.left
    const y = this.bounds.top
    const width = this.bounds.right - this.bounds.left
    const height = this.bounds.bottom - this.bounds.top
    const centerX = x + width / 2
    const centerY = y + height / 2
    return {
      x: x,
      y: y,
      width: width,
      height: height,
      centerPoint: { x: centerX, y: centerY },
    }
  }
  unmount() {
    this.clickBox.parentElement?.removeChild(this.clickBox)
  }
}

const generateRandomCooldown = () => {
  return random(200, 600)
}
