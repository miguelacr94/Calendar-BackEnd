const { response } = require('express');
const { validationResult } = require("express-validator");
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt')

const crearUsuario = async (req, res = response) => {
    const { email, password } = req.body;

    try {
        let usuario = await Usuario.findOne({ email })

        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'ya existe un usuario con este correo'
            })
        }
        usuario = new Usuario(req.body);

        //encriptar password
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);


        await usuario.save();

        //generar JWT
        const token = await generarJWT(usuario.id, usuario.name)

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por Favor Cominicar a Admin'

        })
    }


}


const loginUsuario = async (req, res = response) => {
    const { email, password } = req.body;

    //manejo de errores
    let usuario = await Usuario.findOne({ email })

    try {
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o Contraseña incorrecto'
            })
        }


        // generar JWT
        const token = await generarJWT(usuario.id, usuario.name);


        // confirmar password
        const validPassword = bcrypt.compareSync(password, usuario.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña Incorrecta'
            })
        }
        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por Favor Cominicar a Admin'

        })
    }



}

const revalidarToken = async (req, res = response) => {

    const { uid, name } = req;

    const token = await generarJWT(uid, name); // genera token



    res.json({
        ok: true,
        uid,
        name,
        token
    })
}


module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}