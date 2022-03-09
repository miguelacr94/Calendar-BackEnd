/**
 Rutas de Usuario / Auth
 host + /api/auth
 */

const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();
const { validarCampos } = require('../middlewares/validar-campos');
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth')
const { validarJWT } = require('../middlewares/validar-jwt');


router.post('/new',
    [//middelwere
        check('name', 'Nombre obligatorio').not().isEmpty(),
        check('email').not().isEmpty().withMessage('El Email es obligatorio').isEmail().withMessage('Email incorrecto'),
        check('password', 'El password es obligatorio').isLength({ min: 6 }),
        validarCampos
    ],
    crearUsuario);

router.post('/',
    [//middelwere
        check('email').not().isEmpty().withMessage('El Email es obligatorio').isEmail().withMessage('Email incorrecto'),
        check('password', 'El password es obligatorio').isLength({ min: 6 }),
        validarCampos
    ], loginUsuario);

router.get('/renew',validarJWT, revalidarToken);

module.exports = router;