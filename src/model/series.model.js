const { Schema, model } = require('mongoose');

const SerieSchema = new Schema({
  titulo: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100,
    minLength: 1,
  },
  plataforma: {
    type: String,
    required: true,
    trim: true,
    enum: ['Netflix', 'Prime Video', 'HBO Max', 'Disney+', 'Crunchyroll', 'Star+', 'Apple TV+', 'Paramount+']
  },
  reseña: {
    type: String,
    trim: true,
    maxLength: 1000,
    default: ''
  },
  puntuacion: {
    type: Number,
    min: 1,
    max: 10,
    required: true
  },
  tipo: {
    type: String,
    enum: ['serie', 'pelicula'],
    default: 'serie'
  },
  volveriaAVer: {
    type: Boolean,
    default: false
  },
  idUsuario: {
    type: Schema.Types.ObjectId,
    ref: 'usuarios',
    required: true
  }
}, {
  timestamps: true
});

const SerieModel = model('series', SerieSchema);

module.exports = SerieModel;