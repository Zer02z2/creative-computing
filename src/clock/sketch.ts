import { map } from "../myLibrary"
import { ClockHand } from "./clock"

const canvas = document.getElementById("canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d")
const slider = document.getElementById("slider") as HTMLInputElement
const info = document.getElementById("info")
const refreshButton = document.getElementById("refresh-button")

const init = () => {
  if (!(ctx && slider && info && refreshButton)) return
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

  const dist = width / 10
  const clockHands = Array.from({ length: 6 }, (anchor: ClockHand, index) => {
    const x = (index - 3 + 0.5) * dist + width / 2
    const y = height / 2 - height * 0.1
    anchor = new ClockHand(x, y, {
      radius: { inner: 5, outer: dist / 2 },
      timeSlot: timeSlots[index],
    })
    return anchor
  })

  const getTime = () => {
    const newTime = new Date()
    const value = Number(slider.value)

    const timeRange = 24 * 60 * 60 * 1000
    const delta = map(value, -100, 100, -timeRange, timeRange)
    newTime.setMilliseconds(newTime.getMilliseconds() + delta)
    const deltaInDays = Math.floor(delta / 1000 / 60 / 60)
    return { time: newTime, timeInfo: deltaInDays }
  }

  slider.addEventListener("input", () => {
    const value = getTime().timeInfo
    info.innerHTML = `${value >= 0 ? "+" : ""}${value} hours`
  })

  refreshButton.addEventListener("click", () => {
    slider.value = "0"
    info.innerHTML = "+0 hours"
  })

  const render = () => {
    requestAnimationFrame(() => {
      render()
    })
    ctx.clearRect(0, 0, width, height)

    const time = getTime().time
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
    })

    ctx.fillStyle = "black"
    ctx.font = `${dist / 7}px Helvetica`
    ctx.fillText("6 am", clockHands[0].x - dist - 10, clockHands[0].y + 8)
    ctx.fillText("6 pm", clockHands[5].x + dist + 10, clockHands[0].y + 8)
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
