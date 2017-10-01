import Runner from "./Physics/Runner.js";
import World from "./Physics/World.js";
import Renderer from "./Renderer.js";
import UI from "./UI.js";
import HotBar from "./HotBar.js";
import HotBarUI from "./HotBarUI.js";
import MurderEditor from "./MurderEditor.js";
import TrapMap from "./Physics/Elements/TrapMap.js";
import Murderer from "./Physics/Murderer.js";

/** class creates world, runner and renderer to begin the game*/
class Flucht{
  /**
  * creates the world, renderer and player  assigns event listeners to world class
  * @constructor
  */
  constructor(){
    if(localStorage.name){
      this.name = localStorage.name;
    } else {
      this.name = "Saya";
    }
    this.ui = new UI(this);
    this.murderList = [];
    this.scores = false;
    this.numerOfPlayers = 2;
  }

  /**
   * sets the name
   * @param {String} name the new name
   */
  setName(name){
    if(name){
      localStorage.name = name;
      this.name = name;
    }
  }

  /**
   * initilizes the flucht game
   */
  initalize(){
    this.seed = "Saya-" + Date.now();
    this.listeners = [];
    /**
    * the constant for the world created event
    */
    this.WORLDCREATED = "world created";

    let self = this;

    this.ready = false;

    this.hotBar = new HotBar();
    this.hotBarUI = new HotBarUI(this.hotBar);
    this.hotBar.setSelectedSlot(0);
    this.ui.inputMethod.addInputListener(this.hotBarUI);

    this.ingame = false;

  }

  /**
  * adds a listener to flucht
  */
  addEventListener(listener){
    this.listeners.push(listener);
  }

  /**
  * toggles the ready state of the application
  */
  toggleReady(){
    this.ready = !this.ready;
    this.allReady();
  }

  /**
  * creates a new world based on the seed provided to flucht
  */
  createWorld(){
    if(this.world){
      return;
    }
    let self = this;
    this.world = new World({spawnRunner:function(data){
      let spawn = data.spawns[~~(Math.random()*data.spawns.length)];
      if(self.runner){
        self.runner.pos = spawn;
      } else {
        self.spawn = spawn;
      }
      self.renderer.onEvent("Terrain Updated", self.world.terrain);
      self.renderer.onEvent("Level Loaded", data.background);
      if(self.world.entities.length < 1 && self.runner){
        self.world.addEntity(self.runner, false);
      }
    }}, this.seed);
    this.renderer = new Renderer();
    this.world.addEventListener(this.renderer);
    for(listener in this.listeners){
      listener.onEvent(this.WORLDCREATED, this.world);
    }

    this.murderEditor = new MurderEditor(this, this.hotBar, this.world);
    this.murderEditor.disable();
    this.ui.inputMethod.addInputListener(this.murderEditor);
    this.renderer.addPlacementSprite(this.murderEditor.trapGhost.sprite);
    this.renderer.disableLighting();
  }

  /**
  * inserts the runner to the world
  */
  insertRunner(murderer){
    if(this.runner){
      return;
    }
      if(this.spawn){
        this.runner = new Murderer(this.world, 64, 108, this.spawn.x, this.spawn.y, this.name);
      } else {
        this.runner = new Murderer(this.world, 64, 108, 0, 76, this.name);
      }
      if(this.numerOfPlayers === 2){
        if(this.spawn){
          this.runner2 = new Runner(64, 108, this.spawn.x, this.spawn.y, this.name, true);
        } else {
          this.runner2 = new Runner(64, 108, 0, 76, this.name, true);
        }
      }
      if(this.numerOfPlayers === 1){
        this.renderer.addRunner(this.runner);
      }
    this.renderer.setNoMovement(this.numerOfPlayers === 2);
    this.world.addEntity(this.runner);
    if(this.numerOfPlayers === 2){
      this.world.addEntity(this.runner2);
    }
    let self = this;
    this.ui.inputMethod.addInputListener(this.runner);
    if(this.numerOfPlayers === 2){
      this.ui.inputMethod.addInputListener(this.runner2);
    }
  }

  /**
  * called when packet is recived
  * @param {Packet} packet the packet recived
  */
  onPacket(packet){
    if(packet.id === PacketTypes.seed){
      this.seed = packet.data.seed;
      if(this.world){
        this.world.reset(this.seed);
      }
      if(this.runner){
        this.runner.pos.x = 0;
        this.runner.pos.y = 76;
      }
    } else if(packet.id === PacketTypes.host){
      this.host = packet.data.host;
    } else if(packet.id === PacketTypes.start){
      this.start(packet.data.murderer);
    } else if(packet.id === PacketTypes.trapPlacement){
      this.updateTraps(packet.data);
      this.startGame();
    } else if(packet.id === PacketTypes.roundEnd){
      this.murderList = packet.data.murderList;
      this.scores = packet.data.scores;
      this.ingame = false;
      this.seed = packet.data.nextSeed;
      if(packet.data.nextMurderer){
        this.restart(packet.data.nextMurderer);
      } else {
        window.done = true;
        this.ui.switchScreen(this.ui.DONE);
        this.networkConnection.unlockMe();
      }
    }
  }

