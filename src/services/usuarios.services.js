const UsuariosModel = require("../model/usuarios.model");
const argon = require("argon2");
const jwt = require('jsonwebtoken')


const registrarUsuarioDB = async (body) => {
  try {
    const usuarioExiste = await UsuariosModel.findOne({
      emailUsuario: body.emailUsuario,
    });

    if (usuarioExiste) {
      return {
        msg: "Usuario ya registrado.",
        statusCode: 409,
      };
    }

    const nuevoUsuario = new UsuariosModel(body);
    nuevoUsuario.contrasenia = await argon.hash(body.contrasenia);

    await nuevoUsuario.save();

    return {
      msg: "Usuario creado correctamente",
      statusCode: 201,
    };
  } catch (error) {
    return {
      error,
      statusCode: 201,
    };
  }
};

const iniciarSesionUsuarioDB = async (body) => {
  try {
    const usuarioExiste = await UsuariosModel.findOne({
      nombreUsuario: body.nombreUsuario,
    });
    if (!usuarioExiste) {
      return {
        msg: "ERROR. El usuario y/o contraseña incorrectas. USUARIO",
        statusCode: 409,
      };
    }

    const verificarContrasenia = await argon.verify(
      usuarioExiste.contrasenia,
      body.contrasenia
    );

    if (verificarContrasenia) {
      const payload = {
        idUsuario: usuarioExiste._id,
        rolUsuario: usuarioExiste.rol
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET);

      return {
        msg: "Usuario logueado correctamente",
        token,
        statusCode: 200,
      };
    } else {
      return {
        msg: "ERROR. El usuario y/o contraseña incorrectas. CONTRASEÑA",
        statusCode: 409,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      error,
      statusCode: 500,
    };
  }
};

const obtenerPerfilUsuarioDB = async(idUsuario)=>{
  try {
    const usuario = await UsuariosModel.findById(idUsuario).select('-contrasenia')

    if (!usuario) {
      return{
        msg: 'Usuario no encontrado',
        statusCode: 404
      }
  }

  return{
    usuario,
    statusCode: 200
  }

} catch (error) {
  return{
    error,
    statusCode: 500
  }

}
};

module.exports = {
  registrarUsuarioDB,
  iniciarSesionUsuarioDB,
  obtenerPerfilUsuarioDB
};
