const canvas = document.getElementById("canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d")

const init = () => {
  if (!ctx) return

  console.log("success")
}

init()