  /**
  * called when a UI button is clicked
  */
  onUserEvent(event){
    this.ui.event(event);
  }

  /**
  * renderers all the elements in the stage
  */
  render(){
    if(this.renderer){
      this.renderer.render();
    }
  }

  /**
  * updates the world after 20 milliseconds
  */
  update(){
    this.ui.update();
    if(this.murderEditor){
      this.murderEditor.update();
    }
    if(this.world){
      this.world.tick(20/1000);
      if(this.elementNetworkSyncController){
        this.elementNetworkSyncController.update();
      }
    }
    if(this.runner && this.runner.dead && this.runner.murderer){
      this.allDone();
    }
    if(this.runner && this.runner.won && !this.runner.ghost){
      this.ui.displayMessage("You Won!!!!", 2000);
    }
    if(this.runner && this.runner.dead && !this.runner.ghost){
      this.ui.displayMessage("You Died. :(", 200);
    }
  }

  /**
  * called when all of the users are ready by PartyWorld
  */
  allReady(){
    if(this.ingame){
      return;
    }
    this.start();
  }

  /**
  * starts the game, the murerder id is for the UI and to get the right state
  */
  start(){
    this.ingame = true;
    if(!this.world){
      this.createWorld();
    } else {
      this.world.reset(this.seed);
      this.renderer.disableLighting();
    }
      this.ui.switchScreen(this.ui.MURDER_EDITOR);
      this.murderEditor.enable();
      this.ui.displayMessage("Starting Demo. Place your traps.", 2000);
  }

  /**
  * called when the murderer editor has changed
  * @param {Object} data the data
  */
  murderEditorChanged(data){
    if(data.enableChanged && this.renderer){
      if(this.murderEditor.enabled){
        this.renderer.disableLighting();
      } else {
        this.renderer.enableLighting();
      }
      return;
    }
    if(this.renderer){
      this.renderer.setPos(data.x, data.y);
    }
  }

  /**
  * called as a response to sendOutChanges and updates the world with the new traps
  */
  updateTraps(traps){
    for(let trapJSON of traps){
      let trapJSONObject = JSON.parse(trapJSON);
      let constructor = TrapMap[trapJSONObject.type];
      let trap = new constructor();
      trap.fromJSON(trapJSONObject);
      this.world.addElement(trap);
    }
  }

  /**
  * starts the game with the current traps
  */
  startGame(){
    this.ui.switchScreen(this.ui.GAME);
    this.murderEditor.disable();
    this.ui.displayMessage("Have fun in the Demo!", 1500);
    this.insertRunner(true);
  }

  /**
  * called when all other players are dead or have won
  */
  allDone(){
    if(!this.runner.murderer){
      return;
    }
    let winners = [];
    let number = 0;
    let numberDead = 0;
    let players = [];
    for(let player of winners){
      this.scores[player] += pot/winners.length;
    }
    if(this.runner.dead){
      for(let player of players){
        this.scores[player] += 100;
      }
    }
    this.scores[this.networkConnection.id] += numberDead*100;
    let nextMurderer = false;
    while(players.length > 0){
      let index = ~~(Math.random()*players.length);
      if(this.murderList.indexOf(players[index]) === -1){
        nextMurderer = players[index];
        break;
      }
      players.splice(index, 1);
    }
    let data = {
      murderList : this.murderList,
      scores : this.scores,
      nextMurderer: nextMurderer,
      nextSeed : Math.random() + "-new"
    }
    this.seed = data.nextSeed;
    let packet = new Packet(false, false, PacketTypes.roundEnd, data);
    this.pm.broadcast(packet);
    this.ingame = false;
    this.restart(data.nextMurderer);
  }

  /**
  * starts the next round of the game
  */
  restart(nextMurderer){
    if(nextMurderer === false){
      this.ui.switchScreen(this.ui.DONE);
      this.networkConnection.unlockMe();
      window.done = true;
      return;
    }
    console.log("Murderer is", nextMurderer, "I am", this.networkConnection.id);
    this.runner.deleted = true;
    this.runner = false;
    if(this.ingame){
      return;
    }
    if(this.networkConnection.id === nextMurderer){
      this.pm.broadcast(new Packet(false, false, PacketTypes.start, {start:true, murderer:this.networkConnection.id}));
      this.start(this.networkConnection.id);
      this.murderList.push(this.networkConnection.id);
    }
  }
}

export default Flucht;
