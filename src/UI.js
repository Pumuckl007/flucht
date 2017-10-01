import KMInputMethod from "./KMInputMethod.js";
import ControllerInputMethod from "./ControllerInputMethod.js";

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
    /**
    * the screen that says you won
    */
    this.WON = "Won";
    /**
    * the screen that says you are WAITING
    */
    this.WAITING = "waiting";
    /**
    * help screen
    */
    this.HELP = "Help";
    /**
    * the finial screen
    */
    this.DONE = "done";
    /**
    * the about screen
    */
    this.ABOUT = "about";

    this.flucht = flucht;
    this.mainMenuDOM = document.getElementById("GameMenuWrapper");
    this.partySelectionDOM = document.getElementById("PartySelectionWrapper");
    this.partyDOM = document.getElementById("PartyWrapper");
    this.nameEntry = document.getElementById("NameInput");
    this.editor = document.getElementById("MurderEditor");
    this.won = document.getElementById("Won");
    this.help = document.getElementById("Help");
    this.messageOverlay = document.getElementById("MessageOverlay");
    this.waiting = document.getElementById("Waiting");
    this.canvas = document.getElementsByTagName("canvas")[0];
    this.about = document.getElementById("About");
    this.screen = this.MAINMENU;

    this.nameEntry.value = this.flucht.name;

    this.inputMethod = new KMInputMethod();
    this.usingKeyboard = true;

    if(navigator.getGamepads()[0]){
      this.useGamePad(0, true);
    }

    this.nextDebounce = false;
    this.nextButton = document.getElementById("Start");

  }

  useKeyboard(){
    this.usingKeyboard = true;
    let listeners = this.inputMethod.listeners;
    this.inputMethod = new KMInputMethod();
    this.inputMethod.listeners = listeners;
    this.displayMessage("Gamepad Disconnected", 1000);
  }

  useGamePad(index, override){
    this.usingKeyboard = false;
    let listeners = this.inputMethod.listeners;
    this.inputMethod = new ControllerInputMethod(index);
    this.inputMethod.listeners = listeners;
    if(!override)
      this.displayMessage("Gamepad Connected", 1000);
  }

  displayMessage(message, timeout){
    let animationLength = 300;
    this.messageOverlay.innerHTML = message;
    this.messageOverlay.style.display = "block";
    this.messageOverlay.style["line-height"] = window.innerHeight + "px";
    this.messageOverlay.style.opacity = "0";
    let messageOverlay = this.messageOverlay;
    setTimeout(function(){
      messageOverlay.style.opacity = "1";
    }, 50)
    setTimeout(function(){
      messageOverlay.style.opacity = "0";
    }, timeout-animationLength);
    setTimeout(function(){
      messageOverlay.style.display="none";
    }, timeout);
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
        this.flucht.toggleReady();
        break;
      case "NewParty":
        this.switchScreen(this.PARTY);
        break;
      case "Ready":
        this.flucht.toggleReady();
        break;
      case "MurdererDone":
        this.flucht.startGame();
        break;
      case "Help":
        this.switchScreen(this.HELP);
        break;
      case "Back":
        this.switchScreen(this.MAINMENU);
        break;
      case "Reload":
        window.location.reload(false);
        break;
      case "About":
        this.switchScreen(this.ABOUT);
        break;
      default:
        console.log("Unhandled Key", key);
    }
  }

  switchScreen(screen){
    this.nextButton = false;
    if(this.screen === screen && (screen !== this.WAITING)){
      return;
    }
    if(this.screen === this.MAINMENU){
      this.mainMenuDOM.style.display = "none";
    }
    if(screen === this.MAINMENU){
      this.mainMenuDOM.style.display = "flex";
      this.nextButton = document.getElementById("Start");
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
      this.nextButton = document.getElementById("ReadyButton");
    }
    if(this.screen === this.MURDER_EDITOR){
      this.editor.style.display = "none";
    }
    if(screen === this.MURDER_EDITOR){
      this.editor.style.display = "block";
      this.nextButton = document.getElementById("MurdererDone");
      this.tryCanvas("block");
    }
    if(screen === this.GAME){
      this.partyDOM.style.display = "none";
      this.partySelectionDOM.style.display = "none";
      this.mainMenuDOM.style.display = "none";
      this.tryCanvas("block");
    }
    if(this.screen === this.WON){
      this.won.style.display = "none";
    }
    if(screen === this.WON){
      this.won.style.display = "block";
      this.won.style["line-height"] = window.innerHeight + "px";
      this.tryCanvas("none");
    }
    if(this.screen === this.HELP){
      this.help.style.display = "none";
    }
    if(screen === this.HELP){
      this.help.style.display = "block";
    }
    if(this.screen === this.WAITING){
      this.waiting.style.display = "none";
    }
    if(screen === this.WAITING){
      let string = "<div>Waiting for Murderer, Here are the scores so far</div><table class=\"scores\">";
      for(let id in flucht.scores){
        let name = "undef";
        let nameEnd = id.lastIndexOf("-");
        if(nameEnd){
          name = id.substring(0, nameEnd);
        }
        string += '<tr><td>' + name + '</td><td>' + flucht.scores[id] + '</td></tr>';
      }
      string += "</table>";
      this.waiting.innerHTML = string;
      this.waiting.style.display = "block";
      this.tryCanvas("none");
    }
    if(this.screen === this.DONE){
      this.waiting.style.display = "none";
    }
    if(screen === this.DONE){
      let string = "<div>You finished! Here are the scores!</div><table class=\"scores\">";
      for(let id in flucht.scores){
        let name = "undef";
        let nameEnd = id.lastIndexOf("-");
        if(nameEnd){
          name = id.substring(0, nameEnd);
        }
        string += '<tr><td>' + name + '</td><td>' + flucht.scores[id] + '</td></tr>';
      }
      string += "</table><div onclick=\"flucht.onUserEvent('Reload')\" class=\"MenuButton\">Again!</div>";
      this.waiting.innerHTML = string;
      this.waiting.style.display = "block";
    }
    if(this.screen === this.ABOUT){
      this.about.style.display = "none";
    }
    if(screen === this.ABOUT){
      this.about.style.display = "flex";
    }
    this.screen = screen;
  }

  tryCanvas(tag){
    if(!this.canvas){
      this.canvas = document.getElementsByTagName("canvas")[0];
    }
    if(this.canvas){
      this.canvas.style.display = tag;
    }
  }

  update(){
    if(this.usingKeyboard){
      if(navigator.getGamepads()[0]){
        this.useGamePad(0);
      }
    } else {
      if(!navigator.getGamepads()[0]){
        this.useKeyboard();
      }
    }
    this.inputMethod.poll();
    if(this.inputMethod.getStartButton() && this.nextButton && !this.nextDebounce){
      this.nextButton.onclick();
      this.nextDebounce = true;
    }
    if(!this.inputMethod.getStartButton()){
      this.nextDebounce = false;
    }
  }

}

export default UI;
