import { Fish } from "../fish/fish"
import { getRandom, random } from "../functions"
import { DuckWeed } from "../leaf/duckweek"
import { Leaf } from "../leaf/leaf"

export const initCanvas = () => {
  const canvasDiv = document.getElementById("fish-canvas")
  if (!canvasDiv) return
  canvasDiv.style.width = "100vw"
  canvasDiv.style.height = "100vh"
  canvasDiv.style.position = "fixed"
  canvasDiv.style.left = "0px"
  canvasDiv.style.top = "0px"
  const canvas = document.createElement("canvas")
  canvasDiv.appendChild(canvas)
  canvas.style.zIndex = "998"
  canvas.style.position = "fixed"
  canvas.style.top = "0px"
  canvas.style.left = "0px"
  const ctx = canvas.getContext("2d")
  if (!ctx) return
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
  return {
    canvasDiv: canvasDiv,
    canvas: canvas,
    ctx: ctx,
    button: button,
    span: span,
  }
}

export const setCanvasSize = (canvas: HTMLCanvasElement) => {
  const dpr = window.devicePixelRatio || 1
  canvas.width = window.innerWidth * dpr
  canvas.height = window.innerHeight * dpr
  canvas.style.width = `${window.innerWidth}px`
  canvas.style.height = `${window.innerHeight}px`
}

export const createFishes = (
  number: number,
  canvasDiv: HTMLElement,
  canvas: HTMLCanvasElement
) => {
  return Array.from({ length: number }).map(() => {
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
}

export const createLeaves = (number: number, canvas: HTMLCanvasElement) => {
  return Array.from({ length: number }).map(() => {
    const x = random(0, canvas.width)
    const y = random(0, canvas.height)
    const size = Math.sqrt(canvas.width ** 2 + canvas.height ** 2)
    const radius = random(size * 0.02, size * 0.05)
    return new Leaf(x, y, radius, 64)
  })
}
export const createDuckWeeds = (number: number, canvas: HTMLCanvasElement) => {
  return Array.from({ length: number }).map(() => {
    const x = random(0, canvas.width)
    const y = random(0, canvas.height)
    const size = Math.sqrt(canvas.width ** 2 + canvas.height ** 2)
    const radius = random(size * 0.001, size * 0.005)
    return new DuckWeed(x, y, radius, 4)
  })
}
export const colors = {
  rigColorSets: {
    colors: [
      { fish: "rgb(192, 102, 192)", box: "rgb(68, 153, 43)" },
      { fish: "rgb(36, 109, 243)", box: "rgb(59, 192, 42)" },
    ],
    index: 0,
  },
  backgroundColor: "rgb(10, 10, 10)",
  fishColor: "rgb(29, 29, 29)",
  fishFinColor: "rgb(30, 30, 30)",
  fishOutlineColor: "rgb(155, 155, 155)",
  fishTailColor: "rgb(30, 30, 30)",
  leafColor: "rgb(62, 145, 60)",
  duckWeedColor: "rgb(93, 206, 71)",
}
