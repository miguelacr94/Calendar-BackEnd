/**
 Rutas de eventos / Events
 host + /api/events
 */

const { Router } = require('express');
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos')
const { getEvent, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const { validarJWT } = require('../middlewares/validar-jwt');
const { isDate } = require('../helpers/isDate');
const router = Router();

router.use(validarJWT);


// obtener eventos
router.get('/',

    getEvent);

// crear eventos
router.post('/',
    [
        check('title', 'El titulo es Obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio obligatoria').custom(isDate),
        check('end', 'Fecha final es obligatoria').custom(isDate),
        validarCampos
    ]
    , crearEvento);

// editar eventos
router.put('/:id',
[
    check('title', 'El titulo es Obligatorio').not().isEmpty(),
    check('start', 'Fecha de inicio obligatoria').custom(isDate),
    check('end', 'Fecha final es obligatoria').custom(isDate),
    validarCampos
]
, actualizarEvento);

// borrar eventos
router.delete('/:id', eliminarEvento);


module.exports = router;