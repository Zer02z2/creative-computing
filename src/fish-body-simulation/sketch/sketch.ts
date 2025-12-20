import { random, randomPointOutsideRect } from "../functions"
import { Ripple } from "../ripple/ripple"
import {
  canvasExist,
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
  ChaseState,
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
  const chaseState: ChaseState = { steate: false, direction: undefined }
  setCanvasSize(canvas)

  const fishes = createFishes(5, canvasDiv, canvas)
  const ripples: Ripple[] = []
  const leaves = createLeaves(30, canvas)
  const duckWeeds = createDuckWeeds(100, canvas)

  let chosenFishIndex = -1

  const updateShowRigState = (state: boolean) => {
    showRig = state
    fishes.forEach((fish) => (fish.showRig = showRig))
    span.innerHTML = `${showRig ? "hide" : "show"} computation`
    if (showRig) {
      colors.rigColorSets.index++
      if (colors.rigColorSets.index >= colors.rigColorSets.colors.length) {
        colors.rigColorSets.index = 0
      }
    }
  }

  button.addEventListener("mouseup", () => {
    updateShowRigState(!showRig)
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

  document.addEventListener("keydown", (event) => {
    if (event.key === "c") {
      updateShowRigState(false)
      chosenFishIndex = Math.floor(random(0, fishes.length))
      fishes.forEach((fish, index) => {
        fish.showRig = index === chosenFishIndex ? true : false
      })
    } else if (event.key === "v") {
      if (chosenFishIndex === -1) return
      if (fishes.length < 1) return
      fishes[chosenFishIndex].leaveTarget = randomPointOutsideRect(
        canvas.width,
        canvas.height
      )
      fishes[chosenFishIndex].onLeave = true
      console.log(fishes[chosenFishIndex].leaveTarget)
    } else if (event.key === "a") {
      chaseState.steate = true
      chaseState.direction = "bottomLeft"
    } else if (event.key === "d") {
      chaseState.steate = true
      chaseState.direction = "bottomRight"
    } else if (event.key === "w") {
      chaseState.steate = true
      chaseState.direction = "topCenter"
    }
  })

  document.addEventListener("keyup", (event) => {
    if (event.key === "a" || event.key === "d" || event.key === "w") {
      chaseState.steate = false
      chaseState.direction = undefined
    }
  })

  window.addEventListener("resize", () => {
    setCanvasSize(canvas)
  })

  const animate = () => {
    if (!canvasExist()) return
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
      fixedFrameUpdates(canvas, fishes, leaves, ripples, duckWeeds, chaseState)
      lastFrame = new Date().getTime()
    }

    dynamicFrameUpdates(canvas, fishes)

    ctx.fillStyle = colors.backgroundColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    renderFish(ctx, fishes)
    renderRipples(ctx, ripples)
    renderDuckWeeds(ctx, duckWeeds)
    renderLeaves(ctx, leaves)
  }
  animate()
}
