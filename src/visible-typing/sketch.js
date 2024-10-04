let keyindex = [
  ["Q", "q", 62.5, 400],
  ["W", "w", 137.5, 400],
  ["E", "e", 212.5, 400],
  ["R", "r", 287.5, 400],
  ["T", "t", 362.5, 400],
  ["Y", "y", 437.5, 400],
  ["U", "u", 512.5, 400],
  ["I", "i", 587.5, 400],
  ["O", "o", 662.5, 400],
  ["P", "p", 737.5, 400],
  ["A", "a", 100, 500],
  ["S", "s", 175, 500],
  ["D", "d", 250, 500],
  ["F", "f", 325, 500],
  ["G", "g", 400, 500],
  ["H", "h", 475, 500],
  ["J", "j", 550, 500],
  ["K", "k", 625, 500],
  ["L", "l", 700, 500],
  ["Z", "z", 137.5, 600],
  ["X", "x", 212.5, 600],
  ["C", "c", 287.5, 600],
  ["V", "v", 362.5, 600],
  ["B", "b", 437.5, 600],
  ["N", "n", 512.5, 600],
  ["M", "m", 587.5, 600],
]

let keylist = []
let traillength = 4
let allhist = []
let raylist = []
let rayspeed = 90
let rayduration = 70
let orange = [255, 153, 51]
let lightblue = [0, 128, 255]
let memoryset = []
let interval = 100 - rayspeed
let timecount = 0
let textlist = ""
let block
let instruction1 = "CLICK HERE"
let instruction2 = "AND START TYPING"

function setup() {
  cnv = createCanvas(800, 800)
  for (const i of keyindex) {
    let newkey = new keys(i[0], i[1], i[2], i[3])
    keylist.push(newkey)
  }

  for (const k of keylist) {
    let newmemory = new memoryray(k)
    memoryset.push(newmemory)
  }

  block = new MoveControl()
}

function draw() {
  background(0)
  timecount += 1

  textAlign(RIGHT)
  textSize(12)
  fill(255)
  strokeWeight(0.1)
  //text("Not Transparent by Zongze Chen", 780, 780);

  textAlign(RIGHT)
  textSize(100)
  fill(255)
  text(textlist, 690, 200)

  noStroke()
  fill(0)
  rect(50, 200, 100, 400)

  block.play()

  textAlign(LEFT)
  textSize(60)
  stroke(255)
  strokeWeight(1)
  noFill()

  for (const m of memoryset) {
    for (let s = 0; s < m.raysets.length; s++) {
      if (timecount > m.timestamp + interval * s) {
        for (const section of m.raysets[s]) {
          for (let i = 0; i < section.length; i++) {
            if (timecount > m.timestamp + interval * i) {
              section[i].drawray()
            }
          }
        }
      }
    }
  }

  for (const r of raylist) {
    r.drawray()
  }

  for (const k of keylist) {
    k.drawkey()
  }

  //newray.drawray();
}

function keyTyped() {
  if (key >= "A" && key <= "z" && key != "Enter" && keyCode != 220) {
    allhist.push(key.toLowerCase())

    let start
    let end
    let thickness
    if (
      allhist.length > 1 &&
      allhist[allhist.length - 1] != allhist[allhist.length - 2]
    ) {
      for (const k of keylist) {
        if (k.letter == allhist[allhist.length - 1]) {
          end = k.coordination
        } else if (k.letter == allhist[allhist.length - 2]) {
          start = k.coordination
          //k.linethick += 1;
          thickness = k.linethick
        }
      }
      let newray = new ray(color(orange), rayspeed, start, end, thickness)
      raylist.push(newray)
    }

    for (const i of keylist) {
      if (i.letter == key.toLowerCase()) {
        i.addshow()
      }
    }

    for (const m of memoryset) {
      if (m.sourceletter == key.toLowerCase()) {
        m.addsection()
      }
    }

    if (allhist.length < traillength) {
      for (const i of keylist) {
        if (allhist.includes(i.letter)) {
          i.addhistory()
        }
      }
    } else {
      for (const i of keylist) {
        if (allhist.slice(-4).includes(i.letter)) {
          i.addhistory()
        }
      }
    }

    for (const m of memoryset) {
      if (m.sourceletter == key.toLowerCase() && m.sourcelist[0].length >= 2) {
        m.addray()
      }
    }

    if (raylist.length > 10) {
      raylist.splice(0, 1)
    }

    block.push()
  }

  if (key != "Enter" && keyCode != 220) {
    textlist = textlist.concat(key)
  }
}

class keys {
  constructor(upperletter, lowerletter, x, y) {
    this.upperletter = upperletter
    this.lowerletter = lowerletter
    this.x = x
    this.y = y
    this.inputhist = []
    this.size = 50
    this.textsize = 30
    this.linethick = 3
  }
  get letter() {
    return this.lowerletter
  }
  get coordination() {
    return [this.x, this.y]
  }
  get fulllist() {
    return this.inputhist
  }

  drawkey() {
    if (this.size > 50) {
      this.size -= 60 / 60
    }
    if (this.textsize > 30) {
      this.textsize -= 60 / 60
    }
    textAlign(CENTER, CENTER)
    rectMode(CENTER)
    stroke(255)
    strokeWeight(1)
    if (keyIsPressed == true) {
      if (key == this.upperletter || key == this.lowerletter) {
        fill(color(255, 153, 51))
      } else {
        noFill()
      }
    } else {
      noFill()
    }
    rect(this.x, this.y, this.size, this.size, this.size / 5)
    if (keyIsPressed == true) {
      if (key == this.upperletter || key == this.lowerletter) {
        fill(255)
      } else {
        noFill()
      }
    }
    stroke(255)
    textSize(this.textsize)
    strokeWeight(1)
    text(this.upperletter, this.x, this.y)
  }

