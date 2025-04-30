const { Router } = require('express');
const { registrarUsuario, iniciarSesionUsuario, obtenerPerfilUsuario } = require('../controllers/usuarios.controllers');
const auth = require('../middlewares/auth')
const router = Router()

router.post('/registrar', registrarUsuario)
router.post('/iniciar-sesion', iniciarSesionUsuario)
router.get('/perfil', auth(['usuario', 'admin']), obtenerPerfilUsuario);

module.exports = router