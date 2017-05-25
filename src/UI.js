
/**
* a controller for the UI of the flucht application
*/
class UI{

  /**
  * creates a new UI object with the following object to controll.
  * @constructor
  * @param {Flucht} flucht the controlled
  */
  constructor(flucht){
    /**
    * the main menu
    */
    this.MAINMENU = "MainMenu";
    /**
    * the party selection screen
    */
    this.PARTYSELECTION = "Party Selection";
    /**
    * the party screen
    */
    this.PARTY = "Party";
    /**
    * the screen for the murderer editor placement
    */
    this.MURDER_EDITOR = "Murder Editor";

    this.flucht = flucht;
    this.mainMenuDOM = document.getElementById("GameMenuWrapper");
    this.partySelectionDOM = document.getElementById("PartySelectionWrapper");
    this.partyDOM = document.getElementById("PartyWrapper");
    this.nameEntry = document.getElementById("NameInput");
    this.editor = document.getElementById("MurderEditor");
    this.screen = this.MAINMENU;

    this.nameEntry.value = this.flucht.name;

    this.keyListeners = [];

    let self = this;

    window.onkeyup = function(e) {
      keys[e.keyCode] = false;
      self.onKeyUpEvent(e);
    }
    window.onkeydown = function(e) {
      keys[e.keyCode] = true;
      self.onKeyDownEvent(e);
    }
  }

  /**
  * call to add a key listener
  * @param {Object} listener the listener Object
  * @param {Function} listener.onKey this function is called when a new key is pressed or released with the second argument being true if pressed
  */
  addKeyListener(listener){
    this.keyListeners.push(listener);
  }

  /**
  * called when a UI event is fired
  * @param {String} key the key for the event
  */
  event(key){
    switch(key){
      case "Start":
        this.switchScreen(this.PARTY);
        this.flucht.setName(this.nameEntry.value);
        this.flucht.initalize();
        break;
      case "NewParty":
        this.switchScreen(this.PARTY);
        break;
      case "Ready":
        this.flucht.toggleReady();
        break;
      case "MurdererDone":
        this.flucht.sendOutChanges();
        this.flucht.startGame();
        break;
      default:
        console.log("Unhandled Key", key);
    }
  }

  switchScreen(screen){
    if(this.screen === screen){
      return;
    }
    if(this.screen === this.MAINMENU){
      this.mainMenuDOM.style.display = "none";
    }
    if(screen === this.MAINMENU){
      this.mainMenuDOM.style.display = "flex";
    }
    if(this.screen === this.PARTYSELECTION){
      this.partySelectionDOM.style.display = "none";
    }
    if(screen === this.PARTYSELECTION){
      this.partySelectionDOM.style.display = "flex";
    }
    if(this.screen === this.PARTY){
      this.partyDOM.style.display = "none";
    }
    if(screen === this.PARTY){
      this.partyDOM.style.display = "block";
    }
    if(this.screen === this.MURDER_EDITOR){
      this.editor.style.display = "none";
    }
    if(screen === this.MURDER_EDITOR){
      this.editor.style.display = "block";
    }
    if(screen === this.GAME){
      this.partyDOM.style.display = "none";
      this.partySelectionDOM.style.display = "none";
      this.mainMenuDOM.style.display = "none";
    }
    this.screen = screen;
  }

  /**
  * called when a key is pressed
  * @param {KeyEvent} event the key event
  */
  onKeyUpEvent(event){
    for(let listener of this.keyListeners){
      listener.onKey(event.keyCode, false);
    }
  }

  /**
  * called when a key is pressed
  * @param {KeyEvent} event the key event
  */
  onKeyDownEvent(event){
    for(let listener of this.keyListeners){
      listener.onKey(event.keyCode, true);
    }
  }
}

export default UI;