  addshow() {
    this.inputhist.push([])
    this.size += 100
    this.textsize += 100
  }

  addhistory() {
    let keytoadd
    for (const k of keylist) {
      if (key.toLowerCase() == k.letter) {
        keytoadd = k.coordination
      }
    }
    if (this.inputhist.length < traillength) {
      for (const section of this.inputhist) {
        if (section.length < traillength) {
          section.push(keytoadd)
        }
      }
    } else {
      for (const section of this.inputhist.slice(-traillength)) {
        if (section.length < traillength) {
          section.push(keytoadd)
        }
      }
    }
  }
}

class ray {
  constructor(color, reversespeed, start, end, weightofstroke) {
    this.color = color
    this.speed = map(reversespeed, 1, 100, 100, 1)
    this.start = start
    this.end = end
    this.progress = Array.from(start)
    this.closing = Array.from(start)
    this.horizontal = this.end[0] - this.start[0]
    this.vertical = this.end[1] - this.start[1]
    this.count = 0
    this.count2 = 0
    this.time = rayduration
    this.weightofstroke = weightofstroke
  }

  get coordination() {
    return [this.progress.toString(), this.end.toString()]
  }

  drawray() {
    var fade = map(this.time, 0, 100, 0, 255)
    strokeWeight(this.weightofstroke)
    this.color.setAlpha(fade)
    stroke(this.color)
    if (this.progress[0] != this.end[0]) {
      line(this.start[0], this.start[1], this.progress[0], this.progress[1])
      if (this.count < this.speed) {
        this.count += 1
      }
      this.progress[0] =
        this.start[0] + (this.count * this.horizontal) / this.speed
      this.progress[1] =
        this.start[1] + (this.count * this.vertical) / this.speed
    } else if (this.time >= this.speed) {
      line(this.start[0], this.start[1], this.end[0], this.end[1])
      this.time -= 1
    } else if (
      this.progress[0] == this.end[0] &&
      this.closing[0] != this.end[0]
    ) {
      line(this.closing[0], this.closing[1], this.end[0], this.end[1])
      if (this.count2 < this.speed) {
        this.count2 += 1
      }
      this.closing[0] =
        this.start[0] + (this.count2 * this.horizontal) / this.speed
      this.closing[1] =
        this.start[1] + (this.count2 * this.vertical) / this.speed
    }
  }
}

class memoryray {
  constructor(source) {
    this.source = source
    this.rayset = []
    this.megaset = []
    this.interval = 100 - rayspeed
    this.starttime = 0
  }

  get raysets() {
    return this.rayset
  }

  get megasets() {
    return this.megaset
  }
  get sourceletter() {
    return this.source.letter
  }

  get sourcelist() {
    return this.source.fulllist
  }

  addsection() {
    this.rayset.push([])
  }

  get timestamp() {
    return this.starttime
  }

  addray() {
    let raytrack = this.source.fulllist
    let thickness = this.source.linethick - 2

    for (const section of raytrack) {
      if (this.rayset[raytrack.indexOf(section).length >= traillength]) {
        this.rayset[raytrack.indexOf(section)] = []
      }
      if (section.length >= 2) {
        let raytoadd = []
        for (let r = 1; r < section.length; r++) {
          let newray = new ray(
            color(lightblue),
            rayspeed,
            section[r - 1],
            section[r],
            thickness
          )
          raytoadd.push(newray)
        }
        this.rayset[raytrack.indexOf(section)].push(raytoadd)
        this.megaset.push(this.rayset)
      }
    }
    this.starttime = timecount
  }
}

class MoveControl {
  constructor() {
    this.x = 700
    this.change = 10
    this.time = 400
    this.y = 701
  }

  push() {
    this.time = 5000
  }

  play() {
    if (this.time >= 0) {
      if (this.x > 100) {
        this.x -= this.change
        this.y -= this.change / 2
      } else {
        this.x = 100
      }
    } else {
      if (this.x < 700) {
        this.x += this.change
        this.y += this.change / 2
      } else {
        this.x = 700
        textlist = ""
      }
    }
    for (let x = 99; x <= this.y; x++) {
      var fade = map(x, this.x, this.y, 255, 0)
      stroke(0, fade)
      strokeWeight(2)
      line(x, 0, x, 399)
    }
    fill(255)
    this.time -= 50
  }
}

function detectcollide(key1, key2) {
  if (key1.letter == key2.letter) {
    return false
  } else {
    let coord1 = key1.coordination
    let coord2 = key2.coordination

    let size1 = [
      coord1[0] - key1.size / 2,
      coord1[0] + key1.size / 2,
      coord1[1] - key1.size / 2,
      coord1[1] + key1.size / 2,
    ]
    let size2 = [
      coord2[0] - key2.size / 2,
      coord2[0] + key2.size / 2,
      coord2[1] - key2.size / 2,
      coord2[1] + key2.size / 2,
    ]

    if (
      (size1[0] >= size2[0] && size1[0] <= size2[1]) ||
      (size1[1] >= size2[0] && size1[1] <= size2[1])
    ) {
      if (
        (size1[2] >= size2[2] && size1[2] <= size2[3]) ||
        (size1[3] >= size2[2] && size2[3] <= size2[3])
      ) {
        return true
      }
    } else {
      return false
    }
  }
}

function removekey(key1, key2) {
  if (key1.size > key2.size) {
    keylist.splice(keylist.indexOf(key2), 1)
  } else {
    keylist.splice(keylist.indexOf(key1), 1)
  }
}
