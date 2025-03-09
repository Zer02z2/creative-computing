import { Cube } from "./cube"
import { Fish } from "./fish"

const init = () => {
  const canvas = document.getElementById("fish-canvas") as HTMLCanvasElement
  if (!canvas) return
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  let showRig = false
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  canvas.style.zIndex = "998"
  canvas.style.position = "fixed"
  canvas.style.top = "0px"
  canvas.style.left = "0px"

  const fishSize = canvas.width * 0.015

  const fish = new Fish(100, 100, fishSize * 7, fishSize)
  const mousePosition = { x: 0, y: 0 }

  const cube = new Cube(200, 200, fishSize * 0.2)

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

    cube.update(canvas.width, canvas.height)
    const { x, y } = cube.getPosition()
    fish.move(canvas, x, y)

    if (showRig) {
      fish.drawRig(ctx)
      cube.drawRig(ctx)
    }
  }
  animate()
}

init()
