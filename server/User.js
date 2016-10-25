class User{
  constructor(name, id, connection){
    this.name = name;
    this.id = id;
    this.connection = connection;
  }

  send(string){
    this.connection.send(string);
  }
}

export default User;
