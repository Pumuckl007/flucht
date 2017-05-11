/** Class representing players in the session*/
class User{
  /**
  * creates a new user with name and id
  * @constructor
  * @param {String} name the name of the User
  * @param {String} id the id of the User
  * @param {Connection} connection the user's session
  */
  constructor(name, id, connection){
    this.name = name;
    this.id = id;
    this.connection = connection;
    this.ready = false;
  }

  /**
  * Sends messages to session
  * @param {String} string the string to be sent
  */
  send(string){
    this.connection.send(string);
  }
}

export default User;
