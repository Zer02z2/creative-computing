export class Ripple {
  canvas: HTMLCanvasElement
  color: string
  current: number[][]
  previous: number[][]
  dampening: number
  cols: number
  rows: number
  resolution: number

  constructor(color: string) {
    this.color = color
    const canvas = document.createElement("canvas")

    canvas.style.zIndex = "1000"
    canvas.style.position = "fixed"
    canvas.style.top = "0px"
    canvas.style.left = "0px"

    const resolution = 4
    this.resolution = resolution
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    canvas.style.height = `${window.innerHeight}px`
    this.cols = Math.floor(canvas.width / resolution)
    this.rows = Math.floor(canvas.height / resolution)

    document.body.appendChild(canvas)
    this.canvas = canvas

    this.current = new Array(this.cols)
      .fill(0)
      .map(() => new Array(this.rows).fill(0))
    this.previous = new Array(this.cols)
      .fill(0)
      .map(() => new Array(this.rows).fill(0))
    this.dampening = 0.7
  }
  startRipple(x: number, y: number) {
    this.previous[x][y] = 2500
  }
  update() {
    const ctx = this.canvas.getContext("2d")
    if (!ctx) return
    const cols = this.cols
    const rows = this.rows
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    for (let i = 1; i < cols - 1; i++) {
      for (let j = 1; j < rows - 1; j++) {
        this.current[i][j] =
          (this.previous[i - 1][j] +
            this.previous[i + 1][j] +
            this.previous[i][j - 1] +
            this.previous[i][j + 1]) /
            2 -
          this.current[i][j]
        this.current[i][j] *= this.dampening
        if (this.current[i][j] === 0) continue
        ctx.fillStyle = `rgba(255, 255, 255, ${this.current[i][j]})`
        ctx.fillRect(
          i * this.resolution,
          j * this.resolution,
          this.resolution,
          this.resolution
        )
      }
    }
    const temp = this.previous
    this.previous = this.current
    this.current = temp
  }
  getResolution() {
    return this.resolution
  }
}
