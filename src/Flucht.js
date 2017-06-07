import Runner from "./Physics/Runner.js";
import World from "./Physics/World.js";
import Renderer from "./Renderer.js";
import PacketManager from "./PacketManager.js";
import PacketTypes from "./PacketTypes.js";
import RemotePlayerController from "./RemotePlayerController.js";
import Packet from "./Packet.js";
import NetworkConnection from "./NetworkConnection.js";
import PartyWorld from "./PartyWorld.js";
import UI from "./UI.js";
import ElementNetworkSyncController from "./Physics/ElementNetworkSyncController.js";
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

    this.networkConnection = new NetworkConnection(this.name);
    this.partyWorld = new PartyWorld(document.getElementById("Party Display"), this.networkConnection);
    this.networkConnection.registerHandler("leave", this.partyWorld);
    this.networkConnection.registerHandler("peers", this.partyWorld);
    this.networkConnection.registerHandler("join", this.partyWorld);
    this.networkConnection.registerHandler("offer", this.partyWorld);
    this.networkConnection.registerHandler("answer", this.partyWorld);
    this.networkConnection.registerHandler("ice", this.partyWorld);
    this.networkConnection.registerHandler("connectionEstablished", this.partyWorld);

    this.pm = new PacketManager(this.networkConnection);
    let pm = this.pm;
    let test = function(e, v){ pm.onWSMessage(e, v)}
    this.networkConnection.registerHandler("webRTCMessage", {
      onWSMessage: test
    });

    let self = this;

    let lock = function(e, v){ self.ui.switchScreen(self.ui.WAITING);
    self.ui.displayMessage("Players are in game, wait here while they finish", 10000) }
    this.networkConnection.registerHandler("lock",{
      onWSMessage: lock
    });
    let unlock = function(e, v){ self.ui.switchScreen(self.ui.PARTY);
    self.ui.displayMessage("You get to start!", 1000); }
    this.networkConnection.registerHandler("unlock",{
      onWSMessage: unlock
    });
    this.pm.addListener(PacketTypes.seed, this);
    this.pm.addListener(PacketTypes.host, this);
    this.pm.addListener(PacketTypes.start, this);
    this.pm.addListener(PacketTypes.trapPlacement, this);

    this.pm.addListener(PacketTypes.ready, this.partyWorld);
    this.ready = false;

    this.host = this.networkConnection.id;
    this.networkConnection.registerHandler("connectionEstablished", {onWSMessage:function(e, v){
      if(v.offerer){
        self.pm.send(new Packet(false, v.id, PacketTypes.seed, {seed:self.seed}));
        self.pm.send(new Packet(false, v.id, PacketTypes.host, {host:self.host}));
      }
    }});

    this.hotBar = new HotBar();
    this.hotBarUI = new HotBarUI(this.hotBar);
    this.hotBar.setSelectedSlot(0);
    this.ui.inputMethod.addInputListener(this.hotBarUI);

    this.ingame = false;

    //start game (delete this)
    // this.start(this.networkConnection.id);
    // this.startGame();
    // this.renderer.disableLighting();
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
    this.pm.broadcast(new Packet(false, false, PacketTypes.ready, {ready:this.ready}));
    this.partyWorld.update();
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
      self.elementNetworkSyncController = new ElementNetworkSyncController(self.pm, self.world);
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
    if(murderer){
      if(this.spawn){
        this.runner = new Murderer(this.world, 64, 108, this.spawn.x, this.spawn.y, this.name);
      } else {
        this.runner = new Murderer(this.world, 64, 108, 0, 76, this.name);
      }
    } else {
      if(this.spawn){
        this.runner = new Runner(64, 108, this.spawn.x, this.spawn.y, this.name);
      } else {
        this.runner = new Runner(64, 108, 0, 76, this.name);
      }
    }
    this.renderer.addRunner(this.runner);
    this.world.addEntity(this.runner);
    this.remotePlayerController = new RemotePlayerController(this.world, this.pm, this.runner, murderer);
    let self = this;
    for(let userId in this.networkConnection.webRTCConnections){
      remotePlayerController.addRemotePlayerListener(userId, this.name);
    }
    this.ui.inputMethod.addInputListener(this.runner);
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
    if(this.runner && this.runner.won && !this.runner.ghost){
      this.ui.displayMessage("You Won!!!!", 10000);
    }
    if(this.runner && this.runner.dead && this.runner.hasPhysics){
      this.ui.displayMessage("You Died. :(", 10000);
      this.runner.hasPhysics = false;
    }
  }

  /**
  * called when all of the users are ready by PartyWorld
  */
  allReady(){
    console.log("Host is", this.host, "I am", this.networkConnection.id);
    if(this.ingame){
      return;
    }
    if(this.host === this.networkConnection.id){
      this.pm.broadcast(new Packet(false, false, PacketTypes.start, {start:true, murderer:this.networkConnection.id}));
      this.start(this.networkConnection.id);
      this.murderList.push(this.host);
    }
  }

  /**
  * starts the game, the murerder id is for the UI and to get the right state
  * @param {String} murderID the id of the player who is the murderer
  */
  start(murderID){
    this.networkConnection.lockMe();
    this.ingame = true;
    this.createWorld();
    this.murderID = murderID;
    if(murderID === this.networkConnection.id){
      this.ui.switchScreen(this.ui.MURDER_EDITOR);
      this.murderEditor.enable();
      this.ui.displayMessage("You are the Murderer, place your traps now.", 2000);
    } else {
      this.ui.displayMessage("Waiting for the Murderer to place the traps.", 2000);
      this.ui.switchScreen(this.ui.WAITING);
    }
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
  * sends out the changes as in placement of trapGhost
  */
  sendOutChanges(){
    let additions = this.murderEditor.getAdditions();
    let packet = new Packet(false, false, PacketTypes.trapPlacement, additions);
    this.pm.broadcast(packet);
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
    if(this.murderID === this.networkConnection.id){
      this.ui.displayMessage("Find and kill the runners!", 1500);
      this.insertRunner(true);
    } else {
      this.ui.displayMessage("You are a Runner, run to the exit!", 1500);
      this.insertRunner(false);
    }
  }

  /**
  * called when all other players are dead or have won
  */
  allDone(){
    this.ui.switchScreen(this.ui.SCORES);
    let winners = [];
    let number = 0;
    let numberDead = 0;
    for(let runnerId in this.remotePlayerController.players){
      number ++;
      if(this.remotePlayerController.players[runnerId].won){
        winners.push(runnerId);
      }
      if(this.remotePlayerController.players[runnerId].dead){
        numberDead ++;
      }
    }
    let pot = 70*number;
    if(!this.scores){
      this.scores = {};
      for(let runnerId in this.remotePlayerController.players){
        this.scores[runnerId] = 0;
      }
      this.scores[this.networkConnection.id] = 0;
    }
    for(let player of winners){
      this.scores[player] += pot/winners.length;
    }
    this.scores[this.networkConnection.id] += numberDead*100;
    let nextMurderer = false;
    let players = this.remotePlayerController.players.slice(0);
    while()
    let data = {
      murderList : this.murderList,
      scores : this.scores
    }
    let packet = new Packet(false, false, PacketTypes.roundEnd, data);
    this.pm.broadcast(packet)
  }
}

export default Flucht;
