const { Schema, model } = require('mongoose')

const UsuariosSchema = new Schema({
    nombreUsuario: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        lowerCase: true,
        maxLength: 30,
        minLength: 3
    },
    emailUsuario: {
        type: String,
        match: [/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,"Formato de email incorrecto"],
        unique: true
    },
    contrasenia: {
        type: String,
        minLength: [8, 'Limite minimo 8 caracteres']
    },
    rol: {
        type: String,
        enum: ['usuario', 'admin'],
        default: 'usuario'
    },
    plan:{
        type: String,
        enum: ['free', 'basic', 'premium'],
        default: 'free'
    }
})

const UsuariosModel = model('usuarios', UsuariosSchema)

module.exports = UsuariosModel