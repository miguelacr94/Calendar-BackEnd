const { response } = require("express");
const Evento = require('../models/Evento');

const getEvent = async (req, res = response) => {

    const eventos = await Evento.find()
        .populate('user', 'name');

    res.json({
        ok: true,
        eventos
    })
}

const crearEvento = async (req, res = response) => {
    // verificar que tenga evento
    // console.log(req.body);  sirve para verificar que exista el elemento

    const evento = new Evento(req.body);

    try {

        evento.user = req.uid;

        const eventoGuardado = await evento.save();

        res.json({
            ok: true,
            evento: eventoGuardado
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'comuniar al administrador'
        })
    }

}


const actualizarEvento = async (req, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById(eventoId);

        //punto donde verifica que el id exista 
        if (!evento) {
            res.status(400).json({
                ok: false,
                msg: 'Evento no existe con ese Id'
            });
        }

        // punto donde el usuario ya puede realizar edicion
        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene Privilegio de modificar este evento'
            });
        }

        // trae el body de la bd y lo desestructura
        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, { new: true });
        res.json({
            ok: true,
            evento: eventoActualizado
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'comuniar al administrador'
        })
    }

}

const eliminarEvento = async (req, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById(eventoId);

        //punto donde verifica que el id exista 
        if (!evento) {
            return res.status(400).json({
                ok: false,
                msg: 'Evento no existe con ese Id'
            });
        }

        // punto donde el usuario ya puede realizar edicion
        if (evento.user.toString() !== uid) {
            res.status(401).json({
                ok: false,
                msg: 'No tiene Privilegio de eliminar este evento'
            });
        }

        await Evento.findByIdAndDelete(eventoId);
        res.json({
            ok: true
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'comuniar al administrador'
        })
    }

}


module.exports = {
    getEvent,
    crearEvento,
    actualizarEvento,
    eliminarEvento

}