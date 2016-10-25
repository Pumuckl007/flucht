class Party{
  constructor(domElement){
    this.users = [];
    this.domElement = domElement;
  }

  onWSMessage(type, message){
    if(type === "peers"){
      this.users = message.peers;
      this.update();
    } else if(type === "leave"){
      this.removeUser(message.userId);
    } else if(type === "join"){
      this.addUser(message.user);
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
}

export default Party;
