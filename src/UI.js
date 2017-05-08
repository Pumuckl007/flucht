
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

    this.flucht = flucht;
    this.mainMenuDOM = document.getElementById("GameMenuWrapper");
    this.partySelectionDOM = document.getElementById("PartySelectionWrapper");
    this.partyDOM = document.getElementById("PartyWrapper");
    this.screen = this.PARTY;

  }

  /**
  * called when a UI event is fired
  * @param {String} key the key for the event
  */
  event(key){
    console.log(key);
    switch(key){
      case "Join":
        this.flucht.createWorld(); this.flucht.insertRunner();
        this.mainMenuDOM.style.display = "none";
        break;
      case "NewParty":
        this.switchScreen(this.PARTY);
        break;
      case "Ready":
        this.flucht.toggleReady();
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
    this.screen = screen;
  }
}

export default UI;
