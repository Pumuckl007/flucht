import User from "./User";

class UserWorld{
  constructor(){
    this.users = {};
  }

  onWebsocketMessage(key, msg){
    if(key === "id"){
      this.users[msg.id] = new User(msg.name, msg.id, msg.wsConnection);
      let peers = [];
      for(let peer in this.users){
        if(this.users[peer]){
          let localPeer = this.users[peer];
          peers.push({id:localPeer.id, name:localPeer.name});
        }
      }
      msg.wsConnection.id = msg.id;
      msg.wsConnection.send(JSON.stringify({
        type:"peers",
        peers: peers
      }));
      this.brodcastToUsers({
        type:"join",
        user:{id:msg.id, name:msg.name}
      }, [this.users[msg.id]]);
    } else if(key === "disconnect"){
      this.userDied(this.users[msg.id]);
    } else if(key === "offer"){
      this.propogateRequestToUser(JSON.stringify({type: msg.type, to:msg.to,
         from:msg.from, offer:msg.offer}), msg.to, msg.from);
    } else if(key === "answer"){
      this.propogateRequestToUser(JSON.stringify({type: msg.type, to:msg.to,
         from:msg.from, answer:msg.answer}), msg.to, msg.from);
    } else if(key === "ice"){
      this.propogateRequestToUser(JSON.stringify({type: msg.type, to:msg.to,
         from:msg.from, ice:msg.ice}), msg.to, msg.from);
    }
  }

  propogateRequestToUser(json, to, from){
    let user = this.users[to];
    if(!user){
      console.warn("trying to propogate to nonexistent user");
      return;
    }
    user.connection.send(json)
  }

  userDied(user){
    this.users[user.id] = false;
    this.brodcastToUsers({
      type:"leave",
      userId: user.id
    }, []);
  }

  brodcastToUsers(msg, excludes){
    for(let userId in this.users){
      let user = this.users[userId];
      if(user && excludes.indexOf(user) === -1){
        user.send(JSON.stringify(msg));
      }
    }
  }
}

export default UserWorld;
