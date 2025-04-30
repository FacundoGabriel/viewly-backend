const jwt = require('jsonwebtoken')

module.exports = (rolRuta) => (req, res, next)=>{
    const token = req.header('auth')

    try {
        const verificarToken = jwt.verify(token, process.env.JWT_SECRET)

        if(!verificarToken){
            res.status(401).json({msg: 'Token no existe'})
        }
    
        if(verificarToken.rolUsuario === rolRuta || rolRuta.includes(verificarToken.rolUsuario)){
            req.idUsuario = verificarToken.idUsuario
            next()
        }else{
            res.status(401).json('No estás autorizado para esta acción')
        }
    } catch (error) {
        return res.status(401).json({ msg: 'Token inválido o expirado' });
    }
}