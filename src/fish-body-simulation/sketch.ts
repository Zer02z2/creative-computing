import { Fish } from "./fish/fish"
import { random, getRandom, Point } from "./functions"
import { Leaf } from "./leaf/leaf"
import { Ripple } from "./ripple/ripple"

export const animateFish = () => {
  const canvasDiv = document.getElementById("fish-canvas")
  if (!canvasDiv) return
  canvasDiv.style.width = "100vw"
  canvasDiv.style.height = "100vh"
  canvasDiv.style.position = "fixed"
  canvasDiv.style.left = "0px"
  canvasDiv.style.top = "0px"
  const canvas = document.createElement("canvas")
  canvasDiv.appendChild(canvas)
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  const frameRate = 60
  let lastFrame = new Date().getTime()
  let showRig = false
  const dpr = window.devicePixelRatio || 1
  const width = window.innerWidth * dpr
  const height = window.innerHeight * dpr
  canvas.width = width
  canvas.height = height
  ctx.scale(dpr, dpr)

  canvas.style.zIndex = "998"
  canvas.style.position = "fixed"
  canvas.style.top = "0px"
  canvas.style.left = "0px"

  const rigColorSets = [
    { fish: "rgb(192, 102, 192)", box: "rgb(68, 153, 43)" },
    { fish: "rgb(36, 109, 243)", box: "rgb(59, 192, 42)" },
  ]
  let currentRigColorIndex = 0

  const backgroundColor = "rgb(10, 10, 10)"
  const fishColor = "rgb(20, 20, 20)"
  const fishFinColor = "rgb(30, 30, 30)"
  const fishOutlineColor = "rgb(155, 155, 155)"
  const fishTailColor = "rgb(30, 30, 30)"
  const leafColor = "rgb(68, 173, 54)"

  const button = document.createElement("a")
  button.style.position = "absolute"
  button.style.right = "3rem"
  button.style.bottom = "2rem"
  button.style.zIndex = "1000"
  button.style.mixBlendMode = "exclusion"
  const span = document.createElement("span")
  span.className = "body-text-heavy"
  span.style.color = "white"
  span.innerHTML = "show secret"
  button.appendChild(span)
  canvasDiv.appendChild(button)

  const fishes = Array.from({ length: 3 }).map(() => {
    const fishSize =
      Math.sqrt(canvas.width ** 2 + canvas.height ** 2) *
      0.015 *
      random(0.8, 1.2)
    const x = random(0, canvas.width)
    const y = random(0, canvas.height)
    const length = fishSize * random(6, 8.5)
    return new Fish(
      getRandom([-1, 1]) * 2 * x * random(0.8, 1.2),
      getRandom([-1, 1]) * 2 * y * random(0.8, 1.2),
      fishSize * random(6, 8.5),
      length * random(0.2, 0.24),
      canvasDiv
    )
  })
  const ripples: Ripple[] = []

  const leaves = Array.from({ length: 10 }).map(() => {
    const x = random(0, canvas.width)
    const y = random(0, canvas.height)
    const size = Math.sqrt(canvas.width ** 2 + canvas.height ** 2)
    const radius = random(size * 0.02, size * 0.05)
    return new Leaf(x, y, radius, 32)
  })

  const mousePosition = { x: 0, y: 0 }

  button.addEventListener("mouseup", () => {
    showRig = !showRig
    span.innerHTML = `${showRig ? "hide" : "show"} secret`
    if (showRig) {
      currentRigColorIndex = Math.floor(random(0, rigColorSets.length))
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
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr
  })

  const animate = () => {
    requestAnimationFrame(animate)

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // update fish target position at max frame rate
    if (new Date().getTime() - lastFrame >= 1000 / frameRate) {
      fishes.forEach((fish) => {
        fish.update(canvas)
      })
      lastFrame = new Date().getTime()
    }

    // animate fish
    fishes.forEach((fish) => {
      fish.move(canvas)
    })
    // detect if any fish dash into each other
    fishes.forEach((fish, index) => {
      const isDashing = fish.getIsDashing()
      if (!isDashing) return
      fishes.forEach((otherFish, otherIndex) => {
        if (index === otherIndex) return
        if (isOverlapping(fish.getBounds(), otherFish.getBounds())) {
          otherFish.triggerDash(
            fish.getBounds().centerPoint.x,
            fish.getBounds().centerPoint.y
          )
        }
      })
      const currentTime = new Date().getTime()
      if (currentTime - fish.lastRippleTime > fish.rippleCooldown) {
        const ripple = fish.createRipple()
        ripples.push(ripple)
        fish.lastRippleTime = currentTime
      }
    })
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // render fish
    fishes.forEach((fish) => {
      ctx.strokeStyle = fishOutlineColor
      ctx.lineWidth = 2
      ctx.fillStyle = fishFinColor
      fish.drawFins(ctx)
      ctx.fillStyle = fishTailColor
      fish.drawTail(ctx)
      ctx.fillStyle = fishColor
      fish.drawBody(ctx)

      if (showRig) {
        const rigColor = rigColorSets[currentRigColorIndex]
        ctx.fillStyle = fishColor
        ctx.strokeStyle = rigColor.fish
        ctx.lineWidth = 1
        fish.drawRig(ctx, rigColor.box)
      }

      ctx.lineWidth = 1
      ctx.fillStyle = fishFinColor
      fish.drawBackFin(ctx)

      ctx.fillStyle = fishOutlineColor
      ctx.strokeStyle = fishColor
      fish.drawEyes(ctx)
    })

    if (ripples.length > 0) {
      for (let i = ripples.length - 1; i >= 0; i--) {
        const ripple = ripples[i]
        ripple.update(ctx)
        if (ripple.isEmpty()) ripples.splice(i, 1)
      }
    }
    ripples.forEach((ripple) => {
      const reflectRipples = ripple.detectBouncing(canvas)
      if (!reflectRipples) return
      ripples.push(...reflectRipples)
    })
    leaves.forEach((leaf) => {
      ctx.fillStyle = leafColor
      ctx.strokeStyle = backgroundColor
      ctx.lineWidth = 2
      leaf.drawLeaf(ctx)
    })
  }
  animate()
}

interface Rect {
  x: number
  y: number
  width: number
  height: number
  centerPoint: Point
}

const isOverlapping = (rect1: Rect, rect2: Rect) => {
  return !(
    (
      rect1.x + rect1.width <= rect2.x || // rect1 is completely left of rect2
      rect2.x + rect2.width <= rect1.x || // rect2 is completely left of rect1
      rect1.y + rect1.height <= rect2.y || // rect1 is completely above rect2
      rect2.y + rect2.height <= rect1.y
    ) // rect2 is completely above rect1
  )
}
