/** Class that keeps tarck of player's location on the map and draws it*/
class MiniMap{
  /**Creates a Minimap object that tracks the entity and its location on the map
  * @constructor
  */
  constructor(stage, renderer){
    this.stage = stage;//new PIXI.Stage(0x005e79);
     //Game renderer
    this.renderer = renderer;//new PIXI.autoDetectRenderer(1000, 800, {antialias: true});
    //document.getElementById("gamearea").appendChild(this.renderer.view);
    // Renderer:
  //  Minimap
    this.minimapRenderer = new PIXI.RenderTexture(1000, 800);
    // Display object:
    //Game graphics
    this.sceneSurface = new PIXI.Container();
    this.stage.addChild(this.sceneSurface);
    // Game loop:
    this.minimapRenderer.render(this.sceneSurface);
    this.renderer.render(this.stage);
    // Minimap code:
    let mapContainer = new PIXI.Graphics();
    mapContainer.beginFill(0xdb5e5e, 0.5);
    mapContainer.lineStyle(2, 0xdb5e5e);
    mapContainer.drawRect(0, 0, 170, 130);
    this.stage.addChild(mapContainer);
    let minimap = new PIXI.Sprite(this.minimapRenderer);
    minimap.position.x = 1;
    minimap.position.y = 1;
    minimap.scale.x = 0.15;
    minimap.scale.y = 0.15;
    mapContainer.addChild(minimap);
  }
}

export default MiniMap;
