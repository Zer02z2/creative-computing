import { drawCirlce } from "../myLibrary"

const canvas = document.getElementById("canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d")

interface ClockHand {
  x: number
  y: number
  innerRadius: number
  outerRadius: number
}

const init = () => {
  if (!ctx) return

  const { width, height } = canvas.getBoundingClientRect()
  canvas.width = width
  canvas.height = height

  console.log(width)

  const dist = 100

  const clockHands = Array.from({ length: 6 }, (anchor: ClockHand, index) => {
    const x = (index - 3 + 0.5) * dist + width / 2
    const y = height / 2
    anchor = { x: x, y: y, innerRadius: 10, outerRadius: dist - 5 }
    return anchor
  })

  const render = () => {
    requestAnimationFrame(() => {
      render()
    })

    ctx.clearRect(0, 0, width, height)

    ctx.lineWidth = 1
    ctx.strokeStyle = "black"
    clockHands.forEach((clockHand) => {
      drawCirlce(ctx, clockHand.x, clockHand.y, clockHand.innerRadius)
      ctx.stroke()
    })
  }
  render()
}

const autoResize = () => {
  let lastTime = Date.now()
  window.addEventListener("resize", () => {
    lastTime = Date.now()
    const interval = 300
    setTimeout(() => {
      const timeNow = Date.now()
      if (timeNow - lastTime > interval) {
        init()
      }
    }, interval + 5)
  })
}

init()
autoResize()
