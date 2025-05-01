const { Router } = require('express');
const { crearSerie, obtenerSeries, obtenerSeriePorId, actualizarSerie, eliminarSerie, obtenerEstadisticasDashboard } = require('../controllers/series.controllers');
const auth = require('../middlewares/auth')
const router = Router()

router.post('/', auth(['usuario', 'admin']), crearSerie)
router.get('/', auth(['usuario', 'admin']), obtenerSeries)
router.get('/dashboard', auth(['usuario', 'admin']), obtenerEstadisticasDashboard)
router.get('/:id', auth(['usuario', 'admin']), obtenerSeriePorId);
router.put('/:id', auth(['usuario', 'admin']), actualizarSerie);
router.delete('/:id', auth(['usuario', 'admin']), eliminarSerie);


module.exports = router