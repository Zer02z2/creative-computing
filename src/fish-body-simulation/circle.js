class Circle {
  constructor(x, y, d){
    this.x = x;
    this.y = y;
    this.d = d;
  }
  
  followMouse() {
    let x = lerp(this.x, mouseX, 0.1);
    let y = lerp(this.y, mouseY, 0.1);
    let radian = findTangent({x: this.x, y: this.y}, {x: x, y: y}) + 0.5 * PI;
    
    let factor = map(dist(this.x, this.y, mouseX, mouseY), 0, Math.sqrt(width ** 2 + height ** 2), 0, 1);
    
    let displaceX = sin(frameCount * 0.2) * 30 * cos(radian) * factor;
    let displaceY = sin(frameCount * 0.2) * 30 * sin(radian) * factor;

    this.x = x + displaceX;
    this.y = y + displaceY;
    
    circle(this.x, this.y, this.d);
  }
  
  followBody(target, targetOfTarget, gap, smallestAngle) {
    
    this.applyPullingForce(target, gap);
    if (targetOfTarget) {
      this.applyAngleConstrain(target, targetOfTarget, gap, smallestAngle);
    }
    circle(this.x, this.y, this.d);
    line(this.x, this.y, target.x, target.y);
  }
  
  applyPullingForce(target, gap) {
    let radian = findTangent(target, this);
    
    let displaceX = gap * cos(radian);
    let displaceY = gap * sin(radian);
      
    this.x = target.x + displaceX;
    this.y = target.y + displaceY;
  }
  
  
  applyAngleConstrain(center, theOtherPoint, gap, smallestAngle) {
    // find the angle between
    let radianDelta = findAngleBetween(center, this, theOtherPoint);
    
    // if smaller than the constrain
    if (radianDelta < smallestAngle) {
      let theOtherPointRadian = findTangent(center, theOtherPoint);
      
      let radian;
      if (isOnLeft(center, theOtherPoint, this)) {
        radian = theOtherPointRadian + smallestAngle;
      }
      else {
        radian = theOtherPointRadian - smallestAngle;
      }
      this.x = center.x + gap * cos(radian);
      this.y = center.y + gap * sin(radian);
    }
  } 
}