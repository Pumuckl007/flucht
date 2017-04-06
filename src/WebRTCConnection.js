class WebRTCConnection{
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
      } catch(exception){
        console.log(exception);
      }
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
          windowe.channel.send(JSON.stringify({type:"ping", time:Date.now()}))
        }
        e.channel.onmessage = onMessage;
      }
    } else {
      let unopendDataChannel = this.connection.createDataChannel(channelId);
      unopendDataChannel.onopen = function(event){
        self.channel = unopendDataChannel;
        self.handler({type: "channelOpen"});
        unopendDataChannel.onmessage = onMessage;
      }
      unopendDataChannel.onclose = function(event){
        console.log(event);
      }
      unopendDataChannel.onerror = unopendDataChannel.onclose;
      this.connection.createOffer().then(function(offer){
        self.handler({type: "offer", offer: offer});
        self.connection.setLocalDescription(offer);
      });
    }
    this.handler = handler;
  }

  setRemoteDescription(description){
    this.connection.setRemoteDescription(description);
  }


}

export default WebRTCConnection;
