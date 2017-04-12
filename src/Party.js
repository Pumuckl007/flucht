/** Class representing the users that are in the current session*/
class Party{
  /**
  * adds the first user in the Party
  * @constructor
  * @param {User} user the user to be added
  */
  constructor(user){
    this.users = [user];
  }

  /**
  * removes user from the Party
  * @param {String} id the id of the user to be removed
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
  }

  /**
  * adds user to the Party
  * @param {User} user the user to be added
  */
  addUser(user){
    console.log("Added", user)
    this.users.push(user);
  }

  /**
  * updates the party string of current users
  * @param {?} domElement ????
  */
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
