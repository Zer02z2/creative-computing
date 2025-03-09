export interface Point {
  x: number
  y: number
}

export const findAngleBetween = (
  // pointA is center
  pointA: Point,
  pointB: Point,
  pointC: Point
) => {
  let vector1 = [pointB.x - pointA.x, pointB.y - pointA.y]
  let vector2 = [pointC.x - pointA.x, pointC.y - pointA.y]
  let vectorProduct = vector1[0] * vector2[0] + vector1[1] * vector2[1]
  let vectorLengthProduct =
    Math.sqrt(vector1[0] ** 2 + vector1[1] ** 2) *
    Math.sqrt(vector2[0] ** 2 + vector2[1] ** 2)
  let radianDelta = Math.acos(vectorProduct / vectorLengthProduct)
  return radianDelta || 0
}

export const findTangent = (pointA: Point, pointB: Point) => {
  let deltaX = pointB.x - pointA.x
  let deltaY = pointB.y - pointA.y
  let radian = Math.atan2(deltaY, deltaX)
  return radian
}
export const isOnLeft = (pointA: Point, pointB: Point, pointC: Point) => {
  // if C is left of A
  return (
    (pointB.x - pointA.x) * (pointC.y - pointA.y) -
      (pointB.y - pointA.y) * (pointC.x - pointA.x) >
    0
  )
}

export const lerp = (begin: number, target: number, increase: number) => {
  return begin + (target - begin) * increase
}

export const map = (
  value: number,
  min1: number,
  max1: number,
  min2: number,
  max2: number
) => {
  const percentage = (value - min1) / (max1 - min1)
  return (max2 - min2) * percentage
}

export const dist = (x1: number, y1: number, x2: number, y2: number) => {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
}

export const drawCircle = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  d: number
) => {
  ctx.beginPath()
  ctx.arc(x, y, d / 2, 0, 2 * Math.PI)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
}

export const line = (
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
  ctx.stroke()
}

export const rect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) => {
  ctx.rect(x, y, w, h)
  ctx.stroke()
}

export const random = (min: number, max: number) => {
  return min + Math.random() * (max - min)
}
