export const findAngleBetween = (p, pointA, pointB, pointC) => {
  let vector1 = [pointB.x - pointA.x, pointB.y - pointA.y]
  let vector2 = [pointC.x - pointA.x, pointC.y - pointA.y]
  let vectorProduct = vector1[0] * vector2[0] + vector1[1] * vector2[1]
  let vectorLengthProduct =
    Math.sqrt(vector1[0] ** 2 + vector1[1] ** 2) *
    Math.sqrt(vector2[0] ** 2 + vector2[1] ** 2)
  let radianDelta = p.acos(vectorProduct / vectorLengthProduct)
  return radianDelta
}

export const findTangent = (pointA, pointB) => {
  let deltaX = pointB.x - pointA.x
  let deltaY = pointB.y - pointA.y
  let radian = Math.atan2(deltaY, deltaX)
  return radian
}
export const isOnLeft = (pointA, pointB, pointC) => {
  return (
    (pointB.x - pointA.x) * (pointC.y - pointA.y) -
      (pointB.y - pointA.y) * (pointC.x - pointA.x) >
    0
  )
}
