const { Router } = require('express');
const { registrarUsuario, iniciarSesionUsuario, obtenerPerfilUsuario, habilitarCuenta, solicitarResetPassword, resetearPassword } = require('../controllers/usuarios.controllers');
const auth = require('../middlewares/auth')
const router = Router()

router.post('/registrar', registrarUsuario)
router.post('/iniciar-sesion', iniciarSesionUsuario)
router.get('/perfil', auth(['usuario', 'admin']), obtenerPerfilUsuario);
router.get('/confirmar/:tokenHabilitar', habilitarCuenta) 
router.post('/olvide-password', solicitarResetPassword);
router.post('/reset-password/:token', resetearPassword);


router.get('/ping', (req, res) => {
  res.status(200).json({ msg: 'pong' });
});

module.exports = router