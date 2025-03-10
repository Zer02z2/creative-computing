import { Fish } from "./fish"
import { random, getRandom, Point } from "./functions"
import { Ripple } from "./ripple"

const init = () => {
  const canvas = document.getElementById("fish-canvas") as HTMLCanvasElement
  if (!canvas) return
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  let showRig = true
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  canvas.style.zIndex = "998"
  canvas.style.position = "fixed"
  canvas.style.top = "0px"
  canvas.style.left = "0px"

  const backgroundColor = "rgb(24, 24, 24)"
  const fishColor = "rgb(180, 180, 180)"
  const fishRigColor = "rgb(0, 102, 255)"
  const boxRigColor = "rgb(80, 255, 118)"

  const fishes = Array.from({ length: 3 }).map(() => {
    const fishSize = canvas.width * 0.015 * random(0.8, 1.2)
    const x = random(0, canvas.width)
    const y = random(0, canvas.height)
    return new Fish(
      getRandom([-1, 1]) * 2 * x * random(0.8, 1.2),
      getRandom([-1, 1]) * 2 * y * random(0.8, 1.2),
      fishSize * 7,
      fishSize
    )
  })

  const ripple = new Ripple(fishColor)
  const mousePosition = { x: 0, y: 0 }

  document.addEventListener("mousemove", (event) => {
    mousePosition.x = event.clientX
    mousePosition.y = event.clientY
  })
  document.addEventListener("mousedown", (event) => {
    const x = Math.floor(event.clientX / ripple.getResolution())
    const y = Math.floor(event.clientY / ripple.getResolution())
    ripple.startRipple(x, y)
  })

  const animate = () => {
    requestAnimationFrame(animate)

    ripple.update()
    ctx.clearRect(0, 0, canvas.width, canvas.height)

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
    })
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // render fish
    fishes.forEach((fish) => {
      ctx.fillStyle = fishColor
      ctx.strokeStyle = backgroundColor
      ctx.lineWidth = 2
      fish.drawBody(ctx)

      ctx.fillStyle = backgroundColor
      ctx.strokeStyle = fishColor
      fish.drawEyes(ctx)
    })

    if (showRig) {
      ctx.fillStyle = fishColor
      ctx.strokeStyle = fishRigColor
      ctx.lineWidth = 1
      fishes.forEach((fish) => {
        fish.drawRig(ctx, boxRigColor)
      })
    }
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

init()
