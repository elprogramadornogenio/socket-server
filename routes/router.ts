import { Router, Request, Response } from "express";
import ServerIo from "../classes/serverIO";
import { usuariosConectados } from "../sockets/sockets";


const router = Router();


router.get('/mensajes', (req: Request, res: Response) => {
    res.json(
        {
            ok: true,
            mensaje: 'Todo está bien'
        }
    )
})


router.post('/mensajes', (req: Request, res: Response) => {

    const cuerpo = req.body.cuerpo;
    const de = req.body.de;

    const payload = {
        de,
        cuerpo
    }
    const server = ServerIo.instance;
    server.io.emit('mensaje-nuevo', payload);

    res.json(
        {
            ok: true,
            cuerpo,
            de
        }
    )
})

router.post('/mensajes/:id', (req: Request, res: Response) => {

    const cuerpo = req.body.cuerpo;
    const de = req.body.de;
    const id = req.params.id;

    const payload = {
        de,
        cuerpo
    }

    const server = ServerIo.instance;
    server.io.in(id).emit('mensaje-privado', payload);

    res.json(
        {
            ok: true,
            cuerpo,
            de,
            id
        }
    )
})

router.get('/usuarios', async (req: Request, res: Response) => {
    const server = ServerIo.instance;

    //const count = server.io.engine.clientsCount;

    /* const user = server.io.engine;

    console.log(count); */

    try {

        let ids = await server.io.allSockets();
        let clientes: string[] = []

        for (let id of ids) {
            clientes.push(id);
        }
        res.json(
            {
                ok: true,
                clientes

            }
        )

    } catch (error) {
        return res.json(
            {
                ok: false,
                error

            }
        )
    }

});


router.get('/usuarios/detalle', (req: Request, res: Response)=>{
    

    res.json(
        {
            ok: true,
            clientes: usuariosConectados.getLista()

        }
    )
});


export default router;