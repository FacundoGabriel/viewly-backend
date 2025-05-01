require('./db/config.db')
require('dotenv').config(); 
const express = require('express')
const app = express()
const cors = require('cors');

app.use(cors({
    origin: process.env.URL_FRONTEND || 'http://localhost:5173'
}));

app.use(express.json())

app.use('/api/usuarios', require('./routes/usuarios.routes'))
app.use('/api/series', require('./routes/series.routes'))


app.listen(process.env.PORT || 4000, ()=> {
    console.log('servidor prendido en el puerto: ', process.env.PORT || 4000)
})

