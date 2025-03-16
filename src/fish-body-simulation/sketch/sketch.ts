import { Ripple } from "../ripple/ripple"
import {
  colors,
  createFishes,
  createLeaves,
  initCanvas,
  setCanvasSize,
} from "./sketchInit"
import {
  dynamicFrameUpdates,
  fixedFrameUpdates,
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
  setCanvasSize(canvas)

  const fishes = createFishes(3, canvasDiv, canvas)
  const ripples: Ripple[] = []

  const leaves = createLeaves(10, canvas)
  const mousePosition = { x: 0, y: 0 }

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
  document.addEventListener("mousedown", (event) => {
    const ripple = new Ripple(event.clientX, event.clientY, 100, 0)
    ripples.push(ripple)
  })

  window.addEventListener("resize", () => {
    setCanvasSize(canvas)
  })

  const animate = () => {
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (new Date().getTime() - lastFrame >= 1000 / frameRate) {
      fixedFrameUpdates(canvas, fishes, leaves, ripples)
      lastFrame = new Date().getTime()
    }

    dynamicFrameUpdates(canvas, fishes, ripples)

    ctx.fillStyle = colors.backgroundColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    renderFish(ctx, fishes, showRig)
    renderRipples(ctx, ripples)
    renderLeaves(ctx, leaves)
  }
  animate()
}
