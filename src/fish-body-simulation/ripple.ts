import { map } from "../myLibrary"

interface RippleData {
  initialIntensity: number
  currentIntensity: number
  currentDiameter: number
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
  d: number
  x: number
  y: number
  speed: number
  startMillis: number
  rippleGroup: RippleData[]
  remainingRipples: number
  constructor(x: number, y: number, intensity: number) {
    this.maxIntensity = intensity
    this.currentIntensity = intensity
    this.interval = 150
    this.x = x
    this.y = y
    this.d = map(intensity, 0, 255, 0, window.innerWidth * 0.2)
    this.speed = intensity / 255
    this.rippleGroup = [
      {
        initialIntensity: intensity,
        currentIntensity: intensity,
        edges: { left: x, right: x, top: y, bottom: y },
        currentDiameter: 0,
      },
    ]
    this.startMillis = new Date().getTime()
    this.remainingRipples = 2
  }

  update(ctx: CanvasRenderingContext2D) {
    if (
      this.remainingRipples &&
      new Date().getTime() - this.startMillis > this.interval
    ) {
      this.rippleGroup.push({
        initialIntensity: this.currentIntensity,
        currentIntensity: this.currentIntensity,
        currentDiameter: 0,
        edges: { left: this.x, right: this.x, top: this.y, bottom: this.y },
      })
      this.startMillis = new Date().getTime()
      this.remainingRipples--
    }

    this.currentIntensity -= this.speed

    for (let i = this.rippleGroup.length - 1; i >= 0; i--) {
      const ripple = this.rippleGroup[i]

      ripple.currentIntensity -= this.speed
      ripple.currentDiameter += this.speed * 5

      const opacity = map(ripple.currentIntensity, 0, 255, 0, 1)
      ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
      ctx.beginPath()
      ctx.arc(this.x, this.y, ripple.currentDiameter, 0, 2 * Math.PI)
      ctx.stroke()

      if (ripple.currentIntensity <= 0) this.rippleGroup.splice(i, 1)
    }
  }
  isEmpty() {
    return this.rippleGroup.length <= 0
  }
  detectBouncing() {}
}
