class Chain {
  constructor(x, y, gap, angle, sizes){
    this.circles = [];
    this.x = x;
    this.y = y;
    this.gap = gap;
    this.smallestAngle = angle * PI / 180;
    sizes.forEach((size) => {
      let newCircle = new Circle(this.x, this.y, size);
      this.circles.push(newCircle);
      this.x += gap;
    });
  }
  
  update() {
    for (let i = 0; i < this.circles.length; i++) {
      if (i == 0) {
        this.circles[i].followMouse();
      }
      // only detect contrain starting from the 3rd circle
      else if (i == 1){
        this.circles[i].followBody(
          this.circles[i-1], undefined, this.gap, this.smallestAngle);
      }
      else {
        this.circles[i].followBody(
          this.circles[i-1], this.circles[i - 2], this.gap, this.smallestAngle);
      }
    }
  }
  
  drawSkin() {
    beginShape();
    // connect the left side of chain
    for (let i = 0; i < this.circles.length; i++) {
      let radian;
      // if not the first or last circle
      if (i != 0 && i != this.circles.length - 1) {
        let radianDelta = findAngleBetween(
          this.circles[i], this.circles[i + 1], this.circles[i - 1]);
        let radianAlpha = findTangent(this.circles[i], this.circles[i - 1]);
        
        if (isOnLeft(this.circles[i], this.circles[i + 1], this.circles[i - 1])) {
          radian = radianAlpha - radianDelta / 2;
        }
        else {
          radian = radianAlpha - (2 * PI - radianDelta) / 2;
        }
      }
      else if (i == 0) {
        radian = findTangent(this.circles[i], this.circles[i + 1]) + 0.5 * PI;
      }
      else if (i == this.circles.length - 1) {
        radian = findTangent(this.circles[i], this.circles[i - 1]) - 0.5 * PI;
      }
      let displaceX = this.circles[i].d / 2 * cos(radian);
      let displaceY = this.circles[i].d / 2 * sin(radian);

      let x = this.circles[i].x + displaceX;
      let y = this.circles[i].y + displaceY;

      if (i == 0) curveVertex(x, y);
      curveVertex(x, y);
    }
    // connect the right side of chain
    for (let i = this.circles.length - 1; i >= 0; i--) {
      let radian;
      // if not the first or last circle
      if (i != 0 && i != this.circles.length - 1) {
        let radianDelta = findAngleBetween(
          this.circles[i], this.circles[i - 1], this.circles[i + 1]);
        let radianAlpha = findTangent(this.circles[i], this.circles[i + 1]);
        
        if (isOnLeft(this.circles[i], this.circles[i - 1], this.circles[i + 1])) {
          radian = radianAlpha - radianDelta / 2;
        }
        else {
          radian = radianAlpha - (2 * PI - radianDelta) / 2;
        }
      }
      else if (i == 0) {
        radian = findTangent(this.circles[i], this.circles[i + 1]) - 0.5 * PI;
      }
      else if (i == this.circles.length - 1) {
        radian = findTangent(this.circles[i], this.circles[i - 1]) + 0.5 * PI;
      }
      let displaceX = this.circles[i].d / 2 * cos(radian);
      let displaceY = this.circles[i].d / 2 * sin(radian);

      let x = this.circles[i].x + displaceX;
      let y = this.circles[i].y + displaceY;
      
      if (i == 0) curveVertex(x, y);
      curveVertex(x, y);
    }   
    endShape();
  }
}