class WebRTCConnection{
  constructor(offer, channelId = "channel-"+Math.random(), handler){
    if(offer){

    } else {
      this.RTCPeerConnection = window.webkitRTCPeerConnection || window.RTCPeerConnection;
      this.channels = {};
      this.connection = new this.RTCPeerConnection(
        { iceServers: [{ urls:['stun:23.21.150.121'] }] },
        { optional: [
          { DtlsSrtpKeyAgreement: true },
          {'RtpDataChannels': true }
        ] }
      );
      let self = this;
      this.connection.onicecandidate = function (e) {
        if (e.candidate === null) {
          return;
        }
        console.log("ICE candidate event", e);

      };
      let unopendDataChannel = this.connection.createDataChannel("Anew")
      unopendDataChannel.onopen = function(event){
        self.channels["Anew"] = unopendDataChannel;
        console.log("Opend");
      }
      this.connection.createOffer().then(function(offer){
        self.handler({type: "offer", offer: offer});
        self.connection.setLocalDescription(offer)
      });
    }
    this.handler = handler;
  }


}

export default WebRTCConnection;
