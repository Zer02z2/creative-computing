import { Fish } from "./fish"

const init = () => {
  const canvas = document.getElementById("fish-canvas") as HTMLCanvasElement
  if (!canvas) return
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  const dpr = window.devicePixelRatio || 1
  canvas.width = window.innerWidth * dpr
  canvas.height = window.innerHeight * dpr

  canvas.style.zIndex = "998"
  canvas.style.position = "fixed"
  canvas.style.top = "0px"
  canvas.style.left = "0px"

  const fishSize = canvas.width * 0.015

  const fish = new Fish(100, 100, fishSize * 7, fishSize)
  const mousePosition = { x: 0, y: 0 }

  document.addEventListener("mousemove", (event) => {
    mousePosition.x = event.clientX
    mousePosition.y = event.clientY
  })

  const animate = () => {
    requestAnimationFrame(animate)

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "rgba(0, 0, 0, 0)"
    ctx.strokeStyle = "rgba(0, 0, 0, 1)"

    fish.update(canvas, mousePosition.x, mousePosition.y)
    fish.drawRig(ctx)
  }
  animate()
}

init()
