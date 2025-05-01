const { obtenerSeriePorIdDB } = require("../services/series.services");
const { eliminarSerieDB } = require("../services/series.services");
const { obtenerEstadisticasDashboardDB } = require("../services/series.services");
const { actualizarSerieDB } = require("../services/series.services");
const { obtenerSeriesDB } = require("../services/series.services");
const { crearSerieDB } = require("../services/series.services");

const crearSerie = async (req, res) => {
  const { msg, statusCode, error } = await crearSerieDB(
    req.idUsuario,
    req.body
  );
  try {
    res.status(statusCode).json({ msg });
  } catch {
    res.status(statusCode).json({ error });
  }
};

const obtenerSeries = async (req, res) => {
  const idUsuario = req.idUsuario;
  const { series, statusCode, error } = await obtenerSeriesDB(idUsuario);
  try {
    res.status(statusCode).json({ series });
  } catch {
    res.status(statusCode).json({ error });
  }
};

const obtenerSeriePorId = async (req, res) => {
  const { id } = req.params;
  const idUsuario = req.idUsuario;

  const { serie, msg, statusCode, error } = await obtenerSeriePorIdDB(
    id,
    idUsuario
  );

  try {
    if (serie) {
      res.status(statusCode).json({ serie });
    } else {
      res.status(statusCode).json({ msg });
    }
  } catch {
    res.status(statusCode).json({ error });
  }
};

const actualizarSerie = async (req, res) => {
  const { id } = req.params;
  const idUsuario = req.idUsuario;
  const { msg, statusCode, error } = await actualizarSerieDB(
    id,
    idUsuario,
    req.body
  );

  try {
    res.status(statusCode).json({ msg });
  } catch {
    res.status(statusCode).json({ error });
  }
};

const eliminarSerie = async (req, res) => {
  const { id } = req.params;
  const idUsuario = req.idUsuario;
  const { msg, statusCode, error } = await eliminarSerieDB(id, idUsuario);

  try {
    res.status(statusCode).json({ msg });
  } catch {
    res.status(statusCode).json({ error });
  }
};

const obtenerEstadisticasDashboard = async(req, res)=>{
    const idUsuario = req.idUsuario;
    const { stats, statusCode, error } = await obtenerEstadisticasDashboardDB(idUsuario);
    try {
        res.status(statusCode).json({ stats });
    } catch {
        res.status(statusCode).json({ error });
    }
}
module.exports = {
  crearSerie,
  obtenerSeries,
  obtenerSeriePorId,
  actualizarSerie,
  eliminarSerie,
  obtenerEstadisticasDashboard
};
