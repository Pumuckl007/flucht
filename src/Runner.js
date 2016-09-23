class Runner{

  constructor(){
    this.textures = {};
    for(let i = 0; i<4; i++){
      this.textures["idle_" + i] = PIXI.Texture.fromImage("/assets/Runner/running_idle_" + i + ".png", false, PIXI.SCALE_MODES.NEAREST);
    }
    for(let i = 0; i<8; i++){
      this.textures["running_" + i] = PIXI.Texture.fromImage("/assets/Runner/running_running_" + i + ".png",  false, PIXI.SCALE_MODES.NEAREST);
    }
    this.sprite = new PIXI.Sprite(this.textures["idle_0"]);
    this.sprite.height = 128;
    this.sprite.width = 64;
    this.changeCounter = 20;
    this.spriteID = 0;
    this.running = true;
    this.x = 0;
    this.y = 0;
    console.log(this.sprite);
  }

  move(x, y){
    this.running = Math.abs(x)>1 || Math.abs(y) > 1;
    if(x > 0){
      this.sprite.scale.x = -2;
    } else if(x < 0){
      this.sprite.scale.x = 2;
    }
    this.x += x;
    this.y += y;
    this.moveSprite();
  }

  moveSprite(){
    this.sprite.position.x = ((this.sprite.scale.x < 0) ? 64 : 0) +this.x;
    this.sprite.position.y = 600-128-this.y;
  }

  update(){
    if(keys[68]){
      this.move(2,0);
    } else if(keys[65]){
      this.move(-2,0);
    } else {
      this.move(0,0);
    }
    this.changeCounter --;
    if(this.changeCounter < 0){
      this.spriteID ++;
      if(this.spriteID > (this.running ? 7 : 3)){
        this.spriteID = 0;
      }
      this.changeCounter = this.running ? 10 : 20;
      this.sprite.texture = this.textures[(this.running ? "running_" : "idle_") + this.spriteID];
    }
  }

}

export default Runner;
