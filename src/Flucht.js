import Runner from "./Runner.js";

class Flucht{
  constructor(){
    this.stage = new PIXI.Container();
    this.renderer = new PIXI.WebGLRenderer(800, 600);
  }
  start(){
    console.log("the flucht has started. Da Da Daaa");
    document.body.appendChild(this.renderer.view);
  }

  addRunner(){
    this.runner = new Runner();
    this.stage.addChild(this.runner.sprite);
  }

  render(){
    this.renderer.render(this.stage);
  }

  update(){
    this.runner.update();
  }
}

export default Flucht;
