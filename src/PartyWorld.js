import Party from "./Party.js";

/**
A class that is a world for parties, it manages the creation of parties and
the joining, and therefor is the main reciver for events fromt the
{@link NetworkConnection}.
*/
class PartyWorld{

  /**
  Creates a new Party World with the given dom element for the ui and network connection for the comunication and data.
  @param {HTMLElement} domElement the ui element which is a ul
  @param {Object} networkConnection the network connection to use for the UI
  */
  constructor(domElement, networkConnection){
    this.users = [];
    this.domElement = domElement;
    this.networkConnection = networkConnection;
  }

  /**
  * called when a message is recived from the network conenction
  @param {String} type the type of message, a string key
  @param {Object} message the object changes based on the key
  */
  onWSMessage(type, message){
    if(type === "peers"){
      this.users = message.peers;
      this.update();
    } else if(type === "leave"){
      this.removeUser(message.userId);
    } else if(type === "join"){
      this.addUser(message.user);
    } else if(type === "offer"){
      this.createWebrtcConnection(message.from, message.offer);
    } else if(type === "answer"){
      this.finishWebrtcConnection(message.from, message.answer);
    } else if(type === "ice"){
      this.tryIce(message.from, message.ice);
    } else if(type === "connectionEstablished"){
      this.connectionEstablished(message);
    }
  }

  /**
  Removes the user referenced by an ID
  @param {String} id the id of the user to removeUser
  */
  removeUser(id){
    let index = -1;
    for(let i = 0; i<this.users.length && index === -1; i++){
      if(this.users[i].id === id){
        index = i;
      }
    }
    if(index > -1){
      this.users.splice(index, 1);
    }
    this.update();
  }

  /**
  Returns the user given by the ID
  @param {String} id the id of the user to getUserById
  @returns {User} returns the user of the given ID
  */
  getUserById(id){
    let index = -1;
    for(let i = 0; i<this.users.length && index === -1; i++){
      if(this.users[i].id === id){
        index = i;
      }
    }
    if(index > -1){
      return this.users[index];
    }
    return false;
  }

  /**
  * Adds a user to the World
  * @param {Object} user the user to add
  * @param {String} user.id - The Id of the user
  */
  addUser(user){
    console.log("Added", user)
    this.users.push(user);
    this.update();
  }

  /**
  Called when the partyworld should update the dom element with the current data
  */
  update(){
    let string = "";
    for(let user of this.users){
      if(user.id === this.networkConnection.id){
        continue;
      }
      string += "<li>" + user.name + " " + user.id;
      if(!user.isConnected){
        string += "<button onclick=\"connect('" + user.id + "')\" id=\"" + user.id +
         "\">Connect</button>";
      } else {
        string += "connected!";
      }
      string += "</li>";
    }
    this.domElement.innerHTML = string;
  }

  /**
  Creates a new webrtc connection given an offer and prompts the user.
  @param {String} userId the id of the user to connect to
  @param {RTCSessionDescription} offer the offer to accept
  */
  createWebrtcConnection(userId, offer){
    let user = this.getUserById(userId);
    if(user){
      if(confirm("Would you like to join " + user.name + "'s Party?")){
        this.networkConnection.acceptConnection(user, offer);
      } else {
        console.log("TODO: SEND ABORT SIGNAL");
      }
    } else {
      console.log("User tried to connect, but we do not have the user!", userId);
    }
  }

  /**
  Creates a new webrtc connection given an offer and prompts the user.
  @param {String} userId the id of the user to connect to
  @param {RTCSessionDescription} answer the answer to accept
  */
  finishWebrtcConnection(userId, answer){
    let user = this.getUserById(userId);
    if(user){
      this.networkConnection.finishConnection(user, answer);
    } else {
      console.log("User tried to connect, but we do not have the user!", userId);
    }
  }

  /**
  A callback called when a connection is created.
  @param {String} userId the id of the user connected to
  */
  connectionEstablished(userId){
    this.getUserById(userId.id).isConnected = true;
    this.update();
  }

  /**
  Trys an ice connection for the user
  @param {String} userId the id of the suer to try the ice for
  @param {RTCIceCandidate} ice the ice for the connection
  */
  tryIce(userId, ice){
    let user = this.getUserById(userId);
    if(user){
      this.networkConnection.tryIce(user, ice);
    } else {
      console.log("Tried to try ice for a user, but we do not have the user!", userId);
    }
  }
}

export default PartyWorld;
