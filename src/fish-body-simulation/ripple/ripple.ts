import { lerp, map } from "../functions"

interface RippleData {
  initialIntensity: number
  currentIntensity: number // between 0 and 255
  targetRadius: number
  currentRadius: number
  edges: {
    left: number
    right: number
    top: number
    bottom: number
  }
}

export class Ripple {
  maxIntensity: number
  currentIntensity: number
  interval: number
  x: number
  y: number
  speed: number
  startMillis: number
  rippleGroup: RippleData[]
  remainingRipples: number
  constructor(x: number, y: number, intensity: number, radius: number) {
    this.maxIntensity = intensity
    this.currentIntensity = intensity
    this.interval = 150
    this.x = x
    this.y = y
    this.speed = intensity / 100
    this.rippleGroup = [
      {
        initialIntensity: intensity,
        currentIntensity: intensity,
        edges: { left: x, right: x, top: y, bottom: y },
        targetRadius: radius,
        currentRadius: radius,
      },
    ]
    this.startMillis = new Date().getTime()
    this.remainingRipples = Math.floor(map(intensity, 0, 255, 0, 3))
  }

  update() {
    if (
      this.remainingRipples &&
      new Date().getTime() - this.startMillis > this.interval
    ) {
      this.rippleGroup.push({
        initialIntensity: this.currentIntensity,
        currentIntensity: this.currentIntensity,
        currentRadius: 0,
        targetRadius: 0,
        edges: { left: this.x, right: this.x, top: this.y, bottom: this.y },
      })
      this.startMillis = new Date().getTime()
      this.remainingRipples--
    }

    this.currentIntensity -= this.speed

    for (let i = this.rippleGroup.length - 1; i >= 0; i--) {
      const ripple = this.rippleGroup[i]

      ripple.currentIntensity -= this.speed
      ripple.targetRadius += this.speed * 5
      if (ripple.currentIntensity <= 0) this.rippleGroup.splice(i, 1)
    }
  }
  drawRipple(ctx: CanvasRenderingContext2D) {
    this.rippleGroup.forEach((ripple) => {
      const opacity = map(ripple.currentIntensity, 0, 255, 0, 1)
      ripple.currentRadius = lerp(
        ripple.currentRadius,
        ripple.targetRadius,
        0.1
      )
      ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
      ctx.beginPath()
      ctx.arc(this.x, this.y, ripple.currentRadius, 0, 2 * Math.PI)
      ctx.stroke()
    })
  }
  isEmpty() {
    return this.rippleGroup.length <= 0
  }
  detectBouncing(canvas: HTMLCanvasElement) {
    let resultRipples: Ripple[] = []
    this.rippleGroup.forEach((ripple) => {
      const currentLeft = this.x - ripple.currentRadius
      const currentRight = this.x + ripple.currentRadius
      const currentTop = this.y - ripple.currentRadius
      const currentBottom = this.y + ripple.currentRadius
      const { left, right, top, bottom } = ripple.edges

      const reflectIntensity = ripple.currentIntensity * 0.6

      if (left > 0 && currentLeft <= 0) {
        resultRipples.push(
          new Ripple(-this.x, this.y, reflectIntensity, ripple.currentRadius)
        )
      }
      if (right < canvas.width && currentRight >= canvas.width) {
        resultRipples.push(
          new Ripple(
            canvas.width * 2 - this.x,
            this.y,
            reflectIntensity,
            ripple.currentRadius
          )
        )
      }
      if (top > 0 && currentTop <= 0) {
        resultRipples.push(
          new Ripple(this.x, -this.y, reflectIntensity, ripple.currentRadius)
        )
      }
      if (bottom < canvas.height && currentBottom >= canvas.height) {
        resultRipples.push(
          new Ripple(
            this.x,
            canvas.height * 2 - this.y,
            reflectIntensity,
            ripple.currentRadius
          )
        )
      }
      ripple.edges = {
        left: currentLeft,
        right: currentRight,
        top: currentTop,
        bottom: currentBottom,
      }
    })
    if (resultRipples.length > 0) return resultRipples
    else return undefined
  }
}
