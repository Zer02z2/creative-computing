import { Cube } from "./cube"
import { Fish } from "./fish"
import { random, getRandom } from "./functions"

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

  const fishes = Array.from({ length: 3 }).map(() => {
    const fishSize = canvas.width * 0.015
    const x = random(0, canvas.width)
    const y = random(0, canvas.height)
    return new Fish(
      getRandom([-1, 1]) * 2 * x,
      getRandom([-1, 1]) * 2 * y,
      fishSize * 7,
      fishSize
    )
  })
  const mousePosition = { x: 0, y: 0 }

  document.addEventListener("mousemove", (event) => {
    mousePosition.x = event.clientX
    mousePosition.y = event.clientY
  })

  const animate = () => {
    requestAnimationFrame(animate)

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = `rgba(255, 255, 255, ${showRig ? 0 : 1})`
    ctx.strokeStyle = "rgba(0, 0, 0, 1)"
    ctx.lineWidth = 1

    fishes.forEach((fish) => {
      fish.move(canvas)
    })

    if (showRig) {
      fishes.forEach((fish) => {
        fish.drawRig(ctx)
      })
    }
  }
  animate()
}

init()
