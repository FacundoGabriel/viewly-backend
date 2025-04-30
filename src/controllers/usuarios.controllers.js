const UsuariosModel = require("../model/usuarios.model")
const { registrarUsuarioDB, iniciarSesionUsuarioDB, obtenerPerfilUsuarioDB } = require("../services/usuarios.services")

const registrarUsuario = async(req, res)=>{
    const { msg, statusCode, error } = await registrarUsuarioDB(req.body)
    try {
        res.status(statusCode).json({msg})
    } catch {
        res.status(statusCode).json({error})
    }
}

const iniciarSesionUsuario = async(req, res)=>{
    const { msg, statusCode, error, token } = await iniciarSesionUsuarioDB(req.body)
    try {
        res.status(statusCode).json({msg, token})
    } catch {
        res.status(statusCode).json({error})
    }
}

const obtenerPerfilUsuario = async(req, res)=>{ 
    
    const { usuario, statusCode, error} = await obtenerPerfilUsuarioDB(req.idUsuario)
    try {
        res.status(statusCode).json({usuario})
    } catch {
        res.status(statusCode).json({error})
    }
}

module.exports = {
    registrarUsuario,
    iniciarSesionUsuario,
    obtenerPerfilUsuario
}