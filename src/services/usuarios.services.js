const UsuariosModel = require("../model/usuarios.model");
const argon = require("argon2");
const jwt = require("jsonwebtoken");
const {
  confirmarCuenta,
  enviarEmailResetPassword,
} = require("../utils/message.utils");

const registrarUsuarioDB = async (body) => {
  try {
    const { emailUsuario, nombreUsuario } = body;

    if (body.contrasenia !== body.repetirContrasenia) {
      return {
        msg: "Las contraseñas no coinciden.",
        statusCode: 400,
      };
    }

    const usuarioExiste = await UsuariosModel.findOne({
      emailUsuario: body.emailUsuario,
    });

    if (usuarioExiste) {
      return {
        msg: "Usuario ya registrado.",
        statusCode: 409,
      };
    }

    const hashedPassword = await argon.hash(body.contrasenia);
    delete body.repetirContrasenia;

    const nuevoUsuario = new UsuariosModel({
      ...body,
      contrasenia: hashedPassword,
    });

    await nuevoUsuario.save();

    confirmarCuenta({
      emailUsuario,
      nombreUsuario,
      token: nuevoUsuario.tokenHabilitar,
    });

    return {
      msg: "Usuario creado correctamente",
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

const iniciarSesionUsuarioDB = async (body) => {
  try {
    const usuarioExiste = await UsuariosModel.findOne({
      emailUsuario: body.emailUsuario,
    });

    if (!usuarioExiste) {
      return {
        msg: "ERROR. El usuario y/o contraseña incorrectas.",
        statusCode: 401,
      };
    }

    if (!usuarioExiste.estado) {
      return {
        msg: "ERROR. Su cuenta está deshabilitada",
        statusCode: 403,
      };
    }

    const verificarContrasenia = await argon.verify(
      usuarioExiste.contrasenia,
      body.contrasenia
    );

    if (verificarContrasenia) {
      const payload = {
        idUsuario: usuarioExiste._id,
        rolUsuario: usuarioExiste.rol,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET);

      return {
        msg: "Usuario logueado correctamente",
        token,
        statusCode: 200,
      };
    } else {
      return {
        msg: "ERROR. El usuario y/o contraseña incorrectas.",
        statusCode: 401,
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

const obtenerPerfilUsuarioDB = async (idUsuario) => {
  try {
    const usuario =
      await UsuariosModel.findById(idUsuario).select("-contrasenia");

    if (!usuario) {
      return {
        msg: "Usuario no encontrado",
        statusCode: 404,
      };
    }

    return {
      usuario,
      statusCode: 200,
    };
  } catch (error) {
    return {
      error,
      statusCode: 500,
    };
  }
};

const habilitarCuentaDB = async (tokenHabilitar) => {
  try {
    const usuario = await UsuariosModel.findOne({ tokenHabilitar });

    if (!usuario) {
      return {
        msg: "Token inválido o usuario no encontrado.",
        statusCode: 404,
      };
    }

    if (usuario.estado) {
      return {
        msg: "La cuenta ya fue habilitada.",
        statusCode: 400,
      };
    }

    usuario.estado = true;
    usuario.tokenHabilitar = null;
    await usuario.save();

    return {
      msg: "Cuenta habilitada correctamente.",
      statusCode: 200,
    };
  } catch (error) {
    return {
      error,
      statusCode: 500,
    };
  }
};

const solicitarResetPasswordDB = async ({ emailUsuario }) => {
  try {
    const usuario = await UsuariosModel.findOne({ emailUsuario });

    if (!usuario) {
      return {
        msg: "No existe un usuario con ese correo.",
        statusCode: 404,
      };
    }

    const token = jwt.sign(
      { idUsuario: usuario._id },
      process.env.JWT_SECRET,
      { expiresIn: '30m' }
    );


    await enviarEmailResetPassword({
      emailUsuario,
      nombreUsuario: usuario.nombreUsuario,
      token,
    });

    return {
      msg: "Se enviaron las instrucciones al correo.",
      statusCode: 200,
    };
  } catch (error) {
    return {
      error,
      statusCode: 500,
    };
  }
};

const resetearPasswordDB = async (token, { nuevaContrasenia }) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await UsuariosModel.findById(decoded.idUsuario);

    if (!usuario) {
      return {
        msg: "Token inválido o usuario no encontrado.",
        statusCode: 404,
      };
    }

    const hashedPassword = await argon.hash(nuevaContrasenia);
    usuario.contrasenia = hashedPassword;

    await usuario.save();

    return {
      msg: "Contraseña actualizada correctamente.",
      statusCode: 200,
    };
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return {
        msg: "El token ha expirado. Por favor solicita uno nuevo.",
        statusCode: 401,
      };
    }
  
    if (error.name === 'JsonWebTokenError') {
      return {
        msg: "Token inválido.",
        statusCode: 400,
      };
    }
  
    console.log(error);
    return {
      error,
      statusCode: 500,
    };
  }
};

module.exports = {
  registrarUsuarioDB,
  iniciarSesionUsuarioDB,
  obtenerPerfilUsuarioDB,
  habilitarCuentaDB,
  solicitarResetPasswordDB,
  resetearPasswordDB,
};
