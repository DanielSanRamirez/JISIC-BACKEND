/* 
    Ruta: /api/usuarios
*/

const { Router } = require('express');
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos');
const {
    crearUsuario,
    getUsuariosPaginado,
    getDocumentosUsuario,
    actualizarUsuario,
    borrarUsuario
} = require('../controllers/usuarios');

//const { validarJWT, validarADMIN_ROLE, validarADMIN_ROLE_o_MismoUsuario } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/pag/', getUsuariosPaginado);

router.get('/coleccion/:dato/:busqueda', getDocumentosUsuario)

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    check('nombres', 'El nombre completo es obligatorio').not().isEmpty(),
    check('perfil', 'El perfil es obligatorio').not().isEmpty(),
    validarCampos,
], crearUsuario);

router.put('/:id', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    check('nombres', 'El nombre completo es obligatorio').not().isEmpty(),
    check('perfil', 'El perfil es obligatorio').not().isEmpty(),
    validarCampos,
], actualizarUsuario);

router.delete('/:id', borrarUsuario);


module.exports = router;