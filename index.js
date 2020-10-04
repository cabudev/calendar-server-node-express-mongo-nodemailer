const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./database/config');


//Crea el servidor de express
const app = express();

//Conecta a la base de datos
dbConnection();

//cors
app.use(cors());

//directorio publico
app.use(express.static('public'));

//lee y parsea el JSON
app.use(express.json());

//Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

//Escuchar peticiones
app.listen(process.env.PORT, () => {
    console.log(`Servidor escuchando en puerto ${process.env.PORT}`);
});