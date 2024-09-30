export const Random = {
  float: (min: number, max: number): number => {
    const delta = Math.random() * (max - min)
    return min + delta
  },
  integer: (min: number, max: number): number => {
    return Math.floor(Random.float(min, max))
  },
}

export const getElementPosition = (e: HTMLElement | HTMLInputElement) => {
  const box = e.getBoundingClientRect()
  const [x, y] = [box.left, box.top]
  return [x, y]
}

export const drawLine = (
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.closePath()
}

export const drawCirlce = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number
) => {
  ctx.beginPath()
  ctx.arc(x, y, r, 0, 2 * Math.PI)
  ctx.closePath()
}

export const HTMLElement: {
  createText: (tag: string, content?: string, clasName?: string) => HTMLElement
  createImage: (
    src: string,
    alt: string,
    className?: string
  ) => HTMLImageElement
  createDiv: (className?: string) => HTMLElement
} = {
  createText: (tag, content, className) => {
    const element = document.createElement(tag)
    if (content) {
      const textNode = document.createTextNode(content)
      element.appendChild(textNode)
    }
    if (className) {
      element.classList.add(className)
    }
    return element
  },
  createImage: (src, alt, className) => {
    const img = new Image()
    img.src = src
    img.alt = alt
    if (className) img.classList.add(className)
    return img
  },
  createDiv: (className) => {
    const div = document.createElement("div")
    if (className) div.classList.add(className)
    return div
  },
}

export const removeChildren = (e: HTMLElement): void => {
  while (e.lastChild) {
    e.removeChild(e.lastChild)
  }
}
