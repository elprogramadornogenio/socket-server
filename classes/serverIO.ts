import express from "express";
import { SERVER_PORT } from "../global/environments";
import { Server } from 'socket.io';
import { createServer } from "http";
import * as socket from "../sockets/sockets";

//npm i --save-dev @types/express

export default class ServerIo {

    private static _instance: ServerIo;
    public app: express.Application;
    public port: number;
    public io: Server;
    public httpServer = createServer();


    private constructor() {
        this.app = express();
        this.port = SERVER_PORT;
        this.io = new Server(this.httpServer, {
            cors: {
                origin: "http://localhost:4200",
                methods: ["GET", "POST"],
                allowedHeaders: ["my-custom-header"],
                credentials: true
              }
        });
        this.escucharSockets();
    }

    public static get instance() {
        return this._instance || (this._instance = new ServerIo());
    }

    private escucharSockets() {
        console.log("Escuchando Sockets");
        this.io.on('connection', (cliente) =>{
            console.log('Nuevo cliente conectado');

            socket.mensaje(cliente, this.io);

            socket.desconectar(cliente);
        });
    }

    start(callback: () => void) {
        this.httpServer.listen(this.port, callback);

    }
}