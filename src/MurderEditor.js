/**
* a class housing the logic for the murder editor
*/
class MurderEditor{

  constructor(flucht){
    this.enabled = true;
    this.x = 0;
    this.y = 0;
    this.flucht = flucht;
  }

  /**
  * called when key is pressed
  * @param {number} key the ascii value of the key pressed
  * @param {boolean} pressed whether or not the key was pressed or released
  */
  onKey(key, pressed){
    if(!pressed){
      return;
    }
    if(this.enabled){
      if(key === 87){
        this.y ++;
        this.viewChanged();
      } else if(key === 83){
        this.x --;
      } else if(key === 65){
        this.x --;
      } else if(key === 68){
        this.x ++;
      }
    }
  }

  /**
  * called when an event is to be dispatched
  * @param {Object} data the data to use
  */
  viewChanged(data){
    this.flucht.murderEditorChanged(data);
  }

  /**
  * called to disabled the editor
  */
  disable(){
    this.enabled = false;
  }

  /**
  * called to enabled the editor
  */
  enable(){
    this.enabled = true;
  }

}

export default MurderEditor;
