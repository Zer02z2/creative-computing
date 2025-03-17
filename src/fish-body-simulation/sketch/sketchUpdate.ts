import { Fish } from "../fish/fish"
import { dist, map, Point } from "../functions"
import { DuckWeed } from "../leaf/duckweek"
import { Leaf } from "../leaf/leaf"
import { Ripple } from "../ripple/ripple"
import { colors } from "./sketchInit"

export const fixedFrameUpdates = (
  canvas: HTMLCanvasElement,
  fishes: Fish[],
  leaves: Leaf[],
  ripples: Ripple[],
  duckWeeds: DuckWeed[]
) => {
  fishes.forEach((fish, index) => {
    fish.update(canvas)
    detectFishLeafCollision(fish, leaves)
    detectFishDuckWeedCollision(fish, duckWeeds)

    const isDashing = fish.getIsDashing()
    if (!isDashing) return
    fishes.forEach((otherFish, otherIndex) => {
      if (index === otherIndex) return
      if (isOverlapping(fish.getBounds(), otherFish.getBounds())) {
        otherFish.triggerDash(
          fish.getBounds().centerPoint.x,
          fish.getBounds().centerPoint.y
        )
      }
    })
    const currentTime = new Date().getTime()
    if (currentTime - fish.lastRippleTime > fish.rippleCooldown) {
      const ripple = fish.createRipple()
      ripples.push(ripple)
      fish.lastRippleTime = currentTime
    }
  })
  ripples.forEach((ripple) => {
    detectRippleLeafCollision(ripple, leaves)
    detectRippleDuckWeedCollision(ripple, duckWeeds)
    const reflectRipples = ripple.detectBouncing(canvas)
    if (!reflectRipples) return
    ripples.push(...reflectRipples)
  })
  leaves.forEach((leaf) => leaf.update())
  duckWeeds.forEach((duckWeed) => duckWeed.update(canvas))

  if (ripples.length > 0) {
    for (let i = ripples.length - 1; i >= 0; i--) {
      const ripple = ripples[i]
      ripple.update()
      if (ripple.isEmpty()) ripples.splice(i, 1)
    }
  }
}

export const dynamicFrameUpdates = (
  canvas: HTMLCanvasElement,
  fishes: Fish[],
  ripples: Ripple[]
) => {
  fishes.forEach((fish) => {
    fish.move(canvas)
  })
}

export const renderFish = (
  ctx: CanvasRenderingContext2D,
  fishes: Fish[],
  showRig: boolean
) => {
  fishes.forEach((fish) => {
    ctx.strokeStyle = colors.fishOutlineColor
    ctx.lineWidth = 2
    ctx.fillStyle = colors.fishFinColor
    fish.drawFins(ctx)
    ctx.fillStyle = colors.fishTailColor
    fish.drawTail(ctx)
    ctx.fillStyle = colors.fishColor
    fish.drawBody(ctx)
    if (showRig) {
      const rigColor = colors.rigColorSets.colors[colors.rigColorSets.index]
      ctx.fillStyle = colors.fishColor
      ctx.strokeStyle = rigColor.fish
      ctx.lineWidth = 1
      fish.drawRig(ctx, rigColor.box)
    }
    ctx.lineWidth = 1
    ctx.fillStyle = colors.fishFinColor
    fish.drawBackFin(ctx)
    ctx.fillStyle = colors.fishOutlineColor
    ctx.strokeStyle = colors.fishColor
    fish.drawEyes(ctx)
  })
}

export const renderLeaves = (ctx: CanvasRenderingContext2D, leaves: Leaf[]) => {
  leaves.forEach((leaf) => {
    ctx.fillStyle = colors.leafColor
    ctx.strokeStyle = colors.backgroundColor
    ctx.lineWidth = 2
    leaf.drawLeaf(ctx)
  })
}

export const renderRipples = (
  ctx: CanvasRenderingContext2D,
  ripples: Ripple[]
) => {
  ripples.forEach((ripple) => ripple.drawRipple(ctx))
}

export const renderDuckWeeds = (
  ctx: CanvasRenderingContext2D,
  duckWeeds: DuckWeed[]
) => {
  duckWeeds.forEach((duckWeed) => {
    ctx.fillStyle = colors.duckWeedColor
    ctx.strokeStyle = colors.backgroundColor
    ctx.lineWidth = 1
    duckWeed.drawWeed(ctx)
  })
}

interface Rect {
  x: number
  y: number
  width: number
  height: number
  centerPoint: Point
}

const isOverlapping = (rect1: Rect, rect2: Rect) => {
  return !(
    (
      rect1.x + rect1.width <= rect2.x || // rect1 is completely left of rect2
      rect2.x + rect2.width <= rect1.x || // rect2 is completely left of rect1
      rect1.y + rect1.height <= rect2.y || // rect1 is completely above rect2
      rect2.y + rect2.height <= rect1.y
    ) // rect2 is completely above rect1
  )
}

const detectFishLeafCollision = (fish: Fish, leaves: Leaf[]) => {
  const { x, y } = fish.getBounds().centerPoint
  leaves.forEach((leaf) => {
    const x1 = leaf.getPosition().x
    const y1 = leaf.getPosition().y
    const distance = dist(x, y, x1, y1)
    if (distance >= fish.getWidth() * 2) return
    const magnitude = fish.getVelocity() / distance
    leaf.applyOscillation(x, y, magnitude)
  })
}

const detectRippleLeafCollision = (ripple: Ripple, leaves: Leaf[]) => {
  const { x, y } = ripple
  leaves.forEach((leaf) => {
    const x1 = leaf.getPosition().x
    const y1 = leaf.getPosition().y
    const distance = dist(x, y, x1, y1)
    for (let i = 0; i < ripple.rippleGroup.length; i++) {
      const rippleRadius = ripple.rippleGroup[i].currentRadius
      if (distance > rippleRadius + leaf.radius) return
      if (distance < rippleRadius - leaf.radius) continue
      const magnitude = map(
        ripple.rippleGroup[i].currentIntensity,
        0,
        255,
        0,
        1
      )
      leaf.applyOscillation(x, y, magnitude)
    }
  })
}

const detectFishDuckWeedCollision = (fish: Fish, duckWeeds: DuckWeed[]) => {
  const { x, y } = fish.getBounds().centerPoint
  duckWeeds.forEach((duckWeed) => {
    const x1 = duckWeed.getPosition().x
    const y1 = duckWeed.getPosition().y
    const distance = dist(x, y, x1, y1)
    if (distance >= fish.getWidth() * 2) return
    const magnitude = (0.2 * fish.getVelocity()) / distance
    duckWeed.applyVector(x, y, magnitude)
  })
}

const detectRippleDuckWeedCollision = (
  ripple: Ripple,
  duckWeeds: DuckWeed[]
) => {
  const { x, y } = ripple
  duckWeeds.forEach((duckWeed) => {
    const x1 = duckWeed.getPosition().x
    const y1 = duckWeed.getPosition().y
    const distance = dist(x, y, x1, y1)
    for (let i = 0; i < ripple.rippleGroup.length; i++) {
      const rippleRadius = ripple.rippleGroup[i].currentRadius
      if (distance > rippleRadius + duckWeed.radius) return
      if (distance < rippleRadius - duckWeed.radius) continue
      const magnitude = map(
        ripple.rippleGroup[i].currentIntensity,
        0,
        255,
        0,
        0.1
      )
      duckWeed.applyVector(x, y, magnitude)
    }
  })
}
