/** Establishes connection between other players*/
class WebRTCConnection{
  /**
  * looks for possible candidates and makes an offer, if offer is accepted connection is made
  * @constructor
  * @param {RTCSessionDescription} offer offered description of peer to be connected with
  * @param {String} channelId the id of the channelId
  * @param {function} handler function to be passed on event
  */
  constructor(offer, channelId = "channel-"+Math.random(), handler){
    this.RTCPeerConnection = window.webkitRTCPeerConnection || window.RTCPeerConnection;
    this.channel = null;
    this.connection = new this.RTCPeerConnection(
      { iceServers: [{ urls:['stun:23.21.150.121'] }] }//,
      // { optional: [
      //   { DtlsSrtpKeyAgreement: true },
      //   {'RtpDataChannels': true }
      // ] }
    );
    let self = this;
    this.connection.onicecandidate = function (e) {
      if (e.candidate === null) {
        return;
      }
      self.handler({type: "ice", ice:e.candidate});
    };

    let onMessage = function(e){
      try{
        let json = JSON.parse(e.data);
        self.handler({type: "message", json:json})
      } catch(exception){
        console.log(exception);
      }
    }

    let onClose = function(e){
      self.handler({type: "close"});
    }

    if(offer){
      this.connection.setRemoteDescription(offer);
      this.connection.createAnswer().then((answer) => {
        this.connection.setLocalDescription(answer);
        this.handler({type: "answer", answer:answer});
      });
      this.connection.ondatachannel = function(e){
        self.channel = e.channel;
        e.channel.onopen = function(event){
          self.handler({type: "channelOpen"});
        }
        e.channel.onmessage = onMessage;
        e.channel.onclose = onClose;
      }
    } else {
      let unopendDataChannel = this.connection.createDataChannel(channelId);
      unopendDataChannel.onopen = function(event){
        self.channel = unopendDataChannel;
        self.handler({type: "channelOpen"});
        unopendDataChannel.onmessage = onMessage;
      }
      unopendDataChannel.onclose = onClose;
      unopendDataChannel.onerror = unopendDataChannel.onclose;
      this.connection.createOffer().then(function(offer){
        self.handler({type: "offer", offer: offer});
        self.connection.setLocalDescription(offer);
      });
    }
    this.handler = handler;
  }

  /**
  * changes the description to be passed to peer
  * @param {RTCSessionDescription} description the new description to be passed
  */
  setRemoteDescription(description){
    this.connection.setRemoteDescription(description);
  }


}

export default WebRTCConnection;
