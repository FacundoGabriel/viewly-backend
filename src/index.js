const express = require('express')
const app = express()

  
app.use(express.json())

app.use('/api/usuarios', require('../src/routes/usuarios.routes'))
    
app.listen(process.env.PORT || 4000, ()=> {
    console.log('servidor prendido en el puerto: ', process.env.PORT || 4000)
})

