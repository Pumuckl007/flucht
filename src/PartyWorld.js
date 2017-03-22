import Party from "./Party.js";

class PartyWorld{
  constructor(domElement, networkConnection){
    this.users = [];
    this.domElement = domElement;
    this.networkConnection = networkConnection;
  }

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
    }
  }

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

  addUser(user){
    console.log("Added", user)
    this.users.push(user);
    this.update();
  }

  update(){
    let string = "";
    for(let user of this.users){
      string += "<li>" + user.name + " " + user.id +
       "<button onclick=\"connect('" + user.id + "')\" id=\"" + user.id +
       "\">Connect</button></li>";
    }
    this.domElement.innerHTML = string;
  }

  createWebrtcConnection(userId, offer){
    let user = this.getUserById(userId);
    if(user){
      if(true || confirm("Would you like to join " + user.name + "'s Party?")){
        this.networkConnection.acceptConnection(user, offer);
      } else {
        console.log("TODO: SEND ABORT SIGNAL");
      }
    } else {
      console.log("User tried to connect, but we do not have the user!", userId);
    }
  }

  finishWebrtcConnection(userId, answer){
    let user = this.getUserById(userId);
    if(user){
      this.networkConnection.finishConnection(user, answer);
    } else {
      console.log("User tried to connect, but we do not have the user!", userId);
    }
  }

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
