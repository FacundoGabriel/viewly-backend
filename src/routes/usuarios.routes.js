const { Router } = require('express');
const { registrarUsuario, iniciarSesionUsuario, obtenerPerfilUsuario } = require('../controllers/usuarios.controllers');

const router = Router()

router.post('/registrar', registrarUsuario)
router.post('/iniciar-sesion', iniciarSesionUsuario)
router.get('/perfil', obtenerPerfilUsuario);

module.exports = router