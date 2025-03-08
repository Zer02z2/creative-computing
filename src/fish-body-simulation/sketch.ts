import { Chain } from "./chain"

const init = () => {
  const canvas = document.getElementById("fish-canvas") as HTMLCanvasElement
  if (!canvas) return

  canvas.style.zIndex = "998"
  canvas.style.position = "fixed"
  canvas.style.top = "0px"
  canvas.style.left = "0px"

  const chain = new Chain(
    200,
    200,
    20,
    160,
    [20, 40, 45, 47, 46, 45, 41, 37, 33, 30, 28, 25, 20, 15]
  )
  let frameCount = 0
  const mousePosition = { x: 0, y: 0 }

  document.addEventListener("mousemove", (event) => {
    mousePosition.x = event.clientX
    mousePosition.y = event.clientY
  })

  const animate = () => {
    requestAnimationFrame(animate)
    const dpr = window.devicePixelRatio || 1
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr

    const ctx = canvas.getContext("2d")
    if (!ctx) return
    frameCount++
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "rgba(0, 0, 0, 0)"
    ctx.strokeStyle = "rgba(0, 0, 0, 1)"

    chain.update(
      ctx,
      mousePosition.x,
      mousePosition.y,
      canvas.width,
      canvas.height,
      frameCount
    )
    chain.drawSkin(ctx)
  }
  animate()
}

init()
