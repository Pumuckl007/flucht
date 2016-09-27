import Box from "./Box.js";

class Terrain{
  constructor(url, handler){
    this.typeMap = {"element": Element, "colored": ColoredElement};
    this.handler = handler;
    if(url){
      this.elements = [];
      this.httpRequest = new XMLHttpRequest();

      let self = this;
      this.httpRequest.onreadystatechange = function(){self.loadElements()};
      this.httpRequest.open('GET', url);
      this.httpRequest.setRequestHeader('Content-Type', 'text/json');
      this.httpRequest.send();
    } else {
      this.elements = [new Element(0, -10, 8000, 20), new Element(300, 30, 200, 100)];
      this.elements.push(new Element(-200, 120, 100, 10));
      this.elements.push(new Element(80, 210, 80, 70));
    }
  }

  loadElements(){
    if (this.httpRequest.readyState === XMLHttpRequest.DONE) {
      if (this.httpRequest.status === 200) {
        this.data = JSON.parse(this.httpRequest.responseText);
        for(let element of this.data.elements){
          this.elements.push(new this.typeMap[element.type](element.x,
            element.y, element.width, element.height, element.data));
        }
        let w = this.data.width;
        let h = this.data.height;
        let bottomWall = new Element(w/2, -10, w, 20);
        let topWall = new Element(w/2, h+10, w, 20);
        let leftWall = new Element(-10, h/2, 20, h+40);
        let rightWall = new Element(w+10, h/2, 20, h+40);
        this.elements.push(bottomWall);
        this.elements.push(topWall);
        this.elements.push(leftWall);
        this.elements.push(rightWall);
        this.handler.spawnRunner(this.data);
      }
    }
  }
}

class Element{
  constructor(x, y, width, height){
    this.pos = {x:x, y:y};
    this.box = new Box(width, height);
    this.type = "Element";
  }

  collision(entity, side){

  }
}

class ColoredElement extends Element{
  constructor(x, y, width, height, data){
    super(x, y, width, height);
    this.color = data.color;
    this.type = "Colored Element";
  }
}

export default Terrain;
