import { random } from "../functions"
import { Ripple } from "../ripple/ripple"
import {
  colors,
  createDuckWeeds,
  createFishes,
  createLeaves,
  initCanvas,
  setCanvasSize,
} from "./sketchInit"
import {
  dynamicFrameUpdates,
  fixedFrameUpdates,
  renderDuckWeeds,
  renderFish,
  renderLeaves,
  renderRipples,
} from "./sketchUpdate"

export const animateFish = () => {
  const canvasGroup = initCanvas()
  if (!canvasGroup) return
  const { canvasDiv, canvas, ctx, button, span } = canvasGroup

  const frameRate = 60
  let lastFrame = new Date().getTime()
  let showRig = false
  const mousePosition = { x: 0, y: 0 }
  const maxRippleCooldown = 7000
  const minRippleCooldown = 2000
  let rippleCooldown = random(minRippleCooldown, maxRippleCooldown)
  let lastRippleTime = 0
  setCanvasSize(canvas)

  const fishes = createFishes(5, canvasDiv, canvas)
  const ripples: Ripple[] = []
  const leaves = createLeaves(30, canvas)
  const duckWeeds = createDuckWeeds(100, canvas)

  button.addEventListener("mouseup", () => {
    showRig = !showRig
    span.innerHTML = `${showRig ? "hide" : "show"} secret`
    if (showRig) {
      colors.rigColorSets.index++
      if (colors.rigColorSets.index >= colors.rigColorSets.colors.length) {
        colors.rigColorSets.index = 0
      }
    }
  })

  document.addEventListener("mousemove", (event) => {
    mousePosition.x = event.clientX
    mousePosition.y = event.clientY
  })
  const dpr = window.devicePixelRatio || 1
  document.addEventListener("mousedown", (event) => {
    const ripple = new Ripple(event.clientX * dpr, event.clientY * dpr, 100, 0)
    ripples.push(ripple)
  })

  window.addEventListener("resize", () => {
    setCanvasSize(canvas)
  })

  const animate = () => {
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (new Date().getTime() - lastRippleTime >= rippleCooldown) {
      const x = random(0, canvas.width)
      const y = random(0, canvas.height)
      const ripple = new Ripple(x, y, 100, 0)
      ripples.push(ripple)
      rippleCooldown = random(minRippleCooldown, maxRippleCooldown)
      lastRippleTime = new Date().getTime()
    }

    if (new Date().getTime() - lastFrame >= 1000 / frameRate) {
      fixedFrameUpdates(canvas, fishes, leaves, ripples, duckWeeds)
      lastFrame = new Date().getTime()
    }

    dynamicFrameUpdates(canvas, fishes, ripples)

    ctx.fillStyle = colors.backgroundColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    renderFish(ctx, fishes, showRig)
    renderRipples(ctx, ripples)
    renderDuckWeeds(ctx, duckWeeds)
    renderLeaves(ctx, leaves)
  }
  animate()
}
