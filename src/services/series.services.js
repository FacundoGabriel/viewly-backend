const SerieModel = require("../model/series.model");

const crearSerieDB = async (idUsuario, body) => {
  try {
    const serieExiste = await SerieModel.findOne({
      titulo: body.titulo,
      idUsuario: idUsuario,
    });

    if (serieExiste) {
      return {
        msg: "La serie ya existe.",
        statusCode: 400,
      };
    }

    const nuevaSerie = new SerieModel({
      ...body,
      idUsuario: idUsuario,
    });

    await nuevaSerie.save();
    return {
      msg: "serie agregada correctamente",
      statusCode: 201,
    };
  } catch (error) {
    console.log(error);
    return {
      error,
      statusCode: 500,
    };
  }
};

const obtenerSeriesDB = async (idUsuario) => {
  try {
    const series = await SerieModel.find({ idUsuario: idUsuario });

    return {
      series,
      statusCode: 200,
    };
  } catch (error) {
    return {
      error,
      statusCode: 500,
    };
  }
};

const obtenerSeriePorIdDB = async (idSerie, idUsuario) => {
  try {
    const serie = await SerieModel.findOne({
      _id: idSerie,
      idUsuario: idUsuario,
    });

    if (!serie) {
      return {
        msg: "La serie no fue encontrada.",
        statusCode: 404,
      };
    }

    return {
      serie,
      statusCode: 200,
    };
  } catch (error) {
    return {
      error,
      statusCode: 500,
    };
  }
};

const actualizarSerieDB = async (idSerie, idUsuario, body) => {
  try {
    const serie = await SerieModel.findOne({
      _id: idSerie,
      idUsuario: idUsuario,
    });

    if (!serie) {
      return {
        msg: "No se encontró la serie para actualizar.",
        statusCode: 404,
      };
    }

    const serieActualizada = await SerieModel.findByIdAndUpdate(
      { _id: idSerie },
      { ...body }
    );

    if (!serieActualizada) {
      return {
        msg: "No se encontró la serie para actualizar.",
        statusCode: 404,
      };
    }

    return {
      msg: "serie actualizada correctamente",
      statusCode: 201,
    };
  } catch (error) {
    return {
      error,
      statusCode: 500,
    };
  }
};

const eliminarSerieDB = async (idSerie, idUsuario) => {
  try {
    const serieExiste = await SerieModel.findOne({
      _id: idSerie,
      idUsuario: idUsuario,
    });

    if (!serieExiste) {
      return {
        msg: "No se encontró la pelicula y no se pudo eliminar",
        statusCode: 404,
      };
    }

    await SerieModel.findByIdAndDelete({ _id: idSerie });

    return {
      msg: "Pelicula eliminado con exito",
      statusCode: 201,
    };
  } catch (error) {
    return {
      error,
      statusCode: 500,
    };
  }
};

const obtenerEstadisticasDashboardDB = async (idUsuario) => {
  try {
    const todasSeries = await SerieModel.find({ idUsuario });

    const getMonthRange = (year, month) => {
      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 1);
      return [start, end];
    };

    const ahora = new Date();
    const [inicioMesActual, finMesActual] = getMonthRange(
      ahora.getFullYear(),
      ahora.getMonth()
    );
    const [inicioMesAnterior, finMesAnterior] = getMonthRange(
      ahora.getFullYear(),
      ahora.getMonth() - 1
    );

    const seriesMesActual = todasSeries.filter((serie) => {
      const fecha = new Date(serie.createdAt);
      return fecha >= inicioMesActual && fecha < finMesActual;
    });

    const conteoPorPlataforma = todasSeries.reduce((acc, serie) => {
      const plataforma = serie.plataforma || "Sin especificar";
      acc[plataforma] = (acc[plataforma] || 0) + 1;
      return acc;
    }, {});

    const seriesMesAnterior = todasSeries.filter((serie) => {
      const fecha = new Date(serie.createdAt);
      return fecha >= inicioMesAnterior && fecha < finMesAnterior;
    });

    const totalSeries = todasSeries.length;
    const totalUltimoMes = seriesMesActual.length;

    const promedioPuntaje =
      todasSeries.reduce((acc, s) => acc + (s.puntuacion || 0), 0) /
      (totalSeries || 1);

    const promedioMesAnterior =
      seriesMesAnterior.reduce((acc, s) => acc + (s.puntuacion || 0), 0) /
      (seriesMesAnterior.length || 1);

    const diferenciaPorcentual =
      promedioMesAnterior > 0
        ? ((promedioPuntaje - promedioMesAnterior) / promedioMesAnterior) * 100
        : 0;

    const seriesVolveriaVer = todasSeries.filter(
      (s) => s.volveriaAVer === true
    ).length;

    const porcentajeVolveriaVer =
      totalSeries > 0 ? (seriesVolveriaVer / totalSeries) * 100 : 0;

      const top5SeriesPuntuadas = todasSeries
      .sort((a, b) => (b.puntuacion || 0) - (a.puntuacion || 0))
      .slice(0, 5); 

      const top5Puntuadas = top5SeriesPuntuadas.map(serie => ({
        titulo: serie.titulo,
        puntuacion: serie.puntuacion || 0,
      }));

    return {
      stats: {
        totalSeries,
        totalUltimoMes,
        promedioPuntaje: promedioPuntaje.toFixed(2),
        diferenciaPorcentual: diferenciaPorcentual.toFixed(2),
        porcentajeVolveriaVer: porcentajeVolveriaVer.toFixed(2),
        seriesPorPlataforma: conteoPorPlataforma,
        top5SeriesPuntuadas: top5Puntuadas,
      },
      statusCode: 200,
    };
  } catch (error) {
    console.log(error);
    return {
      error,
      statusCode: 500,
    };
  }
};

module.exports = {
  crearSerieDB,
  obtenerSeriesDB,
  obtenerSeriePorIdDB,
  actualizarSerieDB,
  eliminarSerieDB,
  obtenerEstadisticasDashboardDB,
};
