import { ClockHand } from "./clock"

const canvas = document.getElementById("canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d")

const init = () => {
  if (!ctx) return

  const time = new Date()

  const { width, height } = canvas.getBoundingClientRect()
  canvas.width = width
  canvas.height = height

  const timeSlots: ClockHand["timeSlot"][] = [
    { top: [6, 8], bottom: [4, 6] },
    { top: [8, 10], bottom: [2, 4] },
    { top: [10, 12], bottom: [0, 2] },
    { top: [12, 14], bottom: [22, 24] },
    { top: [14, 16], bottom: [20, 22] },
    { top: [16, 18], bottom: [18, 20] },
  ]
  const dist = 200

  const clockHands = Array.from({ length: 6 }, (anchor: ClockHand, index) => {
    const x = (index - 3 + 0.5) * dist + width / 2
    const y = height / 2 - height * 0.1
    anchor = new ClockHand(x, y, {
      radius: { inner: 5, outer: dist / 2 },
      timeSlot: timeSlots[index],
    })
    return anchor
  })

  const render = () => {
    requestAnimationFrame(() => {
      render()
    })

    ctx.clearRect(0, 0, width, height)

    const activeClock = timeSlots.findIndex((slot) => {
      const hour = time.getHours()
      const conditionA = hour >= slot.top[0] && hour < slot.top[1]
      const conditionB = hour >= slot.bottom[0] && hour < slot.bottom[1]
      return conditionA || conditionB
    })

    ctx.lineWidth = 1
    ctx.strokeStyle = "black"
    clockHands.forEach((clockHand, index) => {
      clockHand.drawBody(ctx)
      ctx.stroke()
      if (activeClock === index) {
        clockHand.drawAngle(ctx, {
          hour: time.getHours(),
          minute: time.getMinutes(),
        })
      } else if (index < activeClock) {
        clockHand.drawRight(ctx)
      } else if (index > activeClock) {
        clockHand.drawLeft(ctx)
      }
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
