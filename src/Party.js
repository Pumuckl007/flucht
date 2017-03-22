class Party{
  constructor(user){
    this.users = [user];
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
  }

  addUser(user){
    console.log("Added", user)
    this.users.push(user);
  }

  update(domElement){
    let string = "";
    for(let user of this.users){
      string += "<li>" + user.name + " " + user.id +
       "<button onclick=\"connect('" + user.id + "')\" id=\"" + user.id +
       "\">Connect</button></li>";
    }
    domElement.innerHTML = string;
  }
}

export default Party;
