import { animateFish } from "./sketch"

const init = () => {
  const cursorSize = 1.5
  const readMoreSize = 1
  let cursorCurrentSize = cursorSize
  let cursorTargetSize = cursorSize
  let readMoreCurrentSize = 0
  let readMoreTargetSize = 0

  const cursorLocation = {
    x: 0,
    y: 0,
    xTarget: 0,
    yTarget: 0,
  }
  let bouncing = false
  let bounceCurrentSteps = 0

  const zongzeCursor = document.createElement("div")
  const readMore = document.createElement("span")
  zongzeCursor.appendChild(readMore)

  const easeOutQuad = (t: number) => {
    return 1 - Math.pow(1 - t, 3)
  }
  const easeInQuad = (t: number) => {
    return t * (2 - t)
  }
  const generateBounceSteps = (
    peak: number,
    riseSteps: number,
    dipSteps: number
  ) => {
    const arr = []
    for (let i = 0; i < riseSteps; i++) {
      arr.push(1 + (peak - 1) * easeOutQuad(i / riseSteps))
    }
    for (let i = 0; i < dipSteps; i++) {
      arr.push(peak - (peak - 1) * easeInQuad(i / dipSteps))
    }
    return arr
  }

  const smallBounceSteps = generateBounceSteps(1.1, 10, 20)
  const bigBounceSteps = generateBounceSteps(1.5, 10, 20)

  const initCursor = () => {
    zongzeCursor.style.width = `${cursorSize}rem`
    zongzeCursor.style.height = `${cursorSize}rem`
    zongzeCursor.style.borderRadius = "50%"
    zongzeCursor.style.position = "fixed"
    zongzeCursor.style.display = "flex"
    zongzeCursor.style.top = "0px"
    zongzeCursor.style.left = "0px"
    zongzeCursor.style.pointerEvents = "none"
    zongzeCursor.style.zIndex = "999"
    zongzeCursor.style.justifyContent = "center"
    zongzeCursor.style.alignItems = "center"
    zongzeCursor.style.backgroundColor = "white"
    zongzeCursor.style.mixBlendMode = "exclusion"
    zongzeCursor.style.opacity = "0"
    readMore.className = "caption"
    readMore.style.color = "black"
    readMore.style.fontSize = `${readMoreSize}rem`
    readMore.innerText = "external"
  }

  initCursor()

  document.body.appendChild(zongzeCursor)
  document.body.style.cursor = "none"

  const moveCursor = (x: number, y: number) => {
    const cursorBound = zongzeCursor.getBoundingClientRect()
    const { width, height } = cursorBound
    zongzeCursor.style.left = `${x - width / 2}px`
    zongzeCursor.style.top = `${y - height / 2}px`
  }

  const findOverlapLink = (x: number, y: number) => {
    const overlapElements = document.elementsFromPoint(x, y)
    const overlapLink = overlapElements.find(
      (element) => element.tagName === "A"
    )
    return overlapLink
  }

  let lastHoveredLink: Element | undefined = undefined
  let firstEntrance = true

  if (!window.matchMedia("(pointer: coarse)").matches) {
    document.body.addEventListener("mousemove", (event) => {
      if (firstEntrance) {
        zongzeCursor.style.opacity = "1"
        cursorLocation.x = event.clientX
        cursorLocation.y = event.clientY
        cursorLocation.xTarget = event.clientX
        cursorLocation.yTarget = event.clientY
        moveCursor(event.clientX, event.clientY)
        firstEntrance = false
      } else {
        cursorLocation.xTarget = event.clientX
        cursorLocation.yTarget = event.clientY
      }
    })
    document.body.addEventListener("mousedown", () => {
      bouncing = true
      bounceCurrentSteps = 0
    })
  }

  let speed = 0.25

  const animate = () => {
    requestAnimationFrame(animate)
    const { xTarget, yTarget } = cursorLocation
    cursorLocation.x += (xTarget - cursorLocation.x) * 0.4
    cursorLocation.y += (yTarget - cursorLocation.y) * 0.4
    const { x, y } = cursorLocation

    const hoveredLink = findOverlapLink(x, y)
    if (hoveredLink && hoveredLink != lastHoveredLink) {
      if (
        Array.from(hoveredLink.classList).find((name) => name === "external")
      ) {
        readMoreTargetSize = readMoreSize * 1
      } else {
        readMoreTargetSize = 0
      }
      cursorTargetSize = cursorSize * 4.5
      speed = 0.2
    } else if (!hoveredLink && hoveredLink != lastHoveredLink) {
      cursorTargetSize = cursorSize * 0.7
      readMoreTargetSize = 0
      speed = 0.3
    }
    lastHoveredLink = hoveredLink

    if (
      cursorTargetSize - cursorCurrentSize <= cursorTargetSize * 0.05 &&
      cursorTargetSize == cursorSize * 4.5
    ) {
      cursorTargetSize = cursorSize * 4
    }

    if (
      cursorCurrentSize - cursorTargetSize <= cursorTargetSize * 0.05 &&
      cursorTargetSize == cursorSize * 0.7
    ) {
      cursorTargetSize = cursorSize
    }

    let bounceFactor = 1
    if (bouncing) {
      if (cursorTargetSize >= cursorSize * 4) {
        bounceFactor = smallBounceSteps[bounceCurrentSteps]
      } else {
        bounceFactor = bigBounceSteps[bounceCurrentSteps]
      }
      bounceCurrentSteps++
      if (bounceCurrentSteps >= bigBounceSteps.length - 1) {
        bouncing = false
      }
    }

    cursorCurrentSize += (cursorTargetSize - cursorCurrentSize) * speed
    zongzeCursor.style.width = `${cursorCurrentSize * bounceFactor}rem`
    zongzeCursor.style.height = `${cursorCurrentSize * bounceFactor}rem`

    readMoreCurrentSize +=
      (readMoreTargetSize - readMoreCurrentSize) * speed * 2
    readMore.style.fontSize = `${readMoreCurrentSize}rem`

    moveCursor(x, y)
  }

  animate()
  animateFish()
}

document.addEventListener("DOMContentLoaded", init)
