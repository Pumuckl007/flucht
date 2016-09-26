class Box{
  constructor(width, height){
    this.height = height;
    this.width = width;
  }

  intersects(box, xOff, yOff){
    let value = 0;
    if(Math.abs(yOff)*2 < box.height + this.height&&Math.abs(xOff)*2 < box.width + this.width){
      value = 3;
      if(this.height/2 > Math.abs(yOff)-box.height/2 && this.height/2 < Math.abs(yOff)+box.height/2){
        value --;
      }
      if(this.width/2 > Math.abs(xOff)-box.width/2 && this.width/2 < Math.abs(xOff)+box.width/2){
        console.log(this.width/2, Math.abs(xOff), box.width/2, Math.abs(xOff)+box.width/2 );
        value -=2;
      }
      return (value <= 0) ? 3 : value;
    }
    return value;
  }
}

export default Box;
