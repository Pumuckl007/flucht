import FileServer from "./FileServer.js";
import WebsocketServer from "./WebsocketServer.js";
import UserWorld from "./UserWorld.js";

var server = new FileServer(8125);
var wsServer = new WebsocketServer(server);
var userWorld = new UserWorld();
wsServer.registerHandler("id", userWorld);
wsServer.registerHandler("disconnect", userWorld);
wsServer.registerHandler("offer", userWorld);
wsServer.registerHandler("answer", userWorld);
wsServer.registerHandler("ice", userWorld);
wsServer.registerHandler("lock", userWorld);
