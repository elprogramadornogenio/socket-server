import { Server, Socket } from "socket.io";
import { UsuariosLista } from '../classes/usuarios-lista';
import { Usuario } from '../interfaces/usuario.interfaces';


export const usuariosConectados = new UsuariosLista();

export const conectarCliente = (cliente: Socket) => {
    const usuario: Usuario = {
        id: cliente.id,
        nombre: 'no-nombre',
        sala: 'no-sala'
    }

    usuariosConectados.agregar(usuario);
}

export const desconectar = (cliente: Socket) =>{
    cliente.on('disconnect', ()=>{
        console.log(`Cliente ${cliente.id} desconectado`);
        usuariosConectados.borrarUsuario(cliente.id);
    });
}

export const mensaje = (cliente: Socket, io: Server) =>{
    cliente.on('mensaje',(payload: {de: string, cuerpo: string})=>{
        console.log('Mensaje recibido', payload);
        io.emit('mensaje-nuevo', payload);

    });
}

// Configurar usuario
export const configurarUsuario = (cliente: Socket, io: Server) => {
    cliente.on('configurar-usuario', (payload: {nombre: string}, callback: Function) => {
        usuariosConectados.actualizarNombre(cliente.id, payload.nombre);
        callback({
            ok: true,
            mensaje: `Usuario ${payload.nombre}, configurado`
        })
    });
}


