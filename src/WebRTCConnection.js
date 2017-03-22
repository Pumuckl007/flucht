class WebRTCConnection{
  constructor(offer, channelId = "channel-"+Math.random(), handler){
    this.RTCPeerConnection = window.webkitRTCPeerConnection || window.RTCPeerConnection;
    this.channels = {};
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

    if(offer){
      this.connection.setRemoteDescription(offer);
      this.connection.createAnswer().then((answer) => {
        this.connection.setLocalDescription(answer);
        this.handler({type: "answer", answer:answer});
      });
      this.connection.ondatachannel = function(e){
        console.log("WebRTCConnection.js:27", e);
        self.channels[channelId] = e.channel;
        e.channel.onopen = function(event){
          console.log("RTC:30", event);
        }
        e.channel.onmessage = function(event){
          console.log("RTC:33", event);
        }
      }
    } else {
      let unopendDataChannel = this.connection.createDataChannel(channelId);
      unopendDataChannel.onopen = function(event){
        self.channels[channelId] = unopendDataChannel;
        console.log("Opend, line 40", event);
        window.testDataChannel = unopendDataChannel;
        unopendDataChannel.onmessage = function(msg){
          console.log(msg);
        };
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
